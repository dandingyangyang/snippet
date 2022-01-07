/*
 * @Description: 
 * @Author: yangxia
 * @Date: 2021-12-31 15:21:13
 */
/* eslint-disable */
/*
 * @Descripttion:
 * @Author: yangxia
 * @Date: 2021-05-24 17:01:40
 */

// ************ base log sdk 代码 start *****************
const STACK_MAX = 5; // 最多5条打包一起发
const DEBOUNCE_TIME = 50; // 50ms发送一次
const perfStack = [];
const traceStack = [];
let config = { env: 'development', bizName: 'frontend.ad.dsp' }; // 默认development环境
const getPerfHost = function() {
    return config.env === 'production'
        ? 'https://www.aa.com'
        : 'https://www.bbb.com';
};
const getTraceHost = function() {
    return config.env === 'production'
    ? 'https://www.aa.com'
    : 'https://www.bbb.com';
};
const getTraceUrl = function() {
    return `${getTraceHost()}/rest/logDispatch/h5/batchTraceLog`;
};
const getPerfUrl = function() {
    return `${getPerfHost()}/rest/perf`;
};
const request = function(url, stack) {
    const request = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(stack),
    };
    fetch(url, request);
    stack.splice(0, stack.length);
};
const waiter = function(fn, delay) {
    let timer = null;
    return function() {
        const args = [];
        for (let _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer !== null) return;
        timer = setTimeout(function() {
            fn.apply(void 0, args);
            timer = null;
        }, delay);
    };
};
const splitSend = function(url, stack) {
    if (stack.length > STACK_MAX) {
        // 超过STACK_MAX条就分成几个请求;
        const loopNum = Math.ceil(stack.length / STACK_MAX);
        for (let i = 0; i < loopNum; i++) {
            request(url, stack.splice(0, 5));
        }
    } else {
        request(url, stack);
    }
};
const debounceSendPerf = waiter(function() {
    splitSend(getPerfUrl(), perfStack);
}, DEBOUNCE_TIME);
const debounceSendTrace = waiter(function() {
    splitSend(getTraceUrl(), traceStack);
}, DEBOUNCE_TIME);
const init = function(params) {
    try {
        const { env } = params;
        const { bizName } = params;
        const { logType } = params;
        if (env === 'production' || env === 'development') {
            config.env = env;
        }
        if (bizName) {
            config.bizName = bizName;
        } else {
            throw new Error('初始化必须要填bizName参数');
        }
        if (logType) {
            config.logType = logType;
        }
        console.log('adBaseLog init success:', config);
    } catch (e) {
        console.error('init error', e);
    }
};
const perf = function(e) {
    try {
        if (!config.bizName) {
            throw new Error('必须初始化bizName字段');
        }
        const newE = { namespace: config.bizName, ...e };
        perfStack.push(newE);
        debounceSendPerf();
    } catch (e) {
        console.error('perf error', e);
    }
};

// ************ base log sdk 代码 end *****************

// ************ sw 代码 start *****************
const heartDetection = {};
const CHECK_HEALTH_TIME = 3000;
const CHECK_CRASH_TIME = 5000;
const convertId = -8;
const registerIds = [];
const unregisterIds = [];
function transToFormData(data) {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formData.append(key, JSON.stringify(data[key]));
        }
    }
    return formData;
}

const urls = {
    // 当前暂时两个环境url一致，之后可能不一致
    development: '/rest/dsp/action/log/v2',
    production: '/rest/dsp/action/log/v2',
};

function isReportURL(url) {
    return url.includes(urls.development) || url.includes(urls.production);
}
/**
 * @param  {Object} client
 * @param  {Object} msg
 * 给对应的client发送消息
 */
function sendMessageToClient(client, msg) {
    client.postMessage(msg);
}

function reportCrash(page) {
    console.log('reportCrash=====', page);

    // 只有页面处于前台才上报
    if (page.visibilityState === 'visible') {
        perf({
            subtag: 'crashReport',
            extra1: page.sourceDomain,
            extra2: page.path,
            extra3: `${page.deviceInfo?.osName}_${page.deviceInfo?.browserType}_${page.deviceInfo?.browserVersions}`,
        });
    }
}

/**
 * @param  {String} id
 * 清理心跳定时器并从map中移除
 */
function removeCheck(id) {
    if (heartDetection[id]) {
        heartDetection[id].timer && clearInterval(heartDetection[id].timer);
        heartDetection[id].crashTimer && clearTimeout(heartDetection[id].crashTimer);
        delete heartDetection[id];
    }
}

function checkTurelyCrash(id, count = 0) {
    const pageItem = heartDetection[id];
    // 防止重复进入检测，如果是第一次进入且timer不为空
    if (count === 0 && pageItem.crashTimer) {
        return;
    }
    // 7s后检查现在的健康状态，如果仍为非健康状态，上报崩溃
    pageItem.crashTimer = setTimeout(function() {
        if (pageItem && pageItem.flag !== 'healthy') {
            // 当前崩溃页面为激活状态，上报崩溃，否则继续检查
            if (count >= 2) {
                removeCheck(id);
                if (pageItem.heartbeatCount > 2) {
                    // 执行过2次以上心跳（认为心跳机制正常连接了）才发送崩溃信息。
                    reportCrash(pageItem);
                }
            } else {
                checkTurelyCrash(id, ++count);
            }
        }
    }, CHECK_CRASH_TIME);
}
/**
 * @param  {String} id
 * 给根据 id 给主页面发送心跳包并检测是否存活
 * 下一个心跳包发送的的时候，上一个还没回来，则认为页面卡死
 */
function checkHealth(id) {
    const pageItem = heartDetection[id];
    if (pageItem) {
        if (pageItem.flag === 'healthy') {
            //   前一次为无响应，则表示无响应恢复，上报无响应时间
            if (pageItem.upresponsive === true) {
                if (pageItem.crashTimer) {
                    clearTimeout(pageItem.crashTimer);
                    // 需要重置crashTimer，否则 checkTurelyCrash 函数中判断会有问题
                    pageItem.crashTimer = 0;
                }
            }
            pageItem.upresponsive = false;
            delete pageItem.unresponsiveTime;
        } else {
            // 未收到健康心跳回报
            // 如果页面之前状态不为无响应，则标示为第一次检测到无响应
            if (pageItem.upresponsive !== true) {
                pageItem.upresponsive = true;
                pageItem.unresponsiveTime = Date.now();
                checkTurelyCrash(id);
            }
        }
        // 设置成不健康，下次定时器的时候检查
        pageItem.flag = 'unhealthy';
        sendMessageToClient(pageItem.client, { type: 'checkHealth' });
    }
}
self.addEventListener('message', function(event) {
    const sourceId = event.source.id;
    const { data } = event;
    switch (data.type) {
        // 页面新来的时候注册
        case 'register':
            if (unregisterIds.includes(sourceId)) {
                // 已经unregister不应该注册，直接return ，再执行一次removeCheck
                unregisterIds.splice(unregisterIds.indexOf(sourceId), 1);
                registerIds.splice(registerIds.indexOf(sourceId), 1);
                removeCheck(sourceId);
            } else {
                registerIds.push(sourceId);
                // 根据id拿到对应的页面
                self.clients
                    .get(sourceId)
                    .then(function(client) {
                        config.env = data.env;
                        init(config);
                        heartDetection[sourceId] = {
                            client,
                            timer: setInterval(function() {
                                checkHealth(sourceId);
                            }, CHECK_HEALTH_TIME),
                            flag: 'healthy',
                            registerTime: Date.now(),
                            visibilityState: client && client.visibilityState,
                            userAgent: self.userAgent,
                            env: data.env,
                            product: data.product,
                            sourceDomain: event.origin,
                            heartbeatCount: 0,
                            path: data.path,
                            deviceInfo: data.deviceInfo,
                        };
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
            break;
        // 页面关闭的时候会删除有关信息
        case 'unregister':
            removeCheck(sourceId);
            break;
        case 'keepHealth':
            const page = heartDetection[sourceId];
            if (page) {
                page.flag = 'healthy';
                page.heartbeatCount = (page.heartbeatCount || 0) + 1;
                if (page.path !== data.pathName) {
                    page.path = data.pathName;
                }
                self.clients.get(sourceId).then(function(client) {
                    page.client = client;
                    page.visibilityState = client.visibilityState;
                });
            }
            break;
        case 'visibilityChange':
            const pageItem = heartDetection[sourceId];
            if (pageItem) {
                pageItem.visibilityState = data.state;
            }
            break;
        case 'updatePathName':
            if (heartDetection[sourceId] && heartDetection[sourceId].path !== data.pathName) {
                heartDetection[sourceId].path = data.pathName;
            }
            break;
        default:
            break;
    }
});
self.addEventListener('fetch', function(event) {
    const sourceId = event.clientId;
    const client = heartDetection[sourceId];
    if (isReportURL(event.request.url) && client) {
        event.request
            .json()
            .then(function(data) {
                const { userId } = data;
                const { accountId } = data;
                if ((userId && userId !== client.userId) || (accountId && accountId !== client.accountId)) {
                    client.userId = userId;
                    client.accountId = accountId;
                    client.agentUserId = data.agentUserId;
                    client.adminUserId = data.adminUserId;
                    client.primaryIndustryId = data.primaryIndustryId;
                    client.primaryIndustryName = data.primaryIndustryName;
                    client.secondaryIndustryId = data.secondaryIndustryId;
                    client.secondaryIndustryName = data.secondaryIndustryName;
                    client.whiteList = data.whiteList;
                    client.sessionId = data.sessionId;
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
});
self.addEventListener('install', (event) => {
    console.log('install=====');
    // 如果有变化，强制替代为新的sw
    self.skipWaiting();
});
self.addEventListener('activate', (event) => {
    console.log('activate=====');
    self.clients.claim();
});

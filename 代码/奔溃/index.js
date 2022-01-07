/*
 * @Description: 
 * @Author: yangxia
 * @Date: 2021-12-31 15:24:26
 */
import { isProduction } from 'src/utility/env';
import { getDeviceInfo } from '@dsp/common/lib/utils';

let instance = null;
function sendMessageToSw(msg) {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(msg);
    } else if (instance?.active?.postMessage && instance.active.postMessage instanceof Function) {
        instance.active.postMessage(msg);
    }
}
function tryToRegister() {
    sendMessageToSw({
        type: 'register',
        env: isProduction ? 'production' : 'development',
        product: 'kuaishou.dsp',
        path: window.location.pathname,
        deviceInfo: getDeviceInfo(),
    });
}
export function startSW() {
    // Check that service workers are supported
    if ('serviceWorker' in navigator && navigator.serviceWorker instanceof Object) {
        // Use the window load event to keep the page load performant
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(function (registration) {
                if (
                    registration.active &&
                    registration.active.state === 'activated' &&
                    navigator.serviceWorker.controller
                ) {
                    tryToRegister();
                } else {
                    navigator.serviceWorker.ready.then(function (swRegistration) {
                        instance = swRegistration;
                        swRegistration.active.postMessage({
                            type: 'register',
                            env: isProduction ? 'production' : 'development',
                            product: 'kuaishou.dsp',
                            path: window.location.pathname,
                            deviceInfo: getDeviceInfo(),
                        });
                    });
                }
            });
        });

        // get heart message
        navigator.serviceWorker.addEventListener('message', function (event) {
            if (event.data.type === 'checkHealth') {
                sendMessageToSw({ type: 'keepHealth', pathName: window.location.pathname });
            }
        });

        // send message before unload
        window.addEventListener('beforeunload', function (event) {
            sendMessageToSw({
                type: 'unregister',
            });
        });
        document.addEventListener('visibilitychange', function () {
            // page visibility Change
            if (document.visibilityState === 'hidden' || document.visibilityState === 'visible') {
                sendMessageToSw({
                    type: 'visibilityChange',
                    state: document.visibilityState,
                });
            }
        });
    }
}

/**
 * 更新崩溃上报service worker中记录的路由
 * @param pathName default location.pathname
 */
export function updateCrashPathNameRecord(pathName = window.location.pathname) {
    if ('serviceWorker' in navigator && navigator.serviceWorker instanceof Object) {
        sendMessageToSw({
            type: 'updatePathName',
            pathName,
        });
    }
}

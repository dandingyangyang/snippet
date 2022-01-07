/**
 * github 地址： https://github.com/CyC2018/CS-Notes/blob/master/notes/Leetcode%20%E9%A2%98%E8%A7%A3%20-%20%E7%9B%AE%E5%BD%95.md
 */

/**
 * 
 * https://codetop.cc/home
 */

// 一. 排序算法:从小到大排序

/** 1. 冒泡排序
 * 思路：每次选择当前可比较的数中最大的一个放在最后面，比较相邻位置元素，将队尾的数字先排好
 * 稳定性：稳定
 * @param {*} arr 
 */
 function bubble(arr) {
    const length = arr.length;
    for(let round = 0; round < length - 1; round++) {
        for(let current = 0; current < length - 1 - round; current++) {
            if(arr[current] > arr[current + 1]) {
                let temp = arr[current + 1];
                arr[current + 1] = arr[current];
                arr[current] = temp;
            }
        }
    }
    return arr;
}

/** 2. 选择排序
 * 思路：固定位置，找出当前位置应该放的元素，将队首元素先排好
 * 稳定性：不稳定 如：58529
 * @param {*} arr 
 */
function choose(arr) {
    const length = arr.length;
    for(let round = 0; round < length - 1; round++) {
        for(let current = round + 1; current < length; current++) {
            if(arr[round] > arr[current]) {
                let temp = arr[current];
                arr[current] = arr[round];
                arr[round] = temp;
            }
        }
    }
    return arr;
}

/** 3. 插入排序
 * 思路：保证队列前面内是有序的，每增加一个数据，将新数据和有序队列的队尾最后一个数据比较，若交换位置后，继续和前一个比较，直到找到自己的位置
 * 稳定性：稳定
 * @param {*} arr 
 */
function insert(arr) {
    for(let i = 1; i < arr.length; i++) {
        let j = i;
        let value = arr[i];
        while(j > 0 && arr[j - 1] > value) {
            arr[j] = arr[j - 1];
            j--;
        }
        arr[j] = value;
    }
    return arr;
}

// 下面是自己写的，和上面的区别在于上面的算法少一些赋值操作：上面的算法中对于被比较的对象，只在最后一次赋值
function insert(arr) {
    for(let i = 1; i < arr.length; i++) {
        let position = i;
        while(position > 0 && arr[position] < arr[position - 1]) {
            const temp = arr[position];
            arr[position] = arr[position - 1];
            arr[position - 1] = temp;
            position--;
        }
    }
    return arr;
}

/** 4. 归并排序
 * 稳定性： 稳定
 * @param {*} arr 
 */
function mergeSort(arr) {
    const length = arr.length;
    if(length <= 1) return arr;
    const mid = Math.floor(length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    while(left.length && right.length) {
        if(left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    return result.concat(left, right);
}

/** 5.快排
 * 稳定性：不稳定
 * @param {*} arr 
 */
function quickSort(arr) {
    const length = arr.length;
    if(length <= 1) return arr;
    const mid = Math.floor(length / 2);
    // 每次要摘一个出来，否则当最后只有[5,6,4]这种midValue是最大值的时候回出现死循环，每次拆完之后还是整个数组
    const midValue = arr.splice(mid, 1)[0];
    let left = [];
    let right = [];
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] > midValue) {
            right.push(arr[i]);
        } else {
            left.push(arr[i]);
        }
    }
    return quickSort(left)
        .concat([midValue])
        .concat(quickSort(right));
}
 
/** 6. 堆排序
 * 构建堆的时候从下往上调整
 * 调整堆的时候从上往下调整
 * 从小到大排序，构建大顶堆
 * 不稳定
 * @param {*} elements 
 */
function heapSort(elements) {
    buildHeap(elements); // 构建堆
    changeHeap(elements); // 调整堆
}

function buildHeap(elements) {
    for (let i = Math.ceil(elements.length / 2); i >= 0; i--) {
        headAjust(elements, i, elements.length);
    }
}

function changeHeap(elements) {
    for(let i = elements.length - 1; i > 0; i--) {
        let swap = elements[i];
        elements[i] = elements[0];
        elements[0] = swap;
        headAjust(elements, 0, i);
    }
}

function headAjust(elements, pos, len) {
    let leftChildPosition = pos * 2 + 1;
    let rightChildPosition = pos * 2 + 2;
    let maxChildPosition = leftChildPosition;
    if (leftChildPosition >= len) {
        return;
    }
    if (rightChildPosition < len && elements[leftChildPosition] < elements[rightChildPosition]) {
        maxChildPosition = rightChildPosition;
    }
    if(elements[pos] < elements[maxChildPosition]) {
        const temp = elements[pos];
        elements[pos] = elements[maxChildPosition];
        elements[maxChildPosition] = temp;
        headAjust(elements, maxChildPosition, len);
    }
}
// 二. 七大查找算法

/**
 * 1. 二分查找
 */
function binarySearch(arr, target) {
    var end = arr.length - 1;
    var start = 0;
    // 【注意】这里要包含等于，否则binarySearch([3,5], 5)就会返回-1
    while (start <= end) {
        var mid = Math.floor((end + start) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return -1;
}

/**
 * m 计算
有两种计算中值 m 的方式：
m = (l + h) / 2
m = l + (h - l) / 2
l + h 可能出现加法溢出，也就是说加法的结果大于整型能够表示的范围。但是 l 和 h 都为正数，因此 h - l 不会出现加法溢出问题。所以，最好使用第二种计算法方法。

还有几种
(low + high) >> 1
let mid = Math.trunc((e + s) / 2)
// Math.trunc() 的执行逻辑很简单，仅仅是删除掉数字的小数部分和小数点，不管参数是正数还是负数。
*/


// 三.1 数组去重
// 数字，字符串，bool，undefined，NaN，null，{}
var arr = [1, 1, 'true', 'true', true, true, 15, 15, false, false, undefined, undefined, null, null, NaN, NaN, 'NaN', 0, 0, 'a', 'a', {}, {}];

/**
 * 1.1 利用ES6 Set
 * 缺点：无法去重空对象{}
 */
function duplicate1(arr) {
    return Array.from(new Set(arr))
}
// 1.2
function duplicate11() {
    return [...new Set(arr)];
}


/** 
 * 2. 利用indexOf将数组内容放进另一个数组里
 * 确定：{} 和 NaN 无法去重，因为{} !== {}, NaN !== NaN
 * 
 * 使用indexOf的地方都可以使用includes。区别：indexOf对{}和NaN都无法去重。includes可以对NaN去重，但是无法对{}去重
 */
function depulicate3(arr) {
    const otherArr = [];
    arr.forEach((item) => {
        if (!~otherArr.indexOf(item)) {
            otherArr.push(item)
        }
    });
    return otherArr;
}

/**
 * 3.1 利用对象的属性不能相同的特点进行去重:这种方式有问题，不建议使用。
 * 对象的key都是字符串，1 和 '1'会被认为是同一个数据。'true' 和 true 也是会被认为是同一个数据
 */
 function depulicate5(arr) {
    if (!Array.isArray(arr)) {
        console.error('need array');
        return;
    }
    let otherArr = []
    let obj = {};
    arr.forEach((item) => {
        if(!obj[item]) {
            otherArr.push(item);
            obj[item] = 1;
        } else {
            obj[item]++;
        }
    });
    return otherArr;
 }
 /**
 * 3.2 利用map。思路和利用对象的属性类似，但是map的key可以不是字符串，所以比利用object要好些
 * 对象的key都是字符串，1 和 '1'会被认为是同一个数据。'true' 和 true 也是会被认为是同一个数据
 */
function depulicate5(arr) {
    if (!Array.isArray(arr)) {
        console.error('need array');
        return;
    }
    let otherArr = []
    let map = new Map();
    arr.forEach((item) => {
        if(!map.has(item)) {
            otherArr.push(item);
            map.set(item, true)
        }
    });
    return otherArr;
 }

/** 
 * 4. 利用sort先排序，再通过一层循环两两相邻的比较
 * 确定：{} 和 NaN 无法去重，因为{} !== {}, NaN !== NaN
 */
function depulicate4(arr) {
    if (!Array.isArray(arr)) {
        console.error('need array');
        return;
    }
    const sortedArr = arr.slice().sort();
    for(let i = 0; i < sortedArr.length - 1; i++) {
        if (sortedArr[i] === sortedArr[i + 1]) {
            sortedArr.splice(i + 1, 1);
        }
    }
    return sortedArr;
}

 /**
 * 5. 不排序的情况下利用双重循环和splice去重
 * 确定：{} 和 NaN 无法去重，因为{} !== {}, NaN !== NaN
 */

function depulicate2(arr) {
    const copy = arr.slice();
    for (var i = 0; i < copy.length; i++) {
        for (var j = i + 1; j < copy.length; j++) {
            if (copy[i] === copy[j]) {
                copy.splice(j, 1);
                j--;
            }
        }
    }
    return copy;
}

// 三.2 数组扁平化

// (1)reduce
// 【注意】pre.concat 不会改变pre，所以直接return出去，就不用pre = pre.concat([xxx])了
function flatten1(arr) {
    return arr.reduce((pre, item) => {
        // 注意concat不会改变原数据
        return pre.concat(Array.isArray(item) ? flatten1(item) : [item]);
    }, []);
}
// (2) 直接用es6的方法
function flatten2(arr) {
    // 参数代表扁平层级
    return arr.flat(Infinity);
}
// (3)使用[].concat(...arr)
function flatten3(arr) {
    return !Array.isArray(arr) ? arr : [].concat.apply([], arr.map(flatten3));
}
// (4) toString 只适用于数组元素都是数字
function flatten4(arr) {
   return arr.toString().split(',').map(item => +item);
}


// 四. 数组Array 相关习题

/**
 * 思路：先看看sort之后会不会有帮助，然后想想双指针，再想想栈
 */

//  洗牌算法:把牌弄乱
function shuffle1(arr) {
    return arr.sort((a, b) => {
        // 【注意】：这里不能用Math.random() > 0.5,不能返回boolean，要返回数字
        return Math.random() - 0.5;
    })
}
function shuffle2(arr) {
    let n = arr.length;
    let result = [];
    while(n) {
        // 【注意】0 <= Math.random() < 1
        let index = Math.floor(Math.random() * n);
        n--;
        //【注意】concat不会改变原数组
        result = result.concat(arr.splice(index, 1));
    }
    return result;
}

/** 
 * 求两个数之和为特定数字 https://leetcode.com/problems/two-sum/
 */
var twoSum = function (nums, target) {
    for (let i = 0; i < nums.length; i++) {
        var otherNum = target - nums[i];
        var index = nums.indexOf(otherNum);
        if (index > -1 && index !== i) {
            return [i, index]
        }
    }
    return []
};
/**
 * 求两个数之和为特定数字: numbers 有序的时候
 * 双指针
 */
var twoSum = function (numbers, target) {
    var i = 0;
    var j = numbers.length - 1;
    while (i<= numbers.length - 1 && j >= 0 && i<j) {
        if (numbers[i] + numbers[j] > target) {
            j--;
        } else if (numbers[i] + numbers[j] < target) {
            i++;
        } else {
            return [i,j];
        }
    }
};

/**  
 * 三个数之和为0: https://leetcode-cn.com/problems/3sum/submissions/
*/
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(number) {
    if(number.length<3){
        return []
    }
    let result = [];
    number.sort((a, b) => {
        return a - b;
    });
    for(let i = 0; i < number.length - 2; i++) {
        if(number[i] > 0) {
            continue;
        }
        if(i > 0 && number[i - 1] === number[i]) {
            continue;
        }
        let j = i + 1;
        let k = number.length - 1;
        while(j < k && j <= number.length - 1 && k > i) {
            if(number[i] + number[j] + number[k] === 0) {
                result.push([number[i], number[j], number[k]]);
                j++;
                k--;
                while(j < k && number[j] === number[j - 1]) {
                    j++;
                }
                while(j < k && number[k] === number[k + 1]) {
                    k--;
                }
            } else if(number[i] + number[j] + number[k] > 0) {
                k--;
            } else {
                j++;
            }
        }
    }
    return result;
}
/**
 * 售卖股票的最佳时机：可以多次售卖 https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/
 */
var maxProfit = function (prices) {
    if (!prices || !prices.length ||prices.length === 1) return 0;
    var sum = 0;
    prices.reduce((pre, item) => {
        item > pre ? sum += item - pre : '';
        return item;
    });
    return sum;
};


// https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/solution/mai-mai-gu-piao-de-zui-jia-shi-ji-iii-by-wrnt/
//  https://leetcode-cn.com/problems/two-sum/solution/suo-you-ti-jie-de-mu-lu-lian-jie-si-wei-ecnoo/

/** 
 * 最佳售卖股票时机：只能一次售卖 https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/
 * （只需要看y轴）
 * [7,1,5,3,6,4] =》 5
 * [7,6,4,3,1] =》 0
 */

/* 【注意】这里总结下数组的一些方法要注意点的：
1. [7,1,5,3,6,4] reduce函数如果传入了第二个参数，就会执行6次，如果不传入第二个参数则只会执行5次
2. unshift/push 这两个是往数组里面添加元素，返回的是数组的长度
3. pop/shift 这两个是将数组内元素拿出来，返回的是拿出来的那个元素值
*/
var maxProfit = function (prices) {
    if (prices.length <= 1) return 0;
    let diff = 0;
    prices.reduce((min, current) => {
        if (min > current) {
            return current;
        } else {
            if (current - min > diff) {
                diff = current - min;
            }
            return min;
        }
    })
    return diff;
};


/** 
 * 最大面积（需要看x轴和y轴） https://leetcode-cn.com/problems/container-with-most-water/
*/
var maxArea = function (height) {
    var max = 0;
    for (var i = 0, j = height.length - 1; i < j;) {
        max = Math.max(max, Math.min(height[i], height[j]) * (j - i));
        if (height[i] < height[j]) {
            i++;
        } else if (height[i] > height[j]) {
            j--;
        } else {
            i++;
            j--;
        }
    }
    return max;
};


/** 
 * 除自身之外的数组乘机 https://leetcode-cn.com/problems/product-of-array-except-self/
*/
var productExceptSelf = function (nums) {
    var prefix = [];
    var postfix = [];
    var base = 1;
    for (var i = 0; i < nums.length; i++) {
        let count = nums[i - 1] !== undefined ? nums[i - 1] : 1;
        prefix.push(base *= count)
    }
    base = 1;
    for (var i = nums.length - 1; i >= 0; i--) {
        let count = nums[i + 1] !== undefined ? nums[i + 1] : 1;
        postfix.unshift((base *= count));
    }
    var result = [];
    for (var i = 0; i < nums.length; i++) {
        result.push(prefix[i] * postfix[i])
    }
    return result;
};

/** 
 * 乘积最大连续子数组(硬算) https://leetcode-cn.com/problems/maximum-product-subarray/
 */
var maxSubProduct = function (arr) {
    if (arr.length < 1) return;
    var max = arr[0];
    for (var i = 0; i < arr.length; i++) {
        var row = [];
        row[i] = arr[i];
        if (max < arr[i]) {
            max = arr[i];
        }
        for (var j = i + 1; j < arr.length; j++) {
            row[j] = row[j - 1] * arr[j];
            if (row[j] > max) {
                max = row[j];
            }
        }
    }
    return max;
}
/**
 * 乘积最大连续子数组(存下最大值和最小值)
 * 思路: 前面的数字能保证有最大乘积和最小乘积，则自己当前数字就能算出最大乘积和最小乘积
 */
var maxSubProduct = function (arr) {
    if (arr.length < 1) return;
    var max = arr[0], min = arr[0], output = arr[0];
    for (var i = 1; i < arr.length; i++) {
        var preMax = max;

        max = Math.max(arr[i], max * arr[i], min * arr[i])
        min = Math.min(arr[i], preMax * arr[i], min * arr[i]);

        output = Math.max(max, output);
    }
    return output;
}

/** 
 * 最大子序列和：https://leetcode-cn.com/problems/maximum-subarray/
*/
var maxSubArraySum = function (nums) {
    if (nums.length < 1) return 0;
    var largeSum = nums[0];
    var lastSum = nums[0];
    for (var i = 1; i < nums.length; i++) {
        lastSum = lastSum > 0 ? (lastSum + nums[i]) : nums[i];
        if (lastSum > largeSum) {
            largeSum = lastSum;
        }
    }
    return largeSum;
}

/**
 * 有序数组从某一个位置翻转，查找目标数字的位置（和二分查找有点像）搜索旋转排序数组：https://leetcode-cn.com/problems/search-in-rotated-sorted-array/
 */
// 写法1
nums = [4, 5, 6, 7, 0, 1, 2], target = 0
var searchInReserse = function (nums, target) {
    var start = 0, end = nums.length;
    return searchIndex(nums, target, start, end);
};
function searchIndex(nums, target, start, end) {
    // if (start >= end - 1) {
    //     if (target === nums[start]) return start;
    //     return -1;
    // }
    var mid = Math.floor(start + (end - start) / 2);
    if(nums[mid] === target) return mid;
    var left = nums.slice(start, mid);
    var right = nums.slice(mid, end);
    // 左边有序
    if (left[0] <= left[left.length - 1]) {
        if (left[0] <= target && target <= left[left.length - 1]) {
            return searchIndex(nums, target, start, mid);
        }
        return searchIndex(nums, target, mid, end);
    }
    // 右边有序
    else if(right[0] <= right[right.length - 1]) {
        if (right[0] <= target && target <= right[right.length - 1]) {
            return searchIndex(nums, target, mid, end);
        }
        return searchIndex(nums, target, start, mid);
    }
    return -1;
}
// 写法2
var search = function(nums, target) {
    let start = 0;
    let end = nums.length - 1;
    while(start <= end) {
        mid = Math.floor((start + end) / 2);
        if (nums[mid] === target) {
            return mid;
        } else if(nums[start] <= nums[mid - 1] && start < mid) {
            // 左边有序
            if (nums[start] <= target && target <= nums[mid - 1]) {
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        } else if (nums[mid + 1] <= nums[end] && mid < end) {
            // 右边有序
            if (nums[mid + 1] <= target && target <= nums[end]) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        } else {
            return -1;
        }
    }
    return -1;
};

/**
 * 移动窗口最大值 https://leetcode-cn.com/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/submissions/
 */
var maxSlidingWindow = function(nums, k) {
    if(k === 0 || nums.length < k) return [];
    let result = [];
    for(let i = 0; i<=nums.length - k; i++) {
        result.push(Math.max.apply(null,nums.slice(i, i+k)))
    }
    return result;
};

/** 
 * 用栈实现括号匹配: https://leetcode-cn.com/problems/valid-parentheses/
*/
var isValid = function (s) {
    var couple = {
        '{': '}',
        '[': ']',
        '(': ')'
    }
    var arr = s.split('');
    var stack = [];
    while (arr.length) {
        if (couple[stack[stack.length - 1]] === arr[0]) {
            stack.pop();
            arr.shift();
        } else {
            stack.push(arr.shift());
        }
    }
    return !stack.length;
};
/**
 * 数组中元素与下一个比它大的元素之间的距离 https://leetcode-cn.com/problems/daily-temperatures/
 */
var dailyTemperatures = function (arr) {
    var result = [];
    for (let i = 0; i < arr.length; i++) {
        var getHigher = false;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] > arr[i]) {
                getHigher = true;
                result[i] = j - i;
                break;
            }
        }
        if (!getHigher) result[i] = 0;
    }
    return result;
};
// 使用单调栈的方法
var dailyTemperatures = function(temperatures) {
    let stack = [];
    let result = [];
    for(let i = 0; i < temperatures.length; i++) {
        if (!stack.length || temperatures[stack[stack.length - 1]] >= temperatures[i]) {
            stack.push(i);
        } else {
            const index = stack.pop();
            result[index] = i - index;
            i--;
        }
    }
    while(stack.length) {
        result[stack.pop()] = 0;
    }
    return result;
};
// 用while代替for（i--可以达到和while一致的效果）
var dailyTemperatures = function(T) {
    let stack = [];
    let result = [];
    for(let i = 0; i < T.length; i++) {
        while(stack.length && T[i] > T[stack[stack.length - 1]]) {
            let current = stack.pop();
            result[current] = i - current;
        }
        stack.push(i);
    }
    while(stack.length) {
        result[stack.pop()] = 0;
    }
    return result;
};

/** 
 * 循环数组中比当前元素大的下一个元素 https://leetcode-cn.com/problems/next-greater-element-ii/
*/
var nextGreaterElements = function (nums) {
    var result = [];
    for (let i = 0; i < nums.length; i++) {
        let j;
        let back;
        if (i === nums.length - 1) {
            j = 0;
            back = true;
        } else {
            j = i + 1;
            back = false;
        }
        // 这个地方巧用了当j为nums.length时，nums[j]是undefined，undefined <= nums[i] 返回false
        while (nums[j] <= nums[i]) {
            j++;
            if (j === nums.length && !back) {
                back = true;
                j = 0;
            }
        }
        if (j !== nums.length) {
            result[i] = nums[j];
        } else {
            result[i] = -1;
        }
    }
    return result;
};

// 用栈
var nextGreaterElements = function(nums) {
    let stack1 = [];
    let result = [];
    for(let i = 0; i < nums.length; i++) {
        if (!stack1.length || nums[stack1[stack1.length - 1]] >= nums[i]) {
            stack1.push(i);
        } else {
            const index = stack1.pop();
            result[index] = nums[i];
            i--;
        }
    }
    let stack1Empty = false;
    for(let j = 0; j < nums.length; j++) {
        if (stack1.length) {
            if (nums[j] > nums[stack1[stack1.length - 1]]) {
                const index = stack1.pop();
                result[index] = nums[j];
                j--;
            }
        } else {
            stack1Empty = true;
            break;
        }
    }
    if (!stack1Empty) {
        for(let i = 0; i < nums.length; i++) {
            result[i] = result[i] ?? -1;
        }
    }
    return result;
    
};

/** 
 * 把数组中的 0 移到末尾 https://leetcode.com/problems/move-zeroes/submissions/
*/
var moveZeroes = function (nums) {
    let zeroCount = 0; // 需要有个值记录当前有几个0.否则会陷入死循环
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === 0 && i < nums.length - zeroCount) {
            zeroCount++;
            nums.push(nums.splice(i, 1)[0]);
            i--;
        }
    }
    return nums;
};
// 从后面开始处理，不要从前面处理
var moveZeroes = function(nums) {
    let n = nums.length - 1;
    while(n--) {
        if (nums[n] === 0) {
            nums.push(nums.splice(n, 1)[0]);
        }
    }
    return nums;
};

/** https://leetcode-cn.com/problems/reshape-the-matrix/
 * 重塑矩阵
 */
var matrixReshape = function (nums, r, c) {
    if (r * c !== nums.length * (nums[0] || []).length) {
        return nums;
    }
    var col = nums[0].length;
    var result = [];
    var current = 0;
    while (current < r * c) {
        if (!(current % c)) {
            result.push([]);
        }
        var arr = result[result.length - 1];
        arr.push(nums[Math.floor(current / col)][current % col]);
        current++;
    }
    return result;
};

/** 
 * 最长连续序列:https://leetcode-cn.com/problems/max-consecutive-ones/
 * 找出数组中最长的连续 1
*/
var findMaxConsecutiveOnes = function (nums) {
    var result = 0;
    nums.split('').replace(/01/g, '0,1').replace(/10/g,'1,0').split(',').forEach((item) => {
        if(item[0] === '1' && item.length > result) {
            result = item.length;
        }
    });
    return result;
};
var findMaxConsecutiveOnes = function (nums) {
    let max = 0, curr = 0;
    for (let k of nums) {
        max = Math.max(max, curr += k);
        if (!k) curr = 0;
    }
    return max;
};
/**
 * 搜索二维矩阵，矩阵有序:https://leetcode-cn.com/problems/search-a-2d-matrix/
 */
var searchMatrix = function (matrix, target) {
    if (!matrix || !matrix.length) return false;
    var rows = matrix.length;
    var cols = (matrix[0] || []).length;
    var row = 0;
    var col = cols - 1;
    while (row >= 0 && col >= 0 && row <= rows - 1 && col <= cols - 1) {
        if (matrix[row][col] === target) {
            return true;
        } else if (matrix[row][col] > target) {
            --col;
        } else {
            ++row;
        }
    }
    return false;
};

/** 
 * 有序矩阵的 Kth Element
 * 这个题看了答案还不会
*/

var arrayNesting = function (nums) {

};

// 五. 链表相关习题
//  思路： 使用多个指针；造一个pre的节点
/**
 * 获取两个链表的相交节点: 注意要判断当前节点是否为null，不要判断 next 节点是否为 null，否则两个链表在没有相交的情况下，会死循环
 */
var getIntersectionNode = function (headA, headB) {
    if (!headA || !headB) return null;
    var curA = headA;
    var curB = headB;
    while (curA != curB) {
        // 注释掉的是判断next是否存在，不存在则把指针指向另一个链表开头。这种方法不行，因为假如两个链表没有相交，那么就会出现无限循环
        //  headA = headA.next != null ? headA.next : pHeadB;
        // headB = headB.next != null ? headB.next : pheadA;
        curA = curA == null ? headB : curA.next;
        curB = curB == null ? headA : curB.next;
    }
    return curA;
};

/** 
 * 链表反转
*/
var reverseList = function (head) {
    if(!head || !head.next) return head;
    var pre, next,current;
    current = head;
    while(current) {
        next = current.next;
        current.next = pre;
        pre = current;
        current = next;
    }
    return pre;
};

/** 
 * 合并两个有序链表
 */
function Merge(pHead1, pHead2) {
    if (!pHead1) return pHead2;
    if (!pHead2) return pHead1;
    var current, staticHead;
    if (pHead1.val < pHead2.val) {
        staticHead = current = pHead1;
        pHead1 = pHead1.next;
    } else {
        staticHead = current = pHead2;
        pHead2 = pHead2.next;
    }
    while (pHead1 && pHead2) {
        if (pHead1.val < pHead2.val) {
            current.next = pHead1;
            pHead1 = pHead1.next;
        } else {
            current.next = pHead2;
            pHead2 = pHead2.next;
        }
        current = current.next;
    }
    if (!pHead1) {
        current.next = pHead2;
    }
    if (!pHead2) {
        current.next = pHead1;
    }
    return staticHead
}

/**
 * 判断链表中是否有环
 */

function hasCycle(head) {
    if(!head) return false;
    let fast = head;
    let slow = head;
    while(fast && fast.next && slow) {
        fast = fast.next.next;
        slow = slow.next;
        if(fast == slow) {
            return true;
        }
    }
    return false;
}

var hasCycle = function(head) {
    if(!head || !head.next) return false;
    let slow = head;
    let fast = head.next;
    while(fast && fast.next && fast !== slow) {
        fast = fast.next.next;
        slow = slow.next;
    }
    return fast === slow;
};

/** 
 * 寻找链表中环的入口节点
*/
function EntryNodeOfLoop(phead) {
    if(!phead) return phead;
    var fast = slow = phead;
    while(fast && fast.next && slow) {
        fast = fast.next.next;
        slow = slow.next;
        if(fast === slow) {
            fast = phead;
            while (fast !== slow && fast && slow) {
                fast = fast.next;
                slow = slow.next;
            }
            return slow;
        }
    }
    return null;
}

/** 
 * 删除链表倒数指定位置节点  https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/
 * （1）一个指针走完一遍之后从头开始走
 * 注意边界条件和代码执行顺序问题
 */ 
var removeNthFromEnd = function (head, n) {
    if (!head) return head;
    var phead = head;
    var length = 0;
    while (head) {
        length++;
        head = head.next;
    }
    head = phead;
    var count = length - n;
    if(count === 0) {
        return head.next;
    }
    var current = 0;
    while (head && head.next) {
        current++;
        if (count === current) {
            head.next = head.next.next;
        }
        head = head.next;
       
    }
    return phead;
};
/** 
 * 删除链表倒数指定位置节点
 * （2）两个指针：一个先走n步，先走的那个走完之后，另一个正好到达倒数第n的位置
*/
var removeNthFromEnd = function(head, n) {
    var left, before, right = head;
    left = before = {next: head};
    while(n--) {
        if(right) {
            right = right.next;
        } else {
            return head;
        }
    }
    while(right) {
        right = right.next;
        left = left.next;
    }
    left.next = left.next.next;
    return before.next;
}

/** 
 * 交换链表中的相邻节点
*/
var swapPairs = function(head) {
    if(!head || !head.next) return;
    var phead = head.next;
    var next = null;
    var pre  = {next: head};
    while(head && head.next) {
        next = head.next;
        head.next = next.next;
        next.next = head;
        pre.next = next;

        pre = head;
        head = head.next;
    }
    return phead;
};

/** 
 * 链表求和 https://leetcode-cn.com/problems/sum-lists-lcci/submissions/
 */
var addTwoNumbers = function (l1, l2) {
    if(!l1) return l2;
    if(!l2) return l1;
    let qianjin1 = 0;
    let phead = {next: null};
    let head = phead;

    while(l1 || l2) {
        let val = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + qianjin1;
        if(val >= 10) {
            val = val % 10;
            qianjin1 = 1;
        } else {
            qianjin1 = 0;
        }
        head.next = {
            val,
            next: null
        }
        head = head.next;
        l1 && (l1 = l1.next);
        l2 && (l2 = l2.next);
    }
    if(qianjin1) {
        head.next = {
            val: qianjin1,
            next: null
        }
        qianjin1 = 0;
    }
    return phead.next;
};

/** 
 * 回文链表
 */
var isPalindrome = function (head) {
    const arr = [];
    while(head) {
        arr.push(head.val);
        head = head.next;
    }
    const length = arr.length;
    for (var i = 0; i < Math.floor(length / 2); i++) {
        if (arr[i] !== arr[length - 1 - i]) return false;
    }
    return true;
};
// 使用快慢指针：快指针走到头的时候，慢指针正好走到一半。慢指针每走一步就反转一步
var isPalindrome = function (head) {
    if(!head) return true;
    let fast = head;
    let slow = head;
    let next = head.next;
    let pre = head;
    while(fast && fast.next && fast.next.next) {
        // 快慢指针同时移动
        fast = fast.next.next;
        slow = next;
        // 慢指针反转链表
        next = slow.next;
        slow.next = pre;
        pre = slow;
    }
    // 单数和双数不一样
    let head1 = fast.next ? slow : slow.next;
    let head2 = next;
    
    while(head1 && head2) {
        if(head1.val !== head2.val) {
            return false;
        }
        head1 = head1.next;
        head2 = head2.next;
    }
    return true;
}

// 六. 树相关习题
// 二叉树的类型：
// 平衡树（左右子树高度差<=1）,
// 二叉查找树（BST）：根节点大于等于左子树所有节点，小于等于右子树所有节点。二叉查找树中序遍历有序.

/** 
 * 求树的高度
*/
var maxDepth = function (root) {
    if(!root) {
        return 0;
    } else {
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
    }
};
/** 
 * 查看树是否是平衡树
 * (1)理解起来简单，但是有重复计算
*/
var isBalanced = function (root) {
    if(!root) return true;
   var leftHeight = getHeight(root.left); 
   var rightHeight = getHeight(root.right);
    if (Math.abs(leftHeight - rightHeight) > 1) {
       return false;
   } else {
       return isBalanced(root.left) && isBalanced(root.right);
   }
};
// 就是上面的求树的高度
function getHeight(root) {
    if(!root) return 0;
    return Math.max(1 + getHeight(root.left), 1 + getHeight(root.right));
}
/**
 * 查看是否是平衡树
 * (2) 暂定
 */
function isBalanced(root) {
    
}

/** 
 * 二叉树的遍历：有深度遍历和广度遍历
 * 深度遍历分为前序遍历，中序遍历，后序遍历三种（‘序’是相对于根来说的，前序即根最早出现）
 * 广度遍历即我们常说的层次遍历
 * 
*/
/** 
 * 树的遍历
 * 1. 广度优先遍历  
*/
function levelOrderTraversal(root) {
    if(!root) return [];
    var nodes = [root];
    var values = [];
    while (nodes.length) {
        // 注意这里是shift()，不能是pop()  用pop顺序就不对了
        var node = nodes.shift();
        values.push(node.val);
        node.left && nodes.push(node.left);
        node.right && nodes.push(node.right);
    }
    return values;
}
/** 
 * 广度优先遍历 返回其层次遍历结果： 
[
  [3],
  [9,20],
  [15,7]
]
https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/
*/
// 方法一：使用两个数组来回倒
var levelOrder = function(root) {
    if(!root) return [];
    let currentLevelNode = [root];
    let otherLevelNode = [];
    let values = [];
    let valueOfSingleLevel = [];
    while(currentLevelNode.length) {
        let node = currentLevelNode.shift();
        valueOfSingleLevel.push(node.val);
        node.left && otherLevelNode.push(node.left);
        node.right && otherLevelNode.push(node.right);

        if(!currentLevelNode.length) {
            values.push(valueOfSingleLevel.slice(0));
            valueOfSingleLevel = [];
            currentLevelNode = otherLevelNode.slice(0);
            otherLevelNode = [];
        }
    }
    return values;
};
// 方法二：一个数组就可以了
var levelOrder = function(root) {
    if (!root) return [];
    let roots = [root];
    let values= [];
    while(roots.length) {
        let value = [];
        let length = roots.length;
        while(--length >= 0) {
            node = roots.shift();
            value.push(node.val);
            node.left && roots.push(node.left);
            node.right && roots.push(node.right);
        }
        values.push(value);
    }
    return values;
};
/**
 * 树的遍历: 
 * 2.1.1 深度优先遍历----前序遍历---递归的方法
*/
function preOrderTraversal(root) {
    if(!root) return [];
    var values = [];
    travel(root, values);
    return values;
}
function travel(root, values) {
    if(!root) return;
    values.push(root.val);
    travel(root.left, values);
    travel(root.right, values);
}
/**
 * 树的遍历:
 * 2.1.2 深度优先遍历----前序遍历---非递归的方法
 * 使用数组模拟栈
*/
function preOrderTraversal(root) {
    if(!root) return [];
    var nodes = [root];
    var values = [];
    while(nodes.length) {
        var node = nodes.pop();
        values.push(node.val);
        // 注意这个地方需要先判断node.right是否存在，存在才能nodes.push(node.right)；否则放进数组中的是null
        node.right && nodes.push(node.right);
        node.left && nodes.push(node.left);
    }
    return values;
}
// preOrderTraversal 和 preOrderTraversal2 一个是将数据塞入尾部，一个是将数据塞入头部
function preOrderTraversal2(root) {
    if (!root) return [];
    let nodes = [root];
    let values = [];
    while(nodes.length) {
        const node = nodes.shift();
        values.push(node.val);
        node.right && nodes.unshift(node.right);
        node.left && nodes.unshift(node.left);
    }
    return values;
}


/**
 * 树的遍历: 递归的方法
 * 2.2.1 深度优先遍历----中序遍历----递归的方法
*/
function midOrderTraversal(root) {
    if(!root) return [];
    var values = [];
    travel(root, values);
}
function travel(root, values) {
    if(!root) return;
    travel(root.left, values);
    values.push(root.val);
    travel(root.right, values);
}

/**
 * 树的遍历:
 * 2.2.2 深度优先遍历----中序遍历---非递归的方法
 * 如果树节点没有重复val可以用这个方法，但是有重复val就不行
 * 因为var index = values.indexOf(node.val)得到的index就可能不是当前节点的val对应的index
*/
function midOrderTraversal(root) {
    if (!root) return [];
    var nodes = [root];
    var values = [root.val];
    while (nodes.length) {
        var node = nodes.pop();
        node.right && nodes.push(node.right);
        node.left && nodes.push(node.left);
        
        var index = values.indexOf(node.val);
        node.left && values.splice(index,0,node.left.val);
        index = values.indexOf(node.val);
        node.right && values.splice(index+1,0,node.right.val);
    }
    return values;
}

/**
 * 树的遍历:
 * 2.2.3 深度优先遍历----中序遍历---非递归方法
 * 有重复值也可以用这方法
 */
function midOrderTraversal(root) {
    if (!root) return [];
    var nodes = [];
    var values = [];
    while (root || nodes.length) {
        if(root) {
            nodes.push(root);
            root = root.left;
        } else {
            root = nodes.pop();
            values.push(root.val);
            root = root.right;
        }
    }
    return values;
}

/**
 * 树的遍历: 递归的方法
 * 2.3.1 深度优先遍历----后序遍历---递归的方法
*/
function postOrderTraversal(root) {
    if (!root) return [];
    var values = [];
    travel(root, values);
}
function travel(root, values) {
    if (!root) return;
    travel(root.left, values);
    travel(root.right, values);
    values.push(root.val);
}
/**
 * 树的遍历
 * 2.3.2 深度优先遍历----后序遍历---非递归的方法
 * 和前序非递归遍历正好相反
*/
function postOrderTraversal(root) {
    if (!root) return [];
    var nodes = [root];
    var values = [];
    while(nodes.length) {
        var node = nodes.pop();
        values.unshift(node.val);
        node.left && nodes.push(node.left);
        node.right && nodes.push(node.right);
    }
    return values;
}

/**
 * 二叉树的直径 https://leetcode-cn.com/problems/diameter-of-binary-tree/
 * dfs： Depth-First-Search 深度优先遍历
 */
function diameterOfBinaryTree(root) {
    var diameter = 0;
    function dfs(root) {
        if(!root) return 0;
        var left = dfs(root.left);
        var right = dfs(root.right);
        diameter = Math.max(diameter, left + right);
        return 1 + Math.max(left, right);
    }
    dfs(root);
    return diameter;
}
/** 
 * 最长同值路径 https://leetcode-cn.com/problems/longest-univalue-path/
*/
// 【注意】：关于树的递归思路，一般不要想成 根节点-左节点-右节点， 要想成根节点-左子树-右子树
function longestUnivaluePath(root) {
    var diameter = 0;
    function dfs(root, val) {
        if(!root) return 0;
        var left = dfs(root.left, root.val);
        var right = dfs(root.right, root.val);
        diameter = Math.max(diameter, left + right);
        return val === root.val ? 1 + Math.max(left, right) : 0;
    }
    dfs(root);
    return diameter;
}

/** 
 * 间隔遍历 https://leetcode-cn.com/problems/house-robber-iii/
*/
function rob(root) {
    if(!root) return 0;
    var val = root.val;
    if(root.left) val += rob(root.left.left) + rob(root.left.right);
    if(root.right) val += rob(root.right.left) + rob(root.right.right);
    var val2 = rob(root.left) + rob(root.right);
    return Math.max(val, val2);
}
/**
 * 找出二叉树中第二小的节点 https://leetcode-cn.com/problems/second-minimum-node-in-a-binary-tree/
 */
var findSecondMinimumValue = function (root) {
    if(!root) return 0;
    var min = root.val;
    secondMin = Infinity;
    function dfs(root) {
        if(!root) return;
        if(root.val <= min) {
            min = root.val;
        } else if (root.val < secondMin) {
            secondMin = root.val;
        }
        dfs(root.left);
        dfs(root.right);
    }
    dfs(root);
    return Infinity === secondMin ? -1 : secondMin;
};


/**
 * 翻转树:https://leetcode-cn.com/problems/invert-binary-tree/
 * 方法1
 */
function invertTree(root) {
    if(!root) return root;
    var temp = root.right;
    root.right = invertTree(root.left);
    root.left = invertTree(temp);
    return root;
}
// 自己写的
function invertTree(root) {
    if(!root) return root;
    let temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
    return root;
}
/**
 * 翻转树
 * 方法2
 */
var invertTree = function (root) {
    invert(root);
    return root;
};
function invert(root) {
    if (!root) return;
    var temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
}
/** 
 * 合并二叉树
 */
var mergeTrees = function (t1, t2) {
    if (!t1 && !t2) return null;
    var root = new TreeNode((t1 && t1.val || 0) + (t2 && t2.val || 0));
    root.left = mergeTrees(t1 && t1.left, t2 && t2.left);
    root.right = mergeTrees(t1 && t1.right, t2 && t2.right);
    return root;
};
// 这个更简单点
var mergeTrees = function(t1, t2) {
    if(!t1) return t2;
    if(!t2) return t1;
    let root = new TreeNode(t1.val + t2.val);
    root.left = mergeTrees(t1.left, t2.left);
    root.right = mergeTrees(t1.right, t2.right);
    return root;
};
// 自己写的
var mergeTrees = function(root1, root2) {
    if (!root1) return root2;
    if (!root2) return root1;
    let node = {
        val: root1.val + root2.val,
    }
    node.left = mergeTrees(root1.left, root2.left);
    node.right = mergeTrees(root1.right, root2.right);
    return node;
};


/** 
 * 有没有一条从根节点到叶子节点路径和等于指定的数字 https://leetcode-cn.com/problems/path-sum/
*/
var hasPathSum = function (root, sum) {
    if (!root) return false;
    return getPathSum(root, 0, sum);
};
function getPathSum(root, currentSum, sum) {
    if (!root.left && !root.right) {
        return currentSum + root.val === sum;
    } else if (root.left && root.right) {
        return getPath(root.left, currentSum + root.val, sum) || getPath(root.right, currentSum + root.val, sum)
    } else if (root.left) {
        getPath(root.left, currentSum + root.val, sum)
    } else {
        return getPath(root.right, currentSum + root.val, sum)
    }
}
// 自己写的
var hasPathSum = function(root, sum) {
    if(!root) return false;
    return hasPath(root, sum);
};
function hasPath(root, sum) {
    if(!root.left && !root.right) {
        return sum === root.val;
    }
    sum = sum - root.val;
    if(root.left && root.right) {
        return hasPath(root.left, sum) || hasPath(root.right, sum);
    }
    if(root.left) {
        return hasPath(root.left, sum) 
    }
    if(root.right) {
        return hasPath(root.right, sum);
    }
}
// 自己写的
var hasPathSum = function(root, sum) {
    if (!root) return false;
    let flag = false;
    function dfs(root, sum) {
        if (!root) return;
        if (!root.left && !root.right && sum === root.val) {
            flag = true;
            return;
        }
        dfs(root.left, sum - root.val);
        dfs(root.right, sum - root.val);
    }
    dfs(root, sum);
    return flag;
};


/** 
 * 统计路径和等于一个数的路径数量, 不一定要到叶子节点，也不一定是树根节点，但是得是从父节点到子节点 https://leetcode-cn.com/problems/path-sum-iii/
*/
function pathSum(root, sum) {
    let result = 0;
    if (!root) return result;
    result = pathSumStartWithRoot(root, sum) + pathSum(root.left, sum) + pathSum(root.right, sum);
    return result;
}
function pathSumStartWithRoot(root, sum) {
    if(!root) return 0;
    var result = 0;
    if (root.val === sum) result++;
    result += pathSumStartWithRoot(root.left, sum - root.val) + pathSumStartWithRoot(root.right, sum - root.val);
    return result;
}
// 自己写的
function pathSum(root, sum) {
    let count = 0;
    // 以某个节点为根遍历得到的数量
    function dfs(root, sum) {
        if (!root) return;
        if (root.val === sum) {
            count++;
        }
        dfs(root.left, sum - root.val);
        dfs(root.right, sum - root.val);
    }
    // 以每个节点为根去执行dfs
    function travel(root) {
        if (!root) return;
        dfs(root, sum);
        root.left && travel(root.left, sum);
        root.right && travel(root.right, sum);
    }
    travel(root);
}

/** 
 * 是否是子树：https://leetcode-cn.com/problems/subtree-of-another-tree/
 * 先判断当前树与目标数是否相等，不相等再看左子树与目标数是否相等，再看右子树与目标数是否相等
*/
var isSubtree = function(s, t) {
    // 【注意】这种简便写法
    if(!t || !s) return !s && !t;
    return isSame(s, t) || isSubtree(s.left, t) || isSubtree(s.right, t);
};
function isSame(s, t) {
    // 同时为false才行
    if(!t || !s) return !s && !t;
    if(s.val !== t.val) {
        return false;
    }
    return isSame(s.left, t.left) && isSame(s.right, t.right);
}

/** 
 * 树的对称：https://leetcode-cn.com/problems/symmetric-tree/
*/
var isSymmetric = function (root) {
    if (!root) return true;
    return isReversed(root.left, root.right);
};

function isReversed(root1, root2) {
    if (!root1 || !root2) return !root1 && !root2;
    if (root1.val !== root2.val) return false;
    return isReversed(root1.left, root2.right) && isReversed(root1.right, root2.left)
}
/**
 * 二叉树的最小深度：树的根节点到叶子节点的最小路径长度(注意和树的高度不一样)
 * https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/
 */
var minDepth = function (root) {
    if (!root) return 0;
    return leafHeight(root, 0);
};
var leafHeight = function (root, sum) {
    if (!root.left && !root.right) return ++sum;
    if (root.left && root.right) return Math.min(leafHeight(root.left, sum + 1), leafHeight(root.right, sum + 1));
    if (root.left) return leafHeight(root.left, sum + 1);
    if (root.right) return leafHeight(root.right, sum + 1);
}
// 自己写的
var minDepth = function(root) {
    if(!root) return 0;
    let min = Infinity;
    function getDepth(root, dep) {
        if(!root) return;
        dep += 1;
        if(!root.left && !root.right) {
            min = Math.min(min, dep);
            return;
        }
        if(root.left) {
            getDepth(root.left, dep);
        }
        if(root.right) {
            getDepth(root.right, dep);
        }
    }
    getDepth(root, 0);
    return min;
};

/**  https://leetcode-cn.com/problems/sum-of-left-leaves/submissions/
 * 统计左叶子节点的和
 * 关键点：是否是叶子节点，是否是左节点
*/

function sumOfLeftLeaves(root) {
    if(!root) return 0;
    if (isLeaf(root.left)) {
        return root.left.val + sumOfLeftLeaves(root.right);
    }
    return sumOfLeftLeaves(root.left) + sumOfLeftLeaves(root.right);
}

function isLeaf(root) {
    if(!root) return false;
    return !root.left && !root.right;
}
// 自己写的
var sumOfLeftLeaves = function(root) {
    if(!root) return 0;
    let result = 0;
    function dfs(root, isLeft) {
        if(!root) return;
        if(!root.left && !root.right) {
            if(isLeft) {
                result += root.val;
            }
            return;
        }
        if(root.left) {
            dfs(root.left, true)
        }
        if(root.right) {
            dfs(root.right, false);
        }
    }
    dfs(root.left, true);
    dfs(root.right, false);
    return result;
};

/** 
 * 一棵树每层节点的平均数：深度遍历
*/
var averageOfLevels = function (root) {
    var levels = {};
    travelLevel(root, 0, levels);
    var resultArr = [];
    for (key in levels) {
        resultArr.push(levels[key].sum / levels[key].count);
    }
    return resultArr;
};
function travelLevel(root, level, levels) {
    if(!root) return;
    levels[level + 1] = levels[level + 1] || {count: 0, sum: 0};
    levels[level + 1].count += 1;
    levels[level + 1].sum += root.val;
    travelLevel(root.left, level + 1, levels);
    travelLevel(root.right, level + 1, levels);
}

// 自己写的，类似层次遍历
var averageOfLevels = function(root) {
    let values = [];
    let currentLevelNodes = [root];
    let nextLevelNodes = [];
    let currentLevelValues = [];
    while(currentLevelNodes.length) {
        let node = currentLevelNodes.pop();
        currentLevelValues.push(node.val);
        node.left && nextLevelNodes.push(node.left);
        node.right && nextLevelNodes.push(node.right);
        if (!currentLevelNodes.length) {
            values.push(currentLevelValues.slice(0));
            currentLevelValues = [];
            currentLevelNodes = nextLevelNodes.slice();
            nextLevelNodes = [];
        }
    }
    return values.reduce((pre, value) => {
        let sum = 0;
        for (let i = 0; i < value.length; i++) {
            sum += value[i];
        }
        pre.push(sum / value.length);
        return pre;
    }, []);
};

/**
 * 得到左下角的节点
 */
var findBottomLeftValue = function (root) {
    var obj = {
        maxLevel: 0,
        value: root.val
    }
    function dfs(root, level) {
        if(!root) return;
        if(level + 1 > obj.maxLevel) {
            obj.maxLevel = level + 1;
            obj.value = root.val;
        }
        if (root.left) dfs(root.left, level + 1);
        if (root.right) dfs(root.right, level + 1);
    }
    dfs(root, 0);
    return obj.value;
};

/** 不会做
 * 修剪二叉搜索树 https://leetcode-cn.com/problems/trim-a-binary-search-tree/ 
*/
var trimBST = function (root, L, R) {
    if(!root) return root;
    if (root.val > R) return trimBST(root.left, L, R);
    if (root.val < L) return trimBST(root.right, L, R);
    root.left = trimBST(root.left, L, R);
    root.right = trimBST(root.right, L, R);
    return root;
};

/** https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/
 * 找出二叉查找树中第k小的数
 * 不会做
*/
var kthSmallest = function (root, k) {
    var result;
    function dfs(root) {
        if (!root) return;
        dfs(root.left);
        k--;
        if (k === 0) {
            return result = root.val;
        }
        dfs(root.right);
    }
    dfs(root);
    return result
};

/** https://leetcode-cn.com/problems/convert-bst-to-greater-tree/
 * 把二叉搜索树转换为累加树：把二叉查找树每个节点的值都加上比它大的节点的值
 */
var convertBST = function (root) {
    var sum = 0;
    function dfs(root) {
        if(!root) return;
        dfs(root.right);
        root.val += sum;
        sum = root.val;
        dfs(root.left);
    }
    dfs(root);
    return root;
};

/** 
 * 二叉查找树的最近公共祖先
*/
var lowestCommonAncestor = function (root, p, q) {
    if (root.val > p.val && root.val > q.val) {
        return lowestCommonAncestor(root.left, p, q);
    }
    else if (root.val < p.val && root.val < q.val) {
        return lowestCommonAncestor(root.right, p, q);
    }
    else return root;
};

/** https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/
 * 二叉树的最近公共祖先
 * 不会做
*/
var lowestCommonAncestor = function (root, p, q) {
    if(!root) return root;
    if(isAncestor(root.left, p) && isAncestor(root.left, q)) {
        return lowestCommonAncestor(root.left, p, q);
    } else if (isAncestor(root.right, p) && isAncestor(root.right, q)) {
        return lowestCommonAncestor(root.right, p, q);
    } else {
        return root;
    }
};
function isAncestor(root, node) {
    if(!root) return false;
    if(root === node) return true;
    return isAncestor(root.left, node) || isAncestor(root.right, node)
}

/**
 * 108
 * 从有序数组中构造二叉查找树
 */

function sortedArrayToBST(nums) {
    if (!nums.length) return null;
    // 很奇怪，这个地方只能用Math.floor，为什么Math.ceil就不行呢
    const mid = Math.floor(nums.length / 2);
    const root = new TreeNode(nums[mid]);
    
    // subtrees are BSTs as well
    root.left = sortedArrayToBST(nums.slice(0, mid));
    root.right = sortedArrayToBST(nums.slice(mid + 1));
    
    return root;
}

// 七. 字符串相关习题
/**
 * 字符串循环移位
 * 移动前：”1234567”
 * 移动后：”5671234”
 * 左移：从左边第n个切断
 * 右移：从右边第n个切断
 */
function rotateTranslateLeft(str, n){
    var arr = str.split('');
    var left = arr.slice(0, n).reverse();
    var right = arr.slice(n).reverse();
    return left.concat(right).reverse().join('');
}

/**
 * 有效的字母异位词 https://leetcode-cn.com/problems/valid-anagram/
 * 注意 forEach 函数 return 一个值 只是返回了forEach的值，不是返回外层函数的值
 */
var isAnagram = function (s, t) {
    var obj = {};
    var result = true;
    s.split('').forEach((item) => {
        obj[item] = obj[item] ? ++obj[item] : 1;
    });
    t.split('').forEach((item) => {
        if (obj[item]) {
            --obj[item]
        } else {
            result = false;
        }
    });
    for (var i in obj) {
        if (obj[i]) {
            result = false;
        }
    }
    return result;
};

/**
 * 计算一组字符集合可以组成的回文字符串的最大长度
 * 方法1： 把成单的元素数量拎出来
 */
var longestPalindrome = (s) => {
    const count = {};
    for(let value of s ){
        count[value] = (count[value] || 0) + 1;
    }
    let odd = 0;
    for(let key in count) {
        odd += count[key] % 2;
    }
    return s.length - odd + !!odd;
}

/**
 * 计算一组字符集合可以组成的回文字符串的最大长度
 * 方法2： 把成对的元素数量拎出来
 */
var longestPalindrome = (s) => {
    const count = {};
    for (let value of s) {
        count[value] = (count[value] || 0) + 1;
    }
    let sum = 0;
    let hasSingle = false;
    for(let key in count) {
        if (count[key] % 2) {
            hasSingle = true;
            sum += count[key] - 1;
        } else {
            sum += count[key];
        }
    }
    return sum + !!hasSingle;
}

/** 
 * 字符串同构
*/
var isIsomorphic = function (s, t) {
    if(s.length !== t.length) return false;
    var obj_s = {}, obj_t = {};
    for(var i = 0; i < s.length; i++) {
        if (!obj_s[s[i]]) obj_s[s[i]] = t[i];
        if (!obj_t[t[i]]) obj_t[t[i]] = s[i];
        if (obj_s[s[i]] !== t[i] || obj_t[t[i]] !== s[i]) {
            return false;
        }
    }
    return true;
};

var isIsomorphic = function(s, t) {
    let obj = {};
    let sArr = s.split('');
    let flag = true;
    let dataArr = [];
    sArr.forEach((item, index) => {
        if(!obj[item]) {
            if(dataArr.indexOf(t[index]) === -1) {
                obj[item] = t[index];
                dataArr.push(t[index]);
            } else {
                flag = false;
            }
        }
        if(obj[item] !== t[index]) {
            flag = false;
        }
    });
    return flag;
};

/** 
 * 回文子字符串个数
 * 647. 回文子串
 * 回文子串
*/
var countSubstrings = function (s) {
    let count = 0;
    for(let i = 0; i<s.length; i++) {
        helper(i, i); // 基数
        helper(i, i + 1); // 偶数
    }
    function helper(low, high) {
        // 从中间往两边扩散匹配，不是从两边向中间匹配
        while(low >= 0 && high <= s.length - 1 && s[low] === s[high]) {
            count++;
            low--;
            high++;
        }
    }
    return count;
};

/**
 * 判断一个整数是否是回文数
 * 9.回文数
 * 利用数组
 */
var isPalindrome = function (x) {
    var arr = [];
    var number = x;
    while (number) {
        arr.push(number % 10);
        number = Math.floor(number / 10);
    }
    for (var i = 0; i < Math.ceil(arr.length / 2); i++) {
        if (arr[i] !== arr[arr.length - i - 1]) {
            return false;
        }
    }
    return true;
};
/**
 * 判断一个整数是否是回文数
 * 不使用数组
 */
var isPalindrome = function (x) {
    if (x < 0) return false;
    var originCount = x;
    var num = 0;
    while (x) {
        num = (x % 10) + num * 10;
        x = Math.floor(x / 10);
    }
    return num === originCount;
};
/**
 * 696. 计数二进制子串
 * 统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数
 * 自己写的：时间复杂度较高
 */
var countBinarySubstrings = function (s) {
    var result = 0;
    for(var i = 0; i < s.length; i++) {
        result += !!calc(i);
    }
    function valid(number) {
        return ~['0', '1'].indexOf(number);
    }
    function verse(number) {
        if (!valid) return -1;
        return number === '0' ? '1' : '0';
    }
    function calc(start) {
        for(var i = start + 1; i<s.length;) {
            if (s[i] === s[i - 1] && valid(s[i])) {
                i++;
            } else {
                let j = i + (i - start -1);
                while(j > i) {
                    if (s[j] !== s[j - 1] || s[j] === verse(s[start])) {
                        return false;
                    }
                    j--;
                }
                return true;
            }
        }
    }
    return result;
};
/**
 * 统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数
 * 看别人的：时间复杂度较低
 * 利用正则对字符串进行分类处理
 */
var countBinarySubstrings = (s) => {
    return s.replace(/10/g, '1,0').replace(/01/g, '0,1').split(',').reduce((res, item, index, arr) => {
        return index ? res += Math.min(item.length, arr[--index].length) : 0;
    }, 0);
}

// 八. 算法思想

// 回文字符串常用算法
// 1.动态规划
// 2.中心扩散法
// 3.还有著名的马拉车算法

// leetcode出现的回文字符串的三个题：
// 1.回文子串的个数
// 2.最长回文子串
// 3.最长不连续的回文子串


// (1) 双指针
/**
 * https://leetcode-cn.com/problems/sum-of-square-numbers/
 *  633 两数平方和
 */
var judgeSquareSum = function (c) {
    var i = 0; 
    var j = Math.floor(Math.sqrt(c));
    while(i <= j) {
        var result = Math.pow(i, 2) + Math.pow(j, 2);
        if (result === c) {
            return true;
        } else if(result > c) {
            j--;
        } else {
            i++;
        }
    }
    return false;
};

/**
 * https://leetcode-cn.com/problems/reverse-vowels-of-a-string/
 * 345.反转字符串中的元音字母
 */
var reverseVowels = function (s) {
    var yuanyin = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
    var i = 0;
    var j = s.length - 1;
    var result = [];
    // 注意这里要有等于号，因为当数组只有一个元素的时候i和j是相等的
    while(i <= j) {
        if (~yuanyin.indexOf(s[i]) && ~yuanyin.indexOf(s[j])) {
            result[i] = s[j];
            result[j] = s[i];
            i++;
            j--;
        } else {
            if (~yuanyin.indexOf(s[i])) {
                result[j] = s[j];
                j--;
            } else if (~yuanyin.indexOf(s[j])) {
                result[i] = s[i];
                i++;
            } else {
                result[i] = s[i];
                result[j] = s[j];
                i++;
                j--;
            }
        }
    }
    return result.join('');
};

/**
 * 680.回文字符串
 * 可以删除一个字符，判断是否能构成回文字符串。
 * 自己写的：性能不行(构造了很多数组和字符串)
 * 别人写的只是在原来的字符串上进行比较，没有构造任何多余的数据结构
 */
var validPalindrome = function (s, deleteCount = 1) {
    var i = 0;
    var j = s.length - 1;
    while (i <= j) {
        if (s[i] === s[j]) {
            j--;
            i++;
        } else {
            const arr1 = s.split('').concat([]);
            arr1.splice(i, 1);
            const arr2 = s.split('').concat([]);
            arr2.splice(j, 1);
            return deleteCount ? (validPalindrome(arr1.join(''), 0) || validPalindrome(arr2.join(''), 0)) : false;
        }
    }
    return true;
};
/**
 * 回文字符串
 * 可以删除一个字符，判断是否能构成回文字符串。
 * 看别人的  "abca"
 */
var validPalindrome = (s) => {
    var i = 0;
    var j = s.length - 1;
    while(i <= j) {
        if(s[i] !== s[j]) {
            return isPalindrome(s, i + 1, j) || isPalindrome(s, i, j-1);
        }
        i++;
        j--;
    }
    return true;
}
function isPalindrome(s, i, j) {
    while(i <= j) {
        if(s[i] !== s[j]) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}

/** leetcode 524
 * 最长子序列
 * 通过删除字母匹配到字典里最长单词
 * 思路：每个dictionary一个指针，s也有一个指针，一起移动
 * 
 * 输入: s = "abpcplea", d = ["ale","apple","monkey","plea"]
 * 输出: "apple"
 * 
 */
 var findLongestWord = function(s, dictionary) {
    let indexOfS = 0;
    let indexs = Array(dictionary.length).fill(0);
    let result = '';
    while(indexOfS < s.length) {
        dictionary.forEach((item, index) => {
            if (s[indexOfS] === item[indexs[index]]) {
                indexs[index] = indexs[index] + 1;
            }
        });
        indexOfS++;
    }
    for(let i = indexs.length - 1; i >= 0; i--) {
        if (indexs[i] === dictionary[i].length) {
            if (indexs[i] > result.length) {
                result = dictionary[i];
            } else if (indexs[i] === result.length) {
                result = [dictionary[i], result].sort()[0];
            }
        }
    }
    return result;
};


// (2)贪心思想：保证每次操作都是局部最优的，并且最后得到的结果是全局最优的。
/** 
 * 分配饼干
*/
var findContentChildren = function (g, s) {
    var content = 0;
    g.sort((a, b) => {
        return a-b;
    });
    s.sort((a,b) => {
        return a-b;
    });
    var i = 0, j = 0;
    while(i < g.length && j < s.length) {
       if(s[j] >= g[i]) {
            content++;
            i++;
            j++;
        } else {
            j++;
        }
    }
    return content;
};
/** 
 * 435.无重叠区间
*/
var eraseOverlapIntervals = function (intervals) {
    if (!intervals.length || !intervals[0].length) return 0;
    intervals.sort((a, b) => a[1] - b[1]);
    var count = 0;
    intervals.reduce((pre, item) => {
        if (pre[1] > item[0]) {
            count++;
            return pre;
        } else {
            return item;
        }
    });
    return count;
};

/** 
 * 452.投飞镖刺破气球
 * 自己写的：有的case没通过
*/
var findMinArrowShots = function (s) {
    if (!s.length || !s[0].length) return 0;
    s.sort((a, b) => a[0] - b[0]);
    var count = 0;
    while (s.length) {
        var arr = [];
        for (var i = 1; i <= s.length - 1; i++) {
            const inter = intersaction(s[0], s[i]);
            let hasTheSameInter = false;
            if (inter.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    if (intersaction(arr[i], inter).length > 0) {
                        hasTheSameInter = true;
                        arr[i] = intersaction(arr[i], inter);
                        break;
                    }
                }
                if (!hasTheSameInter) arr.push(inter);
                s.splice(i, 1);
                i--;
            }
        }
        count += (arr.length || 1);
        s.splice(0, 1);
    }
    return count;
};
function intersaction(arr1, arr2) {
    if (arr1[1] < arr2[0] || arr2[1] < arr1[0]) return [];
    if (arr1[0] <= arr2[0]) {
        return [arr2[0], Math.min(arr1[1], arr2[1])];
    } else {
        return [arr1[0], Math.min(arr1[1], arr2[1])]
    }
}
/**
 * 投飞镖刺破气球
 * 此方法通过尾数排序，能确定只要有交叉就能一剑刺破
 * 上面我自己的方法是通过首数排序，这样排序后交叉也不能代表就一定能一剑刺破。
*/
var findMinArrowShots = function (s) {
    if (!s.length || !s[0].length) return 0;
    s.sort((a, b) => a[1] - b[1]);
    var count = 0;
    while (s.length > 0) {
        for (var i = 1; i < s.length; i++) {
            if (s[0][1] >= s[i][0]) {
                s.splice(i, 1);
                i--;
            }
        }
        s.splice(0, 1);
        count++;
    }
    return count;
}

/**
 * 406.根据身高重建队列
 */
var reconstructQueue = function (people) {
    if (!people.length || !people[0].length || people.length == 1) return people;
    people.sort((a, b) => b[0] === a[0] ? a[1] - b[1] : b[0] - a[0]);
    var result = people.reduce((pre, item) => {
        pre.splice(item[1], 0, item);
        return pre;
    }, []);
    return result;
};

/** 
 * 605.种植花朵
*/
var canPlaceFlowers = function (flowerbed, n) {
    var count = 0;
    for (var i = 0; i < flowerbed.length; i++) {
        if (flowerbed[i] === 1) continue;
        var pre = i > 0 ? flowerbed[i - 1] : 0;
        var next = i < flowerbed.length - 1 ? flowerbed[i + 1] : 0;
        if (!pre && !next) {
            flowerbed[i] = 1;
            count++;
        }
    }
    return count >= n;
};

/**
 * 392.判断是否为子序列
 * s = "abc", t = "ahbgdc" ==> true
 * s = "axc", t = "ahbgdc" ===> false
 * isSubsequence1是我自己的写的，利用的是indexOf。如果t里面有重复字符就会出问题。
 * isSubsequence是别人的，不管是否重复都没问题。因为t.substr直接去掉了已经匹配的部分了
 */
var isSubsequence1 = function (s, t) {
    var preIndex = 0;
    for (let i = 0; i < s.length; i++) {
        const currentIndex = t.indexOf(s[i]);
        if (currentIndex < preIndex) return false;
        preIndex = currentIndex;
    }
    return true;
};

var isSubsequence = function (s, t) {
    if (s.length === 0) {
        return true;
    }
    if (s.length !== 0 && t.length === 0) {
        return false;
    }
    for (var i = 0; i < s.length; i++) {
        var temp = t.indexOf(s[i]);
        if (temp < 0) {
            return false;
        } else {
            t = t.substr(temp + 1);
        }
    }
    return true;
};
/** 
 * 665.修改一个数成为非递减数组
*/
var checkPossibility = function (nums) {
    var count = 0;
    for (let i = 1; i < nums.length && count < 2; i++) {
        if (nums[i] >= nums[i - 1]) continue;
        count++;
        if (i - 2 >= 0 && nums[i - 2] > nums[i]) {
            nums[i] = nums[i - 1];
        } else {
            nums[i - 1] = nums[i];
        }
    }
    return count < 2;
};

// （3）二分查找：做这种题型非常需要注意边界条件，比如while（start < end) 是否有=，另外指针移动条件是否带有=

/**
 * 1. 基础二分查找  与第(二)节相呼应
 */
 function binarySearch(arr, target) {
    var end = arr.length - 1;
    var start = 0;
    while (start <= end) {
        var mid = Math.floor((end + start) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return -1;
}
/**
 * 2. 二分查找的变体: 返回的是start（有时候是end）不是-1。
 * 
 * function binarySearch(nums, target) {
    let start = 0, end = nums.length;
    while (start < end) {
        int mid = start + (end - start) / 2;
        if (nums[mid] >= target) {
            end = mid;
        } else {
            start = mid + 1;
        }
    }
    return start;
}
 *

基础二分查找和变体二分查找解决的不是一种问题：
基础二分查找主要是寻找nums里面和target相等的元素；变体二分查找寻找的是nums里符合某个条件的元素，寻找的是while循环结束时对应的start和end值，比如[69]: 求开方，nextGreatestLetter，[278]第一个错误的版本。
 */
// [69]: 求开方
function mySqrt(x) {
    if (x <= 1) return x;
    let start = 0;
    let end = x;
    while(start <= end) {
        let mid = Math.floor(start + (end - start) / 2);
        let sqrt = x / mid;
        if (sqrt === mid) {
            return mid;
        } else if (sqrt > mid) {
            start = mid + 1
        } else {
            end = mid - 1;
        }
    }
    return end;
}
// [744] 寻找比目标字母大的最小字母
// 自己写的
var nextGreatestLetter = function(letters, target) {
    let arr = letters.concat(target);
    arr.sort();
    let index = arr.lastIndexOf(target);
    return index === arr.length - 1 ? arr[0] : arr[index + 1];
};

var nextGreatestLetter = function(letters, target) {
    if (letters[0] > target || target >= letters[letters.length - 1]) return letters[0]
    let s = 0
    let e = letters.length - 1
    // 【注意】如果while是s<=e,那么指针移动的时候，不能出现e = mid 这种赋值给mid的情况，否则s<=e的条件会进入死循环
    while (s < e) {
        // Math.trunc() 的执行逻辑很简单，仅仅是删除掉数字的小数部分和小数点，不管参数是正数还是负数。
        let mid = Math.trunc((e + s) / 2)
        if (target < letters[mid]) {
            e = mid
        } else {
            s = mid + 1
        }
    }
    return letters[s]
};

// [540]有序数组的 Single Element
// 自己写的（思路和二分查找不同）
function singleNonDuplicate(nums) {
    if (nums.length === 1) return nums;
    let flag = false;
    for(let index = 0; index < nums.length - 1; index++) {
        const item = nums[index];
        if (!flag && item === nums[index + 1]) {
            flag = true;
        } else if (flag && item === nums[index - 1]){
            flag = false;
        } else if (!flag && item !== nums[index + 1]) {
            return nums[index];
        }
    }
    if (flag) {
        if (nums[nums.length - 1] === nums[nums.length - 2]) {
            return null
        } else {
            return nums[nums.length - 2];
        }
    }
    return nums[nums.length - 1]
}

// [278]第一个错误的版本
var solution = function(isBadVersion) {
    /**
     * @param {integer} n Total versions
     * @return {integer} The first bad version
     */
    return function(n) {
        let start  = 1;
        let end = n;
        while(start <= end) {
            let mid = Math.floor(start + (end - start) / 2);
            if (isBadVersion(mid)) {
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        }
        return start;
    };
};

// 【153】旋转数组的最小数字
// 类似于searchInReserse--->旋转数组中查找某个值，findMin---> 旋转数组中找到最小的值
function findMin(nums) {
    let start = 0;
    let end = nums.length - 1;
    while(start < end) {
        let mid = Math.floor(start + (end - start) / 2);
        if (nums[mid] <= nums[end]) {
            end = mid;
        } else {
            start = mid + 1;
        }
    }
    return nums[start];
}

// [34] 在排序数组中查找元素的第一个和最后一个位置,复制的别人的。思路是利用两次二分查找找到起始指针位置和结束指针位置
var searchRange = function (nums, target) {
    // initiate binary search
    let l = 0, r = nums.length - 1;

    // search for the first appearance index of target
    while (l < r) {
        let mid = Math.floor((l + r) / 2);

        // try to push the array to the left smaller half
        // that's why even when nums[mid] == target, we still set r = mid
        nums[mid] >= target ? r = mid : l = mid + 1;
    }

    // after the first while loop, the small index l should already be the first appearance index of target
    // otherwise, target is not in the array and [-1, -1] should be returned
    if (nums[l] !== target) return [-1, -1];

    // now we have the first appearance index of target, and it is the small index l
    // we can store it to a new variable for further usage
    let start = l;

    // since both of the indices were changed (both of them are at the first appearance index of target)
    // we need to reset the big index to the end of the array to do the second binary search
    // to find the last appearance index of the target
    r = nums.length - 1;

    // search for the last appearance index of the target
    while (l < r) {
        let mid = Math.floor((l + r) / 2);

        // nums[mid] <= target? l = mid : r = mid -1
        // the above will not work as it will run into infinite loop
        nums[mid] <= target ? l = mid + 1 : r = mid;
    }

    // after the second while loop, now l == nums.length - 1
    // now there are 2 conditions: target is also appeared at the last index of the array, or not
    // store the last appearance index of target to another variable
    let end = nums[l] === target ? l : l - 1;

    // finally return the two indices into an array
    return [start, end];
};

// (4)分治：一般是求总的数量，或者最多有几种方法，经常使用的是递归解决
// 【241】为运算表达式设计优先级
var diffWaysToCompute = function(expression) {
    let result = [];
    for(let i = 0; i < expression.length; i++) {
        if(['+', '-', '*'].includes(expression[i])) {
            let left = diffWaysToCompute(expression.slice(0, i));
            let right = diffWaysToCompute(expression.slice(i + 1));
            for(let j of left) {
                for(let k of right) {
                    if (expression[i] === '+') {
                        result.push(j + k);
                    }
                    if (expression[i] === '-') {
                        result.push(j - k);
                    }
                    if (expression[i] === '*') {
                        result.push(j * k);
                    }
                }
            }
        }
    }
    return result.length ? result : [Number(expression)];
};

// 95. 不同的二叉搜索树 II
// 给定一个整数 n，生成所有由 1 ... n 为节点所组成的 二叉搜索树
var generateTrees = function(n) {
    function generateNode(arr) {
        let result = [];
        for(let i = 0; i < arr.length; i++) {
            let val = arr[i];
            let rightArr = arr.slice(i + 1);
            let leftArr = arr.slice(0, i);
            const leftNodes = generateNode(leftArr);
            const rightNodes = generateNode(rightArr);
            if (rightNodes.length && leftNodes.length) {
                 for(leftNode of leftNodes) {
                    for(rightNode of rightNodes) {
                        let node = new TreeNode(val);
                        node.left = leftNode;
                        node.right = rightNode;
                        result.push(node);
                    }
                }
            } else if(rightNodes.length) {
                for(rightNode of rightNodes) {
                    let node = new TreeNode(val);
                    node.left = null;
                    node.right = rightNode;
                    result.push(node);
                }
            } else if(leftNodes.length) {
                for(leftNode of leftNodes) {
                    let node = new TreeNode(val);
                    node.right = null;
                    node.left = leftNode;
                    result.push(node);
                }
            } else {
                let node = new TreeNode(val);
                result.push(node);
            }
        }
        return result;
    }
    // 这里使用 n = Array(n).map((item, index) => (index + 1)); 不行，必须解构一下
    n = [...Array(n)].map((item, index) => (index + 1));
    return generateNode(n);
};

// 上面的4个if...else 其实是为了覆盖rightNodes或者leftNodes长度为0的情况，这是可以用返回[null]，避免长度为0，简化代码
var generateTrees2 = function(n) {
    function generateNode(arr) {
        if(!arr.length) return [null]; // 注意这一行
        let result = [];
        for(let i = 0; i < arr.length; i++) {
            let rightArr = arr.slice(i + 1);
            let leftArr = arr.slice(0, i);
            const leftNodes = generateNode(leftArr);
            const rightNodes = generateNode(rightArr);
            for(leftNode of leftNodes) {
                for(rightNode of rightNodes) {
                    let node = new TreeNode(arr[i]);
                    node.left = leftNode;
                    node.right = rightNode;
                    result.push(node);
                }
            }
        }
        return result;
    }
    n = [...Array(n)].map((item, index) => (index + 1));
    return generateNode(n);
};


// 在generateTrees2的基础上还可以将递归的结果存储下来，进一步优化。这是别人写的
var generateTrees = function(n) {
    const memo = new Map();
    
    function buildTree(arr) {
        if(!arr.length) return [null];
        if(memo.has(arr.join())) return memo.get(arr.join());
        const result = [];
        
        for(let i = 0; i < arr.length; i++) {
            const left = buildTree(arr.slice(0, i));
            const right = buildTree(arr.slice(i+1));
            
            for(let curLeft of left) {
                for(let curRight of right) {
                    const tree = new TreeNode(arr[i]);
                    tree.left = curLeft;
                    tree.right = curRight;
                    result.push(tree);
                }
            }
        }
        memo.set(arr.join(), result);
        return result;
    }
    return buildTree([...Array(n)].map((_, i) => i+1));
};

// (5) 搜索
// [1091]. 二进制矩阵中的最短路径
/**
 * 
BFS总体的套路是：
1.定义一个队列，将第一个位置push进去；
2.确定搜索方向；
3.循环，直到队列为空

// 【注意】
// 1.队列：用来存储每一轮遍历得到的节点；(数组shift（）)
// 2.标记：对于遍历过的节点，应该将它标记，防止重复遍历。
 */
var shortestPathBinaryMatrix = function (grid) {
    // 缓存矩阵的终点位置
    const m = grid.length - 1;
    const n = grid[0].length - 1;
  
    // 当起点和终点为1时，必然无法到达终点
    if (grid[0][0] === 1 || grid[m][n] === 1) {
      return -1;
    }
  
    // 如果矩阵只有1个点，且为0，路径为1
    if (m === 0 && n === 0 && grid[0][0] === 0) {
      return 1;
    }
  
    let queue = [[0, 0]]; // 使用队列进行BFS搜索
    let level = 1; // 缓存路径长度，起点的长度为1
    // 可以向四周所有方向行走，缓存8个方向
    const direction = [
      [-1, 1], // 右上
      [0, 1], // 右
      [1, 1], // 右下
      [1, 0], // 下
      [1, -1], // 左下
      [-1, 0], // 上
      [0, -1], // 左
      [-1, -1], // 左上
    ];
  
    // 如果队列中有值，则继续搜索
    while (queue.length) {
      // 缓存当前层的节点数量
      let queueLength = queue.length;
  
      // 每次只遍历当前一层的节点
      while (--queueLength >= 0) {
        // 出队一个坐标，计算它可以行走的下一步位置
        const [x, y] = queue.shift();
  
        for (let i = 0; i < direction.length; i++) {
          // 下一步可以向四周行走，计算出相应新坐标
          const newX = x + direction[i][0];
          const newY = y + direction[i][1];
  
          // 如果新坐标超出网格，或者被标记为1，表示无法行走，则跳过
          if (
            newX < 0 ||
            newY < 0 ||
            newX > m ||
            newY > n ||
            grid[newX][newY] === 1
          ) {
            continue;
          }
  
          // 如果新坐标是终点，表示找到路径，返回长度即可
          if (newX === m && newY === n) {
            return level + 1;
          }
          // 将走过的位置标记为1，避免重复行走
          grid[newX][newY] = 1;
          // 将下一步的坐标存入队列，用于下一层循环
          queue.push([newX, newY]);
        }
      }
  
      level++; // 每向前走一层，将步数加1
    }
  
    return -1;
  };


// 127. 单词接龙: BFS遍历
var ladderLength = function(beginWord, endWord, wordList) {
    if(beginWord === endWord) return level;
    if (!wordList.includes(endWord)) return 0;

    let quene = [[beginWord, 1]];

    while(quene.length) {
        let [node, level] = quene.shift();
        for(let i = 0; i < node.length; i++) {
            for(let j = 'a'.charCodeAt(0); j<= 'z'.charCodeAt(0); j++) {
                let str = node.slice(0, i) + String.fromCharCode(j) + node.slice(i+1);
                const index = wordList.indexOf(str);
                if(index > -1) {
                    if(str === endWord) {
                        return level + 1;
                    } else {
                        quene.push([str, level + 1]);
                        wordList.splice(index, 1);
                    }
                }
            }
        }
    }
    return 0;
};

// DFS，【注意】：
// 1.栈：用栈来保存当前节点信息，当遍历新节点返回时能够继续遍历当前节点.（数组pop（））
// 2.标记：和 BFS 一样同样需要对已经遍历过的节点进行标记。
// [695] 查找最大的连通面积
var maxAreaOfIsland = function(grid) {
    let maxCount = 0;
    let row = grid.length;
    let col = grid[0].length;
    for(let i = 0; i < row; i++) {
        for(let j = 0; j < col; j++) {
            maxCount = Math.max(maxCount, dfs(grid, i, j))
        }
    }
    return maxCount;
};
let directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
]
function dfs(grid, i, j) {
    if(i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] === 0) return 0;
    let count = 1;
    grid[i][j] = 0;
    for(let index = 0; index < directions.length; index++) {
        let newRow = i + directions[index][0];
        let newCol = j + directions[index][1];
        count = count + dfs(grid, newRow, newCol);
    }
    return count;
}

// [200]. 岛屿数量
var numIslands = function(grid) {
    let count = 0;
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(grid, i, j);
            }
        }
    }
    return count;
};

let directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
]

function dfs(grid, i, j) {
    if(i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] === '0') return;
    grid[i][j] = '0';
    for(let direc of directions) {
        dfs(grid, direc[0] + i, direc[1] + j);
    }
}

// 417. 能到达的太平洋和大西洋的区域
var pacificAtlantic = function(heights) {
    if(!heights || !heights.length) return [];
    let result = [];
    let row = heights.length;
    let col = heights[0].length;

    let leftTop = [...Array(row)].map(item => Array(col));
    let rightBottom = [...Array(row)].map(item => Array(col));

    for(let i = 0; i < row; i++) {
        dfs(i, 0, leftTop);
        dfs(i, col - 1, rightBottom);
    }

    for(let j = 0; j < col; j++) {
        dfs(0, j, leftTop);
        dfs(row - 1, j, rightBottom);
    }

    for(let i = 0; i < row; i++) {
        for(let j = 0; j < col; j++) {
            if (leftTop[i][j] && rightBottom[i][j]) {
                result.push([i, j]);
            }
        }
    }

    

    function dfs(i, j, canReach) {
        if (canReach[i][j]) return;
        canReach[i][j] = 1;
        let directions = [
            [1, 0],
            [-1, 0],
            [0, -1],
            [0, 1]
        ];
        for(let dire of directions) {
            let newX = dire[0] + i;
            let newY = dire[1] + j;
            if (newX < 0 || newY < 0 || newX >= heights.length || newY >= heights[0].length || heights[i][j] > heights[newX][newY]) {
                continue;
            }
            dfs(newX, newY, canReach);
        }
    }
    return result;
};

// 回溯，主要用于求解排列组合问题


// (6) 动态规划： 参考知乎文章https://zhuanlan.zhihu.com/p/91582909
// 动态规划有三个核心元素：
// 1.最优子结构:局部最优解能决定全局最优解,问题能够分解成子问题来解决.其实我理解就是设计dp的含义
// 2.边界
// 3.状态转移方程

// 什么样的问题适用DP
// 1) 问题是由交叠的子问题所构成，大问题分解为小问题。
// 2) 将交叠子问题的一次次求解→子问题只求解一次，并将结果记录保存。
// 3) 利用空间(子问题存储)来换取时间

/** 斐波那契数列之爬楼梯
 * 递归解法：时间复杂度O(2^n)
*/
var climbStairs = function (n) {
    if(n === 0) {
        return 0;
    }
    if(n === 1) return 1;
    if(n === 2) return 2;
    return climbStairs(n-2) + climbStairs(n - 1);
};
/**
 * 爬楼梯
 * 动态规划解法: 时间复杂度O(n),空间复杂度O(1)
 * dp[i] = dp[i-2] + dp[i-1]
*/
var climbStairs = function (s) {
    if(s <= 2) return s;
    var pre1 = 1, pre2 = 2;
    var current;
    for(i = 3; i<= s; i++) {
        current = pre1 + pre2;
        pre1 = pre2;
        pre2 = current;
    }
    return current;
}
/**
 * 198
 * 抢劫一排住户，但是不能抢邻近的住户，求最大抢劫量
 * 自己写的：复杂度太高（和上面树抢劫一个做法）
 */
function rob(nums) {
    var result = rob(nums, 0);
    return result;
}
var _rob = function (nums, start) {
    if(start > nums.length - 1) return 0;
    var val = nums[start];
    var val2 = 0;
    if(start + 2 < nums.length) {
        val = val + _rob(nums, start + 2)
    }
    if(start + 1 < nums.length) {
        val2 = _rob(nums, start + 1);
    }
    return Math.max(val, val2);
};
/**
 * 抢劫一排住户，但是不能抢邻近的住户，求最大抢劫量
 * 看别人的
 * dp[i] = Max(dp[i-2] + nums[i], dp[i-1])
 * 用一个数组存下之前的数据
 */
var rob = function (nums) {
    if (nums.length < 2) return nums;
    var pre1 = nums[0], pre2 = Math.max(nums[1], nums[0]);
    var dp = [pre1, pre2];
    for(var i = 2; i <= nums.length - 1; i++) {
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    }
    return dp[dp.length - 1];
}
/**
 * 抢劫一排住户，但是不能抢邻近的住户，求最大抢劫量
 * 看别人的
 * dp[i] = Max(dp[i-2] + nums[i], dp[i-1])
 * 用两个变量存下之前的数据
 */
var rob = function (nums) {
    if(nums.length < 2) return nums;
    var pre1 = nums[0], pre2 = Math.max(nums[0], nums[1]);
    var current = pre2;
    for(var i = 2; i <= nums.length - 1; i++) {
        current = Math.max(pre1 + nums[i], pre2);
        pre1 = pre2;
        pre2 = current;
    }
    return current;
}
/** 
 * 强盗在环形街区抢劫
*/
var circleRob = function (num) {
    if(num.length <= 1) return num;
    return Math.max(_rob(num, 0, num.length - 2), _rob(num, 1, num.length - 1));
}
var _rob = function(nums, start, end) {
    if (end - start <= 1) return nums[start];
    var pre1 = nums[start], pre2 = Math.max(nums[start], nums[start + 1]);
    var current = pre2;
    for (var i = start + 2; i <= end; i++) {
        current = Math.max(pre1 + nums[i], pre2);
        pre1 = pre2;
        pre2 = current;
    }
    return current;
}

/**
 * 按平方数来分割整数
 * https://leetcode-cn.com/problems/perfect-squares/comments/
 * 279
 * dp[i] = dp[i - x] + 1
 * 1 <= x <= i, x属于1，4，9，16 或者可以把条件设置成 下面代码中的 i-j*j >= 0
 */
 var numSquares = function(n) {
    let dp = Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for(let i = 2; i < n + 1; i++) {
        let min = i; // 1 + 1 + 1...
        for(let j = 1; i - j * j >= 0; j++) {
            min = Math.min(min, dp[i - j * j] + 1);
        }
        dp[i] = min;
    }
    return dp[n];
};


/** 
 * [64] 矩阵的最小路径和
*/
var minPathSum = function (grid) {
    if (!grid.length || !grid[0].length) return 0;
    var row = grid.length;
    var col = grid[0].length;
    var dp = [];
    for (var i = 0; i <= row - 1; i++) {
        dp.push([grid[0][0]]);
        for (var j = 0; j <= col - 1; j++) {
            if (i === 0) {
                dp[0][j] = j > 0 ? dp[0][j - 1] : 0;
            } else if (j === 0) {
                dp[i][0] = i > 0 ? dp[i - 1][0] : dp[i][0];
            } else {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]);
            }
            dp[i][j] = dp[i][j] + grid[i][j];
        }
    }
    return dp[row - 1][col - 1];
};

/** 
 * 矩阵的总路径数 https://leetcode-cn.com/problems/unique-paths/
*/
var uniquePaths = function(m,n) {
    // 不要用这种方式，因为fill(new Array(n))其实塞进去的是同一个数组的引用，导致修改dp[0][1]的时候其实dp[1][1], dp[2][1]都被修改了
    // var dp = new Array(m).fill(new Array(n).fill(1));

    let dp = new Array(m);
    for(let i = 1; i < m; i++) {
        // 如果内层数组元素是基础数据，可以用fill，如果是对象，则不能用fill，否则又会出现上面说的，塞进的是同一个内存地址
        dp[i] = new Array(n).fill(1);
    }
    for(let i = 1; i < m; i++) {
        for(let j = 1; j < n; j++) {
            dp[i][j] =  dp[i][j-1] + dp[i-1][j];
        }
    }
    return dp[m-1][n-1];
}

// 动态规划 之  背包客
// 原理参考地址  https://blog.csdn.net/mu399/article/details/7722810  
// 代码参考地址  https://segmentfault.com/a/1190000012829866

// f[i,j] = Max{ f[i-1,j-Wi]+Pi( j >= Wi ),  f[i-1,j] }
/*
f[i,j]表示在前i件物品中选择若干件放在承重为 j 的背包中，可以取得的最大价值。
Pi表示第i件物品的价值，Wi表示第i件物品的重量
决策：为了背包中物品总价值最大化，第 i件物品应该放入背包中吗 ？
*/

function bag(weights, values, W) {
    const n = weights.length;
    let dp = [];
    dp[-1] = new Array(W + 1).fill(0);
    let selected = [];
    // 得到最大价值
    for(let i = 0; i < n; i++) {
        dp[i] = [];
        for(let j=0; j<=W; j++) {
            if(j < weights[i]) {
                dp[i][j] = dp[i - 1][j]
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], (dp[i - 1][j-weights[i]])+values[i]);
               
            }
        }
    }
    // 最大价值时具体选了哪几个物品
    for(let i = n - 1, j = W; i>= 0; i--) {
        if(dp[i][j] > dp[i - 1][j]) {
            selected.push({
                index: i,
                weights: weights[i],
                values: values[i]
            });
            j = j - weights[i];
        }
    }
    console.log(dp[n - 1][W]);
    console.log(selected);
 }
bag([2,2,6,5,4], [6,3,5,4,6], 10);


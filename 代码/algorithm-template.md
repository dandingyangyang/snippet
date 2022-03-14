<!--
 * @Description: 
 * @Author: yangxia
 * @Date: 2022-02-27 14:10:49
-->
# 算法思想
### 一. 排序算法

1. 冒泡排序

思路：每次选择当前轮可比较数中最大的一个放在最后面，比较相邻元素，将队尾的元素先排好

时间复杂度： O(n^2)

是否稳定： 稳定

```javascript
function bubble(arr) {
    for(let i = 0; i < arr.length - 1; i++) {
        for(j = 0; j < arr.length - 1 - i; j++) {
            if(arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}
```

2. 选择排序

思路：固定位置，找出当前位置应该放的元素，找到队首位置改放的元素

时间复杂度：O(n^2)

是否稳定：不稳定 如：58529

```javascript
function choose(arr) {
    for(let i = 0; i < arr.length - 1; i++) {
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[i] > arr[j]) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
```

3. 插入排序

思路：保证前面数组有序，每增加一个数据，将新数据和队列队尾最后一个数据比较，若交换位置后，继续和有序队列中前一个数据比较，直到有一个数据比新数据小，则找到了新数据的位置

时间复杂度：O(n^2)

是否稳定： 稳定

```javascript
function insert(arr) {
    for(let i = 1; i < arr.length; i++) {
        let j = i;
        let baseVal = arr[j];
        while(j > 0 && arr[j - 1] > baseVal) {
            arr[j] = arr[j - 1];
            j--
        }
        arr[j] = baseVal;
    }
    return arr;
}
```

4. 归并排序

思路：取中间位置，将数组分成左右两部分，分到最后只有一个元素的时候，再进行两两合并，此时合并过程中左右两个数组是有序的。

时间复杂度：n*log(n)

是否稳定：稳定

```javascript
function mergeSort(arr) {
    if(arr.length <= 1) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);
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
```

5. 快排

思路：取一个基准值，大于基准值的放右边，小于基准值的放左边

时间复杂度： n*log(n)

稳定性：不稳定

(1) 需要借助额外的数组实现。这种方法和归并有点像

```javascript
function quickSort(arr) {
    if(arr.length <= 1) return arr;
    let mid = Math.floor(arr.length / 2);
    // 每次要摘一个出来，否则当最后只有[5,6,4]这种midValue是最大值的时候回出现死循环，每次拆完之后还是整个数组
    let midVal = arr.splice(mid, 1)[0];
    let left = [];
    let right = [];
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] < midVal) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([midVal]).concat(quickSort(right))
}
```

(2) 不借助额外的数组实现。

```javascript
function quickSort(arr) {
    quick(arr, 0, arr.length - 1);
    return arr;
}

function quick(arr, left, right) {
    if(left < right) {
        // 返回的是左边都是小于等于midVal，右边都是大于等于midVal的那个坐标（返回的那个坐标对应的数字也不代表就是右边最小的值，这里注意和topk解法作比较）
        let index = partition(arr, left, right);
        if(left < index - 1) {
            quick(arr, left, index - 1);
        }
        if(index < right) {
            quick(arr, index, right);
        }
    }
}

function partition(arr, left, right) {
    // 返回的是左边都是小于等于midVal，右边都是大于等于midVal的那个坐标（返回的那个坐标对应的数字也不代表就是右边最小的值，这里注意和topk解法作比较）
    let midVal = arr[Math.floor((left + right) / 2)];
    let i = left;
    let j = right;
    // 这里有等于号
    while(i <= j) {
        while(arr[i] < midVal) {
            i++
        }
        while(arr[j] > midVal) {
            j--;
        }

        if(i <= j) {
            // swap
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

            i++;
            j--;
        }
    }
    return i;
}
```

6. 堆排序

思路：构建堆的时候从下往上，调整堆的时候从上往下。从小到大排序，构建大顶堆

算法复杂度：

稳定性：不稳定

```javascript
    function heapSort(elements) {
        buildHeap(elements);
        changeHeap(elements);
    }
    function buildHeap(elements) {
        for(let i = Math.ceil(elements.length) / 2; i >=0; i--) {
            heapAjust(elements, i, elements.length)
        }
    }

    function changeHeap(elements) {
        for(let i = elements.length - 1; i > 0; i--) {
            let temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;

            heapAjust(elements, 0, i);
        }
    }

    function heapAjust(elements, pos, len) {
        let leftChildPosition = pos * 2 + 1；
        let rightChildPosition = pos * 2 + 2;
        if (leftChildPosition >= len) return;
        let maxChildPosition = leftChildPosition;
        if(rightChildPosition < len && elements[rightChildPosition] > elements[leftChildPosition]) {
            maxChildPosition = rightChildPosition;
        }
        if(arr[maxChildPosition] > arr[pos]) {
            let temp = arr[pos];
            arr[pos] = arr[maxChildPosition];
            arr[maxChildPosition] = temp;

            headAjust(elements, maxChildPosition, len);
        }
    }
```

7. topK算法

```javascript
    function findKthLargest(arr) {
        return quick(arr, 0, arr.length - 1, arr.length - k);
    }

    function quick(arr, left, right, k) {
        if(left < right) {
            let index = partition(arr,left, right);
            if(index === k) {
                return arr[k]
            } else if(k < index) {
                return quick(arr, left, index - 1, k);
            } else {
                return quick(arr, index + 1, right, k);
            }
        }
        return arr[left];
    }

    function partition(arr, left, right) {
        let midVal = arr[Math.floor((left + right) / 2)];
        let i = left;
        let j = right;
        while(i < j) {
            while(arr[i] < midVal) {
                i++;
            }
            while(arr[j] > midVal) {
                j--;
            }

            if(i < j) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            if(i !== j && arr[i] !== arr[j]) {
                i++
            }
        }
        return i;
    }
```

### 二. 查找算法

1. 二分查找

```javascript
    function binarySearch(arr, target) {
        let start = 0;
        let end = arr.length - 1;
        while(start <= end) {
            let mid = Math.floor((start + end) / 2);
            if (arr[mid] === target) {
                return mid;
            } else if(arr[mid] > target) {
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        }
        return -1;
    }
```

2. 二分查找的变体

(1)while(start <= end) 注意有没有等号。如果不知道的话就假设有等号试试，然后去执行一遍
(2)返回的是start（有时候是end）不是-1

区别：
基础二分查找和变体二分查找解决的不是一种问题：

基础二分查找主要是寻找nums里面和target相等的元素；

变体二分查找寻找的是nums里符合某个条件的元素，寻找的是while循环结束时对应的start和end值，比如[69]: 求开方，nextGreatestLetter，[278]第一个错误的版本。

### 三. 数组相关的方法

先**1.排序**，排序之后想想**2.双指针**， 然后在想想**3.单调栈**，或者是**4.贪心思想**

```javascript
// 栈
var dailyTemperatures = function(T) {
    let stack = [];
    let result = [];
    for(let i = 0; i < T.length; i++) {
        // 用栈实现
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
```

### 四. 分治

一般是求总的数量，或者最多有几种方法，经常使用的是递归解决

```javascript
// 构建不同的搜索二叉树
function generateTrees(n) {
    n = [...new Array(n)].map((item, index) => index + 1);

    function generateNode(n) {
        let result = [];
        if (!n.length) return [null];
        for (let i = 0; i < n.length; i++) {
            const left = generateNode(n.slice(0, i));
            const right = generateNode(n.slice(i + 1));
            for (let l of left) {
                for (let r of right) {
                    let node = new TreeNode(n[i]);
                    node.left = l;
                    node.right = r;
                    result.push(node);
                }
            }
        }
        return result;
    }
    return generateNode(n)
}
```

### 五. 搜索

1. BFS
在程序实现 BFS 时需要考虑以下问题：

- 队列nodes，取值使用shift：用来存储每一轮遍历得到的节点，且按层次变量节点。const node = nodes.shift();
- 标记：对于遍历过的节点，应该将它标记，防止重复遍历。grid[x][y] = 1

```javascript
function shortestPathBinaryMatrix(grid) {
    const row = grid.length;
    const col = grid[0].length;
    if (!grid || grid[0][0] || grid[row - 1][col - 1]) return -1;

    // 如果矩阵只有1个点， 且为0， 路径为1
    if (row === 1 && col === 1 && grid[0][0] === 0) {
        return 1;
    }

    let level = 1;
    const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ]

    let nodes = [
        [0, 0]
    ];
    while (nodes.length) {
        let length = nodes.length;
        while (length--) {
            const node = nodes.shift();
            const [x, y] = node;
            for (let dire of directions) {
                const newX = dire[0] + x;
                const newY = dire[1] + y;
                if (newX < 0 || newY < 0 || newX >= row || newY >= col || grid[newX][newY]) continue;
                if (newX === row - 1 && newY === col - 1) {
                    return level + 1;
                }
                nodes.push([newX, newY]);
                grid[newX][newY] = 1;
            }
        }
        level++;
    }
    return -1;
}
```

2. DFS：常用来求解这种 可达性 问题

- 栈stack：用栈来保存当前节点信息，当遍历新节点返回时能够继续遍历当前节点。可以使用递归栈。感觉我现在做的题都是通过递归来实现dfs的，没有通过栈来实现
- 标记：和 BFS 一样同样需要对已经遍历过的节点进行标记。

```javascript
// 最大岛屿数量
var maxAreaOfIsland = function(grid) {
    let row = grid.length;
    let col = grid[0].length;
    let maxCount = 0;

    let directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ]

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            maxCount = Math.max(maxCount, dfs(grid, i, j))
        }
    }

    function dfs(grid, i, j) {
        if (i < 0 || j < 0 || i >= row || j >= col || !grid[i][j]) return 0;
        let count = 1;
        grid[i][j] = 0;
        for (let d of directions) {
            const newX = d[0] + i;
            const newY = d[1] + j;
            count += dfs(grid, newX, newY)
        }
        return count;
    }

    return maxCount;
};
```

3. 回溯

Backtracking（回溯）属于 DFS。

普通 DFS 主要用在 可达性问题 ，这种问题只需要执行到特点的位置然后返回即可。
而 Backtracking 主要用于求解 排列组合 问题，例如有 { 'a','b','c' } 三个字符，求解所有由这三个字符排列得到的字符串，这种问题在执行到特定的位置返回之后还会继续执行求解过程。
因为 Backtracking 不是立即返回，而要继续求解，因此在程序实现时，需要注意对元素的标记问题：

在访问一个新元素进入新的递归调用时，需要将新元素标记为已经访问，这样才能在继续递归调用时不用重复访问该元素；
但是在递归返回时，需要将元素标记为未访问，因为只需要保证在一个递归链中不同时访问一个元素，可以访问已经访问过但是不在当前递归链中的元素。

```javascript
    // 47 含有相同元素求排列
    var permuteUnique = function(nums) {
    nums.sort((a, b) => a - b);
    let result = [];
    let path = [];
    let used = [];

    let length = nums.length;

    function dfs() {
        if (path.length === length) {
            result.push(path.slice(0));
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i] || (nums[i] === nums[i - 1]) && !used[i - 1])
                continue;
            path.push(nums[i]);
            used[i] = true;
            dfs();
            path.pop();
            used[i] = false;
        }
    }

    dfs();
    return result;
};
```

39. Combination Sum (Medium)  TODO: 考虑背包客解法。结论：背包客做法可以得到结果的总量，但是无法得到每种结果的详细情况，所以还是得用搜索的方式的到具体情况

```javascript
// 39. 组合总和
var combinationSum = function(candidates, target) {
    let result = [];

    function dfs(index, target, path) {
        if (target === 0) {
            result.push(path.slice());
            return;
        }
        if (target < 0) return;
        for (let i = index; i < candidates.length; i++) {
            dfs(i, target - candidates[i], path.slice(0).concat(candidates[i]));
        }
    }

    dfs(0, target, []);
    return result;
};
```

### 六.动态规划

1. 设计dp的含义，寻找dp的状态转移方程，设置初始值

```javascript
// 62.矩阵的总路径数
var uniquePaths = function(m, n) {
    let dp = [];
    for(let i = 0; i < m; i++) {
        dp[i] = [];
        for(let j = 0; j < n; j++) {
            if (i === 0 || j === 0) {
                dp[i][j] = 1;
            } else {
                dp[i][j] = dp[i][j - 1] + dp[i - 1][j];
            }
        }
    }
    return dp[m - 1][n - 1];
};
```

```javascript
// 343. 分割整数的最大乘积
var integerBreak = function(n) {
    let dp = [0, 0, 1, 2];
    for(let i = 4; i <= n; i++) {
        dp[i] = 1;
        for(let j = 1; j <= Math.ceil(i / 2); j++) {
            const k = i - j;
            dp[i] = Math.max(dp[i], dp[j] * dp[k], j * k, j * dp[k], dp[j] * k);
        }
    }
    return dp[n];
};
```

```javascript
/** 最长公共子序列
 * @param {string} text1
 * @param {string} text2
 f[i, j] = f[i - 1, j - 1] + 1 // s1[i] 和 s2[j]相等时
 f[i, j] = Math.max(f[i - 1, j],f[i, j - 1]) // s1[i] 和 s2[j]不相等时
 * @return {number} 
 */
var longestCommonSubsequence = function(text1, text2) {
    const s1Length = text1.length;
    const s2Length = text2.length;
    const dp = [...new Array(s1Length + 1)].map(() => [...new Array(s2Length + 1)].fill(0));

    for(let i = 1; i <= s1Length; i++) {
        for(let j = 1; j <= s2Length; j++) {
            if(text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
            }
        }
    }
    return dp[s1Length][s2Length]
};
```

2. 背包客问题

```javascript
// 416.划分数组为和相等的两部分
// 0-1 背包：每个物品只有一个
var canPartition = function(nums) {
    // 01背包问题：数值是重量，每个元素价值都是1。背包的承重为总和的一半

    let sum = nums.reduce((pre, num) => num + pre);
    if(sum % 2) return false;
    const half = sum / 2;

    let dp = [true];

    for(let num of nums) {
        // 注意这里的倒叙
        for(let i = half; i > 0; i--) {
            dp[i] = dp[i] || (i >= num && dp[i - num])
        }
    }
    return dp[half];
};
```

```javascript
// 322. 零钱兑换
// 完全背包：物品数量不限
var coinChange = function(coins, amount) {
    let dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let coin of coins) {
        // 注意这里的正序
        for (let i = 1; i <= amount; i++) {
            if (coin > i) {
                dp[i] = dp[i];
            } else {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1)
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
};
```

```javascript
// 139. 单词拆分
// 求解顺序的完全背包问题时，对物品的迭代应该放在最里层，对背包的迭代放在外层，只有这样才能让物品按一定顺序放入背包中。
var wordBreak = function(s, wordDict) {
    let dp = new Array(s.length + 1).fill(false);
    dp[0] = true;

    // 这里得把物品放在内层循环
    for(let i = 1; i <= s.length; i++) {
        for(let word of wordDict) {
            if(i >= word.length && word === s.slice(i - word.length, i)) {
                dp[i] = dp[i] || dp[i - word.length]
            }
        }
    }
    
    return dp[s.length]
};
```


# 数据结构

### 一. 链表相关的方法

1. 反转链表

```javascript
    function reverseList(head) {
        if(!head || !head.next) return head;
        let current, pre, next;
        current = head;
        while(current) {
            next = current.next;
            current.next = pre;
            pre = current;
            current = current.next;
        }
        return pre;
    }
```

2. 判断链表是否有环

```javascript
    function hasCycle(head) {
        if(!head) return false;
        let fast = head;
        let slow = head;
        while(slow && fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
            if(slow === fast) return true
        }
        return false;
    }
```

3. 寻找链表中环的入口节点

```javascript
    function entryNodeofLoop(head) {
        if(!head) return head;
        let fast = slow = head;
        while(slow && fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
            if(slow === fast) {
                fast = head;
                while(slow && fast && slow !== fast) {
                    slow = slow.next;
                    fast = fast.next;
                }
                return slow;
            }
        }
        return null;
    }
```

### 二. 树

1. 树的遍历
(1) 广度遍历

```javascript
    // 使用的是队列
    function levelOrderTravel(root) {
        if(!root) return [];
        let nodes = [root];
        let values = [];
        while(nodes.length) {
            let node = nodes.shift();
            values.push(node.val);
            node.left && nodes.push(left);
            node.right && nodes.push(right);
        }
        return values;
    }
```

按层次打印二叉树

```javascript
    function levelOrderTravel(root) {
        if(!root) reutrn [];
        let nodes = [root];
        let values = [];
        while(nodes.length) {
            let length = nodes.length;
            let value = [];
            while(length--) {
                let node = nodes.shift();
                value.push(node.val);
                node.left && nodes.push(node.left);
                node.right && nodes.push(node.right);
            }
            values.push(value);
        }
        return values;
    }
```

(2) 深度遍历

- 前序遍历

```javascript
    // 使用递归。
    function preOrderTravel(root) {
        if(!root) return null;
        let values = [];
        travel(root, values);
        return values;
    }
    function travel(root, values) {
        if(!root) return;
        value.push(root.val);
        travel(root.left, values);  
        travel(root.right, values); 
    }
    
    // 不使用递归。使用的是栈
    function preOrderTravel(root) {
        if(!root) return [];
        let stack = [root];
        let values = [];
        while(stack.length) {
            let node = stack.pop();
            values.push(node.val);
            node.right && stack.push(node.right);
            node.left && stack.push(node.left);
        }
        return values;
    }
```

- 后序遍历

```javascript
    // 使用递归
    function postOrderTravel(root) {
        if(!root) return null;
        let values = [];
        travel(root, values);
        return values;
    }
    function travel(root, values) {
        if(!root) return;
        value.push(root.val);
        travel(root.right, values);
        travel(root.left, values);  
    }
    
    // 不使用递归
    function postOrderTravel(root) {
        if(!root) return [];
        let stack = [root];
        let values = [];
        while(stack.length) {
            let node = stack.pop();
            values.unshift(node.val);
            node.left && stack.push(node.left);
            node.right && stack.push(node.right);
        }
        return values;
    }
```

- 中序遍历

```javascript
    // 使用递归
    function midOrderTravel(root) {
        if(!root) return null;
        let values = [];
        travel(root, values);
        return values;
    }
    function travel(root, values) {
        if(!root) return;
        travel(root.left, values); 
        value.push(root.val);
        travel(root.right, values); 
    }
    
    // 不使用递归
    function midOrderTravel(root) {
        if(!root) return [];
        let stack = [root];
        let values = [];
        while(root || stack.length) {
            if(root) {
                stack.push(root);
                root = root.left;
            } else {
                root = root.pop();
                values.push(root.val);
                root = root.right;
            }
        }
        return values;
    }
```

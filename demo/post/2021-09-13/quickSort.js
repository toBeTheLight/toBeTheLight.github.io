const array = require('./array')

function exch (array, i , j) {
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
}
// 非原地需要额外内存的排序很简单，实现省略
// 原地排序
function quickSort (array) {
    // 省略打乱步骤
    function sort (low, high) {
        if (low >= high) return
        let left = low
        let right = high + 1
        const target = array[low]
        while (true) {
            while(array[++left] < target && left <= right) {}
            while(array[--right] > target && right >= left) {}
            if (left >= right) break
            exch(array, left, right)
        }
        exch(array, low, right)
        sort(low, right - 1)
        sort(right + 1, high)

    }
    sort(0, array.length - 1)
    return array
}

module.exports = quickSort

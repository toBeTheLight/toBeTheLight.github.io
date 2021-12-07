const array = require('./array')
// 自顶向下归并排序
// 由大到小拆解
function mergeSort (array) {
    function sort (array, low, mid, high) {
        if (low >= high) return
        sort (array, low, Math.floor((low + mid)/2), mid)
        sort (array, mid + 1, Math.floor((mid + 1 + high)/2), high)
        let i = low, j = mid + 1
        let arraySorted = []
        while(i <= mid || j <= high) {
            if (i > mid) {
                arraySorted.push(array[j++])
            } else if (j > high) {
                arraySorted.push(array[i++])
            } else if (array[i] <= array[j]) {
                arraySorted.push(array[i++])
            } else if (array[j] < array[i]) {
                arraySorted.push(array[j++])
            }
        }
        for (let index = 0; index < arraySorted.length; index ++) {
            array[low + index] = arraySorted[index]
        }
    }
    sort(array, 0, Math.floor(array.length/2), array.length - 1)
    return array
}
// 还有自底向上的归并
// 直接拆然后合
module.exports = mergeSort

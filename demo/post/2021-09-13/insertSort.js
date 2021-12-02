// 留空插入
function insertSort (array) {
    for (let i = 1; i < array.length; i++) {
        const target = array[i]
        let empty
        for (let j = i - 1; j >= 0; j--) {
            if (target < array[j]) {
                array[j + 1] = array[j]
                empty = j
            } else {
                break
            }
        }
        if (empty !== undefined) array[empty] = target
    }
    return array
}
// 交换插入
function insertSort2 (array) {
    for (let i = 1; i < array.length; i++) {
        for (let j = i; j >= 1; j--) {
            if (array[j] < array[j - 1]) {
                const temp = array[j]
                array[j] = array[j - 1]
                array[j - 1] = temp
            } else {
                break
            }
        }
    }
    return array
}

module.exports = insertSort
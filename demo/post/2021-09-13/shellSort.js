function shellSort (array) {
    const length = array.length
    for (let k = Math.ceil(length/3); k >= 1; k = Math.floor(k/3)) {
        // 每组的长度
        for (let i = k; i <= length; i++) {
            const target = array[i]
            let empty
            for (let j = i - k; j >=0 ; j = j - k) {
                if (target < array[j]) {
                    array[j + k] = array[j]
                    empty = j
                } else {
                    break
                }
            }
            if (empty !== undefined) array[empty] = target
        }
    }
    return array
}

function shellSort2 (arr) {
    var len = arr.length, temp, gap = 1
    while(gap < len/3) { gap = gap * 3 + 1}
    for (gap; gap >0; gap = Math.floor(gap/3)) {
        for (var i = gap; i < len; i++) {
            temp = arr[i]
            for (var j = i - gap; j >=0 && arr[j] > temp; j -= gap) {
                arr[j + gap] = arr[j]
            }
            arr[j+gap] = temp
        }
    }
    return arr
}

module.exports = shellSort
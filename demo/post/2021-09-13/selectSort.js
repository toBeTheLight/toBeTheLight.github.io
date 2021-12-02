module.exports = function selectSort (array) {
    if (!array || !array.length) return
    for (let i = 0; i < array.length; i++) {
        let minIndex = i
        for (j = i+1;j<array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j
            }
        }
        const change = array[i]
        array[i] = array[minIndex]
        array[minIndex] = change 
    }
    return array
}


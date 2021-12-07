const { performance, PerformanceObserver } = require('perf_hooks')
const array = require('./array')
const selectSort = require('./selectSort')
const insertSort = require('./insertSort')
const shellSort = require('./shellSort')
const mergeSort = require('./mergeSort')
const quickSort = require('./quickSort')

const obs = new PerformanceObserver((list, observer) => {
    console.log(list.getEntries());
    observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

function test () {
    let copyArray = JSON.parse(JSON.stringify(array))
    performance.mark('start')
    const r1 = shellSort(copyArray)
    performance.mark('end')
    performance.measure('shell', 'start', 'end')

    copyArray = JSON.parse(JSON.stringify(array))
    performance.mark('start1')
    const r2 = insertSort(copyArray)
    performance.mark('end1')
    performance.measure('insert', 'start1', 'end1')

    copyArray = JSON.parse(JSON.stringify(array))
    performance.mark('start2')
    const r3 = mergeSort(copyArray)
    performance.mark('end2')
    performance.measure('merge', 'start2', 'end2')

    copyArray = JSON.parse(JSON.stringify(array))
    performance.mark('start3')
    const r4 = quickSort(copyArray)
    performance.mark('end3')
    performance.measure('quick', 'start3', 'end3')

    console.log(JSON.stringify(r1) === JSON.stringify(r2))
    console.log(JSON.stringify(r2) === JSON.stringify(r3))
    console.log(JSON.stringify(r3) === JSON.stringify(r4))
}
test()
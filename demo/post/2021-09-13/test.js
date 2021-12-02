const { performance, PerformanceObserver } = require('perf_hooks')
const array = require('./array')
const selectSort = require('./selectSort')
const insertSort = require('./insertSort')
const shellSort = require('./shellSort')

const obs = new PerformanceObserver((list, observer) => {
    console.log(list.getEntries());
    observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

function test () {
    let copyArray = JSON.parse(JSON.stringify(array))
    performance.mark('start')
    shellSort(copyArray)
    performance.mark('end')
    performance.measure('shell', 'start', 'end')
    copyArray = JSON.parse(JSON.stringify(array))
    performance.mark('start1')
    insertSort(copyArray)
    performance.mark('end1')
    performance.measure('insert', 'start1', 'end1')
}
test()
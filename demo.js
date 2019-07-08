function sleep(time) {
  let startTime = new Date()
  while (new Date() - startTime < time) {}
  console.log('1s over')
}
setTimeout(() => {
  console.log('setTimeout - 1')
  setTimeout(() => {
      console.log('setTimeout - 1 - 1')
      sleep(1000)
  })
  new Promise(resolve => resolve()).then(() => {
      console.log('setTimeout - 1 - then')
      new Promise(resolve => resolve()).then(() => {
          console.log('setTimeout - 1 - then - then')
      })
  })
  sleep(1000)
})

setTimeout(() => {
  console.log('setTimeout - 2')
  setTimeout(() => {
      console.log('setTimeout - 2 - 1')
      sleep(1000)
  })
  new Promise(resolve => resolve()).then(() => {
      console.log('setTimeout - 2 - then')
      new Promise(resolve => resolve()).then(() => {
          console.log('setTimeout - 2 - then - then')
      })
  })
  sleep(1000)
})
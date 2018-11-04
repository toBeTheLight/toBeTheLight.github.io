document.querySelector('#group6-1').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    setTimeout(openByWindow,500)
  }
})
document.querySelector('#group6-2').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    setTimeout(openByMockClickA,500)
  }
})
document.querySelector('#group6-3').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    setTimeout(openByMockSubmit,500)
  }
})
document.querySelector('#group6-4').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    setTimeout(openByMockButton,500)
  }
})

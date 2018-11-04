document.querySelector('#group5-1').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    openByWindow()
  }
})
document.querySelector('#group5-2').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    openByMockClickA()
  }
})
document.querySelector('#group5-3').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    openByMockSubmit()
  }
})
document.querySelector('#group5-4').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    openByMockButton()
  }
})

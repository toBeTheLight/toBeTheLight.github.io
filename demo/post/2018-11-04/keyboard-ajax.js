document.querySelector('#group7-1').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    ajax(openByWindow)
  }
})
document.querySelector('#group7-2').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    ajax(openByMockClickA)
  }
})
document.querySelector('#group7-3').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    ajax(openByMockSubmit)
  }
})
document.querySelector('#group7-4').addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    ajax(openByMockButton)
  }
})

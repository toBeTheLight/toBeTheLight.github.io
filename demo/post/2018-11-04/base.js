var openByWindow = function () {
  window.open('window.open')
}
var domA
var openByMockClickA = function (url) {
  url = url || 'openByMockClickA'
  if (!domA) {
    domA = domA || document.createElement('a')
    domA.setAttribute('target', '_blank')
    document.body.appendChild(domA)
  }
  domA.setAttribute('href', url)
  domA.click()
}
var domForm
var openByMockSubmit = function (action) {
  action = action || 'openByMockSubmit'
  if (!domForm) {
    domForm = document.createElement('form')
    domForm.setAttribute('method', 'get')
    domForm.setAttribute('target', '_blank')
    document.body.appendChild(domForm)
  }
  domForm.setAttribute('action', action)
  domForm.submit()    
}
var domForm2
var domButton
var openByMockButton = function (action) {
  action = action || 'openByMockButton'
  if (!domForm2) {
    var domForm2 = domForm2 || document.createElement('form')
    domForm.setAttribute('method', 'get')
    domForm.setAttribute('target', '_blank')
    var domButton = document.createElement('button')
    domForm.appendChild(domButton)
    document.body.appendChild(domForm)
  }
  domForm.setAttribute('action', action)
  domButton.click()    
}

function triggerAll () {
  openByWindow()
  openByMockClickA()
  openByMockSubmit()
  openByMockButton()
}

function ajax (cb) {
  $.ajax({
    url: '',
    method: 'GET',
    success: function () {
      cb()
    }
  })
}
'use strict'


import CodeMirror from '../util/imports'
import {defaultOption, dynamicOption} from '../util/config'
import {debug} from 'util';
import {CodeSync} from '../util/sync_maintainer'
import {setCookie, getCookie} from '../util/cookie'


export {CodeMirror}
var onInit = function () {
  return document.getElementsByClassName('Select-value')[0].innerText
}

var myCodeMirror;

/**
 * 初始化新的编辑器
 */
function initNewCM() {

  var oldCmDiv = document.getElementsByClassName('CodeMirror')[1]
  var oldCm = oldCmDiv.CodeMirror
  oldCmDiv.style.display = 'none'

  console.log(oldCm.doc.getValue())

  var t = document.getElementsByName('lc-codemirror')[0]
  defaultOption.value = t.value

  var input = document.createElement('textarea');
  var reactCM = document.getElementsByClassName("ReactCodeMirror")[0]
  var myArea = reactCM.appendChild(input)

  // console.log(defaultOption)
  myCodeMirror = CodeMirror.fromTextArea(myArea, defaultOption)
  // myCodeMirror.setMustValue = myCodeMirror.setValue
  // oldCm.setMustValue = setOldCMValue;

  let option = getCookie("CM_OPTION")
  console.log("LEETCODE: ", option)
  // set Style
  dynamicOption.read_option(JSON.parse(option))

  let oldV = oldCm.doc.getValue()
  myCodeMirror.doc.setValue(t.value)

  CodeSync.addWraper(oldCm)
  CodeSync.addWraper(myCodeMirror)
  /*
  myCodeMirror.on('change', function(){
    oldCm.setValue(myCodeMirror.getValue())
  })
  */

  oldCm.on('beforeChange', function(cm, obj) {
    CodeSync.onUpdate(cm, obj, myCodeMirror, null)
  })

  myCodeMirror.on('beforeChange', function(cm, obj) {
    CodeSync.onUpdate(cm, obj, oldCm, null)
  })
  setDynamicOptions(myCodeMirror)
  console.log("Init Over")
}

initNewCM()

function setDynamicOptions(CMObj) {

  console.log("set dynamic option", dynamicOption)

  CMObj.getWrapperElement().style.fontSize = `${dynamicOption.font_size}px`
  CMObj.getWrapperElement().style.fontFamily = dynamicOption.font_face
  CMObj.setOption('keyMap', dynamicOption.keyMap)
  CMObj.setOption('theme', dynamicOption.theme)
  CMObj.setOption('mode', dynamicOption.mode)
}

/*
oldCm.getValue = function () {
  return myCodeMirror.getValue()
}
myCodeMirror.replaceRange
myCodeMirror.on('change', function (cm) {
  oldCm.doc.setValue(cm.getValue())
  oldCm.replaceRange("foo\n", {
    line: 0
  });
})

myCodeMirror.save = function () {
  oldCm.save()
}
*/

/*
$("reset-btn btn btn-default").on("click",function(){
  alert("The paragraph was clicked.");
});
*/

myCodeMirror.setOption("extraKeys", {
  Tab: function (cm) { // 使用空格缩进
    var unit = cm.getOption("indentUnit");
    var col = cm.getCursor().ch;
    var spaces = Array(unit + 1 - col % unit).join(" ");
    cm.replaceSelection(spaces);
  }
});
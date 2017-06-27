options = chrome.extension.getBackgroundPage().options;
ENUM_FONTSIZE = chrome.extension.getBackgroundPage().ENUM_FONTSIZE;
ENUM_COLORSCHEME = chrome.extension.getBackgroundPage().ENUM_COLORSCHEME;
ENUM_FONTFACE = chrome.extension.getBackgroundPage().ENUM_FONTFACE;

var settingInputs = ['font_size', 'color_scheme', 'font_face'];
var valueDefault = {
  'font_face' : ENUM_FONTFACE,
  'font_size' : ENUM_FONTSIZE,
  'color_scheme': ENUM_COLORSCHEME,
}

function getCurrentUrl(callback) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    var tab = tabs[0];
    callback(tab.url);
  });
};

function getInput (name) {
  return document.querySelector('[name="'+ name + '"]');
}


function initPage() {
  buildHTML();
  restoreOptions();
}

function buildHTML() {

  for(var i = 0; i < settingInputs.length; i++) {
    var key = settingInputs[i];
    var x = getInput(key);
    var enum_data = valueDefault[key];

    console.log(x, enum_data);
    for(var j = 0; j < enum_data.length; j++) {
      var data = enum_data[j];

      var option = document.createElement("option");
      option.value = data;
      option.text = data;
      x.add(option);
    }
  }
}

/**
 * Restore options from localstorage
 * @param  {bool} reset reset options to defaults.
 */
function restoreOptions() {

  for (var i = 0; i < settingInputs.length; i++) {
    var key = settingInputs[i];
    var value = options(key);
    if (!value) {
      continue;
    }

    var settingElement = getInput(key);
    var type = settingElement.nodeName.toLowerCase();

    if (type === 'select') {
      for (var j = 0; j < settingElement.children.length; j++) {
        var child = settingElement.children[j];
        if (child.value == value) {
          child.selected = "true";
        }
      }
    } else if (type === 'textarea') {
      settingElement.value = value;
    }
  }
}

function submitChange() {
  chrome.extension.sendMessage({ method: "optionsChange"}, function (response){});
}

function fontChange() {
  var i = this.selectedIndex;
  var font = this.children[i].value;
  options("font_size", font);
  msgSave();
}

function themeChange() {
  var i = this.selectedIndex;
  var theme = this.children[i].value;
  options("color_scheme", theme);
  msgSave();
}

function fontFaceChange() {
  var i = this.selectedIndex;
  var face = this.children[i].value;
  options("font_face", face);
  msgSave();
}

function msgSave() {
  var save = getInput('save');
  save.style.display='block';
  window.setTimeout(function() {
    save.style.display='none';
  }, 800);
  submitChange();
}

document.addEventListener('DOMContentLoaded', initPage);
document.querySelector('#leet_font').addEventListener('change', fontChange);
document.querySelector('#leet_theme').addEventListener('change', themeChange);
document.querySelector('#leet_font_face').addEventListener('change', fontFaceChange);



document.addEventListener('', function () {
  var default_size = 18;
  var start = 14;

  var leet_font = document.getElementById("leet_font");

  //leet_font.options[0 - 14].selected=true;
  //leet_font.options[default_size - start].selected = "select";
  for (var j = 0; j < leet_font.children.length; j++) {
    var child = leet_font.children[j];
    if (child.value == value) {
      child.selected = "true";
    }
  }

  leet_font.addEventListener('change', function (data) {
    console.log("change make " + leet_font.selectedIndex);
  });

});
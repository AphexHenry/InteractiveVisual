  
/*
  Quick sketch of an UI for a VJ application.
  TODO: refactor, refactor, refactor...
*/
var sCommunicationManager = new CommunicationManager();
var sCookieManager = new CookieManager();
var sURLHash;
var sTempo = 100;
var sLastTempoPush = 0;
var sColorPicker;
var sAnimationLoader = new AnimationLoader();

$(function () {
  var mKeyInput = new KeyInput();
  var lRequestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = lRequestAnimationFrame;

  var sLastUpdate = 0;
  function animate() 
  {
    var lThisTime = new Date().getTime() / 1000.;
    var timeElapsed = lThisTime - sLastUpdate;
    sLastUpdate = lThisTime;
    mKeyInput.update(timeElapsed);
    sAnimationLoader.Update(timeElapsed);
    window.requestAnimationFrame( animate );
  }

  animate();

  sURLHash = sCookieManager.check("name", "uniqueToken");

  connectRTC(sURLHash);

  GlobalGUI();

  GetAnimations();

}());

function AddColor(aName, value, aId)
{
  $('#LeftGUI').append( "<h3>" + aName + "</h3>" );
  var lContainer = $("<div class='row NewEl form-item'></div>");
  var newPickerDiv = $("<div id='picker'></div>")
  $('#LeftGUI').append(lContainer);
  lContainer.append("<span class='span2 NewEl'>");
  lContainer.append(newPickerDiv);
  var lPicker = $.farbtastic($(newPickerDiv), colorPickerChange, aId);
  lPicker.setColor(value);
}

function AddSlider(aName, value, aMin, aMax, aGlobal, id)
{
  if(!isdefined(aMin))
  {
      aMin = 0.;
  }

  if(!isdefined(aMax))
  {
      aMax = 1.;
  }

  var $lBase = $("<div class='row NewEl'> </div>");
  $lBase.append("<span class='span2 NewEl'>" + aName + "</span><br>");
  
  var $lSlider = $('<input class="mySlider span3" type="text" name="' + id + '" value="0" data-slider-min="' + aMin +'" data-slider-max="' + aMax + '" data-slider-step="0.01" data-slider-value="0" data-slider-orientation="horizontal" data-slider-id="leftSpeedS" data-slider-selection="before" data-slider-tooltip="hide"></input>');
  $lBase.append($lSlider);

  if(isdefined(aGlobal) && aGlobal)
  {
    $('#GeneralGUI').append($lBase);
  }
  else
  {
    $('#LeftGUI').append($lBase);
  }

  $lSlider.slider('setValue', value);
  $lSlider.on('slide', function(ev){
    sCommunicationManager.syncSlider(ev.currentTarget.name, ev.value);
  });
}

function colorPickerChange(ev)
{
  sCommunicationManager.syncColor(ev.name, ev.color);
  console.log("color change: " + ev.color);
}

function syncButton(name)
{
  sCommunicationManager.syncButton(name);
}

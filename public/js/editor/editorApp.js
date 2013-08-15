

$('#CodeGUISwitch').on('switch-change', function (e, data) 
{
	$('#GUI').removeClass('active');
	$('#code').removeClass('active');
	if(!data.value)
	{
		$('#GUI').addClass('active');
		// $('#myCarousel').carousel('prev');
	}
	else
	{
		$('#code').addClass('active');
		// $('#myCarousel').carousel('next');
	}
});

function AddSlider(aName, value, aMin, aMax, id)
{
  if(!isdefined(aMin))
  {
      aMin = 0.;
  }

  if(!isdefined(aMax))
  {
      aMax = 1.;
  }

  var $lBase = $("<div class='NewEl'> </div>");
  $lBase.append("<h4>" + aName + "</h4><span class='span2 NewEl'></span>");
  
  var $lSlider = $('<input class="mySlider span3" type="text" name="' + id + '" value="0" data-slider-min="' + aMin +'" data-slider-max="' + aMax + '" data-slider-step="0.01" data-slider-value="0" data-slider-orientation="horizontal" data-slider-id="leftSpeedS" data-slider-selection="before" data-slider-tooltip="hide"></input>');
  $lBase.append($lSlider);

  $('#GUI').append($lBase);

  $lSlider.slider('setValue', value);
}

function AddButton(aName, aId)
{
  var $lButton = $('<button type="button" name="'+ aId + '" class="btn">' + aName + '</button>');
  $('#GUI').append($lButton);

}

// AddSlider("test", 1, 0, 2, "test");
AddButton("testBut", "testBut");

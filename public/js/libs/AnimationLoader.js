
var sGUI;

function AnimationLoader()
{
	this.animationToLoad = [];
	this.animationIndex = 0;
	this.animationIndexLast = -1;
}

AnimationLoader.prototype.Load = function(array)
{
	this.animationToLoad = this.animationToLoad.concat(array);
}

AnimationLoader.prototype.Update = function(aTimeInterval)
{
	if(this.animationIndex >= this.animationToLoad.length)
	{
		return;
	}

	var that = this;
	if(this.animationIndex != this.animationIndexLast)
	{
		this.animationIndexLast = this.animationIndex;
		loadjsfile("js/users/" + this.animationToLoad[this.animationIndex].user + "/" + this.animationToLoad[this.animationIndex].visual + "/" +this.animationToLoad[this.animationIndex].file, function(aIsGUI){that.AnimationLoaded(aIsGUI);}, this.animationToLoad[this.animationIndex].file == 'GUI.js');
	}
}

AnimationLoader.prototype.AnimationLoaded = function(aIsGUI)
{
	if(aIsGUI)
	{
		var thisGUI = new GUI();
		var controlList = thisGUI.ListControl;
		for(var i = 0; i < controlList.length; i++)
		{
			var lId = this.animationToLoad[this.animationIndex].user + this.animationToLoad[this.animationIndex].visual + controlList[i].name;
			switch(controlList[i].type)
			{
				case 'color':
				AddColor(controlList[i].name, controlList[i].value, lId)
				break;
				case 'slider':
				case 'number':
				case 'float':
				AddSlider(controlList[i].name, controlList[i].value, controlList[i].min, controlList[i].max, false, lId)
				break;
			}
		}
	}
	else
	{
		var lNewVisu = new CompleteVisualizer(Visual);
		lNewVisu._mUser = this.animationToLoad[this.animationIndex].user;
		lNewVisu._mVisual = this.animationToLoad[this.animationIndex].visual;
		lNewVisu.SetupAll();
		sVisuals.push(lNewVisu);
	}

	this.animationIndex++;
}
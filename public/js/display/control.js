
function Control()
{
    this.methodMapper = [];
    this.methodMapperButton = [];
    this.mapperSlider = [];
    this.mapperColor = [];
    this.visuName
    var that = this;

    this.methodMapper["/button"] = function(aArg)
    {
        var lMethod = that.methodMapperButton[aArg[0]];
        if(isdefined(lMethod))
        {
            lMethod();
        }
    }

    this.methodMapper["/slider"] = function(aArg)
    {
        that.mapperSlider[aArg[0]] = aArg[1];
    }

    this.methodMapper["/color"] = function(aArg)
    {
        that.mapperColor[aArg[0]] = aArg[1];
    }
}

Control.prototype.AddButton = function(name, callback)
{
    this.methodMapperButton[name] = callback;
}

Control.prototype.SetCurrentName = function(aName)
{
    this.visuName = aName;
}

Control.prototype.GetNumber = function(aName, aIsGeneral)
{
    var lReturn;
    if(isdefined(aIsGeneral) && aIsGeneral)
    {
       lReturn = this.mapperSlider[aName]; 
    }
    else
    {
        lReturn = this.mapperSlider[this.visuName + aName];
    }
    if(!isdefined(lReturn))
        return 1;
    else
        return lReturn;
}

Control.prototype.GetColor = function(aName)
{
    return this.mapperColor[this.visuName + aName];
}

Control.prototype.GetColorRGB = function(aName)
{
    return hexToRgb(this.GetColor(aName));
}

Control.prototype.GetColorHSV = function(aName)
{
    var rgb = this.GetColorRGB(aName);
    return rgbTohsv(rgb.r, rgb.g, rgb.b);
}

Control.prototype.AddSlider = function(aName, value)
{
    control.mapperSlider[aName] = value;
}

AddButton = function(aName, aId, aIsGlobal)
{
    control.AddButton(aId, getFunctionByName(aId));
}

AddColor = function(aName, value, id)
{
    control.mapperColor[id] = value;
}

AddSlider = function(aName, value, min, max, isGlobal, id)
{
    control.mapperSlider[id] = value;
}

Control.prototype.Parse = function(aString)
{
    if(!isdefined(aString))
        return;

    var lArrayControl = aString.split(" ");
    var controlPath = lArrayControl[0];
    lArrayControl.splice(0,1);
    var values = lArrayControl;
    this.methodMapper[controlPath](values);
}



function CommunicationManager()
{

}

CommunicationManager.prototype.syncButton = function(aName) 
{
	sendStuffP2P("/button " + aName);
}

CommunicationManager.prototype.syncSlider = function(aName, aValue)
{
	sendStuffP2P("/slider " + aName + " " + aValue);
}

CommunicationManager.prototype.syncColor = function(aName, aValue)
{
	sendStuffP2P("/color " + aName + " " + aValue);
}
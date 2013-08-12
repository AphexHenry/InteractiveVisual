function GUI()
{
	this.ListControl = [];
	this.ListControl.push({type:'slider', min:0.1, max:3, name:'radius', value:1});
	this.ListControl.push({type:'color', name:'color', value:'#05f474'});
}

var socket  = io.connect();
var codeParser = new CodeParser();

socket.on('animations', function (data) {
data = StringUtils.strdecode(data);
  loadjsfile("js/users/" + data.user + "/" + data.visual + "/" + data.file, 
  	function(aData){
  		codeParser.Parse(new Visual());
  });
});

function GetCode()
{
	var object = {user:NAME_USER, name:NAME_VISUAL};
  	socket.emit('get:CodeString', object);
}

function SaveCode(aCode)
{
	var object = {user:NAME_USER, name:NAME_VISUAL, code:aCode};
  	socket.emit('save:code', object);
}

socket.on('CodeSaved', function(){
	sCommunicationManager.syncButton('UpdateCode');
});

GetCode();
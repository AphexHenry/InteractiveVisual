
var socket  = io.connect();

socket.on('messageDB', function (data) {
	data = StringUtils.strdecode(data);
	AddVideoFromDB(data[0].list);
});

socket.on('animations', function (data) {
  data = StringUtils.strdecode(data);
  sAnimationLoader.Load(data);
});

function GetAnimations()
{
	var object = {user:NAME_USER, name:NAME_VISUAL};
  	socket.emit('get:GUI', object);
}
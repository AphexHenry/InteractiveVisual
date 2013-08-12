
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
  socket.emit('get:Animations');
}

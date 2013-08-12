
/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , helpers = require('./lib/helpers.js')
  , vinelib = require('./lib/vineAgent.js')
  , sio     = require('socket.io')         // web socket external module
  , winston = require('winston')           // logging module
  , vineDB = require('./model/VineDB.js')
  , monitorLib = require('./lib/monitorServer.js')

  // rtc Local includes
  easyRtcCfg  = require('./config');          // All server configuration (global)
var g       = require('./lib/rtc/general');     // General helper functions
var c       = require('./lib/rtc/connection');  // easyRTC connection functions

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
  
  //var vineModel = new vineDB();

// Logging Setup
g.logInit();                                // Initialize logging settings
var logServer   = winston.loggers.get('easyRtcServer');
var logApi      = winston.loggers.get('easyRtcApi');
var logExpress  = winston.loggers.get('express');
var logSocketIo = winston.loggers.get('socketIo');

var EventEmitter = require('events').EventEmitter
  , ee = new EventEmitter();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('channel', process.env.PORT ? 'vineVJ' : 'vineVJ');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function() {
  io.enable('browser client etag');
  io.set('log level', 1);
  io.set('transports', ["xhr-polling", "flashsocket", "json-polling"]);
  io.set('polling duration', 10);
});

// Start either the HTTP or HTTPS web service
logServer.info('Starting easyRTC Server (v' + easyRtcCfg.easyRtcVersion +')', { label: 'easyRtcServer'});
if (easyRtcCfg.sslEnable) {  // Start SSL Server (https://)
    var https = require('https');
    var sslOptions = {
        key:  fs.readFileSync(easyRtcCfg.sslKeyFile),
        cert: fs.readFileSync(easyRtcCfg.sslCertFile)
    };

    var server = https.createServer(sslOptions, app).listen(easyRtcCfg.sslPort);

    logServer.info('HTTPS (SSL) Server started on port: ' + easyRtcCfg.sslPort, { label: 'easyRtcServer'});

    // Optionally listen in on an http port and forward requests to secure port
    if (easyRtcCfg.sslForwardFromHttp) {
        var forwardingServer = express();
        forwardingServer.all('*', function(req, res) {
            return res.redirect("https://" + req.host + (easyRtcCfg.sslPort==443 ? '' :':' + easyRtcCfg.sslPort) + req.url);
        });
        forwardingServer.listen(easyRtcCfg.httpPort);
    }    
} else {    // Start HTTP server (http://)
    var server = http.createServer(app).listen(easyRtcCfg.httpPort);
    logServer.info('HTTP Server started on port: ' + easyRtcCfg.httpPort, { label: 'easyRtcServer'});
}

// Start socket server
var io = sio.listen(server, {
        'logger': {
            debug: function(message){ logSocketIo.debug(message, { label: 'socket.io'}); },
            info:  function(message){ logSocketIo.info( message, { label: 'socket.io'}); },
            warn:  function(message){ logSocketIo.warn( message, { label: 'socket.io'}); },
            error: function(message){ logSocketIo.error(message, { label: 'socket.io'}); }
        },
        'browser client minification': true,
        'browser client etag': true,
        'browser client gzip': true
});
logServer.info('Socket Server started', { label: 'easyRtcServer'});

// Start experimental STUN server (if enabled)
if (easyRtcCfg.experimentalStunServerEnable) {
    g.experimentalStunServer();
}

// Shared variable to hold server and socket information.
easyRtc = {
    serverStartTime: Date.now(),
    connections: {}
};

// Upon a socket connection, a socket is created for the life of the connection
io.sockets.on('connection', function (socket) {
    logServer.debug('easyRTC: Socket [' + socket.id + '] connected with application: [' + easyRtcCfg.defaultApplicationName + ']', { label: 'easyRtc', easyRtcId:connectionEasyRtcId, applicationName:easyRtcCfg.defaultApplicationName});
    var connectionEasyRtcId = socket.id;
    c.onSocketConnection(io, socket, connectionEasyRtcId);

    // Incoming messages: Custom message. Allows applications to send socket messages to other connected users.
    socket.on('message', function(msg) {
        logServer.debug('easyRTC: Socket [' + socket.id + '] message received', { label: 'easyRtc', easyRtcId:connectionEasyRtcId, applicationName: easyRtc.connections[connectionEasyRtcId].applicationName, data:msg});
        c.onSocketMessage(io, socket, connectionEasyRtcId, msg);
    });

    // Incoming easyRTC commands: Used to forward webRTC negotiation details and manage server settings.
    socket.on('easyRTCcmd', function(msg) {
        logServer.debug('easyRTC: Socket [' + socket.id + '] command received', { label: 'easyRtc', easyRtcId:connectionEasyRtcId, data:msg});
        c.onEasyRtcCmd(io, socket, connectionEasyRtcId, msg);
    });
    
    // Upon a socket disconnecting (either directed or via time-out)
    socket.on('disconnect', function(data) {
        logServer.debug('easyRTC: Socket [' + socket.id + '] disconnected', { label: 'easyRtc', easyRtcId:connectionEasyRtcId});
        c.onSocketDisconnect(io, socket, connectionEasyRtcId);
    });

    // monitor get
    socket.on('get:Animations', function(aData)
    {   
        socket.emit('animations', JSON.stringify([{user:"AphexHenry", visual:"Visual1", file:"GUI.js"}, {user:"AphexHenry", visual:"Visual2", file:"GUI.js"}]));
    });
});

// Checks to see if there is a newer version of easyRTC available
if (easyRtcCfg.updateCheckEnable) {
    g.updateCheck(http);
}

app.get('/', function(req, res) {
  res.render('index', {
          user: 'AphexHenry'
        });
});

app.get('/display', function(req, res) {
  res.render('display');
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// easyRTC Configuration File
var config = {}; 

// User Configurable Options
// *************************
config.httpPort     = 8080;                 // The port which the http and socket server is on.
config.sslEnable    = false;                // SSL - Note: if https is enabled, http is disabled.
config.sslPort      = 8443;
config.sslForwardFromHttp = true;           // Forces non-secure connections to be forwarded to the secure site. (recommended true)
config.sslKeyFile   = '/ssl/mydomain.key';  // Local file location of private SSL key
config.sslCertFile  = '/ssl/mydomain.crt';  // Local file location of public SSL certificate


// External stun server (will be used if experimentalStunServerEnable is false)
// Several public stun servers are available to be used.
config.externalIceServers = [
    {"url": "stun:stun.l.google.com:19302"}
];

// EXPERIMENTAL STUN SERVER
// It isn't good for production, but is nice for closed development.
// You "should" include two addresses which are reachable by all clients.
// Ports would need to be unblocked by firewalls.
config.experimentalStunServerEnable = false;  
config.experimentalStunServerAddr0  = "107.21.3.47";
config.experimentalStunServerAddr1  = "107.23.45.102";  // "should" be a seperate from Addr0
config.experimentalStunServerPort0  = "1314";           // Each IP listens on both Port0 and Port1
config.experimentalStunServerPort1  = "1315";


// Logging Settings
config.logConsoleColors         = true;             // Display colors in console log (affects all logs)
config.logConsoleDate           = false;            // Prepend date and time to console log (affects all logs)

// Logging: General easyRTC Server Logging
config.logEasyRtcConsoleEnabled = true;             // Enable easyRTC general console logging
config.logEasyRtcConsoleLevel   = 'info';           // ('debug'|'info'|'warn'|'error')

config.logEasyRtcFileEnabled    = false;            // Enable easyRTC general file logging
config.logEasyRtcFileLevel      = 'info';           // ('debug'|'info'|'warn'|'error')
config.logEasyRtcFileName       = ('./logs/easyrtc.log');// File location relative to easyRTC root

// Logging: Express Module
config.logExpressConsoleEnabled = false;            // Enable Express console logging
config.logExpressConsoleLevel   = 'info';           // ('debug'|'info'|'warn'|'error')

config.logExpressFileEnabled    = false;            // Enable Express file log
config.logExpressFileLevel      = 'info';           // ('debug'|'info'|'warn'|'error')
config.logExpressFileJson       = true;             // Enable JSON format in log file
config.logExpressFileName       = ('./logs/express.log');// File location relative to easyRTC root

// Logging: Socket.IO Module (not terribly useful)
config.logSocketIoConsoleEnabled= true;             // Enable Socket.io console logging
config.logSocketIoConsoleLevel  = 'warn';           // ('debug'|'info'|'warn'|'error')

config.logSocketIoFileEnabled   = false;            // Enable Socket.io file logging
config.logSocketIoFileLevel     = 'warn';           // ('debug'|'info'|'warn'|'error')
config.logSocketIoFileName      = ('./logs/socketio.log'); // File location relative to easyRTC root

// Logging: Experimental Stun Module
config.logStunConsoleEnabled    = true;             // Enable STUN server console logging
config.logStunConsoleLevel      = 'info';           // ('debug'|'info'|'warn'|'error')

config.logStunFileEnabled       = false;            // Enable STUN server file logging
config.logStunFileLevel         = 'warn';           // ('debug'|'info'|'warn'|'error')
config.logStunFileName          = ('./logs/stun.log');// File location relative to easyRTC root


// The namespace for the default application.
config.defaultApplicationName = "default";

// Enable easyRTC demos. Viewable in /demos/
config.enableDemos = true;

// Check for updates
config.updateCheckEnable = true;

// **********************************
// End of user configurable settings.
// **********************************

// The following settings work alongside the easyRTC client API.
// DO NOT ALTER!
// *************************************************************

// Load version number from package.json file 
var easyRtcPackage = require('./package');
config.easyRtcVersion = easyRtcPackage.version;
delete require.cache[easyRtcPackage];

config.cmdPacketType = "easyRTCcmd";
config.cmdMsgType = {
    list: "list",
    token: "token"
};

// Programatically Setting Some Settings
// *************************************
if (config.experimentalStunServerEnable)
    config.iceServers = [
        {"url": "stun:" + config.experimentalStunServerAddr0 + ":" + config.experimentalStunServerPort0},
        {"url": "stun:" + config.experimentalStunServerAddr0 + ":" + config.experimentalStunServerPort1},
        {"url": "stun:" + config.experimentalStunServerAddr1 + ":" + config.experimentalStunServerPort0},
        {"url": "stun:" + config.experimentalStunServerAddr1 + ":" + config.experimentalStunServerPort1}
    ];
else
    config.iceServers = config.externalIceServers;

// Allows the config file to be seen by a caller
module.exports = config;
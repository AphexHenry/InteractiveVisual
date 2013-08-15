
var connectID;
var sOtherSessionID;

/*
  Quick sketch of an UI for a VJ application.
  TODO: refactor, refactor, refactor...
*/
function addToConversation(who, content) {
    // Escape html special characters, then add linefeeds.
    console.log("data received = " + content + " from " + who);
    control.Parse(content);
}

function connectRTC(aChannel) {
    console.log("Initializing RTC.");
    easyRTC.enableDataChannels(true);
    easyRTC.enableVideo(false);
    easyRTC.enableAudio(false);

    easyRTC.setDataListener(addToConversation);
    easyRTC.setLoggedInListener(loggedInListener);
    easyRTC.connect(aChannel, loginSuccess, loginFailure);   
}

function loginSuccess(easyRTCId) {
    selfEasyrtcid = easyRTCId;
}

function loginFailure(message) {
    alert("failure to login");
}

function loggedInListener (data) {
    for(var i in data) 
    {
        performCall(i);
        break;
    }
    sOtherSessionID = data;
}

function performCall(otherEasyrtcid) {
    if( easyRTC.getConnectStatus(otherEasyrtcid) == easyRTC.NOT_CONNECTED) {
        easyRTC.call(otherEasyrtcid, 
            function(caller, media) { // success callback
                if( media == 'datachannel') {
                    console.log("made call succesfully");
                    connectID = otherEasyrtcid;
                }
            }, 
            function(errText) {
                // alert("err: " +errText);
            }, 
            function(wasAccepted) {
                console.log("was accepted=" + wasAccepted);
            }
            );
    }
    else {
        alert("already connected to " + otherEasyrtcid);
    }
}

function disconnect() {
    easyRTC.disconnect();
    console.log("disconnecting from server");
}

function sendStuffP2P(text) {  
    for(var i in sOtherSessionID) 
    {  
        if(text.replace(/\s/g, "").length == 0) { // Don't send just whitespace
            return;
        }   
        if( easyRTC.getConnectStatus(i) == easyRTC.IS_CONNECTED) {
            console.log(text)
            easyRTC.sendDataP2P(i, text);                
        }
        else {
            console.log("not connected to " + i + " yet.");
        }
        addToConversation("Me", text);       
    }
}



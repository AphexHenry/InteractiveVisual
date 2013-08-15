if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var postprocessing = { enabled  : true };

var sAudioInput = new AudioInput();
var sVisuals = [];
var sGlobalTimer = Date.now() / 1000;
sTempoManager = new TempoManager();
var sAnimationLoader = new AnimationLoader();

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;

    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    composer = new THREE.EffectComposer( renderer );

    sURLHash = "uniqueToken";
    connectRTC(sURLHash);
    
    function compoSwitchConvo()
    {
        sVisuals[0].ResetShaders("focus");
    }

    function compoSwitchScreen()
    {
        sVisuals[0].ResetShaders("film");   
    }

    function compoSwitchDot()
    {
        sVisuals[0].ResetShaders("dotscreen");   
    }

    control.AddButton('tempo', tickTempo);
    control.AddButton('convolution', compoSwitchConvo);
    control.AddButton('dot', compoSwitchDot);
    control.AddButton('screen', compoSwitchScreen);

    sAnimationLoader.Load([{user:NAME_USER, visual:NAME_VISUAL, file:'GUI.js'}, {user:NAME_USER, visual:NAME_VISUAL, file:'visual.js'}]);

    GlobalGUI();

    function UpdateCode()
    {
        sAnimationLoader.Load([{user:NAME_USER, visual:NAME_VISUAL, file:'GUI.js'}, {user:NAME_USER, visual:NAME_VISUAL, file:'visual.js'}]);
    }
    control.AddButton('UpdateCode', UpdateCode);
}

function tickTempo()
{
    sTempoManager.Tick();
}

function onDocumentMouseMove( event ) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

    if ( event.touches.length == 1 ) {
        
        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
}

function onDocumentTouchMove( event ) {

    if ( event.touches.length == 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
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

function animate() {

    var lNow = Date.now() / 1000.;
    var lTimeElapsed = lNow - sGlobalTimer;
    sGlobalTimer = lNow;

    requestAnimationFrame( animate );

    sAudioInput.Update();
    sAnimationLoader.Update(lTimeElapsed);

    for(var i = 0; i< sVisuals.length; i++)
    {
        sVisuals[i].effectBloom.screenUniforms[ "opacity" ].value = control.GetNumber('glow', true);
        control.SetCurrentName(sVisuals[i]._mUser + sVisuals[i]._mVisual);
        sVisuals[i].Update(lTimeElapsed);
    }

    sTempoManager.Update(lTimeElapsed);

    renderer.clear();
    composer.render( 0.1 );
}

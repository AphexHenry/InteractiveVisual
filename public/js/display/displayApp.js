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

    function tickTempo()
    {
        sTempoManager.Tick();
    }
    
    control.AddButton('tempo', tickTempo);

    sAnimationLoader.Load([{user:'AphexHenry', visual:'Visual2', file:'visual.js'}, {user:'AphexHenry', visual:'Visual2', file:'GUI.js'}]);

    GlobalGUI();
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

function animate() {

    var lNow = Date.now() / 1000.;
    var lTimeElapsed = lNow - sGlobalTimer;
    sGlobalTimer = lNow;

    requestAnimationFrame( animate );

    sAudioInput.Update();
    sAnimationLoader.Update(lTimeElapsed);

    for(var i = 0; i< sVisuals.length; i++)
    {
        control.SetCurrentName(sVisuals[i]._mUser + sVisuals[i]._mVisual);
        sVisuals[i].Update(lTimeElapsed);
    }

    sTempoManager.Update(lTimeElapsed);

    renderer.clear();
    composer.render( 0.1 );
}

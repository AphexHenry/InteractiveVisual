
function CompleteVisualizer(aVisu)
{
    this.mVisu = new aVisu();
    if(isdefined(this.mVisu.SetupScene))
    {
        this.SetupScene = this.mVisu.SetupScene;
    }

    if(isdefined(this.mVisu.SetupCamera))
    {
        this.SetupCamera = this.mVisu.SetupCamera;
    }

    if(isdefined(this.mVisu.SetupShaders))
    {
        this.SetupShaders = this.mVisu.SetupShaders;
    }

    this.Update = this.mVisu.Update;
    this.Setup = this.mVisu.Setup;
}

CompleteVisualizer.prototype.SetupAll = function()
{
    this.SetupScene();
    this.SetupCamera();
    this.SetupShaders();
    this.Setup();
}

CompleteVisualizer.prototype.SetupScene = function()
{
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.0016 );
    renderer.setClearColor( this.scene.fog.color, 1 );
}

CompleteVisualizer.prototype.SetupCamera = function()
{
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 3000 );
    this.camera.position.z = 1200;
    this.scene.add( this.camera );
}

CompleteVisualizer.prototype.SetupShaders = function()
{
    var renderModel = new THREE.RenderPass( this.scene, this.camera );
    this.effectBloom = new THREE.BloomPass( 1.0 );
    this.effectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );

    effectScreen.renderToScreen = true;

    composer.addPass( renderModel );
    composer.addPass( this.effectBloom );
    composer.addPass( effectScreen );
}

CompleteVisualizer.prototype.ResetShaders = function(aName)
{
    delete composer;
    composer = new THREE.EffectComposer( renderer );

    var renderModel = new THREE.RenderPass( this.scene, this.camera );
    this.effectBloom = new THREE.BloomPass( 1.0 );
    this.effectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ aName ] );

    effectScreen.renderToScreen = true;

    composer.addPass( renderModel );
    composer.addPass( this.effectBloom );
    composer.addPass( effectScreen );
}

function Visual() {

    this.name = "easy one";
}

Visual.prototype.Setup = function()
{
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(150, 100, 100), new THREE.MeshNormalMaterial());
    this.sphere.overdraw = true;
    this.scene.add(this.sphere);

    this.timer = 0.;
}

Visual.prototype.Update = function(aTimeInterval)
{
    this.sphere.scale.x = this.sphere.scale.y = this.sphere.scale.z = control.GetNumber('radius');
}

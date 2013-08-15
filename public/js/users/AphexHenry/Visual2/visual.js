function Visual() {} 

Visual.prototype.Setup = function() {
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(150, 100, 100), 
                                 new THREE.MeshNormalMaterial());
    this.sphere.overdraw = true;
    this.scene.add(this.sphere);

    this.timer = 0.;
                 }

Visual.prototype.Update = function(aDelta) {
	this.timer += aDelta * 2;
    this.sphere.scale.x = this.sphere.scale.y = this.sphere.scale.z = 
       (0.1 + sAudioInput.GetLoudness());
                 }

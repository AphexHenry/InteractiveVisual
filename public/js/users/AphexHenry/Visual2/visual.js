function Visual() {} 

Visual.prototype.Setup = function() {
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(150, 100, 100), 
                                 new THREE.MeshNormalMaterial());
    this.sphere.overdraw = true;
    this.scene.add(this.sphere);
                                                       }

Visual.prototype.Update = function(aDelta) {
    this.sphere.scale.x = control.GetNumber('sizeBall');
	this.sphere.position.x = 500 * Math.cos(Timer + 5 * Math.cos(Timer * 1.6));
	this.sphere.position.y = 500 * Math.sin(Timer * 2.5);
                                                       }

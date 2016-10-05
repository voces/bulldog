
const TYPES = {};

class Doodad extends EventEmitter2 {
    constructor(props = {}) {
        super();

        this.id = Doodad.id++;

        this.x = props.x || 0;
        this.y = props.y || 0;

        // this.on("hoverOn", intercept => console.log("hoverOn", this.constructor.name, this.id));
        // this.on("hoverOff", intercept => console.log("hoverOff", this.constructor.name,  this.id));
        // this.on("hoverFace", intercept => console.log("hoverFace", this.constructor.name));
    }

    createMesh(args = {}) {
        if (args.geometry) this.geometry = args.geometry;
        if (args.material) this.material = args.material;

        if (!this.material)
            this.material = new THREE.MeshPhongMaterial({
                vertexColors: THREE.FaceColors,
                shading: THREE.FlatShading
            });

        if (this.geometry.animations) {
            this.animated = true;

            this.mesh = new THREE.SkinnedMesh(this.geometry, this.material);

            this.mesh.material.skinning = true;

            this.mixer = new THREE.AnimationMixer(this.mesh);

            this.animations = {};

            for (let i = 0; i < this.geometry.animations.length; i++) {
                let animation = this.geometry.animations[i];

                this.animations[animation.name] = animation;
                this.mixer.clipAction(animation);

                animation.play = weight => this.animate(animation.name, weight);
            }

            // this.animate("walk");

        } else this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.entity = this;

        this.x = this.x;
        this.y = this.y;

        Doodad.emit("new", this);

    }

    set x(value) {
        this._x = value;
        if (this.mesh) this.mesh.position.x = value;
    }

    get x() { return this._x; }

    set y(value) {
        this._y = value;
        if (this.mesh) this.mesh.position.y = value;
    }

    get y() { return this._y; }

    fetchModel(path, callback) {
        if (this.constructor.model) return callback(this.constructor.model);

        loader.load(path, geo => {

            this.constructor.model = geo;

            geo.rotateX(Math.PI / 2);

            callback(geo);

        })
    }

    animate(animation, weight = 1) {

        let remaining = 1 - weight;

        for (let i = 0; i < this.animations.length; i++)
            this.mixer.clipAction(this.animations[i].name).setEffectiveWeight(remaining);

        this.mixer.clipAction(animation).setEffectiveWeight(weight).play();

    }

    setAnimationSpeed(animation, speed) {

        this.mixer.clipAction(animation).setEffectiveTimeScale(7);

    }

    update(delta) {

        if (this.mixer) this.mixer.update(delta);

    }

}

Doodad.id = 0;

emitterMixin(Doodad);

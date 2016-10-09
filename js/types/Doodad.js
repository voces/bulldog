
const TYPES = {};

class Doodad extends EventEmitter2 {
    constructor(props = {}) {
        super();

        this.id = Doodad.id++;

        this.x = props.x || 0;
        this.y = props.y || 0;
        this.height = props.height || 0;

        this._scale = 1;
        this._size = 1;

        this.behaviors = [];
        this.activeBehaviors = [];

        this._visible = typeof props.visible === "boolean" ? props.visible : true;

        Doodad.emit("new", this);

    }

    createMesh(args = {}) {
        if (this.mesh && this.visible) this.emit("hide");

        if (args.geometry) this.geometry = args.geometry;
        if (args.material) this.material = args.material;

        if (!this.material)
            this.material = new THREE.MeshPhongMaterial({
                vertexColors: THREE.FaceColors,
                shading: THREE.FlatShading
            });

        if (this.geometry.animations) new Animated({entity: this});
        else this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.entity = this;

        this.x = this.x;
        this.y = this.y;
        // this.mesh.position.z = app.game.round.arena.

        if (this.visible) this.emit("show");

    }

    get visible() { return this._visible; }
    set visible(value) {
        if (this._visible === value) return;

        if (value) this.show();
        else this.hide();
    }

    hide() {
        if (!this._visible) return;

        this._visible = false;
        this.emit("hide");
    }

    show() {
        if (this._visible) return;

        this._visible = true;
        this.emit("show");
    }

    registerMesh() {

        this.mesh.entity = this;

        this.x = this.x;
        this.y = this.y;

        if (this.visible) this.emit("show");

    }

    get size() { return this._size; }
    get scale() { return this._scale; }

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

    get z() { return this.mesh.position.z; }

    fetchModel(path, callback) {
        if (this.constructor.model) return callback(this.constructor.model);

        loader.load(path, geo => {

            this.constructor.model = geo;

            geo.rotateX(Math.PI / 2);

            callback(geo);

        })
    }

    update(delta) {

        for (let i = 0; i < this.activeBehaviors.length; i++)
            this.activeBehaviors[i].update(delta);

    }

}

Doodad.id = 0;

emitterMixin(Doodad);

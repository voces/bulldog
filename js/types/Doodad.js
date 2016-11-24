
const TYPES = {};

class Doodad extends EventEmitter2 {
    constructor(props = {}) {
        super();

        this.id = Doodad.id++;

        syncProperty(this, "x", {
            initialValue: props.x || 0,
            preprocessor: (value) => {
                if (this.mesh) {
                    if (typeof value == "function")
                        this.mesh.position.x = value(syncProperty.time);
                    else this.mesh.position.x = value;
                }

                return value;
            }
        });

        syncProperty(this, "y", {
            initialValue: props.y || 0,
            preprocessor: (value) => {
                if (this.mesh) {
                    if (typeof value == "function")
                        this.mesh.position.y = value(syncProperty.time);
                    else this.mesh.position.y = value;
                }

                return value;
            }
        });

        // this.x = props.x || 0;
        // this.y = props.y || 0;
        this.height = props.height || 0;

        this.scale = props.scale || 1;
        this.radius = props.radius || 1;

        this.behaviors = [];
        this.activeBehaviors = [];

        this._dirty = true;

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

        if (!(this instanceof Terrain))
            this.geometry.scale(TERRAIN.TILE_PARTS/2, TERRAIN.TILE_PARTS/2, TERRAIN.TILE_PARTS/2);

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

        this.mesh.geometry.scale(TERRAIN.TILE_PARTS/2, TERRAIN.TILE_PARTS/2, TERRAIN.TILE_PARTS/2);

        this.mesh.entity = this;

        this.x = this.x;
        this.y = this.y;

        if (this.visible) this.emit("show");

    }

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
        // console.log("Doodad.update");
        for (let i = 0; i < this.activeBehaviors.length; i++)
            this.activeBehaviors[i].update(delta);

    }

    set dirty(value) {

        if (!value) return this._dirty = false;

        if (this._dirty === true) return;

        this._dirty = true;

        this.emit("dirty");

    }

}

Doodad.id = 0;

FILTER.ALL = {
    type: Doodad
};

emitterMixin(Doodad);

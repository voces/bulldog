
const TYPES = {};

class Doodad extends EventEmitter2 {
    constructor(props = {}) {
        super();

        this.id = Doodad.id++;

        this.x = props.x || 0;
        this.y = props.y || 0;

        this.on("hoverOn", intercept => console.log("hoverOn", this.constructor.name, this.id));
        this.on("hoverOff", intercept => console.log("hoverOff", this.constructor.name,  this.id));
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

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.entity = this;

        this.x = this.x;
        this.y = this.y;

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
}

Doodad.id = 0;

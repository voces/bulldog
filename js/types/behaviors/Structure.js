
class Structure extends Behavior {

    constructor(props) {
        super(props);

        if (props.structure) this.footprint = props.structure;
        else this.footprint = {
            map: [FOOTPRINT_TYPE.OBSTACLE],
            width: 1,
            height: 1
        };

        if (typeof this.footprint.top === "undefined")
            this.footprint.top = Math.ceil(this.footprint.height / -2 + 0.5);

        if (typeof this.footprint.left === "undefined")
            this.footprint.left = Math.ceil(this.footprint.width / -2);

        this.entity.radius = Math.max(this.footprint.width, this.footprint.height) * 4;

        this.entity.structure = this;

        Object.defineProperty(this.entity, "x", {
            set: value => this.setX(value),
            get: () => this.entity._x
        })

        Object.defineProperty(this.entity, "y", {
            set: value => this.setY(value),
            get: () => this.entity._y
        })

    }

    setX(value) {
        if (this.footprint.width % 2 === 0) value = Math.round(value / 8) * 8;
        else value = Math.round(value / 8) * 8 - 4;

        this.entity._x = value;
        if (this.entity.mesh) this.entity.mesh.position.x = this.entity._x;
        this.dirty = true;
    }

    setY(value) {
        if (this.footprint.height % 2 === 0) value = Math.round(value / 8) * 8;
        else value = Math.round(value / 8) * 8 - 4;

        this.entity._y = value;
        if (this.entity.mesh) this.entity.mesh.position.y = value;
        this.dirty = true;
    }

}

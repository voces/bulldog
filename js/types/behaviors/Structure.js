
class Structure extends Behavior {

    constructor(props) {
        super(props);

        if (props.structure) this.footprint = props.structure;
        else this.footprint = {
            map: [FOOTPRINT_TYPE.OBSTACLE],
            width: 1,
            height: 1,
            radius: 0
        };

        this.entity.radius = Math.max(this.footprint.width, this.footprint.height) * 4;

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
    }

    setY(value) {
        if (this.footprint.height % 2 === 0) value = Math.round(value / 8) * 8;
        else value = Math.round(value / 8) * 8 - 4;

        this.entity._y = value;
        if (this.entity.mesh) this.entity.mesh.position.y = value;
    }

}

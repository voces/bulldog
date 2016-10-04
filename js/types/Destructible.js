
const FOOTPRINT_TYPE = {
        NOT_BUILDABLE: 1,
        NOT_WALKABLE: 2,
        NOT_FLYABLE: 4,
        SWIMABLE: 8
    };

FOOTPRINT_TYPE.OBSTACLE = FOOTPRINT_TYPE.NOT_BUILDABLE + FOOTPRINT_TYPE.NOT_WALKABLE;
FOOTPRINT_TYPE.GROUND = 0;

class Destructible extends Doodad {
    constructor(props) {
        super(props);

        if (!this.footprint) {
            if (props.footprint) this.footprint = props.footprint;
            else {
                this.footprint = {
                    map: [FOOTPRINT_TYPE.OBSTACLE],
                    width: 1,
                    height: 1,
                    radius: 0
                };
            }
        }

    }

    set x(value) {


        if (this.footprint && this.footprint.map) {

            if (this.footprint.width % 2 === 0)
                value = Math.round(value / 8) * 8;
            else
                value = Math.round(value / 8) * 8 - 4;

        }

        this._x = value;
        if (this.mesh) this.mesh.position.x = value;
    }

    get x() { return this._x; }

    set y(value) {

        if (this.footprint && this.footprint.map) {

            if (this.footprint.height % 2 === 0)
                value = Math.round(value / 8) * 8;
            else
                value = Math.round(value / 8) * 8 - 4;

        }

        this._y = value;
        if (this.mesh) this.mesh.position.y = value;
    }

    get y() { return this._y; }

}

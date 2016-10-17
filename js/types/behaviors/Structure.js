
TERRAIN.TILE_STRUCTURE_SIZE = TERRAIN.TILE_SIZE * TERRAIN.TILE_STRUCTURE_PARTS;

class Structure extends Behavior {

    constructor(props) {
        super(props);

        if (props.structure) this.footprint = props.structure;
        else this.footprint = {
            map: [FOOTPRINT_TYPE.OBSTACLE],
            width: 1,
            height: 1
        };

        if (TERRAIN.TILE_PARTS / 2 > 1) {
            const multiplier = Math.round(TERRAIN.TILE_PARTS / 2);

            let newMap = [];

            for (let y = 0; y < this.footprint.height; y++) {
                let row = [];

                for (let x = 0; x < this.footprint.width; x++)
                    for (let i = 0; i < multiplier; i++)
                        row.push(this.footprint.map[y * this.footprint.width + x]);

                newMap.push(...row, ...row);

            }

            this.footprint.map = newMap;
            this.footprint.width *= multiplier;
            this.footprint.height *= multiplier;

        }

        if (typeof this.footprint.top === "undefined")
            this.footprint.top = Math.ceil(this.footprint.height / -2 + 0.5);

        if (typeof this.footprint.left === "undefined")
            this.footprint.left = Math.ceil(this.footprint.width / -2);

        this.entity.radius = Math.max(this.footprint.width, this.footprint.height) * 2;

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
        if (this.footprint.width % (2*TERRAIN.TILE_STRUCTURE_PARTS) === 0) value = Math.round(value / TERRAIN.TILE_STRUCTURE_SIZE) * TERRAIN.TILE_STRUCTURE_SIZE;
        else value = (Math.round(value / TERRAIN.TILE_STRUCTURE_SIZE) - 0.5) * TERRAIN.TILE_STRUCTURE_SIZE;

        this.entity._x = value;
        if (this.entity.mesh) this.entity.mesh.position.x = this.entity._x;
        this.dirty = true;
    }

    setY(value) {
        if (this.footprint.height % (2*TERRAIN.TILE_STRUCTURE_PARTS) === 0) value = Math.round(value / TERRAIN.TILE_STRUCTURE_SIZE) * TERRAIN.TILE_STRUCTURE_SIZE;
        else value = (Math.round(value / TERRAIN.TILE_STRUCTURE_SIZE) - 0.5) * TERRAIN.TILE_STRUCTURE_SIZE;

        this.entity._y = value;
        if (this.entity.mesh) this.entity.mesh.position.y = value;
        this.dirty = true;
    }

}

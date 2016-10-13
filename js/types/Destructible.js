
class Destructible extends Doodad {

    constructor(props) {
        super(props);

        this.maxHealth = props.maxHealth || props.constructor.maxHealth || 1;

        if (props.structure)
            new Structure({entity: this, structure: props.structure});
        else
            this._tilemap = {};

        new Selection({entity: this, selectable: false});

    }

    get tilemap() {

        if (this.structure) return this.structure.footprint.map;
        else if (app.terrain) {
            if (this.x === this._tilemap.x && this.y === this._tilemap.y)
                return this._tilemap.map;

            this._tilemap.x = this.x;
            this._tilemap.y = this.y;
            this._tilemap.map = app.terrain.tilemap.pointToTilemap(this.x, this.y, this.radius);

            return this._tilemap.map;
        }

    }

    get tilemapCalculated() {

        if (this.structure) return true;

        if (app.terrain && this._tilemap.x === this.x && this._tilemap.y === this.y)
            return true;

        return false;

    }

}

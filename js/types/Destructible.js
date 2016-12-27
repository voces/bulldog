
class Destructible extends Doodad {

    constructor(props) {
        super(props);

        let {maxHealth = props.constructor.maxHealth || 1, structure} = props;

        this.maxHealth = maxHealth;

        if (structure) new Structure({entity: this, structure: structure});
        else this._tilemap = {};

        new Selection({entity: this, selectable: false});

    }

    get tilemap() {

        if (this.structure) return this.structure.footprint;
        else if (app.terrain) {
            if (this.x === this._tilemap.x && this.y === this._tilemap.y)
                return this._tilemap.footprint;

            this._tilemap.x = this.x;
            this._tilemap.y = this.y;
            this._tilemap.footprint = app.terrain.tilemap.pointToTilemap(this.x, this.y, this.radius);

            return this._tilemap.footprint;
        }

    }

    get tilemapCalculated() {

        if (this.structure) return true;

        if (app.terrain && this._tilemap.x === this.x && this._tilemap.y === this.y)
            return true;

        return false;

    }

}

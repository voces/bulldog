
class Tile {
    constructor(tilemap, x, y, tileType, vertices, faces) {
        this.tilemap = tilemap;
        this.x = x;
        this.y = y;
        this.tileType = tileType;
        this.vertices = vertices;
        this.faces = faces;
        this.nodes = [];
        this.tiles = [];

        this.entities = new Map();

        this.pathing = FOOTPRINT_TYPE.NOT_WALKABLE;

    }

    get minHeight() {
        return Math.min(this.vertices[0].z,
            this.vertices[1].z,
            this.vertices[2].z,
            this.vertices[3].z);
    }

    get maxHeight() {
        return Math.max(this.vertices[0].z,
            this.vertices[1].z,
            this.vertices[2].z,
            this.vertices[3].z);
    }

    setHSL(h, s, l) {

        let oldHSL = this.faces[0].color.getHSL();
        if (typeof h === "undefined") h = oldHSL.h;
        if (typeof s === "undefined") s = oldHSL.s;
        if (typeof l === "undefined") l = oldHSL.l;

        for (let i = 0; i < this.faces.length; i++)
            this.faces[i].color.setHSL(h, s, l);

        this.tilemap.geometry.colorsNeedUpdate = true;

    }

    setRGB(r, g, b) {
        for (let i = 0; i < this.faces.length; i++)
            this.faces[i].color.setRGB(r, g, b);

        app.terrain.geometry.colorsNeedUpdate = true
    }

    addRGB(r, g, b) {
        for (let i = 0; i < this.faces.length; i++) {
            this.faces[i].color.r += r;
            this.faces[i].color.g += g;
            this.faces[i].color.b += b;
        }

        app.terrain.geometry.colorsNeedUpdate = true
    }

    offsetHSL(hue = 0, saturation = 0, lightness = 0) {

        for (let i = 0; i < this.faces.length; i++)
            this.faces[i].color.offsetHSL(hue, saturation, lightness);

        this.tilemap.geometry.colorsNeedUpdate = true;

    }

    updateMap() {

        let wasWalkable = this.walkable;

        if (this.tileType === 0)
            this.pathing = FOOTPRINT_TYPE.OBSTACLE;
        else if (this.tileType < 2)
            this.pathing = FOOTPRINT_TYPE.NOT_BUILDABLE;
        else
            this.pathing = FOOTPRINT_TYPE.GROUND;

        for (let [entity, mapIndex] of this.entities)
            this.pathing |= entity.tilemap.map[mapIndex];

        if (wasWalkable && !this.walkable) {

            // console.log(this);

            for (let i = 0; i < this.tiles.length; i++) {
                let index = this.tiles[i].nodes.indexOf(this);
                if (index !== -1) this.tiles[i].nodes.splice(index, 1);
            }

            this.nodes = [];

        } else if (!wasWalkable && this.walkable) {

            // console.log("now walkable", this);

            for (let i = 0; i < this.tiles.length; i++) {
                let index = this.tiles[i].nodes.indexOf(this);
                if (index === -1) this.tiles[i].nodes.push(this);
            }

            this.nodes = [...this.tiles.filter(tile => tile.walkable)];

        }

        // console.log("update", this.pathing);

    }

    get walkable() { return (this.pathing & FOOTPRINT_TYPE.NOT_WALKABLE) === 0; }
    get buildable() { return (this.pathing & FOOTPRINT_TYPE.NOT_BUILDABLE) === 0; }

}

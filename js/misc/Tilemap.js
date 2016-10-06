
class Tilemap {
    constructor(width, height, vertices, orientationMap, tilemap) {

        this.width = width;
        this.height = height;
        this.vertices = vertices;
        this.orientationMap = orientationMap;
        this.tilemap = tilemap;

        let count = (width+1) * (height+1);

        let tiles = [];

        //[x][y]
        let grid = Array(width).fill(Array(height));

        console.log(width, height, vertices.length, orientationMap.length, Object.keys(tilemap).length);

        this.getTile(0, 0);

        // for (let i = 0; i < count; i++) {
        //     this.tiles.push(new Tile())
        // }

    }

    getTile(x, y) {

        // if (this.grid[x][y]) return this.grid[x][y];
        //
        // let i = y*(this.width+1) + x,
        //     surrounding = {},
        //     posMask =
        //
        //
        //
        // if (x > 0) {
        //     surrounding.left = this.getTile(x-1, y);
        //
        // }
        //
        // this.grid[x][y] = new Tile(x, y, this.tilemap[`${x},${y}`], [this.vertices[i], this.vertices[i+1], this.vertices[i+this.width+1], this.vertices[i+this.width+2]], this.orientationMap[i], {
        //
        // });
        //
        // this.tiles.push(this.grid[x][y])

    }
}

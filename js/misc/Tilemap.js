
class Tilemap {
    constructor(width, height, geometry, orientationMap, tilemap) {

        this.width = width;
        this.height = height;

        this.realWidth = width*8;
        this.realHeight = height*8;

        this.vertices = geometry.vertices;
        this.faces = geometry.faces;
        this.orientationMap = orientationMap;
        this.tilemap = tilemap;

        let count = (width+1) * (height+1);

        this.tiles = [];

        //[x][y]
        this.grid = Array(width + 1);
        for (let i = 0; i < width + 1; i++)
            this.grid[i] = Array(height + 1);

        this.createTile(0, 0);

    }

    createTile(x, y) {

        if (this.grid[x][y]) return this.grid[x][y];

        if (x < 0 || y < 0 || x === this.width || y === this.height) return;

        let vertexIndex = y*(this.width+1) + x,
            faceIndex = y*this.width + x,
            tile = new Tile(x, y, this.tilemap[`${x},${y}`], [this.vertices[vertexIndex], this.vertices[vertexIndex+1], this.vertices[vertexIndex+this.width+1], this.vertices[vertexIndex+this.width+2]], [this.faces[faceIndex], this.faces[faceIndex+1]]);

        setTimeout(() => {

            let posMask = (x > 0 ? 1 : 0) +
                    (x < this.width ? 2 : 0) +
                    (y > 0 ? 4 : 0) +
                    (y < this.height ? 8 : 0);

            tile.tiles = [];

            if ((posMask & 1) === 1) tile.tiles.push(tile.left = this.createTile(x-1, y));
            if ((posMask & 2) === 2) tile.tiles.push(tile.right = this.createTile(x+1, y));
            if ((posMask & 4) === 4) tile.tiles.push(tile.top = this.createTile(x, y-1));
            if ((posMask & 5) === 5) tile.tiles.push(tile.topLeft = this.createTile(x-1, y-1));
            if ((posMask & 6) === 6) tile.tiles.push(tile.topRight = this.createTile(x+1, y-1));
            if ((posMask & 8) === 8) tile.tiles.push(tile.bottom = this.createTile(x, y+1));
            if ((posMask & 9) === 9) tile.tiles.push(tile.bottomLeft = this.createTile(x-1, y+1));
            if ((posMask & 10) === 10) tile.tiles.push(tile.bottomRight = this.createTile(x+1, y+1));

        }, 0);

        this.grid[x][y] = tile;

        return tile;

    }

    getTile(x, y) {

        x = Math.floor((x + this.realWidth / 2) / 8);
        y = this.realHeight / 8 - Math.floor((y + this.realHeight / 2) / 8) - 1;

        // console.log(x, y, this.grid[x][y]);

        return this.grid[x][y];

    }
}

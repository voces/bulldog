
const FOOTPRINT_TYPE = {
        NOT_BUILDABLE: 1,
        NOT_WALKABLE: 2,
        NOT_FLYABLE: 4,
        SWIMABLE: 8
    };

FOOTPRINT_TYPE.OBSTACLE = FOOTPRINT_TYPE.NOT_BUILDABLE + FOOTPRINT_TYPE.NOT_WALKABLE;
FOOTPRINT_TYPE.GROUND = 0;

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

        this.grid = Array(width + 1);
        for (let i = 0; i < width + 1; i++)
            this.grid[i] = Array(height + 1);

        this.createTile(0, 0);

        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i],
                x = tile.x,
                y = tile.y,

                posMask = (x > 0 ? 1 : 0) +
                    (x < this.width ? 2 : 0) +
                    (y > 0 ? 4 : 0) +
                    (y < this.height ? 8 : 0);

                tile.tiles = [];

            if ((posMask & 1) === 1)
                tile.tiles.push(tile.left = this.createTile(x-1, y));
            if ((posMask & 2) === 2)
                tile.tiles.push(tile.right = this.createTile(x+1, y));
            if ((posMask & 4) === 4)
                tile.tiles.push(tile.top = this.createTile(x, y-1));
            if ((posMask & 5) === 5)
                tile.tiles.push(tile.topLeft = this.createTile(x-1, y-1));
            if ((posMask & 6) === 6)
                tile.tiles.push(tile.topRight = this.createTile(x+1, y-1));
            if ((posMask & 8) === 8)
                tile.tiles.push(tile.bottom = this.createTile(x, y+1));
            if ((posMask & 9) === 9) tile.tiles.push(tile.bottomLeft = this.createTile(x-1, y+1));
            if ((posMask & 10) === 10) tile.tiles.push(tile.bottomRight = this.createTile(x+1, y+1));
        }

    }

    createTile(x, y) {

        if (this.grid[x][y]) return this.grid[x][y];

        if (x < 0 || y < 0 || x === this.width || y === this.height) return;

        let vertexIndex = y*(this.width+1) + x,
            faceIndex = y*this.width + x,
            tile = new Tile(x, y, this.tilemap[`${x},${y}`], [this.vertices[vertexIndex], this.vertices[vertexIndex+1], this.vertices[vertexIndex+this.width+1], this.vertices[vertexIndex+this.width+2]], [this.faces[faceIndex], this.faces[faceIndex+1]]);

        this.tiles.push(tile);

        this.grid[x][y] = tile;

        return tile;

    }

    getTile(x, y) {

        x = Math.floor((x + this.realWidth / 2) / 8);
        y = this.realHeight / 8 - Math.floor((y + this.realHeight / 2) / 8) - 1;

        // console.log(x, y, this.grid[x][y]);

        return this.grid[x][y];

    }

    nearestPathing(x, y, type, radius) {



        x = (x + this.realWidth / 2) / 8;
        y = this.realHeight / 8 - (y + this.realHeight / 2) / 8 - 1;

        console.log("Tilemap.nearestPathing", x, y);

    }

    xWorldToTile(x) { return Math.floor((x + this.realWidth / 2) / 8); }
    yWorldToTile(y) { return this.realHeight / 8 - Math.floor((y + this.realHeight / 2) / 8) - 1 }

    xTileToWorld(x) { return (x + 0.5) * 8 - (this.realWidth / 2); }
    yTileToWorld(y) { return (-y - 1 + this.realHeight / 8 + 0.5) * 8 - this.realHeight / 2; }

    _pathable(x, y, map, type) {



    }

    pathable(x, y, map = 0, type = FOOTPRINT_TYPE.NOT_WALKABLE) {

        let xTile = this.xWorldToTile(x),
            yTile = this.yWorldToTile(y);

        console.log("x:", x, "y:", y);
        console.log("xTile:", xTile, "yTile:", yTile, "map:", map);
        console.log("x:", this.xTileToWorld(xTile), "y:", this.yTileToWorld(yTile));

        if (typeof map === "number") {

            let radius = map,
                tileRadius = map / 4,
                xMiss = x - this.xTileToWorld(xTile),
                yMiss = y - this.yTileToWorld(yTile);

            let minX = Math.max(-tileRadius, -xTile),
                maxX = Math.min(tileRadius, this.width - xTile - 1),
                minY = Math.max(-tileRadius, -yTile),
                maxY = Math.min(tileRadius, this.height - yTile - 1);

            map = [];

            console.log(xMiss, yMiss);
            console.log(minX, maxX, minY, maxY);

            for (let tY = minY; tY <= maxY; tY++)
                for (let tX = minX; tX <= maxX; tX++) {
                    let yDelta = tY < 0 ? (tY + 1) * 8 + yMiss : tY > 0 ? tY * -8 + yMiss : 0,
                        xDelta = tX < 0 ? (tX + 1) * -8 - xMiss : tX > 0 ? tX * 8 - xMiss : 0;

                    console.log("(", tX, tY, ")", xDelta, yDelta, Math.sqrt(xDelta**2 + yDelta**2) < radius);

                    if (Math.sqrt(xDelta**2 + yDelta**2) < radius)
                        map.push(type);
                    else map.push(0);

                }
        }

        console.log(map);

    }

}

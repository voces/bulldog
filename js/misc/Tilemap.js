
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

        this.realWidth = width*TERRAIN.TILE_SIZE;
        this.realHeight = height*TERRAIN.TILE_SIZE;

        this.geometry = geometry;

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
                    (x < this.width - 1 ? 2 : 0) +
                    (y > 0 ? 4 : 0) +
                    (y < this.height - 1 ? 8 : 0);

            if ((posMask & 1) === 1) {
                let leftTile = this.createTile(x-1, y);
                if (leftTile) {
                    tile.left = leftTile;
                    tile.tiles.push(leftTile);
                } else console.log("left");
            }

            if ((posMask & 2) === 2) {
                let rightTile = this.createTile(x+1, y);
                if (rightTile) {
                    tile.right = rightTile;
                    tile.tiles.push(rightTile);
                } else console.log("right");
            }

            if ((posMask & 4) === 4) {
                let topTile = this.createTile(x, y-1);
                if (topTile) {
                    tile.top = topTile;
                    tile.tiles.push(topTile);
                } else console.log("top");
            }

            if ((posMask & 8) === 8) {
                let bottomTile = this.createTile(x, y+1);
                if (bottomTile) {
                    tile.bottom = bottomTile;
                    tile.tiles.push(bottomTile);
                } else console.log("bottom");
            }

        }

        for (let i = 0; i < this.tiles.length; i++)
            this.tiles[i].updateMap();

    }

    createTile(x, y) {

        if (this.grid[x][y]) return this.grid[x][y];

        if (x < 0 || y < 0 || x === this.width || y === this.height) return;

        let vertexIndex = y*(this.width+1) + x,
            faceIndex = y*this.width*TERRAIN.TILE_PARTS + x*TERRAIN.TILE_PARTS,
            tile = new Tile(
                this,
                x, y,
                this.tilemap[`${x},${y}`],
                [   //TODO: TERRAIN.TILE_PARTS
                    this.vertices[vertexIndex],
                    this.vertices[vertexIndex+1],
                    this.vertices[vertexIndex+this.width+1],
                    this.vertices[vertexIndex+this.width+2]
                ], [
                    this.faces[faceIndex],
                    this.faces[faceIndex+1]
                ]
            );

        tile.faceIndex = faceIndex;

        // console.log(x, y, faceIndex);

        this.tiles.push(tile);

        this.grid[x][y] = tile;

        return tile;

    }

    getTile(x, y) {

        x = Math.floor((x + this.realWidth / TERRAIN.TILE_PARTS) / TERRAIN.TILE_SIZE);
        y = this.realHeight / TERRAIN.TILE_SIZE - Math.floor((y + this.realHeight / TERRAIN.TILE_PARTS) / TERRAIN.TILE_SIZE) - 1;

        return this.grid[x][y];

    }

    pathable(map, xTile, yTile) {

        if (xTile < 0 || yTile < 0 || xTile >= this.width || yTile >= this.height)
            return false;

        let i = 0;

        for (let x = xTile + map.left; x < xTile + map.width; x++)
            for (let y = yTile + map.top; y < yTile + map.height; y++, i++)
                if (this.grid[x][y].pathing & map.map[i])
                    return false;

        return true;

    }

    nearestPathing(x, y, entity) {

        let xTile = Math.floor((x + this.realWidth / TERRAIN.TILE_PARTS) / TERRAIN.TILE_SIZE),
            yTile = this.realHeight / TERRAIN.TILE_SIZE - Math.floor((y + this.realHeight / TERRAIN.TILE_PARTS) / TERRAIN.TILE_SIZE) - 1,

            xMiss = x - this.xTileToWorld(xTile) + TERRAIN.TILE_SIZE/TERRAIN.TILE_PARTS,
            yMiss = TERRAIN.TILE_SIZE - (y - this.yTileToWorld(yTile) + TERRAIN.TILE_SIZE/TERRAIN.TILE_PARTS),

            minimalTilemap,

            //0 down, 1 left, 2 up, 3 right
            direction = xMiss < yMiss ? TERRAIN.TILE_SIZE - xMiss < yMiss ? 0 : 1 : TERRAIN.TILE_SIZE - xMiss < yMiss ? 3 : 2,
            steps = 0,
            initialSteps = 0;

        this.updateTilemap();

        if (entity.structure)
            minimalTilemap = entity.tilemap;

        else
            minimalTilemap = this.pointToTilemap(entity.radius, entity.radius, entity.radius);

        let tried = [];
        if (this.grid[xTile] && this.grid[xTile][yTile])
            tried.push(this.grid[xTile][yTile])

        while (!this.pathable(minimalTilemap, xTile, yTile)) {

            switch (direction) {
                case 0: yTile++; break;
                case 1: xTile--; break;
                case 2: yTile--; break;
                case 3: xTile++; break;
            }

            if (this.grid[xTile] && this.grid[xTile][yTile])
                tried.push(this.grid[xTile][yTile])

            if (steps === 0) {
                steps = initialSteps;
                if (direction === 0 || direction == 2) initialSteps++;
                direction = (direction + 1) % 4;

            } else steps--;

        }

        let ticker = setInterval(() => {

            let tile = tried.shift(),
                fadeCount = 50;

            tile.offsetHSL(0.5);

            let innerTicker = setInterval(() => {

                tile.offsetHSL(0.01);

                if (!--fadeCount) clearInterval(innerTicker);

            }, 40);

            if (!tried.length) clearInterval(ticker);

        }, 70);

        // console.log(minimalTilemap, this.pathable(minimalTilemap, xTile, yTile));

        // this.grid[xTile][yTile].offsetHSL(0.25);

        return {
            x: this.xTileToWorld(xTile),
            y: this.yTileToWorld(yTile)
        };

    }

    xWorldToTile(x) { return Math.floor((x + this.realWidth / TERRAIN.TILE_PARTS) / TERRAIN.TILE_SIZE); }
    yWorldToTile(y) { return this.realHeight / TERRAIN.TILE_SIZE - Math.floor((y + this.realHeight / TERRAIN.TILE_PARTS) / TERRAIN.TILE_SIZE) - 1 }

    xTileToWorld(x) { return (x + 0.5) * TERRAIN.TILE_SIZE - (this.realWidth / TERRAIN.TILE_PARTS); }
    yTileToWorld(y) { return (-y - 1 + this.realHeight / TERRAIN.TILE_SIZE + 0.5) * TERRAIN.TILE_SIZE - this.realHeight / TERRAIN.TILE_PARTS; }

    updateTilemap() {

        let tiles = new Set();

        // for (let i = 1; i < 10; i++)
        for (let i = 0; i < app.dirtyEntities.length; i++)
            if (!(app.dirtyEntities[i] instanceof Destructible))
                app.dirtyEntities[i].dirty = false;
            else {

                let entity = app.dirtyEntities[i],
                    footprint = entity.tilemap,
                    x = this.xWorldToTile(entity.x),
                    y = this.yWorldToTile(entity.y);

                app.dirtyEntities[i].dirty = false;

                if (entity.tiles)
                    for (let n = 0; n < entity.tiles.length; n++) {
                        tiles.add(entity.tiles[n]);
                        entity.tiles[n].remove(entity);
                    }

                entity.tiles = [];

                for (let tX = footprint.left; tX < footprint.left + footprint.width; tX++)
                    for (let tY = footprint.top; tY < footprint.top + footprint.height; tY++) {
                        if (footprint.map[(tY - footprint.top) * footprint.width + tX - footprint.left] > 0) {
                            console.log(x, tX, y, tY);
                            let tile = this.grid[x + tX][y + tY];
                            entity.tiles.push(tile);
                            tiles.add(tile);
                            tile.entities.set(entity, (tY - footprint.top) * footprint.width + tX - footprint.left);
                        }

                    }

            }

        app.dirtyEntities = [];

        tiles = Array.from(tiles);
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].updateMap();

            let r = -0.5,
                g = -0.5,
                b = -0.5;

            if (tiles[i].pathing & FOOTPRINT_TYPE.NOT_BUILDABLE)
                r = 0.5;

            if (tiles[i].pathing & FOOTPRINT_TYPE.NOT_WALKABLE)
                b = 0.5;

            tiles[i].addRGB(r, g, b);
        }

    }

    pointToTilemap(x, y, radius = 0, type = FOOTPRINT_TYPE.OBSTACLE) {

        radius -= (Number.EPSILON * radius * this.realWidth);
        // console.log(x, y, radius);

        let xTile = this.xWorldToTile(x),
            yTile = this.yWorldToTile(y),

            map = [],

            xMiss = x - this.xTileToWorld(xTile) + 4,
            yMiss = TERRAIN.TILE_SIZE - (y - this.yTileToWorld(yTile) + 4),

            minX = Math.max(this.xWorldToTile(x - radius) - xTile, -xTile),
            maxX = Math.min(this.xWorldToTile(x + radius) - xTile, this.width - xTile - 1),
            minY = Math.max(this.yWorldToTile(y + radius) - yTile, -yTile),
            maxY = Math.min(this.yWorldToTile(y - radius) - yTile, this.height - yTile - 1);

        // console.log(xMiss, yMiss);
        // console.log(minX, maxX, minY, maxY);

        for (let tY = minY; tY <= maxY; tY++)
            for (let tX = minX; tX <= maxX; tX++) {
                let yDelta = tY < 0 ? (tY + 1) * TERRAIN.TILE_SIZE + yMiss : tY > 0 ? tY * -TERRAIN.TILE_SIZE + yMiss : 0,
                    xDelta = tX < 0 ? (tX + 1) * -TERRAIN.TILE_SIZE - xMiss : tX > 0 ? tX * TERRAIN.TILE_SIZE - xMiss : 0;

                // console.log("(", tX, tY, ")", Math.sqrt(xDelta**2 + yDelta**2) < radius);
                // console.log("xDelta:", tX < 0 ? "a" : tX > 0 ? "b" : "c", tX < 0 ? (tX + 1) * -8 : tX > 0 ? tX * 8 : 0, xDelta);
                // console.log("yDelta:", tY < 0 ? "a" : tY > 0 ? "b" : "c", tY < 0 ? (tY + 1) * 8 : tY > 0 ? tY * -8: 0, yDelta);

                if (Math.sqrt(xDelta**2 + yDelta**2) < radius)
                    map.push(type);
                else map.push(0);

            }

        let footprint = {
            map: map,
            top: minY,
            left: minX,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };

        // for (let tX = footprint.left; tX < footprint.left + footprint.width; tX++)
        //     for (let tY = footprint.top; tY < footprint.top + footprint.height; tY++) {
        //         if (footprint.map[(tY - footprint.top) * footprint.width + tX - footprint.left] > 0) {
        //             this.grid[xTile + tX][yTile + tY].offsetHSL(0.25);
        //         }
        //
        //     }

        return footprint;

    }

}

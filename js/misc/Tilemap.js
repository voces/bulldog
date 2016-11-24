
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
            faceIndex = y*this.width*2 + x*2,
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

        x = Math.floor((x + this.realWidth / 2) / TERRAIN.TILE_SIZE);
        y = this.height - Math.floor((y + this.realHeight / 2) / TERRAIN.TILE_SIZE) - 1;

        return this.grid[x][y];

    }

    mapToTiles(map, xOffset, yOffset) {

        let tiles = [];

        for (let x = xOffset + map.left, i = 0; x < xOffset + map.width; x++)
            for (let y = yOffset + map.top; y < yOffset + map.height; y++, i++)
                if (map.map[i])
                    tiles.push(this.grid[x][y])

        return tiles;

    }

    pathable(map, xTile, yTile) {

        if (xTile < 0 || yTile < 0 || xTile >= this.width || yTile >= this.height) {
            // console.log("bounds");
            return false;
        }

        let i = 0;

        for (let x = xTile + map.left; x < xTile + map.width + map.left; x++)
            for (let y = yTile + map.top; y < yTile + map.height + map.top; y++, i++)
                if (this.grid[x][y].pathing & map.map[i]) {
                    // console.log(x, y);
                    return false;
                }


        return true;

    }

    nearestPathing(x, y, entity) {

        let xTile = Math.floor((x + this.realWidth / 2) / TERRAIN.TILE_SIZE),
            yTile = this.height - Math.floor((y + this.realHeight / 2) / TERRAIN.TILE_SIZE) - 1,

            xMiss = x - this.xTileToWorld(xTile) + TERRAIN.TILE_SIZE/2,
            yMiss = TERRAIN.TILE_SIZE - (y - this.yTileToWorld(yTile) + TERRAIN.TILE_SIZE/2),

            minimalTilemap,

            //0 down, 1 left, 2 up, 3 right
            direction = xMiss < yMiss ? TERRAIN.TILE_SIZE - xMiss < yMiss ? 0 : 1 : TERRAIN.TILE_SIZE - xMiss < yMiss ? 3 : 2,
            steps = 0,
            stride = entity.structure ? 2 : 1,
            initialSteps = 0;

        this.updateTilemap();

        if (entity.structure)
            minimalTilemap = entity.tilemap;

        else
            minimalTilemap = this.pointToTilemap(entity.radius, entity.radius, entity.radius);

        // console.log(minimalTilemap);

        let tried = [];
        if (this.grid[xTile] && this.grid[xTile][yTile])
            tried.push(this.grid[xTile][yTile])

        while (!this.pathable(minimalTilemap, xTile, yTile)) {

            switch (direction) {
                case 0: yTile += stride; break;
                case 1: xTile -= stride; break;
                case 2: yTile -= stride; break;
                case 3: xTile += stride; break;
            }

            if (this.grid[xTile] && this.grid[xTile][yTile])
                tried.push(this.grid[xTile][yTile])

            if (steps === 0) {
                steps = initialSteps;
                if (direction === 0 || direction == 2) initialSteps++;
                direction = (direction + 1) % 4;

            } else steps--;

        }

        // let ticker = setInterval(() => {
        //
        //     let tile = tried.shift(),
        //         fadeCount = 50;
        //
        //     tile.offsetHSL(0.5);
        //
        //     let innerTicker = setInterval(() => {
        //
        //         tile.offsetHSL(0.01);
        //
        //         if (!--fadeCount) clearInterval(innerTicker);
        //
        //     }, 40);
        //
        //     if (!tried.length) clearInterval(ticker);
        //
        // }, 10);

        // console.log(minimalTilemap, this.pathable(minimalTilemap, xTile, yTile));

        // this.grid[xTile][yTile].offsetHSL(0.25);

        if (minimalTilemap.width % 2 === 0)
            x = xTile * TERRAIN.TILE_SIZE - (this.realWidth / 2);
        else
            x = (xTile + 0.5) * TERRAIN.TILE_SIZE - (this.realWidth / 2);

        if (minimalTilemap.height % 2 === 0)
            y = (-yTile - 1 + this.realHeight / TERRAIN.TILE_SIZE) * TERRAIN.TILE_SIZE - this.realHeight / 2;
        else
            y = (-yTile - 1 + this.realHeight / TERRAIN.TILE_SIZE + 0.5) * TERRAIN.TILE_SIZE - this.realHeight / 2;

        return {
            x: x,
            y: y
        };

    }

    xWorldToTile(x) { return Math.floor((x + this.realWidth / 2) / TERRAIN.TILE_SIZE); }
    yWorldToTile(y) { return this.height - Math.floor((y + this.realHeight / 2) / TERRAIN.TILE_SIZE) - 1 }

    xTileToWorld(x) { return (x + 0.5) * TERRAIN.TILE_SIZE - (this.realWidth / 2); }
    yTileToWorld(y) { return (-y - 1 + this.realHeight / TERRAIN.TILE_SIZE + 0.5) * TERRAIN.TILE_SIZE - this.realHeight / 2; }

    updateTilemap() {

        let tiles = new Set();

        // for (let i = 1; i < 10; i++)
        for (let i = 0; i < app.dirtyEntities.length; i++)
            if (!(app.dirtyEntities[i] instanceof Destructible) || (app.dirtyEntities[i] instanceof Unit && !app.dirtyEntities[i].structure && app.dirtyEntities[i].owner === app.localPlayer))
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
                        if (footprint.map[(tY - footprint.top) * footprint.width + tX - footprint.left] > 0 && x+tX > 0 && y+tY > 0 && x+tX < this.width && y+tY < this.height) {
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

    pointToTilemap(x, y, radius = 0, type = FOOTPRINT_TYPE.NOT_WALKABLE) {

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

    //Adapted from https://github.com/bgrins/javascript-astar/blob/master/astar.js
    path(entity, target) {

        this.updateTilemap();

        let start = this.grid[this.xWorldToTile(entity.x)][this.yWorldToTile(entity.y)],
            end = this.grid[this.xWorldToTile(target.x)][this.yWorldToTile(target.y)],

            tag = Math.random(),

            h = (a, b) => Math.abs(b.x - a.x)**2 + Math.abs(b.y - a.y)**2,
            openHeap = new BinaryHeap(node => node.__f),

            best = start,

            minimalTilemap;

        // console.log(start, end);

        openHeap.push(start);
        start.__dirty = tag;
        start.__h = h(start, end);
        start.__f = 0;
        start.__g = 0;
        start.__visited = false;
        start.__closed = false;
        start.__parent = null;

        if (entity.structure)
            minimalTilemap = entity.tilemap;

        else
            minimalTilemap = this.pointToTilemap(entity.radius, entity.radius, entity.radius);

        while (openHeap.length) {

            let current = openHeap.pop();

            // console.log("best:", best);
            // console.log("current:", current);

            if (current === end) break;

            current.__closed = true;

            let neighbors = current.nodes;

            // console.log("a", neighbors.length);

            for (let i = 0, length = neighbors.length; i < length; i++) {

                let neighbor = neighbors[i];

                if (neighbor.__dirty !== tag) {
                    neighbor.__dirty = tag;
                    neighbor.__h = 0;
                    neighbor.__f = 0;
                    neighbor.__g = 0;
                    neighbor.__visited = false;
                    neighbor.__closed = false;
                    neighbor.__parent = null;
                }

                let wasVisited = neighbor.__visited;

                if (neighbor.__closed || !neighbor.walkable) continue;
                else if (!this.pathable(minimalTilemap, neighbor.x, neighbor.y)) {
                    neighbor.__closed = true;
                    continue;
                }

                // console.log("c");

                let gScore = current.__g + 1;

                if (!neighbor.__visited || gScore < neighbors.__g) {

                    // console.log("d");

                    neighbor.__visited = true;
                    neighbor.__parent = current;
                    neighbor.__h = neighbor.__h || h(neighbor, end);
                    neighbor.__g = gScore;
                    neighbor.__f = neighbor.__g + neighbor.__h;

                    if (neighbor.__h < best.__h || (neighbor.__h === best.__h && neighbor.__g < best.__g))
                        best = neighbor;

                    if (!wasVisited)
                        openHeap.push(neighbor);
                    else
                        openHeap.sinkDown(openHeap.indexOf(neighbor));

                }

            }

        }

        let path = [],
            current = best;

        while (current.__parent) {
            path.unshift(current);
            current = current.__parent;
        }

        // path.unshift(this.getTile(entity.x, entity.y));
        // path.push(this.getTile(target.x, target.y));

        return this.smooth(entity, path).map(tile => ({
            x: this.xTileToWorld(tile.x - 0.5),
            y: this.yTileToWorld(tile.y + 0.5)}));
        // return this.smooth(entity, path);

    }

    linearPathable(entity, start, end) {

        let angle = Math.atan2(end.y - start.y, end.x - start.x),
            dx = angle > Math.PI/-2 && angle < Math.PI/2 ? 1 : -1,
            dy = angle > 0 ? 1 : -1,
            x = this.xTileToWorld(start.x - 0.5),
            y = this.yTileToWorld(start.y + 0.5),
            endX = this.xTileToWorld(end.x - 0.5),
            endY = this.yTileToWorld(end.y + 0.5);

        // box(x, y, 0x0000FF);
        // box(endX, endY, 0xFF0000);

        // console.log({x: start.x, y: start.y}, {x: end.x, y: end.y});
        // console.log(angle, dx, dy, x, y, this.xWorldToTile(x), this.yWorldToTile(y));

        if (dx === 1)

            for (let xStep = x + TERRAIN.TILE_SIZE/2; xStep < endX; xStep += TERRAIN.TILE_SIZE/2) {
                if (!this.pathable(this.pointToTilemap(xStep, y - (xStep-x)*Math.tan(angle), entity.radius), this.xWorldToTile(xStep), this.yWorldToTile(y - (xStep-x)*Math.tan(angle)))) {
                    // box(xStep, y - (xStep-x)*Math.tan(angle));
                    return false;
                }

                // box(xStep, y - (xStep-x)*Math.tan(angle), 0xFFFFFF);

            }

        else

            for (let xStep = x - TERRAIN.TILE_SIZE/2; xStep > endX; xStep -= TERRAIN.TILE_SIZE/2) {
                if (!this.pathable(this.pointToTilemap(xStep, y - (xStep-x)*Math.tan(angle), entity.radius), this.xWorldToTile(xStep), this.yWorldToTile(y - (xStep-x)*Math.tan(angle)))) {
                    // box(xStep, y - (xStep-x)*Math.tan(angle));
                    return false;
                }

                // box(xStep, y - (xStep-x)*Math.tan(angle), 0xFFFFFF);
            }

        if (dy === 1)

            for (let yStep = y - TERRAIN.TILE_SIZE/2; yStep > endY; yStep -= TERRAIN.TILE_SIZE/2) {

                if (!this.pathable(this.pointToTilemap(x - (yStep-y)/Math.tan(angle), yStep, entity.radius), this.xWorldToTile(x - (yStep-y)/Math.tan(angle)), this.yWorldToTile(yStep))) {
                    // box(x - (yStep-y)/Math.tan(angle), yStep);
                    return false;
                }

                // box(x - (yStep-y)/Math.tan(angle), yStep, 0xFFFFFF);

            }

        else

            for (let yStep = y + TERRAIN.TILE_SIZE/2; yStep < endY; yStep += TERRAIN.TILE_SIZE/2) {

                if (!this.pathable(this.pointToTilemap(x - (yStep-y)/Math.tan(angle), yStep, entity.radius), this.xWorldToTile(x - (yStep-y)/Math.tan(angle)), this.yWorldToTile(yStep))) {
                    // box(x - (yStep-y)/Math.tan(angle), yStep);
                    return false;
                }

                // box(x - (yStep-y)/Math.tan(angle), yStep, 0xFFFFFF);

            }

        return true;

    }

    smooth(entity, path) {

        let outerFlag = true;

        while (outerFlag) {
            outerFlag = false;

            // console.log("outer");

            let innerFlag = true;
            while (innerFlag) {
                innerFlag = false;

                // console.log("inner1");

                for (let i = 2; i < path.length; i++) {

                    if ((path[i].x - path[i-2].x) * (path[i].y - path[i-2].y) !== 0 &&
                            this.linearPathable(entity, path[i-2], path[i])) {

                        // console.log("diag", i-2, i, path[i-1]);
                        path.splice(i-1, 1);

                        // if (!outerFlag) console.log("inner1 hit");
                        innerFlag = true;
                        outerFlag = true;

                    }
                    //  else console.log("not diag", i-2, i);

                }

            }

            innerFlag = true;
            while (innerFlag) {
                innerFlag = false;

                // console.log("inner2");

                for (let i = 2; i < path.length; i++) {

                    //Only smooth diagnols
                    if ((path[i].x === path[i-1].x && path[i].x === path[i-2].x) ||
                        (path[i].y === path[i-1].y && path[i].y === path[i-2].y)) {

                        // console.log("line", i-2, i);
                        path.splice(i-1, 1);

                        // if (!outerFlag) console.log("inner2 hit");
                        innerFlag = true;
                        outerFlag = true;

                        if (i < path.length && (path[i].x - path[i-2].x) * (path[i].y - path[i-2].y) !== 0 &&
                                this.linearPathable(entity, path[i-2], path[i])) {

                            // console.log("diag", i-2, i, path[i-1]);
                            path.splice(i-1, 1);
                        }
                    }

                }
            }

        }

        // console.log(path);

        return path;
    }

}

function boxPoint(x, y, color) {
    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(3,3,3), new THREE.MeshBasicMaterial({color: color}));
    box.position.x = x;
    box.position.y = y;
    box.position.z = 8;
    app.graphic.scene.add(box);
}

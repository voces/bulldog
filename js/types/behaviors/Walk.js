
function box(x, y, color = 0x000000) {
    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 20), new THREE.MeshBasicMaterial({color: color}));

    box.position.x = x;
    box.position.y = y;

    app.graphic.scene.add(box);

}

function connection(x, y, length, angle) {
    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, length, 1), new THREE.MeshBasicMaterial());

    box.position.x = x;
    box.position.y = y;
    box.position.z = 2;

    box.rotation.z = angle + Math.PI/2;

    app.graphic.scene.add(box);
}

class Walk extends Behavior {

    constructor(props) {
        super(props);

        this.entity = props.entity;

        this.movementSpeed = props.movementSpeed || 100;

        this.entity.walk = point => this.walk(point);

        this.entity.interaction[2].push({
            filter: entity => entity instanceof Terrain,
            callback: Walk.rightClickTerrainToWalk
        }, {
            filter: entity => entity instanceof Destructible,
            callback: Walk.rightclickDestructibleToWalk
        });

    }

    static rightClickTerrainToWalk(intersect) {
        for (let i = 0; i < app.mouse.selection.length; i++)
            app.mouse.selection[i].walk(intersect.point);
    }

    static rightclickDestructibleToWalk(intersect) {
        for (let i = 0; i < app.mouse.selection.length; i++)
            app.mouse.selection[i].walk(app.mouse.topIntersect([{filter: entity => entity instanceof Terrain}]).point);
    }

    walk(point) {

        let xTile = app.terrain.tilemap.xWorldToTile(point.x),
            yTile = app.terrain.tilemap.yWorldToTile(point.y),
        //
        //     source = {
        //         x: this.entity.x,
        //         y: this.entity.y
        //     },
            target;

        if (app.terrain.tilemap.pathable(this.entity.tilemap, xTile, yTile))
            target = point;
        else
            target = app.terrain.tilemap.nearestPathing(point.x, point.y, this.entity);

        xTile = app.terrain.tilemap.xWorldToTile(target.x);
        yTile = app.terrain.tilemap.yWorldToTile(target.y);

        // console.log(target.x, target.y);

        let map = app.terrain.tilemap.pointToTilemap(target.x, target.y, this.entity.radius),
            tiles = [];

        for (let x = map.left; x < map.width + map.left; x++)
            for (let y = map.top; y < map.height + map.top; y++)
                tiles.push(app.terrain.tilemap.grid[xTile + x][yTile + y]);

        // console.log(tiles);
        //
        // for (let i = 0; i < tiles.length; i++)
        //     tiles[i].offsetHSL(0.5);
        //
        // let count = 50;
        // let ticker = setInterval(() => {
        //
        //     for (let i = 0; i < tiles.length; i++)
        //         tiles[i].offsetHSL(0.01);
        //
        //     if (!--count) clearInterval(ticker);
        //
        // }, 40);

        let path = app.terrain.tilemap.path(this.entity, target);

        // console.log([...path]);

        // for (let i = 1; i < path.length; i++) {
        //     let length = Math.sqrt((path[i].x - path[i-1].x)**2 + (path[i].y - path[i-1].y)**2),
        //         xCenter = (path[i].x + path[i-1].x)/2,
        //         yCenter = (path[i].y + path[i-1].y)/2,
        //         angle = Math.atan2(path[i].y - path[i-1].y, path[i].x - path[i-1].x);
        //
        //     connection(xCenter, yCenter, length, angle);
        //     box(path[i].x, path[i].y);
        //
        // }

        // for (let i = 0; i < path.length; i++)
        //     box(path[i].x, path[i].y);

        // let ticker2 = setInterval(() => {
        //
        //     let point = path.shift(),
        //         fadeCount = 50,
        //         tiles = app.terrain.tilemap.mapToTiles(app.terrain.tilemap.pointToTilemap(point.x, point.y, this.entity.radius), app.terrain.tilemap.xWorldToTile(point.x), app.terrain.tilemap.yWorldToTile(point.y));
        //
        //     for (let i = 0; i < tiles.length; i++) {
        //
        //         let tile = tiles[i];
        //
        //         clearInterval(tile.fader);
        //
        //         tile.ticks = 50;
        //
        //         if (!tile.originalHSL)
        //             tile.originalHSL = tile.getHSL();
        //
        //         tile.setHSL(
        //             tile.originalHSL.h + .25,
        //             tile.originalHSL.s,
        //             tile.originalHSL.l);
        //
        //         // tile.fader = setInterval(() => {
        //         //
        //         //     tile.offsetHSL(0.01);
        //         //
        //         //     if (!(--tile.ticks)) {
        //         //         tile.setHSL(tile.originalHSL.h, tile.originalHSL.s, tile.originalHSL.l);
        //         //         clearInterval(tile.fader);
        //         //     }
        //         //
        //         // }, 80);
        //     }
        //
        //
        //     if (!path.length) clearInterval(ticker2);
        //
        // }, 40);

    }

}

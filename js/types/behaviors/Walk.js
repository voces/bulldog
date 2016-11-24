
//TODO: This behavior never turns off; to do so, it'd need a way to turn on autonmously...

function box(x, y, color = 0x000000) {
    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 20), new THREE.MeshBasicMaterial({color: color}));

    box.position.x = x;
    box.position.y = y;

    app.graphic.scene.add(box);

    return box;

}

function connection(x, y, length, angle) {
    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, length, 1), new THREE.MeshBasicMaterial());

    box.position.x = x;
    box.position.y = y;
    box.position.z = 2;

    box.rotation.z = angle + Math.PI/2;

    app.graphic.scene.add(box);

    return box;
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

        let sent = Date.now();
        app.ws.send({eid: "walk", point: point}, message => {

            let xTile = app.terrain.tilemap.xWorldToTile(point.x),
                yTile = app.terrain.tilemap.yWorldToTile(point.y),

                target;

            if (app.terrain.tilemap.pathable(this.entity.tilemap, xTile, yTile))
                target = point;
            else
                target = app.terrain.tilemap.nearestPathing(point.x, point.y, this.entity);

            xTile = app.terrain.tilemap.xWorldToTile(target.x);
            yTile = app.terrain.tilemap.yWorldToTile(target.y);

            let map = app.terrain.tilemap.pointToTilemap(target.x, target.y, this.entity.radius),
                tiles = [];

            for (let x = map.left; x < map.width + map.left; x++)
                for (let y = map.top; y < map.height + map.top; y++)
                    tiles.push(app.terrain.tilemap.grid[xTile + x][yTile + y]);

            let path = app.terrain.tilemap.path(this.entity, target),
                current = -1;

            path[0].start = syncProperty.time;
            for (let i = 1; i < path.length; i++) {
                let distance = Math.sqrt((path[i].x - path[i-1].x)**2 + (path[i].y - path[i-1].y)**2);

                path[i-1].distance = distance;
                path[i-1].xDistance = path[i].x - path[i-1].x;
                path[i-1].yDistance = path[i].y - path[i-1].y;
                path[i-1].duration = distance / this.movementSpeed * 1000;
                path[i-1].angle = Math.atan2(path[i].y - path[i-1].y, path[i].x - path[i-1].x);
                path[i-1].end = path[i-1].start + path[i-1].duration;
                path[i].start = path[i-1].end;
            }

            this.entity.x = time => {

                let oldCurrent = current;

                while (current === -1 || (current < path.length -1 && time >= path[current].end))
                    current++;

                if (oldCurrent !== current && current !== path.length - 1)
                    this.heading = path[current].angle;
                    // this.entity.mesh.rotation.z = path[current].angle;

                if (current === path.length - 1) {
                    this.entity.x = path[path.length - 1].x;
                    return this.entity.x;
                }

                return path[current].x + path[current].xDistance * ((time - path[current].start) / path[current].duration);

            };

            this.entity.y = time => {

                while (current < path.length -1 && time >= path[current].end)
                    current++;

                if (current === path.length - 1) {
                    this.entity.y = path[path.length - 1].y;
                    return this.entity.y;
                }

                return path[current].y + path[current].yDistance * ((time - path[current].start) / path[current].duration);

            };

            this.active = true;

        });

        return;

        {
            let xTile = app.terrain.tilemap.xWorldToTile(point.x),
                yTile = app.terrain.tilemap.yWorldToTile(point.y),

                target;

            if (app.terrain.tilemap.pathable(this.entity.tilemap, xTile, yTile))
                target = point;
            else
                target = app.terrain.tilemap.nearestPathing(point.x, point.y, this.entity);

            xTile = app.terrain.tilemap.xWorldToTile(target.x);
            yTile = app.terrain.tilemap.yWorldToTile(target.y);

            let map = app.terrain.tilemap.pointToTilemap(target.x, target.y, this.entity.radius),
                tiles = [];

            for (let x = map.left; x < map.width + map.left; x++)
                for (let y = map.top; y < map.height + map.top; y++)
                    tiles.push(app.terrain.tilemap.grid[xTile + x][yTile + y]);

            let path = app.terrain.tilemap.path(this.entity, target);

            for (let i = 1; i < path.length; i++) {
                let length = Math.sqrt((path[i].x - path[i-1].x)**2 + (path[i].y - path[i-1].y)**2),
                    xCenter = (path[i].x + path[i-1].x)/2,
                    yCenter = (path[i].y + path[i-1].y)/2,
                    angle = Math.atan2(path[i].y - path[i-1].y, path[i].x - path[i-1].x);

                let rope = connection(xCenter, yCenter, length, angle),
                    pole = box(path[i].x, path[i].y),

                    ticker = setInterval(() => {
                        rope.material.opacity -= 0.01;
                        pole.material.opacity -= 0.01;

                        if (rope.material.opacity <= 0) {
                            app.graphic.scene.remove(rope);
                            app.graphic.scene.remove(pole);
                            clearInterval(ticker);
                        }

                    }, 20);

                rope.material.transparent = true;
                pole.material.transparent = true;

            }
        }

    }

    update() {
        // console.log("Walk.update", syncProperty.time, this.entity.x);
        if (this.entity.mesh) {
            let x = this.entity.x,
                oldX = this.entity.mesh.position.x,
                deltaX = Math.abs(oldX - x),

                y = this.entity.y,
                oldY = this.entity.mesh.position.y,
                deltaY = Math.abs(oldY - y);

            if (deltaX > 256 || deltaX < 2) {
                if (deltaX > 256) console.log("jumpX");
                this.entity.mesh.position.x = x;
            } else {
                console.log("smoothX");
                this.entity.mesh.position.x = oldX * 0.6 + x * 0.4;
            }

            if (deltaY > 256 || deltaY < 2) {
                if (deltaY > 256) console.log("jumpY");
                this.entity.mesh.position.y = y;
            } else {
                console.log("smoothY");
                this.entity.mesh.position.y = oldY * 0.6 + y * 0.4;
            }

            this.entity.mesh.rotation.z = this.entity.mesh.rotation.z * 0.8 + this.heading * 0.2;

        }
        // if (this.entity.mesh) this.entity.mesh.y = this.entity.y;
    }

}

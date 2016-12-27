
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
        this.turnSpeed = props.turnSpeed / Math.PI / 2 || Math.PI / 16;

        this.entity.walk = point => this.walk(point);

        this.entity.interaction[2].push({
            filter: entity => entity instanceof Terrain,
            callback: Walk.rightClickTerrainToWalk
        }, {
            filter: entity => entity instanceof Destructible,
            callback: Walk.rightclickDestructibleToWalk
        });

        this._smoothing = 0.3;
        this._lastSmoothed = false;

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
        app.ws.json({id: "walk", point: point}).then(({point}) => {

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

            // console.log(path.map(p => p.angle));

            this.entity.x = time => {

                let oldCurrent = current;

                while (current === -1 || (current < path.length -1 && time >= path[current].end))
                    current++;

                if (oldCurrent !== current && current !== path.length - 1) {

                    if (Math.abs(this.entity.mesh.rotation.z) >= Math.PI)
                        this.entity.mesh.rotation.z = this.entity.mesh.rotation.z % Math.PI

                    this.heading = path[current].angle;
                    let difference = this.entity.mesh.rotation.z - path[current].angle;

                    if (Math.abs(difference) >= Math.PI) {
                        if (difference > 0) this.heading += Math.PI*2;
                        else this.entity.mesh.rotation.z -= Math.PI*2;

                    }

                    // console.log(this.heading, this.entity.mesh.rotation.z);

                    // console.log(this.entity.mesh.rotation.z, path[current].angle, this.entity.mesh.rotation.z - path[current].angle);
                }

                if (current === path.length - 1) {
                    this.entity.x = path[path.length - 1].x;
                    return path[path.length - 1].x;
                }

                return path[current].x + path[current].xDistance * ((time - path[current].start) / path[current].duration);

            };

            this.entity.y = time => {

                while (current < path.length -1 && time >= path[current].end)
                    current++;

                if (current === path.length - 1) {
                    this.entity.y = path[path.length - 1].y;
                    return path[path.length - 1].y;
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

                // if (deltaX > 256) console.log("jumpX");
                if (deltaX !== 0) {
                    this.entity.animate("walk");
                } else {
                    // this.entity.animate("idle");
                    this.entity.animate("walk", 0);
                }

                this._smoothing = 0.1;
                this._lastSmoothed = false;
                this.entity.mesh.position.x = x;

            } else {

                if (this._lastSmoothed) this._smoothing = Math.max(this._smoothing * 1.2, 1);
                this._lastSmoothed = true;
                // console.log("smoothX", this._smoothing);
                this.entity.mesh.position.x = oldX * (1-this._smoothing) + x * this._smoothing;
            }

            if (deltaY > 256 || deltaY < 2) {
                // if (deltaY > 256) console.log("jumpY");
                this.entity.mesh.position.y = y;
            } else {
                // console.log("smoothY");
                this.entity.mesh.position.y = oldY * (1-this._smoothing) + y * this._smoothing;
            }

            if (this.entity.mesh.rotation.z > this.heading)
                this.entity.mesh.rotation.z = Math.max(this.entity.mesh.rotation.z - this.turnSpeed, this.heading) || this.heading;

            else
                this.entity.mesh.rotation.z = Math.min(this.entity.mesh.rotation.z + this.turnSpeed, this.heading) || this.heading;

            // console.log(this.entity.mesh.position.z, app.terrain.groundHeight(this.entity.mesh.position.x, this.entity.mesh.position.y));
            this.entity.mesh.position.z = this.entity.mesh.position.z * 0.7 + app.terrain.groundHeight(this.entity.mesh.position.x, this.entity.mesh.position.y) * 0.3;

            if (this.entity.selection) {
                this.entity.selection.selectionCircle.mesh.position.x = this.entity.mesh.position.x;
                this.entity.selection.selectionCircle.mesh.position.y = this.entity.mesh.position.y;
                this.entity.selection.selectionCircle.mesh.position.z = this.entity.mesh.position.z;
            }

            // console.log(app.terrain.groundHeight(this.entity.mesh.position.x, this.entity.mesh.position.y));
            // if (Math.abs(oldX - this.entity.mesh.position.x) + Math.abs(oldY - this.entity.mesh.position.y) > 3)
            //     console.log(this._lastSmoothed, Math.abs(oldX - this.entity.mesh.position.x), Math.abs(oldY - this.entity.mesh.position.y), this._smoothing);

            // this.entity.mesh.rotation.z = this.entity.mesh.rotation.z * 0.8 + this.heading * 0.2;

        }
        // if (this.entity.mesh) this.entity.mesh.y = this.entity.y;
    }

}

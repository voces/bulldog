
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

            source = {
                x: this.entity.x,
                y: this.entity.y
            },
            target;

        if (app.terrain.tilemap.pathable(this.entity.tilemap, xTile, yTile))
            target = point;
        else
            target = app.terrain.tilemap.nearestPathing(point.x, point.y, this.entity);

        let path = app.terrain.tilemap.path(this.entity, target);

        let ticker = setInterval(() => {

            let tile = path.shift(),
                fadeCount = 50;

            tile.offsetHSL(0.5);

            let innerTicker = setInterval(() => {

                tile.offsetHSL(0.01);

                if (!--fadeCount) clearInterval(innerTicker);

            }, 40);

            if (!path.length) clearInterval(ticker);

        }, 40);

    }

}

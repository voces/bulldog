
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
        app.terrain.tilemap.tilemap(point.x, point.y, this.entity.radius);
    }

}

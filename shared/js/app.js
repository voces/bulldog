
class App extends EventEmitter2 {

    constructor() {
        super();

        this.entityArray = [];
        this.entityMap = new Map();

        this.animatedEntities = [];

        ws.on("message", message => this.emit("message", message));

        graphic.on("hoverOn", intersect => this.emit("hoverOn", intersect));
        graphic.on("hoverOff", (oldIntersect, newIntersect) => this.emit("hoverOff", oldIntersect, newIntersect));
        graphic.on("hoverFace", intersect => this.emit("hoverFace", intersect));
        graphic.on("hover", intersect => this.emit("hover", intersect));

        this.game = new Game(this);

        this.game.on("newEntity", entity => this.newEntity(entity));

    }

    newEntity(entity) {
        this.entityArray.push(entity);
        this.entityMap.set(entity.id, entity);

        if (entity.mesh) {
            graphic.scene.add(entity.mesh);

            if (entity.animated) graphic.updates.push((delta) => entity.mixer.update(delta));

        }

    }

}

window.app = new App();

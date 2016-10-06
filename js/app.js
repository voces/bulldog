
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

        this.game.on("showEntity", entity => this.showEntity(entity));
        this.game.on("hideEntity", entity => this.hideEntity(entity));

    }

    showEntity(entity) {
        this.entityArray.push(entity);
        this.entityMap.set(entity.id, entity);

        if (entity.mesh) {
            graphic.scene.add(entity.mesh);

            entity.mixerProxy = (delta) => entity.mixer.update(delta);

            if (entity.mixer) graphic.updates.push(entity.mixerProxy);

        }

    }

    hideEntity(entity) {

        this.entityArray.splice(this.entityArray.indexOf(entity), 1);
        this.entityMap.delete(entity.id);

        if (entity.mesh) {
            graphic.scene.remove(entity.mesh);

            if (entity.mixer)
                graphic.updates.splice(graphic.upgrades.indexOf(entity.mixerProxy), 1);
        }

    }

}

window.app = new App();

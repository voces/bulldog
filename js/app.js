
const SELECTION_FILTER = {
    UNITS: {
        type: Unit
    }
};

class App extends EventEmitter2 {

    constructor() {
        super({maxListeners: 20});

        this.players = [];

        this.entities = new Set();
        this.activeEntities = new Set();

        this.selectionFilter = SELECTION_FILTER.UNITS;

        ws.on("message", message => this.messageSwitcher(message));

        graphic.on("hoverOn", intersect => intersect.object.entity.emit("hoverOn", intersect));
        graphic.on("hoverOff", (oldIntersect, newIntersect) => {
            oldIntersect.object.entity.emit("hoverOff", oldIntersect, newIntersect);
            if (newIntersect)
                newIntersect.object.entity.emit("hoverOn", newIntersect);
        });
        graphic.on("hoverFace", (oldIntersect, newIntersect) => oldIntersect.object.entity.emit("hoverFace", oldIntersect, newIntersect));
        graphic.on("hover", intersect => intersect.object.entity.emit("hover", intersect));
        graphic.on("mouseDown", (intersect, e) => intersect.object.entity.emit("mouseDown", intersect, e));
        graphic.on("mouseUp", (intersect, e) => intersect.object.entity.emit("mouseUp", intersect, e));

        Doodad.on("new", entity => this.newEntity(entity));
        
        graphic.updates.push(this);

    }

    messageSwitcher(message) {
        if (message.origin === -1)
            switch (message.eid) {
                case "connected": this.connected(message);
            }
        else this.emit(message.eid, message);
    }

    connected(message) {

        this.rng = new RNG(message.state.seed);
        this.emit("rng", this.rng);

        for (let i = 0; i < message.party.length; i++)
            this.players.push(new Player(message.party[i]));

        this.localPlayer = new Player({id: message.clientId, isLocalPlayer: true});
        this.players.push(this.localPlayer);
        // this.localPlayer.on("currency", value => this.ui.currency = value);

        this.emit("connected", message);

    }

    newEntity(entity) {

        if (this.entities.has(entity)) return;

        this.entities.add(entity);

        if (entity.mesh && entity.visible) this.showMesh(entity);

        if (entity.active) this.activeEntities.add(entity);

        //When the entity is DESTROYED, non-recoverable
        entity.on("remove", () => this.remove(entity));

        // console.log("newEntity", entity.constructor.name);
        entity.on("show", () => this.showMesh(entity));
        entity.on("hide", () => this.hideMesh(entity));

        //If the entity is put through the update loop
        entity.on("active", () => this.activeEntities.add(entity));
        entity.on("inactive", () => this.activeEntities.remove(entity));

    }

    showMesh(entity) {
        if (entity._meshAdded) graphic.scene.remove(entity._meshAdded);
        if (!entity.mesh) return;

        entity._meshAdded = entity.mesh;
        graphic.scene.add(entity.mesh);
    }

    hideMesh(entity) {

        if (!entity._meshAdded) return;

        graphic.scene.remove(entity._meshAdded);
        entity._meshAdded = false;

    }

    removeEntity(entity) {

        if (this.entities.has(entity)) {
            this.entities.remove(entity);

            if (entity._meshAdded) graphic.scene.remove(entity._meshAdded);
        }

        if (entity.active) this.activeEntities.remove(entity);

    }

    update(delta) {

        for (let entity in this.activeEntities)
            entity.update(delta);

    }

}

window.app = new App();

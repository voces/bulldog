
class App extends EventEmitter2 {

    constructor() {
        super({maxListeners: 20});

        this.players = [];

        this.entities = [];
        this.activeEntities = new Set();
        this.dirtyEntities = [];

        this.graphic = new Graphic();

        this.mouse = new Mouse(this);

        this.ui = new UI();

        this.ui.showResourceDisplay();
        this.ui.showCommandDeck();

        this.ws = new WS();
        this.ws.on("message", message => this.messageSwitcher(message));

        Doodad.on("new", entity => this.newEntity(entity));

        this.graphic.updates.push(this);

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
        this.localPlayer.on("currency", value => this.ui.currency = value);

        this.ws.localPlayer = this.localPlayer;

        this.emit("connected", message);

    }

    newEntity(entity) {

        this.entities.push(entity);

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

        entity.on("dirty", () => this.dirtyEntities.push(entity));
        this.dirtyEntities.push(entity);

    }

    showMesh(entity) {
        if (entity._meshAdded) this.graphic.scene.remove(entity._meshAdded);
        if (!entity.mesh) return;

        entity._meshAdded = entity.mesh;
        this.graphic.scene.add(entity.mesh);
    }

    hideMesh(entity) {

        if (!entity._meshAdded) return;

        this.graphic.scene.remove(entity._meshAdded);
        entity._meshAdded = false;

    }

    removeEntity(entity) {

        this.entities.splice(this.entities.indexOf(entity), 1);

        if (entity._meshAdded) this.graphic.scene.remove(entity._meshAdded);

        if (entity.active) this.activeEntities.remove(entity);

    }

    update(delta) {
        // console.log("app.update");
        for (let entity of this.activeEntities)
            entity.update(delta);
        
    }

}

window.app = new App();

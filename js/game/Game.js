
class Game extends EventEmitter2 {
    constructor(app) {
        super();

        this.app = app;

        this.levels = Level.instances;
        this.level = 0;

        // Level.on("new", level => console.log("new level!"));
        // Level.on("new", level => this.levels.push(level));
        // Level.on("new", () => console.log("level"));

        this.ui = new UI();
        // this.ui.currency = 12;

        this.ui.showResourceDisplay();
        this.ui.showCommandDeck();

        this.players = [];
        this.host = null;

        this.entities = [];
        this.activeEntities = [];

        this.settings = {
            auto: true,             //Game is being auto run (no host)
            sheep: 1,
            farmLimit: 300,
            view: true,
            random: true,           //Only matters if NOT auto; whether teams are random
            sheepStartingGold: 100,
            wolfStartingGold: 100,
            income: 1,              //Ticker length in seconds (i.e., 1 resource every x seconds)
            stack: true,            //Are stacks enabled?
            timeLimit: 120,
            arena: 0
        };

        this.initAppListeners();

        Doodad.on("new", entity => this.newEntity(entity));
        Doodad.on("active", entity => this.activeEntity(entity));
        Doodad.on("inactive", entity => this.inactiveEntity(entity));
        // Doodad.on("new", entity => this.round ? this.emit("showEntity", entity) : null);
        // Doodad.on("active", entity => this.round ? this.emit("activeEntity", entity) : null);
        // Doodad.on("inactive", entity => this.round ? this.emit("inactiveEntity", entity) : null);

        Unit.on("hoverOn", () => this.ui.enablePointerCursor());
        Unit.on("hoverOff", () => this.ui.disablePointerCursor());

    }

    initAppListeners() {

        this.app.on("message", message => this.messageSwitcher(message));

        this.app.on("hoverOn", intersect => intersect.object.entity.emit("hoverOn", intersect));
        this.app.on("hoverOff", (oldIntersect, newIntersect) => {
            oldIntersect.object.entity.emit("hoverOff", oldIntersect, newIntersect);
            if (newIntersect)
                newIntersect.object.entity.emit("hoverOn", newIntersect);
        });
        this.app.on("hoverFace", (oldIntersect, newIntersect) => oldIntersect.object.entity.emit("hoverFace", oldIntersect, newIntersect));
        this.app.on("hover", intersect => intersect.object.entity.emit("hover", intersect));
        this.app.on("mosueDown", intersect => intersect.object.entity.emit("mouseDown", intersect));
        this.app.on("mouseUp", intersect => intersect.object.entity.emit("mouseUp", intersect));

        this.app.on("update", delta => this.update(delta));

    }

    messageSwitcher(message) {

        if (message.origin === -1)
            switch (message.eid) {
                case "connected": this.connected(message.clientId, message.state, message.party); break;
            }

    }

    showLevel(i) {

        this.level = i % this.levels.length;

        this.emit("clean");
        this.emit("showEntity", this.levels[this.level].terrain);
        for (let i = 0; i < this.levels[this.level].entities.length; i++)
            this.emit("showEntity", this.levels[this.level].entities[i]);

    }

    start() {

        // this.emit("clean");

        this.round = new Round(this);

    }

    connected(myId, state, party) {

        this.showLevel(state.level);

        this.rng = new RNG(state.seed);

        for (let i = 0; i < party.length; i++)
            this.players.push(new Player(party[i], state));

        this.localPlayer = new Player({id: myId, isLocalPlayer: true}, state);
        this.players.push(this.localPlayer);
        this.localPlayer.on("currency", value => this.ui.currency = value);

        //Just me
        if (this.players.length === 1)
            this.start();

    }

    newEntity(entity) {

        this.emit("showEntity", entity);
        this.entities.push(entity);

        if (entity.active) this.activeEntity(entity);

        entity.on("active", () => this.activeEntity(entity));
        entity.on("inactive", () => this.inactiveEntity(entity));

    }

    activeEntity(entity) {

        this.activeEntities.push(entity);

    }

    inactiveEntity(entity) {

        this.activeEntities.splice(this.activeEntities.idnexOf(entity), 1);

    }

    update(delta) {

        // console.log(`Game.update(${delta})`, this.activeEntities.length);

        for (let i = 0; i < this.activeEntities.length; i++)
            this.activeEntities[i].update(delta);

    }

}

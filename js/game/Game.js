
class Game extends EventEmitter2 {
    constructor(app) {
        super();

        this.app = app;

        this.levels = Level.instances;
        this.level = 0;

        // Level.on("new", level => console.log("new level!"));
        // Level.on("new", level => this.levels.push(level));
        // Level.on("new", () => console.log("level"));

        let ui = new UI();

        ui.showResourceDisplay();

        this.initAppListeners();

    }

    initAppListeners() {

        this.app.on("message", message => {switch (message.eid) {

            case "connected": this.connected(message.partySize); break;

        }});

        this.app.on("hoverOn", intersect => intersect.object.entity.emit("hoverOn", intersect));
        this.app.on("hoverOff", (oldIntersect, newIntersect) => {
            oldIntersect.object.entity.emit("hoverOff", oldIntersect, newIntersect);
            if (newIntersect)
                newIntersect.object.entity.emit("hoverOn", newIntersect);
        });
        this.app.on("hoverFace", (oldIntersect, newIntersect) => oldIntersect.object.entity.emit("hoverFace", oldIntersect, newIntersect));
        this.app.on("hover", intersect => intersect.object.entity.emit("hover", intersect));

    }

    showLevel(i) {

        this.level = i % this.levels.length;

        this.emit("clean");
        this.emit("newEntity", this.levels[this.level].terrain);
        for (let i = 0; i < this.levels[this.level].entities.length; i++)
            this.emit("newEntity", this.levels[this.level].entities[i]);

    }

    start() {





    }

    connected(partySize) {
        if (partySize === 1) this.showLevel(0);
    }

}

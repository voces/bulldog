
/* globals Arena, app, Round */

class Game extends EventEmitter2 {

	constructor() {

		super();

		this.arenas = Arena.instances;
		this.arenaId = 0;

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

        // Unit.on("hoverOn", () => this.ui.enablePointerCursor());
        // Unit.on("hoverOff", () => this.ui.disablePointerCursor());

        // Arena.on("autoGround", (arena, intersect, e) => {
        //     if (this.localPlayer.selection)
        //         for (let i = 0; i < this.localPlayer.selection.length; i++)
        //             this.localPlayer.selection[i].emit("autoGround", arena, intersect, e);
        // })
        //
        // this.on("selection", selection => this.localPlayer.selection = selection);

	}

	initAppListeners() {

        // app.on("hoverOn", intersect => intersect.object.entity.emit("hoverOn", intersect));
        // app.on("hoverOff", (oldIntersect, newIntersect) => {
        //     oldIntersect.object.entity.emit("hoverOff", oldIntersect, newIntersect);
        //     if (newIntersect)
        //         newIntersect.object.entity.emit("hoverOn", newIntersect);
        // });
        // app.on("hoverFace", (oldIntersect, newIntersect) => oldIntersect.object.entity.emit("hoverFace", oldIntersect, newIntersect));
        // app.on("hover", intersect => intersect.object.entity.emit("hover", intersect));
        // app.on("mouseDown", (intersect, e) => intersect.object.entity.emit("mouseDown", intersect, e));
        // app.on("mouseUp", (intersect, e) => intersect.object.entity.emit("mouseUp", intersect, e));

		app.on( "rng", rng => this.rng = rng );

		app.on( "connected", message => this.onConnected( message ) );

	}

	showArena( i ) {

		this.arena = this.arenas[ i % this.arenas.length ];

        // this.emit("clean");
        // this.emit("show", this.arenas[this.arena].terrain);
        // for (let i = 0; i < this.arenas[this.arena].entities.length; i++)
        //     this.emit("show", this.arenas[this.arena].entities[i]);

	}

	start() {

        // this.emit("clean");

		this.round = new Round( this );

	}

	get arena() {

		return this.arenas[ this.arenaId ];

	}

	onConnected( message ) {

        //Jsut us
		if ( message.clients.length === 0 )
			this.start();
            // this.arena.show();

	}

}

window.game = new Game();

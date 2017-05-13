
const ARENA_SMALL = 1,
	ARENA_MEDIUM = 2,
	ARENA_LARGE = 4,
	ARENA_GIANT = 8,

	ARENA_SMALL_MEDIUM = 3,
	ARENA_MEDIUM_LARGE = 3,
	ARENA_ALL = 15;

function equalChance( ...outcomes ) {

	return outcomes[ Math.floor( Math.random() * outcomes.length ) ];

}

class Round extends EventEmitter2 {

	constructor( game ) {

		super();

		game.round = this;

		this.settings = game.settings;
		this.players = [ ...app.players ];
		this.arena = game.arenas[ this.settings.arena ];
		this.rng = game.rng;

		app.terrain = this.arena.terrain;

		this.arena.show();

        // if (this.settings.view) this.disableFogOfWar();
        // else this.enableFogOfWar();

		this.pickTeams();

		this.playerActions();

        // this.spawnSheep();
        // this.spawnWolves();

		this.wolfTimer = setTimeout( () => this.unfreezeWolves(), this.settings.freezeTime );

		this.incomeTicker = setInterval( () => this.income(), this.settings.income * 1000 );

	}

	disableFogOfWar() {

		console.warn( "Round.disableFogOfWar not yet implemented!" );

	}
	enableFogOfWar() {

		console.warn( "Round.enableFogOfWar not yet implemented!" );

	}

	pickTeams() {

		let pool = [ ...this.players ];

		this.sheepTeam = [];

        //Draft sheep with least plays until full
		while ( this.sheepTeam.length < this.settings.sheep ) {

			let minSheepPlays = Math.min( ...pool.map( player => player.sheepPlays ) );

			let r = this.rng.randomInt( 0, pool.length - 1 );

			if ( pool[ r ].sheepPlays === minSheepPlays )
				this.sheepTeam.push( pool.splice( r, 1 )[ 0 ] );

		}

		this.wolfTeam = pool;

	}

	playerActions() {

		for ( let i = 0; i < this.sheepTeam.length; i ++ ) {

			this.sheepTeam[ i ].currency = this.settings.sheepStartingGold;

			let maxTries = 1000;

			while ( maxTries -- ) {

                // console.log("try");

				let x = this.rng.random() * ( this.maxX - this.minX ) + this.minX,
					y = this.rng.random() * ( this.maxY - this.minY ) + this.minY;

				if ( this.arena.terrain.getTile( x, y ) === 1 ) {

					const sheep = new Sheep( { x, y, owner: this.sheepTeam[ i ] } );
					sheep.select();
					app.graphic.camera.position.x = x;
					break;

				}

			}

			if ( maxTries === 0 ) console.error( "Stage appears to be missing spawn area" );

		}

	}

	spawnWolves() {

	}

	unfreezeWolves() {

	}

	generateSheepCount( playerCount ) {

		if ( playerCount === 1 ) return 1;
		if ( playerCount === 2 ) return 1;
		if ( playerCount === 4 ) return 2;

		let half = Math.floor( playerCount / 2 );

		if ( playerCount % 2 === 0 ) return equalChance( half + 1, half, half - 1 );

		return equalChance( half + 1, half );

	}

	income() {

		for ( let i = 0; i < this.players.length; i ++ )
			this.players[ i ].currency++;

	}

	get minX() {

		return this.arena.terrain.minX;

	}
	get maxX() {

		return this.arena.terrain.maxX;

	}
	get minY() {

		return this.arena.terrain.minY;

	}
	get maxY() {

		return this.arena.terrain.maxY;

	}

}


/* globals Destructible, Walk, CommandDeck, FOOTPRINT_TYPE, NOT_BUILDABLE, app, FILTER, emitterMixin, Terrain, TYPES, syncProperty */

class Unit extends Destructible {

	constructor( props ) {

		super( props );

		const {
            owner, movementSpeed, buildDistance, builds = [],
            interaction = [ ...Unit.interaction.map( row => [ ...row ] ) ],
            hotkey = this.constructor.hotkey,
            buildTime = this.constructor.buildTime || 0,
            cost = this.constructor.cost || 0 } = props;

		this.owner = owner;
		this.hotkey = hotkey;
		this.buildTime = buildTime;
		this.cost = cost;
		this.interaction = interaction;

		if ( movementSpeed ) new Walk( { entity: this, movementSpeed } );

		this.commandDeck = new CommandDeck();

		if ( builds )
			for ( let i = 0; i < builds.length; i ++ ) {

				const prop = builds[ i ];
				prop.action = () => this.seedBuildPlacement( prop.type );
				this.commandDeck.add( prop );

			}

		if ( buildDistance ) this.buildDistance = buildDistance;
		this.placingBuilding = false;

		this._selected = false;

		window.addEventListener( "keyup", e => this.placingBuilding && e.key === "Escape" ? this.cancelPlacement() : null );

		this.on( "build", data => this.onBuild( data ) );

	}

	seedBuildPlacement( type ) {

		this.prevInteraction = app.mouse.interaction;

		app.mouse.interaction = [
			[ { filter: entity => entity instanceof Terrain, callback: intersect => this.buildAt( intersect ) } ],
			[],
			[ { filter: () => true, callback: () => this.cancelPlacement() } ]
		];

		if ( this.placingBuilding ) this.cancelPlacement();

		this.placingBuilding = true;
		if ( this.buildPlacement === undefined || ! ( this.buildPlacement instanceof type ) )
			this.buildPlacement = new type( { ignore: true, x: app.mouse.x, y: app.mouse.y, opacity: 0.5 } );

		this.terrainHoverListener = intersect => this.showPlacement( intersect );

		app.terrain.on( "hover", this.terrainHoverListener );

	}

	showPlacement( intersect ) {

		if ( ! this.buildPlacement ) return;

		this.buildPlacement.x = intersect.point.x;
		this.buildPlacement.y = intersect.point.y;

		const xTile = app.terrain.tilemap.xWorldToTile( this.buildPlacement.x ),
			yTile = app.terrain.tilemap.yWorldToTile( this.buildPlacement.y );

		if ( app.terrain.tilemap.pathable( this.buildPlacement.tilemap, xTile, yTile ) ) {

			if ( this.buildPlacement.mesh ) {

				this.buildPlacement.mesh.material.color.g = 1;
				this.buildPlacement.mesh.material.color.b = 1;

			} else setTimeout( () => {

				this.buildPlacement.mesh.material.color.g = 1;
				this.buildPlacement.mesh.material.color.b = 1;

			} );

		} else {

			if ( this.buildPlacement.mesh ) {

				this.buildPlacement.mesh.material.color.g = 0;
				this.buildPlacement.mesh.material.color.b = 0;

			} else setTimeout( () => {

				this.buildPlacement.mesh.material.color.g = 0;
				this.buildPlacement.mesh.material.color.b = 0;

			} );

		}

	}

	cancelPlacement() {

		app.terrain.off( "hover", this.terrainHoverListener );

		app.mouse.interaction = this.prevInteraction;
		this.placingBuilding = false;

		if ( this.buildPlacement !== undefined ) {

			this.buildPlacement.remove();
			this.buildPlacement = undefined;

		}

	}

	buildAt( intersect ) {

		if ( ! this.buildPlacement ) return;

		this.buildPlacement.x = intersect.point.x;
		this.buildPlacement.y = intersect.point.y;

		const xTile = app.terrain.tilemap.xWorldToTile( this.buildPlacement.x ),
			yTile = app.terrain.tilemap.yWorldToTile( this.buildPlacement.y );

		if ( app.terrain.tilemap.pathable( this.buildPlacement.tilemap, xTile, yTile ) ) {

			app.ws.json( { id: "build", point: intersect.point, entity: this.id, type: this.buildPlacement.constructor.name } );

			this.cancelPlacement();

		} else console.error( "unable to build!" );

	}

	onBuild( { point, type } = {} ) {

		this.purgeQueue();

		type = TYPES[ type ];

		const shadowPlacement = new type( { ignore: true, x: point.x, y: point.y, opacity: 0.5 } ),

			x = shadowPlacement.x,
			y = shadowPlacement.y,

			path = this.calcWalk( { x, y } ),
			totalDistance = path.reduce( ( sum, { distance = 0 } = {} ) => sum + distance, 0 );

		shadowPlacement.mesh.material.color.r = 0.5;
		shadowPlacement.mesh.material.color.g = 0.5;
		shadowPlacement.mesh.material.color.b = 2;

		if ( totalDistance < this.buildDistance ) {

			shadowPlacement.remove();
			new type( { x, y } );
			const target = app.terrain.tilemap.nearestPathing( this.x, this.y, this, true );

			this.x = target.x;
			this.y = target.y;

			return;

		}

		const target = path.pop(),
			source = path.pop(),
			angle = Math.atan2( source.y - target.y, source.x - target.x ),
			newTarget = {
				x: target.x + this.buildDistance * Math.cos( angle ),
				y: target.y + this.buildDistance * Math.sin( angle )
			},
			newPath = this.calcWalk( newTarget ),
			duration = newPath.reduce( ( sum, { duration = 0 } = {} ) => sum + duration, 0 );

		this.doWalk( newPath );
		this.queue( syncProperty.time + duration, err => {

			shadowPlacement.remove();

			if ( err ) return;

			new type( { x, y } );
			const target = app.terrain.tilemap.nearestPathing( this.x, this.y, this, true );

			this.x = target.x;
			this.y = target.y;
			if ( this.mesh ) this.mesh.position.z = app.terrain.groundHeight( target.x, target.y );

		} );

	}

	autoGround( arena, intersect ) {

		arena.terrain.tilemap.nearestPathing( intersect.point.x, intersect.point.y, this.flying ? FOOTPRINT_TYPE.NOT_BUILDABLE : NOT_BUILDABLE.NOT_FLYABLE, this.radius );

	}

	get selected() {

		return this._selected;

	}

	set selected( value ) {

		value = value ? true : false;
		if ( this._selected === value ) return;
		this._selected = value;

		if ( value ) this.emit( "selected" );
		else this.emit( "deselected" );

	}

}

// function boxPoint( x, y, color ) {
//
// 	console.log( x, y );
//
// 	if ( typeof x !== "number" || isNaN( x ) || typeof y !== "number" || isNaN( y ) ) return;
//
// 	const box = new THREE.Mesh( new THREE.BoxBufferGeometry( 3, 3, 3 ), new THREE.MeshBasicMaterial( { color: color } ) );
// 	box.position.x = x;
// 	box.position.y = y;
// 	box.position.z = app.terrain.groundHeight( x, y ) + 8;
//
// 	app.graphic.scene.add( box );
//
// }

FILTER.UNITS = {
	type: Unit
};

Unit.interaction = [
    [ { filter: entity => entity instanceof Unit, callback: intersect => app.mouse.select( intersect ) } ],
    [],
    []
];

emitterMixin( Unit );

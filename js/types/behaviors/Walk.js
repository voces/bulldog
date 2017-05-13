
//TODO: This behavior never turns off; to do so, it'd need a way to turn on autonmously...

/* globals app, Behavior, Terrain, Destructible, syncProperty  */

// eslint-disable-next-line no-unused-vars
class Walk extends Behavior {

	constructor( props ) {

		super( props );

		this.entity = props.entity;

		this.movementSpeed = props.movementSpeed || 100;
		this.turnSpeed = props.turnSpeed / Math.PI / 2 || Math.PI / 16;

		this.entity.walk = point => this.walk( point );
		this.entity.calcWalk = point => this.calcWalk( point );
		this.entity.doWalk = point => this.doWalk( point );

		this.entity.interaction[ 2 ].push( {
			filter: entity => entity instanceof Terrain,
			callback: Walk.rightClickTerrainToWalk
		}, {
			filter: entity => entity instanceof Destructible,
			callback: Walk.rightClickDestructibleToWalk
		} );

		this._smoothing = 0.3;
		this._lastSmoothed = false;

		this.entity.on( "walk", data => this.onWalk( data ) );

	}

	static rightClickTerrainToWalk( intersect ) {

		for ( let i = 0; i < app.mouse.selection.length; i ++ )
			app.mouse.selection[ i ].walk( intersect.point );

	}

	static rightClickDestructibleToWalk( /* intersect */ ) {

		for ( let i = 0; i < app.mouse.selection.length; i ++ )
			app.mouse.selection[ i ].walk( app.mouse.topIntersect( [ { filter: entity => entity instanceof Terrain } ] ).point );

	}

	walk( point ) {

		this.entity.purgeQueue();

		app.ws.json( { id: "walk", point: point, entity: this.entity.id } );

	}

	onWalk( { point } ) {

		this.doWalk( this.calcWalk( point ) );

	}

	doWalk( path ) {

		let current = - 1;

		this.entity.x = time => {

			let oldCurrent = current;

			while ( current === - 1 || ( current < path.length - 1 && time >= path[ current ].end ) )
				current ++;

			if ( oldCurrent !== current && current !== path.length - 1 ) {

				if ( Math.abs( this.entity.mesh.rotation.z ) >= Math.PI )
					this.entity.mesh.rotation.z = this.entity.mesh.rotation.z % Math.PI;

				this.heading = path[ current ].angle;
				let difference = this.entity.mesh.rotation.z - path[ current ].angle;

				if ( Math.abs( difference ) >= Math.PI ) {

					if ( difference > 0 ) this.heading += Math.PI * 2;
					else this.entity.mesh.rotation.z -= Math.PI * 2;

				}

			}

			if ( current === path.length - 1 ) {

				this.entity.x = path[ path.length - 1 ].x;
				return path[ path.length - 1 ].x;

			}

			return path[ current ].x + path[ current ].xDistance * ( ( time - path[ current ].start ) / path[ current ].duration );

		};

		this.entity.y = time => {

			while ( current < path.length - 1 && time >= path[ current ].end )
				current ++;

			if ( current === path.length - 1 ) {

				this.entity.y = path[ path.length - 1 ].y;
				return path[ path.length - 1 ].y;

			}

			return path[ current ].y + path[ current ].yDistance * ( ( time - path[ current ].start ) / path[ current ].duration );

		};

		this.active = true;

	}

	calcWalk( point ) {

		let xTile = app.terrain.tilemap.xWorldToTile( point.x ),
			yTile = app.terrain.tilemap.yWorldToTile( point.y ),

			target;

		if ( app.terrain.tilemap.pathable( this.entity.tilemap, xTile, yTile ) )
			target = point;
		else
			target = app.terrain.tilemap.nearestPathing( point.x, point.y, this.entity );

		xTile = app.terrain.tilemap.xWorldToTile( target.x );
		yTile = app.terrain.tilemap.yWorldToTile( target.y );

		let map = app.terrain.tilemap.pointToTilemap( target.x, target.y, this.entity.radius ),
			tiles = [];

		for ( let x = map.left; x < map.width + map.left; x ++ )
			for ( let y = map.top; y < map.height + map.top; y ++ )
				tiles.push( app.terrain.tilemap.grid[ xTile + x ][ yTile + y ] );

		let path = app.terrain.tilemap.path( this.entity, target );

		path[ 0 ].start = syncProperty.time;
		for ( let i = 1; i < path.length; i ++ ) {

			let distance = Math.sqrt( ( path[ i ].x - path[ i - 1 ].x ) ** 2 + ( path[ i ].y - path[ i - 1 ].y ) ** 2 );

			path[ i - 1 ].distance = distance;
			path[ i - 1 ].xDistance = path[ i ].x - path[ i - 1 ].x;
			path[ i - 1 ].yDistance = path[ i ].y - path[ i - 1 ].y;
			path[ i - 1 ].duration = distance / this.movementSpeed * 1000;
			path[ i - 1 ].angle = Math.atan2( path[ i ].y - path[ i - 1 ].y, path[ i ].x - path[ i - 1 ].x );
			path[ i - 1 ].end = path[ i - 1 ].start + path[ i - 1 ].duration;
			path[ i ].start = path[ i - 1 ].end;

		}

		return path;

	}

	update() {

        // console.log("Walk.update", syncProperty.time, this.entity.x);
		if ( this.entity.mesh ) {

			let x = this.entity.x,
				// x2 = this.entity.mesh.position.x,
				y = this.entity.y,
				// y2 = this.entity.mesh.position.y,
				// delta = ( ( x - x2 ) ** 2 + ( y - y2 ) ** 2 ) ** 0.5,
				changes = 2;

			if ( this.entity.mesh.position.x === x && this.entity.mesh.position.y === y ) {

				changes --;
				this.entity.animate( "idle" );

			} else
                this.entity.animate( "walk" );

			this.entity.mesh.position.x = x;
			this.entity.mesh.position.y = y;

			this.entity.mesh.rotation.z = this.heading;

			const height = app.terrain.groundHeight( this.entity.mesh.position.x, this.entity.mesh.position.y ),
				heightDelta = height - this.entity.mesh.position.z;

			if ( Math.abs( heightDelta ) > 0.01 ) {

                // Height smoothing is required because shit is bumpy otherwise
				this.entity.mesh.position.z = this.entity.mesh.position.z * 0.7 + height * 0.3;
				changes --;

				// if ( delta ) {
                //
				// 	const angle = Math.atan( - heightDelta / delta );
				// 	// console.log( heightDelta, delta, angle );
				// 	this.entity.mesh.rotation.y = this.entity.mesh.rotation.y * 0.4 + Math.sin( angle ) * 0.2;
				// 	this.entity.mesh.rotation.x = this.entity.mesh.rotation.x * 0.4 + Math.cos( angle ) * 0.2;
                //
				// }

			}

			if ( this.entity.selection ) {

				this.entity.selection.selectionCircle.mesh.position.x = this.entity.mesh.position.x;
				this.entity.selection.selectionCircle.mesh.position.y = this.entity.mesh.position.y;
				this.entity.selection.selectionCircle.mesh.position.z = this.entity.mesh.position.z;

			}

			if ( changes === 0 ) this.active = false;

		}

	}

}


/* globals TERRAIN, Behavior, FOOTPRINT_TYPE, syncProperty, app */

TERRAIN.TILE_STRUCTURE_SIZE = TERRAIN.TILE_SIZE * TERRAIN.TILE_STRUCTURE_PARTS;

// eslint-disable-next-line no-unused-vars
class Structure extends Behavior {

	constructor( props ) {

		super( props );

		if ( props.structure ) this.footprint = props.structure;
		else this.footprint = {
			map: [ FOOTPRINT_TYPE.OBSTACLE ],
			width: 1,
			height: 1
		};

		if ( TERRAIN.TILE_PARTS / 2 > 1 ) {

			const multiplier = Math.round( TERRAIN.TILE_PARTS / 2 );

			const newMap = [];

			for ( let y = 0; y < this.footprint.height; y ++ ) {

				const row = [];

				for ( let x = 0; x < this.footprint.width; x ++ )
					for ( let i = 0; i < multiplier; i ++ )
						row.push( this.footprint.map[ y * this.footprint.width + x ] );

				newMap.push( ...row, ...row );

			}

			this.footprint.map = newMap;
			this.footprint.width *= multiplier;
			this.footprint.height *= multiplier;

		}

		if ( typeof this.footprint.top === "undefined" )
			this.footprint.top = Math.ceil( this.footprint.height / - 2 + 0.5 );

		if ( typeof this.footprint.left === "undefined" )
			this.footprint.left = Math.ceil( this.footprint.width / - 2 );

		this.entity.radius = Math.max( this.footprint.width, this.footprint.height ) * TERRAIN.TILE_SIZE / 2;

		this.entity.structure = this;

        // console.log("x overwrite", this);
		syncProperty( this.entity, "x", {
			initialValue: this.entity.x || 0,
			preprocessor: ( value ) => this.xPreprocessor( value )
		} );

		syncProperty( this.entity, "y", {
			initialValue: this.entity.y || 0,
			preprocessor: ( value ) => this.yPreprocessor( value )
		} );

	}

	xPreprocessor( value ) {

		// const oldValue = value;

		if ( this.footprint.width % ( 2 * TERRAIN.TILE_STRUCTURE_PARTS ) === 0 )
			value = Math.round( value / TERRAIN.TILE_STRUCTURE_SIZE ) * TERRAIN.TILE_STRUCTURE_SIZE;
		else
            value = ( Math.round( value / TERRAIN.TILE_STRUCTURE_SIZE ) - 0.5 ) * TERRAIN.TILE_STRUCTURE_SIZE;

		if ( this.entity.mesh ) {

			this.entity.mesh.position.x = value;
			this.entity.mesh.position.z = app.terrain && app.terrain.groundHeight( value, this.entity.mesh.position.y ) || 0;

		}

		this.entity.dirty = true;

		// if ( oldValue !== value )
		// 	console.warn( "altering x on", this.entity.constructor.name, "(", this.entity.id, ")", "to", value, "from", oldValue );

		return value;

	}

	yPreprocessor( value ) {

		// const oldValue = value;

		if ( this.footprint.height % ( 2 * TERRAIN.TILE_STRUCTURE_PARTS ) === 0 )
			value = Math.round( value / TERRAIN.TILE_STRUCTURE_SIZE ) * TERRAIN.TILE_STRUCTURE_SIZE;
		else
            value = ( Math.round( value / TERRAIN.TILE_STRUCTURE_SIZE ) - 0.5 ) * TERRAIN.TILE_STRUCTURE_SIZE;

		if ( this.entity.mesh ) {

			this.entity.mesh.position.y = value;
			this.entity.mesh.position.z = app.terrain && app.terrain.groundHeight( this.entity.mesh.position.x, value ) || 0;

		}

		this.entity.dirty = true;

		// if ( oldValue !== value )
		// 	console.warn( "altering y on", this.entity.constructor.name, "(", this.entity.id, ")", "to", value, "from", oldValue );

		return value;

	}

}


/* globals syncProperty, TERRAIN, Terrain, Animated, loader, FILTER, emitterMixin */

if ( ! window.loader ) window.loader = new THREE.JSONLoader();

// eslint-disable-next-line no-unused-vars
const TYPES = {};

class Doodad extends EventEmitter2 {

	constructor( props = {} ) {

		super();

		let { x = 0, y = 0, height = 0, scale = 1, radius = 1, visible = true } = props;

		if ( ! props.ignore ) this.id = ( Doodad.id ) ++;
		else this.ignore = true;

		syncProperty( this, "x", {
			initialValue: x,
			preprocessor: ( value ) => {

				if ( this.mesh && typeof value !== "function" )
					this.mesh.position.x = value;

				return value;

			}
		} );

		syncProperty( this, "y", {
			initialValue: y,
			preprocessor: ( value ) => {

				if ( this.mesh && typeof value !== "function" )
					this.mesh.position.y = value;

				return value;

			}
		} );

        // this.x = props.x || 0;
        // this.y = props.y || 0;
		this.height = height;

		this.scale = scale;
		this.radius = radius;

		this.opacity = props.opacity;

		this.behaviors = [];
		this.activeBehaviors = [];

		this._dirty = true;

		this._visible = visible;

		// if ( ! props.ignore )
		Doodad.emit( "new", this );

	}

	createMesh( args = {} ) {

		if ( this.mesh && this.visible ) this.emit( "hide" );

		if ( args.geometry ) this.geometry = args.geometry;
		if ( args.material ) this.material = args.material;

		if ( ! this.material )
			this.material = new THREE.MeshPhongMaterial( {
				vertexColors: THREE.FaceColors,
				shading: THREE.FlatShading
			} );

		if ( ! ( this instanceof Terrain ) )
			this.geometry.scale( TERRAIN.TILE_PARTS / 2, TERRAIN.TILE_PARTS / 2, TERRAIN.TILE_PARTS / 2 );

		if ( this.geometry.animations ) new Animated( { entity: this } );
		else this.mesh = new THREE.Mesh( this.geometry, this.material );

		if ( this.opacity !== undefined ) {

			this.mesh.material.transparent = true;
			this.mesh.material.opacity = this.opacity;

		}

		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;

		this.mesh.entity = this;

		this.x = this.x;
		this.y = this.y;
        // this.mesh.position.z = app.game.round.arena.

		if ( this.visible ) this.emit( "show" );

	}

	get visible() {

		return this._visible;

	}

	set visible( value ) {

		if ( this._visible === value ) return;

		if ( value ) this.show();
		else this.hide();

	}

	hide() {

		if ( ! this._visible ) return;

		this._visible = false;
		this.emit( "hide" );

	}

	show() {

		if ( this._visible ) return;

		this._visible = true;
		this.emit( "show" );

	}

	registerMesh() {

		this.mesh.geometry.scale( TERRAIN.TILE_PARTS / 2, TERRAIN.TILE_PARTS / 2, TERRAIN.TILE_PARTS / 2 );

		this.mesh.entity = this;

		this.x = this.x;
		this.y = this.y;

		if ( this.visible ) this.emit( "show" );

	}

	get z() {

		return this.mesh.position.z;

	}

	fetchModel( path, callback ) {

		if ( this.constructor.model )
			return callback( Object.assign( this.constructor.model.clone(), {
				bones: this.constructor.model.bones,
				skinWeights: this.constructor.model.skinWeights,
				skinIndicies: this.constructor.model.skinIndicies,
				animations: this.constructor.model.animations,
				animation: this.constructor.model.animation
			} ) );

		loader.load( path, geo => {

			this.constructor.model = geo;

			geo.rotateX( Math.PI / 2 );

			callback( Object.assign( geo.clone(), {
				bones: geo.bones,
				skinWeights: geo.skinWeights,
				skinIndicies: geo.skinIndicies,
				animations: geo.animations,
				animation: geo.animation
			} ) );

		} );

	}

	update( delta ) {

        // console.log("Doodad.update");
		for ( let i = 0; i < this.activeBehaviors.length; i ++ )
			this.activeBehaviors[ i ].update( delta );

	}

	set dirty( value ) {

		if ( ! value ) return this._dirty = false;

		if ( this._dirty === true ) return;

		this._dirty = true;

		this.emit( "dirty" );

	}

	remove() {

		this.emit( "remove" );

	}

}

Doodad.id = 0;

FILTER.ALL = {
	type: Doodad
};

emitterMixin( Doodad );

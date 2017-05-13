
/* globals Doodad, TERRAIN, Tilemap */

// function faceToVertices( mesh, face ) {
//
// 	return [ mesh.geometry.faces[ face.a ], mesh.geometry.faces[ face.b ], mesh.geometry.faces[ face.c ] ];
//
// }

function orientation( a, b, c ) {

	return ( a.x - c.x ) * ( b.y - c.y ) - ( b.x - c.x ) * ( a.y - c.y );

}

// eslint-disable-next-line no-unused-vars
class Terrain extends Doodad {

	constructor( props ) {

		super( props );

		props.width = props.width || 1;
		props.height = props.height || 1;
		props.orientation = props.orientation || [];
		props.heightMap = props.heightMap || [];
		props.colors = props.colors || [];
		props.tileMap = props.tileMap || [];

		this.width = props.width * TERRAIN.TILE_SIZE * TERRAIN.TILE_PARTS;
		this.height = props.height * TERRAIN.TILE_SIZE * TERRAIN.TILE_PARTS;

		this.minX = this.width / - 2;
		this.maxX = this.width / 2;
		this.minY = this.height / - 2;
		this.maxY = this.height / 2;

		this.geometry = new THREE.PlaneGeometry( this.width, this.height, this.width / TERRAIN.TILE_SIZE, this.height / TERRAIN.TILE_SIZE );
		// for (let i = 0; i < this.geometry.faces.length; i++)
		//     this.geometry.faces[i].color.setHex(0xF4A460);

		// console.log(this.geometry.vertices, this.geometry.faces);
		// console.log(this.geometry.vertices.length, this.geometry.faces.length);
		// console.log(orientation.length, heightmap.length);

		for ( let i = 0; i < props.heightMap.length && i < this.geometry.vertices.length; i ++ ) {

			if ( props.heightMap[ i ] ) {

				// console.log(this.geometry.vertices[i] ? true : false, heightmap[i], i);
				this.geometry.vertices[ i ].z = props.heightMap[ i ] * 2;

			}
			// this.geometry.vertices[i].x += TERRAIN.TILE_PARTS/2 * (Math.random() - 0.5);
			// this.geometry.vertices[i].y += TERRAIN.TILE_PARTS/2 * (Math.random() - 0.5);

		}

		//Rotate some squares (makes stuff look a bit less uniform)
		for ( let i = 0; i < this.geometry.faces.length / 2; i ++ )

			if ( props.orientation[ i ] ) {

				if ( props.orientation[ i ] === 2 ) {

				// console.log(i);
					this.geometry.faces[ i * 2 ].c = this.geometry.faces[ i * 2 + 1 ].b;
					this.geometry.faces[ i * 2 + 1 ].a = this.geometry.faces[ i * 2 ].a;

				}
			// }

			} else if ( Math.random() < 0.5 ) {

			// } else {
				this.geometry.faces[ i * 2 ].c = this.geometry.faces[ i * 2 + 1 ].b;
				this.geometry.faces[ i * 2 + 1 ].a = this.geometry.faces[ i * 2 ].a;

			}

		this.tilemap = new Tilemap( props.width * TERRAIN.TILE_PARTS, props.height * TERRAIN.TILE_PARTS, this.geometry, props.orientation, props.tileMap );

		this.geometry.computeFaceNormals();
		this.geometry.computeVertexNormals();

		for ( let i = 0; i < props.colors.length; i ++ ) {

			if ( props.colors[ i ] ) {

				this.geometry.faces[ i * 2 ].color.setHex( props.colors[ i ] );
				this.geometry.faces[ i * 2 + 1 ].color.setHex( props.colors[ i ] );

			} else {

				this.geometry.faces[ i * 2 ].color.setHex( 0xF4A460 );
				this.geometry.faces[ i * 2 + 1 ].color.setHex( 0xF4A460 );

			}

		}

		this.simpleTileMap = props.tileMap;

		this.createMesh();

		// this.on( "hoverFace", intersect => {
		//
		// 	console.log( intersect );
		//
		// } );

		// this.on( "hover", console.log );

		// this.on("hover", intersect => {
		//     let tile = this.tilemap.getTile(intersect.point.x, intersect.point.y);
		//     console.log(tile.minHeight.toFixed(2), "-", tile.maxHeight.toFixed(2));
		//     // console.log(intersect.point, this.getTile(intersect.point.x, intersect.point.y));
		// });

		this.on( "mouseDown", ( intersect, e ) => {

			console.log( "mouseDown" );

			if ( e.button === 2 ) this.emit( "autoGround", intersect, e );

		} );

	}

	get wireframe() {

		if ( typeof this._wireframe !== "undefined" ) return this._wireframe;

		let geometry = new THREE.EdgesGeometry( this.mesh.geometry ),
			material = new THREE.LineBasicMaterial();

		this._wireframe = new THREE.LineSegments( geometry, material );

		this._wireframe.entity = this;

		return this._wireframe;

	}

	getTile( x, y ) {

		x = Math.floor( ( x + this.width / 2 ) / TERRAIN.TILE_SIZE );
		y = this.height / TERRAIN.TILE_SIZE - Math.floor( ( y + this.height / 2 ) / TERRAIN.TILE_SIZE ) - 1;

		let tile = this.simpleTileMap[ `${x},${y}` ];
		return tile === undefined ? - 1 : tile;

	}

	minHeight( x, y, radius = 0 ) {

		let minX = this.tilemap.xWorldToTile( x - radius ),
			maxX = this.tilemap.xWorldToTile( x + radius ),
			minY = this.tilemap.yWorldToTile( y + radius ),
			maxY = this.tilemap.yWorldToTile( y - radius ),

			minHeight = Infinity;

		for ( let x = minX; x <= maxX; x ++ )
			for ( let y = minY; y <= maxY; y ++ ) {

				let height = this.tilemap.grid[ x ][ y ].minHeight;

				if ( height < minHeight ) minHeight = height;

			}

		return minHeight;

	}

	groundHeight( x, y ) {

		let tile,
			pt = { x, y },
			triangle;

		{

			const xTile = this.tilemap.xWorldToTile( x );
			tile = this.tilemap.grid[ xTile ];
			if ( ! xTile ) return NaN;

			const yTile = this.tilemap.yWorldToTile( y );
			tile = tile[ yTile ];
			if ( ! yTile ) return NaN;

		}

		// if (this.myLastTile === tile) return;

		// this.myLastTile = tile;

		{

			let v1 = this.mesh.geometry.vertices[ tile.faces[ 0 ].a ],
				v2 = this.mesh.geometry.vertices[ tile.faces[ 0 ].b ],
				v3 = this.mesh.geometry.vertices[ tile.faces[ 0 ].c ];

			// console.log(v1, v2, v3)

			let side1 = Math.abs( orientation( pt, v1, v2 ) ) < 1e-7,
				side2 = Math.abs( orientation( pt, v2, v3 ) ) < 1e-7,
				side3 = Math.abs( orientation( pt, v3, v1 ) ) < 1e-7;

			if ( side1 === side2 && side2 === side3 )
				triangle = [ v1, v2, v3 ];
			else
				triangle = [
					this.mesh.geometry.vertices[ tile.faces[ 1 ].a ],
					this.mesh.geometry.vertices[ tile.faces[ 1 ].b ],
					this.mesh.geometry.vertices[ tile.faces[ 1 ].c ]
				];

		}

		let height;

		// console.log(triangle);

		if ( triangle[ 0 ].x !== triangle[ 1 ].x )
		//h1 = z + diff.z * percent.x
			height = triangle[ 0 ].z -
				( triangle[ 0 ].z - triangle[ 1 ].z ) *
				( x - triangle[ 0 ].x ) / ( triangle[ 1 ].x - triangle[ 0 ].x );
		else
			height = triangle[ 0 ].z -
				( triangle[ 0 ].z - triangle[ 2 ].z ) *
				( x - triangle[ 0 ].x ) / ( triangle[ 2 ].x - triangle[ 0 ].x );

		if ( triangle[ 0 ].y !== triangle[ 1 ].y )
		//h1 = z + diff.z * percent.x
			height += ( triangle[ 0 ].z -
				( triangle[ 0 ].z - triangle[ 1 ].z ) *
				( y - triangle[ 0 ].y ) / ( triangle[ 1 ].y - triangle[ 0 ].y ) );
		else
			height += ( triangle[ 0 ].z -
				( triangle[ 0 ].z - triangle[ 2 ].z ) *
				( y - triangle[ 0 ].y ) / ( triangle[ 2 ].y - triangle[ 0 ].y ) );

		return height / 2;

				// console.log(triangle);

	}

}

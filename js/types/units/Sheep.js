
/* globals Unit, Farm, TinyFarm, WideFarm, HardFarm, TYPES */

if ( ! window.loader ) window.loader = new THREE.JSONLoader();

class Sheep extends Unit {

	constructor( props ) {

		props.radius = 8;
        // props.radius = 4 * 4;
		props.builds = props.builds || Sheep.builds;
		props.movementSpeed = props.movementSpeed || Sheep.movementSpeed;
		props.buildDistance = props.buildDistance || Sheep.buildDistance;

		super( props );

		this.fetchModel( "/models/sheep.json", geo => {

			for ( let i = 0; i < geo.faces.length; i ++ )
				geo.faces[ i ].color.setHex( geo.faces[ i ].materialIndex === 0 ? 0xCCCCCC : 0x333333 );

			this.geometry = geo;

			this.geometry.scale( 1.2, 1.2, 1.2 );

			this.createMesh();

			this.setAnimationSpeed( "walk", 21 );
            // this.animate("walk");

		} );

		window.sheep = this;

	}

}

Sheep.builds = [
    { type: Farm },
    { type: TinyFarm },
    { type: WideFarm },
    { type: HardFarm }
];

Sheep.movementSpeed = 95;
Sheep.buildDistance = 16 * Math.sqrt( 2 );

TYPES.Sheep = Sheep;

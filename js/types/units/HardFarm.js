
/* globals Unit, FOOTPRINT_TYPE, TYPES */

class HardFarm extends Unit {

	constructor( props ) {

		const O = FOOTPRINT_TYPE.OBSTACLE;

		props.structure = {
			map: [
				O, O, O, O,
				O, O, O, O,
				O, O, O, O,
				O, O, O, O
			],
			width: 4,
			height: 4,
			radius: 0
		};

		super( props );

		this.fetchModel( "/models/farm.json", geo => {

			this.geometry = geo;

			this.geometry.scale( 2.5, 2.5, 2.5 );

			for ( let i = 0; i < geo.faces.length; i ++ )
				this.geometry.faces[ i ].color.setHex( this.faceColor( i ) );

			this.createMesh();

		} );

	}

	faceColor( i ) {

		switch ( this.geometry.faces[ i ].materialIndex ) {

			case 0: return 0xE7E0B1;    //walls
			case 1: return 0xF1DC3B;    //roof
			case 2: return 0xC89B65;    //door
			case 3: return 0xCB6343;    //chimney
			case 4: return 0x979797;    //chimney-guard
			case 5: return 0x000000;    //chimney-top

		}

	}

}

HardFarm.hotkey = "r";
HardFarm.icon = "img/hardFarm.png";
HardFarm.maxHealth = 120;
HardFarm.buildTime = 1;
HardFarm.cost = 10;

TYPES.HardFarm = HardFarm;

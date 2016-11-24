
class Farm extends Unit {
    constructor(props) {

        props.structure = {
            map: [
                FOOTPRINT_TYPE.OBSTACLE, FOOTPRINT_TYPE.OBSTACLE,
                FOOTPRINT_TYPE.OBSTACLE, FOOTPRINT_TYPE.OBSTACLE],
            width: 2,
            height: 2,
            radius: 0
        };

        super(props);

        this.fetchModel("/models/farm.json", geo => {

            this.geometry = geo;

            this.geometry.scale(1.2, 1.2, 1.2);

            for (let i = 0; i < geo.faces.length; i++)
                this.geometry.faces[i].color.setHex(this.faceColor(i));

            this.createMesh();

        });

    }

    faceColor(i) {
        switch (this.geometry.faces[i].materialIndex) {
            case 0: return 0xE7E0B1;    //walls
            case 1: return 0xF1DC3B;    //roof
            case 2: return 0xC89B65;    //door
            case 3: return 0xCB6343;    //chimney
            case 4: return 0x979797;    //chimney-guard
            case 5: return 0x000000;    //chimney-top
        }
    }
}

Farm.hotkey = "f";
Farm.icon = "img/farm.png";
Farm.maxHealth = 120;
Farm.buildTime = 1;
Farm.cost = 0;

TYPES.Farm = Farm;


if (!window.loader) window.loader = new THREE.JSONLoader();

class Sheep extends Unit {
    constructor(props) {
        props.radius = 4;
        // props.radius = 4 * 4;
        props.builds = props.builds || Sheep.builds;
        props.movementSpeed = props.movementSpeed || Sheep.movementSpeed;

        super(props);

        this.fetchModel("/models/sheep.json", geo => {

            for (let i = 0; i < geo.faces.length; i++)
                geo.faces[i].color.setHex(geo.faces[i].materialIndex === 0 ? 0xCCCCCC : 0x333333);

            this.geometry = geo;

            this.createMesh();

            this.setAnimationSpeed("walk", 7);
            // this.animate("walk");

        });

    }

}

Sheep.builds = [
    {type: Farm},
    {type: TinyFarm},
    {type: WideFarm},
    {type: HardFarm}
];

Sheep.movementSpeed = 380;

TYPES.Sheep = Sheep;

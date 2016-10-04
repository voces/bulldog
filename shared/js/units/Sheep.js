
if (!window.loader) window.loader = new THREE.JSONLoader();

class Sheep extends Unit {
    constructor(props) {
        props.footprint = {
            map: null,
            width: 0,
            height: 0,
            radius: 4
        };

        super(props);

        this.fetchModel("/shared/models/sheep.json", geo => {

            for (let i = 0; i < geo.faces.length; i++)
                geo.faces[i].color.setHex(geo.faces[i].materialIndex === 0 ? 0xCCCCCC : 0x333333);

            this.geometry = geo;

            this.createMesh();

            this.setAnimationSpeed("walk", 7);

        });

    }

}

TYPES.Sheep = Sheep;

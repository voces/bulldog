
if (!window.loader) window.loader = new THREE.JSONLoader();

class Sheep extends Unit {
    constructor(props) {
        props.footprint = {
            map: null,
            width: 0,
            height: 0,
            radius: 8
        };

        super(props);

        this.fetchModel("/shared/models/sheep.json", geo => {

            for (let i = 0; i < geo.faces.length; i++)
                geo.faces[i].color.setHex(geo.faces[i].materialIndex === 0 ? 0xCCCCCC : 0x333333);

            this.geometry = geo;
            // console.log(geo);

            this.createMesh();

            this.mesh.rotateZ(Math.PI * 3 / 4);
            // this.mixer.timeScale = 7;

            this.setAnimationSpeed("walk", 7);

            console.log("sheep!", this);

        });

    }

}

TYPES.Sheep = Sheep;

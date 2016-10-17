
class BigFarm extends Destructible {
    constructor(props = {}) {

        const O = FOOTPRINT_TYPE.OBSTACLE;

        props.structure = {
            map: [
                O,O,O,
                O,O,O,
                O,O,O
            ],
            width: 3,
            height: 3,
            radius: 0
        };

        super(props);

        this.geometry = new THREE.Geometry();

        this.createWalls();
        this.createRoof();
        this.createChimney();
        this.createDoor();

        this.geometry.mergeVertices();

        this.geometry.scale(0.6, 0.6, 0.6);
        this.geometry.rotateZ(0.8);

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();

        this.createMesh();

        this.mesh.material.side = THREE.DoubleSide;

    }

    createWalls() {

        let walls = new THREE.BoxGeometry(24, 30, 24);

        walls.rotateZ(Math.PI * 3 / 8);
        walls.translate(0, 0, 12);

        for (let i = 0; i < walls.faces.length; i++)
            walls.faces[i].color.setHex(0xe7e0b1);

        this.geometry.merge(walls);

    }

    createRoof() {

        let roof = new THREE.BoxGeometry(26, 32, 20);

        roof.vertices[0].x = 0;
        roof.vertices[2].x = 0;
        roof.vertices[5].x = 0;
        roof.vertices[7].x = 0;

        for (let i = 0; i < roof.faces.length; i++)
            roof.faces[i].color.setHex(0xF1DC3B);

        roof.rotateZ(Math.PI * 3 / 8);
        roof.translate(0, 0, 34);

        this.geometry.merge(roof);

        let roofWindow = new THREE.BoxGeometry(8, 10, 8);

        roofWindow.vertices[0].y = 0;
        roofWindow.vertices[2].y = 0;
        roofWindow.vertices[5].y = 0;
        roofWindow.vertices[7].y = 0;

        roofWindow.rotateZ(Math.PI * 3 / 8);
        roofWindow.translate(-1, -3, 36);

        for (let i = 0; i < roofWindow.faces.length; i++)
            roofWindow.faces[i].color.setHex(0xF1DC3B);

        roofWindow.faces[2].color.setHex(0xe7e0b1);

        this.geometry.merge(roofWindow);

    }

    createChimney() {

        let chimney = new THREE.BoxGeometry(4, 6, 35);

        chimney.rotateZ(Math.PI * 3 / 8);
        chimney.translate(-2, 14.5, 17.5);

        for (let i = 0; i < chimney.faces.length; i++)
            chimney.faces[i].color.setHex(0xcb6343);

        this.geometry.merge(chimney);

    }

    createDoor() {

        let door = new THREE.BoxGeometry(0.5, 6, 16);

        door.rotateZ(Math.PI * 3 / 8);
        door.translate(-5, -11, 8);

        for (let i = 0; i < door.faces.length; i++)
            door.faces[i].color.setHex(0xc89b65);

        this.geometry.merge(door);

    }

}

TYPES.BigFarm = BigFarm;

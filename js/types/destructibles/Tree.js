
class Tree extends Destructible {
    constructor(props = {}) {

        props.structure = {
            map: [
                FOOTPRINT_TYPE.OBSTACLE, FOOTPRINT_TYPE.OBSTACLE,
                FOOTPRINT_TYPE.OBSTACLE, FOOTPRINT_TYPE.OBSTACLE],
            width: 2,
            height: 2,
            radius: 0
        };

        super(props);

        this.geometry = new THREE.Geometry();

        this.height = props.height || Math.random() * 16 + 48;
        this.radius = props.radius || this.height / 4 * (Math.random() / 2 + 0.75);
        this.shelfs = props.shelfs || Math.floor(Math.random() * 2) + 3;

        this.createTrunk();
        this.createShelfs();

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();

        this.createMesh();

    }

    createTrunk() {

        let trunk = new THREE.CylinderGeometry(0, this.radius / 4, this.height - 12);

        for (let i = 0; i < trunk.faces.length; i++)
            trunk.faces[i].color.setHex(0xF4A460);

        trunk.rotateX(Math.PI / 2);
        trunk.rotateZ(Math.PI * Math.random());
        trunk.translate(0, 0, (this.height - 12) / 2);

        trunk.computeFaceNormals();
        trunk.computeVertexNormals();

        this.geometry.merge(trunk);

    }

    createShelfs() {

        let color = new THREE.Color(0x18b309).offsetHSL((Math.random() - 0.5) / 6, 0, 0),

            height = this.height,

            shelfRadiusMultiplier = this.radius / 8,
            shelfRadiusMin = this.radius / 16 * 3,
            shelfRadiusConstant = this.radius / 16,

            shelfRadius = Math.random() * shelfRadiusMultiplier + shelfRadiusMin,
            shelfHeight = Math.random() * shelfRadiusMultiplier + shelfRadiusMin,

            shelfDistanceMultiplier = this.radius / 16 * 10 * 3 / this.shelfs,
            shelfDistanceConstant = this.radius / 16 * 6 / this.shelfs;

        for (let i = 0; i < this.shelfs; i++) {

            let shelf = new THREE.ConeGeometry(
                    shelfRadius += Math.random() * shelfRadiusMultiplier + shelfRadiusConstant,
                    shelfHeight = shelfRadius * 2);

            for (let i = 0; i < shelf.faces.length; i++)
                shelf.faces[i].color = color.clone();

            shelf.radius = shelfRadius;
            shelf.height = shelfHeight;

            height -= (shelfHeight/10 + Math.random() * shelfDistanceMultiplier + shelfDistanceConstant);

            shelf.rotateX(Math.PI / 2);
            shelf.rotateZ(Math.PI * Math.random());
            shelf.translate(0, 0, height);

            shelf.computeFaceNormals();
            shelf.computeVertexNormals();

            this.geometry.merge(shelf);

        }

    }
}

TYPES.Tree = Tree;

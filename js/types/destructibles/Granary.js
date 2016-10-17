
class Granary extends Destructible {
    constructor(props = {}) {

        const O = FOOTPRINT_TYPE.OBSTACLE;

        props.structure = {
            map: [
                O,O,O,O,
                O,O,O,O,
                O,O,O,O],
            width: 4,
            height: 3,
            radius: 0
        };

        super(props);

        this.geometry = new THREE.Geometry();

        this.createStack();
        this.createTop();
        this.createChute();

        this.geometry.mergeVertices();

        this.geometry.translate(-6, 0, 0);
        this.geometry.scale(0.8, 0.8, 0.8);

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();

        this.createMesh();

        this.mesh.material.side = THREE.DoubleSide;

    }

    createStack() {

        let stack = new THREE.CylinderGeometry(8, 12, 32, 7);

        for (let i = 0; i < stack.faces.length; i++)
            stack.faces[i].color.setHex(0x794506);

        stack.rotateX(Math.PI / 2);
        // stack.rotateZ(Math.PI * Math.random());
        stack.translate(0, 0, 16);

        this.geometry.merge(stack);

    }

    createTop() {

        let bits = [
            [12, 8, 8],
            [12, 12, 6],
            [8, 12, 6],
            [3, 8, 2]
        ];

        let height = 32;

        for (let i = 0; i < bits.length; i++) {

            let bit = new THREE.CylinderGeometry(bits[i][0], bits[i][1], bits[i][2], 7);

            for (let n = 0; n < bit.faces.length; n++)
                bit.faces[n].color.setHex(0x794506);

            height += bits[i][2] / 2;

            bit.rotateX(Math.PI / 2);
            bit.translate(0, 0, height);

            height += bits[i][2] / 2;

            this.geometry.merge(bit);

        }

    }

    createChute() {

        let chute = new THREE.CylinderGeometry(2, 2, 26, 8, 1, true, 0, Math.PI);

        for (let n = 0; n < chute.faces.length; n++)
            chute.faces[n].color.setHex(0x794506);

        chute.rotateY(Math.PI / 2);
        chute.rotateZ(Math.PI / 2);
        chute.rotateY(Math.PI * 0.33);

        chute.translate(17, 0, 26);

        this.geometry.merge(chute);

        let chuteStand = new THREE.CylinderGeometry(1, 1, 14);

        for (let n = 0; n < chuteStand.faces.length; n++)
            chuteStand.faces[n].color.setHex(0x794506);

        chuteStand.rotateX(Math.PI / 2);
        chuteStand.rotateZ(Math.PI * Math.random());

        chuteStand.translate(22, 0, 7);

        this.geometry.merge(chuteStand);

        let chuteEnd = new THREE.CylinderGeometry(2, 4, 8, 8, 1, true, 0, Math.PI);

        for (let n = 0; n < chuteEnd.faces.length; n++)
            chuteEnd.faces[n].color.setHex(0x794506);

        chuteEnd.rotateY(Math.PI / 2);
        chuteEnd.rotateZ(Math.PI / 2);
        chuteEnd.rotateY(Math.PI * 0.1);

        chuteEnd.translate(26, 0, 16);

        this.geometry.merge(chuteEnd);

    }
}

TYPES.Granary = Granary;

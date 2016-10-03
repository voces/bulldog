
class Crates extends Destructible {
    constructor(props = {}) {

        props.footprint = {
            map: [FOOTPRINT_TYPE.OBSTACLE],
            width: 1,
            height: 1,
            radius: 0
        };

        super(props);

        this.geometry = new THREE.Geometry();

        // this.stacks = 2;
        this.stacks = props.stacks || Math.floor(Math.random() * 2) + 1;

        this.createCrates();

        this.createMesh();

        this.mesh.material.side = THREE.DoubleSide;

    }

    createCrate(size, open) {

        let crate = new THREE.BoxGeometry(size, size, size);

        if (open) crate.faces.splice(8, 2);

        for (let i = 0; i < crate.faces.length; i++)
            crate.faces[i].color.setHex(0xd0a52f);

        crate.rotateZ(Math.random() * Math.PI);
        crate.translate(0, 0, size / 2);

        return crate;

    }

    createCrates() {

        let stacks = new THREE.Geometry();

        let angleBetweenStacks = Math.PI * 2 / this.stacks;

        for (let i = 0; i < this.stacks; i++) {

            let crates = Math.floor(Math.random() * 3) + 1,
                initialSize = (3 + 3 / this.stacks) * (Math.random() + 0.5),
                size = initialSize,
                height = 0,

                stack = new THREE.Geometry();

            for (let n = 0; n < crates; n++) {

                let open = n === crates - 1 ? Math.random() < 0.5 : false,
                    crate = this.createCrate(size, open);

                if (open && n == 0) crate.translate(0, 0, 1);
                else crate.translate(0, 0, height);

                crate.translate(size/3 * (Math.random() - 0.5), size/3 * (Math.random() - 0.5), 0);

                height += size;
                size *= (Math.random() / 2 + 0.5);

                stack.merge(crate);

            }

            let angle = angleBetweenStacks * i,
                distance = initialSize * this.stacks * (Math.random() + 0.5) / 3;

            stack.translate(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                0
            );

            stacks.merge(stack);

        }

        stacks.rotateZ(Math.random() * Math.PI);

        this.geometry.merge(stacks);

    }

}

TYPES.Crates = Crates;

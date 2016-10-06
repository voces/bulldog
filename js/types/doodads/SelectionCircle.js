
class SelectionCircle extends Doodad {
    constructor(props) {
        super(props);

        let geometry = new THREE.CircleGeometry(this.size*4, 64),
            material = new THREE.LineBasicMaterial({
                color: props.rgb,
                linewidth: 2
            });

        geometry.vertices.shift();
        this.mesh = new THREE.Line(geometry, material);

        this.mesh.position.z = 5;

        this.shown = false;

        this.registerMesh();

    }
}

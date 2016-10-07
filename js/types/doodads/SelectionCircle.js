
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

        this.mesh.position.z = app.game.round.arena.terrain.minHeight(this.x, this.y, this.size * 4) + 1;

        this.shown = false;

        this.registerMesh();

    }

    set color(value) { this.mesh.material.color = value; }

    get color() { return this.mesh.material.color; }

}

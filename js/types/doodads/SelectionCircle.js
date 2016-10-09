
class SelectionCircle extends Doodad {
    constructor(props) {
        props.visible = false;

        super(props);

        let geometry = new THREE.CircleGeometry(this.radius*4, 64),
            material = new THREE.LineBasicMaterial({
                color: props.rgb
            });

        geometry.vertices.shift();
        this.mesh = new THREE.Line(geometry, material);

        // console.log(app.game.round.arena.terrain.minHeight);
        this.mesh.position.z = app.terrain ? app.terrain.minHeight(this.x, this.y, this.radius) + 1 : 0;

        this.visible = false;

        this.registerMesh();

    }

    set color(value) { this.mesh.material.color = value; }

    get color() { return this.mesh.material.color; }

}

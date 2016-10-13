
class Tile {
    constructor(x, y, pathing, vertices, faces) {
        this.x = x;
        this.y = y;
        this.pathing = pathing;
        this.vertices = vertices;
        this.faces = faces;
        this.nodes = [];

    }

    get minHeight() {
        return Math.min(this.vertices[0].z,
            this.vertices[1].z,
            this.vertices[2].z,
            this.vertices[3].z);
    }

    get maxHeight() {
        return Math.max(this.vertices[0].z,
            this.vertices[1].z,
            this.vertices[2].z,
            this.vertices[3].z);
    }
}

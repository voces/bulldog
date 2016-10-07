
class Tile {
    constructor(x, y, pathing, vertices) {

        this.x = x;
        this.y = y;
        this.pathing = pathing;
        this.vertices = vertices;

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

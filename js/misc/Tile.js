
class Tile {
    constructor(x, y, pathing, vertices, orientation, surrounding, heightmap) {

        this.x = x;
        this.y = y;
        this.pathing = pathing;
        this.vertices = vertices;

        if (surrounding) {
            if (surrounding.top) this.top = surrounding.top;
            if (surrounding.bottom) this.bottom = surrounding.bottom;
            if (surrounding.left) this.left = surrounding.left;
            if (surrounding.right) this.right = surrounding.right;
            if (surrounding.topLeft) this.topLeft = surrounding.topLeft;
            if (surrounding.topRight) this.topRight = surrounding.topRight;
            if (surrounding.bottomLeft) this.bottomLeft = surrounding.bottomLeft;
            if (surrounding.bottomRight) this.bottomRight = surrounding.bottomRight;
        }

        if (heightmap) {
            if (heightmap[0]) this.vertices[0].position.z = heightmap[0];
            if (heightmap[1]) this.vertices[1].position.z = heightmap[1];
            if (heightmap[2]) this.vertices[2].position.z = heightmap[2];
            if (heightmap[3]) this.vertices[3].position.z = heightmap[3];
        }

    }

    get minHeight() {
        return Math.min(this.vertices[0].position.z,
            this.vertices[1].position.z,
            this.vertices[2].position.z,
            this.vertices[3].position.z);
    }

    get maxHeight() {
        return Math.max(this.vertices[0].position.z,
            this.vertices[1].position.z,
            this.vertices[2].position.z,
            this.vertices[3].position.z);
    }

    get normal() {

    }
}

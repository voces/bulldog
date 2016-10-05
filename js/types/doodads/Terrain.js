
function faceToVertices(mesh, face) {
    return [mesh.geometry.faces[face.a], mesh.geometry.faces[face.b], mesh.geometry.faces[face.c]];
}

class Terrain extends Doodad {
    constructor(width, height, orientation=[], heightmap=[], colors=[], tileMap=[]) {
        super();

        this.width = width*16;
        this.height = height*16;

        this.minX = this.width / -2;
        this.maxX = this.width / 2;
        this.minY = this.height / -2;
        this.maxY = this.height / 2;

        this.geometry = new THREE.PlaneGeometry(this.width, this.height, width*2, height*2);
        // for (let i = 0; i < this.geometry.faces.length; i++)
        //     this.geometry.faces[i].color.setHex(0xF4A460);

        // console.log(this.geometry.vertices, this.geometry.faces);
        // console.log(this.geometry.vertices.length, this.geometry.faces.length);
        // console.log(orientation.length, heightmap.length);
        for (let i = 0; i < heightmap.length && i < this.geometry.vertices.length; i++) {
            if (heightmap[i]) {
                // console.log(this.geometry.vertices[i] ? true : false, heightmap[i], i);
                this.geometry.vertices[i].z = heightmap[i];
            }
            // this.geometry.vertices[i].x += 2 * Math.random();
            // this.geometry.vertices[i].y += 2 * Math.random();
        }


        //Rotate some squares (makes stuff look a bit less uniform)
        for (let i = 0; i < this.geometry.faces.length/2; i++)

            if (orientation[i]) {
                if (orientation[i] === 2) {
                    // console.log(i);
                    this.geometry.faces[i*2].c = this.geometry.faces[i*2+1].b;
                    this.geometry.faces[i*2+1].a = this.geometry.faces[i*2].a;
                }
            // }
            } else if (Math.random() < 0.5) {
            // } else {
                this.geometry.faces[i*2].c = this.geometry.faces[i*2+1].b;
                this.geometry.faces[i*2+1].a = this.geometry.faces[i*2].a;
            }

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();

        for (let i = 0; i < colors.length; i++) {
            if (colors[i]) {
                this.geometry.faces[i*2].color.setHex(colors[i])
                this.geometry.faces[i*2+1].color.setHex(colors[i])
            } else {
                this.geometry.faces[i*2].color.setHex(0xF4A460)
                this.geometry.faces[i*2+1].color.setHex(0xF4A460)
            }
        }

        this.tileMap = tileMap;

        this.createMesh();

        // this.on("hover", intersect => {
        //     console.log(intersect.point, this.getTile(intersect.point.x, intersect.point.y));
        // });

    }

    get wireframe() {

        if (typeof this._wireframe !== "undefined") return this._wireframe;

        let geometry = new THREE.EdgesGeometry(this.mesh.geometry),
            material = new THREE.LineBasicMaterial();

        this._wireframe = new THREE.LineSegments(geometry, material);

        this._wireframe.entity = this;

        return this._wireframe;

    }

    getTile(x, y) {
        x = Math.floor((x + this.width / 2) / 8);
        y = this.height / 8 - Math.floor((y + this.height / 2) / 8) - 1;

        let tile = this.tileMap[`${x},${y}`];
        return tile === undefined ? -1 : tile;
    }
}

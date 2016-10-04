
function faceToVertices(mesh, face) {
    return [mesh.geometry.faces[face.a], mesh.geometry.faces[face.b], mesh.geometry.faces[face.c]];
}

class Terrain extends Doodad {
    constructor(width, height, orientation=[], heightmap=[], colors=[]) {
        super();

        this.geometry = new THREE.PlaneGeometry(width*16, height*16, width*2, height*2);
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

        this.createMesh();

        this.on("hover", intersect => console.log(intersect.point));

    }

    get wireframe() {

        if (typeof this._wireframe !== "undefined") return this._wireframe;

        this.mesh.polygonOffset = true;
        this.mesh.polygonOffsetFactor = 1;
        this.mesh.polygonOffsetUnits = 1;

        this._wireframe = new THREE.WireframeHelper(this.mesh, 0xffffff);
        this._wireframe.material.linewidth = 2;

        this._wireframe.entity = this;

        return this._wireframe;

    }
}

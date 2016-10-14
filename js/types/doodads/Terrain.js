
function faceToVertices(mesh, face) {
    return [mesh.geometry.faces[face.a], mesh.geometry.faces[face.b], mesh.geometry.faces[face.c]];
}

class Terrain extends Doodad {
    constructor(props) {
        super(props);

        props.width = props.width || 1;
        props.height = props.height || 1;
        props.orientation = props.orientation || [];
        props.heightMap = props.heightMap || [];
        props.colors = props.colors || [];
        props.tileMap = props.tileMap || [];

        this.width = props.width*16;
        this.height = props.height*16;

        this.minX = this.width / -2;
        this.maxX = this.width / 2;
        this.minY = this.height / -2;
        this.maxY = this.height / 2;

        this.geometry = new THREE.PlaneGeometry(this.width, this.height, this.width/8, this.height/8);
        // for (let i = 0; i < this.geometry.faces.length; i++)
        //     this.geometry.faces[i].color.setHex(0xF4A460);

        // console.log(this.geometry.vertices, this.geometry.faces);
        // console.log(this.geometry.vertices.length, this.geometry.faces.length);
        // console.log(orientation.length, heightmap.length);

        for (let i = 0; i < props.heightMap.length && i < this.geometry.vertices.length; i++) {
            if (props.heightMap[i]) {
                // console.log(this.geometry.vertices[i] ? true : false, heightmap[i], i);
                this.geometry.vertices[i].z = props.heightMap[i];
            }
            // this.geometry.vertices[i].x += 2 * Math.random();
            // this.geometry.vertices[i].y += 2 * Math.random();
        }

        //Rotate some squares (makes stuff look a bit less uniform)
        for (let i = 0; i < this.geometry.faces.length/2; i++)

            if (props.orientation[i]) {
                if (props.orientation[i] === 2) {
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

        this.tilemap = new Tilemap(props.width*2, props.height*2, this.geometry, props.orientation, props.tileMap);

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();

        for (let i = 0; i < props.colors.length; i++) {
            if (props.colors[i]) {
                this.geometry.faces[i*2].color.setHex(props.colors[i])
                this.geometry.faces[i*2+1].color.setHex(props.colors[i])
            } else {
                this.geometry.faces[i*2].color.setHex(0xF4A460)
                this.geometry.faces[i*2+1].color.setHex(0xF4A460)
            }
        }

        this.simpleTileMap = props.tileMap;

        this.createMesh();

        this.on("hoverFace", intersect => {
            console.log(intersect);
        });

        // this.on("hover", intersect => {
        //     let tile = this.tilemap.getTile(intersect.point.x, intersect.point.y);
        //     console.log(tile.minHeight.toFixed(2), "-", tile.maxHeight.toFixed(2));
        //     // console.log(intersect.point, this.getTile(intersect.point.x, intersect.point.y));
        // });

        this.on("mouseDown", (intersect, e) => {
            if (e.button === 2) this.emit("autoGround", intersect, e);
        });

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

        let tile = this.simpleTileMap[`${x},${y}`];
        return tile === undefined ? -1 : tile;
    }

    minHeight(x, y, radius = 0) {

        let minX = Math.max(Math.floor((x - radius + this.width / 2) / 8), 0),
            maxX = Math.min(Math.floor((x + radius + this.width / 2) / 8), this.width/8),
            minY = Math.max(this.height / 8 - Math.floor((y + radius + this.height / 2) / 8) - 1, 0),
            maxY = Math.min(this.height / 8 - Math.floor((y - radius + this.height / 2) / 8) - 1, this.height / 2),

            minHeight = Infinity;

        for (let x = minX; x <= maxX; x++)
            for (let y = minY; y <= maxY; y++) {
                let height = this.tilemap.grid[x][y].minHeight;

                if (height < minHeight) minHeight = height;
            }

        return minHeight;

    }
}

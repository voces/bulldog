
class Level extends EventEmitter2 {
    constructor(props) {
        super();

        this.dimensions = props.dimensions || {
            height: 12,
            width: 16
        };

        this.tileMap = {};

        if (props.tileHeightMap) this.calcTileHeightMap(props.tileHeightMap);

        else {
            this.heightMap = props.heightMap || [];
            this.orientation = props.orientation || [];
            this.colors = props.colors || [];
        }

        if (props.tileMap) this.calcTileMap(props.tileMap);

        this.generateTerrain();

        this.entities = [];

        for (let type in props.entities)
            for (let i = 0; i < props.entities[type].length; i++) {
                // console.log(type, props.entities[type][i]);
                this.entities.push(new TYPES[type](props.entities[type][i]));
            }

        Level.emit("new", this);

        Level.instances.push(this);

    }

    calcTileHeightMap(tileHeightMap) {

        let w = this.dimensions.width * 2 + 1,
            h = this.dimensions.height * 2 + 1;

        this.heightMap = new Float32Array((w-1)*(h-1)*2);
        this.orientation = new Uint8Array(w*h);
        this.colors = new Uint32Array((w-1)*(h-1));

        //Each i represents a face
        for (let i = 0; i < tileHeightMap.length; i++) {

            if (!tileHeightMap[i]) continue;

            let x = i*2 % (w+1),
                y = Math.floor(i*2/(w+1))*2;

            this.heightMap[y*w-w + x] += tileHeightMap[i] * 4;
            this.heightMap[y*w   + x] += tileHeightMap[i] * 8;
            this.heightMap[y*w+w + x] += tileHeightMap[i] * 4;

            if (x < w-1) {
                this.heightMap[y*w-w + x+1] += tileHeightMap[i] * 2;
                this.heightMap[y*w   + x+1] += tileHeightMap[i] * 4;
                this.heightMap[y*w+w + x+1] += tileHeightMap[i] * 2;

                this.orientation[y*(w-1)     + x] = 2;
                this.orientation[(y+1)*(w-1) + x+1] = 2;

                this.orientation[(y-2)*(w-1) + x+1] = 1;
                this.orientation[(y-1)*(w-1) + x  ] = 1;
            }

            if (x > 0) {
                this.heightMap[y*w-w + x-1] += tileHeightMap[i] * 2;
                this.heightMap[y*w   + x-1] += tileHeightMap[i] * 4;
                this.heightMap[y*w+w + x-1] += tileHeightMap[i] * 2;

                this.orientation[(y-2)*(w-1) + x-2] = 2;
                this.orientation[(y-1)*(w-1) + x-1] = 2;

                this.orientation[ y   *(w-1) + x-1] = 1;
                this.orientation[(y+1)*(w-1) + x-2] = 1;
            }

            // if (props.tileHeightMap[i] === 0)
                // this.colors[y*(w-1)+x] = 0x0000FF;

        }

        for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++)
                if (this.heightMap[y*w+x] === this.heightMap[y*w+x+1] && this.heightMap[y*w+w+x] === this.heightMap[y*w+w+x+1] && Math.abs(this.heightMap[y*w+x] - this.heightMap[y*w+w+x]) <= 4 || this.heightMap[y*w+x] === this.heightMap[y*w+w+x] && this.heightMap[y*w+x+1] === this.heightMap[y*w+w+x+1] && Math.abs(this.heightMap[y*w+x] - this.heightMap[y*w+x+1]) <= 4) {

                    this.tileMap[`${x},${y}`] = 3;
                    this.colors[y*(w-1)+x] = 0x6EF462;

                } else this.tileMap[`${x},${y}`] = 0;

        for (let i = 0; i < this.heightMap.length; i++)
            this.heightMap[i] += 1*Math.random();

    }

    adjustSubTile(x, y, tileType, i, h, s, l) {
        this.tileMap[`${x},${y}`] = tileType;
        this.colors[i] = new THREE.Color(this.colors[i]).offsetHSL(h, s, l).getHex();
    }

    adjustSubTiles(x, y, tileType, hue, s, l) {

        let w = this.dimensions.width * 2 + 1,
            h = this.dimensions.height * 2 + 1;

        this.adjustSubTile(x, y, tileType, y*(w-1)+x, hue, s, l);
        this.adjustSubTile(x-1, y, tileType, y*(w-1)+x-1, hue, s, l);
        this.adjustSubTile(x, y-1, tileType, (y-1)*(w-1)+x, hue, s, l);
        this.adjustSubTile(x-1, y-1, tileType, (y-1)*(w-1)+x-1, hue, s, l);

    }

    adjustTile(x, y, tileType) {

        switch (tileType) {
            case 1: this.adjustSubTiles(x, y, tileType, 0, -0.2, -0.2); break;
            case 2: this.adjustSubTiles(x, y, tileType, 0, 0.2, 0.2); break;
        }

    }

    calcTileMap(tileMap) {

        let w = this.dimensions.width * 2 + 1,
            h = this.dimensions.height * 2 + 1;

        //Each i represents a face
        for (let i = 0; i < tileMap.length; i++) {

            if (!tileMap[i]) continue;

            let x = i*2 % (w+1),
                y = Math.floor(i*2/(w+1))*2;

            this.adjustTile(x, y, tileMap[i]);

        }

    }

    generateTerrain() {

        this.terrain = new Terrain(
            this.dimensions.width,
            this.dimensions.height,
            this.orientation,
            this.heightMap,
            this.colors,
            this.tileMap);

    }
}

emitterMixin(Level);

Level.instances = [];

window.Level = Level;

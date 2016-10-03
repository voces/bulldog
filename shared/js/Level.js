
{function emitterMixin(obj) {

    let emitter = new EventEmitter2();

    for (let prop in emitter)
        obj[prop] = emitter[prop];

    for (let prop in emitter.constructor.prototype)
        obj[prop] = emitter.constructor.prototype[prop];

}

class Level extends EventEmitter2 {
    constructor(props) {
        super();

        this.dimensions = props.dimensions || {
            height: 12,
            width: 16
        };

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
                if (this.heightMap[y*w+x] === this.heightMap[y*w+x+1] && this.heightMap[y*w+w+x] === this.heightMap[y*w+w+x+1] && Math.abs(this.heightMap[y*w+x] - this.heightMap[y*w+w+x]) <= 4 || this.heightMap[y*w+x] === this.heightMap[y*w+w+x] && this.heightMap[y*w+x+1] === this.heightMap[y*w+w+x+1] && Math.abs(this.heightMap[y*w+x] - this.heightMap[y*w+x+1]) <= 4)

                    this.colors[y*(w-1)+x] = 0x6EF462;

        for (let i = 0; i < this.heightMap.length; i++)
            this.heightMap[i] += 1*Math.random();

    }

    adjustSubTileColor(i, h, s, l) {
        this.colors[i] = new THREE.Color(this.colors[i]).offsetHSL(h, s, l).getHex();
    }

    adjustSubTilesColor(x, y, hue, s, l) {

        let w = this.dimensions.width * 2 + 1,
            h = this.dimensions.height * 2 + 1;

        this.adjustSubTileColor(y*(w-1)+x, hue, s, l);
        this.adjustSubTileColor(y*(w-1)+x-1, hue, s, l);
        this.adjustSubTileColor((y-1)*(w-1)+x, hue, s, l);
        this.adjustSubTileColor((y-1)*(w-1)+x-1, hue, s, l);

    }

    adjustTileColor(x, y, color) {

        switch (color) {
            case 1: this.adjustSubTilesColor(x, y, 0, -0.2, -0.2); break;
            case 2: this.adjustSubTilesColor(x, y, 0, 0.2, 0.2); break;
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

            this.adjustTileColor(x, y, tileMap[i]);

        }

    }

    generateTerrain() {

        this.terrain = new Terrain(
            this.dimensions.width,
            this.dimensions.height,
            this.orientation,
            this.heightMap,
            this.colors);

    }
}

emitterMixin(Level);

Level.instances = [];

// Level.on("new", instance => console.log("new", instance));

window.Level = Level;}



// Level.constructor.prototype = new EventEmitter2();

// EventEmitter2.call(Level);

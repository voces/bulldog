
class Arena extends EventEmitter2 {
    constructor(props) {
        super();

        this.dimensions = props.dimensions || {
            height: 12,
            width: 16
        };

        this.tileMap = {};
        this.entities = [];

        if (props.tileHeightMap) this.calcTileHeightMap(props.tileHeightMap);

        else {
            this.heightMap = props.heightMap || [];
            this.orientation = props.orientation || [];
            this.colors = props.colors || [];
        }

        if (props.tileMap) this.calcTileMap(props.tileMap);

        this.generateTerrain();

        for (let type in props.entities)
            for (let i = 0; i < props.entities[type].length; i++) {
                // console.log(type, props.entities[type][i]);
                let entityProps = props.entities[type][i];
                entityProps.visible = false;
                this.entities.push(new TYPES[type](entityProps));
            }

        Arena.emit("new", this);

        this.id = Arena.instances.push(this) - 1;

    }

    calcTileHeightMap(tileHeightMap) {

        let w = this.dimensions.width * TERRAIN.TILE_PARTS + 1,
            h = this.dimensions.height * TERRAIN.TILE_PARTS + 1;

        const H = TERRAIN.TILE_PARTS * TERRAIN.TILE_HEIGHT;

        this.heightMap = new Float32Array(w*h);
        this.orientation = new Uint8Array(w*h);
        this.colors = new Uint32Array((w-1)*(h-1));

        //Each i represents a face
        for (let i = 0; i < tileHeightMap.length; i++) {

            if (!tileHeightMap[i]) continue;

            let x = i*TERRAIN.TILE_PARTS % (w+TERRAIN.TILE_PARTS-1),
                y = Math.floor(i*TERRAIN.TILE_PARTS/(w+TERRAIN.TILE_PARTS-1))*TERRAIN.TILE_PARTS;

            for (let x2 = -TERRAIN.TILE_PARTS + 1; x2 <= TERRAIN.TILE_PARTS - 1; x2++)
                for (let y2 = -TERRAIN.TILE_PARTS + 1; y2 <= TERRAIN.TILE_PARTS - 1; y2++)
                    if (x + x2 >= 0 && x + x2 < w)
                        this.heightMap[(y+y2)*w + x+x2] += tileHeightMap[i] * (1-Math.abs(x2)*TERRAIN.TILE_PARTS/Math.pow(TERRAIN.TILE_PARTS,2)- Math.abs(y2)*(TERRAIN.TILE_PARTS-Math.abs(x2))/Math.pow(TERRAIN.TILE_PARTS,2)) * TERRAIN.TILE_HEIGHT * TERRAIN.TILE_PARTS;

        }

        for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++)
                if (this.heightMap[y*w+x] === this.heightMap[y*w+x+1] && this.heightMap[y*w+w+x] === this.heightMap[y*w+w+x+1] && Math.abs(this.heightMap[y*w+x] - this.heightMap[y*w+w+x]) <= 4 || this.heightMap[y*w+x] === this.heightMap[y*w+w+x] && this.heightMap[y*w+x+1] === this.heightMap[y*w+w+x+1] && Math.abs(this.heightMap[y*w+x] - this.heightMap[y*w+x+1]) <= 4) {

                    this.tileMap[`${x},${y}`] = 3;
                    this.colors[y*(w-1)+x] = 0x6EF462;

                } else this.tileMap[`${x},${y}`] = 0;

        for (let i = 0; i < this.heightMap.length; i++)
            this.heightMap[i] += TERRAIN.TILE_PARTS/4*Math.random();

    }

    adjustSubTile(x, y, tileType, i, h, s, l) {
        this.tileMap[`${x},${y}`] = tileType;
        this.colors[i] = new THREE.Color(this.colors[i]).offsetHSL(h, s, l).getHex();
    }

    adjustSubTiles(x, y, tileType, hue, s, l) {

        let w = this.dimensions.width * TERRAIN.TILE_PARTS + 1,
            h = this.dimensions.height * TERRAIN.TILE_PARTS + 1;

        for (let x2 = -TERRAIN.TILE_PARTS/2; x2 < TERRAIN.TILE_PARTS/2; x2++)
            for (let y2 = -TERRAIN.TILE_PARTS/2; y2 < TERRAIN.TILE_PARTS/2; y2++)
                if (x + x2 >= 0 && x + x2 < w-1 && y + y2 >= 0 && y2 + y2 < h)
                    this.adjustSubTile(x+x2, y+y2, tileType, (y+y2)*(w-1) + (x+x2), hue, s, l);

    }

    adjustTile(x, y, tileType) {

        switch (tileType) {
            case 1: this.adjustSubTiles(x, y, tileType, 0, -0.2, -0.2); break;
            case 2: this.adjustSubTiles(x, y, tileType, 0, 0.2, 0.2); break;
        }

    }

    calcTileMap(tileMap) {

        let w = this.dimensions.width * TERRAIN.TILE_PARTS + 1,
            h = this.dimensions.height * TERRAIN.TILE_PARTS + 1;

        //Each i represents a face
        for (let i = 0; i < tileMap.length; i++) {

            if (!tileMap[i]) continue;

            let x = i*TERRAIN.TILE_PARTS % (w+TERRAIN.TILE_PARTS-1),
                y = Math.floor(i*TERRAIN.TILE_PARTS/(w+TERRAIN.TILE_PARTS-1))*TERRAIN.TILE_PARTS;

            this.adjustTile(x, y, tileMap[i]);

        }

    }

    generateTerrain() {

        this.terrain = new Terrain({
            width: this.dimensions.width,
            height: this.dimensions.height,
            orientation: this.orientation,
            heightMap: this.heightMap,
            colors: this.colors,
            tileMap: this.tileMap,
            visible: false
        });

        this.terrain.hide();

        this.entities.push(this.terrain);

        this.terrain.on("autoGround", (intersect, e) => Arena.emit("autoGround", this, intersect, e));

    }

    show() {

        for (let i = 0; i < this.entities.length; i++)
            this.entities[i].show();

    }

    hide() {

        for (let i = 0; i < this.entities.length; i++)
            this.entities[i].hide();

    }
}

emitterMixin(Arena);

Arena.instances = [];

window.Arena = Arena;

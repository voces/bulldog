//1

{
let width = 28,
    height = 17,

    nudgeW = (width % 2 ? 0 : TERRAIN.TILE_SIZE * TERRAIN.TILE_PARTS / 2),
    nudgeH = (height % 2 ? 0 : TERRAIN.TILE_SIZE * TERRAIN.TILE_PARTS / 2),

    s = TERRAIN.TILE_SIZE;

console.log(s, nudgeW, nudgeH);
console.log(TERRAIN.TILE_SIZE, TERRAIN.TILE_PARTS, TERRAIN.TILE_STRUCTURE_PARTS);

new Arena({
    dimensions: {
        height: height,
        width: width
    },
    size: width * height,
    entities: {
        Tree: [
            {
                x: -34 * s + nudgeW,
                y:  28 * s + nudgeH
            }, {
                x: -28 * s + nudgeW,
                y:  22 * s + nudgeH
            }, {
                x: -42 * s + nudgeW,
                y:   6 * s + nudgeH
            }, {
                x:   0 * s + nudgeW,
                y: -12 * s + nudgeH
            }, {
                x:   4 * s + nudgeW,
                y: -10 * s + nudgeH
            }, {
                x:  28 * s + nudgeW,
                y: -20 * s + nudgeH
            }
        ], Fence: [
            {
                length: 4,
                orientation: "horizontal",
                x: -4 * s + nudgeW,
                y:  5 * s + nudgeH
            }, {
                length: 4,
                orientation: "vertical",
                x: 15 * s + nudgeW,
                y: 10 * s + nudgeH
            }
        ], Granary: [
            {
                x:  8 * s + nudgeW,
                y: 27 * s + nudgeH
            }
        ], BigFarm: [
            {
                x: 30 * s + nudgeW,
                y: 12 * s + nudgeH
            }
        ], Inn: [
            {
                x:  21 * s + nudgeW,
                y: -21 * s + nudgeH
            }
        ], Crates: [
            {
                x:  26 * s + nudgeW,
                y: -24 * s + nudgeH
            }, {
                x:  28 * s + nudgeW,
                y: -24 * s + nudgeH
            }, {
                x:  28 * s + nudgeW,
                y: -22 * s + nudgeH
            }
        ], Farm: [{x: -4 * s + nudgeW, y: nudgeH}],
        TinyFarm: [
            {x: -8 * s + nudgeW, y: nudgeH}
        ],
        WideFarm: [{x: 4 * s + nudgeW, y: nudgeH}],
        HardFarm: [{x: 12 * s + nudgeW, y: nudgeH}]
    },
    tileHeightMap: `
        23232323232323232323232323232
        10000000000000000000000000003
        20000000000000000000000000002
        10000000000000000000000000003
        20000000000000000000000000002
        10000000000000000000000000003
        20000000000000000000000000002
        10000000000000000000000000003
        20000000000000000000000000002
        10000000000000000000000000003
        20000000000000000000000000002
        10000000110110000000000000003
        20000002222222000000000000002
        10000012222222100000000000003
        20000012222222100000000000002
        10000012222222000000000000003
        21000001212121212121212121212
        12121200000000000000000000000
    `.replace(/[^0-9]+/g, "").split("").map(i => parseInt(i)),

    tileMap: `
        00000000000000000000000000000
        00000000000000000000000000000
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
        00100000000000000000000000200
    `.replace(/[^0-9]+/g, "").split("").map(i => parseInt(i)),
});
}

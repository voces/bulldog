//1

{
let width = 28,
    height = 17,

    nudgeW = (width % 2 ? 0 : TERRAIN.TILE_SIZE * TERRAIN.TILE_PARTS / 2),
    nudgeH = (height % 2 ? 0 : TERRAIN.TILE_SIZE * TERRAIN.TILE_PARTS / 2),

    scale = TERRAIN.TILE_SIZE * TERRAIN.TILE_PARTS / 2;

new Arena({
    dimensions: {
        height: height,
        width: width
    },
    size: width * height,
    entities: {
        Tree: [
            {
                x: -17 * scale + nudgeW,
                y:  14 * scale + nudgeH
            }, {
                x: -14 * scale + nudgeW,
                y:  11 * scale + nudgeH
            }, {
                x: -21 * scale + nudgeW,
                y:   3 * scale + nudgeH
            }, {
                x:   0 * scale + nudgeW,
                y:  -6 * scale + nudgeH
            }, {
                x:   2 * scale + nudgeW,
                y:  -5 * scale + nudgeH
            }, {
                x:  14 * scale + nudgeW,
                y: -10 * scale + nudgeH
            }
        ], Fence: [
            {
                length: 4,
                orientation: "horizontal",
                x: -4 * scale + nudgeW - scale,
                y:  3 * scale + nudgeH - scale/TERRAIN.TILE_PARTS
            }, {
                length: 4,
                orientation: "vertical",
                x: 8 * scale + nudgeW - scale/TERRAIN.TILE_PARTS,
                y: 6 * scale + nudgeH - scale
            }
        ], Granary: [
            {
                x:  4 * scale + nudgeW,
                y: 14 * scale + nudgeH
            }
        ], BigFarm: [
            {
                x: 15 * scale + nudgeW,
                y:  6 * scale + nudgeH
            }
        ], Inn: [
            {
                x:  11 * scale + nudgeW,
                y: -10 * scale + nudgeH
            }
        ], Crates: [
            {
                x:  13 * scale + nudgeW,
                y: -12 * scale + nudgeH
            }, {
                x:  14 * scale + nudgeW,
                y: -12 * scale + nudgeH
            }, {
                x:  14 * scale + nudgeW,
                y: -11 * scale + nudgeH
            }
        ], Farm: [{x: -2 * scale + nudgeW, y: nudgeH}],
        TinyFarm: [{x: -4 * scale + nudgeW, y: nudgeH, movementSpeed: 100}],
        WideFarm: [{x: 2 * scale + nudgeW, y: nudgeH}],
        HardFarm: [{x: 6 * scale + nudgeW, y: nudgeH}]
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

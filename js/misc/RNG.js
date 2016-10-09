// Adepted from Antti Sykari
// http://stackoverflow.com/a/19301306/1567335

class RNG {

    constructor(seed = 123456789) {

        this.w = seed;
        this.z = 987654321;

    }

    random() {

        this.z = (36969 * (this.z & 65535) + (this.z >> 16)) & 0xffffffff;
        this.w = (18000 * (this.w & 65535) + (this.w >> 16)) & 0xffffffff;

        return (((this.z << 16) + this.w) & 0xffffffff) / 4294967296 + 0.5;

    }

    randomInt(max = 100, min = 0) {

        this.z = (36969 * (this.z & 65535) + (this.z >> 16)) & 0xffffffff;
        this.w = (18000 * (this.w & 65535) + (this.w >> 16)) & 0xffffffff;

        return ((this.z << 16) + this.w) & 0xffffffff % (max - min + 1) + min;

    }

}

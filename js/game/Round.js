
const ARENA_SMALL = 1,
    ARENA_MEDIUM = 2,
    ARENA_LARGE = 4,
    ARENA_GIANT = 8,

    ARENA_SMALL_MEDIUM = 3,
    ARENA_MEDIUM_LARGE = 3,
    ARENA_ALL = 15;

function equalChance(...outcomes) {
    return outcomes[Math.floor(Math.random() * outcomes.length)];
}


class Round extends EventEmitter2 {
    constructor(game) {
        super();

        this.settings = game.settings;
        this.players = [...game.players];
        this.arena = game.levels[this.settings.arena];
        this.rng = game.rng;

        // if (this.settings.view) this.disableFogOfWar();
        // else this.enableFogOfWar();

        this.pickTeams();

        // console.log(this.sheepTeam, this.wolfTeam);

        this.spawnSheep();
        this.spawnWolves();

        this.wolfTimer = setTimeout(() => this.unfreezeWolves(), this.settings.freezeTime);

    }

    disableFogOfWar() { console.warn("Round.disableFogOfWar not yet implemented!"); }
    enableFogOfWar() { console.warn("Round.enableFogOfWar not yet implemented!"); }

    pickTeams() {

        let pool = [...this.players];

        this.sheepTeam = [];

        //Draft sheep with least plays until full
        while (this.sheepTeam.length < this.settings.sheep) {

            let minSheepPlays = Math.min(...pool.map(player => player.sheepPlays));

            let r = this.rng.randomInt(0, pool.length - 1);

            if (pool[r].sheepPlays === minSheepPlays)
                this.sheepTeam.push(pool.splice(r, 1)[0]);

        }

        this.wolfTeam = pool;

    }

    spawnSheep() {

        for (let i = 0; i < this.sheepTeam.length; i++) {

            let maxTries = 1000;

            while (maxTries--) {

                // console.log("try");

                let x = this.rng.random() * (this.maxX - this.minX) + this.minX,
                    y = this.rng.random() * (this.maxY - this.minY) + this.minY;

                if (this.arena.terrain.getTile(x, y) === 1) {
                    new Sheep({x: x, y: y, owner: this.sheepTeam[i]});
                    break;
                }

            }

            if (maxTries === 0) console.error("Stage appears to be missing spawn area");

        }
            // new Sheep({owner: this.sheepTeam[i]})

    }

    spawnWolves() {

    }

    unfreezeWolves() {

    }

    generateSheepCount(playerCount) {

        if (playerCount === 1) return 1;
        if (playerCount === 2) return 1;
        if (playerCount === 4) return 2;

        let half = Math.floor(playerCount / 2);

        if (playerCount % 2 === 0) return equalChance(half+1, half, half-1);

        return equalChance(half+1, half);

    }

    get minX() { return this.arena.terrain.minX }
    get maxX() { return this.arena.terrain.maxX }
    get minY() { return this.arena.terrain.minY }
    get maxY() { return this.arena.terrain.maxY }

}

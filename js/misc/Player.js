
class Player extends EventEmitter2 {
    constructor(state, gameState) {
        super();

        //Default values
        this.sheepPlays = 0;

        //Apply state stored on the player (these are system controlled)
        for (let prop in state)
            this[prop] = state[prop];

        if (typeof this.state === "undefined") this.state = {};

        //Check the game state for more info (this is player-controlled via sync statements)
        // if (gameState.players)
        //     for (let i = 0; i < gameState.players.length; i++)
        //         if (gameState.players.id === this.id) {
        //
        //             for (let prop in gameState.players[i])
        //                 this.state[prop] = gameState.players[i][prop];
        //
        //             break;
        //         }

        this._currency = 0;

        this.selection = null;

    }

    get currency() { return this._currency; }
    set currency(value) {
        this._currency = value;

        if (this.isLocalPlayer) this.emit("currency", value);
    }
}

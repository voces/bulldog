
class Player extends EventEmitter2 {
    constructor(state, gameState) {
        super();

        //Default values
        this.sheepPlays = 0;

        //Apply state stored on the player (these are system controlled)
        for (let prop in state)
            this[prop] = state[prop];

        //Check the game state for more info (this is player-controlled via sync statements)
        if (gameState.players)
            for (let i = 0; i < gameState.players.length; i++)
                if (gameState.players.id === this.id) {

                    for (let prop in gameState.players[i])
                        this[prop] = gameState.players[i][prop];

                    break;
                }

    }
}

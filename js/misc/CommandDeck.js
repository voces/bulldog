
class CommandDeck extends EventEmitter2 {
    constructor(props) {
        super();

        this.cards = [];

        this.active = false;

    }

    add(props) {

        this.cards.push({
            icon: props.icon || props.type.icon,
            hotkey: props.hotkey || props.type.hotkey
        })

    }
}

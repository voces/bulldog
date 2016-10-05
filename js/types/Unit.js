
class Unit extends Destructible {
    constructor(props) {
        super(props);

        this.owner = props.owner;

        this.on("hoverOn", intersect => Unit.emit("hoverOn", intersect));
        this.on("hoverOff", intersect => Unit.emit("hoverOff", intersect));

    }
}

emitterMixin(Unit);

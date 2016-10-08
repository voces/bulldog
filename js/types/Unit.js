
class Unit extends Destructible {
    constructor(props) {
        super(props);

        this.owner = props.owner;

        new SelectionCircle({entity: this});

    }

}

emitterMixin(Unit);


class Destructible extends Doodad {

    constructor(props) {
        super(props);

        if (props.structure)
            new Structure({entity: this, structure: props.structure});

        new SelectionCircle({entity: this, selectable: false});

    }

}

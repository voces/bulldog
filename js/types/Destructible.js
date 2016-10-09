
class Destructible extends Doodad {

    constructor(props) {
        super(props);

        if (props.structure)
            new Structure({entity: this, structure: props.structure});

        new Selection({entity: this, selectable: false});

    }

}

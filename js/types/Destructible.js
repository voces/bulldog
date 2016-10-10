
class Destructible extends Doodad {

    constructor(props) {
        super(props);

        this.maxHealth = props.maxHealth || props.constructor.maxHealth || 1;

        if (props.structure)
            new Structure({entity: this, structure: props.structure});

        new Selection({entity: this, selectable: false});

    }

}

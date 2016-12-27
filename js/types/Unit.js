
class Unit extends Destructible {
    constructor(props) {
        super(props);

        let {
            owner, movementSpeed, builds = [],
            interaction = [...Unit.interaction.map(row => [...row])],
            hotkey = this.constructor.hotkey,
            buildTime = this.constructor.buildTime || 0,
            cost = this.constructor.cost || 0} = props;

        this.owner = owner;
        this.hotkey = hotkey;
        this.buildTime = buildTime;
        this.cost = cost;
        this.interaction = interaction;

        if (movementSpeed) new Walk({entity: this, movementSpeed});

        this.commandDeck = new CommandDeck();

        if (builds)
            for (let i = 0; i < builds.length; i++) {
                let prop = builds[i];
                prop.action = () => this.seedBuildPlacement(prop.type);
                this.commandDeck.add(prop);
            }

        this._selected = false;

    }

    autoGround(arena, intersect, e) {
        console.log(arena, intersect, e);
        arena.terrain.tilemap.nearestPathing(intersect.point.x, intersect.point.y, this.flying ? FOOTPRINT_TYPE.NOT_BUILDABLE : NOT_BUILDABLE.NOT_FLYABLE, this.radius);
    }

    get selected() { return this._selected; }
    set selected(value) {
        value = value ? true : false;
        if (this._selected === value) return;
        this._selected = value;

        if (value) this.emit("selected");
        else this.emit("deselected");
    }

}

FILTER.UNITS = {
    type: Unit
};

Unit.interaction = [
    [{filter: entity => entity instanceof Unit, callback: intersect => app.mouse.select(intersect)}],
    [],
    []
];

emitterMixin(Unit);

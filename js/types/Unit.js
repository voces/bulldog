
class Unit extends Destructible {
    constructor(props) {
        super(props);

        this.owner = props.owner;
        this._selected = false;

        this.on("autoGround", (arena, intersect, e) => this.autoGround(arena, intersect, e));

        this.commandDeck = new CommandDeck();

        if (props.builds)
            for (let i = 0; i < props.builds.length; i++) {
                let prop = props.builds[i];
                prop.action = () => this.seedBuildPlacement(prop.type);
                this.commandDeck.add(prop);
            }

        this.hotkey = props.hotkey || this.constructor.hotkey;
        this.buildTime = props.buildTime || this.constructor.buildTime || 0;
        this.cost = props.cost || this.constructor.cost || 0;

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

emitterMixin(Unit);

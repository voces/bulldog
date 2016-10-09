
class Unit extends Destructible {
    constructor(props) {
        super(props);

        this.owner = props.owner;
        this.selected = false;

        this.on("autoGround", (arena, intersect, e) => this.autoGround(arena, intersect, e));

        if (props.builds) {
            if (!this.commandDeck) this.commandDeck = new CommandDeck();

            for (let i = 0; i < props.builds.length; i++)
                this.commandDeck.add(props.builds[i]);
        }

        this.hotkey = props.hotkey || this.constructor.hotkey;

    }

    autoGround(arena, intersect, e) {
        // this.emit("move", {})
        console.log(arena, intersect, e);
        arena.terrain.tilemap.nearestPathing(intersect.point.x, intersect.point.y, this.flying ? FOOTPRINT_TYPE.NOT_BUILDABLE : NOT_BUILDABLE.NOT_FLYABLE, this.radius);
    }

}

emitterMixin(Unit);

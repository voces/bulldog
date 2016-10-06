
class Unit extends Destructible {
    constructor(props) {
        super(props);

        this.owner = props.owner;

        this.on("hoverOn", intersect => this.onHoverOn(intersect));
        this.on("hoverOff", intersect => this.onHoverOff(intersect));

    }

    onHoverOn(intersect) {
        this.showSelectionCircle(0xFFFF00);
        Unit.emit("hoverOn", intersect);
    }

    onHoverOff(intersect) {
        this.hideSelectionCircle();
        Unit.emit("hoverOff", intersect);
    }

    showSelectionCircle(rgb = 0xFFFFFF) {

        if (!this._selectionCircle)
            this._selectionCircle = new SelectionCircle({
                rgb: rgb,
                x: this.x,
                y: this.y
            });

        if (this._selectionCircle.shown) return;

        app.game.emit("showEntity", this._selectionCircle);

    }

    hideSelectionCircle() {

        app.game.emit("hideEntity", this._selectionCircle);

    }

}

emitterMixin(Unit);

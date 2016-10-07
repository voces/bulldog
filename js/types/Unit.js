
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

    set selectionCircleColor(value) {

        this.selectionCircle.color = value;

    }

    get selectionCircle() {

        if (this._selectionCircle) return this._selectionCircle;

        this._selectionCircle = new SelectionCircle({
            rgb: 0xFFFFFF,
            x: this.x,
            y: this.y
        });

        return this._selectionCircle;

    }

    showSelectionCircle(rgb) {

        if (this.selectionCircle.shown) return;
        this.selectionCircle.shown = true;

        if (rgb) this._selectionCircle.color = new THREE.Color(rgb);

        app.game.emit("showEntity", this._selectionCircle);

    }

    hideSelectionCircle() {

        if (!this.selectionCircle.shown) return;
        this.selectionCircle.shown = false;

        app.game.emit("hideEntity", this._selectionCircle);

    }

}

emitterMixin(Unit);


class SelectionCircle extends Behavior {
    constructor(props) {
        super(props);

        this.entity.on("hoverOn", intersect => this.onHoverOn(intersect));
        this.entity.on("hoverOff", intersect => this.onHoverOff(intersect));

        this.entity.on("mouseUp", intersect => this.onMouseUp(intersect));

        this._selectionCircle = new SelectionCircleDoodad({
            rgb: 0xFFFFFF,
            x: this.entity.x,
            y: this.entity.y
        });

        app.game.emit("hideEntity", this._selectionCircle);

        app.game.on("selection", entities => {
            if (entities.indexOf(this.entity) === -1) this.deselect()});

    }

    onHoverOn(intersect) { this.show(0xFFFF00); }

    onHoverOff(intersect) {
        !this.selected ? this.hide() :this.color = new THREE.Color(0x00FF00);
    }

    onMouseUp(intersect) {

        this.color = new THREE.Color(0x00FF00);

        this.selected = true;

        app.game.emit("selection", [this.entity]);

    }

    deselect() {
        this.selected = false;
        this.hide();
    }

    set color(value) { this._selectionCircle.color = value; }
    get color() { return this._selectionCircle.color.getHex() }

    show(rgb) {

        if (rgb && rgb !== this.color)
            this.color = new THREE.Color(rgb);

        if (this.shown) return;
        this.shown = true;

        app.game.emit("showEntity", this._selectionCircle);

    }

    hide() {

        if (!this.shown) return;
        this.shown = false;

        app.game.emit("hideEntity", this._selectionCircle);

    }
}

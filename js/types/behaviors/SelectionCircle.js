
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

        // app.game.emit("hideEntity", this._selectionCircle);
        //
        app.on("selection", entities =>
            entities.indexOf(this.entity) === -1 ? this.deselect() : this.select());

    }

    onHoverOn(intersect) {

        if (app.selectionFilter.type)
            if (!(this.entity instanceof app.selectionFilter.type)) return;

        this.show(0xFFFF00);
    }

    onHoverOff(intersect) {

        if (this.entity.selected)
            return this.color = new THREE.Color(0x00FF00);

        this.hide();

    }

    onMouseUp(intersect) {
        app.emit("selection", [this.entity]);
    }

    select() {
        this.entity.selected = true;
        this.show(0x00FF00);
    }

    deselect() {
        this.entity.selected = false;
        this.hide();
    }

    set color(value) { this._selectionCircle.color = value; }
    get color() { return this._selectionCircle.color.getHex() }

    show(rgb) {

        if (rgb && rgb !== this.color)
            this.color = new THREE.Color(rgb);

        this._selectionCircle.show();

    }

    hide() {

        this._selectionCircle.hide();

    }
}

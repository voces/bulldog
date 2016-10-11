
class Selection extends Behavior {
    constructor(props) {
        super(props);

        this.entity.on("hoverOn", intersect => this.onHoverOn(intersect));
        this.entity.on("hoverOff", intersect => this.onHoverOff(intersect));
        this.entity.on("mouseUp", (intersect, e) => this.onMouseUp(intersect, e));

        app.mouse.on("selection", entities =>
            entities.indexOf(this.entity) === -1 ? this.deselect() : this.select());

    }

    get selectionCircle() {
        if (this._selectionCircle) return this._selectionCircle;

        this._selectionCircle = new SelectionCircle({
            rgb: 0xFFFFFF,
            x: this.entity.x,
            y: this.entity.y,
            radius: this.entity.radius
        });

        return this._selectionCircle;
    }

    onHoverOn(intersect) {

        if (app.selectionFilter.type)
            if (!(this.entity instanceof app.selectionFilter.type)) return;

        this.show(0xFFFF00);

        app.ui.container.style.cursor = "pointer";
    }

    onHoverOff(intersect) {

        app.ui.container.style.cursor = "";

        if (this.entity.selected)
            return this.color = new THREE.Color(0x00FF00);

        this.hide();

    }

    onMouseUp(intersect, e) {

        //Left click only
        if (e.button !== 0) return;

        if (app.selectionFilter.type)
            if (!(this.entity instanceof app.selectionFilter.type)) return;

        app.emit("selection", [this.entity]);
    }

    select() {
        if (this.entity.selected) return;

        this.entity.selected = true;
        this.show(0x00FF00);

        app.ui.loadDeck(this.entity.commandDeck);
    }

    deselect() {
        if (!this.entity.selected) return;
        this.entity.selected = false;
        this.hide();
    }

    set color(value) { this.selectionCircle.color = value; }
    get color() { return this.selectionCircle.color.getHex() }

    show(rgb) {

        if (rgb && rgb !== this.color)
            this.color = new THREE.Color(rgb);

        this.selectionCircle.show();

    }

    hide() {

        this.selectionCircle.hide();

    }
}

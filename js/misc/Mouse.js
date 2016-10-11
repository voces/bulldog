
const SELECTION_FILTER = {
    UNITS: {
        type: Unit
    },
    NONE: {
        type: class None {}
    }
};

class Mouse extends EventEmitter2 {
    constructor() {
        super({maxListeners: 20});

        this.filter = SELECTION_FILTER.UNITS;
        this.intersection = null;

        this.interaction = [
            {filter: SELECTION_FILTER.UNITS, callback: intersect => this.select(intersect)},
            {filter: SELECTION_FILTER.NONE},
            {filter: SELECTION_FILTER.NONE}
        ];

        document.addEventListener("mousemove", e => this.onMouseMove(e));
        document.addEventListener("mousedown", e => this.onMouseDown(e));
        document.addEventListener("mouseup", e => this.onMouseUp(e));
    }

    onMouseMove(e) {

        //Grab all objects the mouse intersects with
        let intersects = this.intersects;

        this.lastIntersects = intersects;

        //No intersection; we're in gray space
        if (intersects.length === 0) {

            //If we had an intersection, alert hoverOff
            if (this.lastIntersect)
                this.lastIntersect.object.entity.emit("hoverOff", this.lastIntersect);

            //We have none now
            this.lastIntersect = null;

            return;

        }

        //Grab the top-most intersection that matches the primary button filter (0, left)
        let intersect;
        for (let i = 0; i < intersects.length; i++) {
            if (this.interaction[0].filter.type && !(intersects[i].object.entity instanceof this.interaction[0].filter.type))
                continue;

            intersect = intersects[i];
            break;
        }

        //We have no top-most intersection that matches the primary button filter, so alert hoverOff
        if (!intersect) {

            if (this.lastIntersect)
                this.lastIntersect.object.entity.emit("hoverOff", this.lastIntersect);

            this.lastIntersect = null;

            return;

        };

        //We had an intersection before...
        if (this.lastIntersect) {

            //New intersect
            if (this.lastIntersect.object !== intersect.object)
                this.lastIntersect.object.entity.emit("hoverOff", this.lastIntersect, intersect);

            //Old intersect
            else if (this.lastIntersect.face !== intersect.face)
                this.lastIntersect.object.entity.emit("hoverFace", this.lastIntersect, intersect);

            //Comment out because the hover event is unlikely to be used
            // else
            //     this.lastIntersect.object.entity.emit("hover", this.lastIntersect, intersect);

            this.lastIntersect = intersect;

            return;

        }

        //Alert hoverOn for new intersection
        intersect.object.entity.emit("hoverOn", intersect);

        this.lastIntersect = intersect;

    }

    topIntersect(filter) {

        for (let i = 0; i < this.lastIntersects.length; i++) {
            if (filter.type && !(this.lastIntersects[i].object.entity instanceof filter.type))
                continue;

            return this.lastIntersects[i];
        }

        return null;

    }

    onMouseDown(e) {

        //we already have the top intersect for left-click, so call the callback
        if (e.button === 0) {

            if (this.lastIntersect) this.interaction[0].callback(this.lastIntersect);
            else console.error("Bad click!");


        //Otherwise grab the top and call the callback
        } else {

            let intersect = this.topIntersect(this.interaction[e.button].filter);
            if (intersect) this.interaction[e.button].callback(intersect);
            // else if (this.interaction[e.button].filter.type.indexOf(Terrain))
            else console.error("Bad click!");

        }

    }

    select(intersect) {

        this.emit("selection", [intersect.object.entity]);

    }

    onMouseUp(e) {

    }

    get intersects() {
        return app.graphic.intersect();
    }
}

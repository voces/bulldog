
class Behavior extends EventEmitter2 {
    constructor(props) {
        super();

        this.entity = props.entity;

        this._active = false;

        this.entity.behaviors.push(this);

    }

    update(delta) { }

    set active(value) {

        if (value && !this._active) {
            if (this.entity.activeBehaviors.push(this) === 1) {
                this.entity.active = true;
                this.entity.emit("active");
            }
        }

        if (!value && this._active) {
            this.entity.activeBehaviors.splice(this.entity.activeBehaviors.indexOf(this), 1);
            if (this.entity.activeBehaviors.length === 0) {
                this.entity.active = false;
                this.entity.emit("inactive");
            }
        }

    }
}

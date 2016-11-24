
function emitterMixin(obj) {

    let emitter = new EventEmitter2();

    for (let prop in emitter)
        obj[prop] = emitter[prop];

    for (let prop in emitter.constructor.prototype)
        obj[prop] = emitter.constructor.prototype[prop];

}

function merge(a, b) {

    for (let prop in b) {
        if (typeof b[prop] === "object") {
            if (b[prop] instanceof Array) {
                if (typeof a[prop] !== "object" || !(a[prop] instanceof Array))
                    a[prop] = [];
            } else if (typeof a[prop] !== "object") a[prop] = {};
            merge(a[prop], b[prop]);

        } else a[prop] = b[prop];
    }

}

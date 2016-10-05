
function emitterMixin(obj) {

    let emitter = new EventEmitter2();

    for (let prop in emitter)
        obj[prop] = emitter[prop];

    for (let prop in emitter.constructor.prototype)
        obj[prop] = emitter.constructor.prototype[prop];

}

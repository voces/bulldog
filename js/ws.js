
const PING_DECAY = 0.1;

class RollingAverage {
    constructor(length) {
        this.index = 0;
        this.length = length;
        this.arr = [];
    }

    get average() {
        return this.arr.reduce((a, b) => a + b) / this.arr.length;
    }

    get variance() {
        let average = this.average;
        return this.arr.map(a => (a - average)**2).reduce((a, b) => a + b) / this.arr.length;
    }

    get deviation() {
        return Math.sqrt(this.variance);
    }

    push(value) {
        this.arr[this.index] = value;
        this.index = (this.index + 1) % this.length;
    }
}

class WS extends EventEmitter2 {
    constructor() {
        super();

        this.host = "notextures.io";
        this.port = 8088;

        this.connect();

        this.tackingId = 0;

        this.callbacks = [];

        this.watchPing();

    }

    watchPing() {

        const PING_HOLD = 1 - PING_DECAY;

        this.rollingPing = new RollingAverage(5);
        this.rollingOffset = new RollingAverage(100);

        setInterval(() => this.send({
            eid: "echo",
            type: "ping",
            sent: Date.now()

        }, message => {
            this.rollingPing.push(Date.now() - message.sent);
            this.rollingOffset.push(Date.now() - message.timestamp);

        }), 1000);

    }

    //This function should only be called when the timelime is safe to jump
    //  Only do this in the beginning or when NOTHING is happening (i.e., the time difference between the previous and next event is irrelevant)
    updateOffset() {
        this.offset = Math.round(this.rollingOffset.average);
    }

    connect() {

        this.socket = new WebSocket(`wss://${this.host}:${this.port}`);

        this.socket.addEventListener("message", message => this.onMessage(message));
        this.socket.addEventListener("open", () => this.onOpen());
        this.socket.addEventListener("close", () => this.onClose());

    }

    onMessage(message) {
        message = JSON.parse(message.data);
        // console.log("RECV", message);

        if (typeof this.offset === "undefined") {

            if (message.timestamp && (message.eid !== "echo" || message.type !== "ping") && this.rollingOffset.arr.length) {
                this.updateOffset();
                message.localTimestamp = message.timestamp + this.offset

            } else message.localTimestamp = Date.now() + Date.now() - message.timestamp;

        } else message.localTimestamp = message.timestamp + this.offset;

        syncProperty.time = message.localTimestamp;

        if (typeof message.tid !== "undefined" && this.localPlayer && message.origin === this.localPlayer.id && this.callbacks[message.tid]) {
            this.callbacks[message.tid](message);
            delete this.callbacks[message.tid];
        }

        this.emit("message", message);
    }

    send(message, callback) {
        // console.log("SEND", message);

        if (callback) {
            message.tid = this.tackingId++;
            this.callbacks[message.tid] = callback;
        }

        this.socket.send(JSON.stringify(message));
    }

    onOpen() {
        this.emit("open");
    }

    onClose() {
        this.emit("close");
        this.connect();
    }

}

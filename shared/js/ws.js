
{class WS extends EventEmitter2 {
    constructor() {
        super();

        this.host = "notextures.io";
        this.port = 8088;

        this.connect();

    }

    connect() {

        this.socket = new WebSocket(`wss://${this.host}:${this.port}`);

        this.socket.addEventListener("message", message => this.onMessage(message));
        this.socket.addEventListener("open", () => this.onOpen());
        this.socket.addEventListener("close", () => this.onClose());

    }

    onMessage(message) {
        message = JSON.parse(message.data);
        console.log("RESV", message);
        this.emit("message", message);
    }

    send(message) {
        console.log("SEND", message);
        this.socket.send(JSON.parse(message));
    }

    onOpen() {
        this.emit("open");
    }

    onClose() {
        this.emit("close");
        this.connect();
    }

}

window.ws = new WS();}

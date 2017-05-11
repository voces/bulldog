
/* globals syncProperty */

class RollingAverage {

	constructor( length ) {

		this.index = 0;
		this.length = length;
		this.arr = [];

	}

	get average() {

		return this.arr.reduce( ( a, b ) => a + b ) / this.arr.length;

	}

	get variance() {

		let average = this.average;
		return this.arr.map( a => ( a - average ) ** 2 ).reduce( ( a, b ) => a + b ) / this.arr.length;

	}

	get deviation() {

		return Math.sqrt( this.variance );

	}

	push( value ) {

		this.arr[ this.index ] = value;
		this.index = ( this.index + 1 ) % this.length;

	}

}

// eslint-disable-next-line no-unused-vars
class WS extends EventEmitter2 {

	constructor() {

		super();

		this.host = "notextures.io";
		this.port = 8088;

		this.connect();

		this.echoId = 0;
		this.echos = [];

		this.watchPing();

		this.lastChannel = undefined;

	}

	watchPing() {

		// const PING_HOLD = 1 - PING_DECAY;

		this.rollingPing = new RollingAverage( 5 );
		this.rollingOffset = new RollingAverage( 100 );

		setInterval( () => this.echo( {
			sent: Date.now()

		} ).then( message => {

            // console.log(message);
			this.rollingPing.push( Date.now() - message.sent );
			this.rollingOffset.push( Date.now() - message.time );

		} ), 1000 * 60 );

	}

    //This function should only be called when the timelime is safe to jump
    //  Only do this in the beginning or when NOTHING is happening (i.e., the time difference between the previous and next event is irrelevant)
	updateOffset() {

		this.offset = Math.round( this.rollingOffset.average );

	}

	connect() {

		this.socket = new WebSocket( `wss://${this.host}:${this.port}` );

		this.socket.addEventListener( "message", e => this.onMessage( JSON.parse( e.data ) ) );
		this.socket.addEventListener( "open", () => this.onOpen() );
		this.socket.addEventListener( "close", () => this.onClose() );

	}

	onMessage( message ) {

        // console.log("RECV", message);

		if ( typeof this.offset === "undefined" ) {

			if ( message.time && ( message.id !== "echo" ) && this.rollingOffset.arr.length ) {

				this.updateOffset();
				message.localTime = message.time + this.offset;

			} else message.localTime = Date.now() + Date.now() - message.time;

		} else message.localTime = message.time + this.offset;

		syncProperty.time = message.localTime;

		if ( typeof message.echo !== "undefined" && this.echos[ message.echo ] ) {

			if ( message.id === "fail" ) this.echos[ message.echo ].reject( message );
			else this.echos[ message.echo ].resolve( message );

			setTimeout( () => delete this.echos[ message.echo ], 0 );

		}

		this.emit( message.id || "push", message );
		this.emit( "message", message );

	}

	echo( packet ) {

		packet.id = "echo";
		return this.json( packet );

	}

	channels() {

		return this.json( { id: "channels" } );

	}

	subscribe( channel ) {

		return this.json( { id: "subscribe", channelName: channel } );

	}

	unsubscribe( channel ) {

		return this.json( { id: "unsubscribe", channelName: channel } );

	}

	rename( name ) {

		return this.json( { id: "rename", name: name } );

	}

	json( message ) {

        // console.log("SEND", message);
        // console.log(message.channelName, this.channelName);
		if ( typeof message.channelName === "undefined" ) message.channelName = this.lastChannel;
		else this.lastChannel = message.channelName;
        // console.log(message.channelName, this.channelName);
		return new Promise( ( resolve, reject ) => {

			message.echo = ++ this.echoId;
			this.echos[ message.echo ] = { resolve, reject };

            // console.log("SEND", message);
			this.socket.send( JSON.stringify( message ) );

		} );

	}

	onOpen() {

		this.emit( "open" );

	}

	onClose() {

		this.emit( "close" );
		this.connect();

	}

}

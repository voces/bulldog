
// eslint-disable-next-line no-unused-vars
class UI {

	constructor() {

		this.container = document.createElement( "div" );

		this.container.classList.add( "game" );

		this.container.oncontextmenu = () => false;

		document.body.appendChild( this.container );

		this.createResourceDisplay();
		this.createCommandDeck();

		window.addEventListener( "keyup", ( { key } ) =>
			this.cards[ key ] && this.cards[ key ].onclick ? this.cards[ key ].onclick() : null );

	}

	enablePointerCursor() {

		this.container.style.cursor = "pointer";

	}

	disablePointerCursor() {

		if ( this.container.style.cursor === "pointer" );
		this.container.style.cursor = "";

	}

	showResourceDisplay() {

		this.container.appendChild( this.resourceDisplay );

	}

	createResourceDisplay() {

		this.resourceDisplay = document.createElement( "div" );
		this.resourceDisplay.classList.add( "resources" );

		const currency = document.createElement( "span" );
		let actualCurrency = 0;

		currency.innerText = 0;

		Object.defineProperty( this, "currency", {
			set: value => currency.innerText = Math.round( ( actualCurrency = value ) * 100 ) / 100,
			get: () => actualCurrency
		} );

		this.resourceDisplay.appendChild( currency );

		const currencyIcon = document.createElement( "img" );
		currencyIcon.src = "/img/currency.svg";
		this.resourceDisplay.appendChild( currencyIcon );

	}

	showCommandDeck() {

		this.container.appendChild( this.commandDeck );

	}

	createCommandDeck() {

		this.commandDeck = document.createElement( "div" );
		this.commandDeck.classList.add( "command-deck" );

		this.cards = {};

		const hotkeys = `
            qwer
            asdf
            zxcv
        `.replace( /[\t ]/g, "" ).split( "\n" ).map( row => row.split( "" ) );

		hotkeys.shift();

		for ( let y = 0; y < 3; y ++ )
			for ( let x = 0; x < 4; x ++ ) {

				const commandCard = document.createElement( "span" ),
					icon = document.createElement( "img" ),
					hotkey = document.createElement( "span" );

                // icon.src = "/img/circle.svg";

				hotkey.innerText = hotkeys[ y ][ x ];

				commandCard.classList.add( "command-card" );

				commandCard.appendChild( icon );
				commandCard.appendChild( hotkey );

				commandCard.style.left = x * 2.25 + y + "em";
				commandCard.style.top = y * 1.95 + "em";

				commandCard.icon = icon;

				commandCard.style.visibility = "hidden";

				this.commandDeck.appendChild( commandCard );

				this.cards[ hotkey.innerText ] = commandCard;

			}

	}

	loadDeck( commandDeck ) {

		for ( let card in this.cards )
			this.cards[ card ].style.visibility = "hidden";

		for ( let i = 0; i < commandDeck.cards.length; i ++ ) {

			const card = this.cards[ commandDeck.cards[ i ].hotkey.toLowerCase() ];
			card.style.visibility = "";
			card.icon.src = commandDeck.cards[ i ].icon;

			if ( commandDeck.cards[ i ].action ) card.onclick = commandDeck.cards[ i ].action;

		}

	}

}

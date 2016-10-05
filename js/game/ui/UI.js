
class UI {

    constructor() {

        this.container = document.createElement("div");

        this.container.classList.add("game");

        document.body.appendChild(this.container);

        this.createResourceDisplay();
        this.createCommandDeck();

    }

    enablePointerCursor() { this.container.style.cursor = "pointer"; }
    disablePointerCursor() {
        if (this.container.style.cursor === "pointer");
            this.container.style.cursor = "";
    }

    showResourceDisplay() { this.container.appendChild(this.resourceDisplay); }

    createResourceDisplay() {

        this.resourceDisplay = document.createElement("div");
        this.resourceDisplay.classList.add("resources");

        let currency = document.createElement("span");
        let actualCurrency = 0;
        currency.innerText = 0;
        Object.defineProperty(this, "currency", {
            set: value => currency.innerText = Math.round((actualCurrency = value) * 100) / 100,
            get: () => actualCurrency
        });
        this.resourceDisplay.appendChild(currency);

        let currencyIcon = document.createElement("img");
        currencyIcon.src = "/img/currency.svg";
        this.resourceDisplay.appendChild(currencyIcon);

    }

    showCommandDeck() { this.container.appendChild(this.commandDeck); }

    createCommandDeck() {

        this.commandDeck = document.createElement("div");
        this.commandDeck.classList.add("command-deck");

        let hotkeys = `
            qwer
            asdf
            zxcv
        `.replace(/[\t ]/g, "").split("\n").map(row => row.split(""));

        hotkeys.shift();

        for (let y = 0; y < 3; y++)
            for (let x = 0; x < 4; x++) {

                let commandCard = document.createElement("span"),
                    icon = document.createElement("img"),
                    hotkey = document.createElement("span");

                icon.src = "/img/circle.svg";

                hotkey.innerText = hotkeys[y][x];

                commandCard.classList.add("command-card");

                commandCard.appendChild(icon);
                commandCard.appendChild(hotkey);

                commandCard.style.left = x*2 + y + "em";
                commandCard.style.top = y*1.7 + "em";

                this.commandDeck.appendChild(commandCard);

            }

    }

}
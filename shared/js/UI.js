
class UI {

    constructor() {

        this.createResourceDisplay();

    }

    showResourceDisplay() {

        document.body.appendChild(this.resourceDisplay);

    }

    createResourceDisplay() {

        let container = document.createElement("div");

        container.textContent = "hello!";

        this.resourceDisplay = container;

    }

}

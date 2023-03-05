class UniGameBase {
    constructor(width, height) {
        this.canvas = document.getElementById("game_screen");
        this.canvas.width = width;
        this.canvas.height = height;

        this.context = canvas.getContext("2d");
    }

    init() {

    }

    loop() {

    }

    destroy() {

    }
}
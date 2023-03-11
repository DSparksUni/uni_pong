class Ball {
    constructor(x, y, r) {
        this.orig_x = x;
        this.orig_y = y;

        this.x = x;
        this.y = y;
        this.radius = r;

        this.spd = createVector(0, 0);
    }

    draw(r, g, b, a=255) {
        fill(r, g, b, a);
        noStroke();

        ellipseMode(CENTER);
        ellipse(this.x, this.y, this.radius);
    }

    reset() {
        this.spd.x = 0;
        this.spd.y = 0;

        this.x = this.orig_x;
        this.y = this.orig_y;

        while(this.spd.x > -1 && this.spd.x < 1) this.spd.x = random(-7, 7);
        while(this.spd.y > -1 && this.spd.y < 1) this.spd.y = random(-7, 7);
    }

    update() {
        this.x += this.spd.x;

        this.y += this.spd.y;
        if(this.y + this.radius > height) {
            this.y = height - this.radius;
            this.spd.y *= -1;
        } else if(this.y - this.radius < 0) {
            this.y = this.radius;
            this.spd.y *= -1;
        }

        if(this.x > width) {
            this.reset();
            return 1;
        } else if(this.x < 0) {
            this.reset();
            return -1;
        } else return 0;
    }
}
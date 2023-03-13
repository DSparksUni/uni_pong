class Paddle {
    constructor(x, y, w, h) {
        this.orig_x = x;
        this.orig_y = y;

        this.x = x;
        this.y = y;

        this.yspd = 0;

        this.width = w;
        this.height = h;

        this.score = 0;
    }

    draw(r, g, b, a=255) {
        fill(r, g, b, a);
        noStroke();

        rectMode(CORNER);
        rect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.yspd;

        if(this.y < 0) this.y = 0;
        else if(this.y + this.height > height) this.y = height - this.height;
    }

    reset() {
        this.x = this.orig_x;
        this.y = this.orig_y;
    }

    ball_collide(ball) {
        return collideRectCircle(
            this.x, this.y, this.width, this.height,
            ball.x, ball.y, ball.radius
        );
    }
}
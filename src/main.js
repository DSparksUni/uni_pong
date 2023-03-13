let player_paddle;
let computer_paddle;
let ball;

let cnv;

let cnv_center = {
    x: 0, y: 0
};

let paused = false;

let restart_button;

const BACKGROUND_COLOR = {
    r: 200, g: 200, b: 200
};

const COMPUTER_PADDLE_COLOR = {
    r: 125, g: 125, b: 125
};
const PLAYER_PADDLE_COLOR = {
    r: 255, g: 255, b: 0
};

const PADDLE_WIDTH = 25;
const PADDLE_HEIGHT = 75;

const PADDLE_BORDER_OFFSET = 15;

const PADDLE_SPEED = 4;

const BALL_RADIUS = 20;
const BALL_COLOR = {
    r: 255, g: 0, b: 0
};

const BACKGROUND_ELLIPSE_SCALE_FACTOR = 1.5;

function draw_background() {
    stroke(0, 0, 0);
    strokeWeight(1.5);
    noFill();
    
    line(cnv_center.x, 0, cnv_center.x, height);
    
    ellipseMode(CENTER);
    ellipse(cnv_center.x, cnv_center.y, 150, 150);
    ellipse(
        0, cnv_center.y, height / BACKGROUND_ELLIPSE_SCALE_FACTOR,
        height / BACKGROUND_ELLIPSE_SCALE_FACTOR
    );
    ellipse(
        width, cnv_center.y, height / BACKGROUND_ELLIPSE_SCALE_FACTOR,
        height / BACKGROUND_ELLIPSE_SCALE_FACTOR
    );
}

function handle_collision(paddle) {
    if(paddle.ball_collide(ball)) {
        if(ball.y < paddle.y) {
            ball.y = paddle.y - ball.radius - PADDLE_SPEED - 1;
            ball.spd.y *= -1;
        } else if(ball.y > paddle.y + paddle.height) {
            ball.y = paddle.y + paddle.height + ball.radius + PADDLE_SPEED + 1;
            ball.spd.y *= -1;
        } else ball.spd.x *= -1;
    }
}

function computer_ai() {
    if(ball.y > computer_paddle.y) computer_paddle.yspd = PADDLE_SPEED;
    else if(ball.y < computer_paddle.y) computer_paddle.yspd = -PADDLE_SPEED;
}

function setup() {
    cnv = createCanvas(700, 400);
    windowResized();

    const PADDLE_POS_Y = cnv_center.y - (PADDLE_HEIGHT / 2);

    computer_paddle = new Paddle(
        PADDLE_BORDER_OFFSET, PADDLE_POS_Y,
        PADDLE_WIDTH, PADDLE_HEIGHT
    );

    player_paddle = new Paddle(
        width - PADDLE_WIDTH - PADDLE_BORDER_OFFSET,
        PADDLE_POS_Y, PADDLE_WIDTH, PADDLE_HEIGHT
    );

    ball = new Ball(
        cnv_center.x, cnv_center.y,
        BALL_RADIUS
    );
    ball.reset();

    restart_button = new Button({
        x: width / 2, y: height / 2,
        width: 100, height: 50,
        align_x: 0, align_y: 0,
        content: "Restart",
        on_press() {
            player_paddle.reset();
            computer_paddle.reset();
            ball.reset();
            paused = !paused;
        }
    });
    restart_button.style("default", {
        color: "#FFF",
        background: "#00F",
        text_size: 20
    });
    restart_button.style("hover", {
        color: "#000",
        background: "22F",
        text_size: 20
    });
    restart_button.disable();
}

function draw() {
    background(
        BACKGROUND_COLOR.r, BACKGROUND_COLOR.g, BACKGROUND_COLOR.b
    );

    draw_background();

    player_paddle.draw(
        PLAYER_PADDLE_COLOR.r, PLAYER_PADDLE_COLOR.g,
        PLAYER_PADDLE_COLOR.b
    );
    computer_paddle.draw(
        COMPUTER_PADDLE_COLOR.r, COMPUTER_PADDLE_COLOR.g,
        COMPUTER_PADDLE_COLOR.b
    );

    textSize(45);
    fill(0, 0, 0);
    rectMode(CORNER);
    textAlign(LEFT);

    text(player_paddle.score, width / 1.35, 50);
    text(computer_paddle.score, width / 4, 50);

    ball.draw(
        BALL_COLOR.r, BALL_COLOR.g, BALL_COLOR.b
    );

    if(!paused) {
        let ball_state = ball.update();

        if(ball_state === 1) computer_paddle.score += 1;
        else if(ball_state === -1) player_paddle.score += 1;

        if(ball_state != 0) {
            player_paddle.reset();
            computer_paddle.reset();
        }

        player_paddle.update();

        computer_ai();
        computer_paddle.update();

        handle_collision(player_paddle);
        handle_collision(computer_paddle);
    } else {
        fill(255, 255, 255, 130);
        rect(0, 0, width, height);

        textSize(60);
        fill(0);
        textAlign(CENTER);
        rectMode(CENTER);
        text("Pause", cnv_center.x, height / 4);

        rectMode(CORNER);
        restart_button.draw();
    }
}

function keyPressed() {
    let UP_HANDLE = function() {
        player_paddle.yspd = -PADDLE_SPEED;
    }

    let DOWN_HANDLE = function() {
        player_paddle.yspd = PADDLE_SPEED;
    }

    switch(keyCode) {
        case UP_ARROW:
            UP_HANDLE();
            break;
        case DOWN_ARROW:
            DOWN_HANDLE();
            break;
        case ESCAPE:
            paused = !paused;

            if(paused) restart_button.enable();
            else restart_button.disable();

            break;
    }

    switch(key) {
        case "w":
            UP_HANDLE();
            break;
        case "s":
            DOWN_HANDLE();
            break;
    }
}

function keyReleased() {
    let UP_HANDLE = function() {
        if(player_paddle.yspd < 0) player_paddle.yspd = 0;
    }

    let DOWN_HANDLE = function() {
        if(player_paddle.yspd > 0) player_paddle.yspd = 0;
    }

    switch(keyCode) {
        case UP_ARROW:
            UP_HANDLE();
            break;
        case DOWN_ARROW:
            DOWN_HANDLE();
            break;
    }

    switch(key) {
        case "w":
            UP_HANDLE();
            break;
        case "s":
            DOWN_HANDLE();
            break;
    }
}

function windowResized() {
    cnv.position(
        (windowWidth - width) / 2, 0
    );

    cnv_center.x = width / 2;
    cnv_center.y = height / 2;
}
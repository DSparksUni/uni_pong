let player_paddle;
let computer_paddle;
let ball;

let cnv;

let scene_alpha = 255;

let paused = false;

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
    stroke(0, 0, 0, scene_alpha);
    strokeWeight(1.5);
    noFill();
    
    line(width / 2, 0, width / 2, height);
    
    ellipseMode(CENTER);
    ellipse(width / 2, height / 2, 150, 150);
    ellipse(
        0, height / 2, height / BACKGROUND_ELLIPSE_SCALE_FACTOR,
        height / BACKGROUND_ELLIPSE_SCALE_FACTOR
    );
    ellipse(
        width, height / 2, height / BACKGROUND_ELLIPSE_SCALE_FACTOR,
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

function setup() {
    cnv = createCanvas(700, 400);
    cnv.position(
        (windowWidth - width) / 2, 0
    );

    computer_paddle = new Paddle(
        PADDLE_BORDER_OFFSET, (height / 2) - (PADDLE_HEIGHT / 2),
        PADDLE_WIDTH, PADDLE_HEIGHT
    );

    player_paddle = new Paddle(
        width - PADDLE_WIDTH - PADDLE_BORDER_OFFSET,
        (height / 2) - (PADDLE_HEIGHT / 2),
        PADDLE_WIDTH, PADDLE_HEIGHT
    );

    ball = new Ball(
        width / 2, height / 2,
        BALL_RADIUS
    );
    ball.reset();
}

function draw() {
    background(
        BACKGROUND_COLOR.r, BACKGROUND_COLOR.g, BACKGROUND_COLOR.b,
        scene_alpha
    );

    draw_background();

    player_paddle.draw(
        PLAYER_PADDLE_COLOR.r, PLAYER_PADDLE_COLOR.g,
        PLAYER_PADDLE_COLOR.b, scene_alpha
    );
    computer_paddle.draw(
        COMPUTER_PADDLE_COLOR.r, COMPUTER_PADDLE_COLOR.g,
        COMPUTER_PADDLE_COLOR.b, scene_alpha
    );

    textSize(45);
    fill(0, 0, 0, scene_alpha);
    rectMode(CORNER);
    textAlign(LEFT);

    text(player_paddle.score, width / 1.35, 50);
    text(computer_paddle.score, width / 4, 50);

    ball.draw(
        BALL_COLOR.r, BALL_COLOR.g, BALL_COLOR.b,
        scene_alpha
    );

    if(!paused) {
        let ball_state = ball.update();

        if(ball_state === 1) computer_paddle.score += 1;
        else if(ball_state === -1) player_paddle.score += 1;

        player_paddle.update();

        handle_collision(player_paddle);
        handle_collision(computer_paddle);
    } else {
        textSize(60);
        fill(0);
        textAlign(CENTER);
        rectMode(CENTER);
        text("Pause", width / 2, height / 4);
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

            if(paused) scene_alpha = 25;
            else scene_alpha = 255;

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
}
var gBird;
var gWalls = [];
var gScore;
var gHighScore;
var gHighScoreValue = 0;
var gBackground;

var GRACE_PERIOD = 5;

// Icons made by Lorc. Available on http://game-icons.net
// Background created by Freepik

var gCanvas = {
    canvas : document.createElement("canvas"),

    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.frameNo = 0;
        this.interval = setInterval(updateCanvas, 20);
    },

    stop : function() {
        clearInterval(this.interval);
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

document.addEventListener('DOMContentLoaded', setupGame, false);

function setupGame() {
    document.getElementById("btn-flap").addEventListener(
        "mousedown", flapDown);
    document.getElementById("btn-flap").addEventListener(
        "mouseup", flapUp);

    document.getElementById("play-again").addEventListener("click", beginGame);

    window.addEventListener('keydown', flapDown);
    window.addEventListener('keyup', flapUp);

    beginGame();
}

function beginGame() {
    document.getElementById("play-again").style.visibility = "hidden";

    gBird = new Bird(30, 30, 10, 120, "robotman_off.png");
    gBird.gravity = 0.05;

    gWalls = [];

    gScore = new Score("30px", "Consolas", "black", 480, 40);

    gBackground = new Background(480, 270, 0, 0, "background.jpg");

    gCanvas.start();
    gCanvas.clear();
}

function flapDown() {
    gBird.gravity = -0.2;
    gBird.image.src = "robotman_on.png";
}

function flapUp() {
    gBird.gravity = 0.05;
    gBird.image.src = "robotman_off.png";
}

function Background(width, height, x, y, imageSrc) {
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = imageSrc;

    this.update = function() {
        // Add the second background image immediately following the first for
        // infinite scrolling
        gCanvas.context.drawImage(this.image, this.x, this.y, width, height);
        gCanvas.context.drawImage(this.image, this.x + width, this.y, width, height);
    };

    this.updatePosition = function() {
        this.x -= 1;

        if (this.x == -(width)) {
            this.x = 0;
        }
    };
}

function Score(fontHeight, font, color, x, y) {
    this.text = "";

    this.color = color;

    this.update = function() {
        var context = gCanvas.context;

        context.font = fontHeight + " " + font;
        context.fillStyle = this.color;
        context.textAlign="right";
        context.fillText(this.text, x, y);
    };
}

function Wall(width, height, x, y, imageSrc) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.image = new Image();
    this.image.src = imageSrc;

    this.update = function() {
        var context = gCanvas.context;
        //context.rect(this.x, this.y, 50, this.height);
        //context.fillStyle = context.createPattern(this.image, "repeat");
        //context.fill();

         context.fillStyle = "black";
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}

function Bird(width, height, x, y, imageSrc) {
    this.x = x;
    this.y = y;

    this.gravity = 0;
    this.gravitySpeed = 0;

    this.image = new Image();
    this.image.src = imageSrc;

    this.update = function() {
        gCanvas.context.drawImage(this.image, this.x, this.y, width, height);
    };

    this.updatePosition = function() {
        this.gravitySpeed += this.gravity;

        this.y += this.gravitySpeed;

        this.hitFloor();
        this.hitCeiling();
    };

    this.hitFloor = function() {
        var floor = gCanvas.canvas.height - height;

        if (this.y > floor) {
            this.y = floor;
            this.gravitySpeed = 0;
        }
    };

    this.hitCeiling = function() {
        if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    };

    this.collidesWith = function(wall) {
        var birdLeft = this.x;
        var birdRight = this.x + width;

        var birdTop = this.y;
        var birdBottom = this.y + height;

        var wallLeft = wall.x;
        var wallRight = wall.x + wall.width;

        var wallTop = wall.y;
        var wallBottom = wall.y + wall.height;

        if ((birdBottom < wallTop) ||
            (birdTop > wallBottom) ||
            (wallLeft - birdRight > -(GRACE_PERIOD)) ||
            (birdLeft - wallRight > -(GRACE_PERIOD))) {
            return false;
        }
        return true;
    };
}

function endGame() {
    document.getElementById("play-again").style.visibility = "visible";

    if(gHighScore === undefined) {
        gHighScore = new Score("30px", "Consolas", "red", 480, 100);
    }

    if(gCanvas.frameNo > gHighScoreValue) {
        gHighScoreValue = gCanvas.frameNo;

        gHighScore.text = "NEW HIGH SCORE: " + gHighScoreValue;
        gHighScore.color = "red";
    } else {
        gHighScore.text = "HIGH SCORE: " + gHighScoreValue;
        gHighScore.color = "black";
    }

    gBird.image.src = "robotman_dead.png";

    gHighScore.update();
    gBird.update();

    gCanvas.stop();
}

function updateCanvas() {
    for (var i = 0; i < gWalls.length; i += 1) {
        if (gBird.collidesWith(gWalls[i])) {
            endGame();
            return;
        }
    }

    gCanvas.clear();
    gCanvas.frameNo += 1;

    // Update the background first to make sure the rest of the components are in the front
    gBackground.updatePosition();
    gBackground.update();

    if (gCanvas.frameNo == 1 || needNewWall(150)) {
        var canvasWidth = gCanvas.canvas.width;
        var canvasHeight = gCanvas.canvas.height;

        var minHeight = 20;
        var maxHeight = 200;

        var height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        var minGap = 50;
        var maxGap = 200;

        var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        gWalls.push(new Wall(10, height, canvasWidth, 0, "wall.png"));
        gWalls.push(new Wall(10, canvasHeight - height - gap, canvasWidth, height + gap,
            "wall.png"));
    }
    for (i = 0; i < gWalls.length; i += 1) {
        gWalls[i].x += -1;
        gWalls[i].update();
    }

    gScore.text="SCORE: " + gCanvas.frameNo;
    gScore.update();

    gBird.updatePosition();
    gBird.update();
}

function needNewWall(n) {
    return (gCanvas.frameNo / n) % 1 == 0;
}

var PLAY = 1;
var END = 0;

var gameState = PLAY;

var obstacleImg1, obstacleImg2, obstacleImg3, obstacleImg4, obstacleGroup;
var mark, arrowGroup;
var ground;
var invisibleGround;
var score = 0;
var points = 0;
var mountains;
var dragon;
var title;

var gameOver;
var restart;


function preload() {

  gameOverImg = loadImage("GAME_OVER.png");
  restartImg = loadImage("restart.png");
  titleImg = loadImage("dragonRun_title-removebg.png");

  groundImg = loadImage("ground.png");
  forestImg = loadImage("forest.png");

  markImg = loadImage("mark.png");
  dragonImg = loadImage("dragon-removebg.png");

  goodArrowImg = loadImage("ARROW2.png");

  obstacleImg1 = loadImage("stone-removebg.png");
  obstacleImg2 = loadImage("ARROW1.png");
  obstacleImg3 = loadImage("Bush.png");
  obstacleImg4 = loadImage("Fire-removebg.png");

  forestSounds = loadSound("forest sounds.wav");

}


function setup() {
  createCanvas(1000, 600);

  mountains = createSprite(150, 700);
  mountains.addImage("forest", forestImg);
  mountains.scale = 0.9;

  ground = createSprite(100, 800, 600, 10);
  ground.addImage("ground1", groundImg);
  ground.scale = 1;

  mark = createSprite(200, 535, 20, 20);
  mark.addImage("mark1", markImg);
  mark.scale = 0.2;

  dragon = createSprite(0, 535, 20, 20);
  dragon.addImage("dragon1", dragonImg)
  dragon.scale = 0.5

  invisibleGround = createSprite(500, 550, 1000, 10);

  obstacleGroup = createGroup();
  arrowGroup = createGroup();

  gameOver = createSprite(500, 50);
  gameOver.addImage("Over", gameOverImg)
  gameOver.scale = 0.4;

  title = createSprite(500, 70);
  title.addImage("dragonRun", titleImg);
  title.scale = 2;

  restart = createSprite(500, 150);
  restart.addImage("Restart", restartImg);
  restart.scale = 0.2;

  score = 0;
  points = 0;

}

function spawnObstacles() {

  if (frameCount % 100 === 0) {
    var obstacle = createSprite(950, 450, 10, 10);
    obstacle.velocityX = -(6 + score / 100);

    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1: obstacle.addImage(obstacleImg1);
        break;
      case 2: obstacle.addImage(obstacleImg2);
        break;
      case 3: obstacle.addImage(obstacleImg3);
        break;
      case 4: obstacle.addImage(obstacleImg4);
        break;

      default: break;
    }

    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstacle.setCollider("rectangle", 0, 0, 800, 800);
    obstacle.debug = true;

    obstacleGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY
  obstacleGroup.destroyEach();
  arrowGroup.destroyEach();

  score = 0
  points = 0

  mark.x = 200;
  mark.y = 535;

  dragon.x = 0;
  dragon.y = 535;
}

function createGoodArrow() {
  var goodArrow = createSprite(100, 100, 60, 10);
  goodArrow.addImage("Good", goodArrowImg);
  goodArrow.x = mark.x + 40;
  goodArrow.y = mark.y;
  goodArrow.velocityX = 4;
  goodArrow.lifetime = 200;
  goodArrow.scale = 0.1;

  arrowGroup.add(goodArrow);

}

function draw() {

  background(0);

  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;
    invisibleGround.visible = false;
    title.visible = true;


    spawnObstacles();

    fill("black");
    stroke("white");
    textSize(22);
    score = score + Math.round(getFrameRate() / 60);
    text("Score: " + score, 850, 50);

    fill("black");
    stroke("white");
    textSize(22);
    text("Points: " + points, 50, 50);

    ground.velocityX = -(4 + 3 * score / 100)
    dragon.velocityX = (0.1 + 0.1 * score / 50)

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("up_arrow") && mark.y >= 275) {
      mark.velocityY = -12;
    }
    mark.velocityY = mark.velocityY + 0.8;

    if (keyDown("left_arrow")) {
      mark.velocityX = -5;
    }

    if (keyDown("right_arrow")) {
      mark.velocityX = 5;
    }

    if (keyDown("a")) {
      createGoodArrow();
    }
    mark.collide(invisibleGround);
    dragon.collide(invisibleGround);

    if (obstacleGroup.collide(arrowGroup)) {
      obstacleGroup.destroyEach();
      arrowGroup.destroyEach();
      points = points + 100;
    }

    if (obstacleGroup.isTouching(mark)) {
      gameState = END;
    }

    if (dragon.isTouching(mark)) {
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    invisibleGround.visible = false;
    title.visible = false;

    mark.velocityX = 0;
    mark.velocityY = 0;
    ground.velocityX = 0;
    dragon.velocityX = 0;

    obstacleGroup.setLifetimeEach(-1);
    obstacleGroup.setVelocityXEach(0);

    fill("black");
    stroke("white");
    textSize(22);
    text("Score: 0", 850, 50);

    fill("black");
    stroke("white");
    textSize(22);
    text("Points: 0", 50, 50);

    if (keyDown("space")) {
      reset();
    }
  }


  drawSprites();
}
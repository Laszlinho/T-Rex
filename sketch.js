//variáveis
var nuvem, iCloud;
var trex, trex_running, trex_collide;
var jumpSound, diedSound, checkSound;
var edges;
var ground, imagemChão;
var chaoinvisivel;
var cacto1, cacto2, cacto3, cacto4, cacto5, cacto6;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var game_over, game_overImg;
var restart, restartImg;
var touches = [];

//pre carregamento de imagem 
function preload() {
  //carregar imagens em variáveis auxiliares
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collide = loadAnimation("trex_collided.png");
  
  imagemChão = loadImage("ground2.png");

  iCloud = loadImage("cloud.png");

  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png")
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");

  game_overImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  diedSound = loadSound("die.mp3");
  checkSound = loadSound("checkPoint.mp3");
  
}

//configuração
function setup() {
  //criação da area do jogo
  createCanvas(windowWidth, windowHeight);
  //var test = "Esta é uma mensagem";
  //console.log(test);
  chaoinvisivel = createSprite(width/2, height-10, width, 10);
  chaoinvisivel.visible = false;
  grupoC = new Group();
  grupoN = new Group();
  //criar trex
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("Collided", trex_collide);
  trex.scale = 0.5;

  //criar bordas
  edges = createEdgeSprites();

  ground = createSprite(width/2, height-20, width, 20);
 
  ground.addImage("chão", imagemChão);
  ground.x = ground.width/2;

  game_over = createSprite(width/2, height/2);
  game_over.addImage(game_overImg);
  game_over.scale = 0.5;
  game_over.visible = false;

  restart = createSprite(width/2, height/2+40);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;


  trex.setCollider("circle", 0, 0, 50);
  //trex.debug = true;

}

function draw() {
  background('white');
  
  text("Pontuação: "+ score, width-100, 50);
  //console.log(test);
  if (gameState == PLAY){
    ground.velocityX = -4;
    score = score +Math.round(getFrameRate()/60);
   
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if (score > 0 && score%100 === 0){
      checkSound.play();
    }
    if (touches.length>0&& trex.y >= 160) {
      trex.velocityY = -10;
      jumpSound.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.5;
    criarNuvem();
    criarCacto();
    if (grupoC.isTouching(trex)){
      
      gameState = END;
      diedSound.play();
    }
  }
  else if(gameState == END){
    game_over.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("Collided", trex_collide);
    grupoC.setLifetimeEach(-1);
    grupoN.setLifetimeEach(-1);
    grupoC.setVelocityXEach(0);
    grupoN.setVelocityXEach(0);
    if (touches.length>0){
      touches = [];
      reset();
    }
    if (mousePressedOver(restart)){
      reset();
    }

  }
  
  //trex.collide(edges[3]);
  trex.collide(chaoinvisivel);
  drawSprites();
}
  function reset(){

    gameState = PLAY;
    game_over.visible = false;
    restart.visible = false;
    grupoC.destroyEach();
    grupoN.destroyEach();
    
    trex.changeAnimation("running", trex_running);

    score = 0;
  }
function criarNuvem(){
  if (frameCount%60 === 0){
  nuvem = createSprite(width+10, 100, 10, 10); 
nuvem.y = Math.round(random(height-150, height-100));
nuvem.velocityX = -3;
nuvem.addImage("imagemNuvem", iCloud);
nuvem.scale = 0.5;
nuvem.lifetime = width+15;
nuvem.depth = trex.depth;
trex.depth = trex.depth +1;
console.log(nuvem.depth);
console.log(trex.depth);
grupoN.add(nuvem);
}
}
function criarCacto(){
  if (frameCount % 60 === 0){


var cacto = createSprite(width+10, height-35, 10, 40);
cacto.velocityX = -(6+score/100);
var aux = Math.round(random(1, 6));
switch(aux){
  case 1: cacto.addImage(cacto1);
  break;
  case 2: cacto.addImage(cacto2);
  break;
  case 3: cacto.addImage(cacto3);
  break;
  case 4: cacto.addImage(cacto4);
  break;
  case 5: cacto.addImage(cacto5);
  break;
  case 6: cacto.addImage(cacto6);
  break;
  default: break;
}
  cacto.scale = 0.5;
  cacto.lifetime = width+15;
  grupoC.add(cacto);
  }
}
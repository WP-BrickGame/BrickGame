// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// // let score = 0;
// let ball = {x:canvas.width / 2, y:canvas.height - 30, dx: 2, dy: -2, radius: 5, speed:5};

// let paddle = {height:10, width:50, x:(canvas.width-50)/2};
// let rightPressed = false;
// let leftPressed = false;
// let isGameover = false;
// // let isRunning = false;

// const brickRowCount = 4;
// const brickColumnCount = 10;
// const brickWidth = 68;
// const brickHeight = 20;
// const brickPadding = 2;
// const brickOffsetTop = 30;
// const brickOffsetLeft = 0;

// // let bricks = [];

// // for(let c=0; c<brickColumnCount; c++){
// //   bricks[c] = [];
// //   for(let r=0; r<brickRowCount; r++){
// //     const colors = ['red', 'blue', 'yellow', 'green'];
// //     const color = colors[Math.floor(Math.random()*colors.length)];
// //     const points = color === 'red' ? 40:color === 'blue' ? 30: color === 'yellow' ? 20: 10;
// //     bricks[c][r] = {x:0, y:0, status: 1, color:color, points:points};
// //   }
// // }

// function init() {
//   ball = {
//     x: canvas.width / 2,
//     y: canvas.height - 30,
//     dx: 2,
//     dy: -2,
//     radius: 5,
//     speed: 5
//   };

//   paddle = {
//     height: 10,
//     width: canvas.width, // test용
//     x: 0
//   };

//   bricks = [];
//   for (let c = 0; c < brickColumnCount; c++) {
//     bricks[c] = [];
//     for (let r = 0; r < brickRowCount; r++) {
//       const colors = ['red', 'blue', 'yellow', 'green'];
//       const color = colors[Math.floor(Math.random() * colors.length)];
//       const points = color === 'red' ? 40 : color === 'blue' ? 30 : color === 'yellow' ? 20 : 10;
//       bricks[c][r] = { x: 0, y: 0, status: 1, color: color, points: points };
//     }
//   } 

//   isGameover = false;
//   document.getElementById("gameover").style.display = "none";
//   document.getElementById("win").style.display = "none";
// }

// init();

// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);

// document.getElementById("startBtn").addEventListener("click", start);
// // document.getElementById("stopBtn").addEventListener("click", stop);

// function keyDownHandler(e){
//   if(e.key === "Right" || e.key === "ArrowRight"){
//     rightPressed = true;
//   }else if(e.key === "left" || e.key === "ArrowLeft"){
//     leftPressed = true;
//   }
// }

// function keyUpHandler(e){
//   if(e.key === "Right" || e.key === "ArrowRight"){
//     rightPressed = false;
//   }else if(e.key === "left" || e.key === "ArrowLeft"){
//     leftPressed = false;
//   }
// }

// function collisionDetection(){
//   for (let c=0; c<brickColumnCount; c++){
//     for (let r=0; r<brickRowCount; r++){
//       const b = bricks[c][r];

//       if(b.status === 1) {
//         if(
//           ball.x > b.x && ball.x < b.x + brickWidth &&
//           ball.y > b.y && ball.y < b.y + brickHeight
//           ){
//           ball.dy = -ball.dy;
//           b.status = 0;
//           // score += b.points;
//           // document.getElementById("score").innerText = score;

//           // updateBallSpeed();

//           if (checkWin()) {
//             youwin();
//           }
//         }
//       }
//     }
//   }
// }

// // function updateBallSpeed(){
// //   // ball.speed = 1 + Math.floor(score / 100) * 0.1;
// //   ball.speed = 5;

// //   ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
// //   ball.dy = ball.dy > 0 ? ball.speed : -ball.speed;
// // }

// function drawBall(){
//   ctx.beginPath();
//   ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);

//   ctx.fillStyle = "red";
//   ctx.fill();
//   ctx.closePath();
// }

// function drawPaddle(){
//   ctx.beginPath();
//   ctx.rect(paddle.x, canvas.height - paddle.height-10, paddle.width, paddle.height); 
//   ctx.fillStyle = "black";
//   ctx.fill();
//   ctx.closePath();
// }

// paddle.width = canvas.width; //test용
// function drawBricks(){
//   for (let c=0; c<brickColumnCount; c++){
//     for (let r=0; r<brickRowCount; r++){

//       if(bricks[c][r].status === 1) {
//           const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
//           const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

//           bricks[c][r].x = brickX;
//           bricks[c][r].y = brickY;
//           ctx.beginPath();
//           ctx.rect(brickX, brickY, brickWidth, brickHeight);

//           ctx.fillStyle = bricks[c][r].color;

//           ctx.fill();
//           ctx.closePath();
//       }
//     }
//   }
// }

// function draw(){
//   if (isGameover) return;

//   // isRunning = true;

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   drawBricks();
//   drawBall();
//   drawPaddle();
//   collisionDetection();

//   if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius){
//     ball.dx = -ball.dx;
//   }
//   if(ball.y + ball.dy < ball.radius){
//     ball.dy = -ball.dy;
//   } else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height - 10){
//     if (ball.x > paddle.x && ball.x < paddle.x + paddle.width){
//       ball.dy = -ball.dy;
//     }else{
//       gameOver();
//       return;
//     }
//   }

//   ball.x += ball.dx;
//   ball.y += ball.dy;

//   if(rightPressed && paddle.x < canvas.width - paddle.width){
//     paddle.x += 7;
//   }else if (leftPressed && paddle.x > 0){
//     paddle.x -= 7;
//   }
//   requestAnimationFrame(draw);
// }

// function start(){
//   // if(!isRunning) return;
//   if (isGameover){
//     init();
//   }
//   // isGameover = false;
//   // gameover.style.display = "none";
//   draw();
// }

// // function stop(){
// //   isGameover = true;
// //   document.location.reload();
// // }

// function gameOver(){
//   isGameover = true;
//   gameover.style.display = "block";
//   // isRunning = false;
// }

// function checkWin(){
//   for(let c=0; c<brickColumnCount; c++){
//     for(let r=0; r<brickRowCount; r++){
//       if(bricks[c][r].status === 1){
//         return false;
//       }
//     }
//   }
//   return true;
// }

// function youwin(){  
//   isGameover = true;
//   // isRunning = false;
//   document.getElementById("win").style.display = "block";

// }

const canvas = document.getElementById("canvas");
const cvs = canvas.getContext("2d");

let ball, paddle, bricks;
let rPressed = false;
let lPressed = false;
let isGameover = false;

const brickRows = 5;
const brickCols = 10;
const brickWidth = 68;
const brickHeight = 20;
const brickPadding = 2;
const brickTop = 30;
const brickLeft = 0;

function init() {
  ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 4,
    dy: -4,
    radius: 8,
    speed: 10
  };

  paddle = {
    height: 10,
    width: canvas.width / 6,
    x: (canvas.width - canvas.width/6) /2
  };

  const rowColors = ['red', 'yellow', 'green', 'blue', 'purple'];

  bricks = [];
  for (let c = 0; c < brickCols; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRows; r++) {
      const color = rowColors[r % rowColors.length]; // 줄마다 색 고정
      const points = color === 'red' ? 40 : color === 'blue' ? 30 : color === 'yellow' ? 20 : color === 'green' ? 10 : 5;
      bricks[c][r] = { x: 0, y: 0, status: 1, color: color, points: points };
    }
  }

  isGameover = false;
  document.getElementById("gameover").style.display = "none";
  document.getElementById("win").style.display = "none";
}


init();

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
document.getElementById("startBtn").addEventListener("click", start);

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    lPressed = true;
  }
}

function keyUp(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    lPressed = false;
  }
}

function collisionCheck() {
  for (let c = 0; c < brickCols; c++) {
    for (let r = 0; r < brickRows; r++) {
      const b = bricks[c][r];

      if (b.status === 1) {
        if (
          ball.x > b.x && ball.x < b.x + brickWidth &&
          ball.y > b.y && ball.y < b.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = 0;

          if (checkWin()) {
            win();
          }
        }
      }
    }
  }
}

function drawBall() {
  cvs.beginPath();
  cvs.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  cvs.fillStyle = "red";
  cvs.fill();
  cvs.closePath();
}

function drawPaddle() {
  cvs.beginPath();
  cvs.rect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
  cvs.fillStyle = "black";
  cvs.fill();
  cvs.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickCols; c++) {
    for (let r = 0; r < brickRows; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickLeft;
        const brickY = r * (brickHeight + brickPadding) + brickTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        cvs.beginPath();
        cvs.rect(brickX, brickY, brickWidth, brickHeight);
        cvs.fillStyle = bricks[c][r].color;
        cvs.fill();
        cvs.closePath();
      }
    }
  }
}

function draw() {
  if (isGameover) return;

  cvs.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  collisionCheck();

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height - 10) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else {
      gameOver();
      return;
    }
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (rPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7;
  } else if (lPressed && paddle.x > 0) {
    paddle.x -= 7;
  }

  requestAnimationFrame(draw);
}

function start() {
  if (isGameover) {
    init();
  }
  draw();
}

function gameOver() {
  isGameover = true;
  document.getElementById("gameover").style.display = "block";
}

function checkWin() {
  for (let c = 0; c < brickCols; c++) {
    for (let r = 0; r < brickRows; r++) {
      if (bricks[c][r].status === 1) {
        return false;
      }
    }
  }
  return true;
}

function win() {
  isGameover = true;
  document.getElementById("win").style.display = "block";
}

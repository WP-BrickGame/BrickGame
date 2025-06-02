const canvas = document.getElementById("canvas");
const cvs = canvas.getContext("2d");

const ballImage = new Image();
ballImage.src = "Shaved Ice/icon/ball.png";

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
    radius: 8
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
      const color = rowColors[r % rowColors.length];

      //재료마다 점수 조정할 때 사용하면 좋을 거 같음
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

// 블럭 겉면에서 부딪히는게 아님...
// function collisionCheck() {
//   for (let c = 0; c < brickCols; c++) {
//     for (let r = 0; r < brickRows; r++) {
//       const b = bricks[c][r];

//       if (b.status === 1) {
//         if (
//           ball.x > b.x && ball.x < b.x + brickWidth &&
//           ball.y > b.y && ball.y < b.y + brickHeight
//         ) {
//           ball.dy = -ball.dy;
//           b.status = 0;

//           if (checkWin()) {
//             win();
//           }
//         }
//       }
//     }
//   }
// }


//gpt
function collisionCheck() {
  for (let c = 0; c < brickCols; c++) {
    for (let r = 0; r < brickRows; r++) {
      const b = bricks[c][r];

      if (b.status === 1) {
        // 블럭의 좌표와 크기
        const brickX = b.x;
        const brickY = b.y;

        // 공과 블럭의 충돌 여부를 원-사각형 충돌 방식으로 체크
        // 1) 공의 중심과 가장 가까운 블럭 좌표 계산
        let closestX = Math.max(brickX, Math.min(ball.x, brickX + brickWidth));
        let closestY = Math.max(brickY, Math.min(ball.y, brickY + brickHeight));

        // 2) 공 중심과 가장 가까운 점 사이 거리 계산
        let distX = ball.x - closestX;
        let distY = ball.y - closestY;
        let distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < ball.radius) {
          // 충돌 발생

          // 공의 이전 위치 기준으로 충돌 면 판단
          // 이전 공 위치
          let prevX = ball.x - ball.dx;
          let prevY = ball.y - ball.dy;

          // 공이 수평 면에 부딪혔는지 (좌우)
          if (prevX < brickX || prevX > brickX + brickWidth) {
            ball.dx = -ball.dx;
          }

          // 공이 수직 면에 부딪혔는지 (위아래)
          if (prevY < brickY || prevY > brickY + brickHeight) {
            ball.dy = -ball.dy;
          }

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
  const imgSize = ball.radius * 2; // 지름 기준 크기
  cvs.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, imgSize, imgSize);
}

// function drawBall() {
//   cvs.beginPath();
//   cvs.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
//   cvs.fillStyle = "red";
//   cvs.fill();
//   cvs.closePath();
// }

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

  // 벽과의 충돌 처리
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  }

  // 바닥과의 충돌 및 패들 충돌 처리
  else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height - 10) {
    const paddleTop = canvas.height - paddle.height - 10;
    const paddleBottom = canvas.height - 10;
    const paddleLeft = paddle.x;
    const paddleRight = paddle.x + paddle.width;

    const nextX = ball.x + ball.dx;
    const nextY = ball.y + ball.dy;

    // 패들과 충돌한 경우
    if (
      nextY + ball.radius >= paddleTop &&
      nextY + ball.radius <= paddleBottom &&
      nextX > paddleLeft &&
      nextX < paddleRight
    ) {
      ball.dy = -Math.abs(ball.dy); // 위쪽으로 튕기기
    }
    // 패들과 충돌하지 못하고 바닥에 닿은 경우
    else if (nextY + ball.radius > canvas.height) {
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
  document.getElementById("startBtn").style.display = "none";
  draw();
}

function gameOver() {
  isGameover = true;
  document.getElementById("gameover").style.display = "block";
  document.getElementById("startBtn").style.display = "block";
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
  document.getElementById("startBtn").style.display = "block";
}

function showMenu(menuClass) {
    document.querySelectorAll('.menu').forEach(menu => menu.style.display = 'none'); //모든 버튼창 안보이게
    document.querySelector('.main_page').style.display = 'none'; //홈화면 안보이게
    document.querySelector(menuClass).style.display = 'block'; //선택 창만 보이게
}

function goBackHome() {
    document.querySelectorAll('.menu').forEach(menu => menu.style.display = 'none'); //모든 메뉴 숨기기
    document.querySelector('.main_page').style.display = 'block'; //홈화면 보이기
}

function goToLevel1() {
  document.querySelector('.Start').style.display = 'none';
  document.querySelector('.game').style.display = 'block';

  document.getElementById("startBtn").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const sizeSlider = document.getElementById("sizeRange");
  const sizeOutput = document.getElementById("size-output");

  const speedSlider = document.getElementById("speedRange");
  const speedOutput = document.getElementById("speed-output");

  const ballIcon = document.querySelector(".ball-icon");

  function applySize(value) {
    sizeOutput.textContent = value;
    const radius = parseInt(value);
    if (ball) ball.radius = radius;
    if (ballIcon) {
      ballIcon.style.width = radius * 2 + "px";
      ballIcon.style.height = radius * 2 + "px";
    }
  }

  function applySpeed(value) {
    speedOutput.textContent = value;
    const speed = parseInt(value);
    if (ball) {
      const angle = Math.atan2(ball.dy, ball.dx);
      ball.dx = speed * Math.cos(angle);
      ball.dy = -Math.abs(speed * Math.sin(angle)); // 항상 위로
    }
  }

  applySize(sizeSlider.value);
  applySpeed(speedSlider.value);

  sizeSlider.addEventListener("input", () => applySize(sizeSlider.value));
  speedSlider.addEventListener("input", () => applySpeed(speedSlider.value));

  // start 오버라이드
  const originalStart = start;
  start = function () {
    applySize(sizeSlider.value);
    applySpeed(speedSlider.value);
    originalStart();
  };
});

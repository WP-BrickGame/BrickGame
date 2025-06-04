// 사용자 선택
var ballSize = 1;

// 목숨
let life = 3;

// 돈
let money = 0;

// 현재 주문
var order;

var ingIdx = 0;

// 캔버스
const canvas = document.getElementById("canvas");
const cvs = canvas.getContext("2d");

let ball, paddle, bricks;
let brickImgs;
let menu;

let rPressed = false;
let lPressed = false;
let isGameover = false;

const brickRows = 10;
const brickCols = 10;
const brickWidth = 68;
const brickHeight = 30;
const brickPadding = 2;
const brickTop = 30;
const brickLeft = 0;

const ImgPath = '../../../imgs/'
const brickPath = ImgPath + 'brick/';
const pngPath = ImgPath + 'png/'
const imgExt = '.png'
const ingredients = ['none', 'ice', 'icecream_van', 'icecream_tea', 
                    'mango', 'strawberry', 'greentea',
                    'sirup_milk', 'sirup_str', 'sirup_man',
                    ];

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

      let imgIdx = Math.floor(Math.random()*10)
      //재료마다 점수 조정할 때 사용하면 좋을 거 같음
      const points = color === 'red' ? 40 : color === 'blue' ? 30 : color === 'yellow' ? 20 : color === 'green' ? 10 : 5;
      bricks[c][r] = { x: 0, y: 0, status: 1, color: color, points: points, imgIdx: imgIdx, ingredient: ingredients[imgIdx] };
    }
  }

  brickImgs = ingredients.map( name => {
      const img = new Image();
      img.src = brickPath + name + imgExt;
      return img;
    }
  )

  menu = [
    {
      name: 'redbean',
      ingredient: ['ice', 'redbean', 'sirup_milk'],
      cost: 100
    },
    {
      name: 'injeolmi',
      ingredient: ['ice', 'injeolmi', 'sirup_milk'],
      cost: 100
    },
    {
      name: 'choco',
      ingredient: ['ice', 'icecream_cho', 'sirup_choco'],
      cost: 100
    },
    {
      name: 'strawberry',
      ingredient: ['ice', 'icecream_van', 'strawberry', 'sirup_str'],
      cost: 100
    },
    {
      name: 'mango',
      ingredient: ['ice', 'icecream_van', 'mango', 'sirup_man'],
      cost: 100
    },
    {
      name: 'greentea',
      ingredient: ['ice', 'icecream_tea', 'greentea', 'sirup_milk'],
      cost: 100
    }
  ];

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

          // checkMenu(b);
          b.status = 0;

          if (checkWin()) {
            win();
          }
        }
      }
    }
  }
}

const ballImg = new Image();
ballImg.src = ImgPath + 'icon/ball.PNG';

function drawBall() {
  if (ballImg.complete) {
    // 이미지 중심이 ball.x, ball.y가 되도록 조정
    cvs.drawImage(
      ballImg,
      ball.x - ball.radius,
      ball.y - ball.radius,
      ball.radius * 2 * ballSize,
      ball.radius * 2 * ballSize
    );
  } else {
    // 이미지가 아직 로딩되지 않았을 경우 fallback으로 빨간 원 그리기
    cvs.beginPath();
    cvs.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    cvs.fillStyle = "blue";
    cvs.fill();
    cvs.closePath();
  }
}

const paddleImg = new Image();
paddleImg.src = ImgPath + 'icon/paddle.png';

function drawPaddle() {
  if (paddleImg.complete) {
    cvs.drawImage(
      paddleImg,
      paddle.x,
      canvas.height - paddle.height - 10,
      paddle.width,
      paddle.height
    );
  }
  else {
    cvs.beginPath();
    cvs.rect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
    cvs.fillStyle = "rgb(91,162,209)";
    cvs.fill();
    cvs.closePath();
  }
}

function drawBricks() {
  for (let c = 0; c < brickCols; c++) {
    for (let r = 0; r < brickRows; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickLeft;
        const brickY = r * (brickHeight + brickPadding) + brickTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        cvs.drawImage(
          brickImgs[bricks[c][r].imgIdx],
          bricks[c][r].x,
          bricks[c][r].y,
          brickWidth,
          brickHeight
        )
      }
    }
  }
}

function draw() {
  cvs.clearRect(0, 0, canvas.width, canvas.height);

  drawLife()
  drawMoney()
  drawBricks();
  drawBall();
  drawPaddle();
  collisionCheck();

  if (isGameover) return;     // 남은 하트 한 개 없애려고 여기로 옮김

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
      if (isGameover) {
        drawLife();
        return;
      }
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
  if (--life != 0) {
    isGameover = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    paddle.x = (canvas.width - canvas.width/6) /2
    return;
  }
  console.log('life' + life);
  draw();       // 왜 남은 하트 한 개 안 없어짐? ㅇㅎ
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

function newMenu() {
  order = Math.floor(Math.random()*6);
}

function checkMenu(brick) {
  if (brick.ingredient == menu[order].ingredient[ingIdx]) {
    ingIdx++;
  }
  if (ingIdx == 4) {
    ingIdx = 0;
    money += menu[order].cost;
    newMenu();
  }
}

const lifeImg = new Image();
lifeImg.src = ImgPath + 'icon/heart.PNG';

const moneyImg = new Image();
moneyImg.src = ImgPath + 'icon/money.PNG';

function drawLife() {
  const iconSize = 30; // 아이콘 크기 (가로세로)
  const spacing = 5;   // 각 아이콘 간 간격

  for (let i = 0; i < life; i++) {
    cvs.drawImage(
      lifeImg,
      i * (iconSize + spacing),
      0,
      iconSize,
      iconSize
    );
  }
}

function drawMoney() {
  const iconSize = 25; // 아이콘 크기 (가로세로)

  cvs.drawImage(
    moneyImg,
    600,
    0,
    iconSize * 2,
    iconSize
  )
  cvs.fillStyle = "black";
  cvs.font = "18px 'Gothic A1'";
  cvs.fillText(money, canvas.width - 30, 20);
}
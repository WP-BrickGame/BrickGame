// 사용자 선택
var ballSize = 1;
var ballSpeed = 4;

// 패들 속도
var paddleSpeed = 12;

// 목숨
let life = 3;

// 돈
let money = 0;

// 현재 주문 메뉴
var order;
let matchedIngredients = new Set();

var ingNum = 0;

// 캔버스
const canvas = document.getElementById("canvas");
const cvs = canvas.getContext("2d");

let ball, paddle, bricks;
let brickImgs;
let menu;
let menu_korean;

let gameStarted = false;
let rPressed = false;
let lPressed = false;
let isGameover = false;

const topSpace = 120;

const brickRows = 4;
const brickCols = 14;
const brickWidth = 68 * 1.7;
const brickHeight = 30 * 1.7;
const brickPadding = 2;
const brickTop = 55;
const brickLeft = brickWidth * 0.2;

const heartSize = 50;
const moneySize = 50;
const iconSpacing = 15;

const barSize = 900;

let topBrickImg = null;
let topBrickTimer = null;

const ImgPath = '../../../imgs/';
const itemPath = '../../../imgs/png/';
const brickPath = ImgPath + 'brick/';
const pngPath = ImgPath + 'png/';
const imgExt = '.png';

const ingredients = ['none', 'ice', 'icecream_van', 'icecream_tea', 
                    'mango', 'strawberry', 'greentea',
                    'sirup_milk', 'sirup_str', 'sirup_man',
                    ];

const ingredientNoNone = ['ice', 'icecream_van', 'icecream_tea', 
                          'mango', 'strawberry', 'greentea',
                          'sirup_milk', 'sirup_str', 'sirup_man',
                           ];

const backgroundImg = new Image();
backgroundImg.src = ImgPath + 'background.png';

const ballImg = new Image();
ballImg.src = ImgPath + 'icon/ball.PNG';

const paddleImg = new Image();
paddleImg.src = ImgPath + 'icon/paddle.png';

const lifeImg = new Image();
lifeImg.src = ImgPath + 'icon/heart.PNG';

const moneyImg = new Image();
moneyImg.src = ImgPath + 'icon/money.PNG';

brickImgs = ingredients.map( name => {
    const img = new Image();
    img.src = brickPath + name + imgExt;
    return img;
  }
)

itemImgs = ingredientNoNone.map( name => {
  const img = new Image();
  img.src = itemPath + name + imgExt;
  return img;
}
)

menu = [
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

menu_korean = [
  {
    name: '딸기빙수',
    ingredient: ['얼음', '바닐라아이스크림', '딸기', '딸기시럽'],
    cost: 100
  },
  {
    name: '망고빙수',
    ingredient: ['얼음', '바닐라아이스크림', '망고', '망고시럽'],
    cost: 100
  },
  {
    name: '녹차빙수',
    ingredient: ['얼음', '녹차아이스크림', '녹찻잎', '연유'],
    cost: 100
  }
];

// 처음 로드할 때, 창 크기 변경할 때 캔버스 크기 조절
window.addEventListener("load", () => {
  resizeCanvas()
});
window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth - 1;
  canvas.height = window.innerHeight - 1;

  paddle.width = canvas.width / 7,

  drawBackground();
}

window.onload = () => {
  run();
};

function run() {
  init();             // init() 안 해줬어서 첫 실행이 이상했음!
  drawFullBackground();

  cvs.fillStyle = 'black';
  cvs.font = "72px 'Gothic A1'";
  cvs.textAlign = "center";
  cvs.textBaseline = "middle";

  cvs.fillText('Level 2', canvas.width / 2, canvas.height / 2)

  setTimeout(() => {
    drawFullBackground();
    startCount();
  }, 1000)

  function startCount() {
    let y = drawStartPage();

    i = 3;
    const countdown = setInterval(() => {
      drawFullBackground();
      drawStartPage();
      drawCountDown(i--, y);

      if (i < 0) clearInterval(countdown);
    }, 1000);

    setTimeout(()=>{
      drawFullBackground();

      cvs.fillStyle = 'black';
      cvs.font = "40px 'Gothic A1'";
      cvs.textAlign = "center";
      cvs.textBaseline = "middle";

      cvs.fillText('Start !', canvas.width / 2, canvas.height / 2);
    }, 4000);

    setTimeout(()=>{
      start();
    }, 5000);
  }
}

function init() {
  const urlParams = new URLSearchParams(window.location.search);
  ballSize = parseInt(urlParams.get('size'), 10) / 10 || 1;
  ballSpeed = parseInt(urlParams.get('speed'), 10) || 4;

  ball = {
    x: canvas.width / 2,
    y: canvas.height - 30 * ballSize,
    dx: ballSpeed,
    dy: -ballSpeed,
    radius: 8 * ballSize
  };

  paddle = {
    height: 15,
    width: canvas.width / 7,
    x: canvas.width / 2
  };

  bricks = [];
  initBricks();

  isGameover = false;

  document.getElementById("gameover").style.display = "none";
  document.getElementById("win").style.display = "none";

  newMenu();
}

function initBricks() {
  for (let c = 0; c < brickCols; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRows; r++) {
      let imgIdx = Math.floor(Math.random()*ingredients.length);
      bricks[c][r] = { x: 0, y: 0, status: 1, imgIdx: imgIdx, ingredient: ingredients[imgIdx] };
    }
  }
}

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

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

          checkMenu(b);
          b.status = 0;
          console.log(b.ingredient+"닿음");
          console.log(matchedIngredients);

          showTopBrick(itemImgs[b.imgIdx-1]); //닿은 블록의 이미지를 전달

          if (checkBrickClear()) {
            // win();
            initBricks();
            drawBricks();
          }
        }
      }
    }
  }
}

function draw() {
  cvs.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawLife();
  drawMenu();
  drawMoney();
  drawBricks();
  drawBall();
  drawPaddle();
  collisionCheck();
  if(topBrickImg){
    const topX = canvas.width / 2 - brickWidth / 2;
    const topY = 120; // 화면 상단 위치
    cvs.drawImage(topBrickImg, topX, topY, 80, 80);
  }
  if (isGameover) return;     // 남은 하트 한 개 없애려고 여기로 옮김

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius + topSpace) {
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
    paddle.x += paddleSpeed;
  } else if (lPressed && paddle.x > 0) {
    paddle.x -= paddleSpeed;
  }

  requestAnimationFrame(draw);
}

function start() {
  gameStarted = true;
  life = 3;
  if (isGameover) init();
  draw();
}

function gameOver() {
  console.log('게임오버 호출')
  isGameover = true;
  if (--life != 0) {
    console.log('life' + life);
    isGameover = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30 * ballSize;
    paddle.x = (canvas.width - canvas.width/6) /2
    return;
  }
  draw();       
  document.getElementById("gameover").style.display = "block";
  document.getElementById("gameover").style.width = canvas.width - topSpace/2 + 'px';
  document.getElementById("gameover").style.height = canvas.height - topSpace/2 + 'px';
  gameStarted = false;
  $('#gameover .score').text('Score: ' + money);
}

function checkBrickClear() {
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
  document.getElementById("win").style.width = canvas.width - topSpace/2 + 'px';
  document.getElementById("win").style.height = canvas.height - topSpace/2 + 'px';
}

function newMenu() {
  order = Math.floor(Math.random()*menu.length);
  matchedIngredients.clear();
  console.log(menu[order]);
  console.log(menu[order].ingredient);
}

function checkMenu(brick) {
  //현재 메뉴의 재료 배열
  const ingredients = menu[order].ingredient;

  if(ingredients.includes(brick.ingredient) && !matchedIngredients.has(brick.ingredient)){
    matchedIngredients.add(brick.ingredient);
  }
  if(matchedIngredients.size === ingredients.length){
    money += menu[order].cost;
    newMenu();
  }
}

function showTopBrick(img){
  topBrickImg = img;
  if (topBrickTimer) clearTimeout(topBrickTimer);
  topBrickTimer = setTimeout(() => {
    topBrickImg = null;
    topBrickTimer = null;
  }, 1000);
}

function drawBall() {
  if (ballImg.complete) {
    // 이미지 중심이 ball.x, ball.y가 되도록 조정
    cvs.drawImage(
      ballImg,
      ball.x - ball.radius,
      ball.y - ball.radius,
      ball.radius * 2,
      ball.radius * 2
    );
  } else {
    // 이미지가 아직 로딩되지 않았을 경우 fallback으로 파란 원 그리기
    cvs.beginPath();
    cvs.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    cvs.fillStyle = "blue";
    cvs.fill();
    cvs.closePath();
  }
}

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
        const brickY = r * (brickHeight + brickPadding) + topSpace + 12.5;
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

function drawLife() {
  for (let i = 0; i < life; i++) {
    cvs.drawImage(
      lifeImg,
      i * (heartSize + iconSpacing) + iconSpacing,
      10,
      heartSize,
      heartSize
    );
  }
}

function drawMoney() {
  cvs.drawImage(
    moneyImg,
    canvas.width - moneySize * 5,
    10,
    moneySize * 2,
    moneySize
  )
  cvs.fillStyle = "black";
  cvs.font = "45px 'Noto Sans KR'";
  cvs.fillText(money, canvas.width - moneySize * 2.5, moneySize);
}

function drawMenu() {
  const { name, ingredient } = menu_korean[order];
  const ingText = ingredient.join('  +  ');
  const menuText = `${name}  :  ${ingText}`;

  cvs.strokeStyle = 'black';     // 테두리 색
  cvs.lineWidth = 1;           // 테두리 두께

  const barX = canvas.width / 2 - barSize / 2;
  const barY = 10;

  const barWidth = barSize;
  const barHeight = barSize / 18;

  cvs.strokeRect(barX, barY, barWidth, barHeight);   // 테두리만 있는 직사각형 그리기 (x, y, width, height)
  
  cvs.fillStyle = "black";
  cvs.font = "32px 'Noto Sans KR'";
  cvs.textAlign = "center";
  cvs.textBaseline = "middle";

  const textX = canvas.width / 2;
  const textY = barY + barHeight / 2;

  cvs.fillText(menuText, textX, textY);

  let startX = barX + (barWidth - cvs.measureText(menuText).width) / 2;
  drawMenuIcon(startX, barY, barHeight);
}

function drawMenuIcon(startX, barY, barHeight) {
  const iconX = startX + cvs.measureText(menu_korean[order].name + ' : ').width;
  const iconY = barY * 4 + barHeight / 2;

  menu[order].ingredient.forEach( (element, index) => {
    if (matchedIngredients.has(element)) {
      const imgIdx = ingredientNoNone.indexOf(element);
      const icon = itemImgs[imgIdx];
      var padding = 0;
      for (let i=0; i<index; i++) {
        padding += cvs.measureText(menu_korean[order].ingredient[i] + ' + ').width;
        padding += 10;
      }
      padding += cvs.measureText(menu_korean[order].ingredient[index]).width / 2;
      cvs.drawImage(icon, iconX + padding, iconY, 40, 40);
    }
  }
  )
}

function drawBackground() {
  cvs.drawImage(
    backgroundImg,
    0,
    topSpace,
    canvas.width,
    canvas.height - topSpace
  );
}

function drawFullBackground() {
  cvs.drawImage(
    backgroundImg,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

function drawStartPage() {
  const { name, ingredient } = menu_korean[order];
  const ingText = ingredient.join('  +  ');
  const menuText = `${name}  :  ${ingText}`;

  cvs.strokeStyle = 'black';     // 테두리 색
  cvs.lineWidth = 1;           // 테두리 두께

  const barWidth = barSize * 1.5;
  const barHeight = barSize / 18 * 1.5;

  const barX = canvas.width / 2 - barWidth / 2;
  const barY = canvas.height / 2 - barHeight / 2;

  cvs.strokeRect(barX, barY, barWidth, barHeight);   // 테두리만 있는 직사각형 그리기 (x, y, width, height)
  
  cvs.fillStyle = "black";
  cvs.font = "40px 'Noto Sans KR'";
  cvs.textAlign = "center";
  cvs.textBaseline = "middle";

  const textX = canvas.width / 2;
  const textY = barY + barHeight / 2;

  cvs.fillText(menuText, textX, textY);

  return barY - 40;
}

function drawCountDown(n, t_y) {
  cvs.fillStyle = "black";
  cvs.font = "40px 'Gothic A1'";
  cvs.textAlign = "center";
  cvs.textBaseline = "middle";

  const textX = canvas.width / 2;
  const textY = t_y;

  cvs.fillText(n, textX, textY);
}
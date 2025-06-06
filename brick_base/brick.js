const ballImage = new Image();
ballImage.src = "../imgs/icon/ball.png";

let ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 4,
  dy: -4,
  radius: 8
};

function showMenu(menuClass) {
    document.querySelectorAll('.menu').forEach(menu => menu.style.display = 'none'); //모든 버튼창 안보이게
    document.querySelector('.main_page').style.display = 'none'; //홈화면 안보이게
    document.querySelector(menuClass).style.display = 'block'; //선택 창만 보이게
}

function goBackHome() {
    document.querySelectorAll('.menu').forEach(menu => menu.style.display = 'none'); //모든 메뉴 숨기기
    document.querySelector('.main_page').style.display = 'block'; //홈화면 보이기
}

function goToLevel1(size, speed) {
  location.href=`./levels/level1/level1.html?size=${size}&speed=${speed}`;
}

function goToLevel2(size, speed) {
  location.href=`./levels/level2/level2.html?size=${size}&speed=${speed}`;
}

function goToLevel3(size, speed) {
  location.href=`./levels/level3/level3.html?size=${size}&speed=${speed}`;
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

  //배경음악 -> 브라우저 정책 위반.? 으로 안됨.
  // const bgm = document.getElementById("main-bgm");
  // bgm.play();

  // 배경음악 재생
  const bgm = document.getElementById("main-bgm");
  const bgmCheck = document.getElementById("bgm-check");

  bgmCheck.addEventListener("change", () =>{
    if(bgmCheck.checked){
      bgm.muted = false;
      bgm.play();
    } else{
      bgm.pause();
    }
  });

  //버튼 클릭 시 효과음 재생
  const buttonSound = document.getElementById("button-sound");

  document.querySelectorAll("button, .level-btn, .back-button").forEach(btn => {
    btn.addEventListener("click", () => {
      buttonSound.currentTime = 0;
      buttonSound.play();
    });
  });

});

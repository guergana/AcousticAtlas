// var target = new Nexus.Slider('#target',{
// 'size': [120,20],
// 'mode': 'relative',  // Hihgpass
// 'min': 0,
// 'max': 150,
// 'step': 1,
// 'value': 0
// });

var target2 = new Nexus.Slider("#target2", {
  size: [120, 10],
  mode: "relative", // Dry wet
  min: 0,
  max: 1,
  step: 0.02,
  value: 1
});

target2.colorize("accent", "#666");

// var toggle = new Nexus.Toggle("#toggle", {
//   size: [60, 10],
//   state: false
// });

//toggle.colorize("accent", "#666");

// var toggle2 = new Nexus.Toggle("#toggle2", {
//   size: [60, 10],
//   state: false
// });

// toggle2.colorize("accent", "#666");

//////////////// ACTIONS ON INPUT

// target.on('change',function(v) {

// filt1.frequency.value = v;
// filterDisp.innerHTML = " Highpass filter " + v +"Hz";
// });

target2.on("change", function(v) {
  convolver.wet.value = v;
  conv.innerHTML = " Dry/Wet " + Math.round(v * 100) + "%";
});

// toggle.on("change", function(v) {
//   console.log(v);
//   if (v) {
//     player.start();
//     player.volume.setValueAtTime(-22, 2);
//     Ambient1.innerHTML = "Ambient s1 On";
//   } else {
//     player.stop();
//     player.volume.setValueAtTime(-Infinity, 4);
//     Ambient1.innerHTML = "Ambient 1 off";
//   }
// });

// toggle2.on("change", function(v) {
//   console.log(v);
//   if (v) {
//     player2.start();
//     player2.volume.setValueAtTime(-22, 2);
//     Ambient2.innerHTML = "Ambient 2 On";
//   } else {
//     player2.stop();
//     player.volume.setValueAtTime(-Infinity, 4);
//     Ambient2.innerHTML = "Ambient 2 off";
//   }
// });

const closeImageBtn = document.querySelector("#image-container .close");
closeImageBtn.onclick = function() {
  const container = document.getElementsByClassName("panel-right")[0];
  container.style.display = "none";
  const containerMap = document.getElementsByClassName("panel-left")[0];
  containerMap.style.height = "100vh";
};

let fullscreenOn = false;

let fullscreenButton = document.querySelector("#image-container .fullscreen");
fullscreenButton.addEventListener(
  "click",
  function(event) {
    // if (!fullscreenOn) {
    //   document.querySelector(".panel-right").requestFullscreen();
    //   fullscreenOn = true;
    // } else {
    //   document.exitFullscreen();
    //   fullscreenOn = false;
    // }
    if (!fullscreenOn) {
      const elem = document.querySelector("#image-container");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
      fullscreenOn = true;
    } else {
      document.exitFullscreen();
      fullscreenOn = false;
    }
  },
  false
);

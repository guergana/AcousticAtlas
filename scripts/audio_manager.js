/// TO DO . TAG BUTTONS  -- FADE MASTER OUT WHEN CHANGE --
// ADD GLOBAL CSS FONT & COLORS
//create an audio context 2019

// TODO :
// - LOAD MUTED and replace mute button with icon
// - Fade out Buttons when in use

const muteBT = document.getElementById("muteB");
const infoDisplay = document.getElementById("placeName");

const imageContainer = document.getElementById("image-container");
const infoContainer = document.querySelectorAll(".info-container span");

Tone.context.latencyHint = "interactive"; // try substituting - balanced - performance - interactive
Tone.Master.mute = true;
///// AUDIO ELEMENTS Convolver - EQ - GAIN - MIC_INPUT
const convolver = new Tone.Convolver().toMaster();

const filt1 = new Tone.Filter({
  type: "highpass",
  frequency: 80,
  rolloff: -48,
  Q: 1,
  gain: 0
}).connect(convolver);

const mic_eq = new Tone.EQ3({
  low: 0,
  mid: -3,
  high: -2,
  lowFrequency: 100,
  highFrequency: 5000
}).connect(filt1);

const meter = new Tone.Meter();

const mic_mixer = new Tone.Gain(0.7).connect(mic_eq);
const mic = new Tone.UserMedia().connect(mic_mixer);

mic_mixer.connect(meter);

//opening the input asks the user to activate their mic
mic.open().then(function() {
  document.getElementById("start").innerHTML = "Mic Active";
  document.getElementById("hint").innerHTML = "";
  logMicVolume();
});

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

//animate according to mic input volume
const logMicVolume = function() {
  const micLevel = meter.getLevel();
  const {
    MIC_IN_MIN = -90,
    MIC_IN_MAX = 0,
    MIC_OUT_MIN = 0.2,
    MIC_OUT_MAX = 1
  } = window.CONFIG;

  const mappedMicLevel = micLevel.map(
    MIC_IN_MIN,
    MIC_IN_MAX,
    MIC_OUT_MIN,
    MIC_OUT_MAX
  );
  const imageContainer = document.querySelector("#image-container");
  imageContainer.style.opacity = mappedMicLevel;
  //console.log("micLevel.map(-100, 0, 0, 100)", mappedMicLevel);
  //setInterval(logMicVolume, 700);
  requestAnimationFrame(logMicVolume);
};

/*** start audio context ***/

document.addEventListener(
  "click",
  function(e) {
    Tone.context.resume();
  },
  false
);

let mutetState = true;

let icon = muteBT.getElementsByTagName("i")[0];
icon.className = "fas fa-microphone-alt-slash";
// if(mutedState) {

// };

muteBT.addEventListener(
  "click",
  function() {
    if (mutetState === true) {
      icon.className = "fas fa-microphone-alt-slash";
    } else {
      icon.className = "fas fa-microphone-alt";
    }

    Tone.Master.mute = !Tone.Master.mute;
    mutetState = !mutetState;
  },
  false
);

function loadIr(ir) {
  convolver.load(ir).then(function() {
    Tone.Master.mute = false;
    icon.className = "fas fa-microphone-alt";
  });
}

//this is for the controls at the top

function loadAmbient1(sound) {
  player.load(sound).then(function() {
    Tone.Master.mute = false;
    icon.className = "fas fa-microphone-alt";
  });
}

function loadAmbient2(sound) {
  player.load(sound).then(function() {
    Tone.Master.mute = false;
    icon.className = "fas fa-microphone-alt";
  });
}

const player = new Tone.Player("./audios/1.mp3").toMaster();
const player2 = new Tone.Player("./audios2/2.mp3").toMaster();

player.autostart = false;
player.loop = false;
player.volume.value = -2; // Volume of the ambience
player2.autostart = false;
player2.loop = false;
player2.volume.value = -2;

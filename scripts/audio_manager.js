/// TO DO . TAG BUTTONS  -- FADE MASTER OUT WHEN CHANGE --
// ADD GLOBAL CSS FONT & COLORS
//create an audio context 2019

// TODO : 
    // - LOAD MUTED and replace mute button with icon
    // - Fade out Buttons when in use

    const muteBT = document.getElementById('muteB');
    const infoDisplay = document.getElementById('placeName');
    
    const imageContainer = document.getElementById('image-container');
    const infoContainer = document.querySelectorAll('.info-container span');
    
    Tone.context.latencyHint = 'interactive';  // try substituting - balanced - performance - interactive
    Tone.Master.mute = true;
                                                            ///// AUDIO ELEMENTS Convolver - EQ - GAIN - MIC_INPUT
    const convolver = new Tone.Convolver().toMaster();
    
    const filt1 = new Tone.Filter({
        type : "highpass" ,
        frequency : 80 ,
        rolloff : -48 ,
        Q : 1 ,
        gain : 0
        }).connect(convolver);
    
    const mic_eq = new Tone.EQ3({
        low  : 0 ,
        mid  : -3 ,
        high  : -2 ,
        lowFrequency  : 100 ,
        highFrequency  : 5000
        }).connect(filt1);
    
    const mic_mixer = new Tone.Gain(0.7).connect(mic_eq);
    const mic = new Tone.UserMedia().connect(mic_mixer);
    
                                                            //opening the input asks the user to activate their mic
    mic.open().then(function () {
        document.getElementById("start").innerHTML = "Mic Active";
        document.getElementById("hint").innerHTML = "";
    });
    
    /*** start audio context ***/
    
    document.addEventListener('click', function (e) {
        Tone.context.resume();
    }, false);
    
    let mutetState = true;
    
    let icon = muteBT.getElementsByTagName('i')[0];
    icon.className = 'fas fa-microphone-alt-slash';
    // if(mutedState) {
        
    // };
    
    muteBT.addEventListener('click', function () {
        if (mutetState === true) {
            icon.className = 'fas fa-microphone-alt-slash';
        } else {
            icon.className = 'fas fa-microphone-alt';
        }
        
        Tone.Master.mute = !Tone.Master.mute;
        mutetState = !mutetState;
    
    }, false);
    
    function loadIr(ir){
        
        convolver.load(ir).then(function () {
        Tone.Master.mute = false;
        icon.className = 'fas fa-microphone-alt';
        });
    }
    
    //this is for the controls at the top
    
    const player = new Tone.Player("./audios/capevidal.mp3").toMaster();
    const player2 = new Tone.Player("./audios/spin.mp3").toMaster();
    
    player.autostart = false;
    player.loop = true;
    player.volume.value = -18;  // Volume of the ambience
    player2.autostart = false;
    player2.loop = true;
    player2.volume.value = -18; 
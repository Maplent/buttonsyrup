// all sounds made here so there are no audio files

let audioCtx = null;
let muted = false;

try { muted = localStorage.getItem('bs-muted') === '1'; } catch (e) {}

function isMuted() {return muted;}
function setMuted(on) {
    muted = on;
    try { localStorage.setItem('bs-muted', on ? '1' : '0'); } catch (e) {}
}

// for some reason browsers only let audio start after a click so the context is made with 1 braincell
function audio() {
    if (muted) return null;
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return null;
        }
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function tone(from, to, dur, type, vol, delay = 0) {
    const a = audio();
    if (!a) return;

    const t = a.currentTime + delay;
    const osc = a.createOscillator();
    const gain = a.createGain();

    osc.type = type;

    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + dur);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(.001, t + dur);

    osc.connect(gain).connect(a.destination);
    osc.start(t);
    osc.stop(t + dur + .02);
}

// white noise, good for yummy fx :DDD
function noise(dur, freq, vol, delay = 0) {
    const a = audio();
    if (!a) return;

    const t = a.currentTime + delay;
    const len = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const data = buf.getChannelData(0);

    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    const src = a.createBufferSource();
    const filter = a.createBiquadFilter();
    const gain = a.createGain();

    src.buffer = buf;

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(60, freq / 6), t + dur);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(.001, t + dur);

    src.connect(filter).connect(gain).connect(a.destination);
    src.start(t);
}

const sfx = {
    press() {
        tone(520, 150, .16, 'sine', .3);
        noise(.25, 900, .18, .03);
    },

    squeak() {
        tone(900, 1500, .08, 'triangle', .12);
        tone(1500, 800, .1, 'triangle', .12, .08);
    },

    clink() {
        tone(2400, 2100, .18, 'sine', .12);
        tone(3300, 3000, .12, 'sine', .06);
    },

    smash() {
        noise(.45, 6000, .25);
        tone(2600, 900, .3, 'triangle', .06);
    },

    flop() {
        noise(.12, 500, .3);
        tone(180, 80, .12, 'sine', .2);
    },

    tick() {
        tone(800, 600, .05, 'square', .05);
    },

    flood() {
        noise(1.6, 700, .22);
        tone(200, 55, 1.4, 'sawtooth', .06);
    },

    win() {
        [523, 659, 784, 1046].forEach((f, i) => tone(f, f * 1.01, .18, 'triangle', .1, i * .12));
    }
};
// one button, one very stressed syrup bottle... I HATEEEEEEEE HATE HATEEE THIS CODE :SOB::SOB::SOB:

const $ = s => document.querySelector(s);
const stage = $('#stage'), spot = $('#spot'), btn = $('#btn'), bottle = $('#bottle'), extras = $('#extras');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const wave = 'M0 10' + ' q30 -8 60 0 q30 8 60 0'.repeat(20);

$('#waveLine').setAttribute('d', wave);
$('#waveFill').setAttribute('d', wave + ' V20 H0 Z');

// empty brow paths just hide the eyebrows
const MOODS = {
    calm: {m: 'M52 88 Q56 93 60 88 Q64 93 68 88', l: '', r: ''},
    smug: {m: 'M52 88 Q56 93 60 88 Q64 93 68 88', l: 'M39 64 Q45 62 51 64', r: 'M69 63 Q75 59 81 62'},
    pout: {m: 'M55 92 Q60 87 65 92', l: 'M39 62 L51 66', r: 'M69 66 L81 62'},
    panic: {m: 'M56 89 Q60 85 64 89 Q64 94 60 94 Q56 94 56 89 Z', l: '', r: ''},
    sad: {m: 'M54 93 Q60 88 66 93', l: 'M39 66 L51 62', r: 'M69 62 L81 66'},
    happy: {m: 'M51 86 Q60 99 69 86 Z', l: '', r: ''}
};

const STAGES = [
    {id: 'intro', mood: 'calm', line: "hi hi! this is my button :3 please don't press it, okay?"},
    {id: 'again', mood: 'pout', line: "hey!! you pressed it >:( okay... just don't do it again"},
    {id: 'hop', mood: 'smug', line: "i taught it how to run away :P catch it if you can~"},
    {id: 'dome', mood: 'smug', line: "i put it under the cake dome :3 it's super safe in there", setup: addDome},
    {id: 'tiny', mood: 'calm', line: "i made it teeny tiny :3 good luck finding it~", setup: () => place('62%', null, .38)},
    {id: 'decoy', mood: 'smug', line: "only one of these is the real one :D the other two are pretend", setup: addDecoys},
    {id: 'stack', mood: 'happy', line: "pancake time! :D i stacked them right on top of the button~", setup: addStack},
    {id: 'hold', mood: 'panic', line: "new rule: you have to hold it down for a looong time. nobody's that patient :3"},
    {id: 'dare', mood: 'smug', line: "okay fine. press it 15 times. bet you can't :P", setup: () => { S.left = 15; $('#badge').textContent = 15; }},
    {id: 'last', mood: 'panic', line: "this is the last one. if you press it, the whole diner floods. please please please >_<", setup: () => place('60%', null, 1.3)}
];
const HOP = ["missed! hehe :D", "too slooow~", "it's really fast :3", "oh no, it's getting sleepy..."];
const DOME = ["hey! no tapping the glass >_<", "that's my favorite dome!!", "stoppp ;-;", "it's cracking aaaa"];
const CRACKS = ['M50 6 L44 30 L52 42 L46 62', 'M46 62 L30 72 L22 90', 'M52 42 L70 52 L78 74', 'M44 30 L24 34 L12 54'];
const FAKE = ["hehe that one's fake :P", "fake again! i'm so sneaky :3"];
const IDLE = ["still not pressing it? good job :D", "i can tell you're thinking about it >_>", "you're doing great, just keep not pressing it :3", "it's a pretty boring button anyway~"];
const PATIENT = [[12, "...you're really not pressing it? :o", 'calm'], [24, "aww, that's so nice of you :3", 'happy'], [36, "wait, is this a trick? o_o", 'pout']];

const S = {stage: 0, presses: 0, started: Date.now(), lastAct: Date.now(), ended: false, hops: 0, hits: 0, left: 0, fakes: 0, idleSaid: 0};

// bottle dialogue gets typed out one letter at a time
let typer = 0;
function say(text, mood) {
    if (mood) setMood(mood);
    $('#srLine').textContent = text;
    const el = $('#line');
    clearInterval(typer);
    if (reduce) { el.textContent = text; return; }
    let i = 0;
    el.textContent = '';
    typer = setInterval(() => {
        i++;
        el.textContent = text.slice(0, i);
        if (i >= text.length) clearInterval(typer);
    }, 22);
}

function setMood(name) {
    const m = MOODS[name];
    const mouth = $('#mouth');
    bottle.dataset.mood = name;
    mouth.setAttribute('d', m.m);
    mouth.style.fill = m.m.endsWith('Z') ? 'var(--ink)' : 'none';
    $('#browL').setAttribute('d', m.l);
    $('#browR').setAttribute('d', m.r);
}

function burst(kind, n, el = btn) {
    if (reduce) return;
    const r = el.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const x = r.left + r.width / 2 - sr.left, y = r.top + r.height * .35 - sr.top;
    for (let i = 0; i < n; i++) {
        const d = document.createElement('span');
        d.className = kind;
        d.style.left = x + 'px';
        d.style.top = y + 'px';
        d.style.setProperty('--dx', Math.round(Math.random() * 180 - 90) + 'px');
        d.style.setProperty('--up', Math.round(-40 - Math.random() * 70) + 'px');
        stage.append(d);
        setTimeout(() => d.remove(), 900);
    }
}
function shake() {
    if (reduce) return;
    stage.classList.remove('shake');
    void stage.offsetWidth;
    stage.classList.add('shake');
}
function buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
function squish() {
    btn.classList.add('down');
    setTimeout(() => btn.classList.remove('down'), 110);
}

function renderMeta() {
    $('#stageNo').textContent = `Stage ${Math.min(S.stage + 1, 10)} of 10`;
    $('#pressCount').textContent = S.presses === 1 ? '1 press' : `${S.presses} presses`;
}

function hit() {
    S.presses++;
    S.lastAct = Date.now();
    renderMeta();
    sfx.press(); squish(); burst('drop', 7); shake(); buzz(25);
}

function place(x, y, s = 1) {
    spot.style.setProperty('--x', x);
    if (y) spot.style.setProperty('--y', y); else spot.style.removeProperty('--y');
    spot.style.setProperty('--s', s);
}

function clearStage() {
    stopHold(false);
    extras.innerHTML = '';
    spot.querySelectorAll('.dome, .stack').forEach(e => e.remove());
    btn.disabled = false;
    btn.classList.remove('flat');
    btn.setAttribute('aria-label', "The button. Please don't press it.");
    spot.style.setProperty('--p', 0);
    place('62%');
}

function enter(i) {
    S.stage = i; S.hops = 0; S.hits = 0; S.fakes = 0; S.idleSaid = 0;
    clearStage();
    stage.style.setProperty('--lvl', (5 + i * 3.5) + '%');
    renderMeta();
    const st = STAGES[i];
    spot.dataset.mode = st.id;
    say(st.line, st.mood);
    if (st.setup) st.setup();
}

function advance() {
    if (S.stage < STAGES.length - 1) enter(S.stage + 1);
}

function hop() {
    const x = 34 + Math.random() * 52;
    const y = 32 + Math.random() * 16;
    place(x.toFixed(1) + '%', `calc(${y.toFixed(1)}% + 14px)`);
}

function addDome() {
    const d = document.createElement('button');
    d.className = 'dome';
    d.type = 'button';
    d.setAttribute('aria-label', 'Glass cake dome over the button. Tap it to crack it.');
    d.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>';
    spot.append(d);
    btn.disabled = true;
    d.addEventListener('click', () => hitDome(d));
}

function hitDome(d) {
    S.lastAct = Date.now();
    S.hits++;
    if (S.hits <= CRACKS.length) {
        d.querySelector('svg').insertAdjacentHTML('beforeend', `<path d="${CRACKS[S.hits - 1]}"/>`);
        sfx.clink(); buzz(10);
        d.classList.remove('hit'); void d.offsetWidth; d.classList.add('hit');
        say(DOME[S.hits - 1], S.hits > 2 ? 'panic' : 'pout');
        return;
    }
    sfx.smash(); burst('shard', 10, d); shake(); buzz(40);
    d.classList.add('smash');
    d.disabled = true;
    setTimeout(() => d.remove(), 500);
    btn.disabled = false;
    btn.focus({preventScroll: true});
    say("...okay, maybe not that safe ;-;", 'sad');
}

function addDecoys() {
    const xs = [36, 62, 87].sort(() => Math.random() - .5);
    place(xs[0] + '%', null, .72);
    btn.setAttribute('aria-label', 'A button. Maybe the real one.');
    for (const x of xs.slice(1)) {
        const s = document.createElement('div');
        s.className = 'spot';
        s.style.setProperty('--x', x + '%');
        s.style.setProperty('--s', .72);
        s.innerHTML = '<button class="big" type="button" aria-label="A button. Maybe the real one."><span class="cap"></span></button>';
        extras.append(s);
        s.firstChild.addEventListener('click', e => fake(e.currentTarget));
    }
}

function fake(b) {
    S.lastAct = Date.now();
    b.classList.add('flat');
    b.disabled = true;
    sfx.squeak(); buzz(10);
    say(FAKE[Math.min(S.fakes, FAKE.length - 1)], 'smug');
    S.fakes++;
}

function addStack() {
    const s = document.createElement('button');
    s.className = 'stack';
    s.type = 'button';
    s.innerHTML = Array.from({length: 6}, (_, i) =>
        `<span class="cake" style="--i:${i};--r:${(Math.random() * 6 - 3).toFixed(1)}deg"></span>`).join('');
    spot.append(s);
    btn.disabled = true;
    labelStack(s, 6);
    s.addEventListener('click', () => eat(s));
}
function labelStack(s, n) {
    s.setAttribute('aria-label', `Pancake stack on the button, ${n} left. Tap to knock one off.`);
}
function eat(s) {
    S.lastAct = Date.now();
    const cakes = s.querySelectorAll('.cake:not(.fly)');
    const top = cakes[cakes.length - 1];
    if (!top) return;
    top.style.setProperty('--dx', (Math.random() < .5 ? -1 : 1) * Math.round(120 + Math.random() * 140) + 'px');
    top.style.setProperty('--dr', Math.round(Math.random() * 500 - 250) + 'deg');
    top.classList.add('fly');
    sfx.flop(); buzz(8);
    setTimeout(() => top.remove(), 600);
    const left = cakes.length - 1;
    labelStack(s, left);
    if (left === 3) say("those were fresh pancakes ;-;", 'sad');
    if (left === 0) {
        s.disabled = true;
        setTimeout(() => s.remove(), 600);
        btn.disabled = false;
        btn.focus({preventScroll: true});
        say("you knocked them all off... poor pancakes ;-;", 'sad');
    }
}

let holdRaf = 0, holdStart = 0;
function startHold(e) {
    if (STAGES[S.stage].id !== 'hold' || S.ended || holdStart) return;
    if (e.type === 'keydown') {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        e.preventDefault();
        if (e.repeat) return;
    }
    holdStart = performance.now();
    btn.classList.add('down');
    S.lastAct = Date.now();
    sfx.tick();
    say("nonono let go >_<", 'panic');
    const loop = t => {
        const p = Math.min(1, (t - holdStart) / 2400);
        spot.style.setProperty('--p', p.toFixed(3));
        if (p >= 1) {
        holdStart = 0;
        btn.classList.remove('down');
        hit();
        advance();
        return;
        }
        holdRaf = requestAnimationFrame(loop);
    };
    holdRaf = requestAnimationFrame(loop);
}
function stopHold(byPlayer) {
    if (!holdStart) return;
    cancelAnimationFrame(holdRaf);
    holdStart = 0;
    btn.classList.remove('down');
    spot.style.setProperty('--p', 0);
    if (byPlayer) say("hehe, you let go :D", 'smug');
}

function flood() {
    S.ended = true;
    btn.disabled = true;
    stage.classList.add('flooded');
    bottle.classList.add('float');
    say("oh nooo >_<", 'panic');
    sfx.flood(); buzz([40, 60, 80]);
    setTimeout(() => say("...wait, this is actually kind of cozy :3", 'happy'), 1600);
    setTimeout(() => showEnd('flood'), 2600);
}

function clock(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function showEnd(kind) {
    const time = clock(Date.now() - S.started);
    const flood = kind === 'flood';
    $('#endTitle').textContent = flood ? 'You flooded the diner :D' : "You didn't press it :3";
    $('#endText').textContent = flood
        ? "Everything is sticky now, but the bottle seems pretty happy floating around."
        : "Nobody has ever done that before. The bottle is really proud of you.";
    const stats = flood
        ? [['Presses', S.presses], ['Time', time], ['Stages', '10 of 10']]
        : [['Presses', 0], ['Waited', time]];
    $('#endStats').innerHTML = stats.map(() => '<div><dt></dt><dd></dd></div>').join('');
    $('#endStats').querySelectorAll('div').forEach((d, i) => {
        d.querySelector('dt').textContent = stats[i][0];
        d.querySelector('dd').textContent = stats[i][1];
    });
    $('#again').textContent = flood ? 'Clean up and play again' : 'Okay, now press it :D';
    $('#end').hidden = false;
    $('#again').focus({preventScroll: true});
}

function restart() {
    $('#end').hidden = true;
    stage.classList.remove('flooded');
    bottle.classList.remove('float');
    S.presses = 0;
    S.started = Date.now();
    S.lastAct = Date.now();
    S.ended = false;
    enter(0);
    btn.focus({preventScroll: true});
}

btn.addEventListener('click', () => {
    if (S.ended) return;
    const id = STAGES[S.stage].id;
    if (id === 'hold') return;
    if (id === 'hop' && S.hops < HOP.length) {
        S.presses++;
        S.lastAct = Date.now();
        renderMeta();
        sfx.squeak(); squish();
        say(HOP[S.hops], 'smug');
        S.hops++;
        hop();
        return;
    }
    if (id === 'dare') {
        hit();
        S.left--;
        $('#badge').textContent = S.left;
        if (S.left === 10) say("wait... hold on", 'pout');
        if (S.left === 5) say("oh no, this is what you wanted the whole time ;-;", 'sad');
        if (S.left <= 0) advance();
        return;
    }
    if (id === 'last') { hit(); flood(); return; }
    hit();
    advance();
});
btn.addEventListener('pointerdown', startHold);
btn.addEventListener('keydown', startHold);
['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => stopHold(true)));
btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stopHold(true); });
btn.addEventListener('contextmenu', e => e.preventDefault());

$('#again').addEventListener('click', restart);

const muteBtn = $('#mute');
function renderMute() {
    muteBtn.textContent = isMuted() ? 'Sound: off' : 'Sound: on';
    muteBtn.setAttribute('aria-pressed', String(isMuted()));
}
muteBtn.addEventListener('click', () => {
    setMuted(!isMuted());
    renderMute();
});
renderMute();

// idle check taunts if you wait and the secret ending if you never press
setInterval(() => {
    if (S.ended) return;
    const idle = (Date.now() - S.lastAct) / 1000;
    if (S.stage === 0 && S.presses === 0) {
        const next = PATIENT[S.idleSaid];
        if (next && idle >= next[0]) { say(next[1], next[2]); S.idleSaid++; }
        if (idle >= 48) {
        S.ended = true;
        btn.disabled = true;
        sfx.win();
        showEnd('good');
        }
        return;
    }
    if (idle >= 11 && S.idleSaid === 0 && !holdStart) {
        S.idleSaid = 1;
        say(IDLE[Math.floor(Math.random() * IDLE.length)], 'smug');
    }
}, 1000);

enter(0);
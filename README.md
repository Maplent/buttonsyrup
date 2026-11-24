## Button Syrup
A big red button sits on a diner counter, and a nervous bottle of maple syrup really, really doesn't want you to press it...

PLAY IT HERE!!! https://maplent.github.io/buttonsyrup

## What the button does
> SPOILERS AHEAD!!! This part gives the game away ;D

Each press makes the bottle of syrup crankier and the syrup in the diner rises a little! There are 10 stages and the bottle tries something new in each one. The bottle runs away, gets locked under a glass cake dome you have to crack, shrinks, hides between two fake buttons, gets buried under a stack of pancakes, and then has to be held down for a couple of seconds!!! After that the bottle of syrup dares you to press it 15 times (reverse psychology that obviously wont work xd), then the last press floods the whole diner!!!!

> theres also a secret ending if you just.... dont press it. wait on the first screen for a bit and see what happens!

## Why press it
because someone told you not to! thats basically just the whole game xD

## How its built
Its all just plain painful HTML/CSS and JS with no framework and no building... the `index.html` has the scene, the `style.css` has the styling (obv), `sound.js` makes all the sound effects because i didnt use audio files, and `game.js` carries basically the entire game code and runs the stages! the bottle is hand-written inline svg and its face changes by swapping the mouth and eyebrow paths (*ew*). The button is a literal `<button>` so it works with *Tab*, *Enter*, and *Space*, and the hold stage works by holding *space* too! All of the sound effects (boop, glass clinks, flood) are make on the fly with Web Audio API so there are no audio files like i said before. I also added a little thing where phones get a little vibration on each press, and if your computer/phone has reduced motion turned on, the shaking and flying pancakes are switched off!

## Running it yourself!
alright, this is gonna be SUPPPPERRR hard. Clone the repo, and open `index.html` in a browser. that was hard, right? To host it, just push the repo to GitHub (or just make a fork...), go to *Settings > Pages*, pick the `main` branch and save! github will give you a public link in a few minutes like this: https://maplent.github.io/buttonsyrup

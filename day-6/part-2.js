// problem https://adventofcode.com/2021/day/6

const fs = require('fs');

const main = async () => {
  const inputFile = fs.readFileSync('./input.txt');
  const initialState = inputFile.toString().split(',').map(Number);
  let newGenerationCount = 0;
  let population = 0;
  let fishCountByTimerTick = [0, 0, 0, 0, 0, 0, 0, 0, 0];     // stores how much fish there is in in each time tick, from 0 (the was who will create a new generation) to 9 (the newborns). The newborns start at 9 because thei don't decrease the tick at first, only after the second day of life.

  initialState.forEach(tick => fishCountByTimerTick[tick]++); // initialize the counters with the tickers received as input

  for (let i = 0; i < 256; i++) {
    fishCountByTimerTick[7] += fishCountByTimerTick[0];       // everyone that hits the 0 tick will restart with the timer at 6. Here, it goes to 7 because we still need to decrease the tickers, so they go with the ones currently at 7.
    newGenerationCount = fishCountByTimerTick.shift();        // decreases the ticker of everyone and gets the ones who was at 0.
    fishCountByTimerTick.push(newGenerationCount);            // warps the ones who hit 0 to the end (tick 9), creating a new generation.
  }

  population = fishCountByTimerTick.reduce((countAcc, currCount) => countAcc + currCount); // in the end, sums how much fish there is in each tick.
  console.log(population);
}

main();
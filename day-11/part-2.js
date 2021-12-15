// problem https://adventofcode.com/2021/day/11

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let energyLevels = [];
  let lines, cols;
  let inSync = false;
  let step = 0;

  energyLevels = await parseIinput();
  lines = energyLevels.length;
  cols = energyLevels[0].length;

  console.log('Before any steps:');
  printOctopuses(energyLevels, lines, cols);

  while (!inSync) {
    let flashesThisStep = new Set(); // item: i,j
    energyLevels = increaseEnergy(energyLevels);

    for (let i = 0; i < lines; i++) {
      for (let j = 0; j < cols; j++) {
        if (energyLevels[i][j] > 9) {
          performFlash(flashesThisStep, [i, j], energyLevels, lines, cols);
        }
      }
    }

    inSync = flashesThisStep.size === 100;

    if (inSync) {
      console.log(`After step ${step + 1}:`);
      printOctopuses(energyLevels, lines, cols);
    }

    step++;
  }

  console.log(step);
}

const parseIinput = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  const energyLevels = [];

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    let heigths = line.split('').map(Number);
    energyLevels.push(heigths);
  }

  return energyLevels;
};

const increaseEnergy = (energyLevels) => {
  return energyLevels.map(line => line.map(e => e + 1));
};

const performFlash = (flashesThisStep, [i, j], energyLevels, lines, cols) => {
  if (energyLevels[i][j] <= 9 || flashesThisStep.has(`${i},${j}`)) {
    return;
  }

  flashesThisStep.add(`${i},${j}`);
  energyLevels[i][j] = 0;
  
  let adjacencies = getAdjacencyIndexes([i, j], lines, cols);

  adjacencies.filter(([line, col]) => !flashesThisStep.has(`${line},${col}`))
    .forEach(([line, col]) => energyLevels[line][col]++);

  adjacencies.forEach(coordinate => performFlash(flashesThisStep, coordinate, energyLevels, lines, cols));
};

const getAdjacencyIndexes = ([currLine, currCol], lines, cols) => {
  const left = currCol - 1;
  const right = currCol + 1;
  const up = currLine - 1;
  const down = currLine + 1;

  const upLeft = [up, left];
  const upRight = [up, right];
  const downLeft = [down, left];
  const downRight = [down, right];

  let adjacencies = [];

  if (!(left < 0)) {
    adjacencies.push([currLine, left]);
  }

  if (!(right >= cols)) {
    adjacencies.push([currLine, right]);
  }

  if (!(up < 0)) {
    adjacencies.push([up, currCol]);
  }

  if (!(down >= lines)) {
    adjacencies.push([down, currCol]);
  }

  // diagonals
  if (!((up < 0) || (left < 0))) {
    adjacencies.push(upLeft);
  }

  if (!((up < 0) || (right >= cols))) {
    adjacencies.push(upRight);
  }

  if (!((down >= lines) || (left < 0))) {
    adjacencies.push(downLeft);
  }

  if (!((down >= lines) || (right >= cols))) {
    adjacencies.push(downRight);
  }

  return adjacencies;
}

const printOctopuses = (energyLevels, lines, cols) => {
  for (let i = 0; i < lines; i++) {
    for (let j = 0; j < cols; j++) {
      process.stdout.write(`${energyLevels[i][j]}${energyLevels[i][j] === 0 ? '* ' : '  '}`);
    }

    process.stdout.write('\n');
  }
}

main();
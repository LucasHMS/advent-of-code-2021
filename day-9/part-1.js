// problem https://adventofcode.com/2021/day/9

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let heightmap = [];
  let lines, cols;
  let totalRisk = 0;

  heightmap = await parseIinput();
  lines = heightmap.length;
  cols = heightmap[0].length;

  for (let i = 0; i < lines; i++) {
    for (let j = 0; j < cols; j++) {
      let adjacencies = getAdjacencyIndexes([i, j], lines, cols);
      let isLowPoint = checkIfLowPoint(heightmap, adjacencies, heightmap[i][j]);
      if (isLowPoint) {
        totalRisk += (heightmap[i][j] + 1);
      }
      // process.stdout.write(`${heightmap[i][j]}${isLowPoint ? '* ' : '  '}`);
    }
    // process.stdout.write('\n');
  }
  console.log(totalRisk);
}

const parseIinput = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  const heightmap = [];

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    let heigths = line.split('').map(Number);
    heightmap.push(heigths);
  }

  return heightmap;
};

const getAdjacencyIndexes = ([currLine, currCol], lines, cols) => {
  const left = currCol - 1;
  const right = currCol + 1;
  const up = currLine - 1;
  const down = currLine + 1;
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

  return adjacencies;
}

const checkIfLowPoint = (heightmap, adjacencies, currHeight) => {
  return !adjacencies.some(([line, col]) => currHeight >= heightmap[line][col]);
}

main();
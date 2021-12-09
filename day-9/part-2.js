// problem https://adventofcode.com/2021/day/9

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let heightmap = [];
  let lines, cols;
  let basinSizes = [];

  heightmap = await parseIinput();
  lines = heightmap.length;
  cols = heightmap[0].length;

  for (let i = 0; i < lines; i++) {
    for (let j = 0; j < cols; j++) {
      let basin = new Set();
      let adjacencies = getAdjacencyIndexes([i, j], lines, cols);
      let isLowPoint = checkIfLowPoint(heightmap, adjacencies, heightmap[i][j]);

      if (isLowPoint) {
        fillBasin(basin, [i, j], heightmap, lines, cols);
        basinSizes.push(basin.size);
      }
    }
  }

  let sortedBasinSizes = basinSizes.sort((a, b) => a > b ? -1 : 1);
  console.log(sortedBasinSizes[0] * sortedBasinSizes[1] * sortedBasinSizes[2]);
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

const fillBasin = (basin, [pointLine, pointCol], heightmap, lines, cols) => {
  // checks if coordinate is either a border (height 9) or already is part of the basin
  if (heightmap[pointLine][pointCol] === 9 || basin.has(`${pointLine},${pointCol}`)) {
    return basin;
  }

  basin.add(`${pointLine},${pointCol}`);
  let adjacencies = getAdjacencyIndexes([pointLine, pointCol], lines, cols);

  // fill the adjacencies of the current point
  adjacencies.forEach(coordinate => fillBasin(basin, coordinate, heightmap, lines, cols));
}

main();
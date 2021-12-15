// problem https://adventofcode.com/2021/day/12

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let caveSystem = {};
  let pathCounter = 0;

  caveSystem = await parseIinput();

  pathCounter = followPath('start', caveSystem, {}, [], 0);

  console.log(pathCounter);
}

const parseIinput = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  const caveSystem = {};

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    let [from, to] = line.split('-');

    if (to === 'start' || from === 'end') {
      let tmp = to;
      to = from;
      from = tmp;
    }

    if (!caveSystem[from]) {
      caveSystem[from] = new Set();
    }
    caveSystem[from].add(to);

    if (from === 'start') {
      continue;
    }

    if (!caveSystem[to]) {
      caveSystem[to] = new Set();
    }
    caveSystem[to].add(from);
  }

  return caveSystem;
};

const followPath = (currentCave, caveSystem, visitedSmallCaves, currentPath, pathCounter) => {
  if (currentCave === 'end') {
    // console.log(`start,${currentPath.join(',')}`);
    return ++pathCounter;
  }

  if (isSmallCave(currentCave)) {
    visitedSmallCaves[currentCave] = true;
  }

  for (cave of caveSystem[currentCave]) {
    if (!visitedSmallCaves[cave]) {
      currentPath.push(cave);

      pathCounter = followPath(cave, caveSystem, visitedSmallCaves, currentPath, pathCounter);

      currentPath.pop();
    }
  }

  visitedSmallCaves[currentCave] = false;

  return pathCounter;
};

const isSmallCave = (cave) => {
  if (['start', 'end'].includes(cave)) {
    return false;
  }
  return cave === cave.toLowerCase();
}


main();
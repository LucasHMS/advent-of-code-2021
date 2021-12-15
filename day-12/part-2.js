// problem https://adventofcode.com/2021/day/12

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let caveSystem = {};
  let pathCounter = 0;

  caveSystem = await parseIinput();

  pathCounter = followPath('start', caveSystem, [], 0, false);

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

const followPath = (currentCave, caveSystem, currentPath, pathCounter, visitedTwice) => {
  currentPath.push(currentCave);

  if (currentCave === 'end') {
    // console.log(`${currentPath.join(',')}`);
    return ++pathCounter;
  }

  for (cave of caveSystem[currentCave]) {
    if (isSmallCave(cave) && currentPath.includes(cave)) {
      if (visitedTwice) {
        continue;
      }

      if (currentPath.filter(c => c === cave).length >= 2) {
        continue;
      }

      pathCounter = followPath(cave, caveSystem, currentPath, pathCounter, true);
      currentPath.pop();

    } else {
      pathCounter = followPath(cave, caveSystem, currentPath, pathCounter, visitedTwice);
      currentPath.pop();
    }
  }

  return pathCounter;
};

const isSmallCave = (cave) => {
  if (['start', 'end'].includes(cave)) {
    return false;
  }
  return cave === cave.toLowerCase();
}

main();
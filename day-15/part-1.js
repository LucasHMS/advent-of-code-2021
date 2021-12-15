// problem https://adventofcode.com/2021/day/15

const fs = require('fs');
const readline = require('readline');
const PriorityQueue = require('./prority-queue.js');

const main = async () => {
  let caveMap = [];
  let graph = {};
  let startCave, endCave;
  let safestRouteRisk = 0;

  console.time('input parse');
  caveMap = await parseIinput();
  console.timeEnd('input parse');

  startCave = makePointId(0, 0);
  endCave = makePointId(caveMap.length - 1, caveMap[0].length - 1);

  console.time('graph building');
  graph = buildGraph(caveMap);
  console.timeEnd('graph building');

  // caveMap.forEach(l => console.log(l.join('')));

  console.time('dijkstra run');
  safestRouteRisk = dijkstra(graph, startCave, endCave)
  console.timeEnd('dijkstra run');

  console.log('safestRouteRisk:', safestRouteRisk);
}

const parseIinput = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  const caveMap = [];

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    let risks = line.split('').map(Number);
    caveMap.push(risks);
  }

  return caveMap;
};

const buildGraph = (caveMap) => {
  let lines, cols;
  let graph = {};

  lines = caveMap.length;
  cols = caveMap[0].length;

  for (let i = 0; i < lines; i++) {
    for (let j = 0; j < cols; j++) {
      let adjacencies = getAdjacencyIndexes([i, j], lines, cols);
      let currVertex = makePointId(i, j);
      let edges = {};

      if (currVertex !== makePointId(lines - 1, cols - 1)) {
        adjacencies.forEach(([a, b]) => {
          edges[makePointId(a, b)] = caveMap[a][b]
        });
      }

      graph[currVertex] = edges;
    }
  }

  return graph;
}

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

const makePointId = (i, j) => {
  return `${i},${j}`;
}

const dijkstra = function (graph, startCave, goalCave) {
  let riskOfCaves = {};
  Object.keys(graph).forEach(cave => riskOfCaves[cave] = Number.MAX_VALUE);
  riskOfCaves[startCave] = 0;

  // Prority based on the risk so far for each cave. Less risk = more prority.
  let pq = new PriorityQueue((a, b) => a[1] < b[1]);
  pq.push([startCave, 0]);

  let visitedCaves = new Set();

  while (!pq.isEmpty()) {
    let [currCave,] = pq.pop();

    if (!visitedCaves.has(currCave)) {
      visitedCaves.add(currCave);

      for (let neighborCave in graph[currCave]) {
        if (riskOfCaves[currCave] + graph[currCave][neighborCave] < riskOfCaves[neighborCave]) {
          riskOfCaves[neighborCave] = riskOfCaves[currCave] + graph[currCave][neighborCave];
          pq.push([neighborCave, riskOfCaves[neighborCave]]);
        }
      }
    }
  }

  return riskOfCaves[goalCave];
};

main();
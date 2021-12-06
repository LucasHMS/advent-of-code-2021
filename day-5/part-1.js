// problem https://adventofcode.com/2021/day/5

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let ventLines = [];
  let ventsMap = new Map();
  let count = 0;

  const coordinates = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  ventLines = await parseInputData(coordinates);

  for (line of ventLines) {
    let [[x1, y1], [x2, y2]] = line;
    let [newX, newY] = [x1, y1];
    let horizontalIncrement = x1 < x2 ? 1 : -1;
    let verticalIncrement = y1 < y2 ? 1 : -1;
    let isHorizontal = false;
    let isVertical = false;

    if (x1 === x2) { // vertical
      isVertical = true;
    } else if (y1 === y2) { // horizontal
      isHorizontal = true;
    }

    while (newX !== x2 || newY !== y2) {
      plotPoint(ventsMap, newX, newY);

      if (isVertical) {
        newY += verticalIncrement;
      } else if (isHorizontal) {
        newX += horizontalIncrement;
      }
    }

    plotPoint(ventsMap, x2, y2);
  }
  
  count = Array.from(ventsMap.values()).filter((count) => count > 1).length;

  console.log(count);
}

const plotPoint = (ventsMap, x, y) => {
  let concatPoint = `${x},${y}`;
  let pointCount = ventsMap.get(concatPoint)
  
  if (!pointCount) {
    pointCount = 0;
  }

  pointCount++;
  ventsMap.set(concatPoint, pointCount);

  return ventsMap;
}

const parseInputData = async (coordinates) => {
  let ventLines = [];
  for await (let line of coordinates) {
    let [[x1, y1], [x2, y2]] = line.split(" -> ").map(p => p.split(','));

    if (x1 === x2 || y1 === y2) { // filter the diagonal segments
      let lineSegment = [[+x1, +y1], [+x2, +y2]];
      ventLines.push(lineSegment);
    }

  }

  return ventLines;
}

main();

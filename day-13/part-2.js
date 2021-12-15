// problem https://adventofcode.com/2021/day/13

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let paper = [];
  let folds = [];

  [paper, folds] = await parseIinput();

  for (const [axis, position] of folds) {
    if (axis === 'y') {
      let topHalf = paper.slice(0, position);
      let downHalf = paper.slice(position + 1).reverse();

      paper = foldPaper(topHalf, downHalf);
    } else {
      let leftHalf = [];
      let rightHalf = [];

      paper.forEach((line) => {
        leftHalf.push(line.slice(0, position));
        rightHalf.push(line.slice(position + 1).reverse());
      });

      paper = foldPaper(leftHalf, rightHalf);
    }
  }

  paper.forEach((line, i) => console.log(line.join(' ')));
}

const parseIinput = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let paper = [];
  let folds = [];
  let dotPositions = [];
  let nCols = 0;
  let nLines = 0;

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    if (line == '') {
      continue;
    }

    if (line.startsWith('fold')) {
      let [axis, position] = line.match(/[xy]=[0-9]+/g).join('').split('=');
      position = +position;

      folds.push([axis, position]);

      if (axis === 'x') {
        nCols = Math.max(nCols, position * 2 + 1);
      } else {
        nLines = Math.max(nLines, position * 2 + 1);
      }
    } else {
      let [x, y] = line.split(',').map(Number);
      dotPositions.push([x, y]);
    }
  }

  paper = new Array(nLines).fill().map(() => new Array(nCols).fill('.'));

  dotPositions.forEach(([col, line]) => {
    paper[line][col] = '#';
  });

  return [paper, folds];
};

const foldPaper = (half1, half2) => {
  return half2.map((line, i) => {
    return line.map((dot, j) => {
      if (dot === '#') {
        return '#';
      } else {
        return half1[i][j];
      }
    });
  });
};

main();
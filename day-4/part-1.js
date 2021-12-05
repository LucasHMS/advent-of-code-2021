// problem https://adventofcode.com/2021/day/4

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let numberSet = [];
  let boardSet = [];
  let boardMarksSet = [];
  let winningScore = 0;

  const bingoInput = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  [numberSet, boardSet, boardMarksSet] = await parseInputData(bingoInput, numberSet, boardSet, boardMarksSet);

  for (let drawnNumber of numberSet) {
    let boardIdx = 0
    for (let board of boardSet) {
      checkAndMarkBoard(board, boardMarksSet, boardIdx, drawnNumber);

      if (boardWon(boardMarksSet[boardIdx])) {
        winningScore = calculateScore(board, boardMarksSet[boardIdx], drawnNumber);
        break;
      }

      boardIdx++;
    }

    if (winningScore > 0) {
      break;
    }

  }

  console.log(winningScore);
}

const parseInputData = async (bingoInput, numberSet, boardSet, boardMarksSet) => {
  let boardIdx = -1;

  return await new Promise((resolve) => {
    bingoInput.once('line', async (data) => {
      data.split(',').forEach((number) => {
        numberSet.push(+number);
      });

      for await (let boardRow of bingoInput) {
        if (boardRow === '') {
          boardIdx++;
          boardSet[boardIdx] = [];
          boardMarksSet[boardIdx] = [];
          continue;
        }

        let row = [];
        let markerRow = []
        boardRow.split(' ')
          .filter(line => line !== '')
          .forEach(number => {
            row.push(+number);
            markerRow.push(0);
          });

        boardSet[boardIdx].push(row);
        boardMarksSet[boardIdx].push(markerRow);
      }

      resolve([numberSet, boardSet, boardMarksSet]);
    });
  });
}

const checkAndMarkBoard = (board, boardMarksSet, boardIdx, drawnNumber) => {
  let numberIdxToMark = -1;
  let rowIdx = 0;

  for (let boardRow of board) {
    numberIdxToMark = boardRow.findIndex((number) => number === drawnNumber);

    if (numberIdxToMark >= 0) {
      boardMarksSet[boardIdx][rowIdx][numberIdxToMark] = 1;
      break;
    }

    rowIdx++;
  }
}

const boardWon = (boardMark) => {
  for (rowMarks of boardMark) {
    let completeRow = rowMarks.reduce((v1, v2) => v1 * v2);

    if (completeRow) {
      return true;
    }
  }

  let transposedMarks = boardMark[0].map((_, i) => boardMark.map(row => row[i]));
  for (colMarks of transposedMarks) {
    let completeRow = colMarks.reduce((v1, v2) => v1 * v2);

    if (completeRow) {
      return true;
    }
  }

  return false;
}

const calculateScore = (board, boardMark, drawnNumber) => {
  let rowIdx = 0;
  let unMarkedSum = 0;

  for (currentRow of board) {
    let numberIdx = 0;
    let rowSum = 0;
    for (currentNumber of currentRow) {
      rowSum += currentNumber * ((boardMark[rowIdx][numberIdx] - 1) * -1);
      numberIdx++;
    }

    unMarkedSum += rowSum
    rowIdx++;
  }

  return unMarkedSum * drawnNumber;
}

main();
// problem https://adventofcode.com/2021/day/10

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  const openingChars = ['(', '[', '{', '<'];
  const charPairs = { '(': ')', '[': ']', '{': '}', '<': '>' };
  const pointsPerMissingChar = { ')': 1, ']': 2, '}': 3, '>': 4 };
  let chunkStack = [];
  let points = [];

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    let chunkDelimiters = line.split('');

    for (let i = 0; i < chunkDelimiters.length; i++) {
      const char = chunkDelimiters[i];

      if (openingChars.includes(char)) {
        chunkStack.push(char);
      } else {
        let lastOpeningChar = chunkStack.pop();
        if (charPairs[lastOpeningChar] !== char) {
          chunkStack = [];
          break;
        }
      }
    }

    chunkStack.reverse();
    if (chunkStack.length > 0) {
      points.push(chunkStack.reduce((acc, char) => (acc * 5) + pointsPerMissingChar[charPairs[char]], 0));
      // console.log(`${line} - Complete by adding ${chunkStack.map(char => charPairs[char]).join('')}.`);
    }
    chunkStack = [];
  }

  points.sort((a, b) => a > b ? 1 : -1);
  console.log(points[(Math.floor(points.length / 2))]);
}

main();
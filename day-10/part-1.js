// problem https://adventofcode.com/2021/day/10

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  const openingChars = ['(', '[', '{', '<'];
  const charPairs = { '(': ')', '[': ']', '{': '}', '<': '>' };
  const pointsPerIllegalChar = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
  let chunkStack = [];
  let totalPoints = 0;

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    let chunkDelimiters = line.split('');

    chunkDelimiters.forEach(char => {
      if (openingChars.includes(char)) {
        chunkStack.push(char);
      } else {
        let lastOpeningChar = chunkStack.pop();
        if (charPairs[lastOpeningChar] !== char) {
          totalPoints += pointsPerIllegalChar[char];
          // console.log(`${line} - Expected ${charPairs[lastOpeningChar]}, but found ${char}`);
        }
      }
    });

    chunkStack = [];
  }

  console.log(totalPoints);
}

main();
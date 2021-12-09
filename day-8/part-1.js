// problem https://adventofcode.com/2021/day/8

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let uniqueSizeDigitsCount = 0;
  let legthsToCount = [2, 4, 3, 7];
  
  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    const digitExamples = line.split(' | ')[1].split(' ');
    let filteredDigits = digitExamples.filter(digit => legthsToCount.includes(digit.length));
    uniqueSizeDigitsCount += filteredDigits.length;
  }

  console.log(uniqueSizeDigitsCount);
}

main();
// problem https://adventofcode.com/2021/day/3

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let gammaBinary = '';
  let epsilonBinary = '';
  let gammaNumber = 0;
  let powerConsuption = 0;
  let epsilonNumber = 0;
  let bitCounter = []; // list of [0, 0], wich is the # of 0s and 1s for the position

  const diagnosticReport = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const data of diagnosticReport) {
    data.split('').forEach((bit, index) => {
      if (!bitCounter[index]) {
        bitCounter.push([0, 0]);
      }

      bitCounter[index][+bit]++;
    });
  }

  bitCounter.forEach(([zeroes, ones]) => {
    if (zeroes > ones) {
      gammaBinary += '0';
      epsilonBinary += '1';
    } else {
      gammaBinary += '1';
      epsilonBinary += '0';
    }
  });

  gammaNumber = parseInt(gammaBinary, 2);
  epsilonNumber = parseInt(epsilonBinary, 2);
  powerConsuption = gammaNumber * epsilonNumber;

  console.log(powerConsuption);
}

main();
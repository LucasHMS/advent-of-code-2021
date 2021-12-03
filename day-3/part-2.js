// problem https://adventofcode.com/2021/day/3

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let lifeSupportRating = 0;
  let oxygenGeneratorRating = 0;
  let co2ScrubberRating = 0;
  let position = 0;
  let mostCommonBit, leastCommonBit;
  let binariesForOxygenGenerator = [];
  let binariesForCo2Scrubber = [];
  let allBinarylReadings = [];

  const diagnosticReport = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const data of diagnosticReport) {
    allBinarylReadings.push(data);
  }

  [ mostCommonBit, leastCommonBit ] = getCommonBitsForPosition(allBinarylReadings, position);

  binariesForOxygenGenerator = filterBinaryList(allBinarylReadings, position, mostCommonBit );
  binariesForCo2Scrubber = filterBinaryList(allBinarylReadings, position, leastCommonBit);

  position++;

  while (binariesForOxygenGenerator.length !== 1 || binariesForCo2Scrubber.length !== 1) {
    [ mostCommonBit, ] = getCommonBitsForPosition(binariesForOxygenGenerator, position);
    [ ,leastCommonBit ] = getCommonBitsForPosition(binariesForCo2Scrubber, position);

    binariesForOxygenGenerator = filterBinaryList(binariesForOxygenGenerator, position, mostCommonBit);
    binariesForCo2Scrubber = filterBinaryList(binariesForCo2Scrubber, position, leastCommonBit);

    position++;
  }

  oxygenGeneratorRating = parseInt(binariesForOxygenGenerator[0], 2);
  co2ScrubberRating = parseInt(binariesForCo2Scrubber[0], 2);
  lifeSupportRating = oxygenGeneratorRating * co2ScrubberRating;

  console.log(lifeSupportRating);
}

const getCommonBitsForPosition = (binaryList, position) => {
  let zeroesAndOnes = [0, 0];
  let mostCommonBit = '';
  let leastCommonBit = '';

  binaryList.forEach(binary => {
    const bitAtPosition = +binary.split('')[position];
    zeroesAndOnes[bitAtPosition]++;
  });

  if (zeroesAndOnes[0] > zeroesAndOnes[1]) {
    mostCommonBit = '0';
    leastCommonBit = '1';
  } else {
    mostCommonBit = '1';
    leastCommonBit = '0';
  }

  return [ mostCommonBit, leastCommonBit ];
}

const filterBinaryList = (binaryList, position, commonBit) => {
  let filteredList = [];

  if (binaryList.length === 1) {
    return binaryList;
  }

  filteredList = binaryList.filter(binary => {
    const bitAtPosition = binary.split('')[position];

    return bitAtPosition === commonBit;
  });

  return filteredList;
}

main();
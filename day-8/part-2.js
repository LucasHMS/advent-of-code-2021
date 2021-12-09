// problem https://adventofcode.com/2021/day/8

/**
 *lengths per digit:
 1 => 2
 7 => 3
 4 => 4
 8 => 7

 2 => 5
 3 => 5
 5 => 5

 0 => 6
 6 => 6
 9 => 6

 */

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let digitWires = {};
  let digitWiresInvertedIndex = {};
  let overallSum = 0;

  const displays = await parseIinput();

  displays.forEach(([signalPatterns, digitExamples]) => {
    [digitWires, digitWiresInvertedIndex] = getUniqueLengthDigits(signalPatterns, digitWiresInvertedIndex);
    [digitWires, digitWiresInvertedIndex] = getLengthSixDigits(signalPatterns, digitWires, digitWiresInvertedIndex);
    [digitWires, digitWiresInvertedIndex] = getLengthFiveDigits(signalPatterns, digitWires, digitWiresInvertedIndex);

    overallSum += parseInt(digitExamples.map(digit => digitWiresInvertedIndex[digit]).join(''));
  });

  console.log(overallSum);
}

let getUniqueLengthDigits = (signalPatterns, digitWiresInvertedIndex) => {
  let uniqueLengthToDigitMap = { 2: 1, 4: 4, 3: 7, 7: 8 };
  let uniqueLengths = Object.keys(uniqueLengthToDigitMap).map(Number);

  decodedDigitsWires = {};
  signalPatterns
    .filter(pattern => uniqueLengths.includes(pattern.length))
    .forEach((encodedDigit) => {
      let decodedDigit = uniqueLengthToDigitMap[encodedDigit.length];

      decodedDigitsWires[decodedDigit] = encodedDigit.split('');
      digitWiresInvertedIndex[encodedDigit] = decodedDigit;
    });

  return [decodedDigitsWires, digitWiresInvertedIndex];
};

const getLengthSixDigits = (signalPatterns, digitWires, digitWiresInvertedIndex) => {
  let seven = new Set(digitWires[7]);
  let four = new Set(digitWires[4]);

  signalPatterns
    .filter(pattern => pattern.length === 6)
    .forEach(encodedDigit => {
      let wires = new Set(encodedDigit.split(''));

      if (setOperations.relativeComplement(wires, four).size === 2) {
        digitWires[9] = encodedDigit.split('');
        digitWiresInvertedIndex[encodedDigit] = 9;
      }

      else if (setOperations.intersection(wires, seven).size === 3) {
        digitWires[0] = encodedDigit.split('');
        digitWiresInvertedIndex[encodedDigit] = 0;
      }

      else if (setOperations.intersection(wires, four).size === 3) {
        digitWires[6] = encodedDigit.split('');
        digitWiresInvertedIndex[encodedDigit] = 6;
      }
    });

  return [digitWires, digitWiresInvertedIndex];
}

const getLengthFiveDigits = (signalPatterns, digitWires, digitWiresInvertedIndex) => {
  let one = new Set(digitWires[1]);
  let six = new Set(digitWires[6]);

  signalPatterns
    .filter(pattern => pattern.length === 5)
    .forEach(encodedDigit => {
      let wires = new Set(encodedDigit.split(''));

      if (setOperations.relativeComplement(wires, one).size === 3) {
        digitWires[3] = encodedDigit.split('');
        digitWiresInvertedIndex[encodedDigit] = 3;
      }

      else if (setOperations.intersection(wires, six).size === 4) {
        digitWires[2] = encodedDigit.split('');
        digitWiresInvertedIndex[encodedDigit] = 2;
      }

      else if (setOperations.intersection(wires, six).size === 5) {
        digitWires[5] = encodedDigit.split('');
        digitWiresInvertedIndex[encodedDigit] = 5;
      }
    });

  return [digitWires, digitWiresInvertedIndex];
}

let parseIinput = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  const displays = [];

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    const signalPatterns = line.split(' | ')[0].split(' ').map(s => s.split('').sort().join(''));
    const digitExamples = line.split(' | ')[1].split(' ').map(s => s.split('').sort().join(''));

    displays.push([signalPatterns, digitExamples]);
  }

  return displays;
};

let setOperations = {
  UNIVERSAL_SET: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],

  union: (A, B) => {
    return new Set([...Array.from(A), ...Array.from(B)]);
  },

  intersection: (A, B) => {
    return new Set(Array.from(A).filter(d => B.has(d)))
  },

  relativeComplement: (A, B) => {
    return new Set(Array.from(A).filter(d => !B.has(d)))
  },

  symmetricDifference: (A, B) => {
    return setOperations.union(setOperations.relativeComplement(A, B), setOperations.relativeComplement(B, A));
  },

  complement: (A) => {
    return setOperations.relativeComplement(setOperations.UNIVERSAL_SET, A);
  }
};

main();
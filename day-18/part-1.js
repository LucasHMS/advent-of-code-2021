// problem https://adventofcode.com/2021/day/18

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const numberList = await parseInput();

  for (const i in numberList) {
    let rawNumber = numberList[i];
    console.log(' ', rawNumber);
    let numberStack = [];
    let numberRepresentation = [];
    numberStack = buildNumberStack(rawNumber.split(''));
    numberRepresentation = buildNumberRepresentation(numberStack);


    console.log('+', JSON.stringify(numberStack, null, 0));
    console.log('2', JSON.stringify(numberRepresentation, null, 0));
  }

}

const parseInput = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  const numberList = [];

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const line of lines) {
    let number = line;
    numberList.push(number);
  }

  return numberList;
};

const buildNumberStack = (rawNumberArr = '') => {
  let numberStack = [];

  for (const i in rawNumberArr) {
    const char = rawNumberArr[i];
    if (char === '[') {
      numberStack.push([]);
    }

    else if (!isNaN(Number(char))) {
      let topPair = numberStack.pop();
      if (topPair.length > 1 && topPair.slice().pop() === '') {
        topPair.pop();
      }
      topPair.push(Number(char));
      numberStack.push(topPair);
    }

    else if (char === ']') {
      let topPair = numberStack.pop();
      numberStack.unshift(topPair);
    }

    else if (char === ',') {
      let topPair = numberStack.pop();
      topPair.push('');
      numberStack.push(topPair);
    }
  }
  numberStack.reverse();

  return numberStack;
}

const buildNumberRepresentation = (numberStack) => {
  console.log(JSON.stringify(numberStack, null, 0));
  let stackCopy = numberStack.slice();
  let numberRepresentation = [];
  let lastPair = stackCopy.shift();
  while (stackCopy.length > 0) {
    console.log(JSON.stringify(lastPair, null, 0));
    let currPair = stackCopy.shift();

    if (currPair.length < 2) {
      if (currPair[0] === '') {
        let newPair;
        // numberRepresentation.push(lastPair);
        [newPair, stackCopy] = formPair(stackCopy);
        lastPair.push(newPair);

        console.log('=========',newPair);
      } else {
      }
      continue;
    }

    if (currPair.filter(n => n === '').length === 0) {
      lastPair = [lastPair, currPair];
    } else {
      if (currPair[0] === '') {
        lastPair = [lastPair, currPair[1]];
      } else {
        lastPair = [currPair[0], lastPair];
      }
    }
  }

  if (numberRepresentation.length === 0) {
    numberRepresentation = lastPair;
  } else {
    numberRepresentation.push(lastPair);
    numberRepresentation = numberRepresentation;
  }

  // console.log('1',JSON.stringify(lastPair, null, 0));
  return lastPair;
}

const formPair = (numberStack) => {
  let stackCopy = numberStack.slice();
  let pair = [stackCopy.shift()];
  let stackBottom;

  while (stackCopy.length > 0 && pair.length < 2)  {
    stackBottom = stackCopy.shift();

    if (stackBottom.filter(n => n !== '').length === 0) {
      if (stackBottom[0] === '') {
        pair = [pair[0], stackBottom[1]];
      } else {
        pair = [stackBottom[0], pair[0]];
      }
    } else {
      pair = [pair[0], stackBottom];
    }
  }

  return [pair, stackBottom];
};

main();
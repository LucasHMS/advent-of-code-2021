// problem https://adventofcode.com/2021/day/17

const fs = require('fs');

const main = async () => {
  let xBounds, yBounds;
  let globalMaxHeigth = 0;

  let input = fs.readFileSync('./input.txt').toString();
  [xBounds, yBounds] = input.match(/-?[0-9]+\.\.-?[0-9]+/g).map(a => a.split('..').map(Number));

  let [xVelocities, yVelocities] = getAllViableVelocities(xBounds, yBounds);

  for (let i in yVelocities) {
    let yV = yVelocities[i];
    let [yPos, maxHeight, limitStep] = accelerateVertically(yV, yBounds);

    for (let j in xVelocities) {
      if (globalMaxHeigth === maxHeight) {
        break;
      }

      let xV = xVelocities[j];
      let xPos = accelerateHorizontally(xV, limitStep);
      let isValid = withinTrench([xPos, yPos], xBounds, yBounds);

      if (isValid && globalMaxHeigth < maxHeight) {
        globalMaxHeigth = maxHeight;
      }
    }
  }

  console.log(globalMaxHeigth);
}

getAllViableVelocities = (xBounds, yBounds) => {
  let xVelocities = [];
  let yVelocities = [];

  for (let i = 0; i <= xBounds[1]; i++) {
    xVelocities.push(i);
  }

  // to get a meaningful height, a yV > 0 is mandatory
  for (let i = 0; i <= Math.abs(yBounds[0]); i++) {
    yVelocities.push(i);
  }

  return [xVelocities, yVelocities];
}

const accelerateVertically = (initialVelocity, yBounds) => {
  let step = 0;
  let currentPosition = 0;
  let maxHeight = 0;

  while (currentPosition > yBounds[1]) {
    currentPosition += initialVelocity - step;
    step++;

    if (maxHeight < currentPosition) {
      maxHeight = currentPosition;
    }
  }

  return [currentPosition, maxHeight, step];
};

const accelerateHorizontally = (initialVelocity, limitStep) => {
  let step = 0;
  let currentPosition = 0;

  while (step < limitStep) {
    currentPosition += initialVelocity;

    let decelerationFactor = 0;
    if (initialVelocity !== 0) {
      decelerationFactor = initialVelocity > 0 ? -1 : 1;
    }

    initialVelocity += decelerationFactor;
    step++;
  }

  return currentPosition;
};

const withinTrench = ([finalX, finalY], xBounds, yBounds) => {
  return finalX >= xBounds[0] && finalX <= xBounds[1] && finalY >= yBounds[0] && finalY <= yBounds[1];
}

main();
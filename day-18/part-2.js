// problem https://adventofcode.com/2021/day/17

const fs = require('fs');

const main = async () => {
  let validCounter = 0;

  let input = fs.readFileSync('./input.txt').toString();
  let [xBounds, yBounds] = input.match(/-?[0-9]+\.\.-?[0-9]+/g).map(a => a.split('..').map(Number));

  let [xVelocities, yVelocities] = getAllViableVelocities(xBounds, yBounds);

  for (let i in xVelocities) {
    for (let j in yVelocities) {
      let [xV, yV] = [xVelocities[i], yVelocities[j]];
      let [xPos, yPos] = getFinalPosition(xV, yV, xBounds, yBounds);

      if (withinTrench([xPos, yPos], xBounds, yBounds)) {
        validCounter++;
      }
    }
  }

  console.log(validCounter);
}

getAllViableVelocities = (xBounds, yBounds) => {
  let xVelocities = [];
  let yVelocities = [];

  for (let i = 0; i <= xBounds[1]; i++) {
    xVelocities.push(i);
  }

  // we must expand the lower bound in relation to part 1 because now we don't care about the height
  for (let i = yBounds[0]; i <= Math.abs(yBounds[0]); i++) {
    yVelocities.push(i);
  }

  return [xVelocities, yVelocities];
}

const getFinalPosition = (xV, yV, xBounds, yBounds) => {
  let step = 0;
  let currX = 0;
  let currY = 0;
  let xDecelerationFactor = 0;

  do {
    currY += yV - step;
    currX += xV;

    xDecelerationFactor = 0;
    if (xV !== 0) {
      xDecelerationFactor = xV > 0 ? -1 : 1;
    }
    xV += xDecelerationFactor;
    step++;
  } while (!withinTrench([currX, currY], xBounds, yBounds) && (currX <= xBounds[1] && currY > yBounds[0]));

  return [currX, currY];
};

const withinTrench = ([finalX, finalY], xBounds, yBounds) => {
  return finalX >= xBounds[0] && finalX <= xBounds[1] && finalY >= yBounds[0] && finalY <= yBounds[1];
}

main();
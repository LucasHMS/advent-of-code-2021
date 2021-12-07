// problem https://adventofcode.com/2021/day/7

const fs = require('fs');

const main = async () => {
  const inputFile = fs.readFileSync('./input.txt');

  const positions = inputFile.toString().split(',').map(Number);
  positions.sort((a, b) => a > b ? 1 : -1);
  const fuelConsuptionPerPostion = (new Array(positions[positions.length - 1])).fill(0);

  positions.forEach(initialPosition => {
    fuelConsuptionPerPostion.forEach((currentConsuption, targePosition) => {
      let realTarget = targePosition + 1;
      fuelConsuptionPerPostion[targePosition] = currentConsuption + Math.abs(initialPosition - realTarget);
    });
  });

  console.log(Math.min(...fuelConsuptionPerPostion));
}

main();
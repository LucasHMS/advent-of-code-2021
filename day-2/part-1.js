// problem https://adventofcode.com/2021/day/2

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let xPosition = 0;
  let yPosition = 0;
  let unitsFromCommand = 0;
  let currCommand = '';

  const courseCommands = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const command of courseCommands) {
    [currCommand, unitsFromCommand] = command.split(' ');
    unitsFromCommand = Number(unitsFromCommand).valueOf();

    switch (currCommand) {
      case 'forward':
        xPosition = xPosition + unitsFromCommand;
        break;
      case 'down':
        yPosition = yPosition + unitsFromCommand;
        break;
      case 'up':
        yPosition = yPosition - unitsFromCommand;
        break;
  
      default:
        continue;
    }
  }

  console.log(xPosition*yPosition);
}

main();
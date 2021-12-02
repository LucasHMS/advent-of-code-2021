const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let xPosition = 0;
  let yPosition = 0;
  let aim = 0;
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
        yPosition = yPosition + (aim * unitsFromCommand);
        break;
      case 'down':
        aim = aim + unitsFromCommand;
        break;
      case 'up':
        aim = aim - unitsFromCommand;
        break;
  
      default:
        continue;
    }
  }

  console.log(xPosition*yPosition);
}

main();
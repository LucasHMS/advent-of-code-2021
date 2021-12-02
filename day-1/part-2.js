const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let currWindow = 0;
  let prevWindow = 0;
  let increassingMeasurementWindows = -1;
  let measurementWindow = [];
  
  const depths = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const depth of depths) {
    measurementWindow.push(Number(depth).valueOf());

    if (measurementWindow.length === 3) {
      currWindow = measurementWindow.reduce((prev, curr) => prev + curr);

      if (currWindow > prevWindow) {
        increassingMeasurementWindows++;
      }

      measurementWindow.shift();
      prevWindow = currWindow;
    }
  }

  console.log(increassingMeasurementWindows);
}

main();
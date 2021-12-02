const fs = require('fs');
const readline = require('readline');

const main = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let currDepth = 0;
  let prevDepth = 0;
  let increassingMeasurements = -1;
  
  const depths = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  for await (const depth of depths) {
    currDepth = Number(depth).valueOf();

    if (currDepth > prevDepth) {
      increassingMeasurements++;
    }

    prevDepth = currDepth;
  }

  console.log(increassingMeasurements);
}

main();
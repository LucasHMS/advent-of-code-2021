// problem https://adventofcode.com/2021/day/14

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let template = '';
  let insertionRules = {};
  let charHistogram = {};
  let sortedHistogram = [];

  [template, insertionRules] = await parseInput();
  // console.log(`Template: ${template.join('')}`);

  for (let i = 0; i < 10; i++) {
    let newPolymer = [];
    let pairs = makePairsFrom(template);

    let pair = pairs[0];
    let insertion = insertionRules[pair];
    let [c1, c2] = pair.split('');
    newPolymer = newPolymer.concat([c1, insertion, c2]);

    for (let j = 1; j < pairs.length; j++) {
      pair = pairs[j];
      insertion = insertionRules[pair];
      [, c2] = pair.split('');
      newPolymer = newPolymer.concat([insertion, c2]);
    }

    template = newPolymer;
    // console.log(`After step ${i + 1}: ${template.join('')}`);
  }

  template.forEach(c => {
    if (!charHistogram[c]) {
      charHistogram[c] = 0;
    }
    charHistogram[c]++;
  });

  sortedHistogram = Object.entries(charHistogram).sort((a, b) => a[1] > b[1] ? -1 : 1).map(h => h[1]);
  console.log(sortedHistogram[0] - sortedHistogram[sortedHistogram.length - 1]);
}

const parseInput = async () => {
  const inputStream = fs.createReadStream('./input.txt');
  let template = '';
  let insertionRules = {};

  const lines = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity
  });

  return await new Promise((resolve) => {
    lines.once('line', async (data) => {
      template = data.split('');

      for await (let rule of lines) {
        if (rule === '') {
          continue;
        }

        let [pair, insertion] = rule.split(' -> ');
        insertionRules[pair] = insertion;
      }

      resolve([template, insertionRules]);
    });
  });
}

const makePairsFrom = (template) => {
  let pairs = [];

  for (let i = 1; i < template.length; i++) {
    let c1 = template[i - 1];
    let c2 = template[i];

    pairs.push(`${c1}${c2}`);
  }

  return pairs;
}

main();
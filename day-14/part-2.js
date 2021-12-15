// problem https://adventofcode.com/2021/day/14

const fs = require('fs');
const readline = require('readline');

const main = async () => {
  let template = '';
  let insertionRules = {};
  let charHistogram = {};
  let sortedHistogram = [];
  let pairsIndex = new Map()
  let lastPair = '';

  [template, insertionRules] = await parseInput();

  pairsIndex = makePairsIndexFromTemplate(template);
  lastPair = template.slice(-2).join('');

  for (let i = 0; i < 40; i++) {
    let generatedPairsIndex = new Map();

    for (const [pair, count] of pairsIndex.entries()) {
      let insertion = insertionRules[pair];
      let newPair1 = pair[0] + insertion;
      let newPair2 = insertion + pair[1];
      let newPair1Count = 0;
      let newPair2Count = 0;

      if (!generatedPairsIndex.get(newPair1)) {
        generatedPairsIndex.set(newPair1, 0);
      }
      if (!generatedPairsIndex.get(newPair2)) {
        generatedPairsIndex.set(newPair2, 0);
      }

      newPair1Count = generatedPairsIndex.get(newPair1) + count;
      newPair2Count = generatedPairsIndex.get(newPair2) + count;

      generatedPairsIndex.set(newPair1, newPair1Count);
      generatedPairsIndex.set(newPair2, newPair2Count);
    }

    pairsIndex = generatedPairsIndex;
    lastPair = insertionRules[lastPair] + lastPair[1];
  }

  for (let [pair, count] of pairsIndex.entries()) {
    let char1 = pair[0];
    charHistogram = updateCharHistogram(charHistogram, [char1], count);
  }
  charHistogram = updateCharHistogram(charHistogram, [lastPair[1]], 1);

  sortedHistogram = Object.entries(charHistogram).sort((a, b) => a[1] > b[1] ? -1 : 1).map(h => h[1]);
  console.log(sortedHistogram[0] - sortedHistogram[sortedHistogram.length-1]);
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

const makePairsIndexFromTemplate = (template) => {
  let pairsIndex = new Map();

  for (let i = 1; i < template.length; i++) {
    let c1 = template[i - 1];
    let c2 = template[i];
    let pair = `${c1}${c2}`;

    if (!pairsIndex.get(pair)) {
      pairsIndex.set(pair, 0);
    }

    pairsIndex.set(pair, pairsIndex.get(pair) + 1);
  }

  return pairsIndex;
}

const updateCharHistogram = (charHistogram, charList, aggregate) => {
  charList.forEach(c => {
    if (!charHistogram[c]) {
      charHistogram[c] = 0;
    }
    charHistogram[c] += aggregate ? aggregate : 1;
  });

  return charHistogram;
}

main();
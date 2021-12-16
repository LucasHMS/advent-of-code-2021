// problem https://adventofcode.com/2021/day/16

const fs = require('fs');

const main = async () => {
  let hexString = '';
  let bitString = '';
  let totalReadLen = 0;
  let finalPayload = 0;
  let versionSum = 0;

  hexString = fs.readFileSync('./input.txt').toString();
  bitString = hexToBitStirng(hexString);

  console.log('original bit string length', bitString.length);

  [bitString, totalReadLen, versionSum, finalPayload] = readPacket(bitString, versionSum);

  console.log('total legth read', totalReadLen, '+', bitString.length, 'bits of garbage =', totalReadLen + bitString.length);
  console.log('version sum', versionSum);
  console.log('final payload', finalPayload); // part 2
}

const hexToBitStirng = (hexString = '') => {
  const bitMap = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111'
  }

  return hexString.split('').map(hexChar => bitMap[hexChar]).join('');
}

const readPacket = (packet, versionSum) => {
  let pktLen = 0;
  let payloadParser, version, pktTid, payload, readLen;

  [packet, payloadParser, version, pktTid, readLen] = headerParser(packet);
  pktLen += readLen;
  versionSum += parseInt(version, 2);

  [packet, readLen, versionSum, payload] = payloadParser(packet, versionSum, pktTid);
  pktLen += readLen;

  return [packet, pktLen, versionSum, payload];
}

const headerParser = (packet = '') => {
  if (packet === '') {
    return [packet, null, 0, 0, 0];
  }

  let packetArr = packet.split('');
  let version = packetArr.splice(0, 3);
  let pktTid = packetArr.splice(0, 3);
  let payloadParser = (bitString = '') => bitString;

  switch (pktTid.join('')) {
    case '100':
      payloadParser = parseLiliteral;
      break;

    default:
      payloadParser = parseOperator;
      break;
  }

  return [packetArr.join(''), payloadParser, version.join(''), pktTid.join(''), 6];
};

const parseLiliteral = (packet = '', versionSum) => {
  if (packet === '') {
    return [packet, 0, 0];
  }

  let packetArr = packet.split('');
  let foundLastGroup = false;
  let literalBitString = [];
  let lenRead = 0;

  while (!foundLastGroup) {
    let [groupPrefix] = packetArr.splice(0, 1);
    let group = packetArr.splice(0, 4);
    lenRead += group.length + 1;

    literalBitString = literalBitString.concat(group);

    if (groupPrefix === '0') {
      foundLastGroup = true;
    }
  }

  return [packetArr.join(''), lenRead, versionSum, parseInt(literalBitString.join(''), 2)];
}

const parseOperator = (packet = '', versionSum, pktTid) => {
  if (packet === '') {
    return [packet, 0, 0];
  }

  let packetArr = packet.split('');
  let lenTid = packetArr.shift();
  let totalReadLen = 1;
  let subpacketsLen = 0;
  let subpacketsCount = 0;
  let readCount = 0;
  let readLen = 0;
  let operationPayload = 0;
  let operands = [];
  let endOperatorParse = () => false;
  let operator = getOperatorExecutor(pktTid);

  switch (lenTid) {
    case '0':
      subpacketsLen = parseInt(packetArr.splice(0, 15).join(''), 2);
      totalReadLen += 15;
      endOperatorParse = ([readLen, subpacketsLen, ,]) => readLen >= subpacketsLen;

      break;

    case '1':
      subpacketsCount = parseInt(packetArr.splice(0, 11).join(''), 2);
      totalReadLen += 11;
      endOperatorParse = ([, , readCount, subpacketsCount]) => readCount >= subpacketsCount;

      break;

    default:
      break;
  }

  packet = packetArr.join('');

  while (!endOperatorParse([readLen, subpacketsLen, readCount, subpacketsCount])) {
    let pktLen, payload;

    [packet, pktLen, versionSum, payload] = readPacket(packet, versionSum);

    operands.push(payload); // part 2

    readCount++;
    readLen += pktLen;
  }

  operationPayload = operator(operands); // part 2
  totalReadLen += readLen; // part 2

  return [packet, totalReadLen, versionSum, operationPayload];
}

// part 2
const getOperatorExecutor = (pktTid) => {
  const pktTidBase10 = parseInt(pktTid, 2);

  switch (pktTidBase10) {
    case 0:
      return (payloads) => payloads.reduce((acc, n) => acc + n);

    case 1:
      return (payloads) => payloads.reduce((acc, n) => acc * n);

    case 2:
      return (payloads) => Math.min(...payloads);

    case 3:
      return (payloads) => Math.max(...payloads);

    case 5:
      return (payloads) => Number(payloads[0] > payloads[1]);

    case 6:
      return (payloads) => Number(payloads[0] < payloads[1]);

    case 7:
      return (payloads) => Number(payloads[0] === payloads[1]);

    default:
      break;
  }
}

main();
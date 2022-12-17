// Part 1
// const fs = require('fs');
// const readLine = require('readline');

// async function processLineByLine() {
//     const fileStream = fs.createReadStream('rucksack.input');
    
//     const rl = readLine.createInterface({
//         input: fileStream,
//         crlfDelay: Infinity
//     });
//     let result = 0;
//     let priorityOfBestItemInCurrentRucksack = 0;
//     for await (const line of rl) {
//         const listedItems = line.split('');
//         const listedItemsLength = listedItems.length;
//         const middleIndex = Math.floor(listedItemsLength / 2);
//         const firstCompartment = listedItems.splice(0, middleIndex);
//         const secondCompartment = listedItems.splice(-middleIndex);
//         priorityOfBestItemInCurrentRucksack = 0;

//         for (let i = 0; i < firstCompartment.length; i++) {
//             for (let j = 0; j < secondCompartment.length; j++) {
//                 if (firstCompartment[i] === secondCompartment[j]) {
//                     const priority = calculatePriority(firstCompartment[i]);
//                     if (priority > priorityOfBestItemInCurrentRucksack) {
//                         priorityOfBestItemInCurrentRucksack = priority;
//                     }
//                 }
//             }
//         }
//         result += priorityOfBestItemInCurrentRucksack;
//     }
//     return result;
// }

// part 2
var fs = require('fs');

const getDataFromInput = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
}

const rawData = getDataFromInput('rucksack.input');

const data = rawData.split("\n");

const splitListInGroupsOfThree = (list) => {
  const result = [];
  for (let i = 0; i < list.length; i += 3) {
    result.push(list.slice(i, i + 3));
  }
  return result;
}

const splitList = splitListInGroupsOfThree(data);

const findItemPresentInEachElement = (list) => {
  let result = "";
  const firstElement = list[0].split('');
  const secondElement = list[1].split('');
  const thirdElement = list[2].split('');
  for (let i = 0; i < firstElement.length; i++) {
    for (let j = 0; j < secondElement.length; j++) {
      for (let k = 0; k < thirdElement.length; k++) {
        if (firstElement[i] === secondElement[j] && firstElement[i] === thirdElement[k]) {
          result = firstElement[i];
          break;
        }
      }
    }
  }
  return result;
}

const listOfBadges = splitList.map((list) => findItemPresentInEachElement(list));

const calculatePriority = (badge) => {
  if (badge === badge.toUpperCase()) {
    return badge.charCodeAt(0) - 38;
  } else {
    return badge.charCodeAt(0) - 96;
  }
}

const result = listOfBadges.map((badge) => calculatePriority(badge)).reduce((a, b) => a + b, 0);

console.log(result);
const fs = require('fs');
const readLine = require('readline');

async function processLineByLine() {
    const totalCaloriesPerElfArray = [];
    const fileStream = fs.createReadStream('calories.input');
    
    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let currentElf = 0;
    for await (const line of rl) {
        const currentLineInt = parseInt(line);
        if (line === '') {
            totalCaloriesPerElfArray.push(currentElf);
            currentElf = 0;
        } else {
            currentElf += currentLineInt;
        }
    }
    return totalCaloriesPerElfArray;
}

processLineByLine().then((result) => result).then((result) => {
    // answer 1
    const maxCaloriesPerElf = maxCalories(result);
    console.log('Elf with the most calories: ', maxCaloriesPerElf);

    // answer 2
    const sortedResult = result.sort((a, b) => a - b).reverse();
    console.log('total: ', sortedResult.slice(0, 3).reduce((total, currentNumber) => total + currentNumber, 0));
    return 0;
});


const maxCalories = (caloryArray) => {
    if (caloryArray === undefined || caloryArray.length === 0) return 0;
    return Math.max(...caloryArray);
}
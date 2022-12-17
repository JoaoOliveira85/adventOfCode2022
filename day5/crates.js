const fs = require('fs');
const readLine = require('readline');

const crates = new Array(9);

for (let i = 0; i < 9; i++) {
    crates[i] = new Array;
}

async function processLineByLine() {
    const fileStream = fs.createReadStream('crates.input');
    
    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {

    if (line.startsWith(["["])) {
        for (let i = 0; i < line.length; i++) {
            if (i % 4 === 0) {
                crates[i / 4].unshift(line[i + 1]);
            }
        }
    }

    if (line.length === 0 || !line.startsWith('m')) {
        clearEmptySpaces(crates);
        continue;
    }

    const move = line.split(' ');
    const quantity = parseInt(move[1]);
    const origin = parseInt(move[3]);
    const destination = parseInt(move[5]);

    // moveCrates(quantity, origin, destination); // Part 1
    moveMultipleCrates(quantity, origin, destination); // Part 2
    }
    
    const solution = [];
    for (let i = 0; i < crates.length; i++) {
        solution.push(crates[i].pop());
    }
    console.log("Solution: ", solution.join(''));
}

const moveCrate = (quantity, origin, destination) => {

    if (origin.length === 0 || quantity === 0 || origin === destination) {
        return;
    }

    for (let i = 0; i < quantity; i++) {
        crates[destination - 1].push(crates[origin - 1].pop());
    }

}

const moveMultipleCrates = (quantity, origin, destination) => {
    crates[destination - 1].push(...crates[origin - 1].splice(crates[origin - 1].length - quantity, quantity));
}

const clearEmptySpaces = (crates) => {
    for (let i = 0; i < crates.length; i++) {
        for (let j = 0; j < crates[i].length; j++) {
            if (crates[i][j] === " ") {
                crates[i].splice(j, 1);
            }
        }
    }
}

processLineByLine()
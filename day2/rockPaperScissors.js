const fs = require('fs');
const readLine = require('readline');

const decryptEnemy = {
    A: 'rock',
    B: 'paper',
    C: 'scissors'
}

const decryptFriend = {
    X: 'rock',
    Y: 'paper',
    Z: 'scissors'
}

const guaranteeResult = {
    X: { // Loose
        A: 'Z',
        B: 'X',
        C: 'Y'
    },
    Y: { // Tie
        A: 'X',
        B: 'Y',
        C: 'Z'
    },
    Z: { // Win
        A: 'Y',
        B: 'Z',
        C: 'X'
    },
}

async function processLineByLine() {
    const fileStream = fs.createReadStream('rockPaperScissors.input');
    
    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let totalScore = 0;
    
    for await (const line of rl) {
        const [enemy, friend] = line.split(' ');

        // ! question 1:
        // totalScore += rockPaperScissors(decryptEnemy[enemy], decryptFriend[friend]);

        // ! question 2:
        totalScore += rockPaperScissors(decryptEnemy[enemy], decryptFriend[guaranteeResult[friend][enemy]]);

    }
    return totalScore;
}

const rockPaperScissors = (enemy, friend) => {
    console.log({enemy, friend})
    const scores = {
        'rock': 1,
        'paper': 2,
        'scissors': 3,
        'loss': 0,
        'win': 6,
        'draw': 3,
    }

    if (enemy === friend) {
        return scores.draw + scores[friend];
    } else if (enemy === 'paper' && friend === 'scissors') {
        return scores.win + scores[friend];
    } else if (enemy === 'scissors' && friend === 'rock') {
        return scores.win + scores[friend];
    } else if (enemy === 'rock' && friend === 'paper') {
        return scores.win + scores[friend];
    } else {
        return scores.loss + scores[friend];
    }
}

processLineByLine().then((result) => result).then((result) => {
    console.log(result);
});
const fs = require('fs');
const readLine = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('overlap.input');
    
    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let insideResult = 0;
    let overlapResult = 0;
    for await (const line of rl) {
        const sectionOne = line.split(',')[0];
        const sectionTwo = line.split(',')[1];

        const sectionOneStart = parseInt(sectionOne.split('-')[0]);
        const sectionOneEnd = parseInt(sectionOne.split('-')[1]);
        const sectionTwoStart = parseInt(sectionTwo.split('-')[0]);
        const sectionTwoEnd = parseInt(sectionTwo.split('-')[1]);
        
        // part 1
        const oneInsideTwo = (
            sectionOneStart >= sectionTwoStart && // lowest value of sectionOne is greater than or equal to lowest value of sectionTwo
            sectionOneStart <= sectionTwoEnd // lowest value of sectionOne is less than or equal to highest value of sectionTwo
        ) && (
            sectionOneEnd <= sectionTwoEnd && // highest value of sectionOne is less than or equal to highest value of sectionTwo
            sectionOneEnd >= sectionTwoStart // highest value of sectionOne is greater than or equal to lowest value of sectionTwo
        );
        const twoInsideOne = (
            sectionTwoStart >= sectionOneStart && // lowest value of sectionTwo is greater than or equal to lowest value of sectionOne
            sectionTwoStart <= sectionOneEnd // lowest value of sectionTwo is less than or equal to highest value of sectionOne
        ) && (
            sectionTwoEnd <= sectionOneEnd && // highest value of sectionTwo is less than or equal to highest value of sectionOne
            sectionTwoEnd >= sectionOneStart); // highest value of sectionTwo is greater than or equal to lowest value of sectionOne

        if (oneInsideTwo || twoInsideOne) {
            insideResult++;
        }

        // part 2
        const oneOverlapsTwo = (
            sectionOneStart >= sectionTwoStart && // lowest value of sectionOne is greater than or equal to lowest value of sectionTwo
            sectionOneStart <= sectionTwoEnd // lowest value of sectionOne is less than or equal to highest value of sectionTwo
        ) || (
            sectionOneEnd <= sectionTwoEnd && // highest value of sectionOne is less than or equal to highest value of sectionTwo
            sectionOneEnd >= sectionTwoStart // highest value of sectionOne is greater than or equal to lowest value of sectionTwo
        );
        const twoOverlapsOne = (
            sectionTwoStart >= sectionOneStart && // lowest value of sectionTwo is greater than or equal to lowest value of sectionOne
            sectionTwoStart <= sectionOneEnd // lowest value of sectionTwo is less than or equal to highest value of sectionOne
        ) || (
            sectionTwoEnd <= sectionOneEnd && // highest value of sectionTwo is less than or equal to highest value of sectionOne
            sectionTwoEnd >= sectionOneStart); // highest value of sectionTwo is greater than or equal to lowest value of sectionOne

        if (oneOverlapsTwo || twoOverlapsOne) {
            overlapResult++;
        }
    }

    console.log("inside:", insideResult); // part 1
    console.log("overlap:", overlapResult); // part 2
}

processLineByLine()
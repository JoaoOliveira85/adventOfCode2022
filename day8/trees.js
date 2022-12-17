const DEBUG = false;

// part 1
var fs = require('fs');

const getDataFromInput = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
}

const rawData = getDataFromInput('tree.input');

const data = rawData.split("\n").map((line) => line.split("").map((item) => parseInt(item)));

const width = data[0].length;
const height = data.length;

class Tree {
    constructor(x, y, height) {
        this.x = x;
        this.y = y;
        this.height = height;
    }

    _shootLaser(from, to) {
        let distance;
        const laserData = [];
        if (from.x == to.x) {
            distance = Math.abs(from.y - to.y);
            for (let i = 0; i < distance; i++) {
                let x = from.x;
                let y = from.y + (to.y - from.y) * i / distance;
                laserData.push(treeList[y][x]);
            }
        } else if (from.y == to.y) {
            distance = Math.abs(from.x - to.x);
            for (let i = 0; i < distance; i++) {
                let x = from.x + (to.x - from.x) * i / distance;
                let y = from.y;
                laserData.push(treeList[y][x]);
            }
        }
        return laserData;
    }

    get visibleFromAboveOrBelow() {
        const dataFromAbove = this._shootLaser({x: this.x, y: 0}, this.position);
        const dataFromBelow = this._shootLaser({x: this.x, y: height - 1}, this.position);

        const result = [...dataFromAbove].filter((item) => item.height >= this.height).length == 0 || [...dataFromBelow].filter((item) => item.height >= this.height).length == 0;

        if (DEBUG) console.log({dataFromAbove, dataFromBelow, isVisible: result, height})

        return result;
    }

    get visibleFromSides() {
        const dataFromLeft = this._shootLaser({x: 0, y: this.y}, this.position);
        const dataFromRight = this._shootLaser({x: width - 1, y: this.y}, this.position);

        const result = [...dataFromLeft].filter((item) => item.height >= this.height).length == 0 || [...dataFromRight].filter((item) => item.height >= this.height).length == 0;

        if (DEBUG) console.log({dataFromLeft, dataFromRight, isVisible: result, height})
        return result;
    }

    get scenicScore () {
        const left = {x: -1, y: this.y};
        const right = {x: width, y: this.y};
        const above = {x: this.x, y: -1};
        const below = {x: this.x, y: height};

        let dataToTheRight = this._shootLaser({x: this.x + 1, y: this.y}, right).findIndex(item => item.height >= this.height)
        let dataToTheLeft = this._shootLaser({x: this.x - 1, y: this.y}, left).findIndex(item => item.height >= this.height)
        let dataToTheTop = this._shootLaser({x: this.x, y: this.y - 1}, above).findIndex(item => item.height >= this.height)
        let dataToTheBottom = this._shootLaser({x: this.x, y: this.y + 1}, below).findIndex(item => item.height >= this.height)

        
        if (dataToTheTop === -1) {
            dataToTheTop = this.y - 1;
        }

        if (dataToTheBottom === -1) {
            dataToTheBottom = height - 1 - this.y - 1;
        }

        if (dataToTheLeft === -1) {
            dataToTheLeft = this.x - 1;
        }

        if (dataToTheRight === -1) {
            dataToTheRight = width - 1 - this.x - 1;
        }

        if (DEBUG) {
            console.info("pos:", {X: this.x, Y: this.y})
            console.table([["00", dataToTheTop + 1, "00"], [dataToTheLeft + 1, this.height, dataToTheRight + 1], ["00", dataToTheBottom + 1, "00"]])
        }

        if (this.x === 0 || this.y === 0 || this.x === width - 1 || this.y === height - 1) {
            return 0;
        }


        return (dataToTheRight + 1) * (dataToTheLeft + 1) * (dataToTheTop + 1) * (dataToTheBottom + 1);
    }

    get visible() {
        if (DEBUG) console.log("pos:", {X: this.x, Y: this.y})
        let isHorizontallyVisible = this.visibleFromAboveOrBelow;
        let isVerticallyVisible = this.visibleFromSides;
        return isHorizontallyVisible || isVerticallyVisible;
    }

    get position() {
        return {x: this.x, y: this.y};
    }

    get treeHeight() {
        return {height: this.height};
    }
}

const treeList = new Array(width).fill(0).map(() => new Array(height).fill(0));

for (let row = 0; row < width; row++) {
    for (let column = 0; column < height; column++) {
        treeList[column][row] = new Tree(row, column, data[column][row]);
    }
}

// part 1
let visibleTrees = [];
for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
        if (treeList[x][y].visible) {
            visibleTrees.push(treeList[x][y]);
        }
    }
}

if (DEBUG) console.table(treeList.map((row) => row.map(tree => tree.visible)))
if (DEBUG) console.table(treeList.map((row) => row.map(tree => tree.height)))

console.log("Number of Visible Trees:", visibleTrees.length);

// part 2

let treesScenicScore = [];
for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
        if (treeList[x][y].scenicScore) {
            treesScenicScore.push(treeList[x][y].scenicScore);
        }
    }
}

console.log("Best tree: ", treesScenicScore.sort((a, b) => b - a)[0])
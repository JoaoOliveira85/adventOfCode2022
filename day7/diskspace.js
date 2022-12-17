const { Console } = require('console');
const fs = require('fs');
const readLine = require('readline');

const SHOW_COMMANDS = true;

const folderStructure = {
    '/': {},
}

let presentWorkingDirectory = "/";

const changeDiretory = (target) => {
    if (target === "..") {
        presentWorkingDirectory = presentWorkingDirectory.split("/").slice(0, -1).join("/");
    } else if (target === "/") {
        presentWorkingDirectory = "/";
    } else {
        if (presentWorkingDirectory === "/") {
            presentWorkingDirectory = presentWorkingDirectory + target;
        } else {
            presentWorkingDirectory = presentWorkingDirectory + "/" + target;
        }
    }
}
let folderSizesObj = {
    '/': {},
    folderSize: 0,
}

let result = {};

const getFolderSizes = (object, destination) => {
    let folderSize = 0;
    let objectKeys = Object.keys(object);
    let objectValues = Object.values(object);
    for (let i = 0; i < objectKeys.length; i++) {
        if (typeof destination[objectKeys[i]] === 'undefined') {
            destination[objectKeys[i]] = {};
        }
        if (typeof objectValues[i] === "object") {
            folderSize += getFolderSizes(objectValues[i], destination[objectKeys[i]]);
        } else {
            if (true){
                folderSize += parseInt(objectValues[i]);
                delete destination[objectKeys[i]];
            }
        }
        destination['folderSize'] = folderSize;
    }
    return folderSize;
}

const sizeList = []

const listFoldersWithinRange = (object, destination, min, max) => {
    let objectKeys = Object.keys(object);
    let objectValues = Object.values(object);
    for (let i = 0; i < objectKeys.length; i++) {
        if (typeof objectValues[i] === "object") {
            listFoldersWithinRange(object[objectKeys[i]], destination, min, max);
        }
        if (object['folderSize'] >= min && object['folderSize'] <= max && objectKeys[i] === 'folderSize') {
            destination.push(object['folderSize']);
        }
    }
}

const executeOperation = (object, destination, operation) => {
    switch (operation.type) {
        case "createFile":
            object[destination][operation.fileName] = operation.fileSize;
            break;
        case "createFolder":
            object[destination][operation.folderName] = {};
            break;
        case "deleteFile":
            delete object[destination][operation.fileName];
            break;
        case "deleteFolder":
            delete object[destination][operation.folderName];
            break;
        default:
            break;
    } 
}

let readFolderStructure = (object, destination, operation) => {
    if (destination === "/") {
        if (typeof operation !== 'undefined') {
            executeOperation(object, destination, operation);
        }
        return object["/"];
    }
    
    let map = destination.split("/");
    if (map.length === 1) {
        if (object[map[0]] === undefined) {
            if (SHOW_COMMANDS) {
                console.error("No such file or directory");
            }
            presentWorkingDirectory = presentWorkingDirectory.split("/")
            presentWorkingDirectory.pop()
            presentWorkingDirectory = presentWorkingDirectory.join("/");
            return object;
        }
        executeOperation(object, destination, operation);
        
        return object[map[0]];
    }

    if (destination[0] === "/") {
        map.shift()
        const nextDestination = map.join("/");
        return readFolderStructure(object["/"], nextDestination, operation)
    }
    let nextDestination = map[0];
    if (object[nextDestination] === undefined) {
        if (SHOW_COMMANDS) {
            console.error("No such file or directory");
        }
        presentWorkingDirectory = presentWorkingDirectory.split("/")
        presentWorkingDirectory.pop()
        presentWorkingDirectory = presentWorkingDirectory.join("/");
        return object;
    }
    map.shift();

    return readFolderStructure(object[nextDestination], map.length > 1 ? map.join("/") : map[0], operation);
    
}

const listDirectory = () => {
    /*console.log(readFolderStructure(folderStructure, presentWorkingDirectory))
    return(readFolderStructure(folderStructure, presentWorkingDirectory));*/
}

const parseFolderLine = (lineData) => {
    if (!isNaN(lineData[0])) {
        parseFile([lineData[1], lineData[0]]);
    } else {
        parseFolder(lineData[1], presentWorkingDirectory);
    }
}

const parseFolder = (folderName, path) => {
    readFolderStructure(folderStructure, path, {type: "createFolder", folderName: folderName});
}

const parseFile = (fileData) => {
    readFolderStructure(folderStructure, presentWorkingDirectory, {type: "createFile", fileName: fileData[0], fileSize: fileData[1]});
}

const executeCommand = (command, argument) => {
    switch (command) {
        case "cd":
            changeDiretory(argument);
            break;
        case "ls":
            listDirectory();
            break;
        default:
            console.error(`Command ${command} not found.`);
    }
}

const readTerminalLine = (line) => {
    const lineElements = line.split(" ");
    if (lineElements[0] === "$") {
        executeCommand(lineElements[1], lineElements[2]);
    } else {
        parseFolderLine([lineElements[0], lineElements[1]]);
    }
}

async function processLineByLine() {
    const fileStream = fs.createReadStream('diskspace.input');
    
    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        readTerminalLine(line);
    }

    const findSmallestFolderToDelete = (kust, target) => {
        const totalSpace = 70000000;
        const usedSpace = 41072511;
        const freeSpace = totalSpace - usedSpace;

        for (let i = 0; i < kust.length; i++) {
            if(freeSpace + parseInt(kust[i]) >= target) {
                return kust[i];
            }
        }
    }
    
    getFolderSizes(folderStructure, result)
    listFoldersWithinRange(result, sizeList, 0, 100000)
    console.log(sizeList.reduce((a,b) => a + b, 0))
    getFolderSizes(folderStructure, result)
    listFoldersWithinRange(result, sizeList, 0, 10000000)
    console.log(findSmallestFolderToDelete(sizeList.sort((a,b) => a - b), 30000000))
    
}


processLineByLine()





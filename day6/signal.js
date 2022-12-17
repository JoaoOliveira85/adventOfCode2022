const fs = require('fs');

const readable = fs.createReadStream('./signal.input', {encoding: 'utf8'}).on('readable', function() {
    var chunk;
    // const packetSize = 4; // part 1
    const packetSize = 14; // part 2
    let currentPacket = [];
    let position = 0;
    while (null !== (chunk = readable.read(1))) {
        currentPacket.push(chunk);
        if (currentPacket.length === packetSize) {
            const result = currentPacket.reduce((acc, curr) => {
                if (acc[curr]) {
                    acc[curr] += 1;
                } else {
                    acc[curr] = 1;
                }
                return acc;
            }, {});
            let repeatBytes = 0;
            for (let key in result) {
                if (result[key] > 1) {
                    repeatBytes++;
                }
            }
            
            if (repeatBytes === 0) {
                console.log('Position: ' + (position + packetSize) + ' - ' + currentPacket.join(''));
                continue;
            }
            currentPacket.shift();
            position++;
        }
    }
});
const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data/data.json');
let data = require(dataPath);

const getCaseNumber = (type) => {
    if (type === 'ban') {
        data.banCaseCount += 1;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return data.banCaseCount;
    } else if (type === 'mute') {
        data.muteCaseCount += 1;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return data.muteCaseCount;
    } else if (type === 'kick') {
        data.kickCaseCount += 1;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return data.kickCaseCount;
    } else if (type == 'warn'){
        data.warnCaseCount += 1;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return data.warnCaseCount;
    }
    return null;
};

module.exports = {
    getCaseNumber,
};

let blessed = require('blessed');
// Create a screen object.
let screen = blessed.screen({
  smartCSR: true
});
 
screen.title = 'jsjecology';
 
let box = blessed.box({
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%',
  content: '{cyan-fg}H{/cyan-fg}{red-fg}e{/red-fg}{green-fg}l{/green-fg}lo {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line',
  },
  lable: 'testing',
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});
 
let baseColor = 'green';
 
let cols = [
    'blue',
    'yellow',
    'magenta',
    'gray',
    'cyan',
    'white'];
 
let wrapCol = (str, i) => '{' + cols[i] + '-fg}' + str + '{/' + cols[i] + '-fg}'
 
let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()[]{}';
 
let config = {
    displayAge: true,
    displayPop: true,
    baseLifeforms: 200,
    higherLifeforms: 20,
    plantCycle: 10,
    turnsWithoutFood : 20,
    reproThreshold : 3
}
 
screen.append(box);
let randInt = upper => Math.floor(Math.random() * upper);
 
let lookupKey = (x, y) => `${x},${y}`;
 
let checkLookup = (lookup, x, y) => {
    if (typeof lookup[lookupKey(x, y)] == "undefined") {
        return false;
    }
    return true;
};
 
let addLifeform = (uverse, x, y, lifeform) => {
    uverse.lifeforms.push(lifeform);
    uverse.lfLookup[lookupKey(x, y)] = lifeform;
    return lifeform;
}
 
let deleteLifeform = (uverse, x, y) => {
    uverse.lifeforms = uverse.lifeforms.filter(lf => lf.x != x || lf.y != y);
    delete uverse.lfLookup[lookupKey(x, y)];
}
 
let updateLifeform = (uverse, x, y, lf) => {
    if (checkLifeform(uverse, x, y)) {
        deleteLifeform(uverse, x, y);
        addLifeform(uverse, lf.x, lf.y, lf);
    }
}
 
let getLifeform = (uverse, x, y) => uverse.lfLookup[lookupKey(x, y)];
 
let levelToChar = (level, charset) => charset[level % charset.length]
 
let levelToColor = level => (level == 0) ? baseColor : cols[level % cols.length];
 
let checkBounds = (uverse, x, y) => x >= 0 && x < uverse.width && y >= 0 && y < uverse.height;
 
//let checkLifeform = (uverse, x, y) => checkBounds(uverse.lfLookup, x, y) && checkLookup(uverse.lfLookup, x, y);
let checkLifeform = (uverse, x, y) => checkLookup(uverse.lfLookup, x, y);
 
let listHlf = (uverse) => uverse.lifeforms.filter(lf => lf.level != 0);
let listLlf = (uverse) => uverse.lifeforms.filter(lf => lf.level == 0);
 
let createLlf = (x, y, config, isMature=false) => ({
    x: x, y: y, level: 0, isMature: isMature, turnsToMaturity: config.plantCycle
});
 
let createHlf = (x, y, config, level = 1) => ({
    x: x, y: y, level: level, maxTurnsWithoutFood: config.turnsWithoutFood, turnsWithoutFood: 0
});
 
let createLf = (uverse, count, createFn) => {
    for (let i = 0; i < count; i++) {
        let x, y;
        do {
            x = randInt(uverse.width);
            y = randInt(uverse.height);
        } while (checkLifeform(uverse, x, y));
        let lifeform = createFn(x, y, uverse.config);
        addLifeform(uverse, x, y, lifeform);
    }
}
 
let getLfInitiative = (uverse) => {
    uverse.initiative = [];
    let hlfs = listHlf(uverse);
    while (hlfs.length > 0) {
        let idx = randInt(hlfs.length);
        uverse.initiative.push(hlfs[idx]);
        hlfs.splice(idx, 1);
    }
    let llfs = listLlf(uverse);
    while (llfs.length > 0) {
        let idx = randInt(llfs.length);
        uverse.initiative.push(llfs[idx]);
        llfs.splice(idx, 1);
    }
}
 
let lfRadius = (uverse, lf, rad) => {
    let lfList = [];
    let max = rad * 2 + 1;
    let xArr = [-rad, rad, -rad, rad];
    let yArr = [-rad, -rad, rad, rad];
    for (let n = 0; n < rad * 2 + 1; n++) {
 
 
    }
}
 
 
let lfTick = (uverse, lf) => {
    let x = lf.x;
    let y = lf.y;
    if (lf.level == 0 && !lf.isMature) {
        lf.turnsToMaturity--;
        if (lf.turnsToMaturity <= 0) {
            lf.isMature = true;
        }
    }
    else {
        lf.turnsWithoutFood++;
        if (lf.turnsWithoutFood > lf.maxTurnsWithoutFood) {
            deleteLifeform(uverse, lf.x, lf.y);
            return;
        }
 
    }
    updateLifeform(uverse, x, y, lf);
}
 
let tick = (uverse) => {
    let newTurn = false;
    if (uverse.initiative.length == 0) {
        getLfInitiative(uverse);
        newTurn = true;
        uverse.turns++;
    }
    lfTick(uverse, uverse.initiative[0]);
    uverse.initiative.splice(0, 1);
    return newTurn;
}
 
let createUverse = (width, height, config) => {
    let ret = {};
    ret.width = width;
    ret.height = height;
    ret.config = config;
    ret.lifeforms = [];
    ret.lfLookup = {};
    ret.initiative = [];
    ret.turns = 0;
    createLf(ret, config.baseLifeforms, createLlf);
    createLf(ret, config.higherLifeforms, createHlf);
    return ret;
}
 
let genContent = (box, uverse) => {
    let content = '';
    for (let j = 0; j < box.height - 2; j++) {
        for (let i = 0; i < box.width - 2; i++) {
            if (checkLifeform(uverse, i, j)) {
                let lf = getLifeform(uverse, i, j);
                let level = lf.level;
                colorStr = levelToColor(level) + '-fg';
                if (level == 0 && !lf.isMature) {
                    content += `{${colorStr}}a{/${colorStr}}`;
                }
                else {
                    content += `{${colorStr}}${levelToChar(level, charset)}{/${colorStr}}`;
                }
            }
            else {
                content += ' ';
            }
        }
        content += "\n";
    }
    return content;
}
 
let uverse = createUverse(box.width - 2, box.height - 2, config);
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
box.focus();
box.setLabel({text: ` ${uverse.turns} `, side: 'right'});
box.setContent(genContent(box, uverse));
screen.render();
setInterval(() => {
        while (!tick(uverse)){}
        box.setLabel({text: ` ${uverse.turns} `, side: 'right'});
        box.setContent(genContent(box, uverse));
        screen.render();
    },
    200
);

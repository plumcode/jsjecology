var Jecolib = function (config) {
	this.charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()[]{}';
	this.initConfig = config;
	this.defConfig = {
		displayAge: true,
		displayPop: true,
		baseLifeforms: 200,
		higherLifeforms: 20,
		plantCycle: 10,
		turnsWithoutFood : 20,
		reproThreshold : 3
	};
 
	this.overlayConfig = () => {
		let config = {};
		for (i in this.defConfig) {
			config[i] = this.defConfig[i];
		}
		for (i in this.initConfig) {
			config[i] = this.initConfig[i];
		}
		return config;	
	}

	this.randInt = upper => Math.floor(Math.random() * upper);
 
	this.lookupKey = (x, y) => `${x},${y}`;
 
	this.checkLookup = (lookup, x, y) => {
		if (typeof lookup[this.lookupKey(x, y)] == "undefined") {
			return false;
		}
		return true;
	};
 
	this.addLifeform = (uverse, x, y, lifeform) => {
		uverse.lifeforms.push(lifeform);
		uverse.lfLookup[this.lookupKey(x, y)] = lifeform;
		return lifeform;
	}
 
	this.deleteLifeform = (uverse, x, y) => {
		uverse.lifeforms = uverse.lifeforms.filter(lf => lf.x != x || lf.y != y);
		delete uverse.lfLookup[this.lookupKey(x, y)];
	}
 
	this.updateLifeform = (uverse, x, y, lf) => {
		if (this.checkLifeform(uverse, x, y)) {
			this.deleteLifeform(uverse, x, y);
			this.addLifeform(uverse, lf.x, lf.y, lf);
		}
	}
 
	this.getLifeform = (uverse, x, y) => uverse.lfLookup[this.lookupKey(x, y)];
 
	this.levelToChar = (level, charset) => charset[level % charset.length]
 
	this.checkBounds = (uverse, x, y) => x >= 0 && x < uverse.width && y >= 0 && y < uverse.height;
 
//let checkLifeform = (uverse, x, y) => checkBounds(uverse.lfLookup, x, y) && checkLookup(uverse.lfLookup, x, y);
	this.checkLifeform = (uverse, x, y) => this.checkLookup(uverse.lfLookup, x, y);
 
	this.listHlf = (uverse) => uverse.lifeforms.filter(lf => lf.level != 0);
	this.listLlf = (uverse) => uverse.lifeforms.filter(lf => lf.level == 0);
 
	this.createLlf = (x, y, config, isMature=false) => ({
		x: x, y: y, level: 0, isMature: isMature, turnsToMaturity: config.plantCycle
	});
	 
	this.createHlf = (x, y, config, level = 1) => ({
		x: x, y: y, level: level, maxTurnsWithoutFood: config.turnsWithoutFood, turnsWithoutFood: 0
	});
 
	this.createLf = (uverse, count, createFn) => {
		for (let i = 0; i < count; i++) {
			let x, y;
			do {
				x = this.randInt(uverse.width);
				y = this.randInt(uverse.height);
			} while (this.checkLifeform(uverse, x, y));
			let lifeform = createFn(x, y, uverse.config);
			this.addLifeform(uverse, x, y, lifeform);
		}
	};
 
	this.getLfInitiative = (uverse) => {
		uverse.initiative = [];
		let hlfs = this.listHlf(uverse);
		while (hlfs.length > 0) {
			let idx = this.randInt(hlfs.length);
			uverse.initiative.push(hlfs[idx]);
			hlfs.splice(idx, 1);
		}
		let llfs = listLlf(uverse);
		while (llfs.length > 0) {
			let idx = this.randInt(llfs.length);
			uverse.initiative.push(llfs[idx]);
			llfs.splice(idx, 1);
		}
	}
 
	this.lfRadius = (uverse, lf, rad) => {
		let lfList = [];
		let max = rad * 2 + 1;
		let xArr = [-rad, rad, -rad, rad];
		let yArr = [-rad, -rad, rad, rad];
		for (let n = 0; n < rad * 2 + 1; n++) {
	 
	 
		}
	}
 
	this.lfTick = (uverse, lf) => {
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
				this.deleteLifeform(uverse, lf.x, lf.y);
				return;
			}
	 
		}
		this.updateLifeform(uverse, x, y, lf);
	}
 
	this.tick = (uverse) => {
		let newTurn = false;
		if (uverse.initiative.length == 0) {
			this.getLfInitiative(uverse);
			newTurn = true;
			uverse.turns++;
		}
		this.lfTick(uverse, uverse.initiative[0]);
		uverse.initiative.splice(0, 1);
		return newTurn;
	}
 
	this.createUverse = (width, height, config) => {
		let ret = {};
		ret.width = width;
		ret.height = height;
		ret.config = config;
		ret.lifeforms = [];
		ret.lfLookup = {};
		ret.initiative = [];
		ret.turns = 0;
		this.createLf(ret, config.baseLifeforms, this.createLlf);
		this.createLf(ret, config.higherLifeforms, this.createHlf);
		return ret;
	}
 
	return this; 
	//this.uverse = createUverse(box.width - 2, box.height - 2, config);
}
/*
setInterval(() => {
        while (!tick(uverse)){}
        screen.render();
    },
    200
);
*/

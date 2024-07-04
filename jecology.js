let config = {};
let jecolib = new Jecolib(config);

let colors = [
	"rgb(43 206 72)",
	"rgb(94 241 242)",
	"rgb(143 124 0)",
	"rgb(157 204 0)",
	"rgb(0 117 220)",
	"rgb(148 255 181)",
	"rgb(116 10 255)",
	"rgb(153 63 0)",
	"rgb(0 153 143)",
	"rgb(66 102 0)",
	"rgb(128 128 128)",
	"rgb(153 0 0)",
	"rgb(194 0 136)",
	"rgb(224 255 102)",
	"rgb(240 163 255)",
	"rgb(255 0 16)",
	"rgb(255 80 5)",
	"rgb(255 168 187)",
	"rgb(255 164 5)",
	"rgb(255 204 153)",
	"rgb(255 225 0)",
	"rgb(255 255 128)",
	"rgb(255 255 255)"
];

let universe;

let canvasFullscreen = (canvas, width) => {
	canvas.width = window.innerWidth - 400;
	canvas.height = window.innerHeight;

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	let height = Math.floor(canvas.height * width / canvas.width),
	universe = jecolib.createUverse(width, height, jecolib.overlayConfig());
	console.log(universe);
	drawBoard(canvas, width, Math.floor(canvas.height * width / canvas.width), universe);

	console.log(`${canvas.width} x ${canvas.height}`);
	var settings = document.getElementById("canvas");
}

let drawBoard = (canvas, gridx, gridy, uverse) => {
    let ctx = canvas.getContext('2d');
	let border = 40;
	let width = canvas.width - border*2;
	let height = canvas.height - border*2;
	let xw = width / gridx;
	let yh = height / gridy;
	let fontW = Math.floor(xw * 1.25);
	ctx.font = `${fontW}px Courier New`;
	for (let i = 1; i < gridx; i++) {
		for (let j = 1; j < gridy; j++) {
			let lf = jecolib.getLifeform(uverse, i, j); 
			if (typeof lf !== "undefined") {
				ctx.fillStyle = colors[lf.level % colors.length];
				if (lf.level === 0) {
					ctx.fillStyle = colors[0];
					if (lf.isMature) {
						ctx.fillText("A", border + i*xw, border + j*yh);
					}
					else {
						ctx.fillText("a", border + i*xw, border + j*yh);
					}
				}
				else {
					ctx.fillText(jecolib.levelToChar(lf.level, jecolib.charset), border + i*xw, border + j*yh);
				}
				ctx.stroke(); // Render the path
			}
		}
	}
}


var canvas = document.getElementById('canvas');
canvasFullscreen(canvas, 100);









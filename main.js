
function random(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

const canvasMargin = 20;
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
let nearbyThreshold;

function init() {
	canvasWidth = canvas.width = window.innerWidth * 0.8;
	canvasHeight = canvas.height = Math.min(window.innerHeight - ((canvasMargin * 2) + canvasMargin), canvasWidth);
	nearbyThreshold = canvasWidth * 0.5;
}

const allCircles = [];

function createCircles(amount) {
	if (amount === 0) {
		return;
	}

	allCircles.push({
		x: random(0, canvasWidth),
		y: random(0, canvasHeight),
		xVelocity: random(-10, -1) / 10,
		yVelocity: random(1, 10) / 10,
		size: random(4, 8),
		ttl: random(800, 1000)
	});

	return createCircles(amount - 1);
}

function allCirclesExcept(except) {
	return allCircles.filter(circle => {
		return circle !== except;
	});
}

function getDistance(source, target) {
	var a = source.x - target.x;
	var b = source.y - target.y;

	var c = Math.round(Math.sqrt( a*a + b*b ));
	return c;
}

function isNearby(source, target) {
	return getDistance(source, target) < nearbyThreshold;
}

function drawLineFrom(source, target, intensity) {
	const alpha = 1 - (intensity / nearbyThreshold);
	context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
	context.beginPath();
	context.moveTo(source.x, source.y);
	context.lineTo(target.x, target.y);
	context.lineWidth = 1;
	context.stroke();
}

function removeIfDead(circle) {
	if (circle.ttl-- <= 0) {
		allCircles.splice(allCircles.indexOf(circle), 1);
	}
}

function checkBounds(circle) {
	circle.x += circle.xVelocity;
	circle.y += circle.yVelocity;

	if ((circle.x + circle.size) >= canvasWidth) {
		circle.xVelocity = -circle.xVelocity;
	}

	if ((circle.x - circle.size) <= 0) {
		circle.xVelocity = -circle.xVelocity;
	}

	if ((circle.y + circle.size) >= canvasHeight) {
		circle.yVelocity = -circle.yVelocity;
	}

	if ((circle.y - circle.size) <= 0) {
		circle.yVelocity = -circle.yVelocity;
	}
}

function drawCircle(circle) {
	context.fillStyle = `rgba(255, 255, 255, 0.9)`;
	context.beginPath();
	context.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
	context.stroke();
	context.fill();
}

function handleMesh(primaryCircle) {
	const nearbyCircles = allCirclesExcept(primaryCircle)
		.filter(secondaryCircle => isNearby(primaryCircle, secondaryCircle))
		.forEach(nearbyCircle =>
			drawLineFrom(primaryCircle, nearbyCircle, getDistance(primaryCircle, nearbyCircle)));
}

function draw() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvasWidth, canvasHeight);

	allCircles.forEach(circle => {
		removeIfDead(circle);
		checkBounds(circle);
		drawCircle(circle);
		handleMesh(circle);
	});

	if (Math.random() > 0.98) {
		createCircles(1);
	}

	requestAnimationFrame(draw);
}

function onResize() {

}

function handleResize() {
	window.addEventListener('resize', onResize);
}

function start() {
	init();
	handleResize();
	createCircles(10);
	draw();
}

start();
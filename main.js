
function random(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
let nearbyThreshold;

function init() {
	canvasWidth = canvas.width = window.innerWidth * 0.8;
	canvasHeight = canvas.height = canvasWidth;
	nearbyThreshold = canvasWidth * 0.5;
}

const allCircles = [];


function createCircles(amount) {
	if (amount === 0) return;

	allCircles.push({
		x: random(0, canvasWidth),
		y: random(0, canvasHeight),
		xVelocity: random(-10, -1) / 10,
		yVelocity: random(1, 10) / 10,
		size: 3,
		ttl: random(800, 2000)
	});

	return createCircles(amount-1);
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
	// console.log(alpha);
	context.strokeStyle = `rgba(255,255,255,${alpha})`;
	context.beginPath();
	context.moveTo(source.x, source.y);
	context.lineTo(target.x, target.y);
	context.stroke();
}

function draw() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvasWidth, canvasHeight);

	allCircles.forEach(circle => {
		if (!circle.ttl--) {
			allCircles.splice(allCircles.indexOf(circle), 1);
		}
	});

	allCircles.forEach(circle => {
		circle.x += circle.xVelocity;
		circle.y += circle.yVelocity;

		if (Math.random() > 0.9) {
			if (circle.x > canvasWidth) {
				circle.x = canvasWidth;
				circle.xVelocity = -circle.xVelocity;
			}

			if (circle.x <= 0) {
				circle.x = 0;
				circle.xVelocity = -circle.xVelocity;
			}

			if (circle.y > canvasHeight) {
				circle.y = canvasHeight;
				circle.yVelocity = -circle.yVelocity;
			}

			if (circle.y <= 0) {
				circle.y = 0;
				circle.yVelocity = -circle.yVelocity;
			}
		}
	});

	allCircles.forEach(circle => {
		context.fillStyle = 'white';
		context.beginPath();
		context.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
	});

	allCircles.forEach(primaryCircle => {
		const nearbyCircles = allCirclesExcept(primaryCircle).filter(secondaryCircle => {
			return isNearby(primaryCircle, secondaryCircle);
		});

		nearbyCircles.forEach(nearbyCircle => {
			drawLineFrom(primaryCircle, nearbyCircle, getDistance(primaryCircle, nearbyCircle));
		});
	});

	if (Math.random() > 0.98) {
		createCircles(1);
	}

	requestAnimationFrame(draw);
}

function start() {
	init();
	createCircles(6);
	draw();
}

start();
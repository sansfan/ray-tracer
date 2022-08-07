console.log("Greetings, this is my Ray Tracer test, feel free to look into my code, in case anyone else is reading this although probably im the only one")

//All code is original except for the formula that determines whether a ray intersects a sphere

/**
Assumptions: 

Y is up
all coordinates are just units, doesn't matter as long as it's consistent
viewport is the same as canvas resolution
camera is facing down the z axis
viewport is perpendicular to z axis, Z axis intersects center of viewport
Each pixel is going to be a 1 unit square
**/


/**
BUG/TODO LIST:

Add lighting/shadows

Add other shapes

Make the fixes less... hacky

optimize the code, remove unnecessary loops and variables

understand how the code for the intersection of a sphere works so that I can debug better

find a way to construct objects and add them to the scene without having to manually do it by copy and pasting it

make code DRYer, find a way to customize viewport width/canvas width without having the entire thing break

find a way to calculate closest objects by the ray's path, it uses distance from the center of the object, which doesn't work for object overlap(ex. sphere is further away but has greater radius and therefore juts out of a smaller sphere, this jut wont be shown

add rotations

**/

/** HELPFUL TIPS!!

FOV is simply the distance between the origin(the starting point of rays) and the viewport, higher FOV means less distance.

Sphere distortion may be caused by too high of a field of view

**/

//Variables

var viewportLength, viewportWidth, viewportZ;
viewportLength = 500;
viewportWidth = 500;
viewportZ = 1000;

var camX, camY, camZ;
camX = 100;
camY = 0;
camZ = 0;

var resX = 1; //x and y coordinate of the...
var resY = 1; //...pixel that is being rendered


//Canvas Setup
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
/**Canvas doesn't have the option to draw individual pixels, which is the only primitive function that I want for this test, so I'll just fill a 1x1 rectangle instead of a pixel**/

context.translate(-1, -1); //0,0 is the first pixel displayed, not 1,1 for some reason, and thus the bottom right corner is 499,499 || 500,500 is not visible, this changes that

//context.fillRect(x, y, width, height);
//above is function to draw a rect with desired properties
//context.fillStyle = color;
//above changes the fill style, default black

//scene
var sphere1 = {
	x : 0,
	y : 0,
	z : 500,
	radius : 50,
	color : "red"
};
var sphere2 = {
	x : 122,
	y : 33,
	z : 500,
	radius : 33,
	color : "blue"
};
var sphere3 = {
	x : 0,
	y : 0,
	z : 501,
	radius : 100,
	color : "black"
};
var sphere4 = {
	x : -100,
	y : 33,
	z : 500,
	radius : 33,
	color : "blue"
};
var sphere5 = {
	x : 11,
	y : -100,
	z : 500,
	radius : 33,
	color : "blue"
};
var scene = [sphere1, sphere2, sphere3, sphere4, sphere5];




function drawPixel(x, y, color) { //draws 1x1 pixel at (x, y) with color color 
	context.fillStyle = color;
	context.fillRect(x, y, 1, 1);
}

function createSphere(x, y, z, radius, color) { //creates sphere and adds it to the scene
	this.x = x;
	this.y = y;
	this.z = z;
	this.radius = radius;
	this.color = color;
	return this;
}

function traceRay(x1, y1, z1, x2, y2, z2) { //traces ray that goes from x1,y1,z1 to x2,y2,z2 and iterates through all objects to see if it passes through, returns color of first obj it passes
	/**I am sorry for I have sinned copying code from stack overflow ;-; **/
	// var closestSphere;
	// var closestDistance = 9999999999; //unlikely that an object would be so far away and be the closest object
	// var spheresPassThrough = 0; //how many spheres the ray has passed through
	// for (i = 0; i < scene.length; i++) {  //  this for loop finds the closest sphere, i need to make it so that it only works when there's more than one sphere that ray passes through
		// var sx = scene[i].x;
		// var sy = scene[i].y;
		// var sz = scene[i].z;
		// var dist = Math.sqrt(Math.sqrt((sx * sx) + (sy * sy)) + (sz*sz));
		// console.log(dist);
		// if (dist < closestDistance) {
			// closestDistance = dist;
			// closestSphere = scene[i];
		// }
		// console.log(scene[i].color);
		// console.log(i);
	// }
	var spheresPassThrough = []; //stores the object of each sphere that the ray passes
	var sphereColor;
	for (i = 0; i < scene.length; i++) { //this is a really hacky loop fix
		var sphere = scene[i];
		var vx = x2 - x1;
		var vy = y2 - x1;
		var vz = z2 - x1;
		var A = vx * vx + vy * vy + vz * vz; //some spooky math that calculates if line has intersected a sphere(its a quadratic equation with D as discriminant, so if D is 0 only one intersection etc.)
		var B = 2.0 * (x1 * vx + y1 * vy + z1 * vz - vx * sphere.x - vy * sphere.y - vz * sphere.z);
		var C = x1 * x1 - 2 * x1 * sphere.x + sphere.x * sphere.x + y1 * y1 - 2 * y1 * sphere.y + sphere.y * sphere.y + z1 * z1 - 2 * z1 * sphere.z + sphere.z * sphere.z - sphere.radius * sphere.radius;
		var D = B * B - 4 * A * C;
		if (D >= 0) {
				spheresPassThrough.push(sphere);
				sphereColor = scene[i].color;
		}
	}
	if (spheresPassThrough.length > 1) { //this should be removed asap ...
		var closestSphere;
		var closestDistance = 9999999999; //unlikely that an object would be so far away and be the closest object
		for (i = 0; i < spheresPassThrough.length; i++) {    
			var sx = spheresPassThrough[i].x;
			var sy = spheresPassThrough[i].y;
			var sz = spheresPassThrough[i].z;
			var dist = Math.sqrt(Math.sqrt((sx * sx) + (sy * sy)) + (sz*sz));
			if (dist < closestDistance) {
				closestDistance = dist;
				closestSphere = spheresPassThrough[i];
			}
		}
		return closestSphere.color;
	}
	else if (spheresPassThrough == 0) {
			return "white";
	}
	else {
		return sphereColor;
	}
}

function main() { //wrap this main() function with a while loop: while (resY < 500) {main();}
	var x2 = -viewportWidth/2 + resX; //since the z axis intersects the center, this will put the point at the bottom left of the viewport
	var y2 = -viewportLength/2 + resY; //i dont know if x should be negative or positive... if the code doesn't work maybe change that
	var color = traceRay(camX, camY, camZ, x2, y2, viewportZ); 
	drawPixel(resX, resY, color);
}



function draw() { //draws a single frame
	while (resY < viewportLength) {
		for (resX = 1; resX <= viewportWidth; resX++) {
			main();
		}
	resY = resY + 1;
	}
	resY = 1;
	resX = 1;
}

draw();

//extra stuff

//changing sphere xyz by input

var inputz = document.getElementById("sphere-z");
var inputy = document.getElementById("sphere-y");
var inputx = document.getElementById("sphere-x");
var hideall = document.getElementById("hideall");

inputx.addEventListener("input", inputXX);
inputy.addEventListener("input", inputYY);
inputz.addEventListener("input", inputZZ);
hideall.addEventListener("input", hideAllF);


function hideAllF() {
	if (hideall.checked) {
		sphere1.radius = 0;
		sphere3.radius = 0;
		sphere4.radius = 0;
		sphere5.radius = 0;
	} 
	else {
		sphere1.radius = 50;
		sphere3.radius = 100;
		sphere4.radius = 33;
		sphere5.radius = 33;
	}
	draw();
}

function inputXX() {
	sphere2.x = inputx.value; 
	draw();
}

function inputYY() {
	sphere2.y = inputy.value;
	draw();
}
function inputZZ() {
	sphere2.z = inputz.value;
	draw();
}

var textarea = document.getElementById("inject");
var p = document.getElementById("injectee");

function change() {
	p.innerHTML = textarea.value;
}

setInterval(change, 200);



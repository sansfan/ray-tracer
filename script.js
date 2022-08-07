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

/**Concepts for future stuff

How to add rotation:

When you rotate something, make sure that one pixel is always 1 when using pythagorean thereom. So 1 = x**2 + y**2 + z**2. changing these 3 values is what causes rotation!


Shadows! draw a ray from points of intersection of sphere and line,  to the light source, if it hits an object, it's dark, if it goes to the light source, it's bright.
You can draw a number of rays with varying positions around it to determine how dark/light it should be.
**/

//Variables

var viewportLength, viewportWidth, viewportX, viewportY, viewportZ;
viewportLength = 500;
viewportWidth = 500;
viewportX = 0;
viewportY = 0;
viewportZ = 1000;

//viewport coordinates are for the center of the viewport.

var camX, camY, camZ;
camX = 0;
camY = 0;
camZ = 0;

var resX = 1; //x and y coordinate of the...
var resY = 1; //...pixel that is being rendered

//light source
var lightX = 0;
var lightY = 0;
var lightZ = 500;



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
	z : 2000,
	radius : 400,
	color : "red"
};
var sphere2 = {
	x : 122,
	y : 33,
	z : 6000,
	radius : 33,
	color : "blue"
};
var sphere3 = {
	x : 0,
	y : 0,
	z : 3010,
	radius : 200,
	color : "black"
};
var sphere4 = {
	x : -100,
	y : 33,
	z : 5000,
	radius : 3,
	color : "blue"
};
var sphere5 = {
	x : 11,
	y : -100,
	z : 1500,
	radius : 10,
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

function traceRay(x1, y1, z1, x2, y2, z2) { //traces ray that goes from x1,y1,z1 to x2,y2,z2 and returns color of first obj it passes, goes through the scene and calculates for each object if it passes
	/**I am sorry for I have sinned copying code from stack overflow ;-; **/
	/** I did it!! first time getting the equation right **/
	/** x0, y0, z0 are coordinates for sphere center **/
	var x0, y0, z0;
	/** a1, b1, c1 is direction the line is going in **/
	var a1, b1, c1;
	/** x3, y3, z3, x4, y4, z4 are coordinates of intersectrion points
	var x3, y3, z3, x4, y4, z4;
	var t1, t2;
	//you can use x1, y1, z1 or x2, y2, z2 for point the line passes through.
	/** ((2(x1 + y1 + z1 - x0 - y0 - z0))**2) - (4 * (x1**2 + x0**2 - (2 * x0 * x1) + y1**2 + y0**2 - (2 * y0 * y1) + z1**2 + z0**2 - (2 * z0 * z1) - (scene[i].radius)**2) * (a1**2 + b1**2 + c1**2)) is the discriminant **/
	var intersectionPoints = [];
	for (i = 0; i <= (scene.length - 1); i++) {
		x0 = scene[i].x;
		y0 = scene[i].y;
		z0 = scene[i].z;
		a1 = x2 - x1;
		b1 = y2 - y1;
		c1 = z2 - z1;
		//quadA, quadB, and quadC are just the components of quadratic equation so i can debug easier
		
		var quadA = a1**2 + b1**2 + c1**2;
		var quadB = 2*((a1 * x1) - (a1 * x0) + (b1 * y1) - (b1 * y0) + (c1 * z1) - (c1 * z0));
		var quadC = x1**2 + x0**2 - (2 * x0 * x1) + y1**2 + y0**2 - (2 * y0 * y1) + z1**2 + z0**2 - (2 * z0 * z1) - scene[i].radius**2;
		
		var quadD = quadB**2 - (4 * quadA * quadC);

		if (quadD == 0) {
			t1 = (-quadB)/(2 * quadA);
			if (t1 >= 1) {
				intersectionPoints.push([x1 + (t1 * a1), y1 + (t1 * b1), z1 + (t1 * c1), scene[i].color]);
		
			}
		}
		else if (quadD > 0) {
			t1 = (-quadB + Math.sqrt(quadD))/(2 * quadA);
			t2 = (-quadB - Math.sqrt(quadD))/(2 * quadA);
			if (t1 >= 1 && t2 >= 1) {
				intersectionPoints.push([x1 + (t1 * a1), y1 + (t1 * b1), z1 + (t1 * c1)], scene[i].color);
				intersectionPoints.push([x1 + (t2 * a1), y1 + (t2 * b1), z1 + (t2 * c1), scene[i].color]);
			}
		}

		
			
	}
	var closestDistance = 99999999999 //unlikely it would be further, i could do some negative number shenanigans to represent infinity
	var closeX = 0;
	var closeY = 0;
	var closeZ = 0;
	var closeColor = "white";
	for (i = 0; i <= (intersectionPoints.length - 1); i++) { //finds the closest intersection point
		if (closestDistance > Math.sqrt(intersectionPoints[i][0]**2 + intersectionPoints[i][1]**2 + intersectionPoints[i][2]**2)) {
			closeX = intersectionPoints[i][0];
			closeY = intersectionPoints[i][1];
			closeZ = intersectionPoints[i][2];
			closeColor = intersectionPoints[i][3];
		}
	}


	return [closeX, closeY, closeZ, closeColor];

		

	
		
				
}


//shadow function draws a ray from an intersection point to a light source, if it hits an object, shade the pixel dark
//returns the true color
function shadow(lightsourceX, lightsourceY, lightsourceZ, intersectionX, intersectionY, intersectionZ, intersectionColor) {

}

//spheres are all black because I drew a line, not a ray.
function main() { //wrap this main() function with a while loop: while (resY < 500) {main();}
	var x2 = -viewportWidth/2 + resX; //since the z axis intersects the center, this will put the point at the bottom left of the viewport
	var y2 = -viewportLength/2 + resY; //i dont know if x should be negative or positive... if the code doesn't work maybe change that
	var closeArray = traceRay(camX, camY, camZ, x2, y2, viewportZ);
	var lightArray = traceRay(lightX, lightY, lightZ, closeArray[0], closeArray[1], closeArray[2]);
	var color;
	if (lightArray[3] == "white") {
		color = closeArray[3];
	}
	else {
		color = "black";
	}
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

inputx.addEventListener("change", inputXX);
inputy.addEventListener("change", inputYY);
inputz.addEventListener("change", inputZZ);
hideall.addEventListener("change", hideAllF);


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



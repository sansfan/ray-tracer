# ray-tracer

WARNING: This IS THE WRONG VERSION AND IS EXTREMELY BROKEN, FIX IT WITH THE BACKUPS ON MY OLD COMPUTER. I was experimenting with a few lighting things and after fiddling with values I broke it. Use one of the backups and upload that.


This is a simple ray tracer that I will use to develop my knowledge of computer graphics.

Currently it can only do the very simple task of ray tracing spheres of various colors without shading.

To Do:

-possibly develop raster graphics as a separate project
-add lighting (most important)
-possibly convert to different language to make it easier to work with



The current project is a web page using HTML, CSS, and Javascript, just download all the components and run the HTML file in your web browser.


How to add lighting:

Trace a ray from the point on the sphere that the light ray interscects to the center of the lighting source. If it doesn't intersect anything on the way to the lighting source, it should be lit up, if it does intersect something, it should be shadow.

This is a very simple lighting that doesn't take into account diffraction of rays or anything else at all and the sphere will be two colors: black for not lit up and the color of the sphere for where it is lit up. This also only works with one light source so think about how to trace multiple rays or something. A way to add multiple light sources is to draw a ray from the point on the sphere to each light source and change the color depending on how many light sources have a clear line of sight to the point on the sphere.



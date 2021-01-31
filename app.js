// console.log("app.js conected") app is connected to the html
// first grab the canvas and set it to a variable
const canvas = document.querySelector("canvas");
// console.log(canvas);
// resizing canvas to make it fit to screen.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// grab the context so I can use its api to draw and do everything
let ctx = canvas.getContext("2d");

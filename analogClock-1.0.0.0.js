/*
The MIT License (MIT) https://mit-license.org/

Copyright 2018 Everest Software LLC https://www.hmisys.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the “Software”), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sub-license, and/or sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES 
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

https://www.webnots.com/analog-clock-with-html5-canvas-and-javascript used as example.
*/

AnalogClock = function(idStr, options) {                          

 if ((typeof idStr === "undefined") || (idStr == '')) {
  alert("Analog clock: Make sure to provide an id string.");
  return false;
 };

 this.id=idStr;

 if (typeof options === "undefined") 
  options = Object();
 
 this.cRef = {};
 this.ctx = {};
 this.borderMargin = options.borderMargin ? options.borderMargin : 10;
 this.borderWidth = options.borderWidth ? options.borderWidth : 10;
 this.handEnd = options.handEnd ? options.handEnd : "round";  //square
 this.hourHandWidth = options.hourHandWidth ? options.hourHandWidth : 10;
 this.minuteHandWidth = options.minuteHandWidth ? options.minuteHandWidth : 10;
 this.secondHandWidth = options.secondHandWidth ? options.secondHandWidth : 2;
 this.hourHandColor = options.hourHandColor ? options.hourHandColor : "black";
 this.minuteHandColor = options.minuteHandColor ? options.minuteHandColor :"black";
 this.secondHandColor = options.secondHandColor ? options.secondHandColor : "black";
 this.dialCenterSize = options.dialCenterSize ? options.dialCenterSize : 8;
 this.dialCenterColor = options.dialCenterColor ? options.dialCenterColor : "black";
 this.numberMargin = options.numberMargin ? options.numberMargin : "0.90";
 this.fontOffset = options.fontOffset ? options.fontOffset : "0.25";
 this.backgroundColor = options.backgroundColor ? options.backgroundColor : "white"; 
 this.borderColor = options.borderColor ? options.borderColor : "black";
 this.fontColor = options.fontColor ? options.fontColor : "black";
 this.fontSize = options.fontSize ? options.fontSize : 20;
 this.fontName = options.fontName ? options.fontName : "Verdana";
 this.imageSrc = options.imageSrc ? options.imageSrc : "";
 this.hourHandPercent = options.hourHandPercent ? options.hourHandPercent : 0.65;
 this.minuteHandPercent = options.minuteHandPercent ? options.minuteHandPercent : 0.85;
 this.secondHandPercent = options.secondHandPercent ? options.secondHandPercent : 0.95;
 this.AMPMVisible = options.AMPMVisible ? options.AMPMVisible : false;
 this.AMPMOffset = options.AMPMOffset ? options.AMPMOffset : 0.25;

 this.AMPMFrame = options.AMPMFrame ? options.AMPMFrame : 1;        //none, rectangle, round rectangle
 this.AMPMFrameColor = options.AMPMFrameColor ? options.AMPMFrameColor : "red";

 this.AMPMColor = options.AMPMColor ? options.AMPMColor : "black";
 this.AMText = options.AMText ? options.AMText : "AM";
 this.PMText = options.PMText ? options.PMText : "PM";
 this.AMPMFont = options.AMPMFont ? options.AMPMFont : "Verdana";
 this.AMPMFontSize = options.AMPMFontSize ? options.AMPMFontSize : 12;

 this.cRef = document.getElementById(this.id);  //a reference to the canvas
 if (this.cRef) {
  this.ctx = this.cRef.getContext("2d");
  this.cRef.width = this.cRef.offsetWidth;		//intrinsic and extrinsic need to match 		
  this.cRef.height = this.cRef.offsetHeight; 
  }
 else
  return;

 this.clockWidth2 = this.cRef.width / 2;
 this.clockHeight2 = this.cRef.height / 2;
 this.borderWidth2 = this.borderWidth / 2;

 this.h = 0;
 this.m = 0;
 this.s = 0;

 this.centerPt = {
       x:this.clockWidth2, 
       y:this.clockHeight2};

 this.hourHandLength = ((this.centerPt.x - this.borderMargin)) * this.hourHandPercent;
 this.minuteHandLength = ((this.centerPt.x - this.borderMargin)) * this.minuteHandPercent;
 this.secondHandLength = ((this.centerPt.x - this.borderMargin)) * this.secondHandPercent;
   
 if (this.imageSrc != "") {
  this.bgImg = new Image(this.cRef.width,this.cRef.height);
  this.bgImg.src = this.imageSrc;
  };

 this.DrawAMPM = function() {
  if (this.h > 12)
   str = this.PMText
  else
   str = this.AMText;

  this.ctx.textBaseline="top";                              //y is the text top
  this.ctx.textAlign = "center";                            //x is the center of the text
  this.ctx.font = this.AMPMFontSize.toString() + "px " + this.AMPMFont;
  this.ctx.fillStyle = this.AMPMColor;
  var y = this.centerPt.y + (this.clockHeight2 * this.AMPMOffset); //vertical top
  var textWidth = this.ctx.measureText(str).width;                  //text width
  this.ctx.fillText(str, this.centerPt.x, y);                       //draw the text
   
  this.ctx.strokeStyle = this.AMPMFrameColor;
  this.ctx.lineWidth = 1;
  var x = this.centerPt.x - (textWidth / 2);

  switch(this.AMPMFrame) {
   case 1:
    this.ctx.strokeRect(x - 2, y, textWidth + 3, this.AMPMFontSize + 3);
    break;
   case 2:
    this.RoundRect(x - 2, y, textWidth + 3, this.AMPMFontSize + 3, 3);
    break;
   }; 

  this.ctx.textBaseline = "alphabetic";       //default
  this.ctx.textAlign = "start";               //default
 };

 this.DrawCenter = function() {
  if (this.dialCenterSize > 0) {
   this.ctx.beginPath();
	this.ctx.fillStyle = this.dialCenterColor;
   this.ctx.strokeStyle = this.dialCenterColor;
   this.ctx.arc(this.centerPt.x, this.centerPt.y, this.dialCenterSize, 0, Math.PI * 2, false);
   this.ctx.fill();
   this.ctx.stroke();
  };
 };

 this.DrawClock = function() {
  if (!this.ctx)
   return;

  if (typeof this.bgImg !== "undefined") { 
   this.ctx.drawImage(this.bgImg, 0, 0);
   }
  else {
	this.ctx.beginPath();
	this.ctx.fillStyle = this.backgroundColor;
//x,y, radius, start angle, end angle (radins), counterclockwise
	this.ctx.arc(this.centerPt.x,this.centerPt.y,this.clockWidth2 - this.borderMargin,0, Math.PI * 2,true); 
	this.ctx.fill();
	this.ctx.strokeStyle = this.borderColor;
	this.ctx.lineWidth = this.borderWidth;
	this.ctx.stroke();
   this.DrawNumber();
  };

  this.DrawPointer(360 * (this.h/12) + (this.m/60) * 30-90,this.hourHandLength,this.hourHandColor,this.hourHandWidth);
  this.DrawPointer(360 * (this.m/60) + (this.s/60) * 6-90,this.minuteHandLength,this.minuteHandColor,this.minuteHandWidth);
  this.DrawPointer(360 * (this.s/60) + -90,this.secondHandLength,this.secondHandColor,this.secondHandWidth);

  this.DrawCenter();
  if (this.AMPMVisible) 
   this.DrawAMPM();
 };

 this.DrawClock2 = function(h,m,s) {    //used by the configuration editor
  this.TimeUpdate(h,m,s);
  this.DrawClock(); 
 };

 this.DrawNumber = function() {
  this.ctx.font = this.fontSize.toString() + "px " + this.fontName;//    "example 26px Verdana";
  this.ctx.fillStyle = this.fontColor;

  var radius = (this.clockWidth2 - this.borderMargin - this.borderWidth2) * this.numberMargin;
  var step = (Math.PI * 2) / 12;
  var angle = -90 * Math.PI / 180 + step;

  for(n=1; n < 13; n++) {
   var str = n.toString();
   var textWidth = this.ctx.measureText(str).width / 2;

   var x = Math.round(this.centerPt.x + radius * Math.cos(angle)) - textWidth;
   var y = Math.round(this.centerPt.y + radius * Math.sin(angle)) + (this.fontSize * this.fontOffset);
   this.ctx.fillText(str, x, y); 
   angle += step;
  };
 };

 this.DrawPointer = function(deg,len,color,w) {
  var rad = (Math.PI/180 * deg);
  var x = this.centerPt.x + Math.cos(rad) * len;
  var y = this.centerPt.y + Math.sin(rad) * len;

  this.ctx.beginPath();
  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = w;
  this.ctx.lineCap = this.handEnd; 

  this.ctx.moveTo(this.centerPt.x, this.centerPt.y);
  this.ctx.lineTo(x, y);
  this.ctx.stroke();
 };

 this.TimeUpdate = function(h,m,s) {
  this.h = h;
  this.m = m;
  this.s = s;
 };


 this.RoundRect = function (x, y, w, h, radius) {
  var r = x + w;
  var b = y + h;
  this.ctx.lineWidth = 1;
  this.ctx.moveTo(x+radius, y);
  this.ctx.lineTo(r-radius, y);
  this.ctx.quadraticCurveTo(r, y, r, y+radius);
  this.ctx.lineTo(r, y+h-radius);
  this.ctx.quadraticCurveTo(r, b, r-radius, b);
  this.ctx.lineTo(x+radius, b);
  this.ctx.quadraticCurveTo(x, b, x, b-radius);
  this.ctx.lineTo(x, y+radius);
  this.ctx.quadraticCurveTo(x, y, x + radius, y);
  this.ctx.stroke();
 };

};



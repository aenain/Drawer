/* ------------------------------------------------------------------------
    Title:          Tiny Doodle
    
    Version:        0.2
    URL:            http://tinydoodle.com/
    
    Description:
        Tiny Doodle is an exercise in learning about <canvas>.
        Event handlers are attached the to <canvas> elemet for both
        mouse and touch input devices. The user can doodle away on the
        <canvas>, clear and save the resulting doodle.
        
        Saving the doodle extracts the canvas data in base64 format,
        POST's the string to a Python service which stores it in a 
        database.
    
    Author:         Andrew Mason
    Contact:        a.w.mason at gmail dot com
    Author's Site:  http://coderonfire.com/
    
    Requirements:
        * Jquery 1.3+
    
    Changelog:
        0.1 (28th May 2009)
            - First demo build
        0.2 (30th May 2009)
            - Addded Pen and Eraser
            - Commented code
            - 
    
    Todo:
        * Error checking and handling
        * Clean up code
        * Add yellow throber to indicate added images
        * Add share links
    
    Licence:
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

------------------------------------------------------------------------ */

// Run once the DOM is ready
$(document).ready(function () {
    doodle.init();
});

var doodle = {
    // Define some variables
    'drawing':          false,
    'linethickness':    1,
    'width':            100,
    'height':           100, 
    'saveCallback': 	  null
};

doodle.init = function() {
    // Collect elements from the DOM and set-up the canvas
    doodle.canvas = $('#sketch')[0];
    doodle.context = doodle.canvas.getContext('2d');
    doodle.oldState = doodle.context.getImageData(0, 0, doodle.width, doodle.height);
    
    doodle.newDoodle();
  
    // Mouse based interface
    $(doodle.canvas).bind('mousedown', doodle.drawStart);
    $(doodle.canvas).bind('mousemove', doodle.draw);
    $(doodle.canvas).bind('mouseup', doodle.drawEnd);
    $(doodle.canvas).bind('mouseleave', function() {
        doodle.context.putImageData(doodle.oldState, 0, 0);
    });
    $('body').bind('mouseup', doodle.drawEnd);
    
    // Touch screen based interface
    $(doodle.canvas).bind('touchstart', doodle.drawStart);
    $(doodle.canvas).bind('touchmove', doodle.draw);
    $(doodle.canvas).bind('touchend', doodle.drawEnd);
    
    // Add save event to save button
    // $(doodle.saveID).bind('click', doodle.saveImage);
    
    // Add clear canvas event
    // $(doodle.newID).bind('click', doodle.newDoodle);
};

doodle.saveImage = function(ev) {
    // Extract the Base64 data from the canvas and post it to the server
    base64 = doodle.canvas.toDataURL("image/png");

	$.post('/drawings', { image: base64 }, function(response) {
		if (typeof doodle.saveCallback == "function")
			doodle.saveCallback(response);
	});
}

doodle.newDoodle = function(src, id) {
    doodle.clearCanvas();
}

doodle.clearCanvas = function(ev) {
    // Clear existing drawing
    doodle.context.clearRect(0,0, doodle.canvas.width, doodle.canvas.height);
    doodle.canvas.width = doodle.canvas.width;
    
    // Set the background to white.
    // then reset the fill style back to black
    doodle.context.fillStyle = '#FFFFFF';
    doodle.context.fillRect(0, 0, doodle.canvas.width, doodle.canvas.height);
    doodle.context.fillStyle = '#000000';
    
    // Clear state
    doodle.oldState = doodle.context.getImageData(0, 0, doodle.width, doodle.height);
    
    // Set the drawning method to pen
    doodle.pen();
 }

doodle.drawStart = function(ev) {
    ev.preventDefault();
    // Calculate the current mouse X, Y coordinates with canvas offset
    var x, y;
    x = ev.pageX - $(doodle.canvas).offset().left;
    y = ev.pageY - $(doodle.canvas).offset().top;
    doodle.drawing = true;
    doodle.context.lineWidth = doodle.linethickness;

    // Store the current x, y positions
    doodle.oldX = x;
    doodle.oldY = y;
}

doodle.draw = function(event) {

    // Calculate the current mouse X, Y coordinates with canvas offset
    var x, y;
    x = event.pageX - $(doodle.canvas).offset().left;
    y = event.pageY - $(doodle.canvas).offset().top;
    
    // If the mouse is down (drawning) then start drawing lines
    if(doodle.drawing) {
        doodle.context.putImageData(doodle.oldState, 0, 0);
        doodle.context.strokeStyle = doodle.colour;
        doodle.context.beginPath();
        doodle.context.moveTo(doodle.oldX, doodle.oldY);
        doodle.context.lineTo(x, y);
        doodle.context.closePath();
        doodle.context.stroke();
        doodle.oldState = doodle.context.getImageData(0, 0, doodle.width, doodle.height);
    } else {
    
        doodle.context.putImageData(doodle.oldState, 0, 0);
        
        doodle.context.beginPath();
        doodle.context.arc(x, y, doodle.linethickness, 0, 2 * Math.PI, false);
        
        doodle.context.lineWidth = 3;
        doodle.context.strokeStyle = '#fff';
        doodle.context.stroke();
     
        doodle.context.lineWidth = 1;
        doodle.context.strokeStyle = '#000';
        doodle.context.stroke();
    
    }
    
    // Store the current X, Y position
    doodle.oldX = x;
    doodle.oldY = y;
    
};


// Finished drawing (mouse up)
doodle.drawEnd = function(ev) {
    doodle.drawing = false;
}

// Set the drawing method to pen
doodle.pen = function() {
    // Change color and thickness of the line
    doodle.colour = '#000000';
}

doodle.hide = function() {
  $(doodle.canvas).hide();
}

doodle.show = function() {
  $(doodle.canvas).show();
}
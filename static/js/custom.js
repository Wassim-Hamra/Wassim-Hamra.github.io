jQuery(document).ready(function() {
	
	"use strict";

var flexSlider = function() {
  $('.probootstrap-slider').flexslider({
    animation: "fade",
    prevText: "",
    nextText: "",
    slideshowSpeed: 3500, // Adjust to 5 seconds
    animationSpeed: 1000, // Adjust to 1 second
    slideshow: true,
    directionNav: false,
    controlNav: true
  });
};
$(document).ready(function() {
  flexSlider(); // Ensure this is called after DOM is loaded
});



});
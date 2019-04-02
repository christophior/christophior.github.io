/**
 * Bluish by Wired Dots (https://wireddots.com)
 * Copyright 2018
 */
$(function () {

	// init feather icons
	feather.replace();

	// init tooltip & popovers
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover();

	//page scroll
	$('a.page-scroll').bind('click', function (event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top - 50
		}, 1000);
		event.preventDefault();
	});

	//toggle scroll menu
	$(window).scroll(function () {
		var scroll = $(window).scrollTop();
		//adjust menu background
		if (scroll >= 200) {
			$('.sticky-navigation').removeClass('navbar-dark').addClass('shadow-bottom').addClass('navbar-light');
		} else {
			$('.sticky-navigation').removeClass('shadow-bottom').removeClass('navbar-light').addClass('navbar-dark');
		}

		// adjust scroll to top
		if (scroll >= 600) {
			$('.scroll-top').addClass('active');
		} else {
			$('.scroll-top').removeClass('active');
		}
		return false;
	});

	// scroll top top
	$('.scroll-top').click(function () {
		$('html, body').stop().animate({
			scrollTop: 0
		}, 1000);
	});
});
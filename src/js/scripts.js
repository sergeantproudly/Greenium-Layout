document.addEventListener('DOMContentLoaded', function() {

	initElements();

	// открытие попапов
	function initModalLinks(element) {
		var $element = $(typeof(element) != 'undefined' ? element : 'body');
		$element.find('.js-modal-link').click(function(e) {
			e.preventDefault();
			showModal($(this).attr('href') ? $(this).attr('href').substring(1) : $(this).attr('data-target').substring(1));
		});
	}
	initModalLinks();

	// лайтбоксы для фотографий
	var galleries = new Array();
	$('.js-lightbox').each(function(i, a) {
		if (!$(a).is('[data-gallery]')) {
			$(a).magnificPopup({
				type: 'image',
				removalDelay: 300,
  				mainClass: 'mfp-fade',
				midClick: true
			});
		} else {
			if (typeof(galleries[$(a).attr('data-gallery')]) == 'undefined') galleries.push($(a).attr('data-gallery'));
		}
	});
	$.each(galleries, function(i, gallery) {
		$('.js-lightbox[data-gallery="' + gallery + '"]').magnificPopup({
			type: 'image',
			removalDelay: 300,
			callbacks: {
		        beforeOpen: function() {
		             $(this.contentContainer).removeClass('fadeOut').addClass('animated fadeIn');
		        },
		        beforeClose: function() {
		        	$(this.contentContainer).removeClass('fadeIn').addClass('fadeOut');
		        }
		    },
			gallery: {
				enabled: true
			},
			midClick: true
		});
	});

	// якорные плавные ссылки
	$('a.js-anchor').click(function(e) {
		e.preventDefault();

		_scrollTo($(this).attr('href'), 0);
	});

	// нижний блюр на десктопе
	function posDecoration2() {
		var offset = $('#about-us').offset();
		$('#layout>.wrap>.decoration2').css({
			bottom: 'auto',
			top: offset.top,
			transform: 'translateY(-100%)'
		});
	}
	function toggleBlur2() {
		if ($(window).width >= __widthMobileTablet && document.documentElement.scrollHeight > 65 * $(window).width) {
			$('#layout>.wrap>.blur2').show();
		} else {
			$('#layout>.wrap>.blur2').hide();
		}
	}
	resizeCallbacks.push(function() {
		toggleBlur2();
		if (!$('header').hasClass('quiz')) {
			posDecoration2();
		}
	});

	// квиз
	var quiz = new quizApp();
	quiz.init();

	$('#quiz .js-btn-next').click(function(e) {
		e.preventDefault();

		if (quiz.calcStep()) {
			$(this).closest('li').stop().fadeOut(__animationSpeed, function() {
				var $liNext = $(this).closest('li').next('li');
				if ($liNext.attr('id') == 'quiz-final') {
					quiz.buildFinal();
				}
				if ($liNext.length) {
					$liNext.stop().fadeIn(__animationSpeed, function() {
						if ($liNext.attr('id') == 'quiz-final') {
							$('header, footer').removeClass('quiz');
							toggleBlur2();
							$('#about-quiz').fadeIn(__animationSpeed);
							$('#about-us').fadeIn(__animationSpeed, function() {
								posDecoration2();
							});
						}
					});
				}
			});
		}
	});
	$('#quiz .js-btn-back').click(function(e) {
		e.preventDefault();

		if (quiz.backStep()) {
			$(this).closest('li').stop().fadeOut(__animationSpeed, function() {
				var $liPrev = $(this).closest('li').prev('li');
				if ($liPrev.length) {
					$liPrev.stop().fadeIn(__animationSpeed);
				}
			});
		}
	});

	// отправка формы заявки
	$('#request-form .btn').click(function(e) {
		e.preventDefault();
		e.stopPropagation();

		$('#request-form').find('input, textarea').addClass('attempted');

		if ($('#request-agree').prop('checked')) {
			// POST HERE

			$('#modal-request .info').stop().slideUp(__animationSpeed);
			$('#modal-request .thanks').stop().slideDown(__animationSpeed);
		}
	});

});
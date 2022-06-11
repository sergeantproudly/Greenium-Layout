function initElements(element) {

	$.fn.lightTabs = function() {
		var showTab = function(tab, saveHash) {
			if (!$(tab).hasClass('tab-act')) {
				var tabs = $(tab).closest('.tabs');

				var target_id = $(tab).attr('href');
		    var old_target_id = $(tabs).find('.tab-act').attr('href');
		    $(target_id).show();
		    $(old_target_id).hide();
		    $(tabs).find('.tab-act').removeClass('tab-act');
		    $(tab).addClass('tab-act');

		    if (typeof(saveHash) != 'undefined' && saveHash) history.pushState(null, null, target_id);
			}
		}

		var initTabs = function() {
            var tabs = this;
            var hasAct = $(tabs).find('.tab-act').length;
            
            $(tabs).find('a').each(function(i, tab){
                $(tab).click(function(e) {
                	e.preventDefault();

                	showTab(this, true);
                	//fadeoutInit();

                	return false;
                });
                if ((!hasAct && i == 0) || (hasAct && $(tab).hasClass('tab-act'))) showTab(tab);             
                else $($(tab).attr('href')).hide();
            });	

            $(tabs).swipe({
							swipeStatus: function(event, phase, direction, distance) {
								var offset = distance;

								if (phase === $.fn.swipe.phases.PHASE_START) {
									var origPos = $(this).scrollLeft();
									$(this).data('origPos', origPos);

								} else if (phase === $.fn.swipe.phases.PHASE_MOVE) {
									var origPos = $(this).data('origPos');

									if (direction == 'left') {
										var scroll_max = $(this).prop('scrollWidth') - $(this).width();
										var scroll_value_new = origPos - 0 + offset;
										$(this).scrollLeft(scroll_value_new);
										if (scroll_value_new >= scroll_max) $(this).addClass('scrolled-full');
										else $(this).removeClass('scrolled-full');

									} else if (direction == 'right') {
										var scroll_value_new = origPos - offset;
										$(this).scrollLeft(scroll_value_new);
										$(this).removeClass('scrolled-full');
									}

								} else if (phase === $.fn.swipe.phases.PHASE_CANCEL) {
									var origPos = $(this).data('origPos');
									$(this).scrollLeft(origPos);

								} else if (phase === $.fn.swipe.phases.PHASE_END) {
									$(this).data('origPos', $(this).scrollLeft());
								}
							},
							threshold: 70
					});	
        };

        return this.each(initTabs);
    };


	var $element = $(typeof(element) != 'undefined' ? element : 'body');

	$element.find('.js-tabs').lightTabs();

	$(window).on('resize',function(){
		onResize();
	});

	$element.find('.modal-close, .close-btn, .modal .js-cancel').click(function(e) {
		e.preventDefault();
		e.stopPropagation();

		/*
		if ($element.find('.modal-wrapper:visible').length > 1) {
			$element.find('.modal-wrapper[data-transparent]').stop().animate({'opacity': 1}, __animationSpeed);
			hideModal(this, true);
		} else {
			hideModal(this, false);
		}
		*/
		// if (!$(this).hasClass('modal-close') || !__isMobileSmall) {
		// 	hideModal(this, false);
		// }
		hideModal(this, false);
	});

	$('body').mouseup(function(e) {
		if ($('#modal-fadeout').css('display') == 'block' && !$('html').hasClass('mobile-opened') && !$('body').hasClass('mfp-zoom-out-cur')) {
			if (!$(e.target).closest('.contents').length) {
				//hideModal();
			}

		} else if ($('.select.opened').length) {
			if (!$(e.target).closest('.select').length) {
				$('.select.opened').removeClass('opened');
			}

		} else if ($('html').hasClass('faded') && $('.search').hasClass('focused')) {
			if (!$(e.target).closest('.search').length) {
				$('.search').removeClass('focused');
				$('html').removeClass('faded');
			}
		} else if ($('.tags .input-holder.opened').length) {
			if (!$(e.target).closest('.input-holder').length) {
				$('.tags .input-holder.opened').removeClass('opened');
			}

		}

	}).keyup(function(e){
		if (!e)e = window.event;
		var key = e.keyCode||e.which;

		if ($('#modal-fadeout').css('display') == 'block' && !$('body').hasClass('mfp-zoom-out-cur')) {			
			if (key == 27) {
				hideModal();
			} 
		} else if ($('.select.opened').length) {
			if (key == 27) {
				$('.select.opened').removeClass('opened');
			}
		} else if ($('html').hasClass('faded') && $('.search').hasClass('focused')) {
			if (key == 27) {
				$('.search').removeClass('focused');
				$('.search input').blur();
				$('html').removeClass('faded');
			}
		}
	});

	$element.find('.input input, .input textarea').on('input focusout', function() {
		$(this).parent('.input').toggleClass('focused', $(this).val() != '');
	}).each(function(i, item) {
		$(item).parent('.input').toggleClass('focused', $(item).val() != '');
	});

	$element.find('textarea.js-autoheight').each(function(i, textarea) {
		if (!$(textarea).data('autoheight-inited')) {
			$(textarea).attr('rows', 1);
			$(textarea).on('input', function() {
				$(this).css('height', 'auto');
        		if ($(this)[0].scrollHeight > 0) $(this).css('height', $(this)[0].scrollHeight+'px');
			});
			if ($(textarea).css('display') != 'none') $(textarea).trigger('input');
			$(textarea).data('autoheight-inited', true);
		}
	});

	$element.find('.input.pswd>.toggler').click(function() {
		var $input = $(this).parent();
		if (!$input.hasClass('shown')) {
			$input.addClass('shown');
			$input.children('input').prop('type', 'text');
		} else {
			$input.removeClass('shown');
			$input.children('input').prop('type', 'password');
		}
	});

	// INPUTS
	$element.find('.input-clearing, .input-password').each(function(i, inputbox) {
		$(inputbox).find('input').on('input', function() {
			var $tool = $(this).siblings('.tool');
			if (!$(this).val()) $tool.hide();
			else $tool.show();
		});
		$(inputbox).find('input').trigger('input');
	});
	$element.find('.input-clearing .tool').click(function() {
		$(this).siblings('input').val('').trigger('input');
	});
	$element.find('.input-password .tool').click(function() {
		var $inputbox = $(this).closest('.input');
		if ($inputbox.hasClass('inphidden')) {
			$inputbox.removeClass('inphidden').addClass('shown')
				.find('input').attr('type', 'text');
		} else {
			$inputbox.removeClass('shown').addClass('inphidden')
				.find('input').attr('type', 'password');
		}
	});

	$element.find('input.date').each(function(i, input) {
		$(input).datepicker();
	});
}

var resizeCallbacks = [
];
function onResize() {
	__isMobile = ($(window).width() < __widthMobile);
	__isMobileDesktop = ($(window).width() < __widthMobileDesktop);
	__isMobileDesktopSmall = ($(window).width() < __widthMobileDesktopSmall);
	__isMobileTablet = ($(window).width() < __widthMobileTablet);
	__isMobileTabletMiddle = ($(window).width() < __widthMobileTabletMiddle);
	__isMobileTabletSmall = ($(window).width() < __widthMobileTabletSmall);
	__isMobileSmall = ($(window).width() < __widthMobileSmall);

	$.each(resizeCallbacks, function(i, func) {
		func();
	});
}

function parseUrl(url) {
	if (typeof(url) == 'undefined') url=window.location.toString();
	var a = document.createElement('a');
	a.href = url;

	var pathname = a.pathname.match(/^\/?(\w+)/i);	

	var parser = {
		'protocol': a.protocol,
		'hostname': a.hostname,
		'port': a.port,
		'pathname': a.pathname,
		'search': a.search,
		'hash': a.hash,
		'host': a.host,
		'page': pathname?pathname[1]:''
	}		

	return parser;
} 

function fixSelfHeight(element) {
	var h = $(element).height();
	$(element).height(h);
}
function unfixSelfHeight(element) {
	$(element).height('auto');
}

function showModal(modal_id, dontHideOthers) {
	var $modal = $('#' + modal_id);

	if (typeof(dontHideOthers) == 'undefined' || !dontHideOthers) $('.modal-wrapper:visible').not($modal).attr('data-transparent', true).stop().animate({'opacity': 0}, __animationSpeed, function() {
			$(this).hide().css('opacity', 1);
		});

	//var display = __isMobileSmall ? 'block' : 'table';
	//var display = 'table';
	//var display = 'block';
	//var display = __isMobileSmall ? 'flex' : 'block';

	// header bug fix
	fixSelfHeight($('header'));

	$('#modal-fadeout').stop().fadeIn(300);
	// if (display === 'flex') $modal.stop().css('display', 'flex').hide().fadeIn(450);
	// else $modal.stop().fadeIn(450);
	 $modal.stop().fadeIn(450);

    var oversize = $(window).height() < $modal.find('.contents').outerHeight(true);
    if (__isMobileSmall && !oversize) $modal.css({
    	display: 'flex'
    });
    var modal_h = $modal.find('.contents').outerHeight(true);

    $('html').addClass('html-modal');

	// if ($modal.attr('data-long') || oversize) {
	// 	$('html').addClass('html-modal-long');

	// 	// if (oversize && __isMobile) {
	// 	// 	var modalHeight = $modal.outerHeight() - parseInt($('#layout').css('padding-top'));
	// 	// 	$('#layout').data('scrollTop', $(window).scrollTop()).addClass('js-modal-overflow').height(modalHeight);
	// 	// 	$modal.css('top', 0);
	// 	// 	$('html,body').scrollTop(0);
	// 	// }
	// } else {
	// 	$('html').addClass('html-modal');
	// }

	// $modal.find('.js-scroll').each(function(index, block) {
	// 	scrollInit(block);
	// });
}

function hideModal(sender, onlyModal) {
	var $modal = sender ? $(sender).closest('.modal-wrapper') : $('.modal-wrapper:visible');
	if (typeof(onlyModal) == 'undefined' || !onlyModal) {
		if (!$('html').hasClass('mobile-opened')) $('#modal-fadeout').stop().fadeOut(300);
		// if ($('#layout').data('scrollTop')) {
		// 	var savedScrollTop =$('#layout').data('scrollTop');
		// 	$('#layout').removeClass('js-modal-overflow').height('auto').removeData('scrollTop');
		// 	$('html,body').scrollTop(savedScrollTop);
		// }
		$modal.stop().fadeOut(450, function() {
			$('html').removeClass('html-modal');
			// $('html').css({
		 //    	overflow: 'visible ',
		 //    	height: 'auto'
		 //    });

			// header bug fix
			unfixSelfHeight($('header'));
		});
	} else {
		$modal.stop().fadeOut(450);
	}
}

/*
function closeModal(sender) {
	if ($('.modal-wrapper:visible').length > 1) {
		$('.modal-wrapper[data-transparent]').stop().animate({'opacity': 1}, __animationSpeed);
		hideModal(sender, true);
	} else {
		hideModal(sender, false);
	}
}
*/

function showModalConfirm(header, btn, action) {
	if (typeof(header) != 'undefined' && header) $('#modal-confirm>.modal>.contents>h1').text(header);
	if (typeof(btn) != 'undefined' && btn) $('#modal-confirm-action-btn').text(btn);
	if (typeof(action) == 'function') {
		$('#modal-confirm-action-btn').click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			action();
			hideModal(this, $('.modal-wrapper:visible').length > 1);
		});
	}
	showModal('modal-confirm', true);
}

function scrollInit(block) {
	if (!$(block).data('inited')) {
		var maxHeight = $(block).attr('data-max-height');
		if (maxHeight < 0) maxHeight = $(block).parent().height() - Math.abs(maxHeight);
		if (maxHeight && $(block).outerHeight() > maxHeight) {
			$(block).css('max-height', maxHeight + 'px').jScrollPane({
					showArrows: false,
					mouseWheelSpeed: 20,
					autoReinitialise: true,
					verticalGutter: 0,
					verticalDragMinHeight: 36
				}
			);
		}
		$(block).data('inited', true);
	}
}

function getOffsetSum(elem) {
	var t = 0, l = 0;
	while (elem) {
		t += t + parseFloat(elem.offsetTop);
		l += l + parseFloat(elem.offsetLeft);
		elem = elem.offsetParent;
	}
	return {top: Math.round(t), left: Math.round(l)};
}
function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect();
	var body = document.body;
	var docElem = document.documentElement;
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	var clientTop = docElem.clientTop || body.clientTop || 0;
	var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	var t  = box.top +  scrollTop - clientTop;
	var l = box.left + scrollLeft - clientLeft;
	return {top: Math.round(t), left: Math.round(l)};
}
function getOffset(elem) {
	if (elem.getBoundingClientRect) {
		return getOffsetRect(elem);
	} else {
		return getOffsetSum(elem);
	}
}

// Animated scroll to target
function _scrollTo(target, offset) {
	var wh = $(window).height();
	if (typeof(offset) == 'undefined') offset = Math.round($(target).outerHeight() /2) - Math.round(wh / 2);
	else if (offset === false) offset = 0;
	$('html,body').animate({
		scrollTop: $(target).offset().top + offset
	}, 1000);
}

function redirect(url) {
  window.location = url;
}

function reload(forceGet) {
  window.location.reload(forceGet);
}

/* EXTEND JQUERY */
jQuery.fn.slideDownFlex = function(durationMS, displayVal, beforeClass, afterClass) {
  var durationMS = durationMS === undefined ? 400 :
              durationMS === 'fast' ? 200 :
              durationMS === 'slow' ? 600 :
              typeof(durationMS) === 'number' ? durationMS :
              400; // failsafe
  var validDisplayVals = ['-webkit-box', '-webkit-inline-box', 'block', 'contents', 'flex', 'flow-root', 'grid', 'inherit', 'initial', 'inline', 'inline-block', 'inline-flex', 'inline-grid', 'inline-table', 'list-item', 'table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row', 'table-row-group'];
  var displayVal = displayVal === undefined ? 'flex' :
        typeof(displayVal) === 'string' && validDisplayVals.indexOf(displayVal) != -1 ? displayVal :
        'flex'; // failsafe
  var el = $(this);
  var height = el.css('display', displayVal)[0].offsetHeight;

  el.css({
          'height': 0,
          'overflow':'hidden'
        }).addClass(beforeClass);

  setTimeout(function(){
    el.css({
      'height':height,
      'transition-property':'height',
      'transition-timing-function':'ease',
      'transition-duration':durationMS+'ms'
    })
  }, 1);

  setTimeout(function(){
    el.removeAttr('style').addClass(afterClass);
  }, durationMS);

  return this;
};
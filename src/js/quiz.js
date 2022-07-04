var quizApp = function() {

	var self = this;
	this.siteUrl = 'https://grinium.ru';
	this.dom = {
		quiz: null,
		steps: null,
		final: null
	}
	this.selectors = {
		quiz: '#quiz',
		steps: '#quiz>.holder>ul>li:not(#quiz-final)',
		variants: '.variants',
		radio: 'input:radio',
		final: '#quiz-final'
	}
	this.finalData = [
		{
			interval: [0, 20000],
			pic: '/assets/images/dino1.png',
			heading: 'Вы — йог-аскет',
			subheading: 'Ваш след $sum гр СО2е в месяц. <br>Таким углеродным следом могут похвастаться лишь 10% россиян.',
			text: 'Иногда природе можно помочь. Примите участие в&nbsp;экологической акции, и вы сможете внести свой вклад в&nbsp;улучшение экологии, не меняя своих привычек, но в&nbsp;ближайшие годы летом будет значительно жарче.',
			shareText: 'Я — йог-аскет, а ты?',
			analyticsEvent: 'test_finished_1'
		},
		{
			interval: [20000, 32000],
			pic: '/assets/images/dino2.png',
			heading: 'Вы — раскрепощенный обыватель',
			subheading: 'Ваш след $sum гр СО2е в месяц. <br>Лишь 30% россиян гененируют след как у&nbsp;вас или меньше',
			text: 'Иногда природе можно помочь. Примите участие в&nbsp;экологической акции, и вы сможете внести свой вклад в&nbsp;улучшение экологии, не меняя своих привычек, но в&nbsp;ближайшие годы летом будет значительно жарче.',
			shareText: 'Я — раскрепощенный обыватель, а ты?',
			analyticsEvent: 'test_finished_2'
		},
		{
			interval: [32000, 40000],
			pic: '/assets/images/dino3.png',
			heading: 'Вы — кандидат на SkyPriority',
			subheading: 'Ваш след $sum гр СО2е в месяц. <br>Есть куда стремиться&nbsp;- у более, чем 50% россиян след меньше',
			text: 'Иногда природе можно помочь. Примите участие в&nbsp;экологической акции, и вы сможете внести свой вклад в&nbsp;улучшение экологии, не меняя своих привычек, но в&nbsp;ближайшие годы летом будет значительно жарче.',
			shareText: 'Я — кандидат на SkyPriority, а ты?',
			analyticsEvent: 'test_finished_3'
		},
		{
			interval: [40000, 1000000],
			pic: '/assets/images/dino4.png',
			heading: 'Вы — неспящий вулкан',
			subheading: 'Ваш след $sum гр СО2е в месяц. <br>Еще немного, и&nbsp;вы станете чемпионом по углеродному следу&nbsp;- вы уже обогнали 90% россиян',
			text: 'Иногда природе можно помочь. Примите участие в&nbsp;экологической акции, и вы сможете внести свой вклад в&nbsp;улучшение экологии, не меняя своих привычек, но в&nbsp;ближайшие годы летом будет значительно жарче.',
			shareText: 'Я — неспящий вулкан, а ты?',
			analyticsEvent: 'test_finished_4'
		}
	];

	this.sum = new Array();
	this.index = 0;
	this.total = 0;

	this.init = function() {
		this.dom.quiz = $(this.selectors.quiz);
		this.dom.steps = $(this.selectors.steps);
		this.dom.steps.each(function(i, step) {
			self.dom.steps[i].variants = $(step).find(self.selectors.variants);
			self.dom.steps[i].variants.each(function(j, variant) {
				self.dom.steps[i].variants[j].radio = $(variant).find(self.selectors.radio);
			});
		});
		this.dom.final = $(this.selectors.final);
		this.total = this.dom.steps.length;
	}

	this.isVariantChecked = function() {
		var checked = false;
		this.dom.steps[this.index].variants.each(function(i, variant) {
			variant.radio.each(function(j, radio) {
				if ($(radio).is(':checked')) {
					checked = true;
				}
			});
		});
		return checked;
	}

	this.calcStep = function() {
		var x,y,z,EB;

		var step = this.dom.steps[this.index];

		// если у вопроса есть подварианты
		if ($(step).attr('data-subvariants')) {
			step.variants.each(function(i, variant) {
				var checked = false;
				var deflt = null;
				variant.radio.each(function(j, radio) {
					if ($(radio).attr('data-default')) deflt = radio;
					if ($(radio).is(':checked')) {
						checked = true;
						eval($(radio).attr('data-step-action'));
					}
				});
				if (!checked) eval($(deflt).attr('data-step-action'));
			});
			this.sum.push(eval($(step).attr('data-step-formula')));

		// обычный вопрос
		} else {
			// выделен ли хотя бы один радиобаттон
			if (!this.isVariantChecked()) return false;

			// data-step-hold — вопрос, который пока нужно пропустить
			if (!$(step).attr('data-step-hold')) {

				// data-step-from-previous — вопрос, вычисления которого нужно объединить с предыдущим
				if ($(step).attr('data-step-from-previous')) {
					var stepPrev = this.dom.steps[this.index - 1];

					step.variants.each(function(i, variant) {
						variant.radio.each(function(j, radio) {
							if ($(radio).is(':checked')) {
								eval($(radio).attr('data-step-action'));
							}
						});
					});
					stepPrev.variants.each(function(i, variant) {
						variant.radio.each(function(j, radio) {
							if ($(radio).is(':checked')) {
								self.sum.push(eval($(radio).attr('data-step-action')));
							}
						});
					});

				// обычный вопрос
				} else {
					step.variants.each(function(i, variant) {
						variant.radio.each(function(j, radio) {
							if ($(radio).is(':checked')) {
								self.sum.push(eval($(radio).attr('data-step-action')));
							}
						});
					});
				}

			}

		}

		this.index++;
		console.log(this.sum);
		return true;
	}

	this.backStep = function() {
		var stepPrev = this.dom.steps[this.index - 1];

		// data-step-hold — вопрос, который пока нужно пропустить
		if (!$(stepPrev).attr('data-step-hold')) {
			this.sum.pop();
		}

		this.index--;
		//console.log(this.sum);
		return true;
	}

	this.getTotalSum = function() {
		var sum = 0;
		for (i = 0; i < this.sum.length; i++){
	      sum += this.sum[i];
	    }
	    return sum;
	}

	this.getFinalData = function() {
		var sum = this.getTotalSum();
		var res = null;
		this.finalData.forEach(function(data, i) {
			if (data.interval[0] < sum && sum <= data.interval[1]) {
				res = data;
			}
		});
		return res;
	}

	this.buildFinal = function() {
		var data = this.getFinalData();

		this.dom.final.children('.pic').html('<img src="' + data.pic + '" alt="' + data.heading + '">');
		this.dom.final.children('.heading').html(data.heading);
		this.dom.final.children('.subheading').html(data.subheading.replace('$sum', Math.round(this.getTotalSum() / 12)));
		this.dom.final.children('.text').html('<p>' + data.text + '</p>');
		this.dom.final.children('.share').children('.tg').attr('href', 'https://t.me/share/url?url=' + encodeURIComponent(this.siteUrl) + '&text=' + encodeURIComponent(data.shareText));
		this.dom.final.children('.share').children('.vk').attr('href', 'https://vk.com/share.php?url=' + encodeURIComponent(this.siteUrl) + '&title=' + encodeURIComponent(data.heading) + '&image=' + encodeURIComponent(data.pic) + '&description=' + encodeURIComponent(data.shareText));

		$('#quiz-result').val(data.analyticsEvent);
	}

}
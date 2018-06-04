///初始化，事件绑定
$(function () {
	///菜单折叠事件
	var menuFirstIco = $('#menu_nav > ul > li em');
	menuFirstIco.each(function (i) {
		$(this).on('click', function () {
			var menuLink = $(this).parent();
			var menuItem = menuLink.parent();

			if (menuLink.hasClass('active')) {
				///取消选中
				menuLink.removeClass('active');
				menuItem.next('ul').slideUp(50);
			} else {
				menuItem.siblings('li').find('.active').each(function (j) {
					$(this).removeClass('active');
					$(this).parent().next('ul').slideUp(50);
				});

				///激活选中
				menuLink.addClass('active');
				menuItem.next('ul').slideDown(50);
			}
		});
	});

	///语言栏
	$('a.search > sub').on('click', function () {
		var langItem = $('#lang');

		if (langItem.css('visibility') == 'hidden') {
			langItem.css('visibility', 'visible');
		} else {
			langItem.css('visibility', 'hidden');
		}
	});

	///角色栏
	$('a.currole > sub').on('click', function () {
		var langItem = $('#TopPopDiv');

		if (langItem.css('visibility') == 'hidden') {
			langItem.css('visibility', 'visible');
		} else {
			langItem.css('visibility', 'hidden');
		}
	});

	///消息栏
	$('a.message').on('click', function () {
		var langItem = $('#RightPopDiv');

		if (langItem.css('visibility') == 'hidden') {
			langItem.css('visibility', 'visible');
		} else {
			langItem.css('visibility', 'hidden');
		}
	});
});
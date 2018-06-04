/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	var week = {
		"0": "/u65e5",
		"1": "/u4e00",
		"2": "/u4e8c",
		"3": "/u4e09",
		"4": "/u56db",
		"5": "/u4e94",
		"6": "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

///窗体大小调整
function ReSetWindowViewSize() {
	var defWidth = $(window).width();
	var defHeight = $(window).height();

	console.log('Current Window Size : ' + defWidth + ' x ' + defHeight);
	console.log('Current Menu Size : 300 x ' + defHeight);
	if (defHeight < 900) {
		defHeight = 900;
	}
	$('#left').height(defHeight);
	$('div.divrightcol').height(defHeight - 66);
}

///初始化，事件绑定
$(function () {
	//屏蔽右键
	document.oncontextmenu = function () { return false; }

	///窗体大小调整
	$(window).resize(ReSetWindowViewSize);

	///窗体大小
	ReSetWindowViewSize();

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

	//
});
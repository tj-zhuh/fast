var chart1, chart2, ball1, ball2;
var chart1_option, chart2_option, ball1_option, ball2_option;

$(function () {
	change_size();

	init_echart_components();

	$(window).resize(on_window_resize);

	refresh();
	ReSetSubViewSize(true);

	FAST.AutoRefrashEvent(refresh, 5);
})

function init_echart_components() {
	var el = document.getElementById("chartDiv1");
	chart1 = echarts.init(el);

	el = document.getElementById("chartDiv2");
	chart2 = echarts.init(el);

	el = document.getElementById("circleDiv1");
	ball1 = echarts.init(el);

	el = document.getElementById("circleDiv2");
	ball2 = echarts.init(el);
}

function on_window_resize() {
	/* 当窗口大小变化 */

	// 修改尺寸
	change_size();

	// Echarts重绘
	ball1.resize();
	ball2.resize();
	chart1.resize();
	chart2.resize();
}

function change_size() {
	var panel = $('.panel');
	panel.height(panel.width() * 1043 / 1603);
	//console.log(panel.width())
	//console.log(panel.width() * 1043 / 1603)
	$('.panel img').width(panel.width());
	$('.panel img').height(panel.width() * 1043 / 1603);
}

function refresh() {
	chart();
	ball();
	getInstantDatas();
}

function chart() {
	var apiname_chart1 = 'GetChartDatas1';
	var apiname_chart2 = 'GetChartDatas2';

	getChartDatas(1, chart1, apiname_chart1, '#11a095', '#fff', '#feeb5b');
	getChartDatas(2, chart2, apiname_chart2, '#7fb536', '#fff');
}

function ball() {
	var apiname_ball1 = 'GetBallDatas1';
	var apiname_ball2 = 'GetBallDatas2';

	getBallDatas(1, ball1, apiname_ball1, false);
	getBallDatas(2, ball2, apiname_ball2, true);
}

function getChartDatas(index, chart, apiname, labelColor, line1Color, line2Color) {
	var url = '../../Concrete/MONITOR_FEED/' + apiname + '/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
	Ext.Ajax.request({
		url: url,
		method: 'get',
		success: function (response, options) {
			showChartDatas(index, JSON.parse(response.responseText), chart, labelColor, line1Color, line2Color);
		},
		failure: function (response, options) {
			//OnResponseError(response);
		}
	});
}

function showChartDatas(index, datas, chart, labelColor, line1Color, line2Color) {
	var app = {};
	option = null;
	option = {
		title: {
			show: false
		},
		grid: {
			left: 0,
			right: 0,
			bottom: '12%',
			top: 0
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			data: datas.tags,
			splitLine: {
				show: false
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: labelColor,
					fontSize: 16,
				},
				margin: 3
			},
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			}
		},
		yAxis: {
			boundaryGap: false,
			type: 'value',
			splitLine: {
				show: false
			},
			axisLabel: {
				show: false
			},
			axisLine: {
				show: false
			},
			axisTick: {
				show: false,
			},
			splitNumber: 5,
			interval: 5,
			max: 9.99,
		},
		series: [
			{
				name: 'T',
				type: 'line',
				data: datas.t_list,
				lineStyle: {
					normal: {
						color: line1Color,
						width: 2
					}
				},
				symbolSize: 5,
				itemStyle: {
					normal: {
						color: line1Color
					}
				},
				animation: false
			},
			{
				name: 'R',
				type: 'line',
				data: datas.r_list,
				lineStyle: {
					normal: {
						color: line2Color,
						width: 2
					}
				},
				symbolSize: 5,
				itemStyle: {
					normal: {
						color: line2Color
					}
				},
				animation: false
			}
		]
	};
	;
	if (option && typeof option === "object") {
		index == 1 ? chart1_option = option : chart2_option = option;

		chart.setOption(option, true);
	}
}

function getBallDatas(index, ball, apiname, ishalf) {
	var url = '../../Concrete/MONITOR_FEED/' + apiname + '/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
	Ext.Ajax.request({
		url: url,
		method: 'get',
		success: function (response, options) {
			if (index == 1) {
				showBallDatas1(index, JSON.parse(response.responseText), ball, ishalf);
			} else if (index == 2) {
				showBallDatas2(index, JSON.parse(response.responseText), ball, ishalf);
			}
		},
		failure: function (response, options) {
			//OnResponseError(response);
		}
	});
}

function showBallDatas1(index, datas, ball, ishalf) {
	if (!datas)
		return;

	var app = {};

	var setting = datas.setting || [];
	var real = datas.real || [];
	var lastPoint = real.length > 0 ? [real[real.length - 1]] : [];
	var firstPoint = setting.length > 0 ? [setting[0]] : [];

	var series = [];
	if (setting.length > 0) {
		series.push({
			name: 'line1',
			type: 'line',
			data: convertData_ball(setting, ishalf),
			symbolSize: 0,
			hoverAnimation: false,
			lineStyle: {
				normal: {
					width: 3,
					color: '#4da8f2'
				},
			},
			animation: false,
		});
	}
	if (real.length > 0) {
		series.push({
			name: 'line2',
			type: 'line',
			data: convertData_ball_Real(real, ishalf),
			symbolSize: 0,
			hoverAnimation: false,
			lineStyle: {
				normal: {
					width: 3,
					color: '#f80aca'
				},
			},
			animation: false,
		});
	}
	if (lastPoint.length > 0) {
		series.push({
			name: 'line3',
			data: convertData_ball_Real(lastPoint, ishalf),
			symbolSize: 6,
			hoverAnimation: false,
			type: 'effectScatter',
			effectType: 'ripple',
			rippleEffect: {
				period: 12,
				scale: 12,
				brushType: 'stroke',
			},
			itemStyle: {
				normal: {
					color: '#fe9200',
				},
			},
			animation: false,
		});
	}
	if (firstPoint.length > 0) {
		series.push({
			name: 'line4',
			data: convertData_ball(firstPoint, ishalf),
			symbolSize: 6,
			hoverAnimation: false,
			type: 'effectScatter',
			effectType: 'ripple',
			rippleEffect: {
				period: 12,
				scale: 12,
				brushType: 'stroke',
			},
			//type: 'scatter',
			//symbolSize: 10,
			//animation: false,
			itemStyle: {
				normal: {
					color: '#1f4fd3',
				},
				opacity: 1,
			},
		});
	}

	option = null;
	option = {
		xAxis: {
			type: 'value',
			boundaryGap: false,
			splitLine: {
				show: false
			},
			axisLabel: {
				show: false
			},
			axisLine: {
				show: false
			},
			min: 0,
			max: 208.48,
			axisTick: {
				show: false,
			},
		},
		yAxis: {
			type: 'value',
			boundaryGap: false,
			splitLine: {
				show: false
			},
			axisLabel: {
				show: false
			},
			axisLine: {
				show: false
			},
			min: 0,
			max: 208.48,
			axisTick: {
				show: false,
			},
		},
		grid: {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		},
		series: series
	};
	if (option && typeof option === "object") {
		index == 1 ? ball1_option = option : ball2_option = option;

		ball.setOption(option, true);
	}
}

function showBallDatas2(index, datas, ball, ishalf) {
	if (!datas)
		return;

	var app = {};

	var setting = datas.setting || [];
	var real = datas.real || [];
	var lastPoint = real.length > 0 ? [real[real.length - 1]] : [];
	var firstPoint = setting.length > 0 ? [setting[0]] : [];

	var series = [];
	if (setting.length > 0) {
		series.push({
			name: 'line1',
			type: 'line',
			data: convertData_ball(setting, ishalf),
			symbolSize: 0,
			hoverAnimation: false,
			lineStyle: {
				normal: {
					width: 3,
					color: '#4da8f2'
				},
			},
			animation: false,
		});
	}
	if (real.length > 0) {
		series.push({
			name: 'line2',
			type: 'line',
			data: convertData_ball_Real(real, ishalf),
			symbolSize: 0,
			hoverAnimation: false,
			lineStyle: {
				normal: {
					width: 3,
					color: '#f80aca'
				},
			},
			animation: false,
		});
	}
	if (lastPoint.length > 0) {
		series.push({
			name: 'line3',
			data: convertData_ball_Real(lastPoint, ishalf),
			symbolSize: 6,
			hoverAnimation: false,
			type: 'effectScatter',
			effectType: 'ripple',
			rippleEffect: {
				period: 12,
				scale: 12,
				brushType: 'stroke',
			},
			itemStyle: {
				normal: {
					color: '#fe9200',
				},
			},
			animation: false,
		});
	}
	if (firstPoint.length > 0) {
		series.push({
			name: 'line4',
			data: convertData_ball(firstPoint, ishalf),
			symbolSize: 6,
			hoverAnimation: false,
			type: 'effectScatter',
			effectType: 'ripple',
			rippleEffect: {
				period: 12,
				scale: 12,
				brushType: 'stroke',
			},
			//type: 'scatter',
			//symbolSize: 10,
			//animation: false,
			itemStyle: {
				normal: {
					color: '#1f4fd3',
				},
				opacity: 1,
			},
		});
	}

	option = null;
	option = {
		xAxis: {
			type: 'value',
			boundaryGap: false,
			splitLine: {
				show: false
			},
			axisLabel: {
				show: false
			},
			axisLine: {
				show: false
			},
			min: 0,
			max: 208.48,
			axisTick: {
				show: false,
			},
		},
		yAxis: {
			type: 'value',
			boundaryGap: false,
			splitLine: {
				show: false
			},
			axisLabel: {
				show: false
			},
			axisLine: {
				show: false
			},
			min: 0,
			max: 162.1413,   //37.94
			axisTick: {
				show: false,
			},
		},
		grid: {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		},
		series: series
	};
	if (option && typeof option === "object") {
		index == 1 ? ball1_option = option : ball2_option = option;

		ball.setOption(option, true);
	}
}

function convertData_ball(data, ishalf) {
	var res = [];

	//var k = ishalf ? 165.0 / 438.0 : 1;

	for (var i in data) {
		var item = data[i];
		if (ishalf) {
			var x = item.X + 208.48 / 2 - 5;
		}
		else {
			var x = item.X + 208.48 / 2;
		}
		if (ishalf) {
			var y = 162.1413 + item.Y
		}
		else {
			var y = item.Y + 208.48 / 2;
		}
		res.push([x, y]);
	}

	return res;
};

function convertData_ball_Real(data, ishalf) {
	var res = [];

	//var k = ishalf ? 165.0 / 438.0 : 1;

	for (var i in data) {
		var item = data[i];
		if (ishalf) {
			var x = (item.X + 208.48 / 2) * 208.48 / 500 - 5;
		}
		else {
			var x = (item.X + 208.48 / 2) * 208.48 / 500;
		}
		if (ishalf) {
			var y = (162.1413 + item.Y) * 162.1413 / 300;
		}
		else {
			var y = (item.Y + 208.48 / 2) * 208.48 / 500;
		}
		res.push([x, y]);
	}

	return res;
};

function getInstantDatas() {
	var url = '../../Concrete/MONITOR_FEED/GetInstantDatas/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
	Ext.Ajax.request({
		url: url,
		method: 'get',
		success: function (response, options) {
			showInstantDatas(JSON.parse(response.responseText));
		},
		failure: function (response, options) {
			//OnResponseError(response);
		}
	});
}

function showInstantDatas(datas) {
	$('#span-t-x').html(toFormat(datas.tx));
	$('#span-t-y').html(toFormat(datas.ty));
	$('#span-t-z').html(toFormat(datas.tz));
	$('#span-r-x').html(toFormat(datas.rx));
	$('#span-r-y').html(toFormat(datas.ry));
	$('#span-r-z').html(toFormat(datas.rz));
	$('#span-d-x').html(toFormat(datas.dx));
	$('#span-d-y').html(toFormat(datas.dy));
	$('#span-d-z').html(toFormat(datas.dz));
}

function toFormat(value) {
	return value > 0 ? '&nbsp;' + value : value;
}

function ReSetSubViewSize(isFirstLoad) {
	var $center = $('.main-center-container');
	var defWidth = $center.width();
	var defHeight = $center.height();

	if ((defWidth + 300) < FAST.visibleWidth && (defHeight + 109) <= FAST.visibleHeight) {
		defWidth += 17;
	}

	$('.monitor-feed-container').height(defHeight - 10);
};
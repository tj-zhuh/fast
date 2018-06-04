var chart;
var ball;

var chart_option;
var ball_option;

$(function () {
	change_size();

	init_echart_components();

	$(window).resize(on_window_resize);

	ReSetSubViewSize(true);

	refresh();
	FAST.AutoRefrashEvent(refresh, 5);
})

function init_echart_components() {
	var el = document.getElementById("chartDiv");
	chart = echarts.init(el);

	el = document.getElementById("circleDiv");
	ball = echarts.init(el);
}

function on_window_resize() {
	/* 当窗口大小变化 */

	// 修改尺寸
	change_size();

	// Echarts重绘
	chart.resize();
	ball.resize();
	refresh();
}

function change_size() {
	var panel = $('.panel');
	panel.height(panel.width() * 726 / 1577);
	$('.panel img').width(panel.width());
	$('.panel img').height(panel.width() * 726 / 1577);
	var bottomPanel = $('.bottom-panel');
	//debugger;
	bottomPanel.css('top', panel.height() + parseFloat(panel.css('top')));
	//bottomPanel.width(panel.width());
}

function refresh() {
	getChartDatas();
	getBallDatas();
	getInstantDatas();
}

function getInstantDatas() {
	Ext.Ajax.request({
		url: '../../Concrete/MONITOR_REFLECTOR/GetInstantDatas/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'get',
		success: function (response, options) {
			showInstantDatas(JSON.parse(response.responseText));
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function showInstantDatas(datas) {
	if (datas && datas.T) {
		$("#spanT").html(datas.T);
	} else {
		$("#spanT").html('000.000');
	}

	if (datas && datas.R) {
		$("#spanR").html(datas.R);
	} else {
		$("#spanR").html('000.000');
	}

	if (datas && datas.D) {
		$("#spanD").html(datas.D);
	} else {
		$("#spanD").html('000.000');
	}

	if (datas && datas.Number1) {
		$("#number1").html(datas.Number1);
	} else {
		$("#number1").html('0');
	}

	if (datas && datas.Number2) {
		$("#number2").html(datas.Number2);
	} else {
		$("#number2").html('0');
	}

	if (datas && datas.Number4) {
		$("#number3").html(datas.Number4);
	} else {
		$("#number3").html('0');
	}

	if (datas && datas.Number3) {
		$("#number4").html(datas.Number3);
	} else {
		$("#number4").html('0');
	}
}

function getChartDatas() {
	Ext.Ajax.request({
		url: '../../Concrete/MONITOR_REFLECTOR/GetChartDatas/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'get',
		success: function (response, options) {
			showChartDatas(JSON.parse(response.responseText));
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function showChartDatas(datas) {
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
					color: '#37ADA5',
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
				name: 'D',
				type: 'line',
				data: datas.list,
				lineStyle: {
					normal: {
						color: '#fff',
						width: 2
					}
				},
				symbolSize: 5,
				itemStyle: {
					normal: {
						color: '#fff'
					}
				},
				animation: false
			},
		]
	};

	if (option && typeof option === "object") {
		chart_option = option;
		chart.setOption(option, true);
	}
}

function getBallDatas() {
	Ext.Ajax.request({
		url: '../../Concrete/MONITOR_REFLECTOR/GetBallDatas/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'get',
		success: function (response, options) {
			showBallDatas(JSON.parse(response.responseText));
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function showBallDatas(datas) {
	var app = {};
	option = null;

	var arr = datas.list;

	var series_datas = get_series_datas(arr);
	var colors = ['#00fe00', '#fffd00', '#ff0101', '#bfbfbf']; //绿黄红灰 1234

	var series = [];
	for (var i = 0; i < 4; i++) {
		series[i] = {
			type: 'scatter',
			coordinateSystem: 'geo',
			data: series_datas[i],
			symbolSize: 5,
			itemStyle: {
				normal: {
					color: colors[i],
					shadowBlur: 0,
					shadowColor: '#000000',
					shadowOffsetX: 1,
					shadowOffsetY: 1,
					opacity: 1,
				},
			},
			animation: false,
		};
	}

	option = {
		geo: {
			show: false
		},
		series: series
	};

	if (option && typeof option === "object") {
		ball_option = option;
		ball.setOption(option, true);
	}
}

function get_series_datas(arr) {
	// 结合屏幕尺寸，修正地图坐标，修正后的数据保存在变量map2中
	var w = $("#circleDiv").width();
	var h = $("#circleDiv").height();
	var p_w = 1.88;
	var p_h = 1.88;
	var p_x = 2.05;
	var p_y = 3.35;
	var map2 = [];
	for (var i in map) {
		var record = map[i];
		map2.push({
			name: record.name,
			x: (record.x + 248) * h * p_w / 1000 + (w - 5 * h / 6) * p_x / 10,
			y: (record.y * -1 + 248) * h * p_h / 1000 + h * p_y / 100
		});
	}

	var res = [[], [], [], []];

	for (var i in map2) {
		var x = map2[i].x;
		var y = map2[i].y;

		var pt = arr[i] - 1;

		if (res[pt]) {
			res[pt].push({
				name: map2[i].name,
				value: [x, y]
			});
		}
	}

	return res;
}

function ReSetSubViewSize(isFirstLoad) {
	var $center = $('.main-center-container');
	var defWidth = $center.width();
	var defHeight = $center.height();

	if ((defWidth + 300) < FAST.visibleWidth && (defHeight + 109) <= FAST.visibleHeight) {
		defWidth += 17;
	}

	$('.bottom-panel').height(defHeight - 10 - $('.bottom-panel').css('top').replace('px', '') * 1);
};
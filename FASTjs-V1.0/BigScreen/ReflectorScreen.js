$(function () {
	getChartDatas();
	getBallDatas();
	getInstantDatas();

	setInterval(getBallDatas, 10 * 1000);
	setInterval(getChartDatas, 10 * 1000);
	setInterval(getInstantDatas, 10 * 1000);
});

var chart;
var ball;

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
			var el = document.getElementById("chartDiv");
			showChartDatas(el, JSON.parse(response.responseText));
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function showChartDatas(el, datas) {
	if (!chart)
		chart = echarts.init(el);

	var app = {};
	option = null;
	option = {
		title: {
			text: '面形总体误差',
			textStyle: {
				color: '#00feff',
				fontSize: 28,
				fontWeight: 'normal',
			},
			left: '6%',
			top: '8%',
		},
		grid: {
			left: '2%',
			right: '4%',
			bottom: '3%',
			top: '10%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			data: datas.tags,
			splitLine: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#00d9ff',
					fontSize: 16,
				},
			},
			axisLine: {
				lineStyle: {
					color: '#056693',
					width: 2,
				},
			},
			axisTick: {
				show: false,
			},
		},
		yAxis: {
			type: 'value',
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					opacity: 0.8,
					color: '#86C5DD',
					width: 1,
				}
			},
			axisLabel: {
				show: false,
				textStyle: {
					color: '#056693',
					fontSize: 16,
				},
			},
			axisLine: {
				lineStyle: {
					color: '#056693',
					width: 2,
				},
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
				areaStyle: {
					normal: {
						color: '#08354C',
					}
				},
				lineStyle: {
					normal: {
						color: '#037cb5',
						width: 2
					}
				},
				symbolSize: 0,
				animation: false
			},
		]
	};

	if (option && typeof option === "object") {
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
	var el = document.getElementById("circleDiv");
	if (!ball)
		ball = echarts.init(el);

	var app = {};
	option = null;

	var arr = datas.list;

	var series_datas = get_series_datas(arr);
	var colors = ['#00ff00', '#fffd00', '#ff0101', '#aaaaaa']; //绿黄红灰 1234

	var series = [];
	for (var i = 0; i < 4; i++) {
		series[i] = {
			type: 'scatter',
			coordinateSystem: 'geo',
			data: series_datas[i],
			symbolSize: 6,
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
		ball.setOption(option, true);;
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
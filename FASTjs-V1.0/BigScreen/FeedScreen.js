$(function () {
	chart();
	ball();
	getInstantDatas();

	setInterval(chart, 5000);
	setInterval(ball, 5000);
	setInterval(getInstantDatas, 5000);
});

var chart1, chart2, ball1, ball2, dom;

function chart() {
	var apiname_chart1 = 'GetChartDatas1';
	var apiname_chart2 = 'GetChartDatas2';

	if (!chart1) {
		dom = document.getElementById('chartDiv1');
		chart1 = echarts.init(dom);
		console.log('initial chart')
	}

	if (!chart2) {
		dom = document.getElementById('chartDiv2');
		chart2 = echarts.init(dom);
		console.log('initial chart')
	}

	getChartDatas(chart1, apiname_chart1, 'AB轴交点');
	getChartDatas(chart2, apiname_chart2, '馈源相位中心');
}

function ball() {
	var apiname_ball1 = 'GetBallDatas1';
	var apiname_ball2 = 'GetBallDatas2';

	if (!ball1) {
		dom = document.getElementById('circleDiv1');
		ball1 = echarts.init(dom);
		//console.log('initial ball')
	}

	if (!ball2) {
		dom = document.getElementById('circleDiv2');
		ball2 = echarts.init(dom);
		//console.log('initial ball')
	}

	getBallDatas(ball1, apiname_ball1, false);
	getBallDatas(ball2, apiname_ball2, true);
}

function getChartDatas(chart, apiname, titleText) {
	var url = '../../Concrete/MONITOR_FEED/' + apiname + '/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
	Ext.Ajax.request({
		url: url,
		method: 'get',
		success: function (response, options) {
			showChartDatas(JSON.parse(response.responseText), chart, titleText);
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function showChartDatas(datas, chart, titleText) {
	var app = {};
	option = null;
	option = {
		title: {
			text: titleText,
			textStyle: {
				color: '#00feff',
				fontSize: 28,
				fontWeight: 'normal',
			},
			left: '5%',
			top: '5%'
		},
		grid: {
			left: '3%',
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
					opacity: 1,
					color: '#86C5DD',
					width: 1,
				},
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
				name: 'T',
				type: 'line',
				data: datas.t_list,
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
				animation: false,
			},
			{
				name: 'R',
				type: 'line',
				data: datas.r_list,
				areaStyle: {
					normal: {
						color: '#075063',
					}
				},
				lineStyle: {
					normal: {
						color: '#00feff',
						width: 2
					}
				},
				symbolSize: 0,
				animation: false,
			}
		]
	};
	;
	if (option && typeof option === "object") {
		chart.setOption(option, true);
	}
}

function getBallDatas(ball, apiname, ishalf) {
	var url = '../../Concrete/MONITOR_FEED/' + apiname + '/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
	Ext.Ajax.request({
		url: url,
		method: 'get',
		success: function (response, options) {
			if (apiname == 'GetBallDatas1') {
				showBallDatas1(JSON.parse(response.responseText), ball, ishalf);
			} else if (apiname == 'GetBallDatas2') {
				showBallDatas2(JSON.parse(response.responseText), ball, ishalf);
			}
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function showBallDatas1(datas, ball, ishalf) {
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
					color: '#00fc32'
				},
			},
			animation: false,
		});
	}
	if (real.length > 0) {
		series.push({
			name: 'line2',
			type: 'line',
			data: convertData_ball(real, ishalf),
			symbolSize: 0,
			hoverAnimation: false,
			lineStyle: {
				normal: {
					width: 3,
					color: '#fe03ca'
				},
			},
			animation: false,
		});
	}
	if (lastPoint.length > 0) {
		series.push({
			name: 'line3',
			data: convertData_ball(lastPoint, ishalf),
			symbolSize: 6,
			hoverAnimation: false,
			type: 'effectScatter',
			effectType: 'ripple',
			rippleEffect: {
				period: 16,
				scale: 16,
				brushType: 'stroke',
			},
			itemStyle: {
				normal: {
					color: '#aa0000',
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
				period: 16,
				scale: 16,
				brushType: 'stroke',
			},
			//type: 'scatter',
			//symbolSize: 10,
			//animation: false,
			itemStyle: {
				normal: {
					color: '#0013ff',
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
		ball.setOption(option, true);
	}
}

function showBallDatas2(datas, ball, ishalf) {
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
					color: '#00fc32'
				},
			},
			animation: false,
		});
	}
	if (real.length > 0) {
		series.push({
			name: 'line2',
			type: 'line',
			data: convertData_ball(real, ishalf),
			symbolSize: 0,
			hoverAnimation: false,
			lineStyle: {
				normal: {
					width: 3,
					color: '#fe03ca'
				},
			},
			animation: false,
		});
	}
	if (lastPoint.length > 0) {
		series.push({
			name: 'line3',
			data: convertData_ball(lastPoint, ishalf),
			symbolSize: 6,
			hoverAnimation: false,
			type: 'effectScatter',
			effectType: 'ripple',
			rippleEffect: {
				period: 16,
				scale: 16,
				brushType: 'stroke',
			},
			itemStyle: {
				normal: {
					color: '#aa0000',
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
				period: 16,
				scale: 16,
				brushType: 'stroke',
			},
			//type: 'scatter',
			//symbolSize: 10,
			//animation: false,
			itemStyle: {
				normal: {
					color: '#0013ff',
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
			max: 37.94,
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

function getInstantDatas() {
	var url = '../../Concrete/MONITOR_FEED/GetInstantDatas/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
	Ext.Ajax.request({
		url: url,
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
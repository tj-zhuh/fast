//var grid;
//function LoadGridData() {
//	var elementid_chart1 = 'chartDiv1';
//	var elementid_chart2 = 'chartDiv2';

//	var apiname_chart1 = 'GetChartDatas1';
//	var apiname_chart2 = 'GetChartDatas2';

//	getChartDatas(elementid_chart1, apiname_chart1);
//	getChartDatas(elementid_chart2, apiname_chart2);

//	var elementid_ball1 = 'circleDiv1';
//	var elementid_ball2 = 'circleDiv2';

//	var apiname_ball1 = 'GetBallDatas1';
//	var apiname_ball2 = 'GetBallDatas2';

//	getBallDatas(elementid_ball1, apiname_ball1);
//	getBallDatas(elementid_ball2, apiname_ball2);

//	getInstantDatas();
//}

//function getChartDatas(elementid, apiname) {
//	var url = '../../Concrete/MONITOR_FEED/' + apiname + '/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
//	Ext.Ajax.request({
//		url: url,
//		method: 'get',
//		success: function (response, options) {
//			showChartDatas(JSON.parse(response.responseText), elementid);
//		},
//		failure: function (response, options) {
//			OnResponseError(response);
//		}
//	});
//}

//function showChartDatas(datas, elementid) {
//	var dom = document.getElementById(elementid);
//	var myChart = echarts.init(dom);

//	var app = {};
//	option = null;
//	option = {
//		title: {
//			text: ''
//		},
//		tooltip: {
//			trigger: 'axis'
//		},
//		legend: {
//			data: ['T', 'R'],
//			textStyle: {
//				color: '#ffffff',
//				font: 16,
//			},
//			itemGap: 20,
//		},
//		grid: {
//			left: '3%',
//			right: '4%',
//			bottom: '3%',
//			top: '5%',
//			containLabel: true
//		},
//		toolbox: {
//			feature: {
//				saveAsImage: {}
//			}
//		},
//		xAxis: {
//			type: 'category',
//			boundaryGap: false,
//			data: datas.tags,
//			splitLine: {
//				show: false
//			},
//			axisLabel: {
//				textStyle: {
//					color: '#ffffff',
//					fontSize: 16,
//				},
//			},
//			axisLine: {
//				lineStyle: {
//					color: '#ffffff',
//				},
//			},
//		},
//		yAxis: {
//			type: 'value',
//			splitLine: {
//				show: false
//			},
//			axisLabel: {
//				textStyle: {
//					color: '#ffffff',
//					fontSize: 16,
//				},
//			},
//			axisLine: {
//				lineStyle: {
//					color: '#ffffff',
//				},
//			},
//		},
//		series: [
//			{
//				name: 'T',
//				type: 'line',
//				data: datas.t_list,
//			},
//			{
//				name: 'R',
//				type: 'line',
//				data: datas.r_list,
//			}
//		]
//	};
//	;
//	if (option && typeof option === "object") {
//		var startTime = +new Date();
//		myChart.setOption(option, true);
//		var endTime = +new Date();
//		var updateTime = endTime - startTime;
//		console.log("Time used:", updateTime);

//		console.log(myChart.getOption());
//	}
//}

//function getBallDatas(elementid, apiname) {
//	var url = '../../Concrete/MONITOR_FEED/' + apiname + '/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
//	Ext.Ajax.request({
//		url: url,
//		method: 'get',
//		success: function (response, options) {
//			showBallDatas(JSON.parse(response.responseText), elementid);
//		},
//		failure: function (response, options) {
//			OnResponseError(response);
//		}
//	});
//}

//function showBallDatas(datas, elementid) {
//	if (!datas || !datas.length)
//		return;

//	var dom = document.getElementById(elementid);
//	var myChart = echarts.init(dom);
//	var app = {};

//	var lastPoint = datas[datas.length - 1];

//	option = null;
//	option = {
//		tooltip: {
//			trigger: 'item',
//			formatter: function (params) {
//				return params.name;
//			}
//		},

//		xAxis: {
//			type: 'value',
//			boundaryGap: false,
//			splitLine: {
//				show: false
//			},
//			axisLabel: {
//				show: false
//			},
//			axisLine: {
//				show: false
//			},
//			min: 0,
//			max: 100,
//		},
//		yAxis: {
//			type: 'value',
//			splitLine: {
//				show: false
//			},
//			axisLabel: {
//				show: false
//			},
//			axisLine: {
//				show: false
//			},
//			min: 0,
//			max: 100,
//		},

//		series: [
//			{
//				name: 'line1',
//				type: 'line',
//				data: convertData_ball(datas),
//				symbolSize: function (value, param) {
//					if (value[2])
//						return 10;
//					return 0;
//				},
//				hoverAnimation: false,
//			},
//		]
//	};
//	if (option && typeof option === "object") {
//		var startTime = +new Date();
//		myChart.setOption(option, true);
//		var endTime = +new Date();
//		var updateTime = endTime - startTime;
//		console.log("Time used:", updateTime);

//		console.log(myChart.getOption());
//	}
//}

//function convertData_ball(data) {
//	var res = [];

//	for (var i in data) {
//		var item = data[i];
//		var x = item.x;
//		var y = item.y;
//		res.push([x, y, 0]);
//	}

//	res[res.length - 1][2] = 1;

//	return res;
//};

//function getInstantDatas() {
//	var url = '../../Concrete/MONITOR_FEED/GetInstantDatas/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}';
//	Ext.Ajax.request({
//		url: url,
//		method: 'get',
//		success: function (response, options) {
//			showInstantDatas(JSON.parse(response.responseText));
//		},
//		failure: function (response, options) {
//			OnResponseError(response);
//		}
//	});
//}

//function showInstantDatas(datas) {
//	var text_t = 'X: ' + datas.tx + '    Y: ' + datas.ty + '    Z: ' + datas.tz;
//	var text_r = 'X: ' + datas.rx + '    Y: ' + datas.ry + '    Z: ' + datas.rz;
//	var text_d = 'X: ' + datas.dx + '    Y: ' + datas.dy + '    Z: ' + datas.dz;
//	$('#spanT').html(text_t);
//	$('#spanR').html(text_r);
//	$('#spanD').html(text_d);
//}

//function GridPanelToggle() {
//	var oldHeight = $('#DataManage').height();
//	if (oldHeight == 50) {
//		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
//		$('#centerContent').css('display', 'block');
//		$('#DataManage').height(oldHeight);
//		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
//	} else {
//		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
//		$('#centerContent').css('display', 'none');
//		$('#DataManage').height(50);
//		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
//	}
//}

//function ReSetWindowViewSize(isPostBacked) {
//	var defWidth = $(window).width();
//	var defHeight = $(window).height();

//	if (defHeight < 900) {
//		defHeight = 900;
//	}
//	//console.log('Current Operater View Size : ' + defWidth + ' x ' + defHeight);

//	//$('#DataManage').height(defHeight - 210);
//	//$('#pnlGirdView').height(defHeight - 290);

//	///重绘表格
//	if (isPostBacked == true) {
//		//初次加载
//	} else {
//		//调整大小
//		$('div.x-grid-body').height(defHeight - 321);
//		$('div.x-grid-view').height(defHeight - 323);
//	}
//};

/////初始化，事件绑定
//$(function () {
//	///窗体大小调整
//	$(window).resize(ReSetWindowViewSize);

//	///窗体大小
//	ReSetWindowViewSize(true);
//});
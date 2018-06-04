//
/// 获取请求数据
//
function RequestGridViewData(cacheId, columns, autoRefrash, actionURL, modelId, parameters) {
	/// 请求数据
	Ext.create('Ext.data.Store', {
		storeId: cacheId,
		fields: columns,
		autoLoad: autoRefrash,

		proxy: {
			type: 'ajax',
			url: actionURL,
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: modelId,
				successProperty: 'success'
			},
			extraParams: parameters
		},
		listeners: {
			load: function (scope, records, eOpts) {
				if (cacheId == 'storeLoggingInfo') {
					RefreshDataChartView();
				}
			}
		}
	});
}

//
/// 创建数据表格
//
function CreateDataGridView(rendtoId, storeId, columnCofigs, listenerConfigs) {
	$('#' + rendtoId).empty();

	var divPanel = Ext.get(rendtoId);
	window.DataCaches.dataGridView[rendtoId] = Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup(storeId),
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: columnCofigs,

		width: "100%",
		height: "100%",
		renderTo: divPanel,

		listeners: listenerConfigs
	});
}

//
/// TaskSource
//
function GreateTaskSourceView() {
	var storeId = "storeTaskSource";
	var columns = ['SEQUENCE_ID', 'SEQUENCE_NAME', 'SEQUENCE_BEGIN', 'SEQUENCE_TIMELINE'];
	var actionURL = '../../Concrete/TASK_SEQUENCE/GetSources/UserId0000/SessionId0000/';
	var parameters = {
		parameters: '{}'
	};

	RequestGridViewData(storeId, columns, true, actionURL, "SEQUENCE_ID", parameters);

	var columnCofigs = [{
		text: ' ',
		align: 'center',
		dataIndex: 'SEQUENCE_ID',
		sortable: false,
		menuDisabled: true,
		flex: 0.1,
		renderer: function (value, metaData, record, rowIndex, colIndex) {
			window.DataCaches.resourceList[rowIndex] = record.data;
			return '<input id="rdoSosurce' + rowIndex + '" name="rdoSosurce" type="radio" value="' + rowIndex + '" >';
		}
	}, {
		text: '源名',
		align: 'center',
		dataIndex: 'SEQUENCE_NAME',
		sortable: false,
		menuDisabled: true,
		flex: 0.5
	}, {
		text: '开始时间',
		align: 'center',
		dataIndex: 'SEQUENCE_BEGIN',
		sortable: false,
		menuDisabled: true,
		flex: 0.4
	}];

	var listenerConfigs = {
		select: function (scope, record, index, eOpts) {
			var checkObj = document.getElementById('rdoSosurce' + index);
			if (checkObj.checked) {
				checkObj.checked = false;
				window.DataCaches.resourceChosed = -1;
			} else if (checkObj.disabled == false) {
				checkObj.checked = true;
				window.DataCaches.resourceChosed = index;

				if (typeof (delayRequestGridDatas) != 'undefined') {
					clearTimeout(delayRequestGridDatas);
				}
				delayRequestGridDatas = setTimeout('OnColumnListClick()', 1000);

				var typeStore = Ext.data.StoreManager.lookup('storeLoggingType');
				if (!typeStore.data || typeStore.data.length < 1)
					typeStore.reload();
			}
		}
	};

	CreateDataGridView("pnlTaskView", storeId, columnCofigs, listenerConfigs);
}

function HeaderQueryData() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var beingText = Ext.get('txtBEGIN_TIME').dom.value;
	var endText = Ext.get('txtEND_TIME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('storeTaskSource');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_NAME":"' + queryText + '","SEQUENCE_BEGIN":"' + beingText + '","SEQUENCE_END":"' + endText + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			if (!success)
				FAST.OnRequestError(operation);
		}
	});
}

//
/// LoggingType
//
function GreateLoggingTypeView() {
	var storeId = "storeLoggingType";
	var columns = ['DICTIONARY_ID', 'DICTIONARY_NAME', 'DICTIONARY_CODE'];
	var actionURL = '../../Master/MASTER_DICTIONARY/GetModels/UserId0000/SessionId0000/';
	var parameters = {
		parameters: '{"DICTIONARY_TYPE":"LOGGING_TYPE"}'
	};

	RequestGridViewData(storeId, columns, false, actionURL, "DICTIONARY_ID", parameters);

	var columnCofigs = [{
		text: '',
		align: 'center',
		dataIndex: 'DICTIONARY_ID',
		sortable: false,
		menuDisabled: true,
		flex: 0.2,
		renderer: function (value, metaData, record, rowIndex, colIndex) {
			window.DataCaches.loggingList[rowIndex] = record.data;
			return '<input id="rdoLogging' + rowIndex + '" name="rdoLogging" type="radio" value="' + rowIndex + '" >';
		}
	}, {
		text: '日志类型',
		align: 'center',
		dataIndex: 'DICTIONARY_NAME',
		sortable: false,
		menuDisabled: true,
		flex: 0.8
	}];

	var listenerConfigs = {
		select: function (scope, record, index, eOpts) {
			var checkObj = document.getElementById('rdoLogging' + index);
			if (checkObj.checked) {
				checkObj.checked = false;
				window.DataCaches.loggingChosed = -1;
			} else if (checkObj.disabled == false) {
				checkObj.checked = true;
				window.DataCaches.loggingChosed = index;

				/// ColumnList
				var tableCode = window.DataCaches.loggingList[index].DICTIONARY_CODE;
				var $txtColumnCode = $('#txtColumnCode');
				if (tableCode == 'V_MIRRORING_CONTROL') {
					$txtColumnCode.removeClass('x-hide').addClass('x-show').attr('placeholder', '请输入促动器编号');
				} else {
					$txtColumnCode.removeClass('x-show').addClass('x-hide');
				}

				window.DataCaches.columnList = [];
				window.DataCaches.columnChosed = [];
				QueryColumnList();
				GreateLoggingInfoView();
			}
		}
	};

	CreateDataGridView("pnlTypeView", storeId, columnCofigs, listenerConfigs);
}

function ReLoadLoggingTypeData() {
	Ext.data.StoreManager.lookup('storeLoggingType').reload();
}

//
/// ColumnList
//
function GreateColumnListView() {
	var storeId = "storeColumnList";
	var columns = ['COLUMN_NAME', 'COLUMN_COMMENT'];
	var actionURL = '../../Concrete/TASK_LOGGING/GetColumns/UserId0000/SessionId0000/';
	var parameters = {
		parameters: '{"DESCRIPTION_INFO": V_NOVIEW"}'
	};

	RequestGridViewData(storeId, columns, false, actionURL, "COLUMN_NAME", parameters);

	var columnCofigs = [{
		text: '',
		align: 'center',
		dataIndex: 'COLUMN_NAME',
		sortable: false,
		menuDisabled: true,
		flex: 0.2,
		renderer: function (value, metaData, record, rowIndex, colIndex) {
			window.DataCaches.columnList[rowIndex] = record.data;
			//return '<input id="ckbColumn' + rowIndex + '" name="ckbColumn" type="checkbox" value="' + rowIndex + '" onclick="OnColumnCheckBoxClick(' + rowIndex + ');OnStopBubble(this);">';
			return '<a class="x-grid-row-checker" id="ckbColumn' + rowIndex + '" style="margin-top: 16px;" onclick="OnColumnCheckBoxClick(' + rowIndex + ');OnStopBubble(this);"></a>';
		}
	}, {
		text: '数据列表',
		align: 'center',
		dataIndex: 'COLUMN_COMMENT',
		sortable: false,
		menuDisabled: true,
		flex: 0.8
		//renderer: function (value, metaData, record, rowIndex, colIndex) {
		//	var tableCode = window.DataCaches.loggingList[window.DataCaches.loggingChosed].DICTIONARY_CODE;
		//	if (tableCode == 'V_MIRRORING_CONTROL') {
		//		return value + '&nbsp;&nbsp;<input id="lstColumn' + rowIndex + '" class="x-grid-search-input" placeholder="请输入促动器编号" type="text" />';
		//	}
		//	return value;
		//}
	}];

	var listenerConfigs = {
		select: function (scope, record, index, eOpts) {
			OnColumnCheckBoxClick(index);
		}
	};
	CreateDataGridView("pnlColumnView", storeId, columnCofigs, listenerConfigs);
}

function ReLoadColumnListData() {
	Ext.data.StoreManager.lookup('storeColumnList').reload();
}

function OnColumnCheckBoxClick(index) {
	var $checkObj = $('#ckbColumn' + index);

	var tableCode = window.DataCaches.loggingList[window.DataCaches.loggingChosed].DICTIONARY_CODE;
	var columnCode = Ext.get('txtColumnCode').dom.value;
	if (tableCode == 'V_MIRRORING_CONTROL') {
		if (!columnCode) {
			FAST.OnInfoEvent("请先输入要查询的促动器编号！<br/><br/>");
			return;
		}
	}

	if ($checkObj.hasClass('x-checkbox-selected')) {
		$checkObj.removeClass('x-checkbox-selected');
		window.DataCaches.columnChosed[index] = 0;
	} else {
		$checkObj.addClass('x-checkbox-selected');
		window.DataCaches.columnChosed[index] = 1;
	}

	var count = 0;
	for (var i = 0; i < window.DataCaches.columnChosed.length; i++) {
		count += typeof window.DataCaches.columnChosed[i] != 'undefined' ? window.DataCaches.columnChosed[i] : 0;
	}
	if (count > 5) {
		$checkObj.removeClass('x-checkbox-selected');
		window.DataCaches.columnChosed[index] = 0;
		FAST.OnInfoEvent('观测记录最多同时查看五列数据！<br/><br/> ');
		return;
	}
	if (typeof (delayRequestGridDatas) != 'undefined') {
		clearTimeout(delayRequestGridDatas);
	}
	if (tableCode == 'V_SYSTEM_WEATHER') {
		delayRequestGridDatas = setTimeout('OnWeatherColumnListClick()', 1000);
	}
	else {
		delayRequestGridDatas = setTimeout('OnColumnListClick()', 1000);
	}
}

function QueryColumnList() {
	var gridStore = Ext.data.StoreManager.lookup('storeColumnList');

	gridStore.proxy.extraParams = {
		parameters: '{"DESCRIPTION_INFO":"' + window.DataCaches.loggingList[window.DataCaches.loggingChosed].DICTIONARY_CODE + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			if (!success)
				FAST.OnRequestError(operation);
		}
	});
}

function OnColumnListClick() {
	if (window.DataCaches.loggingChosed < 0) { return; }
	if (window.DataCaches.resourceChosed < 0) { return; }

	var queryString = 'SELECT ';
	var columns = ['LASTMODIFY_TIME'];
	var columnCofigs = [];
	var columnList = window.DataCaches.columnList;
	var columnChosed = window.DataCaches.columnChosed;
	for (var i = 0; i < columnChosed.length; i++) {
		if (columnChosed[i] > 0) {
			queryString += columnList[i].COLUMN_NAME + ',';
			columns.push(columnList[i].COLUMN_NAME);
			columnCofigs.push({
				text: columnList[i].COLUMN_COMMENT,
				align: 'center',
				dataIndex: columnList[i].COLUMN_NAME,
				flex: 0.2,
				sortable: false,
				menuDisabled: true
			});
		}
	}
	if (columnCofigs.length < 1) { return; }

	queryString = queryString + 'LASTMODIFY_TIME FROM T_' ///需要建立视图
		+ window.DataCaches.loggingList[window.DataCaches.loggingChosed].DICTIONARY_CODE.substr(2)
		+ " WHERE SEQUENCE_ID='" + window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_ID + "'";

	var tableCode = window.DataCaches.loggingList[window.DataCaches.loggingChosed].DICTIONARY_CODE;
	var columnCode = Ext.get('txtColumnCode').dom.value;
	if (tableCode == 'V_MIRRORING_CONTROL') {
		queryString += " AND DEVICE_ID='" + columnCode + "'";
	}

	var storeId = "storeLoggingInfo";
	var actionURL = '../../Master/TASK_LOGGING/GetGridDatas/UserId0000/SessionId0000/';
	var parameters = {
		parameters: '{"DESCRIPTION_INFO":"' + queryString + '"}'
	};

	RequestGridViewData(storeId, columns, true, actionURL, "", parameters);

	var listenerConfigs = {
		select: function (scope, record, index, eOpts) {
			var checkObj = document.getElementById('rdoLogging' + index);
			if (checkObj.checked) {
				checkObj.checked = false;
				window.DataCaches.loggingChosed = -1;
			} else if (checkObj.disabled == false) {
				checkObj.checked = true;
				window.DataCaches.loggingChosed = index;
			}
		}
	};
	CreateDataGridView("pnlRecordView", storeId, columnCofigs, listenerConfigs)

	//if (typeof (delayRefreshChartDatas) != 'undefined') {
	//	clearTimeout(delayRefreshChartDatas);
	//}
	//delayRefreshChartDatas = setTimeout('RefreshDataChartView()', 1000);
}

function OnWeatherColumnListClick() {
	if (window.DataCaches.loggingChosed < 0) { return; }
	if (window.DataCaches.resourceChosed < 0) { return; }

	var queryString = 'SELECT ';
	var columns = ['WEATHER_DATETIME'];
	var columnCofigs = [];
	var columnList = window.DataCaches.columnList;
	var columnChosed = window.DataCaches.columnChosed;
	for (var i = 0; i < columnChosed.length; i++) {
		if (columnChosed[i] > 0) {
			queryString += columnList[i].COLUMN_NAME + ',';
			columns.push(columnList[i].COLUMN_NAME);
			columnCofigs.push({
				text: columnList[i].COLUMN_COMMENT,
				align: 'center',
				dataIndex: columnList[i].COLUMN_NAME,
				flex: 0.2,
				sortable: false,
				menuDisabled: true
			});
		}
	}
	if (columnCofigs.length < 1) { return; }
	var BeginTime=new Date();
	BeginTime.setFullYear(window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_BEGIN.substr(0, 4));
	BeginTime.setMonth(window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_BEGIN.substr(4, 2));
	BeginTime.setDate(window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_BEGIN.substr(6, 2));
	BeginTime.setHours(window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_BEGIN.substr(9, 2));
	BeginTime.setMinutes(window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_BEGIN.substr(11, 2));
	BeginTime.setSeconds(window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_BEGIN.substr(13, 2));
	var EndTime = new Date();
	EndTime.setTime(Date.parse(BeginTime) + window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_TIMELINE * 1000);
	queryString = queryString + 'WEATHER_DATETIME FROM T_' ///需要建立视图
		+ window.DataCaches.loggingList[window.DataCaches.loggingChosed].DICTIONARY_CODE.substr(2)
		+ " WHERE WEATHER_DATETIME>='" + BeginTime.toFormat("yyyy-MM-dd HH:mm:ss") + "' and WEATHER_DATETIME<='" + EndTime.toFormat("yyyy-MM-dd HH:mm:ss") + "'";

	var storeId = "storeLoggingInfo";
	var actionURL = '../../Master/SYSTEM_WEATHER/GetGridDatas/UserId0000/SessionId0000/';
	var parameters = {
		parameters: '{"DESCRIPTION_INFO":"' + queryString + '"}'
	};

	RequestGridViewData(storeId, columns, true, actionURL, "", parameters);

	var listenerConfigs = {
		select: function (scope, record, index, eOpts) {
			var checkObj = document.getElementById('rdoLogging' + index);
			if (checkObj.checked) {
				checkObj.checked = false;
				window.DataCaches.loggingChosed = -1;
			} else if (checkObj.disabled == false) {
				checkObj.checked = true;
				window.DataCaches.loggingChosed = index;
			}
		}
	};

	CreateDataGridView("pnlRecordView", storeId, columnCofigs, listenerConfigs)

	//if (typeof (delayRefreshChartDatas) != 'undefined') {
	//	clearTimeout(delayRefreshChartDatas);
	//}
	//delayRefreshChartDatas = setTimeout('RefreshWeatherDataChartView()', 5000);
}

function OnStopBubble(e) {
	if (e && e.stopPropagation)
		//因此它支持W3C的stopPropagation()方法
		e.stopPropagation();
	else
		//否则，我们需要使用IE的方式来取消事件冒泡
		window.event.cancelBubble = true;
	return false;
}

//
/// LoggingInfo
//
function GreateLoggingInfoView() {
	var storeId = "storeLoggingInfo";
	var columns = ['MUTULDATA_TIME', 'COLUMN_DATA'];
	var actionURL = '../../Master/TASK_LOGGING/GetGridDatas/UserId0000/SessionId0000/';
	var parameters = {
		parameters: '{}'
	};

	RequestGridViewData(storeId, columns, false, actionURL, "", parameters);

	var columnCofigs = [{
		text: '数据列',
		align: 'center',
		sortable: false,
		menuDisabled: true,
		flex: 0.2
	}, {
		text: '数据列',
		align: 'center',
		sortable: false,
		menuDisabled: true,
		flex: 0.2
	}, {
		text: '数据列',
		align: 'center',
		sortable: false,
		menuDisabled: true,
		flex: 0.2
	}, {
		text: '数据列',
		align: 'center',
		sortable: false,
		menuDisabled: true,
		flex: 0.2
	}, {
		text: '数据列',
		align: 'center',
		sortable: false,
		menuDisabled: true,
		flex: 0.2
	}];
	CreateDataGridView("pnlRecordView", storeId, columnCofigs, {});
}

function ReLoadLoggingInfoData() {
	Ext.data.StoreManager.lookup('storeLoggingInfo').reload();
}
//
/// LoggingChart
//
function GreateLoggingChartView() {
	// 基于准备好的dom，初始化echarts图表
	var myChart = echarts.init(document.getElementById('pnlChartView'));
	window.DataCaches.dataChart = myChart;

	var option = {
		tooltip: {
			show: true
		},
		calculable: true,
		legend: {
			data: ['数据视图']
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: ['01', '02', '03', '04', '05', '06', '07', '08', '09']
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: [
			{
				name: '数据视图',
				type: 'line',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, ]
			}
		]
	};

	// 为echarts对象加载数据
	myChart.setOption(option);
}

function RefreshDataChartView() {
	var myChart = window.DataCaches.dataChart;
	if (myChart == null) { return; }
	if (window.DataCaches.loggingChosed > 7) { return; }

	var dataNames = [];
	var dataTemps = [];
	var xAxisDatas = [];
	var seriesDatas = [];
	var seriesTemps = {};
	var columnList = window.DataCaches.columnList;
	var columnChosed = window.DataCaches.columnChosed;

	for (var i = 0; i < columnChosed.length; i++) {
		if (columnChosed[i] > 0) {
			dataNames.push(columnList[i].COLUMN_COMMENT);
			dataTemps.push(columnList[i].COLUMN_NAME)
			seriesTemps[columnList[i].COLUMN_NAME] = [];
		}
	}

	var gridStore = Ext.data.StoreManager.lookup('storeLoggingInfo');
	for (var i = 0; i < gridStore.data.length; i++) {
		var rowDate = gridStore.getAt(i).data;
		xAxisDatas.push(new Date(rowDate['LASTMODIFY_TIME']).toFormat("yyyy-MM-dd HH:mm:ss"));

		for (var j = 0; j < dataTemps.length; j++) {
			seriesTemps[dataTemps[j]].push(rowDate[dataTemps[j]]);
		}
	}

	for (var k = 0; k < dataNames.length; k++) {
		seriesDatas.push({
			name: dataNames[k],
			type: 'line',
			data: seriesTemps[dataTemps[k]]
		});
	}

	if (dataNames.length < 1) { return; }
	if (xAxisDatas.length < 1) { return; }

	var option = {
		tooltip: {
			show: true
		},
		calculable: true,
		legend: {
			data: dataNames
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: xAxisDatas
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: seriesDatas
	};

	// 为echarts对象加载数据
	//myChart.clear().setOption(option);
	myChart.clear();
	myChart.setOption(option);
}

function RefreshWeatherDataChartView() {
	var myChart = window.DataCaches.dataChart;
	if (myChart == null) { return; }
	//if (window.DataCaches.loggingChosed > 7) { return; }

	var dataNames = [];
	var dataTemps = [];
	var xAxisDatas = [];
	var seriesDatas = [];
	var seriesTemps = {};
	var columnList = window.DataCaches.columnList;
	var columnChosed = window.DataCaches.columnChosed;

	for (var i = 0; i < columnChosed.length; i++) {
		if (columnChosed[i] > 0) {
			dataNames.push(columnList[i].COLUMN_COMMENT);
			dataTemps.push(columnList[i].COLUMN_NAME)
			seriesTemps[columnList[i].COLUMN_NAME] = [];
		}
	}

	var gridStore = Ext.data.StoreManager.lookup('storeLoggingInfo');
	for (var i = 0; i < gridStore.data.length; i++) {
		var rowDate = gridStore.getAt(i).data;
		xAxisDatas.push(new Date(rowDate['WEATHER_DATETIME']).toFormat("yyyy-MM-dd HH:mm:ss"));

		for (var j = 0; j < dataTemps.length; j++) {
			seriesTemps[dataTemps[j]].push(rowDate[dataTemps[j]]);
		}
	}

	for (var k = 0; k < dataNames.length; k++) {
		seriesDatas.push({
			name: dataNames[k],
			type: 'line',
			data: seriesTemps[dataTemps[k]]
		});
	}

	if (dataNames.length < 1) { return; }
	if (xAxisDatas.length < 1) { return; }

	var option = {
		tooltip: {
			show: true
		},
		calculable: true,
		legend: {
			data: dataNames
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: xAxisDatas
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: seriesDatas
	};

	// 为echarts对象加载数据
	//myChart.clear().setOption(option);
	myChart.clear();
	myChart.setOption(option);
}

//
/// 装载内容区域
//
function LoadGridData() {
	window.DataCaches = {
		resourceList: [],
		resourceChosed: -1,

		loggingList: [],
		loggingChosed: -1,

		columnList: [],
		columnChosed: [],

		dataGridView: {},

		dataChart: null
	};

	/// TaskSource
	GreateTaskSourceView();

	/// LoggingType
	GreateLoggingTypeView();

	/// ColumnList
	GreateColumnListView();

	/// TaskSource
	GreateLoggingInfoView();

	/// TaskSource
	GreateLoggingChartView();
}

function ReSetSubViewSize(isFirstLoad) {
	var $center = $('.main-center-container').height(2295);
	var defWidth = $center.width();
	var defHeight = $center.height();
	//if ((defWidth + 300) < FAST.visibleWidth && (defHeight + 109) <= FAST.visibleHeight) {
	//	defWidth += 17;
	//}
	console.log('Current Center Size : ' + defWidth + ' x ' + defHeight);

	$('div.center-grid-basic-border').width(defWidth - 50);//.height(defHeight - (120 + 25 * 2));
	$('div.center-grid-basic-border div.center-grid-basic-area').width(defWidth - 100);//.height(defHeight - (120 + 25 * 2 + 55 + 25));

	$('div.h-center-grid-basic-border').width((defWidth - 75) / 2);//.height(defHeight - (120 + 25 * 2));
	$('div.h-center-grid-basic-border div.center-grid-basic-area').width((defWidth - 125) / 2 - 25);//.height(defHeight - (120 + 25 * 2 + 55 + 25));

	///重绘表格
	if (!isFirstLoad) {
		//调整大小
		$('div.center-grid-basic-border div.x-grid-body').width(defWidth - 100);//.height(defHeight - (120 + 25 * 2 + 55 + 25 + 65));
		$('div.center-grid-basic-border div.x-grid-view').width(defWidth - 100);//.height(defHeight - (120 + 25 * 2 + 55 + 25 + 65 + 2));

		$('div.h-center-grid-basic-border div.x-grid-body').width((defWidth - 125) / 2 - 25);//.height(defHeight - (120 + 25 * 2 + 55 + 25 + 65));
		$('div.h-center-grid-basic-border div.x-grid-view').width((defWidth - 125) / 2 - 25);//.height(defHeight - (120 + 25 * 2 + 55 + 25 + 65 + 2));
	}

	//$('div.x-toolbar-docked-bottom').css('top', defHeight - (120 + 25 * 2 + 55 + 25 + 65));
};

function ViewMinimumSize(objectId) {
	var $border = $('#' + objectId);
	//var $area = $('div.center-grid-basic-area');
	var oldHeight = $border.attr('oldHeight');

	if ($border.hasClass('grid-area-minimum')) {
		$border.removeClass('grid-area-minimum');
		//$area.removeClass('x-hide');
		if (typeof oldHeight != 'undefined')
			$border.height(oldHeight * 1);
	} else {
		$border.addClass('grid-area-minimum');
		//$area.addClass('x-hide');
		$border.attr('oldHeight', $border.height());
		$border.height(51);
	}
}

function GridViewClose(objectId) {
	$('#' + objectId).addClass('x-hide');
}

function exportGrid() {
	FAST.ExportExcel(window.DataCaches.dataGridView['pnlRecordView']);
}

function InitButton() {
	Ext.Ajax.request({
		url: "../../Master/MASTER_USER/GetSession/UserId0000/SessionId0000/?parameters={}&_dc=" + (new Date().getTime()),
		method: 'GET',
		success: function (response, options) {
			var result = JSON.parse(response.responseText).ArrayModels;
			if (result.DESCRIPTION_INFO == "科学家") {
				$('#btnExport').hide();
			}
		},
		failure: function (response, options) {
			FAST.OnResponseError(response);
		}
	});
}

function InitQueryHeader() {
	var date = (Ext.Date.add(new Date(), Ext.Date.DAY, -1)).toFormat("yyyyMMdd");
	$('#txtBEGIN_TIME').attr('placeholder', date);
	$('#txtEND_TIME').attr('placeholder', date);
};

/*
** 全局初始化
********************************************************************************************************************************/

///窗体大小
ReSetSubViewSize(true);
InitButton();
InitQueryHeader();
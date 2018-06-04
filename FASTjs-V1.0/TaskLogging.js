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
	var columns = ['SEQUENCE_ID', 'SEQUENCE_NAME', 'SEQUENCE_BEGIN'];
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
		align: 'left',
		dataIndex: 'SEQUENCE_NAME',
		sortable: false,
		menuDisabled: true,
		flex: 0.55
	}, {
		text: '开机时间',
		align: 'left',
		dataIndex: 'SEQUENCE_BEGIN',
		sortable: false,
		menuDisabled: true,
		flex: 0.35
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
			}
		}
	};

	CreateDataGridView("tblTaskSource", storeId, columnCofigs, listenerConfigs);
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
				Nuts.Caches.onRequestError(operation);
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

	RequestGridViewData(storeId, columns, true, actionURL, "", parameters);

	var columnCofigs = [{
		text: '',
		align: 'center',
		dataIndex: 'DICTIONARY_ID',
		sortable: false,
		menuDisabled: true,
		flex: 0.1,
		renderer: function (value, metaData, record, rowIndex, colIndex) {
			window.DataCaches.loggingList[rowIndex] = record.data;
			return '<input id="rdoLogging' + rowIndex + '" name="rdoLogging" type="radio" value="' + rowIndex + '" >';
		}
	}, {
		text: '日志类型',
		align: 'left',
		dataIndex: 'DICTIONARY_NAME',
		sortable: false,
		menuDisabled: true,
		flex: 0.9
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
				window.DataCaches.columnList = [];
				window.DataCaches.columnChosed = [];
				QueryColumnList();
				GreateLoggingInfoView();
			}
		}
	};

	CreateDataGridView("tblLoggingType", storeId, columnCofigs, listenerConfigs);
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

	RequestGridViewData(storeId, columns, false, actionURL, "", parameters);

	var columnCofigs = [{
		text: '',
		align: 'center',
		dataIndex: 'COLUMN_NAME',
		sortable: false,
		menuDisabled: true,
		flex: 0.1,
		renderer: function (value, metaData, record, rowIndex, colIndex) {
			window.DataCaches.columnList[rowIndex] = record.data;
			return '<input id="ckbColumn' + rowIndex + '" name="ckbColumn" type="checkbox" value="' + rowIndex + '" onclick="OnClickCheck(' + rowIndex + ');OnStopBubble(this);">';
		}
	}, {
		text: '数据列表',
		align: 'center',
		dataIndex: 'COLUMN_COMMENT',
		sortable: false,
		menuDisabled: true,
		flex: 0.9
	}];

	var listenerConfigs = {
		select: function (scope, record, index, eOpts) {
			var checkObj = document.getElementById('ckbColumn' + index);

			if (checkObj.checked) {
				checkObj.checked = false;
				window.DataCaches.columnChosed[index] = 0;
			} else if (checkObj.disabled == false) {
				checkObj.checked = true;
				window.DataCaches.columnChosed[index] = 1;
			}
			if (typeof (delayRequestGridDatas) != 'undefined') {
				clearTimeout(delayRequestGridDatas);
			}
			delayRequestGridDatas = setTimeout('OnColumnListClick()', 1000);
		}
	};
	CreateDataGridView("tblColumnList", storeId, columnCofigs, listenerConfigs);
}
function OnColumnCheckBoxClick(index) {
	var checkObj = document.getElementById('ckbColumn' + index);

	if (checkObj.checked) {
		window.DataCaches.columnChosed[index] = 1;
	} else {
		window.DataCaches.columnChosed[index] = 0;
	}

	if (typeof (delayRequestGridDatas) != 'undefined') {
		clearTimeout(delayRequestGridDatas);
	}
	delayRequestGridDatas = setTimeout('OnColumnListClick()', 1000);
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
				Nuts.Caches.onRequestError(operation);
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
				sortable: false,
				menuDisabled: true,
				width: (columnList[i].COLUMN_COMMENT.length * 15 + 30)
			});
		}
	}
	if (columnCofigs.length < 1) { return; }

	queryString = queryString + 'LASTMODIFY_TIME FROM T_' ///需要建立视图
		+ window.DataCaches.loggingList[window.DataCaches.loggingChosed].DICTIONARY_CODE.substr(2)
		+ " WHERE SEQUENCE_ID='" + window.DataCaches.resourceList[window.DataCaches.resourceChosed].SEQUENCE_ID + "'";

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

	CreateDataGridView("tblLoggingInfo", storeId, columnCofigs, listenerConfigs)

	if (typeof (delayRefreshChartDatas) != 'undefined') {
		clearTimeout(delayRefreshChartDatas);
	}
	delayRefreshChartDatas = setTimeout('RefreshDataChartView()', 1000);
}

//
/// LoggingInfo
//
function GreateLoggingInfoView() {
	var storeId = "storeLoggingInfo";
	var columns = ['INSTITUTION_NAME', 'INSTITUTION_CODE'];
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

	CreateDataGridView("tblLoggingInfo", storeId, columnCofigs);
}

//
/// LoggingChart
//
function GreateLoggingChartView() {
	// 基于准备好的dom，初始化echarts图表
	var myChart = echarts.init(document.getElementById('tblLoggingChart'));
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
		xAxisDatas.push(rowDate['LASTMODIFY_TIME']);

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
	myChart.clear().setOption(option);
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

//
/// 折叠内容区域
//
function GridPanelToggle(contentId) {
	console.log(contentId);
	var oldHeight = $('#' + contentId).height();
	if (oldHeight == 50) {
		oldHeight = $('#' + contentId + ' a.centerCollapseButton').attr('oldHeight');
		$('#' + contentId).height(oldHeight);
		$('#' + contentId + ' a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('#' + contentId + ' a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#' + contentId).height(50);
		$('#' + contentId + ' a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}
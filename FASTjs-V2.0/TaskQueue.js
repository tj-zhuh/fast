var gird1;
var grid2;
var store1;
var store2;

var condition;

window.DataCaches = {
	checkedcount: 0,
	checkedList: [],
	recordIdList: [],
	hasTaskRunning: false,
	currentRecord: {}
};

$(function () {
	prepare_store_and_grid();

	condition = get_condition();
	//query();
	InitQueryHeader();

	ReSetSubViewSize();

	// 向左 向右 按钮
	$('#button-to-right').click(function () {
		go_right();
	})

	$('#button-to-left').click(function () {
		go_left();
	})
	//观测列表移动
	$('#btmMoveTop').click(function () {
		OrderTaskToFirst();
	})

	$('#btmMoveUp').click(function () {
		OrderTaskToQuick();
	})

	$('#btmMoveDown').click(function () {
		OrderTaskToDown();
	})

	$('#btmMoveBottom').click(function () {
		OrderTaskToLast();
	})
})

function ReSetSubViewSize() {
	var $center = $('.main-center-container');
	var defWidth = $center.width();
	var defHeight = $center.height();
	if ((defWidth + 300) < FAST.visibleWidth && (defHeight + 109) <= FAST.visibleHeight) {
		defWidth += 17;
	}
	//console.log('Current Center Size : ' + defWidth + ' x ' + defHeight);

	$('div.main-panel').height(defHeight - (120 + 25 * 2));
	$('div.panel-body').height(defHeight - (120 + 25 * 2));

	$('#grid-container1').height(defHeight - (120 + 25 * 2 + 55 + 25 + 25));
	$('#grid-container1 div.x-grid-body').height(defHeight - (120 + 25 * 2 + 55 + 25 + 25));
	$('#grid-container1 div.x-grid-view').height(defHeight - (120 + 25 * 2 + 55 + 25 + 25 + 2));

	$('#grid-container2').height(defHeight - (120 + 25 * 2 + 55 + 25 + 25));
	$('#grid-container2 div.x-grid-body').height(defHeight - (120 + 25 * 2 + 55 + 25 + 25));
	$('#grid-container2 div.x-grid-view').height(defHeight - (120 + 25 * 2 + 55 + 25 + 25 + 2));

	grid1.view.refresh();
	grid2.view.refresh();
};

function get_condition() {
	return {
		SEQUENCE_NAME: $('#txtSEQUENCE_NAME').val(),
		SEQUENCE_BEGIN: $('#starttmvalue').val(),
		DESCRIPTION_INFO: $('#remark').val()
	};
}

function query_button_clicked() {
	condition = get_condition();

	query();
}

function query() {
	query1();
	query2();
}

function query1() {
	store1.proxy.extraParams = {
		parameters: JSON.stringify(condition)
	};

	store1.load({
		params: {
			//start: 0,
			//limit: 7
		}
	});
}

function query2() {
	store2.proxy.extraParams = {
		parameters: JSON.stringify(condition)
	};

	store2.load({
		params: {
			//start: 0,
			//limit: 7
		}
	});
}

function prepare_store_and_grid() {
	store1 = create_store1();
	grid1 = create_grid1();

	store2 = create_store2();
	grid2 = create_grid2();
}

function create_store1() {
	var store = Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore1',
		fields: ['SEQUENCE_ID', 'DICTATE_ID', 'SEQUENCE_NAME', 'SEQUENCE_STATE', 'DICTATE_RA', 'DICTATE_DEC', 'DICTATE_EPOCH', 'DICTATE_PID', 'SEQUENCE_TYPE', 'DICTATE_RECV', 'DICTATE_BKND', 'DICTATE_TIMELINE', 'DICTATE_STARTTIME', 'DICTATE_OFFSETSIGN', 'SEQUENCE_BEGIN', 'DICTATE_SCANDIR', 'DICTATE_SCANSPEED', 'DICTATE_SCANSPACE', 'DICTATE_STARTRA', 'DICTATE_STARTDEC', 'DICTATE_STOPRA', 'DICTATE_STOPDEC', 'DICTATE_IDTAG', 'DICTATE_PR', 'DICTATE_PD', 'DESCRIPTION_INFO', 'ENABLE_SIGN', 'BUSINESS_SORT'],
		autoLoad: true,
		//pageSize: 7,
		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_SEQUENCE/GetView_Default/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'SEQUENCE_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});
	return store;
}

function create_store2() {
	var store = Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore2',
		fields: ['SEQUENCE_ID', 'SEQUENCE_NAME', 'SEQUENCE_BEGIN', 'SEQUENCE_TIMELINE', 'SEQUENCE_END', 'SEQUENCE_TASK', 'SEQUENCE_TYPE', 'SEQUENCE_STATE', 'SEQUENCE_OPERATOR', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN'],
		autoLoad: true,
		//pageSize: 7,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_SEQUENCE/GetView_Online/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'SEQUENCE_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		},
		listeners: {
			load: function (store, records, success, eOpts) {
				if (success) {
					window.DataCaches.checkedList = [];
					window.DataCaches.checkedcount = 0;
					for (var i in records) {
						window.DataCaches.checkedList[records[i].index] = 0;
						window.DataCaches.recordIdList[records[i].index] = records[i].data;
						window.DataCaches.currentRecord[records[i].index] = records[i].data;
						grid2.getView().getSelectionModel().deselectAll();
					}
				}
			}
		}
	});
	return store;
}

function create_grid1() {
	var container = Ext.get('grid-container1');
	var grid = Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore1'),
		selModel: new Ext.selection.CheckboxModel({
			checkOnly: true,
			mode: 'SIMPLE',
			showHeaderCheckbox: true
		}),
		viewConfig: {
			stripeRows: false,
		},

		columns: {
			defaults: {
				sortable: false,
				menuDisabled: true,
				align: 'center',
			},
			items: [{
				xtype: 'hiddenfield',
				name: 'SEQUENCE_ID'
			}, {
				text: '源名',
				width: 350,
				dataIndex: 'SEQUENCE_NAME',
			}, {
				text: '模式',
				width: 120,
				dataIndex: 'SEQUENCE_TYPE',
			}, {
				text: '开始时间',
				width: 250,
				dataIndex: 'DICTATE_STARTTIME',
			}, {
				text: '持续时间',
				width: 120,
				dataIndex: 'DICTATE_TIMELINE',
			}, {
				text: '赤径',
				width: 200,
				dataIndex: 'DICTATE_RA',
			}, {
				text: '赤纬',
				width: 200,
				dataIndex: 'DICTATE_DEC',
			}, {
				text: '历元',
				width: 100,
				dataIndex: 'DICTATE_EPOCH',
			}, {
				text: '接收机编号',
				width: 150,
				dataIndex: 'DICTATE_RECV',
			}, {
				text: '终端模式编号',
				width: 180,
				dataIndex: 'DICTATE_BKND',
			}]
		},

		//bbar: ['->', {
		//	xtype: 'pagingtoolbar',
		//	store: store1
		//}, '->'],

		width: "100%",
		height: "100%",
		renderTo: container
	});
	return grid;
}

function create_grid2() {
	var container = Ext.get('grid-container2');
	var grid = Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore2'),
		selModel: new Ext.selection.CheckboxModel({
			checkOnly: true,
			mode: 'SIMPLE',
			showHeaderCheckbox: true,
			listeners: {
				select: function (scope, record, index, eOpts) {
					//var gridStore = Ext.data.StoreManager.lookup('simpsonsStore2');
					//index = (gridStore.currentPage - 1) * gridStore.pageSize + index;
					window.DataCaches.checkedList[record.index] = 1;
					window.DataCaches.checkedcount++;
				},
				deselect: function (scope, record, index, eOpts) {
					//var gridStore = Ext.data.StoreManager.lookup('simpsonsStore2');
					//index = (gridStore.currentPage - 1) * gridStore.pageSize + index;
					window.DataCaches.checkedList[record.index] = 0;
					window.DataCaches.checkedcount--;
				}
			}
		}),
		viewConfig: {
			stripeRows: false
		},
		columns: {
			defaults: {
				sortable: false,
				menuDisabled: true,
				align: 'center',
			},
			items: [{
				xtype: 'hiddenfield',
				name: 'SEQUENCE_ID'
			}, {
				xtype: 'hiddenfield',
				name: 'SEQUENCE_STATE'
			}, {
				text: '源名',
				width: 350,
				dataIndex: 'SEQUENCE_NAME',
				renderer: function (value, metaData, record, rowIndex, colIndex) {
					if (record.data.SEQUENCE_STATE.toUpperCase() == 'IMPOSSIBLE') {
						return "<span class='x-grid-record-red'>" + value + "</span>";
					}
					else {
						return value;
					}
				}
			}, {
				text: '模式',
				width: 120,
				dataIndex: 'SEQUENCE_TYPE',
				renderer: function (value, metaData, record, rowIndex, colIndex) {
					if (record.data.SEQUENCE_STATE.toUpperCase() == 'IMPOSSIBLE') {
						return "<span class='x-grid-record-red'>" + value + "</span>";
					}
					else {
						return value;
					}
				}
			}, {
				text: '计划时间',
				width: 250,
				dataIndex: 'SEQUENCE_BEGIN',
				renderer: function (value, metaData, record, rowIndex, colIndex) {
					if (record.data.SEQUENCE_STATE.toUpperCase() == 'IMPOSSIBLE') {
						return "<span class='x-grid-record-red'>" + value + "</span>";
					}
					else {
						return value;
					}
				}
			}, {
				text: '持续时间',
				width: 120,
				dataIndex: 'SEQUENCE_TIMELINE',
				renderer: function (value, metaData, record, rowIndex, colIndex) {
					if (record.data.SEQUENCE_STATE.toUpperCase() == 'IMPOSSIBLE') {
						return "<span class='x-grid-record-red'>" + value + "</span>";
					}
					else {
						return value;
					}
				}
			}, {
				text: '结束时间',
				width: 170,
				dataIndex: 'SEQUENCE_END',
				renderer: function (value, metaData, record, rowIndex, colIndex) {
					if (record.data.SEQUENCE_STATE.toUpperCase() == 'IMPOSSIBLE') {
						return "<span class='x-grid-record-red'>" + value + "</span>";
					}
					else {
						return value;
					}
				}
			}]
		},

		//bbar: ['->', {
		//    xtype: 'pagingtoolbar',
		//    store: store2
		//}, '->'],

		width: "100%",
		height: "100%",
		renderTo: container
	});
	return grid;
}

function go_left() {
	go('left');
}

function go_right() {
	go('right');
}

function go(direction) {
	var grid;
	var state;

	if (direction == 'right') {
		grid = grid1;
		state = 'OnLine';
	}
	else {
		grid = grid2;
		state = 'Default';
	}

	var rows = grid.getView().getSelectionModel().getSelection();

	if (!rows || rows.length == 0) return;

	var arr = new Array();
	for (var v in rows) {
		var row = rows[v];
		arr.push(row.data.SEQUENCE_ID);
	}
	var list = arr.join(',');
	var pm = { Sequence_Id_List: list, SEQUENCE_STATE: state, SEQUENCE_TASK: "F000306A9-1D185C43F65A668-27BC8631" };

	Ext.Ajax.request({
		url: '../../Concrete/TASK_SEQUENCE/UpdateModel_SetState/3|队列调整/编辑观测任务的观测队列/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'POST',
		params: pm,
		success: function (response, options) {
			Check_Task();
			query();
		},
		failure: function (a, b, c) {
			console.log(c)
		}
	});
}

function prepare_sub_panel_button() {
	$('.button-grid-minimize').click(function () {
		var parent = $(this).parent().parent();
		$('.panel-body', parent).slideToggle(350);
	})

	$('.button-grid-cancel').click(function () {
		var parent = $(this).parent().parent();
		parent.hide();
	})
}

function OrderTaskToFirst() {
	if (window.DataCaches.checkedcount < 1) { return; }
	var checkedList = window.DataCaches.checkedList;

	if (!window.DataCaches.hasTaskRunning) {
		checkedList.unshift(0);
	}

	var checkedList = window.DataCaches.checkedList;
	var tmpSortList = [];
	var newSortList = [];
	var count = 0;
	for (var i = checkedList.length - 1; i >= 0; i--) {
		if (checkedList[i] == 1) {
			tmpSortList[i] = 1 + count;
			count++;
		} else {
			tmpSortList[i] = 0;
		}
		newSortList[i] = 0;
	}

	for (var j = newSortList.length - 1; j >= 0; j--) {
		newSortList[tmpSortList[j]] = j;
	}

	for (var j = 1; j < newSortList.length ; j++) {
		if (checkedList[j] < 1) {
			var index = j;
			for (var k = j; k < newSortList.length ; k++) {
				if (newSortList[k] < 1) {
					newSortList[k] = j;
					break;
				}
			}
		}
	}

	for (var i = 0; i < newSortList.length; i++) {
		if (newSortList[i] < 1) {
			newSortList[i] = 1;
		}
	}
	newSortList.splice(0, 1);

	console.log(newSortList);
	//[1, 3, 4, 5, 6, 7, 8, 9, 2]排序序列
	var startIndex = window.DataCaches.hasTaskRunning == true ? 0 : -1;
	window.DataCaches.checkedList = newSortList;
	var recordArray = [];
	for (var i = 0; i < newSortList.length; i++) {
		var record = window.DataCaches.recordIdList[newSortList[i] + startIndex];
		record.BUSINESS_SORT = i + 1;
		recordArray[i] = record;
	}
	ReOrderTaskSort(recordArray);
}

function OrderTaskToQuick() {
	if (window.DataCaches.checkedcount < 1) { return; }
	var checkedList = window.DataCaches.checkedList;

	if (!window.DataCaches.hasTaskRunning) {
		checkedList.unshift(0);
	}

	var checkedList = window.DataCaches.checkedList;
	var tmpSortList = [];
	var newSortList = [];
	for (var i = 0; i < checkedList.length; i++) {
		if (checkedList[i] == 1) {
			tmpSortList[i] = i - 1;
		} else {
			tmpSortList[i] = 0;
		}
		newSortList[i] = 0;
	}

	for (var j = newSortList.length - 1; j >= 0; j--) {
		newSortList[tmpSortList[j]] = j;
	}

	for (var j = 1; j < newSortList.length ; j++) {
		if (checkedList[j] < 1) {
			var index = j;
			for (var k = j; k < newSortList.length ; k++) {
				if (newSortList[k] < 1) {
					newSortList[k] = j;
					break;
				}
			}
		}
	}

	for (var i = 0; i < newSortList.length; i++) {
		if (newSortList[i] < 1) {
			newSortList[i] = 1;
		}
	}
	newSortList.splice(0, 1);

	console.log(newSortList);
	//[1, 3, 4, 5, 6, 7, 8, 9, 2]排序序列
	var startIndex = window.DataCaches.hasTaskRunning == true ? 0 : -1;
	window.DataCaches.checkedList = newSortList;
	var recordArray = [];
	for (var i = 0; i < newSortList.length; i++) {
		var record = window.DataCaches.recordIdList[newSortList[i] + startIndex];
		record.BUSINESS_SORT = i + 1;
		recordArray[i] = record;
	}
	ReOrderTaskSort(recordArray);
}

function OrderTaskToDown() {
	if (window.DataCaches.checkedcount < 1) { return; }
	var checkedList = window.DataCaches.checkedList;

	if (!window.DataCaches.hasTaskRunning) {
		checkedList.unshift(0);
	}

	var tmpSortList = [];
	var newSortList = [];
	for (var i = 0; i < checkedList.length; i++) {
		if (checkedList[i] == 1) {
			tmpSortList[i] = i + 1;
		} else {
			tmpSortList[i] = 0;
		}
		newSortList[i] = 0;
	}

	for (var j = newSortList.length - 1; j > 0; j--) {
		if (tmpSortList[j] > 0) {
			newSortList[tmpSortList[j]] = j;
		}
	}

	for (var j = newSortList.length - 1; j > 0; j--) {
		if (checkedList[j] < 1) {
			var index = j;
			for (var k = j; k > 0; k--) {
				if (newSortList[k] < 1) {
					newSortList[k] = j;
					break;
				}
			}
		}
	}

	for (var i = 1; i < newSortList.length; i++) {
		if (newSortList[i] > 0) { continue; }
		if (checkedList.length < newSortList.length) {
			newSortList[i] = newSortList[checkedList.length];
			newSortList.splice(checkedList.length, 1);
		} else {
			newSortList.splice(i, 1);
		}
	}
	newSortList.splice(0, 1);

	console.log(newSortList);
	//[1, 3, 4, 5, 6, 7, 8, 9, 2]排序序列
	var startIndex = window.DataCaches.hasTaskRunning == true ? 0 : -1;
	window.DataCaches.checkedList = newSortList;
	var recordArray = [];
	for (var i = 0; i < newSortList.length; i++) {
		var record = window.DataCaches.recordIdList[newSortList[i] + startIndex];
		record.BUSINESS_SORT = i + 1;
		recordArray[i] = record;
	}
	ReOrderTaskSort(recordArray);
}

function OrderTaskToLast() {
	if (window.DataCaches.checkedcount < 1) { return; }
	var checkedList = window.DataCaches.checkedList;

	if (!window.DataCaches.hasTaskRunning) {
		checkedList.unshift(0);
	}

	var tmpSortList = [];
	var newSortList = [];
	var count = 1;
	for (var i = 0; i < checkedList.length; i++) {
		if (checkedList[i] == 1) {
			tmpSortList[i] = checkedList.length - count;
			count++;
		} else {
			tmpSortList[i] = 0;
		}
		newSortList[i] = 0;
	}

	for (var j = newSortList.length - 1; j > 0; j--) {
		if (tmpSortList[j] > 0) {
			newSortList[tmpSortList[j]] = j;
		}
	}

	for (var j = newSortList.length - 1; j > 0; j--) {
		if (checkedList[j] < 1) {
			var index = j;
			for (var k = j; k > 0; k--) {
				if (newSortList[k] < 1) {
					newSortList[k] = j;
					break;
				}
			}
		}
	}

	for (var i = 0; i < newSortList.length; i++) {
		if (newSortList[i] < 1) {
			newSortList.splice(i, 1);
		}
	}

	console.log(newSortList);
	//[1, 3, 4, 5, 6, 7, 8, 9, 2]排序序列
	var startIndex = window.DataCaches.hasTaskRunning == true ? 0 : -1;
	window.DataCaches.checkedList = newSortList;
	var recordArray = [];
	for (var i = 0; i < newSortList.length; i++) {
		var record = window.DataCaches.recordIdList[newSortList[i] + startIndex];
		record.BUSINESS_SORT = i + 1;
		recordArray[i] = record;
	}
	ReOrderTaskSort(recordArray);
}

///更新观测顺序
function ReOrderTaskSort(recordArray) {
	var tmpArray = [];
	for (var i = 0; i < recordArray.length; i++) {
		tmpArray[i] = '{"SEQUENCE_ID":"' + recordArray[i]['SEQUENCE_ID']
					+ '","BUSINESS_SORT":' + recordArray[i]['BUSINESS_SORT']
					+ ',"SEQUENCE_STATE":"' + recordArray[i]['SEQUENCE_STATE'] + '"}';
	}

	Ext.Ajax.request({
		url: '../../Concrete/TASK_SEQUENCE/UpdateModels/3|队列排序/调整观测队列的观测顺序/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'POST',
		params: {
			FormContext: tmpArray.join('|')
		},
		success: function (response, options) {
			Check_Task();
			query();
		},
		failure: function (response, options) {
			FAST.OnResponseError(response);
		}
	});
}

///检测观测队列
function Check_Task() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/Check_Task/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'GET',
		dataType: 'text',
		success: function (response, options) {
			query();
		},
		failure: function (a, b, c) {
			console.log(c)
		}
	});
}

function InitQueryHeader() {
	var date = (Ext.Date.add(new Date(), Ext.Date.DAY, -1)).toFormat("yyyyMMdd");
	$('#starttmvalue').attr('placeholder', date);
}

function ViewMinimumSize1() {
	var $border = $('#grid-container1');
	var oldHeight = $border.attr('oldHeight');

	if ($border.hasClass('x-hide')) {
		$border.removeClass('x-hide');
		$('div.center-grid-left').css('background-color', '#f8f8f8');
	} else {
		$border.addClass('x-hide');
		$('div.center-grid-left').css('background-color', '#e0e8e8');
	}
}

function ViewMinimumSize2() {
	var $border = $('#grid-container2');
	var oldHeight = $border.attr('oldHeight');

	if ($border.hasClass('x-hide')) {
		$border.removeClass('x-hide');
		$('div.center-grid-right').css('background-color', '#f8f8f8');
	} else {
		$border.addClass('x-hide');
		$('div.center-grid-right').css('background-color', '#e0e8e8');
	}
}
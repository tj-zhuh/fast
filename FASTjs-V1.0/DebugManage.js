window.selectlist = '';

function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ["SEQUENCE_ID", "SEQUENCE_NAME", "SEQUENCE_BEGIN", "SEQUENCE_TIMELINE", "SEQUENCE_END", "SEQUENCE_TASK", "SEQUENCE_TYPE", "SEQUENCE_STATE", "SEQUENCE_OPERATOR", "BUSINESS_SORT", "DESCRIPTION_INFO", "LASTMODIFY_TIME", "ENABLE_SIGN", "TASKTYPE_NAME", "TASKSTATE_NAME", "USER_NAME", "DICTATE_MODE", "DICTATE_RECV"],
		autoLoad: true,
		//pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_SEQUENCE/GetDebug/UserId0000/SessionId0000/',
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

	window.DataCaches = {
		checkedcount: 0,
		checkedList: [],
		recordIdList: [],
		hasTaskRunning: false,
		currentRecord: {}
	};

	var divPanel = Ext.get('pnlGirdView');
	Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore'),
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.05,
			dataIndex: 'SEQUENCE_STATE',
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				window.DataCaches.checkedList[rowIndex] = 0;
				window.DataCaches.recordIdList[rowIndex] = record.data;

				if (value.toUpperCase() == 'ACTIVATING' || value.toUpperCase() == 'RUNNING') {
					window.DataCaches.hasTaskRunning = true;
					return '<input id="checkbox' + rowIndex + '" name="checkbox" type="checkbox" class="taskCheckbox" style="visibility: hidden;" value="' + rowIndex + '" disabled >';
				} else {
					return '<input id="checkbox' + rowIndex + '" name="checkbox" type="checkbox" class="taskCheckbox" style="visibility: hidden;" value="' + rowIndex + '" onclick="OnClickCheck(' + rowIndex + ')">';
				}
			}
		}, {
			text: '源名',
			dataIndex: 'SEQUENCE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.27
		}, {
			text: '观测模式',
			align: 'center',
			dataIndex: 'DICTATE_MODE',
			sortable: false,
			menuDisabled: true,
			flex: 0.1
		}, {
			text: '接收机编号',
			align: 'center',
			dataIndex: 'DICTATE_RECV',
			sortable: false,
			menuDisabled: true,
			flex: 0.1
		}, {
			text: '计划时间',
			dataIndex: 'SEQUENCE_BEGIN',
			sortable: false,
			menuDisabled: true,
			flex: 0.125
		}, {
			text: '持续时间',
			align: 'center',
			dataIndex: 'SEQUENCE_TIMELINE',
			sortable: false,
			menuDisabled: true,
			flex: 0.1
		}, {
			text: '计划结束',
			dataIndex: 'SEQUENCE_END',
			sortable: false,
			menuDisabled: true,
			flex: 0.125
		}, {
			text: '任务状态',
			align: 'center',
			dataIndex: 'TASKSTATE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.07,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				window.DataCaches.currentRecord[rowIndex] = record.data;
				if (value != '等待') {
					return '<a id="btnState' + rowIndex + '" class="linkbutton" href="javascript:CheckObserverTask(' + rowIndex + ');" style="color:green;">' + value + '</a>';
				} else {
					return '<a id="btnState' + rowIndex + '" class="linkbutton" href="javascript:CheckObserverTask(' + rowIndex + ');" style="color:gray;" >' + value + '</a>';
				}
			}
		}, {
			text: '操作',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.07,
			dataIndex: 'SEQUENCE_STATE',
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				window.DataCaches.currentRecord[rowIndex] = record.data;
				if (value.toUpperCase() == 'ONLINE') {
					return '<a class="linkbutton" href="javascript:StartObserverTask(' + rowIndex + ');" style="color:blue;">开始</a>';
				} else {
					return '<a class="linkbutton" href="javascript:AbortObserverTask(' + rowIndex + ');" style="color:red;" >结束</a>';
				}
			}
		}],

		width: "100%",
		height: "100%",
		renderTo: divPanel,

		listeners: {
			select: function (scope, record, index, eOpts) {
				var checkObj = document.getElementById('checkbox' + index);

				if ($(checkObj).css('visibility') == 'hidden') { return; }
				if (checkObj.checked) {
					checkObj.checked = false;
					window.DataCaches.checkedList[index] = 0;
					window.DataCaches.checkedcount--;
				} else if (checkObj.disabled == false) {
					checkObj.checked = true;
					window.DataCaches.checkedList[index] = 1;
					window.DataCaches.checkedcount++;
				}
			}
		}
	});

	//小菜单栏导航事件
	$(function () {
		///菜单折叠事件
		var menuFirstIco = $('#detailTask > ul > li em');
		menuFirstIco.each(function (i) {
			$(this).on('click', function () {
				var menuLink = $(this).parent();
				var menuItem = menuLink.parent();

				if (menuLink.hasClass('active')) {
					///取消选中
					menuLink.removeClass('active');
					menuItem.next('ul').slideUp(50);
					$('#detailTask').height(125);
				} else {
					menuItem.siblings('li').find('.active').each(function (j) {
						$(this).removeClass('active');
						$(this).parent().next('ul').slideUp(50);
					});

					///激活选中
					menuLink.addClass('active');
					menuItem.next('ul').slideDown(50);
					$('#detailTask').height(265);
				}
			});
		});
	});
}

///选择排序任务
function OnClickCheck(rowIndex) {
	var checkObj = document.getElementById('checkbox' + rowIndex);

	if (checkObj.checked) {
		window.DataCaches.checkedList[rowIndex] = 1;
		window.DataCaches.checkedcount++;
	} else {
		window.DataCaches.checkedList[rowIndex] = 0;
		window.DataCaches.checkedcount--;
	}
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

function CheckObserverTask(rowIndex) {
	var record = window.DataCaches.currentRecord[rowIndex];
	var topPoint = 226 + rowIndex * 36;
	if ((topPoint + 265) > 900) {
		topPoint = topPoint - 280;
	}

	$('#detailTask').css('top', topPoint).css('display', 'block');
	autoHiddenHandle = setTimeout("AutoHiddenDelegate();", 3000);
}

function AutoHiddenDelegate() {
	$('#detailTask').css('display', 'none');
}

function EnterHiddenDelegate() {
	clearTimeout(autoHiddenHandle);
}

function HumanHiddenDelegate() {
	autoHiddenHandle = setTimeout("AutoHiddenDelegate();", 300);
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
		url: '../../Concrete/TASK_SEQUENCE/UpdateModels/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'POST',
		params: {
			FormContext: tmpArray.join('|')
		},
		success: function (response, options) {
			HeaderQueryData();
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

///开始观测任务
function StartObserverTask(rowIndex) {
	if (window.DataCaches.hasTaskRunning) {
		Ext.MessageBox.alert({
			title: '提 示',
			msg: '当前有一个观测任务正在观测，请等待观测任务结束！',
			width: 360,
			buttons: Ext.MessageBox.OK,
			buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定' },
			icon: Ext.MessageBox.WARNING
		});
	} else {
		var record = window.DataCaches.currentRecord[rowIndex];
		record.SEQUENCE_STATE = 'ACTIVATING';
		record.BUSINESS_SORT = 0;

		Ext.Ajax.request({
			url: '../../Concrete/TASK_SEQUENCE/UpdateModel/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
			method: 'POST',
			params: record,
			success: function (response, options) {
				HeaderQueryData();
			},
			failure: function (response, options) {
				OnResponseError(response);
			}
		});
	}
}

///终止观测任务
function AbortObserverTask(rowIndex) {
	Ext.MessageBox.alert({
		title: '提 示',
		msg: '确定要终止当前正在观测的观测任务么？',
		width: 360,
		buttons: Ext.MessageBox.WARNING,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.ERROR,
		fn: function (optional) {
			if (optional == "ok") {
				var record = window.DataCaches.currentRecord[rowIndex];
				record.SEQUENCE_STATE = 'ABORTED';
				record.BUSINESS_SORT = null;

				Ext.Ajax.request({
					url: '../../Concrete/TASK_SEQUENCE/UpdateModel/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
					method: 'POST',
					params: record,
					success: function (response, options) {
						HeaderQueryData();
					},
					failure: function (response, options) {
						OnResponseError(response);
					}
				});
			}
		}
	});
}

///移除观测任务
function ReomveObserverTask() {
	if (window.DataCaches.checkedcount < 1) {
		Ext.MessageBox.alert({
			title: '提 示',
			msg: '请选择一个要移除的观测任务！',
			width: 360,
			buttons: Ext.MessageBox.OK,
			buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定' },
			icon: Ext.MessageBox.WARNING
		}); return;
	}

	Ext.MessageBox.alert({
		title: '提 示',
		msg: '确定要移除当前选择的观测任务么？',
		width: 360,
		buttons: Ext.MessageBox.OKCANCLE,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.WARNING,
		fn: function (optional) {
			if (optional == "ok") {
				var checkedList = window.DataCaches.checkedList;
				var recordArray = [];
				for (var i = 0; i < checkedList.length; i++) {
					if (checkedList[i] < 1) { continue; }

					var record = window.DataCaches.recordIdList[i];
					record.BUSINESS_SORT = null;
					record.SEQUENCE_STATE = 'DEFAULT';
					recordArray.push(record);
				}
				var tmpArray = [];
				for (var i = 0; i < recordArray.length; i++) {
					tmpArray[i] = '{"SEQUENCE_ID":"' + recordArray[i]['SEQUENCE_ID']
								+ '","BUSINESS_SORT":' + recordArray[i]['BUSINESS_SORT']
								+ ',"SEQUENCE_STATE":"' + recordArray[i]['SEQUENCE_STATE'] + '"}';
				}

				Ext.Ajax.request({
					url: '../../Concrete/TASK_SEQUENCE/UpdateModels/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
					method: 'POST',
					params: {
						FormContext: tmpArray.join('|')
					},
					success: function (response, options) {
						HeaderQueryData();
					},
					failure: function (response, options) {
						OnResponseError(response);
					}
				});
			}
		}
	});
}

function GridPanelToggle() {
	var oldHeight = $('#DebugManage').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#DebugManage').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#DebugManage').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function HeaderQueryData() {
	window.DataCaches.checkedcount = 0;
	window.DataCaches.checkedList = [];
	window.DataCaches.recordIdList = [];
	window.DataCaches.hasTaskRunning = false;
	$('#btmToggleCheckbox').prop('checked', false);

	var queryText1 = Ext.get('txtDICTATE_NAME').dom.value;
	var queryText2 = Ext.get('txtSEQUENCE_BEGIN').dom.value;
	var queryText3 = Ext.get('txtSEQUENCE_ID').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
		parameters: '{"DICTATE_NAME":"' + queryText1 + '","SEQUENCE_BEGIN":"' + queryText2 + '","SEQUENCE_STATE":"' + queryText3 + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			//console.log('The DataStore callback was running!');

			if (!success)
				Nuts.Caches.onRequestError(operation);
		}
	});
}

function ReSetWindowViewSize(isPostBacked) {
	var defWidth = $(window).width();
	var defHeight = $(window).height();

	if (defHeight < 900) {
		defHeight = 900;
	}
	console.log('Current Operater View Size : ' + defWidth + ' x ' + defHeight);
	$('#DebugManage').height(defHeight - 210);
	$('#pnlGirdView').height(defHeight - 320);

	///重绘表格
	if (isPostBacked == true) {
		//初次加载
	} else {
		//调整大小
		$('div.x-grid-body').height(defHeight - 331);
		$('div.x-grid-view').height(defHeight - 333);
	}
};

///初始化，事件绑定
$(function () {
	///窗体大小调整
	$(window).resize(ReSetWindowViewSize);

	///窗体大小
	ReSetWindowViewSize(true);

	$('#btmToggleCheckbox').on('click', function () {
		if ($(this).prop('checked')) {
			$('input.taskCheckbox').each(function (i) {
				$(this).css('visibility', 'visible');
			});
		} else {
			$('input.taskCheckbox').each(function (i) {
				$(this).css('visibility', 'hidden');
			});
		}
	});
});

function kycin() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/XYCIn/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'GET',
		success: function (response, options) {
		},
		failure: function (response, options) {
		}
	});
}

function kycexit() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/XYCExit/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'GET',
		success: function (response, options) {
		},
		failure: function (response, options) {
		}
	});
}

function taskstart() {
	var obsname = window.selectlist;
	var obstype = 2;
	var elements = obsname + '|' + obstype;
	console.log(elements);

	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/TaskStart/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters=' + elements,
		method: 'GET',
		success: function (response, options) {
		},
		failure: function (response, options) {
		}
	});
}

function tasksabort() {
	var obsname = window.selectlist;
	var obstype = 2;
	var elements = obsname + '|' + obstype;
	console.log(elements);

	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/TaskAbort/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters=' + elements,
		method: 'GET',
		success: function (response, options) {
		},
		failure: function (response, options) {
		}
	});
}
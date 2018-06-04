window.selectlist = '';
var grid;

function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ["SEQUENCE_ID", "SEQUENCE_NAME", "SEQUENCE_BEGIN", "SEQUENCE_TIMELINE", "SEQUENCE_END", "SEQUENCE_TASK", "SEQUENCE_TYPE", "SEQUENCE_STATE", "SEQUENCE_OPERATOR", "BUSINESS_SORT", "DESCRIPTION_INFO", "LASTMODIFY_TIME", "ENABLE_SIGN", "TASKTYPE_NAME", "TASKSTATE_NAME", "USER_NAME", "DICTATE_MODE", "DICTATE_RECV"],
		autoLoad: true,
		pageSize: 10,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_SEQUENCE/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'SEQUENCE_ID',
				totalProperty: 'totalProperty',
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
	grid = Ext.create('Ext.grid.Panel', {
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
				var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
				rowIndex = (gridStore.currentPage - 1) * gridStore.pageSize + rowIndex;
				window.DataCaches.checkedList[rowIndex] = 0;
				window.DataCaches.recordIdList[rowIndex] = record.data;

				if (value.toUpperCase() == 'ACTIVATING' || value.toUpperCase() == 'RUNNING') {
					window.DataCaches.hasTaskRunning = true;
					//return '<input type="checkbox" id="checkbox' + rowIndex + '" name="checkbox' + rowIndex + '" value="' + rowIndex + '" class="x-grid-row-checkbox" onclick="OnClickCheck(' + rowIndex + ')"/>&nbsp;'
				} else {
					//return '<input type="checkbox" id="checkbox' + rowIndex + '" name="checkbox' + rowIndex + '" value="' + rowIndex + '" class="x-grid-row-checkbox" onclick="OnClickCheck(' + rowIndex + ')"/>&nbsp;'
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
			flex: 0.2
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
			flex: 0.09,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
				rowIndex = (gridStore.currentPage - 1) * gridStore.pageSize + rowIndex;
				window.DataCaches.currentRecord[rowIndex] = record.data;
				if (value != '等待') {
					return '<a id="btnState' + rowIndex + '" class="linkbutton" style="color:green;">' + value + '</a>';
				} else {
					return '<a id="btnState' + rowIndex + '" class="linkbutton" style="color:gray;" >' + value + '</a>';
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
				var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
				rowIndex = (gridStore.currentPage - 1) * gridStore.pageSize + rowIndex;
				window.DataCaches.currentRecord[rowIndex] = record.data;
				if (value.toUpperCase() == 'ONLINE') {
					return '<a class="linkbutton" href="javascript:StartObserverTask(' + rowIndex + ');" style="color:blue;">开始</a>';
				} if (value.toUpperCase() == 'ACTIVATING' || value.toUpperCase() == 'RUNNING') {
					return '<a class="linkbutton" href="javascript:AbortObserverTask(' + rowIndex + ');" style="color:red;" >结束</a>';
				}
			}
		}],
		bbar: ['->', {
			xtype: 'pagingtoolbar',
			store: Ext.data.StoreManager.lookup('simpsonsStore')
		}, '->'],

		width: "100%",
		height: "100%",
		renderTo: divPanel

		//listeners: {
		//select: function (scope, record, index, eOpts) {
		//	var checkObj = document.getElementById('checkbox' + index);

		//	if ($(checkObj).css('visibility') == 'hidden') { return; }
		//	if (checkObj.checked) {
		//		checkObj.checked = false;
		//		window.DataCaches.checkedList[index] = 0;
		//		window.DataCaches.checkedcount--;
		//	} else if (checkObj.disabled == false) {
		//		checkObj.checked = true;
		//		window.DataCaches.checkedList[index] = 1;
		//		window.DataCaches.checkedcount++;
		//	}
		//}
		//}
	});

	//小菜单栏导航事件
	//$(function () {
	//	///菜单折叠事件
	//	var menuFirstIco = $('#detailTask > ul > li em');
	//	menuFirstIco.each(function (i) {
	//		$(this).on('click', function () {
	//			var menuLink = $(this).parent();
	//			var menuItem = menuLink.parent();

	//			if (menuLink.hasClass('active')) {
	//				///取消选中
	//				menuLink.removeClass('active');
	//				menuItem.next('ul').slideUp(50);
	//				$('#detailTask').height(125);
	//			} else {
	//				menuItem.siblings('li').find('.active').each(function (j) {
	//					$(this).removeClass('active');
	//					$(this).parent().next('ul').slideUp(50);
	//				});

	//				///激活选中
	//				menuLink.addClass('active');
	//				menuItem.next('ul').slideDown(50);
	//				$('#detailTask').height(265);
	//			}
	//		});
	//	});
	//});
	$(function () {
		var menuFirstIco = $('#detailTask').children();
		menuFirstIco.each(function (i) {
			var spread = false;
			$(this).on('click', function () {
				if (this.id != 'third') {
					ResetDetailTask();
					if (!spread) {
						$(this).addClass('swallow');
						$('#detailTask').css('height', '382px');
						$('.tasksecondstatus').css('display', 'block');
						$('#detailTask ul li img').each(function (i) {
							$(this).removeClass().addClass('sub_fail');
						})
						Ext.Ajax.request({
							url: '../../Concrete/DataDisplay/GetOrderData',
							method: 'GET',
							success: function (response, options) {
								var StepState1 = true;
								var StepArray1 = new Array();
								var StepState2 = true;
								var StepArray2 = new Array();
								var StepState4 = true;
								var StepArray4 = new Array();
								var StepState5 = true;
								var StepArray5 = new Array();
								var result = JSON.parse(response.responseText).ArrayModels;
								if (result == null || result.length == 0) {
									return;
								}
								for (var i = 0; i < result.length; i++) {
									if (result[i].orderType == 1) {
										StepArray1.push(result[i]);
									}
									else if (result[i].orderType == 2) {
										StepArray2.push(result[i]);
									}
									else if (result[i].orderType == 9) {
										StepArray4.push(result[i]);
									}
									else if (result[i].orderType == 5) {
										StepArray5.push(result[i]);
									}
								}
								if (this.id == 'first') {
									for (var j = 0; j < StepArray1.length; j++) {
										if (StepArray1[j].orderReturnState == 1) {
											$('#' + StepArray1[j].SubSystemName).removeClass().addClass('sub_sucess');
										}
									}
								}
								if (this.id == 'second') {
									for (var j = 0; j < StepArray2.length; j++) {
										if (StepArray2[j].orderReturnState == 1) {
											$('#' + StepArray2[j].SubSystemName).removeClass().addClass('sub_sucess');
										}
									}
								}
								if (this.id == 'forth') {
									for (var j = 0; j < StepArray4.length; j++) {
										if (StepArray4[j].orderReturnState != 1) {
											$('#' + StepArray4[j].SubSystemName).removeClass().addClass('sub_sucess');
										}
									}
								}
								if (this.id == 'fifth') {
									for (var j = 0; j < StepArray5.length; j++) {
										if (StepArray5[j].orderReturnState != 1) {
											$('#' + StepArray5[j].SubSystemName).removeClass().addClass('sub_sucess');
										}
									}
								}
							},
							failure: function (response, options) {
								FAST.OnResponseError(response);
							}
						});
						//if (this.id == 'second') {
						//	$('.tasksecondstatus').css('left', '150px');
						//}
						//if (this.id == 'forth') {
						//	$('.tasksecondstatus').css('left', '485px');
						//}
						//if (this.id == 'fifth') {
						//	$('.tasksecondstatus').css('left', '650px');
						//}
						spread = true;
					}
					else {
						$(this).removeClass('swallow');
						$('#detailTask').css('height', '156px');
						$('.tasksecondstatus').css('display', 'none');
						spread = false;
					}
				}
			})
		})
	})
}

function ResetDetailTask() {
	$('#detailTask').children().each(function (i) {
		$(this).removeClass('swallow');
		$('#detailTask').css('height', '156px');
		$('.tasksecondstatus').css('display', 'none');
		//$('.tasksecondstatus').css('left', '10px');
	})
}

///选择排序任务
function OnClickCheck(rowIndex) {
	//var checkObj = document.getElementById('checkbox' + rowIndex);

	//if (checkObj.checked) {
	//	window.DataCaches.checkedList[rowIndex] = 1;
	//	window.DataCaches.checkedcount++;
	//} else {
	//	window.DataCaches.checkedList[rowIndex] = 0;
	//	window.DataCaches.checkedcount--;
	//}
	var checkObj = document.getElementById('checkbox' + rowIndex);

	if (checkObj.checked) {
		checkObj.checked = true;
		window.DataCaches.checkedList[rowIndex] = 1;
		window.DataCaches.checkedcount++;
	} else {
		checkObj.checked = false;
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
	//debugger;
	var record = window.DataCaches.currentRecord[rowIndex];
	var topPoint = 157 + rowIndex * 59;
	if ((topPoint + 156) > 900) {
		topPoint = topPoint - 156;
	}

	$('#detailTask').css('top', topPoint).css('display', 'block');
	//$('#detailTask').css('display', 'block').css('top', 'topPoint');
	autoHiddenHandle = setTimeout("AutoHiddenDelegate();", 3000);

	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/GetOrderData',
		method: 'GET',
		success: function (response, options) {
			var StepState1 = true;
			var StepArray1 = new Array();
			var StepState2 = true;
			var StepArray2 = new Array();
			var StepState3 = true;
			var StepArray3 = new Array();
			var StepState4 = true;
			var StepArray4 = new Array();
			var StepState5 = true;
			var StepArray5 = new Array();
			var result = JSON.parse(response.responseText).ArrayModels;
			if (result == null || result.length == 0) {
				return;
			}
			for (var i = 0; i < result.length; i++) {
				if (result[i].orderType == 1) {
					StepArray1.push(result[i]);
				}
				else if (result[i].orderType == 2) {
					StepArray2.push(result[i]);
				}
				else if (result[i].orderType == 8) {
					StepArray3.push(result[i]);
				}
				else if (result[i].orderType == 9) {
					StepArray4.push(result[i]);
				}
				else if (result[i].orderType == 5) {
					StepArray5.push(result[i]);
				}
			}
			if (StepArray1.length < 7) {
				StepState1 = false;
			}
			else {
				for (var j = 0; j < StepArray1.length; j++) {
					if (StepArray1[j].orderReturnState != 1) {
						StepState1 = false;
					}
				}
			}
			if (StepArray2.length < 7) {
				StepState2 = false;
			}
			else {
				for (var j = 0; j < StepArray2.length; j++) {
					if (StepArray2[j].orderReturnState != 1) {
						StepState2 = false;
					}
				}
			}
			if (StepArray3.length < 1) {
				StepState3 = false;
			}
			else {
				for (var j = 0; j < StepArray3.length; j++) {
					if (StepArray3[j].orderReturnState != 1) {
						StepState3 = false;
					}
				}
			}
			if (StepArray4.length < 7) {
				StepState4 = false;
			}
			else {
				for (var j = 0; j < StepArray4.length; j++) {
					if (StepArray4[j].orderReturnState != 1) {
						StepState4 = false;
					}
				}
			}
			if (StepArray5.length < 7) {
				StepState5 = false;
			}
			else {
				for (var j = 0; j < StepArray5.length; j++) {
					if (StepArray5[j].orderReturnState != 1) {
						StepState5 = false;
					}
				}
			}
			if (StepState1) $('#first_state').addClass('success');
			if (StepState2) $('#second_state').addClass('success');
			if (StepState3) $('#third_state').addClass('success');
			if (StepState4) $('#forth_state').addClass('success');
			if (StepState5) $('#fifth_state').addClass('success');
		},
		failure: function (response, options) {
			FAST.OnResponseError(response);
		}
	});
	//CheckOrderStatus(rowIndex);
}

function CheckOrderStatus(rowIndex) {
	var objDictate = window.DataCaches.recordIdList[rowIndex];

	console.log(objDictate["BUSINESS_SORT"]);
	///检查是否进入观测流程
	if (objDictate["BUSINESS_SORT"] == 0) {
		//进入
		$('#detailTask').css("color", "red");
	} else {
		//等待
		$('#detailTask').css("color", "gray");
	}
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
	//$.ajax({
	//	type: 'GET',
	//	url: '../../Concrete/DataDisplay/GetDataMain',
	//	dataType: 'json',
	//	success: function (response, options) {
	//		var result = response.ArrayModels;
			//if (result[0].SystemRunningStatus == 2) {
			//	Ext.MessageBox.alert({
			//		title: '提 示',
			//		msg: '系统故障！无法开始观测任务',
			//		width: 360,
			//		buttons: Ext.MessageBox.OK,
			//		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定' },
			//		icon: Ext.MessageBox.WARNING
			//	});
			//}
			//else {
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
					Ext.MessageBox.alert({
						title: '提 示',
						msg: '是否已关闭干扰源？<br/><br/>',
						width: 360,
						buttons: Ext.MessageBox.OK,
						buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定' },
						icon: Ext.MessageBox.WARNING
					});

					record.SEQUENCE_STATE = 'Activating';
					record.BUSINESS_SORT = 0;

					Ext.Ajax.request({
						url: '../../Concrete/TASK_SEQUENCE/UpdateModel/20|开始任务/开始天文观测任务/?_dc=' + (new Date().getTime()) + '&parameters={}',
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
			//}
		//}
	//})
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
				//if (record.SEQUENCE_STATE == 'Running') {
				//	record.SEQUENCE_STATE = 'Running';
				//	record.BUSINESS_SORT = 0;
				//}
				//else {
					record.SEQUENCE_STATE = 'Aborted';
					record.BUSINESS_SORT = null;
				//}

				Ext.Ajax.request({
					url: '../../Concrete/TASK_SEQUENCE/UpdateModel/20|终止任务/终止天文观测任务/?_dc=' + (new Date().getTime()) + '&parameters={}',
					method: 'POST',
					params: record,
					success: function (response, options) {
						HeaderQueryData();
					},
					failure: function (response, options) {
						FAST.OnResponseError(response);
					}
				});
			}
		}
	});
}

///终止观测队列
function OrderTaskAbort() {
	Ext.MessageBox.alert({
		title: '提 示',
		msg: '确定要终止当前的观测队列吗？',
		width: 360,
		buttons: Ext.MessageBox.WARNING,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.ERROR,
		fn: function (optional) {
			if (optional == "ok") {
				//var record = window.DataCaches.currentRecord[rowIndex];
				//record.SEQUENCE_STATE = 'ABORTED';
				//record.BUSINESS_SORT = null;

				Ext.Ajax.request({
					url: '../../Concrete/TASK_SEQUENCE/OrderTaskAbort_Update/20|终止队列/终止天文观测队列/?_dc=' + (new Date().getTime()) + '&parameters={}',
					method: 'GET',
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
	var oldHeight = $('#TaskManage').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#TaskManage').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#TaskManage').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function HeaderQueryData() {
	window.DataCaches.checkedcount = 0;
	window.DataCaches.checkedList = [];
	window.DataCaches.recordIdList = [];
	window.DataCaches.hasTaskRunning = false;
	$('#btmToggleCheckbox').prop('checked', false);

	//var queryText = Ext.get('txtINSTITUTION_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	//gridStore.proxy.extraParams = {
	//	parameters: '{"INSTITUTION_NAME":"' + queryText + '"}'
	//};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			//console.log('The DataStore callback was running!');

			if (!success)
				Nuts.Caches.onRequestError(operation);
		}
	});
}

///窗体大小调整
function ReSetSubViewSize(isFirstLoad) {
	var $center = $('.main-center-container');
	var defWidth = $center.width();
	var defHeight = $center.height();
	if ((defWidth + 300) < FAST.visibleWidth && (defHeight + 109) <= FAST.visibleHeight) {
		defWidth += 17;
	}
	//console.log('Current Center Size : ' + defWidth + ' x ' + defHeight);

	$('div.center-grid-basic-border').width(defWidth - 50).height(defHeight - (120 + 25 * 2));
	$('div.center-grid-basic-area').width(defWidth - 100).height(defHeight - (120 + 25 * 2 + 55 + 25));

	///重绘表格
	if (!isFirstLoad) {
		//调整大小
		$('div.x-grid-body').width(defWidth - 100).height(defHeight - (120 + 25 * 2 + 55 + 25 + 95));
		$('div.x-grid-view').width(defWidth - 100).height(defHeight - (120 + 25 * 2 + 55 + 25 + 95 + 2));
	}

	$('div.x-toolbar-docked-bottom').css('top', defHeight - (120 + 25 * 2 + 55 + 25 + 65));
};

///初始化，事件绑定
$(function () {
	///窗体大小调整
	//$(window).resize(ReSetSubViewSize);

	///窗体大小
	ReSetSubViewSize(true);
	InitButton();
	$('#btmToggleCheckbox').on('click', function () {
		if ($(this).prop('checked')) {
			$('input.taskCheckbox').each(function (i) {
				$(this).css('visibility', 'visible');
			});
		} else {
			$('input.taskCheckbox').each(function (i) {
				$(this).css('visibility', 'hidden');
				this.checked = false;
			});
		}
	});
});

function taskstart() {
	var obsname = window.selectlist;
	var obstype = 1;
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
	var obstype = 1;
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

function GetOrder(responseText) {
	console.log(responseText);

	//var tempJSON = eval("(" + responseText + ")");

	//console.log(tempJSON.ArrayModels[0]);
	//console.log(tempJSON.ArrayModels[1]);
}

function DisplayOrder() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/GetOrderData/UserId0000/SessionId0000/?parameters={}',
		method: 'GET',
		success: function (response, options) {
			GetOrder(response.responseText);
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function ViewMinimumSize() {
	var $border = $('div.center-grid-basic-border');
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

function GridViewClose() {
	$('div.center-grid-basic-border').addClass('x-hide');
}

function InitButton() {
	Ext.Ajax.request({
		url: "../../Master/MASTER_USER/GetSession/UserId0000/SessionId0000/?parameters={}&_dc=" + (new Date().getTime()),
		method: 'GET',
		success: function (response, options) {
			var result = JSON.parse(response.responseText).ArrayModels;
			if (result.DESCRIPTION_INFO == "工程师" || result.DESCRIPTION_INFO == "科学家") {
				$('#btnInsert').hide();
				grid.columns[8].hide();
			}
		},
		failure: function (response, options) {
			FAST.OnResponseError(response);
		}
	});
}

//var autoRefrashOrder = self.setInterval("DisplayOrder()", 6000)
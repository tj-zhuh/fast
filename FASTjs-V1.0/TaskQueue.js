var gird1;
var grid2;

function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore1',
		fields: ['SEQUENCE_ID', 'SEQUENCE_NAME', 'SEQUENCE_BEGIN', 'SEQUENCE_TIMELINE', 'SEQUENCE_END', 'SEQUENCE_TASK', 'SEQUENCE_TYPE', 'SEQUENCE_STATE', 'SEQUENCE_OPERATOR', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN'],
		autoLoad: true,
		//pageSize: 100,

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

	var divPanel1 = Ext.get('pnlGirdView1');
	grid1 = Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore1'),
		multiSelect: true,
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.04,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				//return '<input id="checkbox' + rowIndex + '" name="checkbox" type="checkbox" class="taskCheckbox" value="' + rowIndex + '">';
			}
		}, {
			xtype: 'hiddenfield',
			name: 'SEQUENCE_ID'
		}, {
			xtype: 'hiddenfield',
			name: 'SEQUENCE_TASK'
		}, {
			xtype: 'hiddenfield',
			name: 'SEQUENCE_OPERATOR'
		}, {
			xtype: 'hiddenfield',
			name: 'BUSINESS_SORT'
		}, {
			xtype: 'hiddenfield',
			name: 'DESCRIPTION_INFO'
		}, {
			xtype: 'hiddenfield',
			name: 'ENABLE_SIGN'
		}, {
			text: '源名',
			align: 'center',
			dataIndex: 'SEQUENCE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.33
		}, {
			text: '观测模式',
			align: 'center',
			dataIndex: 'SEQUENCE_TYPE',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}, {
			text: '计划时间',
			align: 'center',
			dataIndex: 'SEQUENCE_BEGIN',
			sortable: false,
			menuDisabled: true,
			flex: 0.27
		}, {
			text: '持续时间',
			align: 'center',
			dataIndex: 'SEQUENCE_TIMELINE',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}],

		width: "100%",
		height: "100%",
		renderTo: divPanel1,

		listeners: {
			select: function (scope, record, index, eOpts) {
				var start_time = record.data.SEQUENCE_BEGIN;
				var time_line = record.data.SEQUENCE_TIMELINE;

				set_time_value(start_time, time_line);
			}
		}
	});

	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore2',
		fields: ['SEQUENCE_ID', 'SEQUENCE_NAME', 'SEQUENCE_BEGIN', 'SEQUENCE_TIMELINE', 'SEQUENCE_END', 'SEQUENCE_TASK', 'SEQUENCE_TYPE', 'SEQUENCE_STATE', 'SEQUENCE_OPERATOR', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN'],
		autoLoad: true,
		//pageSize: 100,

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
		}
	});

	var divPanel2 = Ext.get('pnlGirdView2');
	grid2 = Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore2'),
		multiSelect: true,
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},
		columns: [{
			text: '',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.04,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				//return '<input id="checkbox' + rowIndex + '" name="checkbox" type="checkbox" class="taskCheckbox" value="' + rowIndex + '">';
			}
		}, {
			xtype: 'hiddenfield',
			name: 'SEQUENCE_ID'
		}, {
			xtype: 'hiddenfield',
			name: 'SEQUENCE_TASK'
		}, {
			xtype: 'hiddenfield',
			name: 'SEQUENCE_OPERATOR'
		}, {
			xtype: 'hiddenfield',
			name: 'BUSINESS_SORT'
		}, {
			xtype: 'hiddenfield',
			name: 'DESCRIPTION_INFO'
		}, {
			xtype: 'hiddenfield',
			name: 'ENABLE_SIGN'
		}, {
			text: '源名',
			align: 'center',
			dataIndex: 'SEQUENCE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.33
		}, {
			text: '观测模式',
			align: 'center',
			dataIndex: 'SEQUENCE_TYPE',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}, {
			text: '计划时间',
			align: 'center',
			dataIndex: 'SEQUENCE_BEGIN',
			sortable: false,
			menuDisabled: true,
			flex: 0.27
		}, {
			text: '持续时间',
			align: 'center',
			dataIndex: 'SEQUENCE_TIMELINE',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}],

		width: "100%",
		height: "100%",
		renderTo: divPanel2,

		listeners: {
			select: function (scope, record, index, eOpts) {
				var start_time = record.data.SEQUENCE_BEGIN;
				var time_line = record.data.SEQUENCE_TIMELINE;

				set_time_value(start_time, time_line);
			}
		}
	});
}

function HeaderQueryData1() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore1');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_NAME":"' + queryText + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			if (!success)
				Nuts.Caches.onRequestError(operation);
		}
	});
}

function HeaderQueryData2() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore2');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_NAME":"' + queryText + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			if (!success)
				Nuts.Caches.onRequestError(operation);
		}
	});
}

function HeaderQueryData() {
	HeaderQueryData1();
	HeaderQueryData2();
}

function GridPanelToggle() {
	var oldHeight = $('#TaskQueue').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#pnlGirdView1').css('display', 'block');
		$('#pnlGirdView2').css('display', 'block');
		$('div.selectionbutton').css('display', 'block');

		$('#TaskQueue').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');

		$('#pnlGirdView1').css('display', 'none');
		$('#pnlGirdView2').css('display', 'none');
		$('div.selectionbutton').css('display', 'none');

		$('#TaskQueue').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function ReSetWindowViewSize(isPostBacked) {
	var defWidth = $(window).width();
	var defHeight = $(window).height();

	if (defHeight < 900) {
		defHeight = 900;
	}
	console.log('Current Operater View Size : ' + defWidth + ' x ' + defHeight);
	$('#TaskQueue').height(defHeight - 210);
	$('#pnlGirdView1').height(defHeight - 290);
	$('#pnlGirdView2').height(defHeight - 290);

	///重绘表格
	if (isPostBacked == true) {
		//初次加载
	} else {
		//调整大小
		$('div.x-grid-body').height(defHeight - 321);
		$('div.x-grid-view').height(defHeight - 323);
	}
};

///初始化，事件绑定
$(function () {
	///窗体大小调整
	$(window).resize(ReSetWindowViewSize);

	///窗体大小
	ReSetWindowViewSize(true);

	//$('#btmToggleCheckbox').on('click', function () {
	//	if ($(this).prop('checked')) {
	//		$('input.taskCheckbox').each(function (i) {
	//			$(this).css('visibility', 'visible');
	//		});
	//	} else {
	//		$('input.taskCheckbox').each(function (i) {
	//			$(this).css('visibility', 'hidden');
	//		});
	//	}
	//});
});

function go_left() {
	var rows = grid2.getView().getSelectionModel().getSelection();

	if (!rows) return;

	var arr = new Array();
	for (var v in rows) {
		var row = rows[v];
		arr.push(row.data.SEQUENCE_ID);
	}
	var list = arr.join(',');
	var pm = { Sequence_Id_List: list, SEQUENCE_STATE: 'DEFAULT' };

	Ext.Ajax.request({
		url: '../../Concrete/TASK_SEQUENCE/UpdateModel_SetState/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'POST',
		params: pm,
		success: function (response, options) {
			HeaderQueryData();
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function go_right() {
	var rows = grid1.getView().getSelectionModel().getSelection();

	if (!rows) return;

	var arr = new Array();
	for (var v in rows) {
		var row = rows[v];
		arr.push(row.data.SEQUENCE_ID);
	}
	var list = arr.join(',');
	var pm = { Sequence_Id_List: list, SEQUENCE_STATE: 'ONLINE' };

	Ext.Ajax.request({
		url: '../../Concrete/TASK_SEQUENCE/UpdateModel_SetState/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'POST',
		params: pm,
		success: function (response, options) {
			HeaderQueryData();
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function set_time_value(start_time, time_line) {
	if (start_time) {
		$("#starttmvalue").html(start_time);
	} else {
		$("#starttmvalue").html('');
	}

	if (time_line) {
		$("#lasttmvalue").html(time_line);
	} else {
		$("#lasttmvalue").html('');
	}
}
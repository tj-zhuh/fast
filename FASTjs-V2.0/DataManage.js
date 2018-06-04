var gird1;
var store1;
var condition;
var editWindow;

var deviceStore;

$(function () {
	ReSetSubViewSize(true);

	prepare_store_and_grid();

	editWindow = createEditWindow();

	condition = get_condition();

	var _deleteElement = document.getElementById('editWindow');
	if (_deleteElement) {
		_deleteElement.parentNode.removeChild(_deleteElement);
	}

	prepare_sub_panel_button();
})

function query() {
	store1.proxy.extraParams = {
		parameters: JSON.stringify(condition)
	};

	store1.load({
		params: {
			start: 0,
			limit: 8
		}
	});
}

function get_condition() {
	return {
		BEGIN_TIME: $('#txtSTATISTICS_TIME_BEGIN').val(),
		END_TIME: $('#txtSTATISTICS_TIME_END').val(),
	};
}

function query_button_clicked() {
	condition = get_condition();

	query();
}

function prepare_store_and_grid() {

	store1 = create_store1();
	grid1 = create_grid1();
	deviceStore = create_device_store();
}

function create_store1() {
	var store = Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore1',
		fields: ['DEVICE_NAME', 'STATISTICS_ID', 'DEVICE_ID', 'STATISTICS_CONTENT', 'STATISTICS_TIME', 'STATISTICS_OPERATOR', 'DESCRIPTION_INFO', 'ENABLE_SIGN'],
		autoLoad: true,
		pageSize: 8,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/SYSTEM_STATISTICS/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'STATISTICS_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});
	return store;
}

function create_grid1() {
	var container = Ext.get('grid-container1');
	var grid = Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore1'),

		columns: [{
			text: '位置',
			align: 'center',
			dataIndex: 'DEVICE_NAME',
			sortable: false,
			menuDisabled: true,
			width: 200
		}, {
			text: '摘要',
			align: 'center',
			dataIndex: 'STATISTICS_CONTENT',
			sortable: false,
			menuDisabled: true,
			flex: 0.3
		}, {
			text: ' 内容',
			align: 'center',
			dataIndex: 'DESCRIPTION_INFO',
			sortable: false,
			menuDisabled: true,
			flex: 0.7
		}, {
			text: '日期',
			align: 'center',
			dataIndex: 'STATISTICS_TIME',
			sortable: false,
			menuDisabled: true,
			width: 160,
			renderer: function (value) {
				return new Date(Date.parse(value)).format("yyyy-MM-dd");
			}
		}, {
			text: '操作人员',
			align: 'center',
			dataIndex: 'STATISTICS_OPERATOR',
			sortable: false,
			menuDisabled: true,
			width: 160
		}, {
			text: '操作',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			width: 180,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				return '<a class="linkbutton" href="javascript:GridCellClick_Edit(' + rowIndex + ');">编辑</a>&nbsp;&nbsp;<a class="linkbutton" href="javascript:GridCellClick_Delete(' + rowIndex + ');">删除</a>';
			}
		}],

		bbar: ['->', {
			xtype: 'pagingtoolbar',
			store: store1
		}, '->'],

		width: "100%",
		height: "100%",
		renderTo: container
	});
	return grid;
}


function GridCellClick_Edit(rowIndex) {     

	var record = store1.getAt(rowIndex);
	record.data.STATISTICS_TIME = new Date(Date.parse(record.data.STATISTICS_TIME)).format("yyyy-MM-dd");

	editWindow.down('form').loadRecord(record);
	editWindow.down('button').setText('修 改');
	editWindow.show();
}

function GridCellClick_Delete(rowIndex) {

	Ext.MessageBox.alert({
		title: '提 示',
		msg: '确定要删除该记录么？<br/><br/>',
		width: 360,
		buttons: Ext.MessageBox.WARNING,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.ERROR,
		fn: function (optional) {
			if (optional == "ok") {              
				var record = store1.getAt(rowIndex).data;
				record.ENABLE_SIGN = 0;

				Ext.Ajax.request({
					url: '../../Concrete/SYSTEM_STATISTICS/UpdateModel/13|删除数据/删除静态数据/?_dc=' + (new Date().getTime()) + '&parameters={}',
					method: 'POST',
					params: record,
					success: function (response, options) {
						FAST.OnInfoEvent('操作处理成功!<br/><br/>');
						query();
					},
					failure: function (response, options) {
						FAST.OnResponseError(response);
					}
				});
			}
		}
	});
}

function GridPanelToggle() {
	var oldHeight = $('#DataManage').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#DataManage').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#DataManage').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function HeaderQueryData() {
	query();
}

function create_device_store()
{
	return Ext.create('Ext.data.Store', {
		storeId: 'deviceStore',
		fields: ['DEVICE_NAME', 'DEVICE_ID'],
		autoLoad: true,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/SYSTEM_DEVICE/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'DEVICE_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});
}

function createEditWindow() {
	return Ext.create('Ext.window.Window', {
		id: 'pnlGirdForm',
		title: '静态数据管理',
		width: 600,
		height: 450,
		modal: true,
		layout: 'fit',
		border: false,
		closable: true,
		resizable: true,
		closeAction: 'hide',
		items: {
			xtype: 'form',
			border: false,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			bodyPadding: '5 10 5 10',
			fieldDefaults: {
				msgTarget: 'side',
				labelWidth: 120,
				labelAlign: 'left',
				labelStyle: 'font-weight:bold'
			},
			items: [
			//隐藏区域
			{
				xtype: 'hiddenfield',
				name: 'STATISTICS_ID'
			},
			{
				xtype: 'hiddenfield',
				name: 'ENABLE_SIGN'
			},

			//属性区域
			{
				xtype: 'combo',
				name: 'DEVICE_ID',
				fieldLabel: '位置',
				emptyText: '请选择位置',
				queryMode: 'local',
				displayField: 'DEVICE_NAME',
				valueField: 'DEVICE_ID',
				hiddenName: 'DEVICE_ID',
				store: deviceStore
			}, {
				xtype: 'textfield',
				allowBlank: false,
				name: 'STATISTICS_CONTENT',
				fieldLabel: '摘要',
				emptyText: '请输入摘要'
			}, {
				xtype: 'datefield',
				format: 'Y-m-d',
				allowBlank: false,
				name: 'STATISTICS_TIME',
				fieldLabel: '日期',
				emptyText: '请选择日期',
			}, {
				xtype: 'textfield',
				name: 'STATISTICS_OPERATOR',
				fieldLabel: '操作人员',
				emptyText: '请输入操作人员'
			},
			///附加区域
			{
				xtype: 'textareafield',
				flex: 1,
				name: 'DESCRIPTION_INFO',
				fieldLabel: '内容',
				emptyText: '请输入内容'
			}]
		},
		buttons: [{
			text: '新 增',
			scope: this,
			handler: function (scope) {
				var editForm = Ext.WindowManager.get('pnlGirdForm');
				var button = editForm.down('button');
				if (button.text == "新 增") {                    
					FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Concrete/SYSTEM_STATISTICS/', [], '13|新增数据', '新增静态数据');
				} else {
					FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-update', '../../Concrete/SYSTEM_STATISTICS/', [], '13|修改数据', '修改静态数据');
				}
			}
		}, {
			text: '取 消',
			scope: this,
			handler: function (scope) {
				var editForm = Ext.WindowManager.get('pnlGirdForm');
				editForm.down('form').getForm().reset();
				editForm.hide();
			}
		}]
	});
}

function HeaderInsertForm() {
	var editForm = Ext.WindowManager.get('pnlGirdForm');
	if (editForm != null && editForm != undefined) {
		editForm.show();
		editForm.down('form').getForm().reset();
		editForm.down('button').setText('新 增');
	} else {
		editWindow.show();
	}
}

function exportGrid() {
	FAST.ExportExcel(grid1);
	//exportExcel(grid1);
}

Date.prototype.format = function (format) {
	var o =
	{
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" +
			o[k]).substr(("" + o[k]).length));
	return format;
}

function prepare_sub_panel_button() {

	//$('.button-grid-minimize').click(function () {
	//    var parent = $(this).parent().parent();
	//    $('#grid-container1', parent).slideToggle(350);
	//})

	$('.button-grid-cancel').click(function () {
		var parent = $(this).parent().parent();
		parent.hide();
	})

	$('.button-grid-refresh').click(function () {
		query();
	})
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

///窗体大小调整
function ReSetSubViewSize(isFirstLoad) {
	var $center = $('.main-center-container');
	var defWidth = $center.width();
	var defHeight = $center.height();
	if ((defWidth + 300) < FAST.visibleWidth && (defHeight + 109) <= FAST.visibleHeight) {
		defWidth += 17;
	}
	console.log('Current Center Size : ' + defWidth + ' x ' + defHeight);

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
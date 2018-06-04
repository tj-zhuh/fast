
var gird1;
var store1;
var condition;
var uploadWindow = createUploadWindow();

$(function () {
	ReSetSubViewSize(true);

	prepare_store_and_grid();


	var _deleteElement = document.getElementById('uploadWindow');
	if (_deleteElement) {
		_deleteElement.parentNode.removeChild(_deleteElement);
	}
})


function query() {
	condition = get_condition();

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
		FILE_NAME: $('#file-name').val()
	};
}

function query_button_clicked() {

	query();
}

function prepare_store_and_grid() {

	store1 = create_store1();
	grid1 = create_grid1();
}

function create_store1() {
	var store = Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore1',
		fields: ['FILE_ID', 'FILE_NAME', 'STORAGE_PATH','STORAGE_TIME'],
		autoLoad: true,
		pageSize: 8,
		proxy: {
			type: 'ajax',
			url: '../../Concrete/SYSTEM_STATISTICS/File_GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'FILE_ID',
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
		
		columns: {
			defaults: {
				sortable: false,
				menuDisabled: true,
				align: 'center',
				locked: true
			},
			items: [{
				xtype: 'hiddenfield',
				name: 'FILE_ID'
			}, {
				xtype: 'hiddenfield',
				name: 'STORAGE_PATH'
			}, {
				text: '文件名',               
				dataIndex: 'FILE_NAME',
				flex: 1
			}, {
				text: '导入日期',
				dataIndex: 'STORAGE_TIME',
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				width:180
			}, {
				text: '删除',
				renderer: function (value, metaData, record, rowIndex, colIndex) {
					var button = '<a class="x-grid-row-imageDelete" href="javascript:delete_file(' + rowIndex + ');"></a>';
					return button;
				},
				width:100
			}, {
				text: '下载',
				renderer: function (value, metaData, record, rowIndex, colIndex) {
					var button = '<a class="center-header-button-export" href="javascript:download_file(' + rowIndex + ');"></a>';
					return button;
				},
				width: 200
			}]
		},

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

function upload_button_clicked() {
	uploadWindow.show();
}

function createUploadWindow() {
	return Ext.create('Ext.window.Window', {
		id: 'uploadWindow',
		title: '上传文件',
		width: 600,
		height: 170,
		modal: true,
		layout: 'fit',
		border: false,
		closable: true,
		resizable: false,
		draggable: false,
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
				labelWidth: 130,
				labelAlign: 'left',
				labelStyle: 'font-weight:bold'
			},
			items: [
			{
				xtype: "filefield",
				emptyText: '选择文件存放路径',

				allowBlank: false,
				name: 'txtFile',
				anchor: "90%",
				buttonText: '选择文件'
			}]
		},
		buttons: [{
			text: '确 定',
			scope: this,
			handler: function (scope) {
				var form = uploadWindow.down('form').getForm();
				if (form.isValid()) {
					form.submit({
						url: '../../Concrete/SYSTEM_STATISTICS/File_Upload/21|文件上传/文件上传/',
						waitMsg: '处理中，请稍候...',
						method: 'post',
						success: function (fp, o) {
							FAST.OnInfoEvent('操作处理成功!<br/><br/>');
							query();
						},
						failure: function (fp, o) {                          
							if (o && o.response && o.response.responseText == "Success") {
								FAST.OnInfoEvent('操作处理成功!<br/><br/>');
								query();
							}
							else {
								FAST.OnInfoEvent('处理失败!<br/><br/>');
							}
						}
					});
				}
			}
		}, {
			text: '取 消',
			scope: this,
			handler: function (scope) {
				uploadWindow.hide();
			}
		}]
	});
}

function delete_file(rowIndex) {
	Ext.MessageBox.alert({
		title: '提 示',
		msg: '确定要删除该文件么？<br/><br/>',
		width: 360,
		buttons: Ext.MessageBox.WARNING,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.WARNING,
		fn: function (optional) {
			if (optional == "ok") {
				var gridStore = Ext.data.StoreManager.lookup('simpsonsStore1');
				rowIndex = (gridStore.currentPage - 1) * gridStore.pageSize + rowIndex;
				var record = gridStore.getAt(rowIndex).data;

				Ext.Ajax.request({
					url: '../../Concrete/SYSTEM_STATISTICS/File_Delete/21|文件删除/文件删除/?_dc=' + (new Date().getTime()) + '&parameters={}',
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

function download_file(rowIndex) {
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore1');
	rowIndex = (gridStore.currentPage - 1) * gridStore.pageSize + rowIndex;
	var record = gridStore.getAt(rowIndex).data;
	var url = '../../Concrete/SYSTEM_STATISTICS/File_Download/21|文件下载/文件下载/?_dc=' + (new Date().getTime()) + '&parameters=' + JSON.stringify(record);
	window.location.href = url;
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

function GridViewClose() {
	$('div.center-grid-basic-border').addClass('x-hide');
}

function HeaderQueryData() {
	query();
}
function LoadGridData() {
	var roleStore = Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['ROLE_ID', 'INSTITUTION_ID', 'ROLE_NAME', 'ROLE_CODE', 'PARENT_ROLE', 'DICTIONARY_ID', 'ROLE_LEVEL', 'ROLE_TYPE', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN', 'ENABLE_STATUS'],
		autoLoad: true,
		pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Master/MASTER_ROLE/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'ROLE_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});

	var divPanel = Ext.get('pnlGirdView');
	Ext.create('Ext.grid.Panel', {
		store: roleStore,
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '角色名称',
			align: 'center',
			dataIndex: 'ROLE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.25
		}, {
			text: '操作',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.25,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				return '<a class="x-grid-row-linkButton" href="javascript:GridCellClick(' + rowIndex + ');">编辑</a>&nbsp;&nbsp;<a class="x-grid-row-linkButton" href="javascript:GridCellClick_Delete(' + rowIndex + ');">删除</a>';
			}
		}],

		bbar: ['->', {
			xtype: 'pagingtoolbar',
			store: roleStore,
			listeners: {
				"beforechange": function (bbar, page, eOpts) {
					var queryNAME = Ext.get('txtROLE_NAME').dom.value;
					//var queryCODE = Ext.get('txtUSER_CODE').dom.value;

					bbar.store.extraParams = {
						parameters: '{"ROLE_NAME":"' + queryNAME + + '"}'//'","USER_CODE":"' + queryCODE + '"}'
					};
				}
			}
		}, '->'],

		width: "100%",
		height: "100%",
		renderTo: divPanel
	});

	var editForm = Ext.WindowManager.get('pnlGirdForm');
	if (editForm != null && editForm != undefined) {
		Ext.WindowManager.unregister(editForm);
	}
	var _deleteElement = document.getElementById('pnlGirdForm');
	if (_deleteElement) {
		_deleteElement.parentNode.removeChild(_deleteElement);
	}
}

function HeaderQueryData() {
	var queryText = Ext.get('txtROLE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
		parameters: '{"ROLE_NAME":"' + queryText + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			//console.log('The DataStore callback was running!');

			if (!success)
				FAST.OnRequestError(operation);
		}
	});
}

var editWindow = null;
function InitEditRoleWindow() {
	editWindow = Ext.create('Ext.window.Window', {
		id: 'pnlGirdForm',
		title: '角色管理',
		width: 600,
		height: 200,
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
				labelWidth: 110,
				labelAlign: 'left',
				labelStyle: 'font-weight:bold'
			},
			items: [{
				xtype: 'hiddenfield',
				name: 'ROLE_ID'
			}, {
				xtype: 'hiddenfield',
				name: 'ENABLE_SIGN'
			}, {
				xtype: 'textfield',
				allowBlank: false,
				name: 'ROLE_NAME',
				fieldLabel: '角色名称',
				emptyText: '请输入角色名称'
			}]
		},
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			ui: 'footer',
			layout: {
				pack: 'center'
			},
			items: [{
				text: '新 增',
				scope: this,
				handler: function (scope) {
					var editForm = Ext.WindowManager.get('pnlGirdForm');
					var button = editForm.down('button');
					if (button.text == "新 增") {
						FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Master/MASTER_ROLE/');
					} else {
						FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-update', '../../Master/MASTER_ROLE/');
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

function GridCellClick(rowIndex) {
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	HeaderInsertForm();
	var editForm = Ext.WindowManager.get('pnlGirdForm');
	editForm.down('form').loadRecord(gridStore.getAt(rowIndex));
	editForm.down('button').setText('修 改');
}

function GridCellClick_Delete(rowIndex) {
	Ext.MessageBox.alert({
		title: '删 除',
		msg: '确定要删除该记录么？<br/><br/>',
		width: 360,
		buttons: Ext.MessageBox.WARNING,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.WARNING,
		fn: function (optional) {
			if (optional == "ok") {
				var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
				var record = gridStore.getAt(rowIndex).data;
				record.ENABLE_SIGN = 0;

				Ext.Ajax.request({
					url: '../../Master/MASTER_ROLE/UpdateModel/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
					method: 'POST',
					params: record,
					success: function (response, options) {
						FAST.OnInfoEvent('操作处理成功!<br/><br/>');
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
		$('div.x-grid-body').width(defWidth - 100).height(defHeight - (120 + 25 * 2 + 55 + 25 + 65));
		$('div.x-grid-view').width(defWidth - 100).height(defHeight - (120 + 25 * 2 + 55 + 25 + 65 + 2));
	}

	$('div.x-toolbar-docked-bottom').css('top', defHeight - (120 + 25 * 2 + 55 + 25 + 65));
};

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

/*
** 全局初始化
********************************************************************************************************************************/

///初始化用户编辑窗体
InitEditRoleWindow();

///窗体大小
ReSetSubViewSize(true);
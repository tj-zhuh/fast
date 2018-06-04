/// <summary>
/// 页面初始化函数, 创建表格, 创建 store.
/// </summary>
function LoadGridData() {
	var userStore = Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['INSTITUTION_NAME', 'USER_ID', 'INSTITUTION_ID', 'USER_CODE', 'USER_NAME', 'USER_PASSWORD', 'EMAIL_ADDRESS', 'USER_PHONE', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN', 'LOGGING_TIME'],
		autoLoad: true,
		pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Master/MASTER_USER/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'USER_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});

	var divPanel = Ext.get('pnlGirdView');
	Ext.create('Ext.grid.Panel', {
		store: userStore,
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '登录名',
			align: 'center',
			dataIndex: 'USER_CODE',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}, {
			text: '用户姓名',
			align: 'center',
			dataIndex: 'USER_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}, {
			text: '所属机构',
			align: 'center',
			dataIndex: 'INSTITUTION_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}, {
			text: '最后登录时间',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}, {
			text: '操作',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.2,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				return '<a class="x-grid-row-linkButton" href="javascript:GridCellClick(' + rowIndex + ');">编辑</a>&nbsp;&nbsp;<a class="x-grid-row-linkButton" href="javascript:GridCellClick_Set(' + rowIndex + ');">授权</a>&nbsp;&nbsp;<a class="x-grid-row-linkButton" href="javascript:GridCellClick_Delete(' + rowIndex + ');">删除</a>';
			}
		}],

		bbar: ['->', {
			xtype: 'pagingtoolbar',
			store: userStore,
			listeners: {
				"beforechange": function (bbar, page, eOpts) {
					var queryNAME = Ext.get('txtUSER_NAME').dom.value;
					//var queryCODE = Ext.get('txtUSER_CODE').dom.value;

					bbar.store.extraParams = {
						parameters: '{"USER_NAME":"' + queryNAME + + '"}'//'","USER_CODE":"' + queryCODE + '"}'
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
	var queryNAME = Ext.get('txtUSER_NAME').dom.value;
	//var queryCODE = Ext.get('txtUSER_CODE').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
		parameters: '{"USER_NAME":"' + queryNAME + '"}' //+ '","USER_CODE":"' + queryCODE + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			console.log('The DataStore callback was running!');

			if (!success && FAST && typeof FAST.OnRequestError == 'function')
				FAST.OnRequestError(operation);
		}
	});
}

var editWindow = null;
function InitEditUserWindow() {
	editWindow = Ext.create('Ext.window.Window', {
		id: 'pnlGirdForm',
		title: '系统用户管理',
		width: 650,
		height: 470,
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
				name: 'USER_ID'
			},
			{
				xtype: 'hiddenfield',
				name: 'ENABLE_SIGN'
			},

			//属性区域
			{
				xtype: 'textfield',
				allowBlank: false,
				name: 'USER_CODE',
				fieldLabel: '登录名',
				emptyText: '请输入登录名'
			}, {
				xtype: 'textfield',
				allowBlank: false,
				name: 'USER_NAME',
				fieldLabel: '用户名称',
				emptyText: '请输入用户名称'
			}, {
				xtype: 'textfield',
				allowBlank: false,
				name: 'USER_PASSWORD',
				fieldLabel: '用户密码',
				emptyText: '请输入用户密码'
			}, {
				xtype: 'textfield',
				name: 'EMAIL_ADDRESS',
				fieldLabel: '用户地址',
				emptyText: '请输入用户地址'
			}, {
				xtype: 'textfield',
				name: 'USER_PHONE',
				fieldLabel: '手机号码',
				emptyText: '手机号码'
			},

			///附加区域
			{
				xtype: 'textareafield',
				flex: 1,
				name: 'DESCRIPTION_INFO',
				fieldLabel: '备注说明',
				emptyText: '请输入备注说明'
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
						FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Master/MASTER_USER/', [], '15|用户新增', '用户新增');
					} else {
						FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-update', '../../Master/MASTER_USER/', [], '15|用户编辑', '用户编辑');
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
					url: '../../Master/MASTER_USER/UpdateModel/15|用户删除/用户删除/?_dc=' + (new Date().getTime()) + '&parameters={}',
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

var userRoleWindow = null;
function InitUserRoleWindow() {
	var userRoleStore = Ext.create('Ext.data.Store', {
		storeId: 'simproleStore',
		fields: ['ROLE_ID', 'ROLE_NAME', 'ACTIVE'],
		autoLoad: false,
		//pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Master/MASTER_USERROLE/GetView2/UserId0000/SessionId0000/',
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

	userRoleWindow = Ext.create('Ext.window.Window', {
		id: 'userRoleWindow',
		title: '用户角色授权',
		width: 600,
		height: 480,
		modal: true,
		layout: 'fit',
		border: false,
		closable: true,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		items: {
			xtype: 'gridpanel',
			store: userRoleStore,
			viewConfig: {
				stripeRows: true,
				enableTextSelection: true
			},

			columns: [{
				xtype: 'checkcolumn',
				text: '是否授权',
				dataIndex: 'ACTIVE',
				sortable: false,
				menuDisabled: true,
				flex: 0.3
			}, {
				text: '角色',
				align: 'center',
				dataIndex: 'ROLE_NAME',
				sortable: false,
				menuDisabled: true,
				flex: 0.7
			}],

			width: "100%",
			height: "100%",
		},
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			ui: 'footer',
			layout: {
				pack: 'center'
			},
			items: [{
				text: '确 定',
				scope: this,
				handler: function (scope) {
					UpdateUserRoles();
				}
			}, {
				text: '取 消',
				scope: this,
				handler: function (scope) {
					userRoleWindow.hide();
				}
			}]
		}]
	});
}

var currentUserId = null;
function GridCellClick_Set(rowIndex) {
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
	var record = gridStore.getAt(rowIndex);
	var userId = record.data.USER_ID;
	var roleStore = Ext.data.StoreManager.lookup('simproleStore');

	roleStore.proxy.extraParams = {
		parameters: '{"USER_ID":"' + userId + '"}'
	};

	currentUserId = userId;
	roleStore.load({
		scope: this,
		callback: function (records, operation, success) {
			console.log('The DataStore callback was running!');

			if (!success)
				FAST.OnRequestError(operation);
		}
	});

	userRoleWindow.show();
}

function UpdateUserRoles() {
	var pt = 0;
	var arr = new Array();
	var roleStore = Ext.data.StoreManager.lookup('simproleStore');
	$(".x-grid-checkcolumn").each(function () {
		var box = $(this);
		if (box.hasClass('x-grid-checkcolumn-checked')) {
			arr.push(roleStore.getAt(pt).data.id);
		}
		pt++;
	});

	var list = arr.join(',');
	var pm = { Role_Id_List: list, USER_ID: currentUserId };

	Ext.Ajax.request({
		url: '../../Master/MASTER_USERROLE/UpdateModel2/15|用户授权/分配用户角色/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'POST',
		params: pm,
		success: function (response, options) {
			FAST.OnInfoEvent('操作处理成功!<br/><br/>');
		},
		failure: function (response, options) {
			FAST.OnResponseError(response);
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
InitEditUserWindow();

///初始化用户角色列表
InitUserRoleWindow();

///窗体大小
ReSetSubViewSize(true);
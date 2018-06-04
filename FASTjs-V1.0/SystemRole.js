function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['ROLE_ID', 'INSTITUTION_ID', 'ROLE_NAME', 'ROLE_CODE', 'PARENT_ROLE', 'DICTIONARY_ID', 'ROLE_LEVEL', 'ROLE_TYPE', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN', 'ENABLE_STATUS'],
		autoLoad: true,
		//pageSize: 100,

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
		store: Ext.data.StoreManager.lookup('simpsonsStore'),
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
                return '<a class="linkbutton" href="javascript:GridCellClick(' + rowIndex + ');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="linkbutton" href="javascript:GridCellClick_Delete(' + rowIndex + ');">删除</a>';
			}
		}],

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

function GridCellClick(rowIndex) {
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	HeaderInsertForm();
	var editForm = Ext.WindowManager.get('pnlGirdForm');
	editForm.down('form').loadRecord(gridStore.getAt(rowIndex));
	editForm.down('button').setText('修 改');
}

function GridCellClick_Delete(rowIndex) {

    Ext.MessageBox.alert({
        title: '提 示',
        msg: '确定要删除该记录么？',
        width: 360,
        buttons: Ext.MessageBox.WARNING,
        buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
        icon: Ext.MessageBox.ERROR,
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
                        OnInfoEvent('操作处理成功!');
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
	var oldHeight = $('#SystemRole').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#SystemRole').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#SystemRole').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
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
				Nuts.Caches.onRequestError(operation);
		}
	});
}

var editWindow = Ext.create('Ext.window.Window', {
	id: 'pnlGirdForm',
	title: '角色管理',
	width: 600,
    height: 150,
	modal: true,
	layout: 'fit',
	border: false,
	closable: true,
	resizable: true,
	closeAction: 'hide',
	items: {
		xtype: 'form',
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		bodyPadding: '5 10 5 10',
		fieldDefaults: {
			msgTarget: 'side',
			labelWidth: 80,
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
	buttons: [{
		text: '新 增',
		scope: this,
		handler: function (scope) {
			var editForm = Ext.WindowManager.get('pnlGirdForm');
			var button = editForm.down('button');
			if (button.text == "新 增") {
				OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Master/MASTER_ROLE/');
			} else {
				OnExcuteRequest(editForm.down('form').getForm(), 'form-update', '../../Master/MASTER_ROLE/');
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

function ReSetWindowViewSize(isPostBacked) {
	var defWidth = $(window).width();
	var defHeight = $(window).height();

	if (defHeight < 900) {
		defHeight = 900;
	}
	console.log('Current Operater View Size : ' + defWidth + ' x ' + defHeight);
	$('#SystemRole').height(defHeight - 210);
	$('#pnlGirdView').height(defHeight - 290);

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
});
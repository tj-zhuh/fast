function LoadGridData() {
	var noteStore = Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['USER_NAME', 'ROLE_NAME', 'LOGGING_ID', 'FUNCTION_ID', 'FUNCTION_NAME', 'USER_ID', 'ROLE_ID', 'LOGGING_CONTEXT', 'LOGGING_TIME', 'LOGGING_TYPE', 'LOGGING_IPADDRESS', 'ENABLE_SIGN'],
		autoLoad: true,
		pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Master/MASTER_LOGGING/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'LOGGING_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});

	var divPanel = Ext.get('pnlGirdView');
	Ext.create('Ext.grid.Panel', {
		store: noteStore,
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '操作时间',
			align: 'center',
			dataIndex: 'LOGGING_TIME',
			sortable: false,
			menuDisabled: true,
			width: 230,
			renderer: function (value) {
				return value.replace('T', ' ');
			}
		}, {
			text: '操作人员',
			align: 'center',
			dataIndex: 'USER_NAME',
			sortable: false,
			menuDisabled: true,
			width: 160
		}, {
			text: '用户角色',
			align: 'center',
			dataIndex: 'ROLE_NAME',
			sortable: false,
			menuDisabled: true,
			width: 160
		}, {
			text: '操作页面',
			align: 'center',
			dataIndex: 'FUNCTION_NAME',
			sortable: false,
			menuDisabled: true,
			width: 180
		}, {
			text: '操作内容',
			align: 'center',
			dataIndex: 'LOGGING_CONTEXT',
			sortable: false,
			menuDisabled: true,
			flex: 1
		}, {
			text: '操作类型',
			align: 'center',
			dataIndex: 'LOGGING_TYPE',
			sortable: false,
			menuDisabled: true,
			width: 180
		}, {
			text: ' IP地址',
			align: 'center',
			dataIndex: 'LOGGING_IPADDRESS',
			sortable: false,
			menuDisabled: true,
			width: 200
		}],

		bbar: ['->', {
			xtype: 'pagingtoolbar',
			store: noteStore,
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
	var queryText1 = $('#txtSTATISTICS_TIME_BEGIN').val();
	var queryText2 = $('#txtSTATISTICS_TIME_END').val();
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
		parameters: '{"BEGIN_TIME":"' + queryText1 + '","END_TIME":"' + queryText2 + '"}'
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

function GridCellClick(rowIndex) {
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	HeaderInsertForm();
	var editForm = Ext.WindowManager.get('pnlGirdForm');
	editForm.down('form').loadRecord(gridStore.getAt(rowIndex));
	editForm.down('button').setText('修 改');
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

///窗体大小
ReSetSubViewSize(true);
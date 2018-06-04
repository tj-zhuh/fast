function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['USER_NAME', 'LOGGING_TYPE_NAME', 'LOGGING_ID', 'FUNCTION_ID', 'USER_ID', 'ROLE_ID', 'LOGGING_CONTEXT', 'LOGGING_TIME', 'LOGGING_TYPE', 'LOGGING_IPADDRESS', 'ENABLE_SIGN'],
		autoLoad: true,
		//pageSize: 100,

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
		store: Ext.data.StoreManager.lookup('simpsonsStore'),
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
			flex: 0.2,
			renderer: function (value) {
			    return new Date(Date.parse(value)).format("yyyy-MM-dd");
			}
		}, {
			text: '操作人员',
			align: 'center',
			dataIndex: 'USER_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}, {
			text: '操作内容',
			align: 'center',
			dataIndex: 'LOGGING_CONTEXT',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}, {
			text: '操作类型',
			align: 'center',
			dataIndex: 'LOGGING_TYPE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}, {
			text: ' IP地址',
			align: 'center',
			dataIndex: 'LOGGING_IPADDRESS',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}
		],

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

function GridPanelToggle() {
	var oldHeight = $('#SystemNote').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#SystemNote').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#SystemNote').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function HeaderQueryData() {
	var queryText1 = $('#txtSTATISTICS_TIME_BEGIN').val();
	var queryText2 = $('#txtSTATISTICS_TIME_END').val();

    //var queryText = Ext.get('txtSTATISTICS_TIME_BEGIN').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
	    parameters: '{"BEGIN_TIME":"' + queryText1 + '","END_TIME":"' + queryText2 + '"}'
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
	$('#SystemNote').height(defHeight - 210);
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
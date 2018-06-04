function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['ALARM_NAME', 'ALTER_NAME', 'DEVICE_NAME', 'ALTERING_BEGINTIME', 'ALTERING_ENDTIME', 'ALTERING_CONTENT', 'DESCRIPTION_INFO'],
		autoLoad: true,
		pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/SYSTEM_ALTERLOG/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'ALTERING_ID',
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

		overflowX: 'auto',

		columns: [{
			text: '报警类型',
			align: 'center',
			dataIndex: 'ALTER_NAME',
			sortable: false,
			menuDisabled: true,
			width: 150
		}, {
			text: '报警等级',
			align: 'center',
			dataIndex: 'ALARM_NAME',
			sortable: false,
			menuDisabled: true,
			width: 150
		}, {
			text: '报警设备',
			align: 'center',
			dataIndex: 'DEVICE_NAME',
			sortable: false,
			menuDisabled: true,
			width: 250
		}, {
			text: '开始时间',
			align: 'center',
			dataIndex: 'ALTERING_BEGINTIME',
			renderer: function (val) {
				return new Date(val.replace('T', ' ').replace('-', '/')).toFormat("yyyy-MM-dd HH:mm:ss")
			},
			sortable: false,
			menuDisabled: true,
			width: 300
		}, {
			text: '结束时间',
			align: 'center',
			dataIndex: 'ALTERING_ENDTIME',
			renderer: function (val) {
				if (val == null || val == '')
					return '';
				return new Date(val.replace('T', ' ').replace('-', '/')).toFormat("yyyy-MM-dd HH:mm:ss")
			},
			sortable: false,
			menuDisabled: true,
			width: 300
		}, {
			text: '报警内容',
			align: 'center',
			dataIndex: 'ALTERING_CONTENT',
			sortable: false,
			menuDisabled: true,
			width: 700
		}, {
			text: '备注',
			align: 'center',
			dataIndex: 'DESCRIPTION_INFO',
			sortable: false,
			menuDisabled: true,
			width: 200
		}],

		bbar: ['->', {
			xtype: 'pagingtoolbar',
			store: Ext.data.StoreManager.lookup('simpsonsStore'),
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
}

function HeaderQueryData() {
	var queryText1 = Ext.get('txtALTERING_TYPE').dom.value;
	var queryText2 = Ext.get('txtALTERING_BEGINTIME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
	gridStore.proxy.extraParams = {
		parameters: '{"ALTERING_LEVEL":"' + queryText1 + '","ALTERING_BEGINTIME":"' + queryText2 + '"}'
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
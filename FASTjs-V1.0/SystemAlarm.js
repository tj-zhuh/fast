function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['ALARM_NAME', 'ALTER_NAME', 'DEVICE_NAME', 'ALTERING_BEGINTIME', 'ALTERING_ENDTIME', 'ALTERING_CONTENT', 'DESCRIPTION_INFO'],
		autoLoad: true,
		//pageSize: 100,

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

		columns: [{
			text: '报警类型',
			align: 'center',
			dataIndex: 'ALTER_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.1
		}, {
			text: '报警等级',
			align: 'center',
			dataIndex: 'ALARM_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.1
		}, {
			text: '报警设备',
			align: 'center',
			dataIndex: 'DEVICE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}, {
			text: '开始时间',
			align: 'center',
			dataIndex: 'ALTERING_BEGINTIME',
			renderer: function (val) {
				return new Date(val.replace('T', ' ').replace('-', '/')).pattern("yyyy-MM-dd HH:mm:ss")
			},
			sortable: false,
			menuDisabled: true,
			flex: 0.14
		}, {
			text: '结束时间',
			align: 'center',
			dataIndex: 'ALTERING_ENDTIME',
			renderer: function (val) {
				if (val == null || val == '')
					return '';
				return new Date(val.replace('T', ' ').replace('-', '/')).pattern("yyyy-MM-dd HH:mm:ss")
			},
			sortable: false,
			menuDisabled: true,
			flex: 0.14
		}, {
			text: '报警内容',
			align: 'center',
			dataIndex: 'ALTERING_CONTENT',
			sortable: false,
			menuDisabled: true,
			flex: 0.2
		}, {
			text: '备注',
			align: 'center',
			dataIndex: 'DESCRIPTION_INFO',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}],

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
		parameters: '{"ALTERING_TYPE":"' + queryText1 + '","ALTERING_BEGINTIME":"' + queryText2 + '"}'
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

function GridPanelToggle() {
	var oldHeight = $('#SystemAlarm').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#SystemAlarm').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#SystemAlarm').height(50);
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
	$('#SystemAlarm').height(defHeight - 210);
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
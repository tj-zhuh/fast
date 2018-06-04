var grid;
function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['SEQUENCE_ID', 'DICTATE_ID', 'DICTATE_NAME', 'DICTATE_RA', 'DICTATE_DEC', 'DICTATE_EPOCH', 'DICTATE_PID', 'DICTATE_MODE', 'DICTATE_RECV', 'DICTATE_BKND', 'DICTATE_TIMELINE', 'DICTATE_OFFSETSIGN', 'DICTATE_STARTTIME', 'DICTATE_SCANDIR', 'DICTATE_SCANSPEED', 'DICTATE_SCANSPACE', 'DICTATE_STARTRA', 'DICTATE_STARTDEC', 'DICTATE_STOPRA', 'DICTATE_STOPDEC', 'DICTATE_IDTAG', 'DESCRIPTION_INFO', 'ENABLE_SIGN', 'BUSINESS_SORT'],
		autoLoad: true,
		//pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/DICTATE_CONTENT/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'DICTATE_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});

	var divPanel = Ext.get('pnlGirdView');
	grid = Ext.create('Ext.grid.Panel', {
		selType: 'rowmodel',
		store: Ext.data.StoreManager.lookup('simpsonsStore'),
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '源名',
			width: 230,
			align: 'center',
			dataIndex: 'DICTATE_NAME',
			sortable: false,
			menuDisabled: true
		}, {
			text: '赤径',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_RA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '赤纬',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_DEC',
			sortable: false,
			menuDisabled: true
		}, {
			text: '历元',
			width: 100,
			align: 'center',
			dataIndex: 'DICTATE_EPOCH',
			sortable: false,
			menuDisabled: true
		}, {
			text: '项目编号',
			width: 100,
			align: 'center',
			dataIndex: 'DICTATE_PID',
			sortable: false,
			menuDisabled: true
		}, {
			text: '观测模式',
			width: 100,
			align: 'center',
			dataIndex: 'DICTATE_MODE',
			sortable: false,
			menuDisabled: true
		}, {
			text: '接收机编号',
			width: 100,
			align: 'center',
			dataIndex: 'DICTATE_RECV',
			sortable: false,
			menuDisabled: true
		}, {
			text: '终端模式编号',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_BKND',
			sortable: false,
			menuDisabled: true
		}, {
			text: '持续时间(秒)',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_TIMELINE',
			sortable: false,
			menuDisabled: true,
			renderer: function (value) {
				if (value)
					return value;
				return "";
			}
		}, {
			text: '后移标识',
			width: 100,
			align: 'center',
			dataIndex: 'DICTATE_OFFSETSIGN',
			sortable: false,
			menuDisabled: true,
			renderer: function (value) {
				if (value == 1)
					return "";
				return value;
			}
		}, {
			text: '起始时刻',
			width: 170,
			align: 'center',
			dataIndex: 'DICTATE_STARTTIME',
			sortable: false,
			menuDisabled: true
		}, {
			text: '设定沿赤经/赤纬扫描',
			width: 170,
			align: 'center',
			dataIndex: 'DICTATE_SCANDIR',
			sortable: false,
			menuDisabled: true,
			renderer: function (value) {
				switch (value) {
					case 0: return '赤经';
					case 1: return '赤纬';
					default: return '';
				}
			}
		}, {
			text: '扫描运动速度',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_SCANSPEED',
			sortable: false,
			menuDisabled: true
		}, {
			text: '扫描间隔角度',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_SCANSPACE',
			sortable: false,
			menuDisabled: true
		}, {
			text: '起始赤经',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_STARTRA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '结束赤经',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_STOPRA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '起始赤纬',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_STARTDEC',
			sortable: false,
			menuDisabled: true
		}, {
			text: '结束赤纬',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_STOPDEC',
			sortable: false,
			menuDisabled: true
		}, {
			text: '任务标识',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_IDTAG',
			sortable: false,
			menuDisabled: true
		}, {
			text: '备注',
			width: 330,
			align: 'center',
			dataIndex: 'DESCRIPTION_INFO',
			sortable: false,
			menuDisabled: true
		}],

		width: "100%",
		height: "100%",
		renderTo: divPanel,

		listeners: {
			select: function (scope, record, index, eOpts) {
				var start_time = record.data.DICTATE_STARTTIME;
				var time_line = record.data.DICTATE_TIMELINE;
				set_time_value(start_time, time_line);
			}
		}
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

function GridPanelToggle() {
	var oldHeight = $('#TaskQuery').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#TaskQuery').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#TaskQuery').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function HeaderQueryData() {
	var queryText = Ext.get('txtDICTATE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
		parameters: '{"DICTATE_NAME":"' + queryText + '"}'
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
	$('#TaskQuery').height(defHeight - 210);
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
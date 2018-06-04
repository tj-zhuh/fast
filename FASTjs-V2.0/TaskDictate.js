function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['DICTATE_CONTENT', 'DICTIONARY_NAME', 'DICTATE_SENTTIME', 'DICTATE_REACTTIME', 'DICTATE_REACTTEXT', 'TASK_OPERATOR', 'SEQUENCE_NAME'],
		autoLoad: true,
		//pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/DICTATE_LOGGING/GetView/UserId0000/SessionId0000/',
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
	Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore'),
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '指令内容',
			align: 'center',
			dataIndex: 'DICTATE_CONTENT',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}, {
			text: '发送目标',
			align: 'center',
			dataIndex: 'DICTIONARY_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}, {
			text: '发送时间',
			align: 'center',
			dataIndex: 'DICTATE_SENTTIME',
			sortable: false,
			menuDisabled: true,
			flex: 0.16,
			renderer: function (value) {
				return new Date(Date.parse(value)).format("yyyy-MM-dd");
			}
		}, {
			text: '反馈时间',
			align: 'center',
			dataIndex: 'DICTATE_REACTTIME',
			sortable: false,
			menuDisabled: true,
			flex: 0.16,
			renderer: function (value) {
				return new Date(Date.parse(value)).format("yyyy-MM-dd");
			}
		}, {
			text: '反馈内容',
			align: 'center',
			dataIndex: 'DICTATE_REACTTEXT',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}, {
			text: '反馈人员',
			align: 'center',
			dataIndex: 'TASK_OPERATOR',
			sortable: false,
			menuDisabled: true,
			flex: 0.16
		}
		],

		width: "100%",
		height: "100%",
		renderTo: divPanel
	});
}

function HeaderQueryData() {
	var queryText1 = $('#combo_system_code').val();
	var queryTexta = $('#txtSTATISTICS_TIME_BEGIN').val();
	var queryTextb = $('#txtSTATISTICS_TIME_END').val();

	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
		parameters: '{"System_Code":"' + queryText1 + '","BEGIN_TIME":"' + queryTexta + '","END_TIME":"' + queryTextb + '"}'
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
	var oldHeight = $('#TaskDictate').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#TaskDictate').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#TaskDictate').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function ReSetSubViewSize(isFirstLoad) {
    var $center = $('.main-center-container');
    var defWidth = $center.width();
    var defHeight = $center.height();
    if ((defWidth + 300) < FAST.visibleWidth && (defHeight + 109) <= FAST.visibleHeight) {
        defWidth += 17;
    }
    console.log('Current Center Size : ' + defWidth + ' x ' + defHeight);

    $('div.center-grid-basic-border').width(defWidth - 50).height(defHeight - 170);

    $('div.center-grid-basic-area').width(defWidth - 100).height(defHeight - 220);

    ///重绘表格
    if (!isFirstLoad) {
        //调整大小
        $('div.x-grid-body').width(defWidth - 100).height(defHeight - 220 - 32);
        $('div.x-grid-view').width(defWidth - 100).height(defHeight - 220 - 32);
    }
};

///初始化，事件绑定
$(function () {
	///窗体大小调整
    //$(window).resize(ReSetSubViewSize);

	///窗体大小
    ReSetSubViewSize(true);

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
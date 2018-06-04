function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ["SEQUENCE_ID", "SEQUENCE_NAME", "SEQUENCE_BEGIN", "SEQUENCE_TIMELINE", "SEQUENCE_END", "SEQUENCE_TASK", "SEQUENCE_TYPE", "SEQUENCE_STATE", "SEQUENCE_OPERATOR", "BUSINESS_SORT", "DESCRIPTION_INFO", "LASTMODIFY_TIME", "ENABLE_SIGN", "TASKTYPE_NAME", "TASKSTATE_NAME", "USER_NAME", "DICTATE_MODE", "DICTATE_RECV"],
		autoLoad: true,
		//pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_SEQUENCE/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'SEQUENCE_ID',
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
			text: '源名',
			dataIndex: 'SEQUENCE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.27
		}, {
			text: '观测模式',
			align: 'center',
			dataIndex: 'DICTATE_MODE',
			sortable: false,
			menuDisabled: true,
			flex: 0.1
		}, {
			text: '接收机编号',
			align: 'center',
			dataIndex: 'DICTATE_RECV',
			sortable: false,
			menuDisabled: true,
			flex: 0.1
		}, {
			text: '计划时间',
			dataIndex: 'SEQUENCE_BEGIN',
			sortable: false,
			menuDisabled: true,
			flex: 0.125
		}, {
			text: '持续时间',
			align: 'center',
			dataIndex: 'SEQUENCE_TIMELINE',
			sortable: false,
			menuDisabled: true,
			flex: 0.1
		}, {
			text: '计划结束',
			dataIndex: 'SEQUENCE_END',
			sortable: false,
			menuDisabled: true,
			flex: 0.125
		}, {
			text: '任务状态',
			align: 'center',
			dataIndex: 'TASKSTATE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.07,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				if (value != '等待') {
					return '<a id="btnState' + rowIndex + '" class="linkbutton" href="#" style="color:green;">' + value + '</a>';
				} else {
					return '<a id="btnState' + rowIndex + '" class="linkbutton" href="#" style="color:gray;" >' + value + '</a>';
				}
			}
		}],

		width: "100%",
		height: "100%",
		renderTo: divPanel
	});
}

function GridPanelToggle() {
	var oldHeight = $('#TaskStatus').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#TaskStatus').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#TaskStatus').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function HeaderQueryData() {
	//var queryText = Ext.get('txtINSTITUTION_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	//gridStore.proxy.extraParams = {
	//	parameters: '{"INSTITUTION_NAME":"' + queryText + '"}'
	//};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			//console.log('The DataStore callback was running!');

			if (!success)
				Nuts.Caches.onRequestError(operation);
		}
	});
}

///窗体大小调整
function ReSetWindowViewSize(isPostBacked) {
	var defWidth = $(window).width();
	var defHeight = $(window).height();

	if (defHeight < 900) {
		defHeight = 900;
	}
	console.log('Current Operator View Size : ' + defWidth + ' x ' + defHeight);
	$('#TaskStatus').height(defHeight - 130);
	$('#pnlGirdView').height(defHeight - 220);

	///重绘表格
	if (isPostBacked == true) {
		//初次加载
	} else {
		//调整大小
		$('div.x-grid-body').height(defHeight - 201);
		$('div.x-grid-view').height(defHeight - 213);
	}
};

///初始化，事件绑定
$(function () {
	///窗体大小调整
	$(window).resize(ReSetWindowViewSize);

	///窗体大小
	ReSetWindowViewSize(true);
});
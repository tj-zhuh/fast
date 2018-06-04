$(function () {
	var store1 = createStore();
	var grid1 = createGrid();
});

function createStore() {
	return Ext.create('Ext.data.Store', {
		storeId: 'store1',
		fields: ["SEQUENCE_ID", "SEQUENCE_NAME", "DICTATE_MODE", "DICTATE_RECV", "SEQUENCE_BEGIN", "SEQUENCE_TIMELINE", "SEQUENCE_END", "TASKSTATE_NAME", ],
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_SEQUENCE/GetViewForBigScreen/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'SEQUENCE_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		},
	});
}

function createGrid() {
	return Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('store1'),
		viewConfig: {
			getRowClass: function (record, rowIndex) {
				if (rowIndex % 2 == 0) {
					return 'odd-task-row';
				}
				return 'even-task-row';
			},
			loadMask: false,
		},

		border: 0,
		rowLines: false,

		columns: [{
			text: '源名',
			align: 'center',
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
			flex: 0.095
		}, {
			text: '接收机编号',
			align: 'center',
			dataIndex: 'DICTATE_RECV',
			sortable: false,
			menuDisabled: true,
			flex: 0.11
		}, {
			text: '持续时间',
			align: 'center',
			dataIndex: 'SEQUENCE_TIMELINE',
			sortable: false,
			menuDisabled: true,
			flex: 0.095
		}, {
			text: '状态',
			align: 'center',
			dataIndex: 'TASKSTATE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.07,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				switch (value) {
					case '未开始':
						return "<span class='notstart'>" + value + "</span>";
					case '开始':
						return "<span class='start'>" + value + "</span>";
					case '准备':
						return "<span class='prepare'>" + value + "</span>";
					case '观测':
						return "<span class='observe'>" + value + "</span>";
					case '终止':
						return "<span class='stop'>" + value + "</span>";
					case '结束':
						return "<span class='finish'>" + value + "</span>";
					default:
						//return "<span>" + value + "</span>";
						return "";
				}
			}
		}],

		width: "100%",
		height: "100%",
		renderTo: Ext.get('grid-container'),
	});
};

///自动刷新
function clock() {
	var gridStore = Ext.data.StoreManager.lookup('store1');
	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			if (!success)
				Nuts.Caches.onRequestError(operation);
		}
	});
}
var autoRefrashTime = self.setInterval("clock()", 5000);
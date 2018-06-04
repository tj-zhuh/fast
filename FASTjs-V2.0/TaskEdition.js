var grid;
var dictateGrid;
var current_sequence_id;
var editWindow = createEditWindow();
var uploadWindow = createUploadWindow();
var dictateWindow;
var checkedList = [];

function LoadGridData() {
	createScanStore();
	createSimpsonsStore();
	createDictateStore();

	grid = createGrid();
	dictateGrid = createDictateGrid();
	dictateWindow = createDictateWindow();

	resetWindows();
};

function createScanStore() {
	Ext.define('scanModel', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'DICTATE_SCANDIR', type: 'int' },
			{ name: 'DICTATE_SCANDIR_TEXT', type: 'string' }
		]
	});

	return Ext.create('Ext.data.Store', {
		storeId: 'scanStore',
		model: 'scanModel',
		data: [
			{ DICTATE_SCANDIR: 10, DICTATE_SCANDIR_TEXT: '---' },
			{ DICTATE_SCANDIR: 0, DICTATE_SCANDIR_TEXT: '赤经' },
			{ DICTATE_SCANDIR: 1, DICTATE_SCANDIR_TEXT: '赤纬' },
		]
	});
};

function createSimpsonsStore() {
	return Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['SEQUENCE_ID', 'DICTATE_ID', 'SEQUENCE_NAME', 'SEQUENCE_STATE', 'DICTATE_RA', 'DICTATE_DEC', 'DICTATE_EPOCH', 'DICTATE_PID', 'SEQUENCE_TYPE', 'DICTATE_RECV', 'DICTATE_BKND', 'DICTATE_TIMELINE', 'DICTATE_STARTTIME', 'DICTATE_OFFSETSIGN', 'SEQUENCE_BEGIN', 'DICTATE_SCANDIR', 'DICTATE_SCANSPEED', 'DICTATE_SCANSPACE', 'DICTATE_STARTRA', 'DICTATE_STARTDEC', 'DICTATE_STOPRA', 'DICTATE_STOPDEC', 'DICTATE_IDTAG', 'DICTATE_PR', 'DICTATE_PD', 'DESCRIPTION_INFO', 'ENABLE_SIGN', 'BUSINESS_SORT'],
		autoLoad: true,
		pageSize: 10,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_EDITION/GetTaskView/UserId0000/SessionId0000/',
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
};

function createDictateStore() {
	return Ext.create('Ext.data.Store', {
		storeId: 'dictateStore',
		fields: ['SEQUENCE_ID', 'SEQUENCE_STATE', 'DICTATE_ID', 'SEQUENCE_NAME', 'DICTATE_RA', 'DICTATE_DEC', 'DICTATE_EPOCH', 'DICTATE_PID', 'SEQUENCE_TYPE', 'DICTATE_RECV', 'DICTATE_BKND', 'DICTATE_TIMELINE', 'DICTATE_OFFSETSIGN', 'DICTATE_STARTTIME', 'DICTATE_SCANDIR', 'DICTATE_SCANSPEED', 'DICTATE_SCANSPACE', 'DICTATE_STARTRA', 'DICTATE_STARTDEC', 'DICTATE_STOPRA', 'DICTATE_STOPDEC', 'DICTATE_IDTAG', 'DICTATE_PR', 'DICTATE_PD', 'DESCRIPTION_INFO', 'ENABLE_SIGN', 'BUSINESS_SORT'],
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_EDITION/GetDictatsView/UserId0000/SessionId0000/',
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
};

function createGrid() {
	var divPanel = Ext.get('pnlGirdView');
	return Ext.create('Ext.grid.Panel', {
		selType: 'rowmodel',
		store: Ext.data.StoreManager.lookup('simpsonsStore'),
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},
		overflowX: 'auto',

		columns: [{
			text: '操作',
			//locked: true,
			align: 'center',
			width: 150,
			sortable: false,
			menuDisabled: true,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				var all_buttons = '';
				var hasSave = false;
				if (record.data.SEQUENCE_STATE.toUpperCase() == 'DEFAULT') {
					hasSave = true;
					//all_buttons += '<input type="checkbox"  class="x-grid-row-checkbox" onclick="GridCellChecked(' + rowIndex + ')"/>&nbsp;';
					all_buttons += '<a class="x-grid-row-checker" id="checkbox' + rowIndex + '"  href="javascript:GridCellChecked(' + rowIndex + ');"></a>&nbsp;';
				}

				if (record.data.SEQUENCE_TYPE == 6) {
					all_buttons += '<a class="x-grid-row-imageEdit" href="javascript:GridCellClick_Dictate(' + rowIndex + ',' + hasSave + ');"></a>';
				} else {
					all_buttons += '<a class="x-grid-row-imageEdit" href="javascript:GridCellClick(' + rowIndex + ',' + hasSave + ');"></a>';
				}

				if (record.data.SEQUENCE_STATE.toUpperCase() == 'DEFAULT') {
					all_buttons += '&nbsp;<a class="x-grid-row-imageDelete" href="javascript:GridCellClick_Delete(' + rowIndex + ');"></a>';
				}

				return all_buttons;
			}
		}, {
			text: '源名',
			width: 340,
			align: 'center',
			dataIndex: 'SEQUENCE_NAME',
			sortable: false,
			menuDisabled: true
		}, {
			text: '赤经',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_RA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '赤纬',
			width: 160,
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
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_PID',
			sortable: false,
			menuDisabled: true
		}, {
			text: '观测模式',
			width: 120,
			align: 'center',
			dataIndex: 'SEQUENCE_TYPE',
			sortable: false,
			menuDisabled: true
		}, {
			text: '接收机编号',
			width: 140,
			align: 'center',
			dataIndex: 'DICTATE_RECV',
			sortable: false,
			menuDisabled: true
		}, {
			text: '终端模式编号',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_BKND',
			sortable: false,
			menuDisabled: true
		}, {
			text: '持续时间(秒)',
			width: 160,
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
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_OFFSETSIGN',
			sortable: false,
			menuDisabled: true,
			renderer: function (value) {
				if (value == 1)
					return "是";
				return "否";
			}
		}, {
			text: '起始时刻',
			width: 240,
			align: 'center',
			dataIndex: 'SEQUENCE_BEGIN',
			sortable: false,
			menuDisabled: true
		}, {
			text: '设定沿赤经/赤纬扫描',
			width: 260,
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
			width: 180,
			align: 'center',
			dataIndex: 'DICTATE_SCANSPEED',
			sortable: false,
			menuDisabled: true
		}, {
			text: '扫描间隔角度',
			width: 180,
			align: 'center',
			dataIndex: 'DICTATE_SCANSPACE',
			sortable: false,
			menuDisabled: true
		}, {
			text: '起始赤经',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_STARTRA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '结束赤经',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_STOPRA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '起始赤纬',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_STARTDEC',
			sortable: false,
			menuDisabled: true
		}, {
			text: '结束赤纬',
			width: 160,
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
			text: '沿赤经扫描速度',
			width: 200,
			align: 'center',
			dataIndex: 'DICTATE_PR',
			sortable: false,
			menuDisabled: true
		}, {
			text: '沿赤纬扫描速度',
			width: 200,
			align: 'center',
			dataIndex: 'DICTATE_PD',
			sortable: false,
			menuDisabled: true
		}, {
			text: '备注',
			width: 500,
			align: 'center',
			dataIndex: 'DESCRIPTION_INFO',
			sortable: false,
			menuDisabled: true
		}, ],

		bbar: ['->', {
			xtype: 'pagingtoolbar',
			store: Ext.data.StoreManager.lookup('simpsonsStore'),
			listeners: {
				"beforechange": function (bbar, page, eOpts) {
					var qryName = Ext.get('txtDICTATE_NAME').dom.value;
					var qryStart = Ext.get('starttmvalue').dom.value;
					var qryTask = Ext.get('taskid').dom.value;
					var qryMark = Ext.get('remark').dom.value;

					bbar.store.extraParams = {
						parameters: '{"SEQUENCE_NAME":"' + qryName + '","DICTATE_STARTTIME":"' + qryStart + '","DICTATE_IDTAG":"' + qryTask + '","DESCRIPTION_INFO":"' + qryMark + '"}'
					};
				}
			}
		}, '->'],

		width: "100%",
		height: "100%",
		renderTo: divPanel
	});
};

function createDictateGrid() {
	return Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('dictateStore'),
		bodyPadding: '5 35 5 35',
		selType: 'rowmodel',
		height: 180,
		listeners: {
			select: function (scope, record, index, eOpts) {
				dictateWindow.down('form').loadRecord(record);
			}
		},
		columns: [{
			text: '操作',
			locked: true,
			align: 'center',
			width: 70,
			sortable: false,
			menuDisabled: true,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				var all_buttons = '';
				if (record.data.SEQUENCE_STATE.toUpperCase() == 'DEFAULT') {
					all_buttons += '<a class="x-grid-row-imageDelete" href="javascript:GridCellClick_DeleteDictate(' + rowIndex + ');"></a>';
				}
				return all_buttons;
			}
		}, {
			text: '赤经',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_RA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '赤纬',
			width: 160,
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
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_PID',
			sortable: false,
			menuDisabled: true
		}, {
			text: '接收机编号',
			width: 140,
			align: 'center',
			dataIndex: 'DICTATE_RECV',
			sortable: false,
			menuDisabled: true
		}, {
			text: '终端模式编号',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_BKND',
			sortable: false,
			menuDisabled: true
		}, {
			text: '持续时间(秒)',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_TIMELINE',
			sortable: false,
			menuDisabled: true
		}, {
			text: '后移标识',
			width: 120,
			align: 'center',
			dataIndex: 'DICTATE_OFFSETSIGN',
			sortable: false,
			menuDisabled: true,
			renderer: function (value) {
				if (value == 1)
					return "是";
				return "否";
			}
		}, {
			text: '起始时刻',
			width: 240,
			align: 'center',
			dataIndex: 'DICTATE_STARTTIME',
			sortable: false,
			menuDisabled: true
		}, {
			text: '设定沿赤经/赤纬扫描',
			width: 280,
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
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_SCANSPEED',
			sortable: false,
			menuDisabled: true
		}, {
			text: '扫描间隔角度',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_SCANSPACE',
			sortable: false,
			menuDisabled: true
		}, {
			text: '起始赤经',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_STARTRA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '结束赤经',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_STOPRA',
			sortable: false,
			menuDisabled: true
		}, {
			text: '起始赤纬',
			width: 160,
			align: 'center',
			dataIndex: 'DICTATE_STARTDEC',
			sortable: false,
			menuDisabled: true
		}, {
			text: '结束赤纬',
			width: 160,
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
			text: '沿赤经扫描速度',
			width: 200,
			align: 'center',
			dataIndex: 'DICTATE_PR',
			sortable: false,
			menuDisabled: true
		}, {
			text: '沿赤纬扫描速度',
			width: 200,
			align: 'center',
			dataIndex: 'DICTATE_PD',
			sortable: false,
			menuDisabled: true
		}, {
			text: '备注',
			width: 500,
			align: 'center',
			dataIndex: 'DESCRIPTION_INFO',
			sortable: false,
			menuDisabled: true
		}]
	});
}

function createEditWindow() {
	return Ext.create('Ext.window.Window', {
		id: 'pnlGirdForm',
		title: '观测任务编辑',
		width: 990,
		height: 665,
		modal: true,
		layout: 'fit',
		border: false,
		closable: true,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		items: [{
			xtype: 'form',
			border: false,
			layout: 'column',
			bodyPadding: '5 10 5 35',
			fieldDefaults: {
				labelWidth: 180,
				msgTarget: 'side',
				labelAlign: 'left',
				labelStyle: 'font-weight:bold'
			},
			items: [{
				xtype: 'hiddenfield',
				name: 'SEQUENCE_ID'
			}, {
				xtype: 'hiddenfield',
				name: 'DICTATE_ID'
			}, {
				xtype: 'hiddenfield',
				name: 'ENABLE_SIGN'
			}, {
				xtype: 'hiddenfield',
				name: 'BUSINESS_SORT'
			}, {
				columnWidth: 0.47,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				baseCls: "x-plain",
				items: [{
					xtype: 'textfield',
					allowBlank: false,
					name: 'SEQUENCE_NAME',
					fieldLabel: '源名'
				}, {
					xtype: 'textfield',
					allowBlank: false,
					name: 'DICTATE_RA',
					fieldLabel: '赤经',
					emptyText: '00 00 00.000'
				}, {
					xtype: 'textfield',
					allowBlank: false,
					name: 'DICTATE_DEC',
					fieldLabel: '赤纬',
					emptyText: '+00 00 00.00'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_EPOCH',
					fieldLabel: '历元',
					emptyText: '2000'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_PID',
					fieldLabel: '项目编号'
				}, {
					xtype: 'numberfield',
					name: 'SEQUENCE_TYPE',
					allowBlank: false,
					fieldLabel: '观测模式',
					minValue: 1,
					maxValue: 7,
				}, {
					xtype: 'textfield',
					name: 'DICTATE_RECV',
					fieldLabel: '接收机编号'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_BKND',
					fieldLabel: '终端模式编号'
				}, {
					xtype: 'numberfield',
					name: 'DICTATE_TIMELINE',
					fieldLabel: '持续时间(秒)',
					minValue: 0
				}, {
					xtype: 'textfield',
					fieldLabel: '沿赤经扫描速度',
					name: 'DICTATE_PR'
				}]
			}, {
				columnWidth: .5,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				baseCls: "x-plain",
				bodyStyle: "padding-left:10px;",
				items: [{
					xtype: 'textfield',
					name: 'DICTATE_OFFSETSIGN',
					fieldLabel: '后移标识'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_STARTTIME',
					emptyText: (new Date()).toFormat("yyyyMMdd hhmmss +08"),
					fieldLabel: '起始时刻'
				}, {
					xtype: 'combo',
					name: 'DICTATE_SCANDIR',
					fieldLabel: '沿赤经/赤纬扫描',
					fieldLabel: '扫描方向',
					queryMode: 'local',
					displayField: 'DICTATE_SCANDIR_TEXT',
					valueField: 'DICTATE_SCANDIR',
					hiddenName: 'DICTATE_SCANDIR',
					store: Ext.data.StoreManager.lookup('scanStore')
				}, {
					xtype: 'textfield',
					name: 'DICTATE_SCANSPEED',
					fieldLabel: '扫描运动速度'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_SCANSPACE',
					fieldLabel: '扫描间隔角度'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_STARTRA',
					fieldLabel: '起始赤经',
					emptyText: '00 00 00.000'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_STOPRA',
					fieldLabel: '结束赤经',
					emptyText: '00 00 00.000'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_STARTDEC',
					fieldLabel: '起始赤纬',
					emptyText: '+00 00 00.00'
				}, {
					xtype: 'textfield',
					name: 'DICTATE_STOPDEC',
					fieldLabel: '结束赤纬',
					emptyText: '+00 00 00.00'
				}, {
					xtype: 'textfield',
					fieldLabel: '沿赤纬扫描速度',
					name: 'DICTATE_PD'
				}]
			}, {
				columnWidth: 0.97,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				baseCls: "x-plain",
				items: [{
					xtype: 'textfield',
					name: 'DICTATE_IDTAG',
					fieldLabel: '任务标识'
				}, {
					xtype: 'textareafield',
					name: 'DESCRIPTION_INFO',
					fieldLabel: '备注说明'
				}]
			}
			],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				layout: {
					pack: 'center'
				},
				items: [{
					text: '新 增',
					id: 'taskedition_addbutton',
					scope: this,
					handler: function (scope) {
						var editForm = Ext.WindowManager.get('pnlGirdForm');
						var button = editForm.down('button');
						if (button.text == "新 增") {
							FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Concrete/TASK_EDITION/', [], '2|新增指令', '新增天文观测指令');
						} else {
							FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-update', '../../Concrete/TASK_EDITION/', [], '2|编辑指令', '编辑天文观测指令');
						}
					}
				}, {
					text: '另存为',
					id: 'taskedition_saveasbutton',
					scope: this,
					handler: function (scope) {
						var editForm = Ext.WindowManager.get('pnlGirdForm');
						FAST.OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Concrete/TASK_EDITION/', [], '2|新增指令', '新增天文观测指令');
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
		}]
	});
};

function createDictateWindow() {
	return Ext.create('Ext.window.Window', {
		id: 'dictateWindow',
		title: '指令列表编辑',
		width: 990,
		height: 735,
		modal: true,
		layout: 'form',
		border: false,
		closable: true,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		items: [
			dictateGrid,
			{
				xtype: 'form',
				border: false,
				layout: 'column',
				bodyPadding: '5 10 5 35',
				fieldDefaults: {
					labelWidth: 180,
					msgTarget: 'side',
					labelAlign: 'left',
					labelStyle: 'font-weight:bold'
				},
				items: [
				{
					xtype: 'hiddenfield',
					name: 'SEQUENCE_ID'
				}, {
					xtype: 'hiddenfield',
					name: 'DICTATE_ID'
				}, {
					xtype: 'hiddenfield',
					name: 'ENABLE_SIGN'
				}, {
					xtype: 'hiddenfield',
					name: 'BUSINESS_SORT',
				}, {
					columnWidth: 0.485,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					baseCls: "x-plain",
					items: [{
						xtype: 'textfield',
						allowBlank: false,
						name: 'SEQUENCE_NAME',
						fieldLabel: '源名'
					}, {
						xtype: 'textfield',
						allowBlank: false,
						name: 'DICTATE_RA',
						fieldLabel: '赤经',
						emptyText: '00 00 00.000'
					}, {
						xtype: 'textfield',
						allowBlank: false,
						name: 'DICTATE_DEC',
						fieldLabel: '赤纬',
						emptyText: '+00 00 00.00'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_EPOCH',
						fieldLabel: '历元',
						emptyText: '2000'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_PID',
						fieldLabel: '项目编号'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_RECV',
						fieldLabel: '接收机编号'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_BKND',
						fieldLabel: '终端模式编号'
					}, {
						xtype: 'numberfield',
						name: 'DICTATE_TIMELINE',
						fieldLabel: '持续时间(秒)'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_OFFSETSIGN',
						fieldLabel: '后移标识'
					}, {
						xtype: 'textfield',
						fieldLabel: '沿赤经扫描速度',
						name: 'DICTATE_PR'
					}]
				}, {
					columnWidth: 0.49,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					baseCls: "x-plain",
					items: [{
						xtype: 'numberfield',
						name: 'SEQUENCE_TYPE',
						allowBlank: false,
						fieldLabel: '观测模式',
						minValue: 1,
						maxValue: 7,
					}, {
						xtype: 'textfield',
						name: 'DICTATE_STARTTIME',
						emptyText: (new Date()).toFormat("yyyyMMdd hhmmss +08"),
						fieldLabel: '起始时刻',
					}, {
						xtype: 'combo',
						name: 'DICTATE_SCANDIR',
						fieldLabel: '沿赤经/赤纬扫描',
						fieldLabel: '扫描方向',
						queryMode: 'local',
						displayField: 'DICTATE_SCANDIR_TEXT',
						valueField: 'DICTATE_SCANDIR',
						hiddenName: 'DICTATE_SCANDIR',
						store: Ext.data.StoreManager.lookup('scanStore')
					}, {
						xtype: 'textfield',
						name: 'DICTATE_SCANSPEED',
						fieldLabel: '扫描运动速度'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_SCANSPACE',
						fieldLabel: '扫描间隔角度'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_STARTRA',
						fieldLabel: '起始赤经'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_STOPRA',
						fieldLabel: '结束赤经'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_STARTDEC',
						fieldLabel: '起始赤纬'
					}, {
						xtype: 'textfield',
						name: 'DICTATE_STOPDEC',
						fieldLabel: '结束赤纬'
					}, {
						xtype: 'textfield',
						fieldLabel: '沿赤纬扫描速度',
						name: 'DICTATE_PD'
					}]
				}, {
					columnWidth: 0.975,
					layout: "form",
					baseCls: "x-plain",
					items: [{
						xtype: 'textfield',
						name: 'DICTATE_IDTAG',
						fieldLabel: '任务标识'
					}, {
						xtype: 'textfield',
						name: 'DESCRIPTION_INFO',
						fieldLabel: '备注说明'
					}]
				}]
			}],
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			ui: 'footer',
			layout: {
				pack: 'center'
			},
			items: [{
				id: 'dictate_save',
				text: '保 存',
				handler: function (scope) {
					var form = dictateWindow.down('form').getForm();
					var dictate_id = form.findField('DICTATE_ID').getValue();
					if (!dictate_id) {
						FAST.OnWarnEvent('请选择需要保存的记录！<br/><br/>');
						return;
					}
					if (form.isValid()) {
						form.submit({
							submitEmptyText: false,
							clientValidation: true,
							url: '../../Concrete/TASK_EDITION/UpdateModel/2|编辑指令/修改天文观测指令/?parameters={}',
							success: function (f, operate) {
								QueryDictateData();
							},
							failure: function (f, operate) {
								QueryDictateData();
								if (this.response.status != 200)
									FAST.OnErrorEvent('保存天文指令内容失败！<br/>' + this.response.statusText);
							}
						});
					} else {
						FAST.OnWarnEvent('请按照提示补全遗漏项！<br/><br/>');
					}
				}
			}, {
				id: 'dictate_addOther',
				text: '追 加',
				handler: function (scope) {
					var form = dictateWindow.down('form').getForm();
					if (form.isValid()) {
						form.findField('SEQUENCE_ID').setValue(current_sequence_id);
						form.submit({
							submitEmptyText: false,
							clientValidation: true,
							url: '../../Concrete/TASK_EDITION/AppendDictate/2|新增指令/添加天文观测指令/?parameters={}',
							success: function (f, operate) {
								QueryDictateData();
							},
							failure: function (f, operate) {
								QueryDictateData();
								if (this.response.status != 200)
									FAST.OnErrorEvent('追加天文指令内容失败！<br/>' + this.response.statusText);
							}
						});
					} else {
						FAST.OnWarnEvent('请按照提示补全遗漏项！<br/><br/>');
					}
				}
			}, {
				text: '另存为',
				handler: function (scope) {
					var form = dictateWindow.down('form').getForm();
					var dictate_id = form.findField('DICTATE_ID').getValue();
					if (!dictate_id) {
						FAST.OnWarnEvent('请选择需要保存的记录！<br/><br/>');
						return;
					}
					if (form.isValid()) {
						form.submit({
							submitEmptyText: false,
							clientValidation: true,
							url: '../../Concrete/TASK_EDITION/SaveAsTask/2|新增指令/添加天文观测指令/?parameters={}',
							success: function (f, operate) {
								HeaderQueryData();
								FAST.OnWarnEvent('天文任务另存为成功！<br/><br/>');
							},
							failure: function (f, operate) {
								HeaderQueryData();
								if (this.response.status != 200)
									FAST.OnErrorEvent('保存天文指令内容失败！<br/>' + this.response.statusText);
								FAST.OnInfoEvent('天文任务另存为成功！<br/><br/>');
							}
						});
					} else {
						FAST.OnWarnEvent('请按照提示补全遗漏项！<br/><br/>');
					}
				}
			}, {
				text: '取 消',
				scope: this,
				handler: function (scope) {
					var dictateWindow = Ext.WindowManager.get('dictateWindow');
					dictateWindow.down('form').getForm().reset();
					dictateWindow.hide();
				}
			}]
		}]
	});
}

function createUploadWindow() {
	return Ext.create('Ext.window.Window', {
		id: 'uploadWindow',
		title: '上传文件',
		width: 600,
		height: 170,
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
				labelWidth: 130,
				labelAlign: 'left',
				labelStyle: 'font-weight:bold'
			},
			items: [
			{
				xtype: "filefield",
				emptyText: '选择文件存放路径',

				allowBlank: false,
				name: 'txtFile',
				anchor: "90%",
				buttonText: '选择文件'
			}]
		},
		buttons: [{
			text: '确 定',
			scope: this,
			handler: function (scope) {
				var form = uploadWindow.down('form').getForm();
				if (form.isValid()) {
					form.submit({
						url: '../../Concrete/TASK_EDITION/ImportFile/2|指令导入/导入TXT格式的观测指令集/',
						waitMsg: '处理中，请稍候...',
						method: 'post',
						success: function (fp, o) {
							FAST.OnInfoEvent('操作处理成功!<br/><br/>');
							HeaderQueryData();
						},
						failure: function (fp, o) {
							if (o && o.response && o.response.responseText == "Success") {
								FAST.OnInfoEvent('操作处理成功!<br/><br/>');
								HeaderQueryData();
							}
							else {
								FAST.OnInfoEvent('处理失败!<br/><br/>');
							}
						}
					});
				}
			}
		}, {
			text: '取 消',
			scope: this,
			handler: function (scope) {
				uploadWindow.hide();
			}
		}]
	});
};

function resetWindows() {
	var editForm = Ext.WindowManager.get('pnlGirdForm');
	if (editForm != null && editForm != undefined) {
		Ext.WindowManager.unregister(editForm);
	}
	var _deleteElement = document.getElementById('pnlGirdForm');
	if (_deleteElement) {
		_deleteElement.parentNode.removeChild(_deleteElement);
	}

	editForm = Ext.WindowManager.get('uploadWindow');
	if (editForm != null && editForm != undefined) {
		Ext.WindowManager.unregister(editForm);
	}
	_deleteElement = document.getElementById('uploadWindow');
	if (_deleteElement) {
		_deleteElement.parentNode.removeChild(_deleteElement);
	}

	editForm = Ext.WindowManager.get('dictateWindow');
	if (editForm != null && editForm != undefined) {
		Ext.WindowManager.unregister(editForm);
	}
	_deleteElement = document.getElementById('dictateWindow');
	if (_deleteElement) {
		_deleteElement.parentNode.removeChild(_deleteElement);
	}
};

function HeaderInsertForm() {
	var add_button = Ext.getCmp('taskedition_addbutton', editWindow);
	add_button.setText('新 增');
	add_button.show();

	var save_as_button = Ext.getCmp('taskedition_saveasbutton', editWindow);
	save_as_button.hide();

	editWindow.down('form').getForm().reset();
	editWindow.show();
};

function GridCellClick(rowIndex, hasSave) {
	var add_button = Ext.getCmp('taskedition_addbutton', editWindow);
	if (hasSave) {
		add_button.setText('保 存');
		add_button.show();
	} else {
		add_button.hide();
	}

	var save_as_button = Ext.getCmp('taskedition_saveasbutton', editWindow);
	save_as_button.show();

	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
	editWindow.down('form').loadRecord(gridStore.getAt(rowIndex));
	editWindow.show();
};

function GridCellClick_Delete(rowIndex) {
	Ext.MessageBox.alert({
		title: '提 示',
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
					url: '../../Concrete/TASK_EDITION/DeleteTask/2|删除指令/删除天文观测指令/?_dc=' + (new Date().getTime()) + '&parameters={}',
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
};

function GridCellClick_Dictate(rowIndex) {
	var current_Sequence = Ext.data.StoreManager.lookup('simpsonsStore').getAt(rowIndex).data;
	current_sequence_id = current_Sequence.SEQUENCE_ID;

	QueryDictateData();
	dictateGrid.getSelectionModel().clearSelections();

	var dictate_save = Ext.getCmp('dictate_save', dictateWindow);
	var dictate_addOther = Ext.getCmp('dictate_addOther', dictateWindow);

	if (current_Sequence.SEQUENCE_STATE.toUpperCase() == 'DEFAULT') {
		dictate_save.show();
		dictate_addOther.show();
	} else {
		dictate_save.hide();
		dictate_addOther.hide();
	}

	dictateWindow.show();
};

function GridCellClick_DeleteDictate(rowIndex) {
	Ext.MessageBox.alert({
		title: '提 示',
		msg: '确定天文指令内容么？<br/><br/>',
		width: 360,
		buttons: Ext.MessageBox.WARNING,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.ERROR,
		fn: function (optional) {
			if (optional == "ok") {
				var gridStore = Ext.data.StoreManager.lookup('dictateStore');
				var record = gridStore.getAt(rowIndex).data;

				Ext.Ajax.request({
					url: '../../Concrete/TASK_EDITION/RemoveDictate/2|移除指令/移除天文观测指令/?_dc=' + (new Date().getTime()) + '&parameters={}',
					method: 'POST',
					params: record,
					success: function (response, options) {
						QueryDictateData();
						FAST.OnInfoEvent('移除天文指令内容成功!<br/><br/>');
					},
					failure: function (response, options) {
						FAST.OnErrorEvent('移除天文指令内容失败！<br/>' + response.statusText);
					}
				});
			}
		}
	});
};

function HeaderQueryData() {
	var qryName = Ext.get('txtDICTATE_NAME').dom.value;
	var qryStart = Ext.get('starttmvalue').dom.value;
	var qryTask = Ext.get('taskid').dom.value;
	var qryMark = Ext.get('remark').dom.value;

	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_NAME":"' + qryName + '","DICTATE_STARTTIME":"' + qryStart + '","DICTATE_IDTAG":"' + qryTask + '","DESCRIPTION_INFO":"' + qryMark + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			//console.log('The DataStore callback was running!');

			if (!success)
				FAST.OnRequestError(operation);
		}
	});

	checkedList = [];
};

function HeaderDeleteList() {
	if (!checkedList || checkedList.length < 1) {
		FAST.OnInfoEvent("请选择要删除的记录！<br/><br/>");
		return;
	}

	Ext.MessageBox.alert({
		title: '提 示',
		msg: '确定要删除选中的记录么？<br/><br/>',
		width: 360,
		buttons: Ext.MessageBox.WARNING,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.WARNING,
		fn: function (optional) {
			if (optional == "ok") {
				var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
				var record = gridStore.getAt(0).data;
				record.SEQUENCE_ID = checkedList.join(',');

				Ext.Ajax.request({
					url: '../../Concrete/TASK_EDITION/DeleteTasks/2|删除指令/删除天文观测指令/?_dc=' + (new Date().getTime()) + '&parameters={}',
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
};

function GridCellChecked(rowIndex) {
	var $checkObj = $('#checkbox' + rowIndex);
	var sequenceObject = Ext.data.StoreManager.lookup('simpsonsStore').getAt(rowIndex).data;
	sequenceId = sequenceObject.SEQUENCE_ID;

	if ($checkObj.hasClass('x-checkbox-selected')) {
		$checkObj.removeClass('x-checkbox-selected');
		checkedList[rowIndex] = '';
	} else {
		$checkObj.addClass('x-checkbox-selected');
		checkedList[rowIndex] = sequenceId;
	}
};

function QueryDictateData() {
	var dictateStore = Ext.data.StoreManager.lookup('dictateStore');
	dictateStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_ID":"' + current_sequence_id + '"}'
	};

	dictateStore.load({
		scope: this,
		callback: function (records, operation, success) {
			if (!success)
				Nuts.Caches.onRequestError(operation);

			dictateGrid.getSelectionModel().select(0);
		}
	});
};

function Import() {
	uploadWindow.show();
}

function exportGrid() {
	FAST.ExportExcel(grid);
};

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
		$('div.x-grid-body').width(defWidth - 100).height(defHeight - (120 + 25 * 2 + 55 + 25 + 95));
		$('div.x-grid-view').width(defWidth - 100).height(defHeight - (120 + 25 * 2 + 55 + 25 + 95 + 2));
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
		//$border.animate({ height: '51px' }, 'normal');
	}
};

function GridViewClose() {
	$('div.center-grid-basic-border').addClass('x-hide');
};

function InitQueryHeader() {
	var date = (Ext.Date.add(new Date(), Ext.Date.DAY, -1)).toFormat("yyyyMMdd");
	$('#starttmvalue').attr('placeholder', date);
};

/*
** 全局初始化
********************************************************************************************************************************/

///窗体大小
ReSetSubViewSize(true);
InitQueryHeader();
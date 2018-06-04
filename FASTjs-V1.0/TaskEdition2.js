var grid;
var dictateGrid;
var current_sequence_id;
var editWindow = createEditWindow();
var uploadWindow = createUploadWindow();
var dictateWindow;

function LoadGridData() {
    createScanStore();
    createSimpsonsStore();
    createDictateStore();

    grid = createGrid();
    dictateGrid = createDictateGrid();
    dictateWindow = createDictateWindow();

    resetWindows();

    //grid.getSelectionModel().selectRow(0);
}

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
}

function createSimpsonsStore() {
    return Ext.create('Ext.data.Store', {
        storeId: 'simpsonsStore',
        fields: ['SEQUENCE_ID', 'DICTATE_ID', 'SEQUENCE_NAME', 'DICTATE_RA', 'DICTATE_DEC', 'DICTATE_EPOCH', 'DICTATE_PID', 'SEQUENCE_TYPE', 'DICTATE_RECV', 'DICTATE_BKND', 'SEQUENCE_TIMELINE', 'DICTATE_OFFSETSIGN', 'SEQUENCE_BEGIN', 'DICTATE_SCANDIR', 'DICTATE_SCANSPEED', 'DICTATE_SCANSPACE', 'DICTATE_STARTRA', 'DICTATE_STARTDEC', 'DICTATE_STOPRA', 'DICTATE_STOPDEC', 'DICTATE_IDTAG', 'DESCRIPTION_INFO', 'ENABLE_SIGN', 'BUSINESS_SORT'],
        autoLoad: true,
        //pageSize: 100,

        proxy: {
            type: 'ajax',
            url: '../../Concrete/DICTATE_CONTENT/GetTaskList/UserId0000/SessionId0000/',
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

function createDictateStore() {
    return Ext.create('Ext.data.Store', {
        storeId: 'dictateStore',
        fields: ['SEQUENCE_ID', 'DICTATE_ID', 'SEQUENCE_NAME', 'DICTATE_RA', 'DICTATE_DEC', 'DICTATE_EPOCH', 'DICTATE_PID', 'SEQUENCE_TYPE', 'DICTATE_RECV', 'DICTATE_BKND', 'DICTATE_TIMELINE', 'DICTATE_OFFSETSIGN', 'DICTATE_STARTTIME', 'DICTATE_SCANDIR', 'DICTATE_SCANSPEED', 'DICTATE_SCANSPACE', 'DICTATE_STARTRA', 'DICTATE_STARTDEC', 'DICTATE_STOPRA', 'DICTATE_STOPDEC', 'DICTATE_IDTAG', 'DESCRIPTION_INFO', 'ENABLE_SIGN', 'BUSINESS_SORT'],
        autoLoad: false,
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
}

function createGrid() {
    var divPanel = Ext.get('pnlGirdView');
    return Ext.create('Ext.grid.Panel', {
        selType: 'rowmodel',
        store: Ext.data.StoreManager.lookup('simpsonsStore'),
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true
        },

        columns: [ {
            text: '操作',
            //locked: true,
            align: 'center',
            width: 150,
            sortable: false,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex) {
                var edit_button = '<a class="linkbutton" href="javascript:GridCellClick(' + rowIndex + ');">编辑</a>';
                var splitor = '&nbsp;&nbsp;&nbsp;';
                var delete_button = '<a class="linkbutton" href="javascript:GridCellClick_Delete(' + rowIndex + ');">删除</a>';
                var all_buttons = edit_button + splitor + delete_button;
                var ditate_button = '<a class="linkbutton" href="javascript:GridCellClick_Dictate(' + rowIndex + ');">指令列表</a>';
                if (record.data.SEQUENCE_TYPE == 6) {
                    all_buttons += splitor + ditate_button;
                }
                return all_buttons;
            }
        },{
            text: '源名',
            width: 230,
            align: 'center',
            dataIndex: 'SEQUENCE_NAME',
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
            dataIndex: 'SEQUENCE_TYPE',
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
            dataIndex: 'SEQUENCE_TIMELINE',
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
            dataIndex: 'SEQUENCE_BEGIN',
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
        },],

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
}

function createDictateGrid() {
    return Ext.create('Ext.grid.Panel', {
        store: Ext.data.StoreManager.lookup('dictateStore'),
        bodyPadding: '5 35 5 35',
        selType: 'rowmodel',
        height: 220,
        listeners: {
            select: function (scope, record, index, eOpts) {
                dictateWindow.down('form').loadRecord(record);
            }
        },
        columns: [{
            text: '操作',
            locked: true,
            align: 'center',
            width: 100,
            sortable: false,
            menuDisabled: true,
            renderer: function (value, metaData, record, rowIndex, colIndex) {
                var delete_button = '<a class="linkbutton" href="javascript:GridCellClick_DeleteDictate(' + rowIndex + ');">删除</a>';
                return delete_button;
            }
        },{
            text: '赤径',
            width: 150,
            align: 'center',
            dataIndex: 'DICTATE_RA',
            sortable: false,
            menuDisabled: true
        }, {
            text: '赤纬',
            width: 150,
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
    });
}

function createEditWindow() {
    return Ext.create('Ext.window.Window', {
        id: 'pnlGirdForm',
        title: '观测任务编辑',
        width: 800,
        height: 450,
        modal: true,
        layout: 'form',
        border: false,
        closable: true,
        resizable: true,
        closeAction: 'hide',
        items: {
            xtype: 'form',
            border: false,
            layout: 'column',
            bodyPadding: '5 10 5 35',
            fieldDefaults: {
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
            },

            {
                columnWidth: .45,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                baseCls: "x-plain",
                items: [
                   {
                       xtype: 'textfield',
                       allowBlank: false,
                       name: 'SEQUENCE_NAME',
                       fieldLabel: '源名',
                       emptyText: '请输入源名'
                   }, {
                       xtype: 'textfield',
                       allowBlank: false,
                       name: 'DICTATE_RA',
                       fieldLabel: '赤径',
                       emptyText: '请输入赤径'
                   }, {
                       xtype: 'textfield',
                       allowBlank: false,
                       name: 'DICTATE_DEC',
                       fieldLabel: '赤纬',
                       emptyText: '请输入赤纬'
                   }, {
                       xtype: 'textfield',
                       name: 'DICTATE_EPOCH',
                       fieldLabel: '历元',
                       emptyText: '请输入历元'
                   }, {
                       xtype: 'textfield',
                       name: 'DICTATE_PID',
                       fieldLabel: '项目编号',
                       emptyText: '请输入项目编号'
                   }, {
                       xtype: 'numberfield',
                       name: 'SEQUENCE_TYPE',
                       allowBlank: false,
                       fieldLabel: '观测模式',
                       emptyText: '请输入观测模式',
                       minValue: 1,
                       maxValue: 6,
                   }, {
                       xtype: 'textfield',
                       name: 'DICTATE_RECV',
                       fieldLabel: '接收机编号',
                       emptyText: '请输入接收机编号'
                   }, {
                       xtype: 'textfield',
                       name: 'DICTATE_BKND',
                       fieldLabel: '终端模式编号',
                       emptyText: '请输入终端模式编号'
                   }, {
                       xtype: 'numberfield',
                       name: 'DICTATE_TIMELINE',
                       fieldLabel: '持续时间(秒)',
                       emptyText: '请输入持续时间(秒)'
                   },
                ]
            },
            {
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
                    fieldLabel: '后移标识',
                    emptyText: '请输入后移标识'
                }, {
                    xtype: 'datefield',
                    name: 'DICTATE_STARTTIME',
                    format: 'Ymd His +08',
                    fieldLabel: '起始时刻',
                    emptyText: '请输入起始时刻'
                }, {
                    xtype: 'combo',
                    name: 'DICTATE_SCANDIR',
                    fieldLabel: '沿赤径/赤纬扫描',
                    emptyText: '选择沿赤径/赤纬扫描',
                    fieldLabel: '位置',
                    queryMode: 'local',
                    displayField: 'DICTATE_SCANDIR_TEXT',
                    valueField: 'DICTATE_SCANDIR',
                    hiddenName: 'DICTATE_SCANDIR',
                    store: Ext.data.StoreManager.lookup('scanStore')
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_SCANSPEED',
                    fieldLabel: '扫描运动速度',
                    emptyText: '请输入扫描运动速度'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_SCANSPACE',
                    fieldLabel: '扫描间隔角度',
                    emptyText: '请输入扫描间隔角度'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_STARTRA',
                    fieldLabel: '起始赤径',
                    emptyText: '请输入起始赤径'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_STOPRA',
                    fieldLabel: '结束赤径',
                    emptyText: '请输入结束赤径'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_STARTDEC',
                    fieldLabel: '起始赤纬',
                    emptyText: '请输入起始赤纬'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_STOPDEC',
                    fieldLabel: '结束赤径',
                    emptyText: '请输入结束赤径'
                }, ],
            },
            {
                columnWidth: 0.95,
                layout: "form",
                baseCls: "x-plain",
                items: [{
                    xtype: 'textfield',
                    name: 'DICTATE_IDTAG',
                    fieldLabel: '任务标识',
                    emptyText: '请输入任务标识'
                }, {
                    xtype: 'textareafield',
                    name: 'DESCRIPTION_INFO',
                    fieldLabel: '备注说明',
                    emptyText: '请输入备注说明'
                }],
            },

            ]
        },
        buttons: [{
            text: '新 增',
            id:'taskedition_addbutton',
            scope: this,
            handler: function (scope) {
                var editForm = Ext.WindowManager.get('pnlGirdForm');
                var button = editForm.down('button');
                if (button.text == "新 增") {
                    OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Concrete/DICTATE_CONTENT/');
                } else {
                    OnExcuteRequest(editForm.down('form').getForm(), 'form-update', '../../Concrete/DICTATE_CONTENT/');
                }
            }
        }, {
            text: '另存为',
            id:'taskedition_saveasbutton',
            scope: this,
            handler: function (scope) {
                var editForm = Ext.WindowManager.get('pnlGirdForm');
                OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Concrete/DICTATE_CONTENT/');
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
}

function createDictateWindow() {
    return Ext.create('Ext.window.Window', {
        id: 'dictateWindow',
        title: '指令列表编辑',
        width: 800,
        height: 680,
        modal: true,
        layout: 'form',
        border: false,
        closable: true,
        resizable: true,
        closeAction: 'hide',
        items: [dictateGrid, {
            xtype: 'form',
            border: false,
            layout: 'column',
            bodyPadding: '5 10 5 35',
            fieldDefaults: {
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
            },

            {
                columnWidth: .45,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                baseCls: "x-plain",
                items: [{
                    xtype: 'textfield',
                    allowBlank: false,
                    name: 'SEQUENCE_NAME',
                    fieldLabel: '源名',
                    emptyText: '请输入源名'
                }, {
                    xtype: 'textfield',
                    allowBlank: false,
                    name: 'DICTATE_RA',
                    fieldLabel: '赤径',
                    emptyText: '请输入赤径'
                }, {
                    xtype: 'textfield',
                    allowBlank: false,
                    name: 'DICTATE_DEC',
                    fieldLabel: '赤纬',
                    emptyText: '请输入赤纬'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_EPOCH',
                    fieldLabel: '历元',
                    emptyText: '请输入历元'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_PID',
                    fieldLabel: '项目编号',
                    emptyText: '请输入项目编号'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_RECV',
                    fieldLabel: '接收机编号',
                    emptyText: '请输入接收机编号'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_BKND',
                    fieldLabel: '终端模式编号',
                    emptyText: '请输入终端模式编号'
                }, {
                    xtype: 'numberfield',
                    name: 'DICTATE_TIMELINE',
                    fieldLabel: '持续时间(秒)',
                    emptyText: '请输入持续时间(秒)'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_OFFSETSIGN',
                    fieldLabel: '后移标识',
                    emptyText: '请输入后移标识'
                },
                ]
            },
            {
                columnWidth: .5,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                baseCls: "x-plain",
                bodyStyle: "padding-left:10px;",
                items: [{
                    xtype: 'numberfield',
                    name: 'SEQUENCE_TYPE',
                    allowBlank: false,
                    fieldLabel: '观测模式',
                    emptyText: '请输入观测模式',
                    minValue: 1,
                    maxValue: 6,
                }, {
                    xtype: 'datefield',
                    name: 'DICTATE_STARTTIME',
                    format: 'Ymd His +08',
                    fieldLabel: '起始时刻',
                    emptyText: '请输入起始时刻'
                }, {
                    xtype: 'combo',
                    name: 'DICTATE_SCANDIR',
                    fieldLabel: '沿赤径/赤纬扫描',
                    emptyText: '选择沿赤径/赤纬扫描',
                    fieldLabel: '位置',
                    queryMode: 'local',
                    displayField: 'DICTATE_SCANDIR_TEXT',
                    valueField: 'DICTATE_SCANDIR',
                    hiddenName: 'DICTATE_SCANDIR',
                    store: Ext.data.StoreManager.lookup('scanStore')
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_SCANSPEED',
                    fieldLabel: '扫描运动速度',
                    emptyText: '请输入扫描运动速度'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_SCANSPACE',
                    fieldLabel: '扫描间隔角度',
                    emptyText: '请输入扫描间隔角度'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_STARTRA',
                    fieldLabel: '起始赤径',
                    emptyText: '请输入起始赤径'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_STOPRA',
                    fieldLabel: '结束赤径',
                    emptyText: '请输入结束赤径'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_STARTDEC',
                    fieldLabel: '起始赤纬',
                    emptyText: '请输入起始赤纬'
                }, {
                    xtype: 'textfield',
                    name: 'DICTATE_STOPDEC',
                    fieldLabel: '结束赤径',
                    emptyText: '请输入结束赤径'
                }, ],
            },
            {
                columnWidth: 0.95,
                layout: "form",
                baseCls: "x-plain",
                items: [{
                    xtype: 'textfield',
                    name: 'DICTATE_IDTAG',
                    fieldLabel: '任务标识',
                    emptyText: '请输入任务标识'
                }, {
                    xtype: 'textareafield',
                    name: 'DESCRIPTION_INFO',
                    fieldLabel: '备注说明',
                    emptyText: '请输入备注说明'
                }],
            },

            ]
        }],
        buttons: [{
            text: '删除',
            handler: function (scope) {
                var form = dictateWindow.down('form').getForm();
                var dictate_id = form.findField('DICTATE_ID').getValue();
                if (!dictate_id) {
                    OnWarnEvent('需要选中某条指令才可以删除！');
                    return;
                }

                Ext.MessageBox.alert({
                    title: '提 示',
                    msg: '确定要删除该指令么？',
                    width: 360,
                    buttons: Ext.MessageBox.WARNING,
                    buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
                    icon: Ext.MessageBox.ERROR,
                    fn: function (optional) {
                        if (optional == "ok") {
                            Ext.Ajax.request({
                                url: '../../Concrete/DICTATE_CONTENT/DeleteDictate/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
                                method: 'POST',
                                params: { Dictate_Id: dictate_id, SEQUENCE_ID: current_sequence_id },
                                success: function (response, options) {
                                    OnInfoEvent('操作处理成功!'); 
                                    QueryDictateData();
                                    dictateWindow.down('form').getForm().reset();

                                },
                                failure: function (response, options) {
                                    OnResponseError(response);
                                }
                            });
                        }
                    }
                }); 
            }
        },{
            text: '编辑',
            handler: function (scope) {
                var form = dictateWindow.down('form').getForm();
                var dictate_id = form.findField('DICTATE_ID').getValue();
                if (!dictate_id) {
                    OnWarnEvent('需要选中某条指令才可以编辑！');
                    return;
                }
                if (form.isValid()) {
                    form.submit({
                        submitEmptyText: false,
                        clientValidation: true,
                        url: '../../Concrete/DICTATE_CONTENT/EditDictate/UserId0000/SessionId0000/?parameters={}',
                        success: function (f, operate) {
                            QueryDictateData();
                            OnSubmitResponse(this.response, f)
                        },
                        failure: function (f, operate) {
                            QueryDictateData();
                            OnSubmitResponse(this.response, f)
                        }
                    });
                } else {
                    OnWarnEvent('请按照提示补全遗漏项！');
                }
            }
        }, {
            text: '新增/另存',
            handler: function (scope) {
                var form = dictateWindow.down('form').getForm();
                if (form.isValid()) {
                    form.findField('SEQUENCE_ID').setValue(current_sequence_id);
                    form.submit({
                        submitEmptyText: false,
                        clientValidation: true,
                        url: '../../Concrete/DICTATE_CONTENT/NewDictate/UserId0000/SessionId0000/?parameters={}',
                        success: function (f, operate) {
                            QueryDictateData();
                            OnSubmitResponse(this.response, f)
                        },
                        failure: function (f, operate) {
                            QueryDictateData();
                            OnSubmitResponse(this.response, f)
                        }
                    });
                } else {
                    OnWarnEvent('请按照提示补全遗漏项！');
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
    });
}

function createUploadWindow() {
    return Ext.create('Ext.window.Window', {
        id: 'uploadWindow',
        title: '上传文件',
        width: 500,
        height: 150,
        modal: true,
        layout: 'fit',
        border: false,
        closable: true,
        resizable: true,
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
                        url: '../../Concrete/DICTATE_CONTENT/ImportFile/UserId0000/SessionId0000/',
                        waitMsg: '处理中，请稍候...',
                        method: 'post',
                        success: function (fp, o) {
                            OnInfoEvent('操作处理成功!');
                            HeaderQueryData();
                        },
                        failure: function (fp, o) {

                            if (o && o.response && o.response.responseText == "Success") {
                                OnInfoEvent('操作处理成功!');
                                HeaderQueryData();
                            }
                            else {
                                OnInfoEvent('处理失败!');
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
}

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
}





function HeaderInsertForm() {
    var add_button = Ext.getCmp('taskedition_addbutton', editWindow);
    add_button.setText('新 增');

    var save_as_button = Ext.getCmp('taskedition_saveasbutton', editWindow);
    save_as_button.hide();

    editWindow.down('form').getForm().reset();    
    editWindow.show();

  
}

function GridCellClick(rowIndex) {
    var add_button = Ext.getCmp('taskedition_addbutton', editWindow);
    add_button.setText('保 存');

    var save_as_button = Ext.getCmp('taskedition_saveasbutton', editWindow);
    save_as_button.show();

    var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
    editWindow.down('form').loadRecord(gridStore.getAt(rowIndex));
    editWindow.show();
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
                    url: '../../Concrete/DICTATE_CONTENT/DeleteTask/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
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

function GridCellClick_Dictate(rowIndex) {

    current_sequence_id = Ext.data.StoreManager.lookup('simpsonsStore').getAt(rowIndex).data.SEQUENCE_ID;
    QueryDictateData();

    dictateGrid.getSelectionModel().clearSelections();
    dictateWindow.show();

}

function GridCellClick_DeleteDictate(rowIndex) {
    Ext.MessageBox.alert({
        title: '提 示',
        msg: '确定要删除该指令么？',
        width: 360,
        buttons: Ext.MessageBox.WARNING,
        buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
        icon: Ext.MessageBox.ERROR,
        fn: function (optional) {
            if (optional == "ok") {
                var gridStore = Ext.data.StoreManager.lookup('dictateStore');
                var record = gridStore.getAt(rowIndex).data;
                record.ENABLE_SIGN = 0;

                Ext.Ajax.request({
                    url: '../../Concrete/DICTATE_CONTENT/DeleteDictate/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
                    method: 'POST',
                    params: record,
                    success: function (response, options) {
                        OnInfoEvent('操作处理成功!');
                        //HeaderQueryData();
                        QueryDictateData();
                    },
                    failure: function (response, options) {
                        OnResponseError(response);
                    }
                });
            }
        }
    });
}

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
}

function GridPanelToggle() {
    var oldHeight = $('#TaskEdition').height();
    if (oldHeight == 50) {
        oldHeight = $('a.centerCollapseButton').attr('oldHeight');
        $('#centerContent').css('display', 'block');
        $('#TaskEdition').height(oldHeight);
        $('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
    } else {
        $('a.centerCollapseButton').attr('oldHeight', oldHeight);
        $('#centerContent').css('display', 'none');
        $('#TaskEdition').height(50);
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
    $('#TaskEdition').height(defHeight - 210);
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

function Import() {
    uploadWindow.show();
}

function exportGrid() {
    exportExcel(grid);
}
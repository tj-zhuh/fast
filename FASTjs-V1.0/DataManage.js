var grid;
function LoadGridData() {
    Ext.create('Ext.data.Store', {
        storeId: 'simpsonsStore',
        fields: ['DEVICE_NAME', 'STATISTICS_ID', 'DEVICE_ID', 'STATISTICS_CONTENT', 'STATISTICS_TIME', 'STATISTICS_OPERATOR', 'DESCRIPTION_INFO', 'ENABLE_SIGN'],
        autoLoad: true,
        //pageSize: 100,

        proxy: {
            type: 'ajax',
            url: '../../Concrete/SYSTEM_STATISTICS/GetView/UserId0000/SessionId0000/',
            reader: {
                type: 'json',
                root: 'ArrayModels',
                idProperty: 'STATISTICS_ID',
                successProperty: 'success'
            },
            extraParams: {
                parameters: '{}'
            }
        }
    });

    var divPanel = Ext.get('pnlGirdView');
    grid = Ext.create('Ext.grid.Panel', {
        store: Ext.data.StoreManager.lookup('simpsonsStore'),
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true
        },

        columns: [{
            text: '位置',
            align: 'center',
            dataIndex: 'DEVICE_NAME',
            sortable: false,
            menuDisabled: true,
            flex: 0.15
        }, {
            text: '摘要',
            align: 'center',
            dataIndex: 'STATISTICS_CONTENT',
            sortable: false,
            menuDisabled: true,
            flex: 0.15
        }, {
            text: '日期',
            align: 'center',
            dataIndex: 'STATISTICS_TIME',
            sortable: false,
            menuDisabled: true,
            flex: 0.15,
            renderer:function(value){ 
                return new Date(Date.parse(value)).format("yyyy-MM-dd"); 
            }
        }, {
            text: '操作人员',
            align: 'center',
            dataIndex: 'STATISTICS_OPERATOR',
            sortable: false,
            menuDisabled: true,
            flex: 0.15
        }, {
            text: ' 内容',
            align: 'center',
            dataIndex: 'DESCRIPTION_INFO',
            sortable: false,
            menuDisabled: true,
            flex: 0.15
        }, {
            text: '操作',
            align: 'center',
            sortable: false,
            menuDisabled: true,
            flex: 0.25,
            renderer: function (value, metaData, record, rowIndex, colIndex) {
                return '<a class="linkbutton" href="javascript:GridCellClick(' + rowIndex + ');">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="linkbutton" href="javascript:GridCellClick_Delete(' + rowIndex + ');">删除</a>';
            }
        }],

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

    var record = gridStore.getAt(rowIndex);
    record.data.STATISTICS_TIME = new Date(Date.parse(record.data.STATISTICS_TIME)).format("yyyy-MM-dd");

    editForm.down('form').loadRecord(record);
    editForm.down('button').setText('修 改');
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
                    url: '../../Concrete/SYSTEM_STATISTICS/UpdateModel/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
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

function GridPanelToggle() {
    var oldHeight = $('#DataManage').height();
    if (oldHeight == 50) {
        oldHeight = $('a.centerCollapseButton').attr('oldHeight');
        $('#centerContent').css('display', 'block');
        $('#DataManage').height(oldHeight);
        $('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
    } else {
        $('a.centerCollapseButton').attr('oldHeight', oldHeight);
        $('#centerContent').css('display', 'none');
        $('#DataManage').height(50);
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

Ext.create('Ext.data.Store', {
    storeId: 'deviceStore',
    fields: ['DEVICE_NAME', 'DEVICE_ID'],
    autoLoad: true,
    //pageSize: 100,

    proxy: {
        type: 'ajax',
        url: '../../Concrete/SYSTEM_DEVICE/GetView/UserId0000/SessionId0000/',
        reader: {
            type: 'json',
            root: 'ArrayModels',
            idProperty: 'DEVICE_ID',
            successProperty: 'success'
        },
        extraParams: {
            parameters: '{}'
        }
    }
});

var editWindow = Ext.create('Ext.window.Window', {
    id: 'pnlGirdForm',
    title: '静态数据管理',
    width: 600,
    height: 450,
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
            labelWidth: 80,
            labelAlign: 'left',
            labelStyle: 'font-weight:bold'
        },
        items: [
		//隐藏区域
		{
		    xtype: 'hiddenfield',
		    name: 'STATISTICS_ID'
		},
        {
            xtype: 'hiddenfield',
            name: 'ENABLE_SIGN'
        },

		//属性区域
		{
		    xtype: 'combo',
		    name: 'DEVICE_ID',
		    fieldLabel: '位置',
		    emptyText: '请选择位置',
		    queryMode: 'local',
		    displayField: 'DEVICE_NAME',
		    valueField: 'DEVICE_ID',
		    hiddenName: 'DEVICE_ID',
		    store: Ext.data.StoreManager.lookup('deviceStore')
		}, {
		    xtype: 'textfield',
		    allowBlank: false,
		    name: 'STATISTICS_CONTENT',
		    fieldLabel: '摘要',
		    emptyText: '请输入摘要'
		}, {
		    xtype: 'datefield',
		    format: 'Y-m-d',
		    allowBlank: false,
		    name: 'STATISTICS_TIME',
		    fieldLabel: '日期',
		    emptyText: '请选择日期',
		}, {
		    xtype: 'textfield',
		    name: 'STATISTICS_OPERATOR',
		    fieldLabel: '操作人员',
		    emptyText: '请输入操作人员'
		},
		///附加区域
		{
		    xtype: 'textareafield',
		    flex: 1,
		    name: 'DESCRIPTION_INFO',
		    fieldLabel: '内容',
		    emptyText: '请输入内容'
		}]
    },
    buttons: [{
        text: '新 增',
        scope: this,
        handler: function (scope) {
            var editForm = Ext.WindowManager.get('pnlGirdForm');
            var button = editForm.down('button');
            if (button.text == "新 增") {
                OnExcuteRequest(editForm.down('form').getForm(), 'form-insert', '../../Concrete/SYSTEM_STATISTICS/');
            } else {
                OnExcuteRequest(editForm.down('form').getForm(), 'form-update', '../../Concrete/SYSTEM_STATISTICS/');
            }
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

function HeaderInsertForm() {
    var editForm = Ext.WindowManager.get('pnlGirdForm');
    if (editForm != null && editForm != undefined) {
        editForm.show();
        editForm.down('form').getForm().reset();
        editForm.down('button').setText('新 增');
    } else {
        editWindow.show();
    }
}

function ReSetWindowViewSize(isPostBacked) {
    var defWidth = $(window).width();
    var defHeight = $(window).height();

    if (defHeight < 900) {
        defHeight = 900;
    }
    console.log('Current Operater View Size : ' + defWidth + ' x ' + defHeight);
    $('#DataManage').height(defHeight - 210);
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

function exportGrid() {
    exportExcel(grid);
}

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





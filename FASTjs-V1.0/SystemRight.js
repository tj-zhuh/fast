function LoadGridData() {
    Ext.create('Ext.data.Store', {
        storeId: 'simpsonsStore',
        fields: ['INSTITUTION_NAME', 'USER_ID', 'INSTITUTION_ID', 'USER_CODE', 'USER_NAME', 'USER_PASSWORD', 'EMAIL_ADDRESS', 'USER_PHONE', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN', 'LOGGING_TIME'],
        autoLoad: true,
        //pageSize: 100,

        proxy: {
            type: 'ajax',
            url: '../../Master/MASTER_USERROLE/GetView1/UserId0000/SessionId0000/',
            reader: {
                type: 'json',
                root: 'ArrayModels',
                idProperty: 'USER_ID',
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
            text: '编号',
            align: 'center',
            dataIndex: 'USER_CODE',
            sortable: false,
            menuDisabled: true,
            flex: 0.2
        }, {
            text: '姓名',
            align: 'center',
            dataIndex: 'USER_NAME',
            sortable: false,
            menuDisabled: true,
            flex: 0.2
        }, {
            text: '所属机构',
            align: 'center',
            dataIndex: 'INSTITUTION_NAME',
            sortable: false,
            menuDisabled: true,
            flex: 0.2
        }, {
            text: '最后登录时间',
            align: 'center',
            sortable: false,
            menuDisabled: true,
            flex: 0.2
        }, {
            text: '操作',
            align: 'center',
            sortable: false,
            menuDisabled: true,
            flex: 0.2,
            renderer: function (value, metaData, record, rowIndex, colIndex) {
                return '<a class="linkbutton" href="javascript:GridCellClick(' + rowIndex + ');">授权</a>';
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

var userRoleStore = Ext.create('Ext.data.Store', {
    storeId: 'userRoleStore',
    fields: ['ROLE_ID','ROLE_NAME', 'ACTIVE'],
    autoLoad: false,
    //pageSize: 100,

    proxy: {
        type: 'ajax',
        url: '../../Master/MASTER_USERROLE/GetView2/UserId0000/SessionId0000/',
        reader: {
            type: 'json',
            root: 'ArrayModels',
            idProperty: 'ROLE_ID',
            successProperty: 'success'
        },
        extraParams: {
            parameters: '{}'
        }
    }
});

var editWindow = Ext.create('Ext.window.Window', {
    id: 'pnlGirdForm',
    title: '用户角色授权',
    width: 600,
    height: 450,
    modal: true,
    layout: 'fit',
    border: false,
    closable: true,
    resizable: true,
    closeAction: 'hide',
    items: {
        xtype: 'gridpanel',
        store: Ext.data.StoreManager.lookup('userRoleStore'),
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true
        },

        columns: [{
            xtype: 'checkcolumn',
            text: '是否授权',
            dataIndex: 'ACTIVE',
        }, {
            text: '角色',
            align: 'center',
            dataIndex: 'ROLE_NAME',
            sortable: false,
            menuDisabled: true,
            flex: 0.3
        }],

        width: "100%",
        height: "100%",
    },
    buttons: [{
        text: '确 定',
        scope: this,
        handler: function (scope) {
            confirm();
        }
    }, {
        text: '取 消',
        scope: this,
        handler: function (scope) {
            editWindow.hide();
        }
    }]
});

function GridCellClick(rowIndex) {
    var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');
    var record = gridStore.getAt(rowIndex);
    var user_id = record.data.USER_ID;
    
    var userRoleStore = Ext.data.StoreManager.lookup('userRoleStore');

    userRoleStore.proxy.extraParams = {
        parameters: '{"USER_ID":"' + user_id + '"}'
    };

    curr_user_id = user_id;

    userRoleStore.load({
        scope: this,
        callback: function (records, operation, success) {
            console.log('The DataStore callback was running!');

            if (!success)
                Nuts.Caches.onRequestError(operation);
        }
    });

    editWindow.show();
}

function GridPanelToggle() {
    var oldHeight = $('#SystemRight').height();
    if (oldHeight == 50) {
        oldHeight = $('a.centerCollapseButton').attr('oldHeight');
        $('#centerContent').css('display', 'block');
        $('#SystemRight').height(oldHeight);
        $('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
    } else {
        $('a.centerCollapseButton').attr('oldHeight', oldHeight);
        $('#centerContent').css('display', 'none');
        $('#SystemRight').height(50);
        $('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
    }
}

function HeaderQueryData() {
    var queryText = Ext.get('txtUSER_NAME').dom.value;
    var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

    gridStore.proxy.extraParams = {
        parameters: '{"USER_NAME":"' + queryText + '"}'
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
    $('#SystemRight').height(defHeight - 210);
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

var curr_user_id;
function confirm() {
    var pt = 0;
    var arr = new Array();
    $(".x-grid-checkcolumn").each(function () {
        var box = $(this);
        if (box.hasClass('x-grid-checkcolumn-checked')) {
            arr.push(userRoleStore.getAt(pt).data.id);
        }
        pt++;
    });

    var list = arr.join(',');

    var pm = { Role_Id_List: list, USER_ID: curr_user_id };

    Ext.Ajax.request({
        url: '../../Master/MASTER_USERROLE/UpdateModel2/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
        method: 'POST',
        params: pm,
        success: function (response, options) {
            OnInfoEvent('操作处理成功!');
        },
        failure: function (response, options) {
            OnResponseError(response);
        }
    });
}
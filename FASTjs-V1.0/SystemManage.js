var role_id;
var grid1;
var grid2;

function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore1',
		fields: ['ROLE_NAME'],
		autoLoad: true,

		proxy: {
			type: 'ajax',
			url: '../../Master/MASTER_ROLE/GetView/UserId0000/SessionId0000/',
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

	var divPanel1 = Ext.get('pnlGirdView1');
	grid1 = Ext.create('Ext.grid.Panel', {
	    selType: 'rowmodel',	    
		store: Ext.data.StoreManager.lookup('simpsonsStore1'),
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '角色',
			align: 'center',
			dataIndex: 'ROLE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 1
		}],

		width: "100%",
		height: "100%",
		renderTo: divPanel1,

		listeners: {
		    select: function (scope, record, index, eOpts) {		       
		        role_id = record.data.id;
		        HeaderQueryData2();
		    }
		}
	});

	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore2',
		fields: ['FUNCTION_NAME',"FUNCTION_ID","ACTIVE"],
		autoLoad: false,

		proxy: {
			type: 'ajax',
			url: '../../Master/MASTER_ROLEAUTHORS/GetView2/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'FUNCTION_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});

	var divPanel2 = Ext.get('pnlGirdView2');
	grid2 = Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore2'),
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [
            {
		    xtype: 'checkcolumn',
		    text: '授权',
		    dataIndex: 'ACTIVE',
            },
        {
			text: '功能名称',
			align: 'center',
			dataIndex: 'FUNCTION_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.3
		}],

		width: "100%",
		height: "100%",
		renderTo: divPanel2
	});
}

function GridPanelToggle() {
	var oldHeight = $('#SystemManage').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#pnlGirdView1').css('display', 'block');
		$('#pnlGirdView2').css('display', 'block');
		$('#SystemManage').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#pnlGirdView1').css('display', 'none');
		$('#pnlGirdView2').css('display', 'none');
		$('#SystemManage').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function HeaderQueryData() {
	HeaderQueryData1();
	HeaderQueryData2();
}

function HeaderQueryData1() {
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore1');
	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			if (!success)
				Nuts.Caches.onRequestError(operation);
		}
	});
}

function HeaderQueryData2() {
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore2');

	gridStore.proxy.extraParams = {
	    parameters: '{"ROLE_ID":"' + role_id + '"}'
	};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
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
	$('#SystemManage').height(defHeight - 170);
	$('div.centerContent').height(defHeight - 290);
	$('#pnlGirdView1').height(defHeight - 290);
	$('#pnlGirdView2').height(defHeight - 290);

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

function save() {    
    var pt = 0;
    var arr = new Array();
    $(".x-grid-checkcolumn").each(function () {
        var box = $(this);
        if (box.hasClass('x-grid-checkcolumn-checked')) {
            if(grid2.store.getAt(pt))
                arr.push(grid2.store.getAt(pt).data.id);           
        }
        pt++;
    });

    var list = arr.join(',');    

    var pm = { Function_Id_List: list, ROLE_ID: role_id };

    Ext.Ajax.request({
        url: '../../Master/MASTER_ROLEAUTHORS/UpdateModel2/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
        method: 'POST',
        params: pm,
        success: function (response, options) {
            OnInfoEvent('操作处理成功!');
            HeaderQueryData();
        },
        failure: function (response, options) {
            OnResponseError(response);
        }
    });
}

function refresh() {
    HeaderQueryData2();
}
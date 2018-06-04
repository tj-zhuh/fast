
var grids = [];
var stores = [];

$(function () {

    // 顶部的干扰源打开/关闭按钮
    prepare_disturb_button();

    // panel的刷新、最小化、关闭按钮
    prepare_sub_panel_button();

    // 加载store和grid
    prepare_store_and_grid();

	//根据角色初始化按钮
    InitButton();
})



function prepare_sub_panel_button() {

	$('.button-grid-minimize').click(function () {
        var parent = $(this).parent().parent();
        $('.grid-container', parent).slideToggle(350);
    })

    $('.button-grid-cancel').click(function () {
        var parent = $(this).parent().parent();
        parent.hide();
    })

    $('.button-grid-refresh').click(function () {
        var parent = $(this).parent().parent();
        var parent_id = parent.attr('id');
        var storeid = parent_id.replace('s', 'simpsonsStore');
        var store = Ext.data.StoreManager.lookup(storeid);
        store.load();
    })
}

function prepare_store_and_grid() {
    var fields = ['DEVICE_NAME', 'SOURCE_ID', 'SEQUENCE_ID', 'STATUS_SYSTEM', 'DEVICE_ID', 'FEEDSOURCE_DISTANCE', 'FREQUENCY_LOW', 'FREQUENCY_UP', 'CREST_VALUE', 'SHIELDING_TARGET', 'IS_SHIELEDING', 'IS_CLOSED', 'CLOSING_MODE', 'BUSINESS_SORT', 'LASTMODIFY_TIME', 'DESCRIPTION_INFO', 'ENABLE_SIGN'];

    for (var i = 0 ; i < 6; i++) {
        var index = i + 1;
        var storeId = 'simpsonsStore' + index;
        var api = 'GetView' + index;

        var store = Ext.create('Ext.data.Store', {
            storeId: storeId,
            fields: fields,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '../../Concrete/TASK_DISTURB/' + api+ '/UserId0000/SessionId0000/',
                reader: {
                    type: 'json',
                    root: 'ArrayModels',
                    idProperty: 'SOURCE_ID',
                    successProperty: 'success'
                },
                extraParams: {
                    parameters: '{}'
                }
            }
        });

        var container = Ext.get('grid-container' + index);
        var grid = Ext.create('Ext.grid.Panel', {
            store: Ext.data.StoreManager.lookup(storeId),
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },

            columns: [{
                text: '设备名称',
                align: 'center',
                dataIndex: 'DEVICE_NAME',  //外键关联
                sortable: false,
                menuDisabled: true,
                flex: 0.125
            }, {
                text: '与馈源距离(m)',
                align: 'center',
                dataIndex: 'FEEDSOURCE_DISTANCE',
                sortable: false,
                menuDisabled: true,
                flex: 0.125
            }, {
                text: '发射频率(mHz)',
                align: 'center',
                dataIndex: 'c',
                sortable: false,
                menuDisabled: true,
                flex: 0.125,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    var low = record.data.FREQUENCY_LOW;
                    var high = record.data.FREQUENCY_UP;
                    if (low != null && high != null) {
                    	return low + "-" + high;
                    }
                    return "";
                },
            }, {
                text: '峰值频率(mHz)',
                align: 'center',
                dataIndex: 'CREST_VALUE',
                sortable: false,
                menuDisabled: true,
                flex: 0.125
            }, {
                text: '屏蔽频率（mHz)',
                align: 'center',
                dataIndex: 'SHIELDING_TARGET',
                sortable: false,
                menuDisabled: true,
                flex: 0.125
            }, {
                text: '是/否屏蔽',
                align: 'center',
                sortable: false,
                menuDisabled: true,
                flex: 0.125,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    var v = record.data.IS_SHIELEDING;
                    
                    if (v == 1)
                        return "<div class='gridcheckbox selected'></div>"
                    
                    if( v==2)
                        return "<div class='gridcheckbox'></div>"

                    return "";
                },
            }, {
                text: '必须关闭',
                align: 'center',
                sortable: false,
                menuDisabled: true,
                flex: 0.125,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    var v = record.data.IS_CLOSED;
                   
                    if (v == 1)
                        return "<div class='gridcheckbox selected'></div>"

                    if (v == 2)
                        return "<div class='gridcheckbox'></div>"

                    return "";
                },
            }, {
                text: '关闭方式',
                align: 'center',
                sortable: false,
                menuDisabled: true,
                flex: 0.125,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    var v = record.data.CLOSING_MODE;
                    if (v == 1) return "<span class='blue-text'>远程自动</span>";
                    if (v == 2) return "<span class='blue-text'>人工</span>";
                    return "";
                },
            }
            ],

            width: "100%",
            height: "100%",
            renderTo: container
        });

        grids[i] = grid;
        stores[i] = store;
    }

}

function prepare_disturb_button() {

    get_disturb_state();

    $('.center-header-button-disturb').click(function () {
        var el = $(this);

        if (el.hasClass('turnon') && !el.hasClass('turnoff')) {
            set_disturb_state(0)
        }

        if (!el.hasClass('turnon') && el.hasClass('turnoff')) {
            set_disturb_state(1)
        }
    })
}

function get_disturb_state() {
    Ext.Ajax.request({
        url: '../../Concrete/TASK_DISTURB/GetDisturbState/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
        method: 'get',
        success: function (response, options) {
            var d = JSON.parse(response.responseText);
            if (d && d.state == 0) {
                $('.center-header-button-disturb').removeClass('turnon').addClass('turnoff');
            } else if (d && d.state == 1) {
                $('.center-header-button-disturb').removeClass('turnoff').addClass('turnon');
            } else {
                // error
            }
        },
        failure: function (a, b, c) {
            console.log(c)
        }
    });

}

function set_disturb_state(state) {
	var a = state ? '4|开干扰源' : '4|关干扰源';
	var b = state ? '打开干扰源' : '关闭干扰源';
    Ext.Ajax.request({
    	url: '../../Concrete/TASK_DISTURB/SetDisturbState/' + a + '/' + b + '/?_dc=' + (new Date().getTime()) + '&parameters=' + state,
        method: 'get',
        success: function (response, options) {
            var d = JSON.parse(response.responseText);
            if (d && d.state == 0) {
                $('.center-header-button-disturb').removeClass('turnon').addClass('turnoff');
            } else if (d && d.state == 1) {
                $('.center-header-button-disturb').removeClass('turnoff').addClass('turnon');
            } else {
                // error
            }
        },
        failure: function (a, b, c) {
            console.log(c)
        }
    });
}

function InitButton() {
	Ext.Ajax.request({
		url: "../../Master/MASTER_USER/GetSession/UserId0000/SessionId0000/?parameters={}&_dc=" + (new Date().getTime()),
		method: 'GET',
		success: function (response, options) {
			var result = JSON.parse(response.responseText).ArrayModels;
			if (result.DESCRIPTION_INFO == "工程师") {
				$('#btnDisturb').hide();
			}
		},
		failure: function (response, options) {
			FAST.OnResponseError(response);
		}
	});
}

 
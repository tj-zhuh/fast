function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore1',
		fields: ['DEVICE_NAME', 'SOURCE_ID', 'SEQUENCE_ID', 'STATUS_SYSTEM', 'DEVICE_ID', 'FEEDSOURCE_DISTANCE', 'FREQUENCY_LOW', 'FREQUENCY_UP', 'CREST_VALUE', 'SHIELDING_TARGET', 'IS_SHIELEDING', 'IS_CLOSED', 'CLOSING_MODE', 'BUSINESS_SORT', 'LASTMODIFY_TIME', 'DESCRIPTION_INFO', 'ENABLE_SIGN'],
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_DISTURB/GetView1/UserId0000/SessionId0000/',
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

	var divPanel1 = Ext.get('pnlGirdView1');
	Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore1'),
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
			    var text = low + "-" + high;
			    return text;
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
			    return v == 1 ? '是' : '否';
			},
		}, {
			text: '必须关闭',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.125,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
			    var v = record.data.IS_CLOSED;
			    return v == 1 ? '是' : '否';
			},
		}, {
			text: '关闭方式',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			flex: 0.125,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
			    var v = record.data.CLOSING_MODE;
			    if (v == 1) return "远程自动";
			    if (v == 2) return "人工";
			    return "";
			},
		}
		],

		width: "100%",
		height: "100%",
		renderTo: divPanel1
	});

	Ext.create('Ext.data.Store', {
	    storeId: 'simpsonsStore2',
	    fields: ['DEVICE_NAME', 'SOURCE_ID', 'SEQUENCE_ID', 'STATUS_SYSTEM', 'DEVICE_ID', 'FEEDSOURCE_DISTANCE', 'FREQUENCY_LOW', 'FREQUENCY_UP', 'CREST_VALUE', 'SHIELDING_TARGET', 'IS_SHIELEDING', 'IS_CLOSED', 'CLOSING_MODE', 'BUSINESS_SORT', 'LASTMODIFY_TIME', 'DESCRIPTION_INFO', 'ENABLE_SIGN'],
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: '../../Concrete/TASK_DISTURB/GetView2/UserId0000/SessionId0000/',
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

	var divPanel2 = Ext.get('pnlGirdView2');
	Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore2'),
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
		        var text = low + "-" + high;
		        return text;
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
		        return v == 1 ? '是' : '否';
		    },
		}, {
		    text: '必须关闭',
		    align: 'center',
		    sortable: false,
		    menuDisabled: true,
		    flex: 0.125,
		    renderer: function (value, metaData, record, rowIndex, colIndex) {
		        var v = record.data.IS_CLOSED;
		        return v == 1 ? '是' : '否';
		    },
		}, {
		    text: '关闭方式',
		    align: 'center',
		    sortable: false,
		    menuDisabled: true,
		    flex: 0.125,
		    renderer: function (value, metaData, record, rowIndex, colIndex) {
		        var v = record.data.CLOSING_MODE;
		        if (v == 1) return "远程自动";
		        if (v == 2) return "人工";
		        return "";
		    },
		}
		],

		width: "100%",
		height: "100%",
		renderTo: divPanel2
	});
	Ext.create('Ext.data.Store', {
	    storeId: 'simpsonsStore3',
	    fields: ['DEVICE_NAME', 'SOURCE_ID', 'SEQUENCE_ID', 'STATUS_SYSTEM', 'DEVICE_ID', 'FEEDSOURCE_DISTANCE', 'FREQUENCY_LOW', 'FREQUENCY_UP', 'CREST_VALUE', 'SHIELDING_TARGET', 'IS_SHIELEDING', 'IS_CLOSED', 'CLOSING_MODE', 'BUSINESS_SORT', 'LASTMODIFY_TIME', 'DESCRIPTION_INFO', 'ENABLE_SIGN'],
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: '../../Concrete/TASK_DISTURB/GetView3/UserId0000/SessionId0000/',
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

	var divPanel3 = Ext.get('pnlGirdView3');
	Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore3'),
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
		        var text = low + "-" + high;
		        return text;
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
		        return v == 1 ? '是' : '否';
		    },
		}, {
		    text: '必须关闭',
		    align: 'center',
		    sortable: false,
		    menuDisabled: true,
		    flex: 0.125,
		    renderer: function (value, metaData, record, rowIndex, colIndex) {
		        var v = record.data.IS_CLOSED;
		        return v == 1 ? '是' : '否';
		    },
		}, {
		    text: '关闭方式',
		    align: 'center',
		    sortable: false,
		    menuDisabled: true,
		    flex: 0.125,
		    renderer: function (value, metaData, record, rowIndex, colIndex) {
		        var v = record.data.CLOSING_MODE;
		        if (v == 1) return "远程自动";
		        if (v == 2) return "人工";
		        return "";
		    },
		}
		],

		width: "100%",
		height: "100%",
		renderTo: divPanel3
	});
	Ext.create('Ext.data.Store', {
	    storeId: 'simpsonsStore4',
	    fields: ['DEVICE_NAME', 'SOURCE_ID', 'SEQUENCE_ID', 'STATUS_SYSTEM', 'DEVICE_ID', 'FEEDSOURCE_DISTANCE', 'FREQUENCY_LOW', 'FREQUENCY_UP', 'CREST_VALUE', 'SHIELDING_TARGET', 'IS_SHIELEDING', 'IS_CLOSED', 'CLOSING_MODE', 'BUSINESS_SORT', 'LASTMODIFY_TIME', 'DESCRIPTION_INFO', 'ENABLE_SIGN'],
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: '../../Concrete/TASK_DISTURB/GetView4/UserId0000/SessionId0000/',
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

	var divPanel4 = Ext.get('pnlGirdView4');
	Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore4'),
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
		        var text = low + "-" + high;
		        return text;
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
		        return v == 1 ? '是' : '否';
		    },
		}, {
		    text: '必须关闭',
		    align: 'center',
		    sortable: false,
		    menuDisabled: true,
		    flex: 0.125,
		    renderer: function (value, metaData, record, rowIndex, colIndex) {
		        var v = record.data.IS_CLOSED;
		        return v == 1 ? '是' : '否';
		    },
		}, {
		    text: '关闭方式',
		    align: 'center',
		    sortable: false,
		    menuDisabled: true,
		    flex: 0.125,
		    renderer: function (value, metaData, record, rowIndex, colIndex) {
		        var v = record.data.CLOSING_MODE;
		        if (v == 1) return "远程自动";
		        if (v == 2) return "人工";
		        return "";
		    },
		}
		],

		width: "100%",
		height: "100%",
		renderTo: divPanel4
	});
	Ext.create('Ext.data.Store', {
	    storeId: 'simpsonsStore5',
	    fields: ['DEVICE_NAME', 'SOURCE_ID', 'SEQUENCE_ID', 'STATUS_SYSTEM', 'DEVICE_ID', 'FEEDSOURCE_DISTANCE', 'FREQUENCY_LOW', 'FREQUENCY_UP', 'CREST_VALUE', 'SHIELDING_TARGET', 'IS_SHIELEDING', 'IS_CLOSED', 'CLOSING_MODE', 'BUSINESS_SORT', 'LASTMODIFY_TIME', 'DESCRIPTION_INFO', 'ENABLE_SIGN'],
	    autoLoad: true,
	    proxy: {
	        type: 'ajax',
	        url: '../../Concrete/TASK_DISTURB/GetView5/UserId0000/SessionId0000/',
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

	var divPanel5 = Ext.get('pnlGirdView5');
	Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('simpsonsStore5'),
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
		        var text = low + "-" + high;
		        return text;
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
		        return v == 1 ? '是' : '否';
		    },
		}, {
		    text: '必须关闭',
		    align: 'center',
		    sortable: false,
		    menuDisabled: true,
		    flex: 0.125,
		    renderer: function (value, metaData, record, rowIndex, colIndex) {
		        var v = record.data.IS_CLOSED;
		        return v == 1 ? '是' : '否';
		    },
		}, {
		    text: '关闭方式',
		    align: 'center',
		    sortable: false,
		    menuDisabled: true,
		    flex: 0.125,
		    renderer: function (value, metaData, record, rowIndex, colIndex) {
		        var v = record.data.CLOSING_MODE;
		        if (v == 1) return "远程自动";
		        if (v == 2) return "人工";
		        return "";
		    },
		}
		],

		width: "100%",
		height: "100%",
		renderTo: divPanel5
	});
}

Ext.create('Ext.data.Store', {
    storeId: 'simpsonsStore6',
    fields: ['DEVICE_NAME', 'SOURCE_ID', 'SEQUENCE_ID', 'STATUS_SYSTEM', 'DEVICE_ID', 'FEEDSOURCE_DISTANCE', 'FREQUENCY_LOW', 'FREQUENCY_UP', 'CREST_VALUE', 'SHIELDING_TARGET', 'IS_SHIELEDING', 'IS_CLOSED', 'CLOSING_MODE', 'BUSINESS_SORT', 'LASTMODIFY_TIME', 'DESCRIPTION_INFO', 'ENABLE_SIGN'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '../../Concrete/TASK_DISTURB/GetView6/UserId0000/SessionId0000/',
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

var divPanel6 = Ext.get('pnlGirdView6');
Ext.create('Ext.grid.Panel', {
	store: Ext.data.StoreManager.lookup('simpsonsStore6'),
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
	        var text = low + "-" + high;
	        return text;
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
	        return v == 1 ? '是' : '否';
	    },
	}, {
	    text: '必须关闭',
	    align: 'center',
	    sortable: false,
	    menuDisabled: true,
	    flex: 0.125,
	    renderer: function (value, metaData, record, rowIndex, colIndex) {
	        var v = record.data.IS_CLOSED;
	        return v == 1 ? '是' : '否';
	    },
	}, {
	    text: '关闭方式',
	    align: 'center',
	    sortable: false,
	    menuDisabled: true,
	    flex: 0.125,
	    renderer: function (value, metaData, record, rowIndex, colIndex) {
	        var v = record.data.CLOSING_MODE;
	        if (v == 1) return "远程自动";
	        if (v == 2) return "人工";
	        return "";
	    },
	}
	],

	width: "100%",
	height: "100%",
	renderTo: divPanel6
});

//查找
function HeaderQueryData1() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore1');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_ID":"' + queryText + '"}'
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

function HeaderQueryData2() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore2');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_ID":"' + queryText + '"}'
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

function HeaderQueryData3() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore3');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_ID":"' + queryText + '"}'
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

function HeaderQueryData4() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore4');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_ID":"' + queryText + '"}'
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

function HeaderQueryData5() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore5');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_ID":"' + queryText + '"}'
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

function HeaderQueryData6() {
	var queryText = Ext.get('txtSEQUENCE_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore6');

	gridStore.proxy.extraParams = {
		parameters: '{"SEQUENCE_ID":"' + queryText + '"}'
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

function HeaderQueryData() {
	HeaderQueryData1();
	HeaderQueryData2();
	HeaderQueryData3();
	HeaderQueryData4();
	HeaderQueryData5();
	HeaderQueryData6()
}

//折叠表格
function GridPanelToggle1() {
	var oldHeight = $('#TaskDisturb1').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton:eq(0)').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#pnlGirdView1').css('display', 'block');

		$('#TaskDisturb1').height(oldHeight);
		$('a.centerCollapseButton:eq(0)').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton:eq(0)').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#pnlGirdView1').css('display', 'none');

		$('#TaskDisturb1').height(50);
		$('a.centerCollapseButton:eq(0)').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function GridPanelToggle2() {
	var oldHeight = $('#TaskDisturb2').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton:eq(1)').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#pnlGirdView2').css('display', 'block');

		$('#TaskDisturb2').height(oldHeight);
		$('a.centerCollapseButton:eq(1)').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton:eq(1)').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#pnlGirdView2').css('display', 'none');

		$('#TaskDisturb2').height(50);
		$('a.centerCollapseButton:eq(1)').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function GridPanelToggle3() {
	var oldHeight = $('#TaskDisturb3').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton:eq(2)').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#pnlGirdView3').css('display', 'block');

		$('#TaskDisturb3').height(oldHeight);
		$('a.centerCollapseButton:eq(2)').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton:eq(2)').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#pnlGirdView3').css('display', 'none');

		$('#TaskDisturb3').height(50);
		$('a.centerCollapseButton:eq(2)').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function GridPanelToggle4() {
	var oldHeight = $('#TaskDisturb4').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton:eq(3)').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#pnlGirdView4').css('display', 'block');

		$('#TaskDisturb4').height(oldHeight);
		$('a.centerCollapseButton:eq(3)').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton:eq(3)').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#pnlGirdView4').css('display', 'none');

		$('#TaskDisturb4').height(50);
		$('a.centerCollapseButton:eq(3)').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function GridPanelToggle5() {
	var oldHeight = $('#TaskDisturb5').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton:eq(4)').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#pnlGirdView5').css('display', 'block');

		$('#TaskDisturb5').height(oldHeight);
		$('a.centerCollapseButton:eq(4)').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton:eq(4)').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#pnlGirdView5').css('display', 'none');

		$('#TaskDisturb5').height(50);
		$('a.centerCollapseButton:eq(4)').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function GridPanelToggle6() {
	var oldHeight = $('#TaskDisturb6').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton:eq(5)').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#pnlGirdView6').css('display', 'block');

		$('#TaskDisturb6').height(oldHeight);
		$('a.centerCollapseButton:eq(5)').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton:eq(5)').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#pnlGirdView6').css('display', 'none');

		$('#TaskDisturb6').height(50);
		$('a.centerCollapseButton:eq(5)').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function confirm() {
    Ext.Ajax.request({
        url: '../../Concrete/DataDisplay/EMIConfirm/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
        method: 'GET',
        success: function (response, options) {

        },
        failure: function (response, options) {

        }
    });
    alert("点击了√");
}

function cancel() {
    Ext.Ajax.request({
        url: '../../Concrete/DataDisplay/EMICancel/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
        method: 'GET',
        success: function (response, options) {

        },
        failure: function (response, options) {

        }
    });
    alert("点击了叉");
}
$(function () {
	var store1 = createStore();
	var grid1 = createGrid();

	getWeather();
	setInterval(getWeather, 5000);
})

function getWeather() {
	Ext.Ajax.request({
		url: '../../Concrete/SYSTEM_ALTERLOG/GetWeatherForBigScreen/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'get',
		success: function (response, options) {
			showWeather(JSON.parse(response.responseText));
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function clearWeather() {
	$('#weatherPicture').removeClass();
	$('#temperature').html('');
	$('#windDirection').html('');
	$('#windSpeed').html('');
}

function showWeather(datas) {
	$('#weatherPicture').attr('class', '').addClass("Cloudy");
	$('#temperature').html(datas.temperature + '°');
	$('#windDirection').html(datas.windDirection);
	$('#windSpeed').html(datas.windSpeed + 'm/S');
}

function createStore() {
	return Ext.create('Ext.data.Store', {
		storeId: 'store1',
		fields: ['ALARM_NAME', 'ALTER_NAME', 'DEVICE_NAME', 'ALTERING_BEGINTIME', 'ALTERING_ENDTIME', 'ALTERING_CONTENT', 'DESCRIPTION_INFO'],
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '../../Concrete/SYSTEM_ALTERLOG/GetViewForBigScreen/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'ALTERING_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});
}

function createGrid() {
	return Ext.create('Ext.grid.Panel', {
		store: Ext.data.StoreManager.lookup('store1'),
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true,
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
			text: '报警类型',
			align: 'center',
			dataIndex: 'ALTER_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 1
		}, {
			text: '报警设备',
			align: 'center',
			dataIndex: 'DEVICE_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 1
		}, {
			text: '报警时间',
			align: 'center',
			dataIndex: 'ALTERING_BEGINTIME',
			renderer: function (val) {
				if (val)
					return new Date(val.replace('T', ' ').replace('-', '/')).pattern("yyyy-MM-dd HH:mm:ss")
				return "";
			},
			sortable: false,
			menuDisabled: true,
			flex: 1.3
		}, {
			text: '报警内容',
			align: 'center',
			dataIndex: 'ALTERING_CONTENT',
			sortable: false,
			menuDisabled: true,
			flex: 1
		}],

		width: "100%",
		height: "100%",
		renderTo: Ext.get('grid-container'),
	});
}

Date.prototype.pattern = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	var week = {
		"0": "/u65e5",
		"1": "/u4e00",
		"2": "/u4e8c",
		"3": "/u4e09",
		"4": "/u56db",
		"5": "/u4e94",
		"6": "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
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
var autoRefrashTime = self.setInterval("clock()", 5000)
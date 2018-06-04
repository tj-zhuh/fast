window.selectlist = '';
window.serverTime = new Date();

var menuLinks = {
	'gcrwgl': '../TaskManage',
	'gcrwzt': '../TaskStatus',
	'gcrwbj': '../TaskEdition',
	'gcrwbj2': '../TaskEdition2',
	'gcrwcx': '../TaskQuery',
	'gcrwdl': '../TaskQueue',
	'gcrwgr': '../TaskDisturb',
	'gcrwzl': '../TaskDictate',
	'gcrzgl': '../TaskLogging',
	'gcshjk': '../DataMonitor',
	'gcshfs': '../MonitorReflector',
	'gcshky': '../MonitorFeed',
	'gcshjs': '../DataMonitor',
	'zttsgl': '../DebugManage',
	'zttsbj': '../DebugEdition',
	'ztsjgl': '../DataManage',
	'xtqxgl': '../SystemManage',
	'xtqxyh': '../SystemUser',
	'xtqxjs': '../SystemRole',
	'xtqxsq': '../SystemRight',
	'xtqxjg': '../SystemItem',
	'xtqxrz': '../SystemNote',
	'xtcsgl': '../SystemConfig',
	'xtbjgl': '../SystemAlarm'
};

var menuScripts = {
	'gcrwgl': '../Web_GlobalResources/FASTjs-V1.0/TaskManage.js',
	'gcrwzt': '../Web_GlobalResources/FASTjs-V1.0/TaskStatus.js',
	'gcrwbj': '../Web_GlobalResources/FASTjs-V1.0/TaskEdition.js',
	'gcrwbj2': '../Web_GlobalResources/FASTjs-V1.0/TaskEdition2.js',
	'gcrwcx': '../Web_GlobalResources/FASTjs-V1.0/TaskQuery.js',
	'gcrwdl': '../Web_GlobalResources/FASTjs-V1.0/TaskQueue.js',
	'gcrwgr': '../Web_GlobalResources/FASTjs-V1.0/TaskDisturb.js',
	'gcrwzl': '../Web_GlobalResources/FASTjs-V1.0/TaskDictate.js',
	'gcrzgl': '../Web_GlobalResources/FASTjs-V1.0/TaskLogging.js',
	'gcshjk': '../Web_GlobalResources/FASTjs-V1.0/DataMonitor.js',
	'gcshfs': '../Web_GlobalResources/FASTjs-V1.0/MonitorReflector.js',
	'gcshky': '../Web_GlobalResources/FASTjs-V1.0/MonitorFeed.js',
	'gcshjs': '../Web_GlobalResources/FASTjs-V1.0/DataMonitor.js',
	'zttsgl': '../Web_GlobalResources/FASTjs-V1.0/DebugManage.js',
	'zttsbj': '../Web_GlobalResources/FASTjs-V1.0/DebugEdition.js',
	'ztsjgl': '../Web_GlobalResources/FASTjs-V1.0/DataManage.js',
	'xtqxgl': '../Web_GlobalResources/FASTjs-V1.0/SystemManage.js',
	'xtqxyh': '../Web_GlobalResources/FASTjs-V1.0/SystemUser.js',
	'xtqxjs': '../Web_GlobalResources/FASTjs-V1.0/SystemRole.js',
	'xtqxsq': '../Web_GlobalResources/FASTjs-V1.0/SystemRight.js',
	'xtqxjg': '../Web_GlobalResources/FASTjs-V1.0/SystemItem.js',
	'xtqxrz': '../Web_GlobalResources/FASTjs-V1.0/SystemNote.js',
	'xtcsgl': '../Web_GlobalResources/FASTjs-V1.0/SystemConfig.js',
	'xtbjgl': '../Web_GlobalResources/FASTjs-V1.0/SystemAlarm.js'
};

///开始进入调试
function DebugObserverTask(linkId) {
	Ext.MessageBox.alert({
		title: '提 示',
		msg: '确定总控系统要进入整体调试状态么？',
		width: 360,
		buttons: Ext.MessageBox.WARNING,
		buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		icon: Ext.MessageBox.ERROR,
		fn: function (optional) {
			//if (optional == "ok") {
			$.post(menuLinks[linkId], { username: 'UserName', password: 'Password' },
				function (data) {
					if (!data) {
						/*返回为空或异常*/
					} else {
						//$("<link>").attr({
						//	rel: "stylesheet",
						//	type: "text/css",
						//	href: menuStyles[linkId]
						//}).appendTo("head");

						$('div.divrightcol').empty().append(data);

						jQuery.getScript(menuScripts[linkId], function () {
							LoadGridData();
						});
					}
				});
			//}
		}
	});
}

///菜单点击事件
function OnMenuClick(linkId) {
	if (linkId == "zttsgl") {
		DebugObserverTask("zttsgl");
		return;
	}

	if (typeof (autoRefrashTime) != 'undefined') {
		self.clearInterval(autoRefrashTime);
	}
	if (typeof (autoRefrashState) != 'undefined') {
		self.clearInterval(autoRefrashState);
	}
	if (typeof (autoRefrashOrder) != 'undefined') {
		self.clearInterval(autoRefrashOrder);
	}
	//self.clearInterval(autoRefrashStatus);

	$.post(menuLinks[linkId], { username: 'UserName', password: 'Password' },
		function (data) {
			if (!data) {
				/*返回为空或异常*/
			} else {
				//$("<link>").attr({
				//	rel: "stylesheet",
				//	type: "text/css",
				//	href: menuStyles[linkId]
				//}).appendTo("head");

				$('div.divrightcol').empty().append(data);

				jQuery.getScript(menuScripts[linkId], function () {
					LoadGridData();
				});
			}
		});
}

///获取错误详细信息
function OnRequestError(operation) {
	return;
	Ext.MessageBox.alert({
		title: '错 误',
		msg: '服务器内部错误，操作执行失败！<br/>' + operation.error.statusText,
		width: 360,
		buttons: Ext.MessageBox.OKCANCEL,
		buttonText: { ok: '确 定', cancel: '详 细' },
		icon: Ext.MessageBox.ERROR,
		fn: function (optional) {
			if (optional == "cancel") {
				Ext.Ajax.request({
					url: operation.request.url,
					params: operation.request.params,
					method: operation.request.method,
					failure: function (response) {
						if (operation.error.status == 404) {
							Ext.MessageBox.alert({
								title: '详细信息',
								msg: response.responseText,
								width: 560,
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});
						} else {
							var errorMsg = eval('(' + response.responseText + ')');
							var errorAry = [];
							errorAry[0] = '服务器内部错误，操作执行失败！';
							errorAry[1] = 'ExceptionMessage:' + errorMsg['ExceptionMessage'];
							errorAry[2] = 'ExceptionType:' + errorMsg['ExceptionType'];
							errorAry[3] = 'StackTrace:' + errorMsg['StackTrace'];
							errorAry[4] = 'Message:' + errorMsg['Message'];
							Ext.MessageBox.alert({
								title: '详细信息',
								msg: errorAry.join('<br/>'),
								width: 560,
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});
						}
					}
				});
			}
		}
	});
}

///获取错误详细信息
function OnResponseError(response) {
	return;
	Ext.MessageBox.alert({
		title: '错 误',
		msg: '服务器内部错误，操作执行失败！<br/>' + response.statusText,
		width: 360,
		buttons: Ext.MessageBox.OKCANCEL,
		buttonText: { ok: '确 定', cancel: '详 细' },
		icon: Ext.MessageBox.ERROR,
		fn: function (optional) {
			if (optional == "cancel") {
				if (response.status == 404 || response.error.status == 404) {
					Ext.MessageBox.alert({
						title: '详细信息',
						msg: response.responseText,
						width: 560,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
				} else {
					var errorMsg = eval('(' + response.responseText + ')');
					var errorAry = [];
					errorAry[0] = '服务器内部错误，操作执行失败！';
					errorAry[1] = 'ExceptionMessage:' + errorMsg['ExceptionMessage'];
					errorAry[2] = 'ExceptionType:' + errorMsg['ExceptionType'];
					errorAry[3] = 'StackTrace:' + errorMsg['StackTrace'];
					errorAry[4] = 'Message:' + errorMsg['Message'];
					Ext.MessageBox.alert({
						title: '详细信息',
						msg: errorAry.join('<br/>'),
						width: 560,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
				}
			}
		}
	});
}

///显示警告详细信息
function OnWarnEvent(content) {
	Ext.MessageBox.alert({
		title: '警告',
		msg: content + '<br/>',
		width: 360,
		buttons: Ext.MessageBox.OK,
		icon: Ext.MessageBox.WARNING
	});
}

///显示提示详细信息
function OnInfoEvent(content) {
	Ext.MessageBox.alert({
		title: '提示',
		msg: content + '<br/>',
		width: 360,
		buttons: Ext.MessageBox.OK,
		icon: Ext.MessageBox.INFO
	});
}

///调用后台处理进程
function OnExcuteRequest(editForm, operate, action, flushList) {
	//console.log('The ExecuteButton LinkEvent was Requesting!');

	var urlConfig = {
		"form-insert": "InsertModel",
		"form-update": "UpdateModel",
		"form-delete": "DeleteModel",
		"list-delete": "FlushModel"
	};

	if (operate != "list-delete") {
		if (editForm.isValid()) {
			//console.log('The ExecuteButton InnerEvent was Requesting!');

			editForm.submit({
				submitEmptyText: false,
				clientValidation: true,
				url: action + urlConfig[operate] + '/UserId0000/SessionId0000/?parameters={}',
				success: function (form, operate) {
					OnSubmitResponse(this.response, editForm)
				},
				failure: function (form, operate) {
					OnSubmitResponse(this.response, editForm)
				}
			});
		} else {
			OnWarnEvent('请按照提示补全遗漏项！');
		}
	} else {
		///删除选定记录列表
		Ext.Ajax.request({
			url: action + urlConfig[operate] + '/UserId0000/SessionId0000/?parameters=' + flushList.join(','),
			success: function (response) {
				OnInfoEvent('操作处理成功!');
				HeaderQueryData();
			},
			failure: function (response) {
				OnResponseError(response);
				HeaderQueryData();
			}
		});
	}
}

///显示最终操作信息
function OnSubmitResponse(response, editForm) {
	//console.log('The ExecuteButton ResponseEvent was Responding!');

	if (response.status == 200) {
		OnInfoEvent('操作处理成功!');
		//editForm.reset();
		//editForm.up('window').hide();
	} else {
		OnResponseError(response);
	}
	HeaderQueryData();
}

///停止冒泡事件
function OnStopBubble(e) {
	if (e && e.stopPropagation)
		//因此它支持W3C的stopPropagation()方法
		e.stopPropagation();
	else
		//否则，我们需要使用IE的方式来取消事件冒泡
		window.event.cancelBubble = true;
	return false;
}

///菜单栏导航事件
$(function () {
	$('#menu_nav li a span').each(function (i) {
		var linkId = $(this).parents('li').attr('id');

		$(this).on('click', function (item) {
			OnMenuClick(linkId);
		});
	});

	Ext.define('EnableModel', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'comboSign', type: 'int' },
			{ name: 'comboName', type: 'string' }
		]
	});

	Ext.create('Ext.data.Store', {
		storeId: 'enablesStore',
		model: 'EnableModel',
		data: [
				 { comboSign: 1, comboName: '可用' },
				 { comboSign: 0, comboName: '停用' }
		]
	});
});

/**
 * Export grid data. Based on:
 * http://www.sencha.com/forum/showthread.php?125611-data-download-function-from-Grid-and-Chart
 * http://www123.ddo.jp/grid/array-grid.js
 * http://edspencer.net/2009/07/extuxprinter-printing-for-any-ext.html
 * @param {Object} opt (optional)
 *   format: 'html',
 *   headers: true,
 *   stylesheetPath: 'css/print.css'
*/
Ext.grid.GridPanel.prototype.exportData = function (opt) {
	opt = opt || {};

	//Get the array of columns from a grid
	var me = this, columns = [], data = [];
	Ext.each(me.columns, function (col) {
		if (col.hidden != true && col.dataIndex) columns.push(col);
	});
	//Sometimes there's no colum header text (when using icons)
	Ext.each(columns, function (column) {
		if (!column.text || column.text == '&nbsp;') {
			column.text = column.dataIndex;
		}
	});

	//Build a useable array of store data for the XTemplate
	me.store.data.each(function (item) {
		var convertedData = {};

		//apply renderers from column model
		Ext.iterate(item.data, function (key, value) {
			Ext.each(columns, function (column) {
				if (column.dataIndex == key) {
					if (column.renderer) {
						if (column.xtype === 'templatecolumn') {
							convertedData[key] = column.renderer(value, {}, item);
						} else {
							convertedData[key] = column.renderer(value, undefined, undefined, undefined, columns.indexOf(column), undefined, me.view);
						}
					} else {
						convertedData[key] = value;
					}
					if (typeof convertedData[key] === 'string') {
						//convertedData[key] = Ext.util.Format.htmlToText(convertedData[key]);
					}
					return false;
				}
			});
		});

		data.push(convertedData);
	});

	//generate finale template to be applied with the data
	var headings = [], body = [], str;

	headings = opt.headers ? new Ext.XTemplate(
		'<tr>',
		  '<tpl for=".">',
			'<th>{text}</th>',
		  '</tpl>',
		'</tr>'
	).apply(columns) : '';
	body = new Ext.XTemplate(
		'<tr>',
		  '<tpl for=".">',
			'<td>\{{dataIndex}\}</td>',
		  '</tpl>',
		'</tr>'
	).apply(columns);

	var str = [
			Ext.String.format('{0}\n<tpl for=".">{1}\n</tpl>', headings, body)
	].join('\n');
	return new Ext.XTemplate(str).apply(data);
};

function exportExcel(extgrid, filename) {
	var html = extgrid.exportData({
		format: 'html',
		headers: true,
	});

	var form = $("<form>");
	form.attr("style", "display:none");
	form.attr("target", "_blank");
	form.attr("method", "post");
	form.attr("action", '../../Concrete/Common/GetExcel');
	var input1 = $("<input>");
	input1.attr("type", "hidden");
	input1.attr("name", "body");
	input1.attr("value", escape(html));
	$("body").append(form);
	var input2 = $("<input>");
	input2.attr("type", "hidden");
	input2.attr("name", "filename");
	input2.attr("value", filename);
	$("body").append(form);
	form.append(input1);
	form.append(input2);
	form.submit();
	form.remove();

	//var form = Ext.DomHelper.append(document.body, {
	//	tag: 'form',
	//	style: 'display:none',
	//	action: '../../Concrete/Common/GetExcel',
	//	method: 'post',
	//	cn: [{
	//		tag: 'textarea',
	//		name: 'body',
	//		html: escape(html)
	//	}, {
	//		tag: 'input',
	//		name: 'filename',
	//		value: filename
	//	}]
	//});
	form.submit();
	document.body.removeChild(form);
}

Date.prototype.format = function (format) {
	var o =
	{
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" +
			o[k]).substr(("" + o[k]).length));
	return format;
}

function debugIn() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/DebugConfirm/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'GET',
		success: function (response, options) {
		},
		failure: function (response, options) {
		}
	});
}

function getControl() {
	var elements = window.selectlist;
	console.log(elements);

	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/GetControl/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters=' + elements,
		method: 'GET',
		success: function (response, options) {
			console.log(response);
		},
		failure: function (response, options) {
		}
	});
}

function releaseControl() {
	var elements = window.selectlist;
	console.log(elements);

	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/ReleaseControl/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters=' + elements,
		method: 'GET',
		success: function (response, options) {
			console.log(response);
		},
		failure: function (response, options) {
		}
	});
}

function selectHandle(divid, hiddenid, imgid) {
	var hidden = document.getElementById(hiddenid);
	if (hidden.value == "0") {
		//选中当前div，释放其他div
		var elements = document.getElementsByName("subsystem");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.borderColor = "#C9C9C9";
		}
		var div = document.getElementById(divid);
		div.style.borderColor = "#33aaee";

		//显示本图片，隐藏其他图片
		elements = document.getElementsByName("selectimage");
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.visibility = "hidden";
		}
		document.getElementById(imgid).style.visibility = "visible";

		//设置隐藏值
		elements = document.getElementsByName("myinput");
		for (var i = 0; i < elements.length; i++) {
			elements[i].value = "0";
		}
		hidden.value = "1";
		//                alert("hidden value:" + hidden.value);

		//改变按钮颜色
		var img = div.getElementsByTagName("img")[5];
		if (img.src.indexOf("self") > 0)//自控
		{
			document.getElementById("btngetright").className = "controlbutton";
			document.getElementById("btnreleaseright").className = "controlbutton2";
		}
		else {
			document.getElementById("btngetright").className = "controlbutton2";
			document.getElementById("btnreleaseright").className = "controlbutton";
		}
		window.selectlist = divid;
	}
	else {
		//释放该div，隐藏图片，隐藏值归零
		document.getElementById(divid).style.borderColor = "#C9C9C9";
		document.getElementById(imgid).style.visibility = "hidden";
		hidden.value = "0";
		document.getElementById("btngetright").className = "controlbutton2";
		document.getElementById("btnreleaseright").className = "controlbutton2";
	}
}

function GetFKStatus(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[1]["FK"]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FK"] && tempJSON.ArrayModels[1]["FK"]["SubSystemMutulState"]) {
		if (tempJSON.ArrayModels[1]["FK"]["SubSystemMutulState"] == "1") {
			$("#fkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgreen.png');
		}
		else if (tempJSON.ArrayModels[1]["FK"]["SubSystemMutulState"] == "2") {
			$("#fkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalred.png');
		}
		else if (tempJSON.ArrayModels[1]["FK"]["SubSystemMutulState"] == "3") {
			$("#fkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgray.png');
			$("#fkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegray.png');
			$("#fkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_controllost.png');
			$("#fkMode").attr("src", '');
			$("#fkState").attr("src", '');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FK"] && tempJSON.ArrayModels[1]["FK"]["SubSystemTimeState"]) {
		if (tempJSON.ArrayModels[1]["FK"]["SubSystemTimeState"] == "1") {
			$("#fkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegreen.png');
		}
		else if (tempJSON.ArrayModels[1]["FK"]["SubSystemTimeState"] == "2") {
			$("#fkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timered.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FK"] && tempJSON.ArrayModels[1]["FK"]["SubSystemControl"]) {
		if (tempJSON.ArrayModels[1]["FK"]["SubSystemControl"] == "1") {
			$("#fkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_mastercontrol.png');
		}
		else if (tempJSON.ArrayModels[1]["FK"]["SubSystemControl"] == "2") {
			$("#fkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_selfcontrol.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FK"] && tempJSON.ArrayModels[1]["FK"]["SubSystemMode"]) {
		if (tempJSON.ArrayModels[1]["FK"]["SubSystemMode"] == "1") {
			$("#fkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_debug.png');
		}
		else if (tempJSON.ArrayModels[1]["FK"]["SubSystemMode"] == "2") {
			$("#fkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_observer.png');
		}
		else if (tempJSON.ArrayModels[1]["FK"]["SubSystemMode"] == "3") {
			$("#fkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FK"] && tempJSON.ArrayModels[1]["FK"]["SubSystemStatus"]) {
		if (tempJSON.ArrayModels[1]["FK"]["SubSystemStatus"] == "1") {
			$("#fkState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_normal.png');
		}
		else if (tempJSON.ArrayModels[1]["FK"]["SubSystemStatus"] == "2") {
			$("#fkState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}
}

function GetFCStatus(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[1]["FC"]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FC"] && tempJSON.ArrayModels[1]["FC"]["SubSystemMutulState"]) {
		if (tempJSON.ArrayModels[1]["FC"]["SubSystemMutulState"] == "1") {
			$("#fcComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgreen.png');
		}
		else if (tempJSON.ArrayModels[1]["FC"]["SubSystemMutulState"] == "2") {
			$("#fcComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalred.png');
		}
		else if (tempJSON.ArrayModels[1]["FC"]["SubSystemMutulState"] == "3") {
			$("#fcComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgray.png');
			$("#fcCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegray.png');
			$("#fcControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_controllost.png');
			$("#fcMode").attr("src", '');
			$("#fcState").attr("src", '');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FC"] && tempJSON.ArrayModels[1]["FC"]["SubSystemTimeState"]) {
		if (tempJSON.ArrayModels[1]["FC"]["SubSystemTimeState"] == "1") {
			$("#fcCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegreen.png');
		}
		else if (tempJSON.ArrayModels[1]["FC"]["SubSystemTimeState"] == "2") {
			$("#fcCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timered.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FC"] && tempJSON.ArrayModels[1]["FC"]["SubSystemControl"]) {
		if (tempJSON.ArrayModels[1]["FC"]["SubSystemControl"] == "1") {
			$("#fcControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_mastercontrol.png');
		}
		else if (tempJSON.ArrayModels[1]["FC"]["SubSystemControl"] == "2") {
			$("#fcControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_selfcontrol.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FC"] && tempJSON.ArrayModels[1]["FC"]["SubSystemMode"]) {
		if (tempJSON.ArrayModels[1]["FC"]["SubSystemMode"] == "1") {
			$("#fcMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_debug.png');
		}
		else if (tempJSON.ArrayModels[1]["FC"]["SubSystemMode"] == "2") {
			$("#fcMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_observer.png');
		}
		else if (tempJSON.ArrayModels[1]["FC"]["SubSystemMode"] == "3") {
			$("#fcMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FC"] && tempJSON.ArrayModels[1]["FC"]["SubSystemStatus"]) {
		if (tempJSON.ArrayModels[1]["FC"]["SubSystemStatus"] == "1") {
			$("#fcState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_normal.png');
		}
		else if (tempJSON.ArrayModels[1]["FC"]["SubSystemStatus"] == "2") {
			$("#fcState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}
}

function GetFJKStatus(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[1]["FJK"]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FJK"] && tempJSON.ArrayModels[1]["FJK"]["SubSystemMutulState"]) {
		if (tempJSON.ArrayModels[1]["FJK"]["SubSystemMutulState"] == "1") {
			$("#fjkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgreen.png');
		}
		else if (tempJSON.ArrayModels[1]["FJK"]["SubSystemMutulState"] == "2") {
			$("#fjkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalred.png');
		}
		else if (tempJSON.ArrayModels[1]["FJK"]["SubSystemMutulState"] == "3") {
			$("#fjkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgray.png');
			$("#fjkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegray.png');
			$("#fjkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_controllost.png');
			$("#fjkMode").attr("src", '');
			$("#fjkState").attr("src", '');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FJK"] && tempJSON.ArrayModels[1]["FJK"]["SubSystemTimeState"]) {
		if (tempJSON.ArrayModels[1]["FJK"]["SubSystemTimeState"] == "1") {
			$("#fjkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegreen.png');
		}
		else if (tempJSON.ArrayModels[1]["FJK"]["SubSystemTimeState"] == "2") {
			$("#fjkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timered.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FJK"] && tempJSON.ArrayModels[1]["FJK"]["SubSystemControl"]) {
		if (tempJSON.ArrayModels[1]["FJK"]["SubSystemControl"] == "1") {
			$("#fjkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_mastercontrol.png');
		}
		else if (tempJSON.ArrayModels[1]["FJK"]["SubSystemControl"] == "2") {
			$("#fjkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_selfcontrol.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FJK"] && tempJSON.ArrayModels[1]["FJK"]["SubSystemMode"]) {
		if (tempJSON.ArrayModels[1]["FJK"]["SubSystemMode"] == "1") {
			$("#fjkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_debug.png');
		}
		else if (tempJSON.ArrayModels[1]["FJK"]["SubSystemMode"] == "2") {
			$("#fjkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_observer.png');
		}
		else if (tempJSON.ArrayModels[1]["FJK"]["SubSystemMode"] == "3") {
			$("#fjkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["FJK"] && tempJSON.ArrayModels[1]["FJK"]["SubSystemStatus"]) {
		if (tempJSON.ArrayModels[1]["FJK"]["SubSystemStatus"] == "1") {
			$("#fjkState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_normal.png');
		}
		else if (tempJSON.ArrayModels[1]["FJK"]["SubSystemStatus"] == "2") {
			$("#fjkState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}
}

function GetKZKStatus(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[1]["KZK"]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KZK"] && tempJSON.ArrayModels[1]["KZK"]["SubSystemMutulState"]) {
		if (tempJSON.ArrayModels[1]["KZK"]["SubSystemMutulState"] == "1") {
			$("#kzkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgreen.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemMutulState"] == "2") {
			$("#kzkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalred.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemMutulState"] == "3") {
			$("#kzkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgray.png');
			$("#kzkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegray.png');
			$("#kzkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_controllost.png');
			$("#kzkMode").attr("src", '');
			$("#kzkState").attr("src", '');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KZK"] && tempJSON.ArrayModels[1]["KZK"]["SubSystemTimeState"]) {
		if (tempJSON.ArrayModels[1]["KZK"]["SubSystemTimeState"] == "1") {
			$("#kzkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegreen.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemTimeState"] == "2") {
			$("#kzkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timered.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KZK"] && tempJSON.ArrayModels[1]["KZK"]["SubSystemControl"]) {
		if (tempJSON.ArrayModels[1]["KZK"]["SubSystemControl"] == "1") {
			$("#kzkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_mastercontrol.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemControl"] == "2") {
			$("#kzkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_selfcontrol.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KZK"] && tempJSON.ArrayModels[1]["KZK"]["SubSystemMode"]) {
		if (tempJSON.ArrayModels[1]["KZK"]["SubSystemMode"] == "0") {
			$("#kzkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_abort.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemMode"] == "1") {
			$("#kzkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_debug.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemMode"] == "2") {
			$("#kzkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_ready.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemMode"] == "3") {
			$("#kzkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_observer.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemMode"] == "4") {
			$("#fjkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KZK"] && tempJSON.ArrayModels[1]["KZK"]["SubSystemStatus"]) {
		if (tempJSON.ArrayModels[1]["KZK"]["SubSystemStatus"] == "1") {
			$("#kzkState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_normal.png');
		}
		else if (tempJSON.ArrayModels[1]["KZK"]["SubSystemStatus"] == "2") {
			$("#kzkState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}
}

function GetKCStatus(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[1]["KC"]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KC"] && tempJSON.ArrayModels[1]["KC"]["SubSystemMutulState"]) {
		if (tempJSON.ArrayModels[1]["KC"]["SubSystemMutulState"] == "1") {
			$("#kcComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgreen.png');
		}
		else if (tempJSON.ArrayModels[1]["KC"]["SubSystemMutulState"] == "2") {
			$("#kcComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalred.png');
		}
		else if (tempJSON.ArrayModels[1]["KC"]["SubSystemMutulState"] == "3") {
			$("#kcComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgray.png');
			$("#kcCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegray.png');
			$("#kcControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_controllost.png');
			$("#kcMode").attr("src", '');
			$("#kcState").attr("src", '');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KC"] && tempJSON.ArrayModels[1]["KC"]["SubSystemTimeState"]) {
		if (tempJSON.ArrayModels[1]["KC"]["SubSystemTimeState"] == "1") {
			$("#kcCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegreen.png');
		}
		else if (tempJSON.ArrayModels[1]["KC"]["SubSystemTimeState"] == "2") {
			$("#kcCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timered.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KC"] && tempJSON.ArrayModels[1]["KC"]["SubSystemControl"]) {
		if (tempJSON.ArrayModels[1]["KC"]["SubSystemControl"] == "1") {
			$("#kcControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_mastercontrol.png');
		}
		else if (tempJSON.ArrayModels[1]["KC"]["SubSystemControl"] == "2") {
			$("#kcControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_selfcontrol.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KC"] && tempJSON.ArrayModels[1]["KC"]["SubSystemMode"]) {
		if (tempJSON.ArrayModels[1]["KC"]["SubSystemMode"] == "1") {
			$("#kcMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_debug.png');
		}
		else if (tempJSON.ArrayModels[1]["KC"]["SubSystemMode"] == "2") {
			$("#kcMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_observer.png');
		}
		else if (tempJSON.ArrayModels[1]["KC"]["SubSystemMode"] == "3") {
			$("#kcMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KC"] && tempJSON.ArrayModels[1]["KC"]["SubSystemStatus"]) {
		if (tempJSON.ArrayModels[1]["KC"]["SubSystemStatus"] == "1") {
			$("#kcState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_normal.png');
		}
		else if (tempJSON.ArrayModels[1]["KC"]["SubSystemStatus"] == "2") {
			$("#kcState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}
}

function GetKJKStatus(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[1]["KJK"]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KJK"] && tempJSON.ArrayModels[1]["KJK"]["SubSystemMutulState"]) {
		if (tempJSON.ArrayModels[1]["KJK"]["SubSystemMutulState"] == "1") {
			$("#kjkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgreen.png');
		}
		else if (tempJSON.ArrayModels[1]["KJK"]["SubSystemMutulState"] == "2") {
			$("#kjkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalred.png');
		}
		else if (tempJSON.ArrayModels[1]["KJK"]["SubSystemMutulState"] == "3") {
			$("#kjkComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgray.png');
			$("#kjkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegray.png');
			$("#kjkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_controllost.png');
			$("#kjkMode").attr("src", '');
			$("#kjkState").attr("src", '');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KJK"] && tempJSON.ArrayModels[1]["KJK"]["SubSystemTimeState"]) {
		if (tempJSON.ArrayModels[1]["KJK"]["SubSystemTimeState"] == "1") {
			$("#kjkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegreen.png');
		}
		else if (tempJSON.ArrayModels[1]["KJK"]["SubSystemTimeState"] == "2") {
			$("#kjkCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timered.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KJK"] && tempJSON.ArrayModels[1]["KJK"]["SubSystemControl"]) {
		if (tempJSON.ArrayModels[1]["KJK"]["SubSystemControl"] == "1") {
			$("#kjkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_mastercontrol.png');
		}
		else if (tempJSON.ArrayModels[1]["KJK"]["SubSystemControl"] == "2") {
			$("#kjkControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_selfcontrol.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KJK"] && tempJSON.ArrayModels[1]["KJK"]["SubSystemMode"]) {
		if (tempJSON.ArrayModels[1]["KJK"]["SubSystemMode"] == "1") {
			$("#kjkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_debug.png');
		}
		else if (tempJSON.ArrayModels[1]["KJK"]["SubSystemMode"] == "2") {
			$("#kjkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_observer.png');
		}
		else if (tempJSON.ArrayModels[1]["KJK"]["SubSystemMode"] == "3") {
			$("#kjkMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["KJK"] && tempJSON.ArrayModels[1]["KJK"]["SubSystemStatus"]) {
		if (tempJSON.ArrayModels[1]["KJK"]["SubSystemStatus"] == "1") {
			$("#kjkState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_normal.png');
		}
		else if (tempJSON.ArrayModels[1]["KJK"]["SubSystemStatus"] == "2") {
			$("#kjkState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}
}

function GetJSJStatus(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[1]["JSJ"]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["JSJ"] && tempJSON.ArrayModels[1]["JSJ"]["SubSystemMutulState"]) {
		if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemMutulState"] == "1") {
			$("#jsjComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgreen.png');
		}
		else if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemMutulState"] == "2") {
			$("#jsjComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalred.png');
		}
		else if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemMutulState"] == "3") {
			$("#jsjComm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_signalgray.png');
			$("#jsjCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegray.png');
			$("#jsjControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_controllost.png');
			$("#jsjMode").attr("src", '');
			$("#jsjState").attr("src", '');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["JSJ"] && tempJSON.ArrayModels[1]["JSJ"]["SubSystemTimeState"]) {
		if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemTimeState"] == "1") {
			$("#jsjCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timegreen.png');
		}
		else if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemTimeState"] == "2") {
			$("#jsjCheck").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_timered.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["JSJ"] && tempJSON.ArrayModels[1]["JSJ"]["SubSystemControl"]) {
		if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemControl"] == "1") {
			$("#jsjControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_mastercontrol.png');
		}
		else if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemControl"] == "2") {
			$("#jsjControl").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/img_selfcontrol.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["JSJ"] && tempJSON.ArrayModels[1]["JSJ"]["SubSystemMode"]) {
		if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemMode"] == "1") {
			$("#jsjMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_debug.png');
		}
		else if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemMode"] == "2") {
			$("#jsjMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_observer.png');
		}
		else if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemMode"] == "3") {
			$("#jsjMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1] && tempJSON.ArrayModels[1]["JSJ"] && tempJSON.ArrayModels[1]["JSJ"]["SubSystemStatus"]) {
		if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemStatus"] == "1") {
			$("#jsjState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_normal.png');
		}
		else if (tempJSON.ArrayModels[1]["JSJ"]["SubSystemStatus"] == "2") {
			$("#jsjState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}
}

function GetSystemStatus(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[0]);
	//console.log(tempJSON.ArrayModels[1]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[0]) {
		window.serverTime = new Date(tempJSON.ArrayModels[0].CurrentDateTime.substr(0, 19).replace('T', ' ').replace('-', '/'));

		$("#spansysnumbinctrl").text(tempJSON.ArrayModels[0]["CurrentZKNum"]);
		if (tempJSON.ArrayModels[0]["CurrentStatus"] == "1") {
			$("#idAlarm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/ico_linshen.png');
			$("#idAlarmTip").css("display", 'none');
			$("#idAlarmNum").css("display", 'none').html('');
			$("#idState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_normal.png');
		}
		else if (tempJSON.ArrayModels[0]["CurrentStatus"] == "2") {
			$("#idAlarm").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/ico_linshen03.gif');
			$("#idAlarmTip").css("display", 'block');
			$("#idAlarmNum").css("display", 'block').html(tempJSON.ArrayModels[0]["CurrentError"]);
			$("#idState").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}

		if ($("#idMode").length < 1) return;

		if (tempJSON.ArrayModels[0]["CurrentMode"] == "1") {
			$("#idMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_standby.png');
		}
		else if (tempJSON.ArrayModels[0]["CurrentMode"] == "2") {
			$("#idMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_alldebug.png');
		}
		else if (tempJSON.ArrayModels[0]["CurrentMode"] == "3") {
			$("#idMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_ready.png');
		}
		else if (tempJSON.ArrayModels[0]["CurrentMode"] == "4") {
			$("#idMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_observer.png');
		}
		else if (tempJSON.ArrayModels[0]["CurrentMode"] == "5") {
			$("#idMode").attr("src", '/Web_GlobalResources/Web_Themes/Images/FAST-V1.0/lbl_error.png');
		}
	}

	GetFKStatus(responseText);
	GetFCStatus(responseText);
	GetFJKStatus(responseText);
	GetKZKStatus(responseText);
	GetKCStatus(responseText);
	GetKJKStatus(responseText);
	GetJSJStatus(responseText);
}

function DisplayStatus() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/GetDataMain/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'GET',
		success: function (response, options) {
			GetSystemStatus(response.responseText);
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

///即刻获取系统状态
DisplayStatus();

///显示服务器时间
function clock() {
	window.serverTime = new Date(window.serverTime.getTime() + 1010);
	var currentTime = window.serverTime.pattern("HH:mm:ss");
	$('.divtime span').html(currentTime);
}

var autoRefrashTime = self.setInterval("clock()", 1000)
//var autoRefrashStatus = self.setInterval("DisplayStatus()", 6000)
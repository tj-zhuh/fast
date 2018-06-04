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
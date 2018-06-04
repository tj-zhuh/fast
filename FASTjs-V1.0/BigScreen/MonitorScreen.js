$(function () {
	DisplayData();
	DisplayData2();

	setInterval(DisplayData, 1 * 1000);
	setInterval(DisplayData2, 5 * 1000);
})

function DisplayData2() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/GetDataMirrorForBigScreen/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'get',
		success: function (response, options) {
			showData2(JSON.parse(response.responseText));
		},
		failure: function (a, b, c) {
			showData2({});
			console.log('GetDataMirrorForBigScreen failed');
			console.log(c);
		}
	});
}

var devDefault = '- -&nbsp;&nbsp;- -'
var boxDataDefault = '&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;:&nbsp;&nbsp;--&nbsp;&nbsp;:&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;';
var dateDefault = '0000-00-00';
var mjdDefault = '00000.00000000';
var timeDefault = '00.00.00.000';

function set(elementId, data, _default) {
	var el = $('#' + elementId);
	if (!el)
		return;

	if (typeof data != 'string') {
		if (_default) {
			el.html(_default);
		} else {
			el.html('');
		}
		return;
	}

	var old = el.html();
	if (old == data)
		return;

	el.html(data);
}

function setn(elementId, data, _default) {
	if (typeof data != 'number')
		return;

	set(elementId, '' + data, _default);
}

function setb(elementId, data) {
	set(elementId, data, boxDataDefault);
}

function showData2(datas) {
	set('devFeedAB', datas.DevFeedAB, devDefault);
	set('devFeedCentral', datas.DevFeedCentral, devDefault);
	set('devReflector', datas.DevReflector, devDefault);

	var state = datas.CurrentTaskState;
	var state_html = getStateHtml(state);
	set('taskState', state_html);
	setn('taskTimeTotal', datas.TaskTimeTotal, '0');
	setn('taskSequenceTotal', datas.TaskSequenceTotal, '0');

	if (datas.TaskTimeTotal > 0 && datas.TaskTimeComplete > 0) {
		var width = $("#taskTime2").width() * datas.TaskTimeComplete / datas.TaskTimeTotal;

		var el = $('#taskTime1');
		if (el.css('display') == 'none') {
			el.show();
		}

		if (el.width() != width) {
			el.width(width);
		}

		setn('taskTimeComplete', datas.TaskTimeComplete)
	} else {
		$('#taskTime1').hide();
	}

	if (datas.TaskSequenceTotal > 0 && datas.TaskSequenceComplete > 0) {
		var width = $("#taskSequence2").width() * datas.TaskSequenceComplete / datas.TaskSequenceTotal;

		var el = $('#taskSequence1');
		if (el.css('display') == 'none') {
			el.show();
		}

		if (el.width() != width) {
			el.width(width);
		}

		setn('taskSequenceComplete', datas.TaskSequenceComplete)
	} else {
		$('#taskSequence1').hide();
	}
}

function getStateHtml(value) {
	switch (value) {
		case '开始':
			return "<span class='start'>" + value + "</span>";
		case '准备':
			return "<span class='prepare'>" + value + "</span>";
		case '观测':
			return "<span class='observe'>" + value + "</span>";
		case '终止':
			return "<span class='stop'>" + value + "</span>";
		case '结束':
			return "<span class='finish'>" + value + "</span>";
		default:
			return "<span class='notstart'>" + value + "</span>";
	}
}

function GetEnviorn(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	console.log(tempJSON.ArrayModels[1]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[1]) {
		$("#labelTemp").text(tempJSON.ArrayModels[1]["EnvironTemp"]);
		$("#labelWind").text(tempJSON.ArrayModels[1]["EnvironWindSpeed"]);
	}
}

function GetTarget(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	console.log(tempJSON.ArrayModels[2]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["RaApparentTarget"]) {
		$("#appTRA").text(tempJSON.ArrayModels[2]["RaApparentTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["DeApparentTarget"]) {
		$("#appTDEC").text(tempJSON.ArrayModels[2]["DeApparentTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["AsTarget"]) {
		$("#dirTAS").text(tempJSON.ArrayModels[2]["AsTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["HTarget"]) {
		$("#dirTH").text(tempJSON.ArrayModels[2]["HTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["RaTarget"]) {
		$("#dirTRA").text(tempJSON.ArrayModels[2]["RaTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["DeTarget"]) {
		$("#dirTDEC").text(tempJSON.ArrayModels[2]["DeTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["LTarget"]) {
		$("#dirTL").text(tempJSON.ArrayModels[2]["LTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["BTarget"]) {
		$("#dirTB").text(tempJSON.ArrayModels[2]["BTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["ScanRaTarget"]) {
		$("#scanTRA").text(tempJSON.ArrayModels[2]["ScanRaTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["ScanDeTarget"]) {
		$("#scanTDEC").text(tempJSON.ArrayModels[2]["ScanDeTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["ScanLTarget"]) {
		$("#scanTL").text(tempJSON.ArrayModels[2]["ScanLTarget"]);
	}
	if (tempJSON.ArrayModels && tempJSON.ArrayModels[2] && tempJSON.ArrayModels[2]["ScanBTarget"]) {
		$("#scanTB").text(tempJSON.ArrayModels[2]["ScanBTarget"]);
	}
}

function GetReal(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	console.log(tempJSON.ArrayModels[3]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["RaApparentReal"]) {
		$("#appRRA").text(tempJSON.ArrayModels[3]["RaApparentReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["DeApparentReal"]) {
		$("#appRDEC").text(tempJSON.ArrayModels[3]["DeApparentReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["AsReal"]) {
		$("#dirRAS").text(tempJSON.ArrayModels[3]["AsReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["HReal"]) {
		$("#dirRH").text(tempJSON.ArrayModels[3]["HReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["RaReal"]) {
		$("#dirRRA").text(tempJSON.ArrayModels[3]["RaReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["DeReal"]) {
		$("#dirRDEC").text(tempJSON.ArrayModels[3]["DeReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["LReal"]) {
		$("#dirRL").text(tempJSON.ArrayModels[3]["LReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["BReal"]) {
		$("#dirRB").text(tempJSON.ArrayModels[3]["BReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["ScanRaReal"]) {
		$("#scanRRA").text(tempJSON.ArrayModels[3]["ScanRaReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["ScanDeReal"]) {
		$("#scanRDEC").text(tempJSON.ArrayModels[3]["ScanDeReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["ScanLReal"]) {
		$("#scanRL").text(tempJSON.ArrayModels[3]["ScanLReal"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[3] && tempJSON.ArrayModels[3]["ScanBReal"]) {
		$("#scanRB").text(tempJSON.ArrayModels[3]["ScanBReal"]);
	}
}

function GetDiff(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	console.log(tempJSON.ArrayModels[4]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["RaApparentDiff"]) {
		$("#appDRA").text(tempJSON.ArrayModels[4]["RaApparentDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["DeApparentDiff"]) {
		$("#appDDEC").text(tempJSON.ArrayModels[4]["DeApparentDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["AsDiff"]) {
		$("#dirDAS").text(tempJSON.ArrayModels[4]["AsDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["HDiff"]) {
		$("#dirDH").text(tempJSON.ArrayModels[4]["HDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["RaDiff"]) {
		$("#dirDRA").text(tempJSON.ArrayModels[4]["RaDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["DeDiff"]) {
		$("#dirDDEC").text(tempJSON.ArrayModels[4]["DeDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["LDiff"]) {
		$("#dirDL").text(tempJSON.ArrayModels[4]["LDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["BDiff"]) {
		$("#dirDB").text(tempJSON.ArrayModels[4]["BDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["RaScanDiff"]) {
		$("#scanDRA").text(tempJSON.ArrayModels[4]["RaScanDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["DeScanDiff"]) {
		$("#scanDDEC").text(tempJSON.ArrayModels[4]["DeScanDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["LScanDiff"]) {
		$("#scanDL").text(tempJSON.ArrayModels[4]["LScanDiff"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[4] && tempJSON.ArrayModels[4]["BScanDiff"]) {
		$("#scanDB").text(tempJSON.ArrayModels[4]["BScanDiff"]);
	}
}

function GetDev(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	console.log(tempJSON.ArrayModels[5]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[5] && tempJSON.ArrayModels[5]["AxisDev"]) {
		$("#devAxis").text(tempJSON.ArrayModels[5]["strMultiDev"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[5] && tempJSON.ArrayModels[5]["RadialDev"]) {
		$("#devRadial").text(tempJSON.ArrayModels[5]["strRadialDev"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[5] && tempJSON.ArrayModels[5]["MultiBeamSpinDev"]) {
		$("#devMulti").text(tempJSON.ArrayModels[5]["strMultiDev"]);
	}
}

function GetCurTime(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	console.log(tempJSON.ArrayModels[6]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["nowDay"]) {
		$("#curDate").text(tempJSON.ArrayModels[6]["nowDay"].replace(/\s/g, "/"));
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["nowTime"]) {
		$("#curTime").text(tempJSON.ArrayModels[6]["nowDay"].replace(/\s/g, "/") + " " + tempJSON.ArrayModels[6]["nowTime"].replace(/\s/g, ":"));
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["strUTC"]) {
		$("#curUT").text(tempJSON.ArrayModels[6]["strUTC"].substr(0, 9).replace(/\s/g, "/") + " " + tempJSON.ArrayModels[6]["strUTC"].substr(11).replace(/\s/g, ":"));
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["strS"]) {
		$("#curStartime").text(tempJSON.ArrayModels[6]["strS"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["strMJD"]) {
		$("#curMJD").text(tempJSON.ArrayModels[6]["strMJD"]);
	}
}

function GetAtomic(responseText) {
	var tempJSON = eval("(" + responseText + ")");
	console.log(tempJSON.ArrayModels[7]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[7] && tempJSON.ArrayModels[7]["nowAtomicTime"]) {
		$("#curAtmoictime").text(tempJSON.ArrayModels[7]["nowAtomicTime"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[7] && tempJSON.ArrayModels[7]["diffAtomicTime"]) {
		$("#devAtmoictime").text(tempJSON.ArrayModels[7]["diffAtomicTime"]);
	}
}

function GetObsData(responseText) {
	//console.log(responseText);

	var tempJSON = eval("(" + responseText + ")");
	//console.log(tempJSON.ArrayModels[0]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[0]) {
		$(".sname").text(tempJSON.ArrayModels[0]["srcName"]);
		$(".starttmvalue").text(tempJSON.ArrayModels[0]["timeStart"].replace("T", " "));
		$(".lasttmvalue").text(tempJSON.ArrayModels[0]["timeUsed"]);
		$(".endtmvalue").text(tempJSON.ArrayModels[0]["timeRemain"]);

		if (tempJSON.ArrayModels[0]["ExecuteStatus"] == '1')
			$(".taskstate").text('等待');
		else if (tempJSON.ArrayModels[0]["ExecuteStatus"] == '2')
			$(".taskstate").text('准备');
		else if (tempJSON.ArrayModels[0]["ExecuteStatus"] == '3')
			$(".taskstate").text('观测');
		else if (tempJSON.ArrayModels[0]["ExecuteStatus"] == '4')
			$(".taskstate").text('结束');
		else if (tempJSON.ArrayModels[0]["ExecuteStatus"] == "5")
			$(".taskstate").text('终止');
	}

	GetEnviorn(responseText);
	GetTarget(responseText);
	GetReal(responseText);
	GetDiff(responseText);
	GetDev(responseText);
	GetCurTime(responseText);
	//GetAtomic(responseText);
}

function clearData1() {
	//$(".box-text").html('&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;:&nbsp;&nbsp;--&nbsp;&nbsp;:&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;');
	//$(".dev-text1").html('00.00');
	//$("#curDate").html('0000-00-00');
	//$('#curMJD').html('00000.00000000');
	//$('.time-text').html('00.00.00.000');
}

function DisplayData() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/GetDataMirror/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'GET',
		success: function (response, options) {
			GetObsData(response.responseText);
		},
		failure: function (a, b, c) {
			clearData1();
			console.log('GetDataMirror failed');
			console.log(c);
		}
	});
}
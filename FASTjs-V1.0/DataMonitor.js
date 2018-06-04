function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['INSTITUTION_NAME', 'USER_ID', 'INSTITUTION_ID', 'USER_CODE', 'USER_NAME', 'USER_PASSWORD', 'EMAIL_ADDRESS', 'USER_PHONE', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN', 'LOGGING_TIME'],
		autoLoad: true,
		//pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Master/MASTER_USER/GetView/UserId0000/SessionId0000/',
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
}

function GridPanelToggle11() {
	var oldHeight = $('#divtasktop11').height();
	if (oldHeight == 50) {
		oldHeight = $('#divtasktop11 a.itemCollapseButton').attr('oldHeight');
		$('#divtasktop1 .divdatatoptablezonefskz').css('display', 'block');
		$('#divtasktop11').height(oldHeight);
		$('#divtasktop11 a.itemCollapseButton').removeClass('itemAddButton').addClass('itemDelButton');
	} else {
		$('#divtasktop11 a.itemCollapseButton').attr('oldHeight', oldHeight);
		$('#divtasktop1 .divdatatoptablezonefskz').css('display', 'none');
		$('#divtasktop11').height(50);
		$('#divtasktop11 a.itemCollapseButton').removeClass('itemDelButton').addClass('itemAddButton');
	}
}

function GridPanelToggle12() {
	var oldHeight = $('#divtasktop12').height();
	if (oldHeight == 50) {
		oldHeight = $('#divtasktop12 a.itemCollapseButton').attr('oldHeight');
		$('#divtasktop12 .divdatatoptablezonefskz').css('display', 'block');
		$('#divtasktop12').height(oldHeight);
		$('#divtasktop12 a.itemCollapseButton').removeClass('itemAddButton').addClass('itemDelButton');
	} else {
		$('#divtasktop12 a.itemCollapseButton').attr('oldHeight', oldHeight);
		$('#divtasktop12 .divdatatoptablezonefskz').css('display', 'none');
		$('#divtasktop12').height(50);
		$('#divtasktop12 a.itemCollapseButton').removeClass('itemDelButton').addClass('itemAddButton');
	}
}

function GridPanelToggle13() {
	var oldHeight = $('#divtasktop13').height();
	if (oldHeight == 50) {
		oldHeight = $('#divtasktop13 a.itemCollapseButton').attr('oldHeight');
		$('#divtasktop13 .divdatatoptablezonefskz').css('display', 'block');
		$('#divtasktop13').height(oldHeight).css('margin-bottom', '5px');
		$('#divtasktop13 a.itemCollapseButton').removeClass('itemAddButton').addClass('itemDelButton');
	} else {
		$('#divtasktop13 a.itemCollapseButton').attr('oldHeight', oldHeight);
		$('#divtasktop13 .divdatatoptablezonefskz').css('display', 'none');
		$('#divtasktop13').height(50).css('margin-bottom', '145px');
		$('#divtasktop13 a.itemCollapseButton').removeClass('itemDelButton').addClass('itemAddButton');
	}
}

function GridPanelToggle21() {
	var oldHeight = $('#divtasktop21').height();
	if (oldHeight == 50) {
		oldHeight = $('#divtasktop21 a.itemCollapseButton').attr('oldHeight');
		$('#divtasktop21 .divdatatoptablezonefskz').css('display', 'block');
		$('#divtasktop21').height(oldHeight);
		$('#divtasktop21 a.itemCollapseButton').removeClass('itemAddButton').addClass('itemDelButton');
	} else {
		$('#divtasktop21 a.itemCollapseButton').attr('oldHeight', oldHeight);
		$('#divtasktop21 .divdatatoptablezonefskz').css('display', 'none');
		$('#divtasktop21').height(50);
		$('#divtasktop21 a.itemCollapseButton').removeClass('itemDelButton').addClass('itemAddButton');
	}
}

function GridPanelToggle22() {
	var oldHeight = $('#divtasktop22').height();
	if (oldHeight == 50) {
		oldHeight = $('#divtasktop22 a.itemCollapseButton').attr('oldHeight');
		$('#divtasktop22 .divdatatoptablezonefskz').css('display', 'block');
		$('#divtasktop22').height(oldHeight);
		$('#divtasktop22 a.itemCollapseButton').removeClass('itemAddButton').addClass('itemDelButton');
	} else {
		$('#divtasktop22 a.itemCollapseButton').attr('oldHeight', oldHeight);
		$('#divtasktop22 .divdatatoptablezonefskz').css('display', 'none');
		$('#divtasktop22').height(50);
		$('#divtasktop22 a.itemCollapseButton').removeClass('itemDelButton').addClass('itemAddButton');
	}
}

function GridPanelToggle23() {
	var oldHeight = $('#divtasktop23').height();
	if (oldHeight == 50) {
		oldHeight = $('#divtasktop23 a.itemCollapseButton').attr('oldHeight');
		$('#divtasktop23 .divdatatoptablezonefskz').css('display', 'block');
		$('#divtasktop23').height(oldHeight);
		$('#divtasktop23 a.itemCollapseButton').removeClass('itemAddButton').addClass('itemDelButton');
	} else {
		$('#divtasktop23 a.itemCollapseButton').attr('oldHeight', oldHeight);
		$('#divtasktop23 .divdatatoptablezonefskz').css('display', 'none');
		$('#divtasktop23').height(50);
		$('#divtasktop23 a.itemCollapseButton').removeClass('itemDelButton').addClass('itemAddButton');
	}
}

function HeaderQueryData11() {
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	gridStore.proxy.extraParams = {
		parameters: '{}'
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
		$("#curDate").text(tempJSON.ArrayModels[6]["nowDay"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["nowTime"]) {
		$("#curTime").text(tempJSON.ArrayModels[6]["nowTime"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["nowUTC"]) {
		$("#curUT").text(tempJSON.ArrayModels[6]["nowUTC"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["nowS"]) {
		$("#curStartime").text(tempJSON.ArrayModels[6]["nowS"]);
	}

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[6] && tempJSON.ArrayModels[6]["nowMJD"]) {
		$("#curMJD").text(tempJSON.ArrayModels[6]["nowMJD"]);
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
	console.log(responseText);
	var tempJSON = eval("(" + responseText + ")");
	console.log(tempJSON.ArrayModels[0]);

	if (tempJSON.ArrayModels && tempJSON.ArrayModels[0]) {
		$(".sname").text(tempJSON.ArrayModels[0]["srcName"]);
		$(".starttmvalue").text(tempJSON.ArrayModels[0]["timeStart"]);
		$(".lasttmvalue").text(tempJSON.ArrayModels[0]["strUsed"]);
		$(".endtmvalue").text(tempJSON.ArrayModels[0]["strRemain"]);

		if (tempJSON.ArrayModels[0]["taskState"] == '1')
			$(".taskstate").text('等待');
		else if (tempJSON.ArrayModels[0]["taskState"] == '2')
			$(".taskstate").text('准备');
		else if (tempJSON.ArrayModels[0]["taskState"] == '3')
			$(".taskstate").text('观测');
		else if (tempJSON.ArrayModels[0]["taskState"] == '4')
			$(".taskstate").text('结束');
		else if (tempJSON.ArrayModels[0]["taskState"] == "5")
			$(".taskstate").text('终止');
	}

	GetEnviorn(responseText);
	GetTarget(responseText);
	GetReal(responseText);
	GetDiff(responseText);
	GetDev(responseText);
	GetCurTime(responseText);
	GetAtomic(responseText);
}

function DisplayData() {
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/GetDataMirror/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'GET',
		success: function (response, options) {
			GetObsData(response.responseText);
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

DisplayData();
var autoRefrashState = self.setInterval("DisplayData()", 6000)
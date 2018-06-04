var uploadWindow = createUploadWindow();


$(function () {

	query();
	query2();

	var _deleteElement = document.getElementById('uploadWindow');
	if (_deleteElement) {
		_deleteElement.parentNode.removeChild(_deleteElement);
	}

	$('.button-submit').click(function () {
		//debugger;
		var data = {
			CONSTANT_ID: $('#CONSTANT_ID').val(),
			//CONSTANT_TEMPERATURE: $('#CONSTANT_TEMPERATURE').val(),
			//CONSTANT_PRESSURE: $('#CONSTANT_PRESSURE').val(),
			//CONSTANT_HUMIDITY: $('#CONSTANT_HUMIDITY').val(),
			OBSERVATION_WAVE: $('#OBSERVATION_WAVE').val(),
			CONSTANT_LONGITUDE: $('#CONSTANT_LONGITUDE0').val() + ' ' + $('#CONSTANT_LONGITUDE1').val() + ' ' + $('#CONSTANT_LONGITUDE2').val(),
			CONSTANT_LATITUDE: $('#CONSTANT_LATITUDE0').val() + ' ' + $('#CONSTANT_LATITUDE1').val() + ' ' + $('#CONSTANT_LATITUDE2').val(),
			TELESCOPE_HIGH: $('#TELESCOPE_HIGH').val(),
			LONGITUDE_SPEED: $('#LONGITUDE_SPEED').val(),
			LATITUDE_SPEED: $('#LATITUDE_SPEED').val()
		}
		$.ajax({
			url: '../../Concrete/SYSTEM_CONFIG/InsertModel/19|参数编辑/修改系统静态参数/',
			method: 'POST',
			data: data,
			success: function (fp, o) {
				FAST.OnInfoEvent('操作处理成功!<br/><br/>');
				query();
				query2();
			},
			error: function (fp, o) {
				if (o && o.response && o.response.responseText == "Success") {
					FAST.OnInfoEvent('操作处理成功!<br/><br/>');
					query();
					query2();
				}
				else {
					FAST.OnInfoEvent('处理失败!<br/><br/>');
				}
			}
		})
	})
})

function query(){
	$.ajax({
		url: '../../Concrete/SYSTEM_CONFIG/GetView/UserId0000/SessionId0000/?parameters={}',
		method: 'GET',
		success: function (data, options) {
			var result = data.ArrayModels;
			for (var i in result[0]) {
				if (i.toUpperCase() == 'CONSTANT_LONGITUDE' || i.toUpperCase() == 'CONSTANT_LATITUDE') {
					var array = result[0][i].split(' ');
					for (var j = 0; j < array.length; j++) {
						$('#' + i + j).val(array[j]);
					}
				}
				else {
					$('#' + i).val(result[0][i]);
				}
			}
		},
		error: function (fp, o) {
			FAST.OnInfoEvent('查询数据出错!<br/><br/>');
		}
	})
}

function query2() {
	$.ajax({
		url: '../../Concrete/SYSTEM_WEATHER/GetView/UserId0000/SessionId0000/?parameters={}',
		method: 'GET',
		success: function (data, options) {
			var result = data.ArrayModels;
			for (var i in result[0]) {
				$('#' + i).val(result[0][i]);
			}
		},
		error: function (fp, o) {
			FAST.OnInfoEvent('查询数据出错!<br/><br/>');
		}
	})
}

function upload_button_clicked() {
	uploadWindow.show();
}


function createUploadWindow() {
	return Ext.create('Ext.window.Window', {
		id: 'uploadWindow',
		title: '上传文件',
		width: 600,
		height: 170,
		modal: true,
		layout: 'fit',
		border: false,
		closable: true,
		resizable: false,
		draggable: false,
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
				labelWidth: 130,
				labelAlign: 'left',
				labelStyle: 'font-weight:bold'
			},
			items: [
			{
				xtype: "filefield",
				emptyText: '选择文件存放路径',

				allowBlank: false,
				name: 'txtFile',
				anchor: "90%",
				buttonText: '选择文件'
			}]
		},
		buttons: [{
			text: '确 定',
			scope: this,
			handler: function (scope) {
				var form = uploadWindow.down('form').getForm();
				if (form.isValid()) {
					form.submit({
						url: '../../Concrete/SYSTEM_CONFIG/ImportFile/19|文件上传/文件上传/', // TODO 上传文件
						waitMsg: '处理中，请稍候...',
						method: 'post',
						success: function (fp, o) {
							FAST.OnInfoEvent('操作处理成功!<br/><br/>');
							query();
						},
						failure: function (fp, o) {
							if (o && o.response && o.response.responseText == "Success") {
								FAST.OnInfoEvent('操作处理成功!<br/><br/>');
								query();
							}
							else {
								FAST.OnInfoEvent('处理失败!<br/><br/>');
							}
						}
					});
				}
			}
		}, {
			text: '取 消',
			scope: this,
			handler: function (scope) {
				uploadWindow.hide();
			}
		}]
	});
}
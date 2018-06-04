function LoadGridData() {
	Ext.create('Ext.data.Store', {
		storeId: 'simpsonsStore',
		fields: ['SEQUENCE_NAME', 'DICTATE_MODE', 'DICTATE_RECV', 'SEQUENCE_BEGIN', 'SEQUENCE_TIMELINE', 'SEQUENCE_END', 'SEQUENCE_STATE'],
		autoLoad: true,
		//pageSize: 100,

		proxy: {
			type: 'ajax',
			url: '../../Concrete/TASK_SEQUENCE/GetView/UserId0000/SessionId0000/',
			reader: {
				type: 'json',
				root: 'ArrayModels',
				idProperty: 'SEQUENCE_ID',
				successProperty: 'success'
			},
			extraParams: {
				parameters: '{}'
			}
		}
	});
}

function GridPanelToggle() {
	var oldHeight = $('#SystemConfig').height();
	if (oldHeight == 50) {
		oldHeight = $('a.centerCollapseButton').attr('oldHeight');
		$('#centerContent').css('display', 'block');
		$('#SystemConfig').height(oldHeight);
		$('a.centerCollapseButton').removeClass('collapseAddButton').addClass('collapseDelButton');
	} else {
		$('a.centerCollapseButton').attr('oldHeight', oldHeight);
		$('#centerContent').css('display', 'none');
		$('#SystemConfig').height(50);
		$('a.centerCollapseButton').removeClass('collapseDelButton').addClass('collapseAddButton');
	}
}

function HeaderQueryData() {
	//$('#btmToggleCheckbox').prop('checked', false);

	//var queryText = Ext.get('txtINSTITUTION_NAME').dom.value;
	var gridStore = Ext.data.StoreManager.lookup('simpsonsStore');

	//gridStore.proxy.extraParams = {
	//	parameters: '{"INSTITUTION_NAME":"' + queryText + '"}'
	//};

	gridStore.load({
		scope: this,
		callback: function (records, operation, success) {
			//console.log('The DataStore callback was running!');

			if (!success)
				Nuts.Caches.onRequestError(operation);
		}
	});
}

///窗体大小调整
function ReSetWindowViewSize(isPostBacked) {
	var defWidth = $(window).width();
	var defHeight = $(window).height();

	if (defHeight < 900) {
		defHeight = 900;
	}
	console.log('Current Operater View Size : ' + defWidth + ' x ' + defHeight);
	$('#SystemConfig').height(defHeight - 210);
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

	$('#btmToggleCheckbox').on('click', function () {
		if ($(this).prop('checked')) {
			$('input.taskCheckbox').each(function (i) {
				$(this).css('visibility', 'visible');
			});
		} else {
			$('input.taskCheckbox').each(function (i) {
				$(this).css('visibility', 'hidden');
			});
		}
	});
});
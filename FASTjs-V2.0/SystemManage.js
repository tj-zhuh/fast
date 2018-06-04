var currnetId = '';
var checkedList = [];

function LoadGridData() {
	var roleStore = Ext.create('Ext.data.Store', {
		storeId: 'simpRoleStore',
		fields: ['ROLE_ID', 'INSTITUTION_ID', 'ROLE_NAME', 'ROLE_CODE', 'PARENT_ROLE', 'DICTIONARY_ID', 'ROLE_LEVEL', 'ROLE_TYPE', 'BUSINESS_SORT', 'DESCRIPTION_INFO', 'LASTMODIFY_TIME', 'ENABLE_SIGN', 'ENABLE_STATUS'],
		autoLoad: true,
		pageSize: 100,

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

	var simpleCombo = Ext.create('Ext.form.field.ComboBox', {
		renderTo: 'roleList',
		displayField: 'ROLE_NAME',
		width: 150,
		labelWidth: 0,
		emptyText: '请选择角色',
		store: roleStore,
		valueField: 'ROLE_ID',
		displayField: 'ROLE_NAME',
		queryMode: 'local',
		listeners: {
			change: function (scope, newValue, oldValue, eOpts) {
				currnetId = newValue;
				var roleStore = Ext.data.StoreManager.lookup('simpRoleStore');
				var gridStore = Ext.data.StoreManager.lookup('simpAuthorStore');

				var roleImages = {};
				for (var i = 0; i < roleStore.data.length; i++) {
					roleImages[roleStore.getAt(i).data.ROLE_ID] = roleStore.getAt(i).data.ROLE_CODE;
				}

				var classList = $('#roleList').attr('class');
				if (classList.indexOf('admin') > 0) {
					classList = classList.replace('admin', roleImages[newValue]);
				} else {
					classList = classList.replace(roleImages[oldValue], roleImages[newValue]);
				}

				$('#roleList').attr('class', classList);

				gridStore.proxy.extraParams = {
					parameters: '{"ROLE_ID":"' + newValue + '"}'
				};

				gridStore.load({
					scope: this,
					callback: function (records, operation, success) {
						//console.log('The DataStore callback was running!');

						if (!success)
							FAST.OnRequestError(operation);
					}
				});
			}
		}
	});

	var authorStore = Ext.create('Ext.data.Store', {
		storeId: 'simpAuthorStore',
		fields: ['FUNCTION_ID', 'FUNCTION_NAME', 'ROLEAUTHORS_ID', 'ROLE_ID'],
		autoLoad: true,
		pageSize: 100,

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

	var divPanel = Ext.get('pnlGirdView');
	Ext.create('Ext.grid.Panel', {
		store: authorStore,
		viewConfig: {
			stripeRows: true,
			enableTextSelection: true
		},

		columns: [{
			text: '功能名称',
			align: 'center',
			dataIndex: 'FUNCTION_NAME',
			sortable: false,
			menuDisabled: true,
			flex: 0.25
		}, {
			text: '授权',
			align: 'center',
			sortable: false,
			menuDisabled: true,
			dataIndex: 'ROLEAUTHORS_ID',
			flex: 0.25,
			renderer: function (value, metaData, record, rowIndex, colIndex) {
				if (!value)
					return '<a class="x-grid-row-checker" id="checkbox' + rowIndex + '"  href="javascript:GridCellChecked(' + rowIndex + ');"></a>';
				return '<a class="x-grid-row-checker x-checkbox-selected" id="checkbox' + rowIndex + '"  href="javascript:GridCellChecked(' + rowIndex + ');"></a>';
			}
		}],

		width: 700,
		height: "100%",
		renderTo: divPanel
	});

	var editForm = Ext.WindowManager.get('pnlGirdForm');
	if (editForm != null && editForm != undefined) {
		Ext.WindowManager.unregister(editForm);
	}
	var _deleteElement = document.getElementById('pnlGirdForm');
	if (_deleteElement) {
		_deleteElement.parentNode.removeChild(_deleteElement);
	}
}

function GridCellChecked(rowIndex) {
	var $checkObj = $('#checkbox' + rowIndex);
	var functionObject = Ext.data.StoreManager.lookup('simpAuthorStore').getAt(rowIndex).data;
	functionId = functionObject.FUNCTION_ID;

	if ($checkObj.hasClass('x-checkbox-selected')) {
		$checkObj.removeClass('x-checkbox-selected');
		checkedList[rowIndex] = '';
	} else {
		$checkObj.addClass('x-checkbox-selected');
		checkedList[rowIndex] = functionId;
	}
}

function UpdateAuthorEvent() {
	var index = 0;
	var functionArray = new Array();
	var authorStore = Ext.data.StoreManager.lookup('simpAuthorStore');

	$("a.x-grid-row-checker").each(function () {
		var $actor = $(this);
		if ($actor.hasClass('x-checkbox-selected')) {
			if (authorStore.getAt(index))
				functionArray.push(authorStore.getAt(index).data.FUNCTION_ID);
		}
		index++;
	});

	var functionIds = functionArray.join(',');
	var parameters = { Function_Id_List: functionIds, ROLE_ID: currnetId };

	Ext.Ajax.request({
		url: '../../Master/MASTER_ROLEAUTHORS/UpdateModel2/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'POST',
		params: parameters,
		success: function (response, options) {
			HeaderQueryData();
			FAST.OnInfoEvent('更新系统角色权限成功!<br/><br/>');
		},
		failure: function (response, options) {
			FAST.OnResponseError(response);
		}
	});
}

function HeaderQueryData() {
	Ext.data.StoreManager.lookup('simpAuthorStore').reload();
}

function ReSetSubViewSize(isFirstLoad) {
	var $center = $('.main-center-container');
	var defWidth = $center.width();
	var defHeight = $center.height();
	if ((defWidth + 300) < FAST.visibleWidth && (defHeight + 109) <= FAST.visibleHeight) {
		defWidth += 17;
	}
	console.log('Current Center Size : ' + defWidth + ' x ' + defHeight);

	$('div.center-full-container').width(defWidth - 50).height(defHeight - 50);
	$('div.center-full-grid-area').height(defHeight - 220 - 125);
	$('div.center-full-grid-area').css('padding-left', (defWidth - 750) / 2);
	///重绘表格
	if (!isFirstLoad) {
		//调整大小
		$('div.x-grid-body').height(defHeight - 220 - 32 - 125);
		$('div.x-grid-view').height(defHeight - 220 - 32 - 125);
	}
};

function ViewMinimumSize() {
	var $border = $('div.center-grid-basic-border');
	//var $area = $('div.center-grid-basic-area');
	var oldHeight = $border.attr('oldHeight');

	if ($border.hasClass('grid-area-minimum')) {
		$border.removeClass('grid-area-minimum');
		//$area.removeClass('x-hide');
		if (typeof oldHeight != 'undefined')
			$border.height(oldHeight * 1);
	} else {
		$border.addClass('grid-area-minimum');
		//$area.addClass('x-hide');
		$border.attr('oldHeight', $border.height());
		$border.height(51);
	}
}

function GridViewClose() {
	$('div.center-grid-basic-border').addClass('x-hide');
}

/*
** 全局初始化
********************************************************************************************************************************/

///窗体大小
ReSetSubViewSize(true);
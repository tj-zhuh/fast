; (function (window, $) {
	if (!window || !window.document)
		throw new Error("FAST requires a window with a document");

	if (!$)
		throw new Error("FAST requires a $ with a jQuery");

	if (typeof FAST == 'undefined') {
		window.FAST = {
			/// <summary>
			/// 计算最小公倍数.
			/// </summary>
			GetLeastCommonMultiple: function (a, b) {
				var result = 1;
				for (var i = (a > b ? a : b) ; i <= a * b ; i++) {
					if (i % a == 0 && i % b == 0) {
						result = i;
						break;
					}
				}

				return result;
			},

			/// <summary>
			/// 把需要自动运行的函数增加到队列里.
			/// </summary>
			AutoRefrashEvent: function (event, second, scope) {
				if (typeof event != 'function')
					return;
				if (!second || (second * 1) < 1) {
					second = 1;
				}

				if (!scope || scope != 'global') {
					this.__autoRefrashEvents[0] = event;
					this.__autoRefrashSeconds[0] = second;
				}
				else {
					this.__autoRefrashEvents[0] = null;
					this.__autoRefrashSeconds[0] = 0;
					this.__autoRefrashEvents.push(event);
					this.__autoRefrashSeconds.push(second);
				}

				this.__leastCommonMultiple = this.GetLeastCommonMultiple(this.__leastCommonMultiple, second);
			},

			/// <summary>
			/// 清出页面刷新.
			/// </summary>
			ClearPageRefrash: function () {
				this.__autoRefrashEvents[0] = null;
				this.__autoRefrashSeconds[0] = 0;
			},

			/// <summary>
			/// 内部函数, 每一秒钟调用一次.
			/// </summary>
			__AutoRefrashDelegate: function () {
				for (var i = 0; i < this.__autoRefrashEvents.length; i++) {
					if (!!this.__autoRefrashEvents[i] && typeof this.__autoRefrashEvents[i] == 'function'
						&& !!this.__autoRefrashSeconds[i] && this.__autoRefrashCount % this.__autoRefrashSeconds[i] == 0) {
						this.__autoRefrashEvents[i]();
					}
				}

				///计数器
				if (this.__autoRefrashCount == this.__leastCommonMultiple) {
					this.__autoRefrashCount = 1;
				}
				else {
					this.__autoRefrashCount++;
				}
			},

			/// <summary>
			/// 内部变量, 存储.自动运行的函数
			/// </summary>
			__autoRefrashEvents: [],

			/// <summary>
			/// 内部变量, 存储.自动运行的函数 的执行间隔秒数.
			/// </summary>
			__autoRefrashSeconds: [],

			/// <summary>
			/// 只读 获取当前队列个数.
			/// </summary>
			autoRefrashCount: 0,

			/// <summary>
			/// 内部变量, 存储.最小公倍数
			/// </summary>
			__leastCommonMultiple: 1,

			/// <summary>
			/// 内部变量, 存储.自动刷新计数
			/// </summary>
			__autoRefrashCount: 1,

			/// <summary>
			/// 内部函数, 每一秒钟调用一次.
			/// </summary>
			serverTime: new Date(),

			/// <summary>
			/// 页面整体可视宽度.
			/// </summary>
			visibleWidth: 0,

			/// <summary>
			/// 页面整体可视高度.
			/// </summary>
			visibleHeight: 0,

			/// <summary>
			/// 获取错误详细信息.
			/// </summary>
			OnRequestError: function (operation) {
				Ext.MessageBox.alert({
					title: '错 误',
					msg: '服务器内部错误，操作执行失败！<br/><br/>' + operation.error.statusText,
					width: 480,
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
											width: 780,
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
											width: 780,
											buttons: Ext.MessageBox.OK,
											icon: Ext.MessageBox.ERROR
										});
									}
								}
							});
						}
					}
				});
			},

			/// <summary>
			/// 获取错误详细信息.
			/// </summary>
			OnResponseError: function (response) {
				Ext.MessageBox.alert({
					title: '错 误',
					msg: '服务器内部错误，操作执行失败！<br/><br/>' + response.statusText,
					width: 480,
					buttons: Ext.MessageBox.OKCANCEL,
					buttonText: { ok: '确 定', cancel: '详 细' },
					icon: Ext.MessageBox.ERROR,
					fn: function (optional) {
						if (optional == "cancel") {
							if (response.status == 404 || (response.error && response.error.status == 404)) {
								Ext.MessageBox.alert({
									title: '详细信息',
									msg: response.responseText,
									width: 780,
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
									resizable: false,
									title: '详细信息',
									msg: errorAry.join('<br/>'),
									width: 780,
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});
							}
						}
					}
				});
			},

			/// <summary>
			///显示警告详细信息
			/// </summary>
			OnWarnEvent: function (content) {
				Ext.MessageBox.alert({
					title: '警告',
					msg: content + '<br/>',
					width: 480,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.WARNING
				});
			},

			/// <summary>
			///显示提示详细信息
			/// </summary>
			OnInfoEvent: function (content) {
				Ext.MessageBox.alert({
					title: '提 示',
					msg: content,
					width: 480,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.INFO
				});
			},

			/// <summary>
			///显示错误详细信息
			/// </summary>
			OnErrorEvent: function (content) {
				Ext.MessageBox.alert({
					title: '错 误',
					msg: content,
					width: 480,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			},

			/// <summary>
			///显示最终操作信息
			/// </summary>
			OnSubmitResponse: function (response, editForm) {
				//console.log('The ExecuteButton ResponseEvent was Responding!');

				if (response.status == 200) {
					FAST.OnInfoEvent('操作处理成功!<br/><br/>');
					//editForm.reset();
					//editForm.up('window').hide();
				} else {
					FAST.OnResponseError(response);
				}
				HeaderQueryData();
			},

			/// <summary>
			///调用后台处理进程
			/// </summary>
			OnExcuteRequest: function (editForm, operate, action, flushList, UserId0000, SessionId0000) {
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
							url: action + urlConfig[operate] + '/' + UserId0000 + '/' + SessionId0000 + '/?parameters={}',
							success: function (form, operate) {
								FAST.OnSubmitResponse(this.response, editForm)
							},
							failure: function (form, operate) {
								FAST.OnSubmitResponse(this.response, editForm)
							}
						});
					} else {
						this.OnWarnEvent('请按照提示补全遗漏项！<br/><br/>');
					}
				} else {
					///删除选定记录列表
					Ext.Ajax.request({
						url: action + urlConfig[operate] + '/' + UserId0000 + '/' + SessionId0000 + '/?parameters=' + flushList.join(','),
						success: function (response) {
							FAST.OnInfoEvent('操作处理成功!');
							HeaderQueryData();
						},
						failure: function (response) {
							FAST.OnResponseError(response);
							HeaderQueryData();
						}
					});
				}
			},

			/// <summary>
			/// 数据导出到Excel
			/// </summary>
			ExportExcel: function (extGrid, filename) {
				var html = extGrid.ExportData({
					format: 'html',
					headers: true
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
			}
		};
	}

	/**
	 * 对Date的扩展，将 Date 转化为指定格式的String
	 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	 * eg:
	 * (new Date()).toFormat("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	 * (new Date()).toFormat("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
	 * (new Date()).toFormat("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
	 * (new Date()).toFormat("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
	 * (new Date()).toFormat("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	 */
	Date.prototype.toFormat = function (format) {
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
		var week = { "0": "/u65e5", "1": "/u4e00", "2": "/u4e8c", "3": "/u4e09", "4": "/u56db", "5": "/u4e94", "6": "/u516d" };
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(format)) {
			format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return format;
	}

	/// <summary>
	/// 去掉左右空格.
	/// </summary>
	String.prototype.toTrim = function () {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}

	/// <summary>
	/// 去掉左侧空格.
	/// </summary>
	String.prototype.toLTrim = function () {
		return this.replace(/(^\s*)/g, "");
	}
	/// <summary>
	/// 去掉右侧空格.
	/// </summary>
	String.prototype.toRTrim = function () {
		return this.replace(/(\s*$)/g, "");
	}

	/// <summary>
	/// 屏蔽右键菜单.
	/// </summary>
	document.oncontextmenu = function () { return false; }

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
	Ext.grid.GridPanel.prototype.ExportData = function (opt) {
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

	/// <summary>
	/// 窗体大小调整.
	/// </summary>
	function ReSetWindowViewSize() {
		var defWidth = $(window).width();
		var defHeight = $(window).height();
		//console.log('Current Window Size : ' + defWidth + ' x ' + defHeight);

		FAST.visibleWidth = defWidth;
		FAST.visibleHeight = defHeight;

		if (defHeight < 900) {
			defHeight = 900;
		}

		$('div.main-center-container').height(defHeight - 109);
		if (typeof ReSetSubViewSize == 'function') {
			ReSetSubViewSize(false);
		}
	}

	/// <summary>
	/// 初始化顶部区域导航按钮点击事件.
	/// </summary>
	function InitHeaderNavigator() {
		var menuborders = $('li.h-nav-item-border');
		menuborders.each(function (i) {
			$(this).on('click', function () {
				var $this = $(this);
				var $menuActor = $this.find('a');

				if ($this.hasClass('focused')) {
					///取消选中
					$this.removeClass('focused');
					var mappings = {
						'h-nav-item-logger-active': 'h-nav-item-logger',
						'h-nav-item-home-active': 'h-nav-item-home',
						'h-nav-item-mirror-active': 'h-nav-item-mirror',
						'h-nav-item-alarm-active': 'h-nav-item-alarm'
					};
					var classes = $menuActor.attr('class').split(' ');
					for (var index in classes) {
						if (!!mappings[classes[index].toTrim()]) {
							$menuActor.addClass(mappings[classes[index].toTrim()]);
							$menuActor.removeClass(classes[index].toTrim());
						}
					}
				} else {
					$this.siblings('li').each(function (j) {
						var $this = $(this);
						var $menuActor = $this.find('a');

						///取消选中
						$this.removeClass('focused');
						var mappings = {
							'h-nav-item-logger-active': 'h-nav-item-logger',
							'h-nav-item-home-active': 'h-nav-item-home',
							'h-nav-item-mirror-active': 'h-nav-item-mirror',
							'h-nav-item-alarm-active': 'h-nav-item-alarm'
						};
						var classes = $menuActor.attr('class').split(' ');
						for (var index in classes) {
							if (!!mappings[classes[index].toTrim()]) {
								$menuActor.addClass(mappings[classes[index].toTrim()]);
								$menuActor.removeClass(classes[index].toTrim());
							}
						}
					});

					///激活选中
					$this.addClass('focused');
					var mappings = {
						'h-nav-item-logger': 'h-nav-item-logger-active',
						'h-nav-item-home': 'h-nav-item-home-active',
						'h-nav-item-mirror': 'h-nav-item-mirror-active',
						'h-nav-item-alarm': 'h-nav-item-alarm-active',
					};
					var classes = $menuActor.attr('class').split(' ');
					for (var index in classes) {
						if (!!mappings[classes[index].toTrim()]) {
							$menuActor.addClass(mappings[classes[index].toTrim()]);
							$menuActor.removeClass(classes[index].toTrim());
						}
					}
				}
			});
		});
	}

	/// <summary>
	/// 初始化顶部区域角色列表下拉事件.
	/// </summary>
	function InitHeaderRoleToggler() {
		$('a.h-info-item-role-show').on('click', function (e) {
			var e = e || window.event;
			e.stopPropagation();
			var $roleList = $('ul.v-role-list-border');
			if ($roleList.hasClass('x-show')) {
				///取消选中
				$roleList.removeClass('x-show');
				$roleList.addClass('x-hide');
			} else {
				///激活选中
				$roleList.removeClass('x-hide');
				$roleList.addClass('x-show');
			}
		});
		$(document).click(function () {
			var $roleList = $('ul.v-role-list-border');
			if ($roleList.hasClass('x-show')) {
				///取消选中
				$roleList.removeClass('x-show');
				$roleList.addClass('x-hide');
			}
		})
	}

	/// <summary>
	/// 初始化顶部区域导航按钮点击事件.
	/// </summary>
	function RefrashSystemClock() {
		FAST.serverTime = new Date();
		var date = new Date(FAST.serverTime.getTime())
		//FAST.serverTime = new Date(FAST.serverTime.getTime());
		var currentTime = date.toFormat("yyyy年MM月dd日 HH:mm:ss");
		$('span.h-info-item-time').html(currentTime);
	}

	/// <summary>
	/// 顶部区域导航按钮 报警数量.
	/// </summary>
	function AutoRefrashAlarmCount() {
		$.ajax({
			type: 'GET',
			url: "../Concrete/SYSTEM_ALTERLOG/GetAlarmCount/UserId0000/SessionId0000/?parameters={}&_dc=" + (new Date().getTime()),
			data: {},
			dataType: 'json',
			success: function (data) {
				if (data == null || data.ArrayModels == null || data.ArrayModels.length < 1) {
					console.log(data);
				} else {
					var alarmlevel = null;
					var alarmCount = data.ArrayModels.length;
					var $alarmTip = $('span.h-nav-item-tips');
					if (alarmCount * 1 > 0) {
						$alarmTip.html(alarmCount).removeClass('x-hide');
					} else {
						$alarmTip.html(0).addClass('x-hide');
					}

					for (var i = 0; i < data.ArrayModels.length; i++) {
						if (data.ArrayModels[i].ALTERING_LEVEL == 'FAULT_GRAVE') {
							alarmlevel = 'fault';
						}
						else if (alarmlevel != 'fault' && data.ArrayModels[i].ALTERING_LEVEL == 'FAULT_NORMAL') {
							alarmlevel = 'normal';
						}
						else if (alarmlevel != 'fault' && alarmlevel != 'normal' && data.ArrayModels[i].ALTERING_LEVEL == 'FAULT_LIGHT') {
							alarmlevel = 'light';
						}
					}

					$('.h-nav-item-alarm').addClass(alarmlevel);
				}
			},
			error: function (response) {
				console.log(response);
			}
		});
	}

	/// <summary>
	/// 初始化，事件绑定.
	/// </summary>
	$(function () {
		///窗体大小
		ReSetWindowViewSize();

		///窗体大小调整
		$(window).resize(ReSetWindowViewSize);

		///绑定顶部导航按钮点击事件
		InitHeaderNavigator();

		///初始化顶部区域角色列表下拉事件
		InitHeaderRoleToggler();

		///定时刷新时间加入自动刷新列表
		FAST.AutoRefrashEvent(RefrashSystemClock, 1, 'global');

		FAST.AutoRefrashEvent(AutoRefrashAlarmCount, 5, 'global');

		if (typeof (globalAutoRefrash) != 'undefined') {
			self.clearInterval(globalAutoRefrash);
		}
		var globalAutoRefrash = self.setInterval("FAST.__AutoRefrashDelegate()", 1000);
	});
})(window, jQuery);
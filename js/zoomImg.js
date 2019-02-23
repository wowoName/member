;
(function($, window, document, undefined) {
	"use strict";

	function SdZTree(opt, ele) {
		var that = this;
		//默认配置
		var opts = {
			extendLevel: 0, //展开的节点等级
			treeData: [], //数据
			searchKey: 'id', //定位 、返回的id
			searchValue: 'name', //显示的节点
			height: "", //高度
			autoW: false, //宽度自适应
			callback: {
				click: false,
				check: false
			}, //是否添加事件
			isCheckbox: false, //是否有复选框
			setting: {
				view: {
					dblClickExpand: true,
					selectedMulti: false // 禁止多选
				},
				check: {
					enable: false,
					chkboxType: {
						"Y": "ps",
						"N": "ps"
					}
				},
				data: {
					simpleData: {
						enable: true
					},
					key: {
						name: opt.searchValue
					}
				},
				callback: {}
			}
		}
		//复选框的配置
		if(opt.hasOwnProperty('isCheckbox') && opt.isCheckbox) opts.setting.check.enable = true;
		this.opts = $.extend({}, opts, opt); // 配置
		this.ele = ele; //当前元素
		this._id = ele[0].id; //元素的id
		this.lisuTreeObj = null;
		this.searchResult = []; // 搜索内容
		this.index = 0; // 定位的索引
		this.searchKey = opts.searchKey; // 定位节点的key
		this.searchValue = opts.searchValue; // 搜索内容
		this.lsdtreeObj = null; //树的对象
		this.checkNodeTag = null; //复选框选中的树
		if(this.ele.siblings("input[type='hidden']").length == 0 || this.ele.siblings("input[type='hidden']").length >= 1)
			this.ele.after('<input type="hidden" lisu-model=""  placeholder="这是树的id" id="' + this._id + '_lisuID" />');
		this.init = function() {
			var lsdTreeElem = '<div id="sdZTree_' + this._id + '" class="lsdt-treeNav" ><div class="lsdt-searchElem"><input type="text" class="lsdt-content"    placeholder="请输入查询内容" /><input type="text" id="count_' + this._id + '" class="lsdt-count" /><input type="hidden" class="lsdt-searchBtn " value="搜索"  />&nbsp;<button  class="lsdt-searchPrev" title="Enter 以及 左、右键可以快速定位查找结果"></button><button  class="lsdt-searchNext" title="Enter 以及 左、右键可以快速定位查找结果"></button></div><div class="lsdt-ztree-nav"><ul id="lsdTree_' + this._id + '"  class="ztree "></ul></div></div>';
			$("body").append(lsdTreeElem);
			this.lisuTreeObj = $("#sdZTree_" + this._id); //当前树元素
			if(this.opts.hasOwnProperty("height") && this.opts.height != "") this.lisuTreeObj.find('#lsdTree_' + this._id).css("max-height", this.opts.height);
			lsdTreeElem = null;
			$.fn.zTree.init($("#lsdTree_" + this._id), this.opts.setting, this.opts.treeData);
			this.lsdtreeObj = $.fn.zTree.getZTreeObj("lsdTree_" + this._id); // 树
			//添加事件
			if(this.opts.callback.click)
				this.lsdtreeObj.setting.callback.onClick = this.lisuTreeClick;
			if(this.opts.callback.check)
				this.lsdtreeObj.setting.callback.onCheck = this.lisuTreeCheck;
			//绑定事件
			this.bindEvent(this.ele, this.lisuTreeObj);
		};
		this.restore = function() { // 还原
			this.searchResult = []; // 搜索内容
			this.index = 0; // 定位的索引
			var lsdElem = document.getElementById("sdZTree_" + this._id);
			lsdElem.children[0].children[1].classList.remove("lsdt-showSearchCountNo", "lsdt-showSearchCountHas");
			lsdElem.children[0].children[1].value = "";
			lsdElem.children[0].children[4].classList.remove("lsdt-hasSearchNext");
			lsdElem.children[0].children[3].classList.remove("lsdt-hasSearchPrev");
			// 树 的背景色
			this.lsdtreeObj.setting.view.fontCss["color"] = "#676a6c"; // 设置背景色
			this.lsdtreeObj.refresh(); // ztree的方法
		}
		// 搜索
		this.lsdSearch = function() {
			var lsd_searchContent = $.trim(this.lisuTreeObj.find(".lsdt-content").val());
			this.searchResult = []; // 搜索结果
			this.index = 0; // 定位搜索结果位置
			this.lsdtreeObj.cancelSelectedNode(); // 取消节点的选中状态
			this.restore();
			var that = this;
			if(lsd_searchContent) {
				var lsdTreeAllNodes = this.lsdtreeObj.getNodes(), // 只获取根节点
					lsdTransformAllNodes = this.lsdtreeObj.transformToArray(lsdTreeAllNodes); // 获取所有的节点包括子节点
				this.searchResult = lsdTransformAllNodes.filter(function(key) {
					return key[that.searchValue].toString().indexOf(lsd_searchContent) > -1
				});
				// 将搜索结果放入到 文本框
				var serchTreeCountEle = document.getElementById("count_" + this._id);
				// 根据搜索到的结果添加样式
				this.searchResult.length > 0 ? (this.lisuTreeObj.find(".lsdt-searchNext").addClass("lsdt-hasSearchNext"), this.lisuTreeObj.find(".lsdt-searchPrev").addClass("lsdt-hasSearchPrev"), serchTreeCountEle.className += " lsdt-showSearchCountHas", serchTreeCountEle.value = "[ 1 / " + this.searchResult.length + " ]") : (this.lisuTreeObj.find(".lsdt-searchPrev").removeClass("lsdt-hasSearchPrev"), this.lisuTreeObj.find(".lsdt-searchNext").removeClass("lsdt-hasSearchNext"), serchTreeCountEle.className += " lsdt-showSearchCountNo", serchTreeCountEle.value = "[ 0 / 0 ]");
				// 定位搜索到的第一个
				this.index = -1;
				this.searchNode(false);
			}
		};
		//定位节点【搜搜上一个true、下一个】
		this.searchNode = function(type) {
			if(this.searchResult.length == 0) return;
			this.lsdtreeObj.cancelSelectedNode(); // 取消节点的选中状态
			type ? (this.index == 0 ? this.index = this.searchResult.length - 1 : this.index--) : (this.index == (this.searchResult.length - 1) ? this.index = 0 : this.index++);
			var locateNode = this.lsdtreeObj.getNodeByParam(this.searchKey, this.searchResult[this.index][this.searchKey]);
			if(locateNode) {
				this.lsdtreeObj.selectNode(locateNode, false, false); // 选中节点
				this.lsdtreeObj.expandNode(locateNode, true, false, true); // 
				document.getElementById("count_" + this._id).value = "[ " + (this.index + 1) + "/" + this.searchResult.length + " ]";
			}
			this.lisuTreeObj.find(".lsdt-content").focus();
		};
		// 展开等级
		this.lsdTreeExapnd = function() {
			this.restore();
			if(typeof this.opts.extendLevel != "number") this.opts.extendLevel = 0;
			// 获取选中的节点的ID
			var thisSelID = "";
			if($("#" + this._id).siblings("input[type='hidden']").length > 0 && $("#" + this._id).siblings("input[type='hidden']").val() != "")
				thisSelID = $("#" + this._id).siblings("input[type='hidden']").val().split(",");
			if(thisSelID.length != 0)
				// 定位选中节点
				this.locateLsdNode(thisSelID);
			else {
				var lsdExapndNodes = this.lsdtreeObj.getNodes(),
					lsdExapndNodesEnd = this.lsdtreeObj.transformToArray(lsdExapndNodes);
				for(var i = 0; i < lsdExapndNodesEnd.length; i++) {
					this.lsdtreeObj.expandNode(lsdExapndNodesEnd[i], (Number(lsdExapndNodesEnd[i].level) == Number(this.opts.extendLevel)), false, false)
				}
			}
		};
		// 定位節點  接受数组
		this.locateLsdNode = function(thisSelID) {
			if(thisSelID.length > 0) thisSelID = thisSelID[0];
			var thisNode = this.lsdtreeObj.getNodeByParam(this.searchKey, thisSelID),
				that = this;
			if(thisNode) {
				var thisParentNode = thisNode.getParentNode();
				if(thisParentNode && thisParentNode.hasOwnProperty(this.searchKey)) {
					var thisPid = thisParentNode[this.searchKey],
						thisPNode = this.lsdtreeObj.getNodeByParam(this.searchKey, thisPid);
					// 延时展开
					if(thisPNode)
						this.expendLisuTree(thisPNode, thisNode);
				} else
					this.expendLisuTree(thisNode, thisNode);
			}
		};
		// 延时展开
		this.expendLisuTree = function(thisPNode, thisNode) {
			var that = this;
			setTimeout(function() {
				that.lsdtreeObj.expandNode(thisPNode, true, false, true);
				that.lsdtreeObj.selectNode(thisNode, false, false)
			}, 200);
		};

		this.bindEvent = function(_self, bindEventObj) {
			var that = this;
			_self.on("click", function(event) {
				event.stopPropagation();
				that.lsdTreeShow();
			}).on("input", function(event) {
				event.stopPropagation();
				that.lsdSearch();
			});
			// 搜索
			bindEventObj.find(".lsdt-content").on("input", this.lsdSearch());
			// 搜索
			bindEventObj.find(".lsdt-searchBtn").on("click", this.lsdSearch());
			bindEventObj.on("focus", function() {
				$(this).blur();
				bindEventObj.find(".lsdt-content").focus();
			});
			// 上一个
			bindEventObj.find(".lsdt-searchPrev").on("click", function() {
				that.searchNode(true);
			}); // 下一个
			bindEventObj.find(".lsdt-searchNext").on("click", function() {
				that.searchNode(false);
			});
		};
		//移除复选框选中的节点
		this.removeCheckTree = function() {
			//多选移除的事件
			that.ele.find(".lisuTag-remove").on("click", function(event) {
				event.stopPropagation()
				//找到id
				var thisID = $(this).attr("data-id");
				//移除id
				var thisIds = that.ele.siblings("input[type='hidden']").val().split(",");
				thisIds.splice(thisIds.indexOf(thisID), 1)
				that.ele.siblings("input[type='hidden']").val(thisIds);
				//移除树的选择状态
				that.lsdtreeObj.checkNode(that.lsdtreeObj.getNodeByParam(that.opts.searchKey, thisID), false, true);
				//移除此项
				$(this).parent().remove();
			});
			//定位节点
			that.ele.find(".lisuTag").on("click", function(event) {
				event.stopPropagation();
				//如果没有显示显示
				if(that.lisuTreeObj.css("display") == "none")
					that.lsdTreeShow();
				that.locateLsdNode(new Array($(this).find('.lisuTag-remove').attr("data-id")));
			});
		};
		this.isBindEvent = function(bol) {
			var that = this;
			if(bol)
				$(window).bind("scroll click mousedown resize keydown", this.eventWindow);
			else $(window).unbind("scroll click mousedown resize keydown");

		};
		this.eventWindow = function(event) {
			event.stopPropagation();
			if(that.lisuTreeObj.css("display") != "none") {
				if(!that.ele.is(event.target) && that.ele.has(event.target).length === 0 && !that.lisuTreeObj.is(event.target) && that.lisuTreeObj.has(event.target).length === 0) {
					that.lisuTreeObj.fadeOut();
					//解绑
					that.isBindEvent(false);
				}
				switch(event.keyCode) {
					case 13:
						that.lsdSearch();
						break;
					case 40:
						that.searchNode(false)
						break;
					case 38:
						that.searchNode(true)
						break;
				}
			}
		};
		this.lsdTreeShow = function() {
			// 显示下拉树
			if(this.lisuTreeObj.css("display") != "none") return;

			//展开节点
			that.lsdTreeExapnd();
			this.lisuTreeObj.css(this.lisuLayuout()).show();
			//绑定事件
			that.isBindEvent(true);
		};
		this.lisuLayuout = function() {
			var thisElePosi = document.getElementById(this._id).getBoundingClientRect(),
				top = thisElePosi.top + thisElePosi.height + 2,
				thisTreeHeight = parseInt(this.lisuTreeObj.css("height"));
			if(document.documentElement.clientHeight - thisElePosi.bottom < 250)
				top = thisElePosi.top - thisTreeHeight - 2;
			var styleJson = {
				"top": top,
				"left": thisElePosi.left
			};
			if(opt.hasOwnProperty("autoW")) {
				styleJson.width = thisElePosi.width - 2;
				styleJson.left += 1;
			}

			return styleJson;
		};
		//位置调整
		this.layoutLisuTree = function() {
			var thisElePosi = document.getElementById(that._id).getBoundingClientRect(),
				styleJson = {
					"top": thisElePosi.top + thisElePosi.height,
					"left": thisElePosi.left
				};
			that.lisuTreeObj.css(this.lisuLayuout());
		};
		//树的点击事件
		this.lisuTreeClick = function(e, treeId, treeNode) {
			//如果有複選框的情况下点击节点同时选中
			if(that.opts.setting.check.enable)
				that.lsdtreeObj.checkNode(that.lsdtreeObj.getNodeByParam('id', treeNode.id), true, false);
			var lisuNodeName = that.ele[0].nodeName;
			if(lisuNodeName == 'DIV')
				that.ele.html("<div class='lisuTag'>" + treeNode[that.opts.searchValue] + " <i class='lisuTag-remove' data-id='" + treeNode[that.opts.searchKey] + "'>&#215;</i></div>"), that.checkNodeTag = that.ele.find('.lisuTag');
			else
				that.ele.val(treeNode[that.opts.searchValue]);
			if(that.ele.siblings("input[type='hidden']").length > 1)
				that.ele.siblings("[id^='" + that._id + "']").val(treeNode[that.opts.searchKey]);
			else that.ele.siblings("input[type='hidden']").val(treeNode[that.opts.searchKey]);

		};
		//树的勾选--勾选只对
		this.lisuTreeCheck = function(e, treeId, treeNode) {
			that.getCheckLisuNode();
		};
		this.getCheckLisuNode = function() {
			var lisuNodeName = that.ele[0].nodeName;
			var lastCheckNode = that.lsdtreeObj.getCheckedNodes(true).filter(function(v, i, arr) {
				return(!v.getCheckStatus().half && !v.isParent)
			});
			var thisNodeHID = lastCheckNode.map(function(v, i, arr) {
				return v[that.opts.searchKey]
			});
			if(lisuNodeName == 'DIV') {
				var thisNodeH = lastCheckNode.map(function(v, i, arr) {
					return "<div class='lisuTag'> <span>" + v[that.opts.searchValue] + "</span> <i class='lisuTag-remove' data-id='" + v[that.opts.searchKey] + "'></i></div>"
				});
				//显示节点的命、名称
				that.ele.html(thisNodeH.join(''));
				that.checkNodeTag = that.ele.find('.lisuTag');
				//位置调整
				that.layoutLisuTree();
			} else {
				var thisNodeH = lastCheckNode.map(function(v, i, arr) {
					return v[that.opts.searchValue];
				});
				//显示节点的命、名称
				that.ele.val(thisNodeH);
			}

			//保存id
			if(that.ele.siblings("input[type='hidden']").length > 1)
				that.ele.siblings("[id^='" + that._id + "']").val(thisNodeHID.join(','));
			else that.ele.siblings("input[type='hidden']").val(thisNodeHID.join(','));
			that.removeCheckTree();
		};

		// 初始化
		this.init();
	};

	//图片放大的对象
	function LisuZoomImg(ele) {
		this.liusZoomOpt = {
			// 图片的样式
			lisuImgStyle: 'position: relative;top: 50%;left: 50%;transform: translate(-50%, -50%);cursor:move; padding: 4px;background-color: #ffffff;border: 1px solid #ddd; border-radius: 4px;user-select: none;height:50%',
			lisuMove: false, // 移动标记
			lisuX: "",
			lisuY: "", // 鼠标离控件左上角的相对位置
			imgIndex: 0, // 当前显示的图片的索引
			liusTarget: null, // 放大的图片dom
			closeImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADaUlEQVR4Xu2b3XHUMBCAV/IrGUIHUEHikV6B0EGoAOggHRA6IBVwqYB0QIBXeUwqIHQQhrxaYva4m7lcbOt3JTE5P/tH32d5tZJXDB74wR44P+wE7HrAAzcw+wkopd4AwAlj7BAAbgDggnP+oW3b6xq99X3/VGv9HgCOAWDfGPMDAD5KKc+n2jspoOu6TwDwduTCG875q7Zt8ebVHH3fH2qtvyD4SKMWQoh3Y40dFaCUOmaMfZ6hq0qCBX6JYYx5LaW82GYaFdB13SUAvLS83iokuMCvOL4KIY5cBRjHvl1Uggc84twIIZ64CsDv+6BmCZ7wiHIlhMBgfueYigELxhiOAK5H1p4QAI8cZ0KIEycBfd/vD8NwzRh77GoAu1iO0SEQ/hfn/LBtWxzK7T0Az8AHDcNwWZOEEHhjzO+maY6mhu3ZRKgmCRTw+KKtk6EaJFDBOwko/TlQwjsLKCWBGt5LQG4JOeC9BeSSkAs+SAC1hJzwwQKoJOSGjxKQWkIJ+GgBqSSUgk8iIFYCXj+zkjM6FbGltx7zF3sm6HqzkIzRGPOHsWUyuuf6nJTwyXrAuvEhEpaNYAyXrKwOUsMnFxDxOVglUMCTCKCQQAVPJiClBEp4UgEpJFDDkwvYkPCdMfbIGuXunnDLOX9O/QPGuiDi2eh7p6+SnG/GmL3VkOd0Sxwim6Z58V8L2MzwEF5rvYz2Hgf5QqtXazwavlxU3c7wapRAImAut69NQnIBLhObmiQkFeACv/6MapGQTIAP/EYsucU5gOcQmTQwJhEQAr9OclBGyT9Q0QJi4NdjfOAsMklPiBKQAj5yKh0tIVhASviSEoIEUMCXkuAtgBK+hAQvATngc0twFpATPqcEJwEl4HNJsAooCZ9DgrVEpuRPi83pN1WyNCmghje/vf5AIWFUAJbJaa1/ThQej66L5FjAjFhoxYzxmXOZnFLKq1AyF3xkTHAvlFRK9as9AtZVsNzwoRJw74CUst0GmqoWt/+o+1eCPluEaLUXeYJPTMC2Sinv7SUILpcvDR/QE9zL5W0bJmqB95HgtWECbzwVCGuDd5FgjDmXUo5t/5kvkOi6Di/CEvMDBMdNU03TnNa8aWoYhlPcNLUq8r7CTVNCiMVUuLGmwpFxqvrLdwKqf0XEDdz1AGLB1d/+LzBBwm4IDBTkAAAAAElFTkSuQmCC",
			reductionImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADpklEQVR4Xu2b3VXbMBTHdeUBmg0aJihGfodOUDpBywSlExQmaJgAOkHDBCTv0lGYoBmBDmDdnuujcJImQVcKsWMbvUYf9/+TLN8PB0TPG/Rcv3gD8HYCdiRgrT0uy/KDEGIgpZydnJxMd5yy1uHJj4C1dlCW5S0AnC9bjIiTLMsu8jyf16okcbEkAF78AwAcb1oXEWdFUeSJNtU6LBpASPyS9d+VUqNa1SQsFgUgQjyZMlVKnSXYVOsQNoBI8d0CkCBeIOKvoii+1rqdCYsFT0CKeLJDSvkxz/NJgk21DnkRQKp4IcSNUuqyViWJi20FkCq+LUd/wWsjgL6IJwhrAPokfg1A38SvAOij+GcAqeJpAgp+Ei/gpGEAMBNCPFXGA0x2jT6rO0BrTYHNwbut24gh4lgIMc6y7D7P8woOt4Ex5koI8YM74MD7kfiRlPKGC4IA/BFCDA9cWKx5FQil1HVoIAHAUKe2/k6Phk/ObH0sOg3AX9IzD4Euz7UGWusxAHxq6y4z7X7ywdkaBKCkpnPOMidqc7e5lDL//3KsXoPGGIrbb9usjmP7plzlcyyQCgER771zwrHhVfog4tD7Le8TJlwJ1VeCoUQIW5+vBOOihviaxCUAfIkZKKU8WqTt16LBtkEg4f4eI2+QdSKWcxYb8wEthTBwzlFcQlWqYFucgq0ZoR5AqO6CF3OCLYVAtcoJALwLHIO5UuoomBVOgdB0aYwb4JFfEASwg5/QWGnM5zfmjFNwzQKQAoH8g6IoVirHwZvpFTswXfwpG0AChEZrg8xHNw5ADISm6wPW2jPn3EPoIow6AYvJOHSbLo0xAaR/JBWA0HhpbO8AFi5oWZZXS/mEKSKOiqIgt7TRxgQQfwc0qipicWMMFWd/BoZ0F4DW2m77hmkBpQrlI6C2pqu1duico2x3qF10EoDW+o6TI6CIsHMAtNbnAPA7tPVCiEel1HGnAPjECDk/AwaAKlbpDAD/2qOdD4pHxL9Zlg0pQ9x6ABT5Oee+CSGoxslt10qpqn9rAfiE6CkA0PueXdtc3n02AGPMCBFZuTbuFuzSz7/fg0d90xqI+HnZU2WdAGMMJRtPdzH6QMauxSi9AbAtQdMXAI9SyrNNH010HkAoMdN1ABdKqbuX7p9OAqDnPcuyS87fdroGYCqlvIr5Sr31AHx5fiylnHB2/P/HgQuAPqBge1v7fOeTUD//PEVwEoB9Cmp6btYJaNrIfa7/BmCfdNsw9z/RwB/5R3pchwAAAABJRU5ErkJggg==',
			isIframe: false
		};
		var _that = this;
		//当前对象
		this.ele = ele;
		//容器
		this.zoomImgobj = null;
		this.zoomImgPa = null;
		//if(opt) liusZoomOpt = $.extend(liusZoomOpt, opt);
		// 点击图片放大
		this.zoomEparkImg = function() {
			this.ele.on("click", function(event) {
				if($(event.target).closest(_that.zoomImgobj).length != 0)
					return;
				// 判断图片是否存在
				var lisuImgSrc = $(this).prop("src");
				// 图片路径错误
				_that.lisuHasImgSrc(lisuImgSrc, function() {
					_that.liusZoomOpt.lisuMove = false;
					//添加移动事件
					_that.bingMouseEvent(true);
					_that.lisuStopEvent(event);
					_that.zoomImgobj.attr("style", _that.liusZoomOpt.lisuImgStyle);
					_that.zoomImgobj.attr("src", lisuImgSrc);
					_that.zoomImgPa.fadeIn();
				})

			});
		};

		this.initZoomImg = function() {
			this.liusZoomOpt.imgIndex = 0;
			//创建显示组件
			this.lisuCreateDom();
			//添加放大的事件
			this.zoomEparkImg();
			//初始化缩放事件(通过缩放图片本身 以及遮罩层)
			_that.changeImgType(_that.zoomImgobj);
			_that.changeImgType(_that.zoomImgPa);
			_that.lisuDraggable();
		};
		// 创建显示图片的dom
		this.lisuCreateDom = function() {
			var thisStyle = 'display:none;position: fixed;width: 100%;height: 100%;top: 0;left: 0;background-color: rgba(0, 0, 0, .5);z-index: 19901111',
				lisuOPClose = "width:30px;height:30px;position:absolute;top:30px;left:100%;margin-left:-100px;z-index:5001;cursor:pointer;user-select: none;",
				lisuOPReduce = "width:30px;height:30px;position:absolute;top:100px;left:100%;margin-left:-100px;z-index:5001;cursor:pointer;user-select: none;",
				lisuHtml = '<div id="lisuZoomImg"  style="' + thisStyle + '"> <img src="' + _that.liusZoomOpt.closeImg + '" style="' + lisuOPClose + '" alt="关闭" title="关闭"/>  <img src="' + _that.liusZoomOpt.reductionImg + '" class="lisuREduce" style="' + lisuOPReduce + '" alt="还原" title="还原"/><img src=""  id="lisuImg" style="' + _that.liusZoomOpt.lisuImgStyle + '" /></div>';
			//在iframe内
			if((self.frameElement != null && self.frameElement.tagName == "IFRAME" && $("body #lisuZoomImg", parent.document).length == 0) || $("body #lisuZoomImg", parent.document).length > 0) {
				if($("body #lisuZoomImg", parent.document).length == 0) $("body", parent.document).append(lisuHtml);
				this.zoomImgobj = $("body #lisuImg", parent.document);
				this.zoomImgPa = $("body #lisuZoomImg", parent.document);
				this.liusZoomOpt.isIframe = true;
			} else if((self.frameElement == null && $("body").find("#lisuZoomImg").length == 0) || $("body").find("#lisuZoomImg").length > 0) {
				if($("body").find("#lisuZoomImg").length == 0) $("body").append(lisuHtml);
				this.zoomImgobj = $("body #lisuImg");
				this.zoomImgPa = $("body #lisuZoomImg");
				this.liusZoomOpt.isIframe = false;
			}

			// 点击遮罩层关闭
			this.zoomImgPa.on("click", function(event) {
				if($(event.target).closest(_that.zoomImgobj).length == 0) {
					_that.zoomImgPa.fadeOut(200);
					_that.bingMouseEvent(false);
				}
			});
			// 还原
			_that.zoomImgPa.find(".lisuREduce").on("click", function(event) {
				_that.lisuStopEvent(event);
				_that.zoomImgobj.attr("style", _that.liusZoomOpt.lisuImgStyle);
			});
		};
		// 判断图片路径是否正确
		this.lisuHasImgSrc = function(pathImg, success) {
			var ImgObj = new Image();
			ImgObj.src = pathImg;
			ImgObj.onload = function() {
				if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
					if(ImgObj.height > (document.documentElement.clientHeight) / 2)
						_that.liusZoomOpt.lisuImgStyle = _that.liusZoomOpt.lisuImgStyle.substr(0, _that.liusZoomOpt.lisuImgStyle.lastIndexOf(":")) + ":50%;";
					else _that.liusZoomOpt.lisuImgStyle = _that.liusZoomOpt.lisuImgStyle.substr(0, _that.liusZoomOpt.lisuImgStyle.lastIndexOf(":")) + ":auto;";
					success();
				}
			}
			ImgObj.onerror = function() {
				console.log('图片不存在');

			}

		};
		this.changeImgType = function(dom) {
			_that.domMouseWheelEvent()(dom[0], "mousewheel", function(event) {
				if(event.delta > 0) _that.lisuChangeImgSize(true); // 上 放大
				else _that.lisuChangeImgSize(false); // 下 缩小
			});
		};
		// 修改图片的大小[true 放大 fale缩小]
		this.lisuChangeImgSize = function(type) {
			if($("body", parent.document).find("#lisuImg").length == 0) return;
			var lisuClientW = parseInt(_that.zoomImgobj.css("width")),
				lisuClientH = parseInt(_that.zoomImgobj.css("height"));
			if(!type && lisuClientW * 0.95 < 100) return;
			_that.zoomImgobj.css({
				width: (type ? lisuClientW * 1.05 : lisuClientW * 0.95) + "px",
				height: (type ? lisuClientH * 1.05 : lisuClientH * 0.95) + "px"
			});
		};
		// mouserwheel事件 兼容火狐
		this.lisuMouseWheel = function(event) {
			var type = event.type;
			if(type === 'DOMMouseScroll' || type === 'mousewheel')
				event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0);
			if(event.srcElement && !event.target)
				event.target = event.srcElement;
			if(!event.preventDefault && event.returnValue !== undefined) {
				event.preventDefault = function() {
					event.returnValue = false;
				}
			}
			return event;
		};
		// 鼠标滚轮事件
		this.domMouseWheelEvent = function(dom, type, fn) {
			if(window.addEventListener) {
				return function(el, type, fn, capture) {
					if(type === 'mousewheel' && document.mozFullScreen !== undefined) type = "DOMMouseScroll";
					el.addEventListener(type, function(event) {
						_that.lisuStopEvent(event);
						fn.call(this, _that.lisuMouseWheel(event));
					}, capture || false);
				}
			} else if(window.attachEvent) {
				return function(el, type, fn, capture) {
					el.attachEvent("on" + type, function(event) {
						_that.lisuStopEvent(event);
						fn.call(el, _that.lisuMouseWheel(event));
					});
				}
			}
		};
		// 拖拽的方法
		this.lisuDraggable = function() {
			_that.zoomImgobj[0].addEventListener("mousedown", function(event) {
				_that.liusZoomOpt.lisuMove = true;
				_that.liusZoomOpt.lisuX = event.pageX - parseInt(_that.zoomImgobj.css("left"));
				_that.liusZoomOpt.lisuY = event.pageY - parseInt(_that.zoomImgobj.css("top"));
				_that.lisuStopEvent(event);
			});
		};
		// 绑定鼠标事件[事件绑定区分iframe]
		this.bingMouseEvent = function(type) {
			var dom = _that.liusZoomOpt.isIframe ? parent.document : document;
			if(type)
				$(dom).bind("mousemove", _that.imgZoomMousemove),
				$(dom).bind("mouseup", _that.imgZoomMouseup);
			else
				$(dom).unbind("mousemove", _that.imgZoomMousemove),
				$(dom).unbind("mouseup", _that.imgZoomMouseup);
		};
		this.imgZoomMousemove = function(event) {
			_that.lisuStopEvent(event);
			// 移动
			if(_that.liusZoomOpt.lisuMove) {
				_that.zoomImgobj.css({
					top: (event.pageY - _that.liusZoomOpt.lisuY),
					left: (event.pageX - _that.liusZoomOpt.lisuX)
				});
				// 移动时改变透明度
				_that.zoomImgobj.css({
					opacity: '0.5'
				});
			}
		};
		this.imgZoomMouseup = function(event) {
			_that.liusZoomOpt.lisuMove = false;
			_that.zoomImgobj.fadeTo(20, 1);
			_that.lisuStopEvent(event);
		};
		// 阻止 冒泡 浏览器默认行为
		this.lisuStopEvent = function(event) {
			if(_that.zoomImgobj.css("display") == "none") return;
			var event = event || window.event;
			// 阻止冒泡
			if(event.stopPropagation) event.stopPropagation();
			else　 window.event.cancelBubble = true;
			// 取消默认事件（避免跟mouseup冲突）
			if(event.preventDefault) event.preventDefault();
			else window.event.returnValue = false;
		}
		this.initZoomImg();
	}
	$.fn.extend({
		lsdTree: function(opt) {
			return new SdZTree(opt, this).lsdtreeObj;
		},
		initZoomImg: function() {
			new LisuZoomImg(this);
		}

	});
})(jQuery, window, document);
/**
 * readme:
 * tree :
 *  高度 ：height  默认 "”"
 *  寬度是否自适应大小autoW 默认false
 *	callback: false, //是否使用内带事件[click,check]
 *  autoW: false, //宽度自适应
 *	isCheckbox: false, //是否有复选框
 */
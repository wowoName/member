;
(function(global) {
	"use strict";

	function LisuUtils() {
		var _lisuSelf = this;
		this.curentTime = function() {
			var curDate = new Date().toLocaleDateString().replace(/\//g, '-').split("-");
			if(curDate[1] < 10) curDate[1] = 0 + curDate[1];
			if(curDate[2] < 10) curDate[2] = 0 + curDate[2];
			curDate = (curDate[0] + '-' + curDate[1] + '-' + curDate[2]);
			return curDate;
		};
		this.number = function(obj) {
			obj.on("input", function(event) {
				var lastValue = event.target.value;
				//首位不为0 2:首位.改为0. 3://清除“数字”和“.”以外的字符    4://只保留第一个. 清除多余的   
				lastValue = lastValue.toString().replace(/^0/g, "").replace(/^\./g, "0.").replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
				lastValue = lastValue.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数   
				//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
				if(lastValue.indexOf(".") < 0 && lastValue != "")
					lastValue = parseFloat(lastValue);
				event.target.value = lastValue;
			});
		};
		//reset 填写的是form的id
		this.resetForm = function(container) {
			if(!this.hasThisEle(container)) return ;
			var _eleChild = this.getObject(container, "[lisu-model]");
			for(var i = 0; i < _eleChild.length; i++) {
				_lisuSelf.setFormValue(_eleChild[i].nodeName, "", _eleChild[i]);
			}
			var _eleChildError = this.getObject(container, ".lisu-error"),
				_parents = document.getElementById(container),
				_errorClass = this.getObject(container, ".lisu-error-active");
			//移除 错误元素
			for(var i = 0; i < _eleChildError.length; i++) {
				_eleChildError[i].parentNode.removeChild(_eleChildError[i]);
			}
			//移除样式
			for(var i = 0; i < _errorClass.length; i++) {
				_errorClass[i].classList.remove("lisu-error-active")
			}

		};
		//根据lisu-model  填充数据
		this.fillForm = function(container, datas) {
			if(!this.hasThisEle(container)) return ;
			var _eleChild = this.getObject(container, "[lisu-model]");
			for(var i = 0; i < _eleChild.length; i++) {
				var _key = _eleChild[i].getAttribute("lisu-model"),
					_value = "";
				if(datas.hasOwnProperty(_key))
					_value = datas[_key];
				if((_eleChild[i].nodeName == "DIV" || _eleChild[i].nodeName == "SPAN") && _value == "") _value = "<span style='color:#c9c9c9'>^_^ 暂无数据</span>";
				_lisuSelf.setFormValue(_eleChild[i].nodeName, _value, _eleChild[i]);
			}

		};
		this.requireForm = function(container) {
			if(!this.hasThisEle(container)) return ;
			var _ele = this.getObject(container, '[lisu-re]'),
				throughVeri = true,
				_that = this;
			for(var i = 0; i < _ele.length; i++) {
				var _tooltip = _ele[i].getAttribute("lisu-re");
				if(_tooltip == "") _tooltip = "必填项哦";
				var _thisSi = $(_ele[i]).siblings(".lisu-error");
				if((_ele[i].nodeName == "INPUT" && _ele[i].value == "" && _ele[i].type != "checkbox") || (_ele[i].nodeName == "TEXTAREA" && _ele[i].value == "") || (_ele[i].nodeName == "DIV" && _ele[i].innerHTML == "") || (_ele[i].nodeName == "INPUT" && _ele[i].type == "checkbox" && !_that.siblingsChek(_ele[i]))) {
					throughVeri = false;
					$(_ele[i]).addClass("lisu-error-active");
					if(_thisSi.length > 0)
						_thisSi.html(_tooltip);
					else
						$(_ele[i]).after("<span class='lisu-error'>" + _tooltip + "</span>")
				} else if(_thisSi.length > 0)
					_thisSi.remove(), $(_ele[i]).removeClass("lisu-error-active");
			}

			return throughVeri;
		};
		//同级的checkbox 选择情况
		this.siblingsChek = function(obj) {
			var chkBox = $(obj).parent().find("input[type='checkbox']"),
				checked = false;
			for(var i = 0; i < chkBox.length; i++) {
				if(chkBox[i].checked && !checked) checked = true;
			}
			return checked;
		};
		//模态框的 tabl的高度 //20是lisu-card的padding
		this.getModelHeight = function(container) {
			var thisTblHeight = (document.documentElement.clientHeight * 0.7 - this.otherHeight(container));
			return thisTblHeight < 300 ? 300 : thisTblHeight;
		}; //模态框的宽度
		this.getModelWidth = function() {
			var layWidth = parseInt((document.documentElement.clientHeight * 0.7) * 1.618),
				layWidth = layWidth < 650 ? "650px" : layWidth > 1000 ? "1000px" : layWidth + "px";
			return layWidth;
		};
		this.setFormValue = function(type, value, ele) {
			if(type == "INPUT" || type == "TEXTAREA") ele.value = value;
			else if(type == "DIV" || type == "SPAN") ele.innerHTML = value;
			else if(type == "IMG") ele.src = value;
		};
		//判断对象
		this.hasThisEle = function(container) {
			var _parent = document.getElementById(container);
			if(_parent === null) {
				console.error('未找到元素');
				return false;
			} else return true;
		}
		//获取对象
		this.getObject = function(container, type) {
			return document.getElementById(container).querySelectorAll(type);
		};
		this.otherHeight = function(container) {
			var $element = document.getElementById(container);
			var _ele = $element.querySelectorAll(".tblOffset"),
				height = 0;
			for(var i = 0; i < _ele.length; i++) {
				height += _ele[i].offsetHeight;
			}
			return height + 20;
		}
	}

	var lisuUtils = new LisuUtils();
	// 最后将插件对象暴露给全局对象
	//兼容CommonJs规范
	if(typeof module !== 'undefined' && module.exports) module.exports = lisuUtils;
	//兼容AMD/CMD规范
	if(typeof define === 'function') define(function() {
		return lisuUtils;
	});
	//注册全局变量，兼容直接使用script标签引入该插件
	global.lisuUtils = lisuUtils;
})(this);

/**
 * readme
 * 
 * 1输入框只能输入数字 
 * lisuUtils.number($("[lisu-type='number']"));
 * 
 * 2 重置  只对添加了 lisu-model 标签的起作用
 * lisuUtils.resetForm("id");
 * 
 * 3：填充数据 
 * @params 
 * id:String
 * data: json
 * readme:只对添加了lisu-model的input div起作用
 * lisuUtils.fillForm("id",data);
 * 
 * 4验证  只对添加了 lisu-re的input div起作用 （只有非空验证）
 * lisuUtils.requireForm("id");
 * */
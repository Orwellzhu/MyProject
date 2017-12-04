/**
 * @Author: jzy
 * @Date: 2017/10/30
 * @Last Modified by: jzy
 * @Last Modified time: 2017/10/30
 * @描述  通过URL hash 值的改变，来实现路由的切换，组件的更新提供 ajax 和 本地存储 两种方式，
 * 通过判断当前工程环境可自主切换组件更新方式，建议在生产环境使用 本地存储
 */
JZY.server.getComponentTemplate = (function($, win, undefined){
	var Obj = function(option){
		this._setParams(option);
	};
	
	Obj.prototype = {
		constructor: Obj,
		version: '1.0.0',
		author: JZY.developer.name,
		install: function(){
			// 获取 URL hash 值
			this.realHash = this.getRealHash() || 'articlePublic';
			
			// 重设侧栏导航的选中样式
			this.resetNavActive();
			
			// 首次加载模版
			this.pullTemplate();
			
			// 事件绑定
			this.bindEvent();
		},
		_setParams: function(option){
			this.$navWrapper  = option.$sidebarWrapper || this.$navWrapper;
			this.$viewWrapper = option.$viewWrapper || this.$viewWrapper;
			this.callback = option.callback || this.callback || null;
			
			this.env = JZY.env;
			this.realHash = 'articlePublic';
			this.xhrObj = null;
			this.state = 'ready';
			
			this.install();
		},
		getRealHash: function(){
			var hash=win.location.hash.slice(1).replace(/\?.+/, '');
			if(hash){
				console.log(hash);
				return hash;
			}
			return  'articlePublic'
		},
		resetNavActive: function(){
			if(this.realHash=="powerFail"){
				this.$navWrapper.find('a').removeClass('layui-this');
			}else{
			this.$navWrapper.find('a[href="#'+ this.realHash +'"]').parent()
			.addClass('layui-this').siblings().removeClass('layui-this');
			}
		},
		pullTemplate: function(){
			this.realHash = this.getRealHash();
			var reqUrlLink = win.templateUrl[this.realHash];
			
			if (typeof reqUrlLink == 'undefined'){
				return;
			}
			
			if (this.state != 'ready'){
				return;
			}
			this.state = 'stop';
			
			// 判断工程环境
			if (this.env == 'production'){
				this.pullTemplateFromCache(this.realHash);
				console.log("reqUrlLink1");
			} else {
				this.pullTemplateByAjax(reqUrlLink);
				console.log("reqUrlLink2");
			}
		},
		pullTemplateByAjax: function(reqUrl, callback){
			var _this = this; 
			this.xhrObj && this.xhrObj.abort();
			this.xhrObj = $.ajax({
				type: 'GET',
				url: reqUrl,
				dataType: 'html',
				cache: false,
				timeout : 4000,
				beforeSend : function(){
					// 切换导航样式
					_this.resetNavActive();
				},
			}).done(function(data){
				console.log("data"+data);
				_this.changeViewPage(data);
				callback && callback(data);
				_this.state = 'ready';
			}).fail(function(err){
				console.log("err"+err);
				throw new Error(err.statusText);
			});
		},
		pullTemplateFromCache: function(mark){
			var templateHtml = this.getCache(mark);
			var _this = this;
			if (templateHtml != null && templateHtml != ''){
				this.changeViewPage(templateHtml);
				this.state = 'ready';
			} else {
				this.pullTemplateByAjax(win.templateUrl[mark], function(data){
					_this.setCache(mark, data);
				});
			}
		},
		getCache: function(name){
			return localStorage.getItem(name);
		},
		setCache: function(name, str){
			localStorage.setItem(name, str);
		},
		removeAllCache: function(){
			localStorage.clear();
		},
		changeViewPage: function(templateHtml){
			var _this = this;
			this.$viewWrapper.fadeOut(300, function(){
				$(this).html(templateHtml).fadeIn(300, function(){
					_this.callback && _this.callback();
				});
			});
		},
		bindEvent: function(){
			var _this = this;
			$(win).off('hashchange.JZY').on('hashchange.JZY', function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				_this.pullTemplate();
			});
		},
		update: function(option){
//			this._setParams(option);
		},
		remove: function(){
			$(win).off('hashchange.JZY');
			for (var i in this){
				this[i] = null;
			}
		}
	};
	
	return Obj;
})(jQuery, this);

JZY.component.infomation = (function($){
	var init = function(){
		var domAppend = new JZY.util.DomAppend({
	      data: {title: '欢迎来到塔米后台管理系统'},
	      templateFunc: doT.template($('#infomation-template-01').html()),
	      $$wrapper: $('.JZY-welcome')
		});
		domAppend.appendIntoWrapper();
	};
	
	// 公开接口
	return {
		install: init
	};
})(jQuery);

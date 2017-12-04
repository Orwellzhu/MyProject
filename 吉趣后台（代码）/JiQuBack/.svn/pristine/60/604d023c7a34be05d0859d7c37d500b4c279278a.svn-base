(function(window, undefined){
	// 定义项目环境
	var env = (function(env){
		if (env == 'development'){ // 当前是开发环境
			
			return 'development';
		} else {
			console.log = console.error = console.warn = function(){};
			
			return 'production';
		}
	})('development'); // production
	// 分配命名空间
	var namespace = function(name, phone){
		var Obj = Obj || {};
		
		Obj.component = {};
		Obj.util = {};
		Obj.server = {};
		Obj.env =  env;
		Obj.developer = {
			name: name,
			tel: phone
		};
		
		return Obj;
	};
	
	window.JZY = namespace('JZY', '110');
	window.ZCC = namespace('朱陈超', '15601779516');
	window.LBJ = namespace('李波键', '15601779516');
	window.LGQ = namespace('刘高强', '15601779516');
	window.KJT = namespace('康锦韬', '15601779516');

})(window);
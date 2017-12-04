ZCC.component.login=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		init:function(option){
			this.$NameInput=option.$NameInput;
			this.$PasswordInput=option.$PasswordInput;
			this.$Button=option.$Button;
			this.bindButtonEvent();
			this.bindFocusEvent();
		},
		bindFocusEvent(){
			var _this=this;
			this.$NameInput.off("focus.zcc").on("focus.zcc",function(ev){
				ev.stopPropagation();
				$("#username-errormy").remove();
			});

			this.$PasswordInput.off("focus.zcc").on("focus.zcc",function(ev){
				ev.stopPropagation();
				$("#password-errormy").remove();
			});
		},
		//绑定按钮事件
		bindButtonEvent:function(){
			var _this=this;


			this.$Button.off("click.zcc").on("click.zcc",function(ev){
				ev.stopPropagation();
				var psd=_this.$PasswordInput.val();
				var nm=_this.$NameInput.val();
				if(!nm){
					_this.$NameInput.parent().append(_this.addErrorStr(1,"用户名输入不能为空"));
					return
				}else if(!psd){
					_this.$PasswordInput.parent().append(_this.addErrorStr(1,"密码输入不能为空"));
					return
				}
				_this.loading();
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/MyUser",
				  "data": {
				  	"filter": {
						"where": {
							"AccountNumber": _this.$NameInput.val(),
							"Password": _this.$PasswordInput.val()
						}
					}
				  },
				  "cache": false,
				  "headers": apiHeader,
				  "type": "GET"
				}).success(function (data, status, header) {
				  console.log(data);
					if (data.length > 0){ // 合法用户
						_this.loading();
						JZY.util.Cookie.addCookie('username', data[0].id);
						window.location.href = 'index.html';
						_this.loaded();
					} else { // 非法用户
						//alert('用户名或密码有误');
						_this.$NameInput.val('').focus();
						_this.$NameInput.parent().append(_this.addErrorStr(0,"用户名或密码有误"));
						_this.$PasswordInput.val('');
						_this.$PasswordInput.parent().append(_this.addErrorStr(1,"用户名或密码有误"));
						_this.loaded();
					}
				}).fail(function (header, status, errorThrown) {})
			})
		},
		addErrorStr:function(id,str){
			if(id==0){
				return '<label id="username-errormy" class="error" for="username">'+str+'</label>';
			}else{
				return '<label id="password-errormy" class="error" for="password">'+str+'</label>';
			}
		},
		// 加载中
		loading:function(){
			this.layerIndex = layer.load(1, {
			  shade: [0.3,'#000'] //0.1透明度的白色背景
			});
		},
		// 加载完毕
		loaded:function(){
			layer.close(this.layerIndex);
		},
	};

	return obj
})(jQuery,this);

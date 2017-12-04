
ZCC.component.ourpageManage=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	}
	
	obj.prototype={
		constructor:obj,
		$Edit:"",//保存编辑器$
		init:function(option){
			this.$Edit=option.$Edit;
			this.$Content=option.$Content;
			this.$ButtonUpdate=option.$ButtonUpdate;
			this.$ButtonOriginal=option.$ButtonOriginal;
			this.bindEvent();
			window.setInterval(this.showEditContent,500,this); //ZCC：必须传this指针，不然this将被改变，函数内无法获得obj指针
			this.requestData();
		},
		//获取编辑器内，内容
		getEditContent:function(){
			var text=this.$Edit.html();
			return text;
		},
		//设置编辑器内容
		setEditContent:function(data){
			var text=this.$Edit.html(data);
			this.clearDOM();
			this.loaded();
		},
		//展示内容
		showEditContent:function(point){
			var _this=point;
			_this.$Content.html( _this.getEditContent() );
		},
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Banner",
			  "cache": false,
			  "headers":apiHeader,
			  "data":{
					"filter": {
	    				"fields": ["Content"],
	    				"where": {"_id": "5989349dadc8b7b91a37ab74"}
	    			}
			  },
			  "type": "GET"
			}).success(function (data, status, header) {
			  console.log(data);
			  _this.setEditContent(data[0].Content);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			})
		},
		//上传数据
		setData:function(){
			this.loading();
			var _this=this;
			_this.addDOM();//添加内容
			var content=_this.getEditContent();//获取内容
			_this.clearDOM();//清楚内容
			//获取内容
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Banner/5989349dadc8b7b91a37ab74",
			  "cache": false,
			  "headers":apiHeader,
			  "data":{
					"Content":content,
	    			"_method":"PUT"
			  },
			  "type": "POST",
			}).success(function (data, status, header) {
			  _this.loaded();
			}).fail(function (header, status, errorThrown) {
			  //fail body
			})
		},
		//清楚多余样式
		clearDOM:function(){
			this.src=$("#ZCC-bg").attr("src");
			$("#ZCC-bg").attr("src","");
			this.header=$("#ZCC-hd").html();
			$("#ZCC-hd").html("");
		},
		//上传数据时，添加回数据
		addDOM:function(){
			$("#ZCC-bg").attr("src",this.src);
			$("#ZCC-hd").html(this.header);
		},

		// 给底部按钮添加事件
		bindEvent:function(){
			var _this=this;
			//还原按钮
			this.$ButtonOriginal.off("click.zcc").on("click.zcc",function(){
				//是否决定还原
				var index=layer.open({
				  title: '吉趣',
				  content: '确定是否还原',
				  btn: ['确定', '取消'],
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  	_this.requestData();
				  },
				  btn2:function(){//第二个按钮的回调函数
				  	console.log("btn2")
				  },
				  cancel: function(){
				  	layer.close(index);	
				  }
				}); 
				
			});
			//更新按钮
			this.$ButtonUpdate.off("click.zcc").on("click.zcc",function(){
				//是否决定更新
				var index=layer.open({
				  title: '吉趣',
				  content: '确定是否更新,更新后将无法还原',
				  btn: ['确定', '取消'],
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  	//更新
				  	_this.setData();
				  },
				  btn2:function(){//第二个按钮的回调函数
				  	console.log("btn2")
				  },
				  cancel: function(){
				  	layer.close(index);	
				  }
				}); 
			})
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
	}

	return obj;
})(jQuery,window)
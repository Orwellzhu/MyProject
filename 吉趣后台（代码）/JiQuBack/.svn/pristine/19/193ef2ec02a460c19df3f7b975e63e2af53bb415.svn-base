ZCC.component.articleManage_Check=(function($,window,undefined){

	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		dataId:"",
		imgID:"",
		artID:"",
		//上传数据
		upStatus:"",
		upMsg:"",
		init:function(option){
			this.$title=option.$title;
			this.$date=option.$date;
			this.$content=option.$content;
			this.$imgbox=option.$imgbox;
			//DOM审核
			this.$ButtonBox=option.$ButtonBox;
			this.$upMsgInput=option.$upMsgInput;
			this.$upStatusInput=option.$upStatusInput;
			//方法
			this.getId();
			this.requestData();
			this.bindButton();
		},
		//selected与status转换
		changetoStatus:function(MSG){
			var upStatus="";
			switch(MSG)
			{
			case "审核失败":
			  upStatus=0;
			  break;
			case "等待审核":
			  upStatus=1;
			  break;
			case "审核通过":
			  upStatus=2;
			  break;
			case "隐藏":
			  upStatus=4;
			  break;
			}
			return upStatus;
		},
		changetoMsg:function(Status){
			var MSG="";
			switch(Status)
			{
			case 0:
			  MSG="审核失败";
			  break;
			case 1:
			  MSG="等待审核";
			  break;
			case 2:
			  MSG="审核通过";
			  break;
			case 4:
			  MSG="隐藏";
			  break;
			}
			return MSG;
		},
		//获取url中的id
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.dataId=dataId;
		},
		//获得审查输入内容
		getMsgData:function(){
			var status=this.$upStatusInput.find("option:selected").text();
			var msg=this.$upMsgInput.val();
			this.upMsg=msg;
			this.upStatus=this.changetoStatus(status);
			if(status&&msg){return true;}else{return false;}
		},
		//删除函数
		deleteData:function(){
			var _this=this;
			this.loading();
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/file/"+_this.imgID,
			  "cache": false,
			  "headers":apiHeader,
			  "data": {
			    "_method": "DELETE"
			  },
			  "type": "POST"
			}).success(function (data, status, header) {
				console.log("DeleteSuccess:"+JSON.stringify(data));
			}).fail(function (header, status, errorThrown) {
				console.log("DeleteFailure:"+JSON.stringify(header));
			})

			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Article/"+_this.artID,
			  "cache": false,
			  "headers":apiHeader,
			  "data": {
			    "_method": "DELETE"
			  },
			  "type": "POST"
			}).success(function (data, status, header) {
				console.log("DeleteSuccess:"+JSON.stringify(data));

				_this.loaded();
				window.history.back(-1);	//返回上级页面
			}).fail(function (header, status, errorThrown) {
				console.log("DeleteFailure:"+JSON.stringify(header));
			})

		},
		//审核函数
		checkData:function(){
			var _this=this;
			if(!this.getMsgData()){
				this.layuiAlert("输入信息不完整");
				return;
			}
			_this.loading();
			$.ajax({
				      "url": "https://d.apicloud.com/mcm/api/Article/"+_this.dataId,
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"Status":this.upStatus,
				    		"StatusMsg":this.upMsg,
				    		"_method":"PUT"
				    	}
				}).done(function (data, status, header) {
			    	_this.loaded();
			    	window.history.back(-1);	//返回上级页面
			    	console.log(data);
				}).fail(function (header, status, errorThrown) {
			});	
		},
		//绑定底部按钮函数
		bindButton:function(){
			var _this=this;
			//递交审核
			this.$ButtonBox.children(".btn-primary").on("click.ZCC",function(){
				var index=layer.open({
				  title: '吉趣',
				  btn: ['递交', '取消'],
				  content: "确认是否递交修改？",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	_this.checkData();			//递交
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){},
				  cancel: function(){}
				});  
			});
			//删除文章
			this.$ButtonBox.children(".btn-danger").on("click.ZCC",function(){
				var index=layer.open({
				  title: '吉趣',
				  btn: ['删除', '取消'],
				  content: "确认是否删除该文章？",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	_this.deleteData();		//递交
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){},
				  cancel: function(){}
				});  
			});
		},

		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Article",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"fields":["Title","Time","Date","Content","ImgUrl","imgId","id","Status","StatusMsg"],
			  		"where":{"id":_this.dataId},
			  		"order": ["Status ASC","createdAt DESC"]
			  	}
			  }
			}).success(function (data, status, header) {
			  console.log(data[0]);
			  _this.artID=data[0].id;
			  _this.imgID=data[0].imgId;
			  _this.strDOM(data[0]);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  alert(JSON.stringify(header));
			});
		},
		//DOM
		strDOM:function(ret){
			this.$title.val(ret.Title);
			this.$date.val(ret.Date+" "+ret.Time);
			this.$content.html(ret.Content);
			this.$imgbox.attr("src",ret.ImgUrl);
			this.$upStatusInput.find("option:selected").text();
			  var STATUS=this.changetoMsg(ret.Status);
			  var $option=this.$upStatusInput.children();
					for(var j=0;j<$option.length;j++){
						if($option[j].label==STATUS){
							$($option[j]).attr("selected","selected");
							break;
						}
					}
			this.$upMsgInput.val(ret.StatusMsg);
			this.loaded();
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
		layuiAlert:function(Content){
			var index=layer.open({
			  title: '吉趣',
			  content: Content,
			  btnAlign: 'c',
			  yes:function(index, layero){
			  	layer.close(index);	
			  },
			  cancel: function(){
			  	layer.close(index);	
			  }
			});  
		},
	};

	return obj;

})(jQuery,this);
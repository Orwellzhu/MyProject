ZCC.component.activityManage_Check=(function($,window,undefined){
	var obj=function(option){
		this.getId();
		this.init(option);
	}

	obj.prototype={
		constructor:obj,
		dataId:"",
		imgID:"",
		init:function(option){
			this.$upTitleInput=option.$upTitleInput;
			this.$upAddressInput=option.$upAddressInput;
			this.$upDateInput=option.$upDateInput;
			this.$upContactwayInput=option.$upContactwayInput;
			this.$upSponsorInput=option.$upSponsorInput;
			this.$upContentBox=option.$upContentBox;
			this.$upImgBox=option.$upImgBox;
			//DOM审核
			this.$ButtonBox=option.$ButtonBox;
			this.$upMsgInput=option.$upMsgInput;
			this.$upStatusInput=option.$upStatusInput;
			//请求
			this.requestData();
			this.bindButton();
		},
		//selected与status转换
		// 0 不展示
		// 1审核通过
		// 2 审核中
		// 3 审核失败
		// 4 草稿

		changetoStatus:function(MSG){
			var upStatus="";
			switch(MSG)
			{
			case "审核失败":
			  upStatus=3;
			  break;
			case "等待审核":
			  upStatus=2;
			  break;
			case "审核通过":
			  upStatus=1;
			  break;
			case "隐藏":
			  upStatus=0;
			  break;
			}
			return upStatus;
		},
		changetoMsg:function(Status){
			var MSG="";
			switch(Status)
			{
			case 0:
			  MSG="隐藏";
			  break;
			case 1:
			  MSG="审核通过";
			  break;
			case 2:
			  MSG="等待审核";
			  break;
			case 3:
			  MSG="审核失败";
			  break;
			}
			return MSG;
		},
		//获取url中的id
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.dataId=dataId;
		},
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Activities",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"fields":["CreaterId","id","Name","createdAt","State","Time","Organizer","Attend","ContactWay","Detail","PicUrl","PicId","Place"],
			  		"where":{"id":_this.dataId},
			  		"order": ["Status ASC","createdAt DESC"]
			  	}
			  }
			}).success(function (data, status, header) {
			  console.log(data[0]);
			  _this.imgID=data[0].PicId;
			  _this.strDOM(data[0]);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  alert(JSON.stringify(header));
			});
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
			  "url": "https://d.apicloud.com/mcm/api/Activities/"+_this.dataId,
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
		//获得审查输入内容
		getMsgData:function(){
			var status=this.$upStatusInput.find("option:selected").text();
			var msg=this.$upMsgInput.val();
			this.upMsg=msg;
			this.upStatus=this.changetoStatus(status);
			if(status&&msg){return true;}else{return false;}
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
				      "url": "https://d.apicloud.com/mcm/api/Activities/"+_this.dataId,
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"State":this.upStatus,
				    		"FailReason":this.upMsg,
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
				  content: "确认是否删除该活动？",
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

		//DOM
		strDOM:function(ret){
			this.$upTitleInput.val(ret.Name);
			this.$upAddressInput.val(ret.Place);
			this.$upDateInput.val(ret.Time);
			this.$upContactwayInput.val(ret.ContactWay);
			this.$upSponsorInput.val(ret.Organizer);
			this.$upContentBox.html(ret.Detail);
			this.$upImgBox.attr("src",ret.PicUrl);
			this.loaded();
		},
		//弹出
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
})(jQuery,this)
ZCC.component.activityPublic_NewActivity=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		activityId:"",
		imgId:"",
		imgUrl:"",
		upTitle:"",
		upAddress:"",
		upDate:"",
		upContactway:"",
		upSponsor:"",
		upDetail:"",
		init:function(option){
			//输入框
			this.$upTitleInput=option.$upTitleInput;
			this.$upAddressInput=option.$upAddressInput;
			this.$upDateInput=option.$upDateInput;
			this.$upContactwayInput=option.$upContactwayInput;
			this.$upSponsorInput=option.$upSponsorInput;
			//内容
			this.$Editor=option.$Editor;
			this.$upImgBox=option.$upImgBox;
			this.$AlertBox=option.$AlertBox;
			//按钮
			this.$ImgButton=option.$ImgButton;
			this.$BottomButton=option.$BottomButton;
			//绑定事件
			this.getId();
			this.requestData();
			this.bindButtonEvent();
		},
		//获取url中的id
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.activityId=dataId;
		},
		//获取数据
		requestData:function(){
			var _this=this;
			if(this.activityId!=undefined){
				//请求数据
				this.loading();
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Activities/"+_this.activityId,
				  "cache": false,
				  "headers":apiHeader,
				  "type": "GET"
				}).success(function (data, status, header) {
					_this.imgId=data.PicId;
					_this.imgUrl=data.PicUrl;
					//显示数据
					_this.upTitle=data.Name;
					_this.upAddress=data.Place;
					_this.upDate=data.Time;
					_this.upContactway=data.ContactWay;
					_this.upSponsor=data.Organizer;
					_this.upDetail=data.Detail;


					_this.$upImgBox.attr("src",data.PicUrl);
					_this.$upTitleInput.val(_this.upTitle);
					_this.$upAddressInput.val(_this.upAddress);
					_this.$upDateInput.val(_this.upDate);
					_this.$upContactwayInput.val(_this.upContactway);
					_this.$upSponsorInput.val(_this.upSponsor);
					_this.$Editor.html(_this.upDetail);
					_this.loaded();
				}).fail(function (header, status, errorThrown) {
				})
			}
		},
		//绑定按钮事件
		bindButtonEvent:function(){
			//绑定上传按钮
			this.uploadPic();
			//绑定日历事件
			this.bindClender();
			//绑定底部按钮事件
			this.bindAbandonButton();
			this.bindPublicButton();
			this.bindSaveDraft();
		},
		//保存数据
		saveData:function(){
			//获取内容
			if(!this.getDOMdata()){this.layuiAlert("您填写的内容不完整");return;}

			var _this=this;
			_this.loading();
			if(!_this.activityId){
				//第一次递交，生成草稿
				$.ajax({
				      "url": "https://d.apicloud.com/mcm/api/Activities",
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"PicId":_this.imgId,
				    		"PicUrl":_this.imgUrl,
				    		"Name":_this.upTitle,
				    		"Place":_this.upAddress,
				    		"Time":_this.upDate,
				    		"ContactWay":_this.upContactway,
				    		"Organizer":_this.upSponsor,
				    		"Detail":_this.upDetail,
				    		"State":4,
				    		"Attend":[],
				    		"CreaterId":window._UserId,
				    	}

				}).done(function (data, status, header) {
			    	_this.loaded();
			    	_this.showUpdataS();
			    	_this.activityId=data.id;
			    	console.log(data);
				}).fail(function (header, status, errorThrown) {
					_this.showUpdataF();
				});
			}else{
				//更新
				$.ajax({
				      "url": "https://d.apicloud.com/mcm/api/Activities/"+_this.activityId,
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"PicId":_this.imgId,
				    		"PicUrl":_this.imgUrl,
				    		"Name":_this.upTitle,
				    		"Place":_this.upAddress,
				    		"Time":_this.upDate,
				    		"ContactWay":_this.upContactway,
				    		"Organizer":_this.upSponsor,
				    		"Detail":_this.upDetail,
				    		"_method":"PUT"

				    	}
				}).done(function (data, status, header) {
			    	_this.loaded();
			    	_this.showUpdataS();
			    	console.log(data);
				}).fail(function (header, status, errorThrown) {
					_this.showUpdataF();
				});
			}
		},
		submitActivity:function(){
			var _this=this;
			if(_this.activityId){
				_this.loading();
				$.ajax({
				      "url": "https://d.apicloud.com/mcm/api/Activities/"+_this.activityId,
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"State":2,
				    		"_method":"PUT"
				    	}
				}).done(function (data, status, header) {
					console.log(22222);
			    	_this.loaded();
			    	//提示递交成功耐心等待
    				var index=layer.open({
					  title: '吉趣',
					  content: "递交成功，请耐心等待",
					  btnAlign: 'c',
					  yes:function(index, layero){
					  	console.log(44444);
					  	layer.close(index);	
					  	window.history.back(-1);	//返回上级页面
					  },
					  cancel: function(){
					  	layer.close(index);	
					  	window.history.back(-1);	//返回上级页面
					  }
					});  
				}).fail(function (header, status, errorThrown) {
					console.log(33333);
					_this.showUpdataF();
				});
			}else{
				this.layuiAlert("请先保存文章");
			}
		},
		//获取内容,并判断是否完整
		getDOMdata:function(){
			this.upTitle=this.$upTitleInput.val();
			this.upAddress=this.$upAddressInput.val();
			this.upDate=this.$upDateInput.val();
			this.upContactway=this.$upContactwayInput.val();
			this.upSponsor=this.$upSponsorInput.val();
			this.upDetail=this.$Editor.html();
			if(this.imgId&&this.upTitle&&this.upAddress&&this.upDate&&this.upContactway&&this.upSponsor&&this.upDetail){
				return true;
			}else{
				return false;
			}
		},
		//绑定保存草稿事件
		bindSaveDraft:function(){
			var _this=this;
			this.$BottomButton.children(".btn-default").on("click.ZCC",function(ev){
				ev.stopPropagation();
				_this.saveData();
				_this.loaded();
			});
		},
		//绑定放弃发布按钮
		bindAbandonButton:function(){
			var _this=this;
			this.$BottomButton.children(".btn-danger").on("click.ZCC",function(ev){
				ev.stopPropagation();
				var index=layer.open({
				  title: '吉趣',
				  btn: ['确定', '取消'],
				  content: "确认是否删除草稿",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	console.log("yes");
				  	//删除图片
				  	_this.deletPic();
				  	_this.deletAct();
				  	//删除文章
				  	window.history.back(-1);	//返回上级页面
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){//第二个按钮的回调函数
				  	console.log("btn2")
				  },
				  cancel: function(){//顶部关闭按钮的回调函数
				  	console.log('右上角关闭回调');
				  }
				});  
			});	
		},
		//绑定发布文章按钮
		bindPublicButton:function(){
			var _this=this;
			var a=this.$BottomButton.children(".btn-primary").on("click.ZCC",function(){
				var index=layer.open({
				  title: '吉趣',
				  btn: ['确定', '取消'],
				  content: "确认是否递交(递交后将无法再修改文章！)",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	_this.submitActivity();		//递交
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){//第二个按钮的回调函数
				  	console.log("btn2")
				  },
				  cancel: function(){//顶部关闭按钮的回调函数
				  	console.log('右上角关闭回调');
				  }
				});  
			});
		},
		//删除文章
		deletAct:function(){
			if(this.activityId){
				var _this=this;
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Activities/"+_this.activityId,
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
				});
			}
		},
		//上传图片
		uploadPic:function(){
			var _this=this;
			var uploader = WebUploader.create({
			    // swf文件路径
			    swf:'components/webuploader/Uploader.swf',
			    // 文件接收服务端。
			    server: 'http://d.apicloud.com/mcm/api/file',
			    // 选择文件的按钮。可选。
			    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			    pick: _this.$ImgButton,
			    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			    resize: false,
			    auto: true,
			    accept: {
			        title: 'Images',
			        extensions: 'gif,jpg,jpeg,bmp,png',
			        mimeTypes: 'image/*'
			    }
			});
			uploader.on("fileQueued", function (file) {
				_this.loading();
			    uploader.option('formData', {
			        filename: file.name,
			        type: file.type
			    });
			    console.log(file);
		        uploader.makeThumb( file, function( error, src ) {
			        if ( error ) {
			        	//上传图片出错
			            _this.uploadImgFail();
			            return;
			        }
			        _this.$upImgBox.attr('src', src);
			    },1000,1000);
			});
			//文件上传成功
			uploader.on('uploadSuccess', function (file, res) {
			    if (res && res.id) {
			        _this.uploadImgSuccess(res.id,res.url);
			    } else if (res &&res.status == 0) {
			        _this.uploadImgFail();
			    } else {
			        _this.uploadImgFail();
			    }
			});
			//文件上传失败
			uploader.on('uploadError', function (file, reason) {
			    alert("失败")
			});
			//上传完成，不管成功失败
			uploader.on('uploadComplete', function (file) {
			    uploader.removeFile(file);
			    _this.loaded();
			});
			uploader.on('uploadBeforeSend', function (block, data, headers) {
				var appId="A6056786505575";
				var appKey="92559A05-497E-5C42-FC7E-91DA5AB3B599";
				var now = Date.now();
				var appKey2 = sha1(appId+"UZ"+appKey+"UZ"+now)+"."+now;
			    headers["X-APICloud-AppKey"] = window.apiHeader['X-APICloud-AppKey'];
			    headers["X-APICloud-AppId"] = window.apiHeader['X-APICloud-AppId'];
			    _this.deletPic();//删除前一张照片
			});
			//上传中
			uploader.on('uploadProgress',function(file,percentage){
			});
		},
		//图片上传失败
		uploadImgFail:function(){
			//清楚img标签里面的图片
			var _this=this;
			_this.$ImgBox.attr('src', "");
			//弹出提示框
			var index=layer.open({
			  title: '吉趣',
			  content: '图片上传失败,请重新上传',
			  btnAlign: 'c',
			  yes:function(index, layero){
			  	layer.close(index);	
			  },
			  cancel: function(){
			  	layer.close(index);	
			  }
			}); 
			_this.imgId=""; 
		},
		//图片上传成功
		uploadImgSuccess:function(id,url){
			this.imgId=id;
			this.imgUrl=url;			
		},
		//删除原有的图片防止数据库冗余
		deletPic:function(){
			//如果之前上传过图片
			if(this.imgId){
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/file/"+this.imgId,
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
			}
		},
		//绑定日历事件
		bindClender:function(){
			var _this=this;
			layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  laydate.render({
			    elem: _this.$upDateInput.selector, //指定元素
			    type: 'datetime'
			  });
			});
		},
		//提示功能函数
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
		//上传成功
		showUpdataS:function(){
			var str='<div class="alert alert-success alert-dismissible fade in" role="alert">'
				  +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
				  +'<strong>Success!</strong> 上传成功'
				+'</div>';
			this.$AlertBox.html(str);
		},
		//上传失败
		showUpdataF:function(){
			var str='<div class="alert alert-danger alert-dismissible fade in" role="alert">'
				  +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
				  +'<strong>Warning!</strong> 上传失败'
				+'</div>';
			this.$AlertBox.html(str);
		},
	};

	return obj;
})(jQuery,this)
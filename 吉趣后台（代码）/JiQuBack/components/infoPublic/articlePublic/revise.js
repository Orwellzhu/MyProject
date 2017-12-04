ZCC.component.articlePublic_Revise=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		//url参数
		dataId:"",
		//id
		imgId:"",
		imgUrl:"",
		articleId:"",
		//其他上传信息
		UpTitle:"",
		UpDate:"",
		UpContent:"",
		init:function(option){
			this.$ArticleTitle=option.$ArticleTitle;
			this.$ArticleDate=option.$ArticleDate;
			this.$Editor=option.$Editor;
			this.$BottomButton=option.$BottomButton;
			this.$ImgButton=option.$ImgButton;
			this.$ImgBox=option.$ImgBox;
			this.$AlertBox=option.$AlertBox;
			this.$ErrorContent=option.$ErrorContent;
			this.getId();
			this.requestData();
			this.bindButtonEvent();
			//方法
		},
		//获取url中的id
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.dataId=dataId;
		},
		requestData:function(){
			var _this=this;
			if(this.dataId!=undefined){
				//请求数据
				this.loading();
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Article/"+_this.dataId,
				  "cache": false,
				  "headers":apiHeader,
				  "type": "GET"
				}).success(function (data, status, header) {
					_this.imgId=data.ImgId;
					_this.imgUrl=data.ImgUrl;
					_this.articleId=data.id;
					//显示数据
					_this.$Editor.html(data.Content);
					_this.$ArticleTitle.val(data.Title);
					_this.$ArticleDate.val(data.Date+" "+data.Time+":00");
					_this.$ImgBox.attr("src",data.ImgUrl);
					_this.$ErrorContent.html(data.StatusMsg);
					_this.loaded();
				}).fail(function (header, status, errorThrown) {
				})
			}
		},
		//上传数据
		updateArticle:function(){
			//获取内容
			this.getDate();
			//判断内容是否完整
			if(!this.UpDate){//如果没有保存日期
				this.layuiAlert("请输入文章发布日期");
				return false;
			}else if(!this.imgId){
				this.layuiAlert("请上传封面图片");
				return false;
			}else if(!this.UpTitle){
				this.layuiAlert("请填写文章标题");
				return false;
			}else if(!this.UpContent){
				this.layuiAlert("请输入文章内容");
				return false;
			}else if(this.UpDate.length!=19){
				this.layuiAlert("请输入正确的日期");
				return false;
			};
			var date=this.UpDate.slice(0, 10); 
			var time=this.UpDate.slice(11,16); 
			//上传
			var _this=this;
			_this.loading();
			if(!_this.articleId){
				//第一次递交，生成草稿
				$.ajax({
				      "url": "https://d.apicloud.com/mcm/api/Article",
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"Title":_this.UpTitle,
				    		"ImgUrl":_this.imgUrl,
				    		"ImgId":_this.imgId,
				    		"Date":date,
				    		"Time":time,
				    		"Content":_this.UpContent,
				    		"Status":3,
				    		"Like":[],
				    		"Read":0,
				    		"Author":window._UserId,
				    	}
				}).done(function (data, status, header) {
			    	_this.loaded();
			    	_this.showUpdataS();
			    	_this.articleId=data.id;
			    	console.log(data);
				}).fail(function (header, status, errorThrown) {
					_this.showUpdataF();
				});
			}else{
				//更新
				$.ajax({
				      "url": "https://d.apicloud.com/mcm/api/Article/"+_this.articleId,
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"Title":_this.UpTitle,
				    		"ImgUrl":_this.imgUrl,
				    		"ImgId":_this.imgId,
				    		"Date":date,
				    		"Time":time,
				    		"Content":_this.UpContent,
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
		//递交文章（修改文章状态为待审核）
		submitArticle:function(){
			var _this=this;
			if(_this.articleId){
				_this.loading();
				$.ajax({
				      "url": "https://d.apicloud.com/mcm/api/Article/"+_this.articleId,
				      "type": "POST",
				      "cache": false,
				      "headers":apiHeader,
				      "data": 
				    	{
				    		"ImgUrl":_this.imgUrl,
				    		"ImgId":_this.imgId,
				    		"Status":1,
				    		"_method":"PUT"
				    	}
				}).done(function (data, status, header) {
			    	_this.loaded();
			    	//提示递交成功耐心等待
    				var index=layer.open({
					  title: '吉趣',
					  content: "递交成功，请耐心等待",
					  btnAlign: 'c',
					  yes:function(index, layero){
					  	layer.close(index);	
					  	window.history.back(-1);	//返回上级页面
					  },
					  cancel: function(){
					  	layer.close(index);	
					  	window.history.back(-1);	//返回上级页面
					  }
					});  
				}).fail(function (header, status, errorThrown) {
					_this.showUpdataF();
				});
			}else{
				this.layuiAlert("请先保存文章");
			}
		},
		//获取输入的标题、日期、编辑器内容
		getDate:function(){
			this.UpTitle=this.$ArticleTitle.val();
			this.UpDate=this.$ArticleDate.val();
			this.UpContent=this.$Editor.html();
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
		//绑定上传图片
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
			        _this.$ImgBox.attr('src', src);
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
			    headers["X-APICloud-AppKey"] = window.apiHeader['X-APICloud-AppKey'];
			    headers["X-APICloud-AppId"] = window.apiHeader['X-APICloud-AppId'];
			    _this.deletPic();//删除前一张照片
			});
			//上传中
			uploader.on('uploadProgress',function(file,percentage){
			});
		},
		//绑定日历事件
		bindClender:function(){
			var _this=this;
			layui.use('laydate', function(){
			  var laydate = layui.laydate;
			  laydate.render({
			    elem: _this.$ArticleDate.selector, //指定元素
			    type: 'datetime'
			  });
			});
		},
		//绑定保存草稿事件
		bindSaveDraft:function(){
			var _this=this;
			this.$BottomButton.children(".btn-default").on("click.ZCC",function(){
				_this.updateArticle();
				_this.loaded();
			});
		},
		//绑定放弃发布按钮
		bindAbandonButton:function(){
			var _this=this;
			this.$BottomButton.children(".btn-danger").on("click.ZCC",function(){
				var index=layer.open({
				  title: '吉趣',
				  btn: ['确定', '取消'],
				  content: "确认是否删除草稿",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	console.log("yes");
				  	//删除图片
				  	_this.deletPic();
				  	_this.deletArt();
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
				  	_this.submitArticle();		//递交
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
		//删除文章
		deletArt:function(){
			if(this.articleId){
				var _this=this;
				$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Article/"+_this.articleId,
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

	}
	return obj;
})(jQuery,this)
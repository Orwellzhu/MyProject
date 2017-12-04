ZCC.component.accountManage_Create=(function($,window,undefined){
	//1.构造函数
	var obj = function(option){
		this.init(option);		
	}						
	//2.方法
	obj.prototype={
		constructor:obj,
		//id
		imgId:"",
		imgUrl:"",
		imgName:"",
		init:function(option){
			console.log(option);
			this.$inputBox=option.$inputBox;
			this.$headImgBox=option.$headImgBox;
			this.$buttonBox=option.$buttonBox;
			this.$ImgBox=option.$ImgBox;
			this.$ImgButton=option.$ImgButton;
			this.bindEvent();
			this.uploadPic();
		},
		bindEvent:function(){
			var _this=this;
			//绑定放弃创建按钮
			_this.$buttonBox.children(".btn-danger").on("click",function(){
				_this.deletPic();
				window.history.back(-1);	//返回上级页面
			})
			//绑定确认创建按钮
			_this.$buttonBox.children(".btn-primary").on("click",function(){
				_this.gerDOMData();
			})

		},
		//获取页面内的数据
		gerDOMData:function(){
			var _this=this;
			var $inputgroup=this.$inputBox.children(".input-group ")

			var Name=$inputgroup.children("#ZCC-name").val();
			var AccountNumber=$inputgroup.children("#ZCC-account").val()
			var Password=$inputgroup.children("#ZCC-password").val()
			var Nickname=$inputgroup.children("#ZCC-nickname").val()
			var Phone=$inputgroup.children("#ZCC-phone").val();
			var QQ=$inputgroup.children("#ZCC-qq").val();
			var Role=$inputgroup.children("#ZCC-power").find("option:selected").text();

			if(!Name || !AccountNumber || !Password ||!Nickname ||!this.imgId){
				_this.layuiAlert("请输入完整的信息");
				return false;
			}else if(!QQ){
				QQ="";
			}else if(!Phone){
				Phone="";
			}

			//存储
			_this.loading();
			$.ajax({
			      "url": "https://d.apicloud.com/mcm/api/MyUser",
			      "type": "POST",
			      "cache": false,
			      "headers":apiHeader,
			      "data": 
			      	{
			      		"Name":Name,
				      	"AccountNumber":AccountNumber,
				      	"Password":Password,
				      	"Nickname":Nickname,
				      	"Phone":Phone,
				      	"QQ":QQ,
				      	"Role":Role,
				      	"HeadImgUrl":_this.imgUrl,
				      	"HeadImgId":_this.imgId,
			      	}
			}).done(function (data, status, header) {
		    	_this.loaded();
		    	//弹出层
				var index=layer.open({
				  title: '吉趣',
				  content: '用户创建成功',
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  	window.history.back(-1);
				  },
				  cancel: function(){
				  	layer.close(index);	
				  	window.history.back(-1);
				  }
				});  
			}).fail(function (header, status, errorThrown) {
			      //fail body
			      console.log(header);
			});

			//头像
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
			        _this.uploadImgSuccess(res.id,res.url,res.name);
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
		//删除原有的图片防止数据库冗余
		deletPic:function(){
			var _this=this;
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
					_this.imgId="";
					_this.imgUrl="";
				}).fail(function (header, status, errorThrown) {
					console.log("DeleteFailure:"+JSON.stringify(header));
				})
			}
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
		uploadImgSuccess:function(id,url,name){
			this.imgId=id;
			this.imgUrl=url;			
			this.imgName=name;
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
		}
	}
	return obj;	
})(jQuery,this)	
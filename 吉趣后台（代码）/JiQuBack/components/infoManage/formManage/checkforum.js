KJT.component.formManage_Check=(function($,window,undefined){

	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		k:0,
		init:function(option){
			//面包屑导航
			this.$ktj_breadcrumb=option.$ktj_breadcrumb;
			//帖子内容
			this.$content=option.$content;
			this.$imgbox=option.$imgbox;
			this.$headimg=option.$headimg;
			this.$name=option.$name;
			this.$date=option.$date;
			this.$KJT_report=option.$KJT_report;
			this.$kjtcontent=option.$kjtcontent;
			this.$aLabel=option.$aLabel;
			// 评论
			this.$no_comment=option.$no_comment;
			this.getId();
			this.requestData();
			this.bind_delete();
			this.bind_deleteContent();
			
		},
		//获取url中的id
		getId:function(){
			var dataId=window.location.href.split('?id=')[1];
			this.dataId=dataId;
			this.$ktj_breadcrumb.attr("href","#formManage_Checkforum?id="+this.dataId);
			console.log(this.dataId);
		},
		//请求帖子内容
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Forum",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"where":{"id":this.dataId},
			  		"fields":["Content","Img","Promulgator","Date","BComment"],
			  		"include":"PromulgatorPointer",
			  		"includefilter":{
			  			"MyUser":   { "fields": [ "Nickname","id","HeadImgUrl"] } ,

			  		}
			  	}
			  }
			}).success(function (data, status, header) {
			  console.log(data[0]);
			  _this.strDOM(data[0]);				 
			  if(data[0].BComment.length==0){_this.$no_comment.html("无评论");return;}
			  _this.request(data[0].BComment);	
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  alert(JSON.stringify(header));
			});
			
		},
		//删除一条评论后刷新评论
		// renovate:function(){
		// 	this.loading();
		// 	var _this=this;
		// 	$.ajax({
		// 	  "url": "https://d.apicloud.com/mcm/api/Forum",
		// 	  "cache": false,
		// 	  "headers": apiHeader,
		// 	  "type": "GET",
		// 	  "data":{
		// 	  	"filter":{
		// 	  		"where":{"id":this.dataId},
		// 	  		"fields":"BComment",
		// 	  	}
		// 	  }
		// 	}).success(function (data, status, header) {
		// 	  console.log(data[0].BComment);
		// 	  if(data[0].BComment.length==0){_this.$no_comment.html("无评论");return;}
		// 	  _this.request(data[0].BComment);//评论	
		// 	}).fail(function (header, status, errorThrown) {
		// 	  //fail body
		// 	  alert(JSON.stringify(header));
		// 	});
			
		// },
		//获取所有评论
		request:function(bComment){
			var _this=this;
			if(bComment.length==0){return false;}
			var bComShift=bComment.shift();
			$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Forum",
				  "cache": false,
				  "headers": apiHeader,
				  "type": "GET",
				  "data":{
				  	"filter":{
				  		"where":{"id":bComShift.id},
				  		"fields":["Content","Img","Promulgator","Date"],
				  		"include":"PromulgatorPointer",
				  		"includefilter":{"MyUser":{
				  			"fields":["Nickname","id","HeadImgUrl"]
				  		}
				  		}
				  	}
				  }
				}).success(function (data, status, header) {
				  console.log(data[0]);
				  var kjtReport=_this.strDOM0(data[0],bComShift.id);
				  _this.k++;
				  _this.requestReport(bComShift.id,kjtReport);
				  _this.request(bComment);
				}).fail(function (header, status, errorThrown) {
				  //fail body
				  alert(JSON.stringify(header));
				});
		},
		
			// if (id.length==0) {this.$no_comment.html("无评论");this.loaded();}
			
		//帖子内容字符串拼接 
		strDOM:function(ret){
			var _this=this;
			this.$headimg.attr("src",ret.Promulgator.HeadImgUrl);
			this.$name.html(ret.Promulgator.Nickname);
			this.$date.html(ret.Date);
			this.$content.html(ret.Content);
			this.$aLabel.attr("href","#formManage_Checkreport?id="+this.dataId+"");
			var str="";
			for(var i=0;i<ret.Img.length;i++)
			{
				str+=this.strlinkImg(ret.Img[i].url);
			}
			this.$imgbox.html(str);
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Report/count",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"where":{"ID":this.dataId},
			  		
			  	}
			  }
			}).success(function (data, status, header) {
			  _this.$KJT_report.text(""+data.count+"人举报");
			  _this.loaded();
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  
			});
		},
		//得到每一条评论html的字符串拼接，返回【举报人数】节点
		strDOM0:function(ret,kjtId){
			var strBox=new Array();
			var str="";
			if(ret.Img.length>0){
				for(var i=0;i<ret.Img.length;i++)
				{
					str+=this.strlinkImg(ret.Img[i].url);
				}
			}
			console.log(str);
			strBox=[
				'<div class="comment'+this.k+'">',
					'<div class="KJT_head">',
						'<div class="KJT_headL">',
							'<img class="headimg0" src='+ret.Promulgator.HeadImgUrl+'>',
							'<div class="name_date">',	
								'<div class="name0">'+ret.Promulgator.Nickname+'</div>',
								'<div class="date0">'+ret.Date+'</div>',
							'</div>',
						'</div>',
						'<div class="KJT_headR">',
							'<button type="button" class="btn btn-default kjtbtn1" kjtId='+kjtId+' kValue='+this.k+'>删除</button>',
							'<a href="#formManage_Checkreport?id='+kjtId+'?id='+this.dataId+'"><button type="button" class="btn btn-default KJT_report'+this.k+'" kjtId='+kjtId+'></button></a>',
						'</div>',
					'</div>',
					'<div class="ZCC-content ZCC-con1">'+ret.Content+'</div>',
					'<div id="imgbox0">'+str+'</div>',
					'<div class="interval"></div>',
				'</div>',
			  ];
			  this.$no_comment.append(strBox.join(" "));
			  return $(".KJT_report"+this.k+"");

		},
		//图片box拼接
		strlinkImg:function(url){
			return '<div style="background-image:url('+url+');"></div>';

		},
		//请求举报条数，给【举报人数】赋值
		requestReport:function(id,kjtReport){
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Report/count",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"where":{"ID":id},
			  		
			  	}
			  }
			}).success(function (data, status, header) {
			  
			  console.log(2);
			  kjtReport.text(""+data.count+"人举报");
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  
			});
			
		},
		//绑定删除评论事件
		bind_delete:function(){
			var _this=this;
			this.$no_comment.off('click.kjt').on('click.kjt','.KJT_head > .KJT_headR > .kjtbtn1',function(ev){
				ev.stopPropagation();
				var $this=$(this);
				var index=layer.open({
				  title: '吉趣',
				  content: '确认删除此条评论吗？',
				  btn: ['确定', '取消'],
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  	_this.delBComment($this.attr('kjtId'),$this.attr('kValue'));
				  },
				  btn2:function(){//第二个按钮的回调函数
				  	console.log("btn2")
				  },
				  cancel: function(){
				  	layer.close(index);	
				  }
				}); 
			});
			

		},
		//数据库中删除评论
		delBComment:function(kjtId,kValue){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Forum/"+kjtId,
			  "cache": false,
			  "headers": apiHeader,
			  "type": "POST",
			  "data":{
			  	"_method":"DELETE"
			  }
			}).success(function (data, status, header) {
				_this.delBCommentId(kjtId,kValue);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			});	
		},
		//删除BComment中一个id值
		delBCommentId:function(kjtId,kValue){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Forum/",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"where":{"id":this.dataId},
			  		"fields":"BComment",
			  	}
			  }
			}).success(function (data, status, header) {
				console.log(data[0]);
				var kjtArray=new Array();
				kjtArray=data[0].BComment;
				console.log(kjtArray);
				for(var i=0;i<kjtArray.length;i++){
					if(kjtArray[i].id==kjtId){
						console.log(i);
						kjtArray.splice(i,1);
						console.log(kjtArray);
					}
				}
				$.ajax({
				"url": "https://d.apicloud.com/mcm/api/Forum/"+_this.dataId,
  				"cache": false,
  				"headers":apiHeader,
				"data": {
				    "BComment": JSON.stringify(kjtArray),
				    "_method": "PUT"
				},
				"type": "POST"
			}).success(function (data, status, header) {
					console.log(JSON.stringify(kjtArray));
					console.log(kValue);
				    // _this.$no_comment.html("");
					// _this.renovate(); 
				  $(".comment"+kValue).css("display","none");
				  // $("comment"+kValue+"").html("");
				  var index=layer.open({
				  title: '吉趣',
				  content: '删除评论成功！',
				  btn: ['确定'],
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  },
				  cancel: function(){
				  	layer.close(index);	
				  }
				}); 
				  _this.loaded();
				}).fail(function (header, status, errorThrown) {
				  //fail body
				});	
			}).fail(function (header, status, errorThrown) {
				  //fail body
			});	
		},
		//绑定删除帖子事件
		bind_deleteContent:function(){
			var _this=this;
			this.$kjtcontent.off('click.kjt1').on('click.kjt1','.KJT_head > .KJT_headR > .kjtbtn2',function(ev){
				ev.stopPropagation();

				// var $this=$(this);
				// var isDelete=confirm("确认删除这条帖子(包括所有评论)吗？");
				// if(isDelete){
				// 	_this.delcontent();
				// }
				var index=layer.open({
				  title: '吉趣',
				  content: '确认删除这条帖子(包括所有评论)吗？',
				  btn: ['确定', '取消'],
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  	_this.delcontent();
				  },
				  btn2:function(){//第二个按钮的回调函数
				  	console.log("btn2")
				  },
				  cancel: function(){
				  	layer.close(index);	
				  }
				}); 
			});
		},
		//数据库中删除帖子，先查询BComment
		delcontent:function(){
			var _this=this;
			this.loading();
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Forum",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"where":{"id":this.dataId},
			  		"fields":"BComment"
			  	}
			  }
			}).success(function (data, status, header) {
				console.log(data[0]);
				_this.delCtt(data[0].BComment);
				console.log(0);
				// window.history.back(-1);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			});	
		},
		//删除数据库中帖子
		delCtt:function(bComment){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Forum/"+this.dataId,
			  "cache": false,
			  "headers": apiHeader,
			  "type": "POST",
			  "data":{
			  	"_method":"DELETE"
			  }
			}).success(function (data, status, header) {
				console.log("shanchutiezi");
				_this.delCmtAry(bComment);
				
			}).fail(function (header, status, errorThrown) {
			  //fail body
			});	
		},
		//删除数据库中帖子的每一条评论
		delCmtAry:function(bComment){
			var _this=this;
			if(bComment.length==0){
				console.log("删除成功！");
				var index=layer.open({
				  title: '吉趣',
				  content: '删除帖子成功！',
				  btn: ['确定'],
				  btnAlign: 'c',
				  yes:function(index, layero){
				  	layer.close(index);	
				  	_this.loaded();
				  	window.location.href="#formManage";
				  },
				  cancel: function(){
				  	layer.close(index);	
				  }
				}); 
				this.loaded(); 
				return false;
			}
			var bComShift=bComment.shift();
			$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Forum/"+bComShift.id,
				  "cache": false,
				  "headers": apiHeader,
				  "type": "POST",
				  "data":{
				  	"_method":"DELETE"
				  }
				}).success(function (data, status, header) {
					console.log(bComment);
				  _this.delCmtAry(bComment);
				}).fail(function (header, status, errorThrown) {
				  //fail body
				  alert(JSON.stringify(header));
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
	};

	return obj;

})(jQuery,this);
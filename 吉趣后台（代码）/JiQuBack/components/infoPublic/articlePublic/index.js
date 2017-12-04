ZCC.component.articlePublic=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		userid:"",
		numbSkip:0,
		numbLimit:10,
		//构造函数
		init:function(option){
			this.loading();
			this.userid=window._UserId;//登陆写完后，替换成登陆用户的id
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.$PagerWrapper=option.$PagerWrapper;
			this.datePrototype();//给Date对象挂载新方法
			this.requestNumb();
			this.requestData();
			this.bindDelete();
		},
		//初始化Pager
		initPager:function(numb){
			var _this=this;
			//pager已经在index.html引过直接直接复制就行，参数自己改一下by朱陈超
			ZCC.component.Page({
					num:numb,				//页码数
					startnum:1,				//指定页码
					elem:this.$PagerWrapper,
					callback:function(n){	//回调函数
						console.log(n);
						_this.numbSkip=_this.numbLimit*(n-1);
						_this.requestData();
					}
			});
		},
		//请求数据条数
		requestNumb:function(){
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Article/count",
			  "cache": false,
			  "headers": apiHeader,
			  "data":{
			  	"filter":{
			  		"where":{Author:_this.userid},
			  	}
			  },
			  "type": "GET"
			}).success(function (data, status, header) {
				var page=Math.ceil(data.count/(_this.numbLimit));
				_this.initPager(page);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			});
		},
		//请求数据
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
			  		"fields":["Author","id","Title","createdAt","Status","Time","Date","Read","ImgId"],
			  		"where":{Author:_this.userid},
			  		"skip":_this.numbSkip,
			  		"limit":_this.numbLimit,
			  		"order": ["Status ASC","createdAt DESC"]
			  	}
			  }
			}).success(function (data, status, header) {
			  _this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  alert(JSON.stringify(header));
			});
		},
		//删除文章数据(连带图片)
		delArticle:function(artid,imgid){
			var _this=this;
			$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Article/"+artid,
				  "cache": false,
				  "headers":apiHeader,
				  "data": {
				    "_method": "DELETE"
				  },
				  "type": "POST"
				}).success(function (data, status, header) {
					_this.loaded();
					console.log("DeleteSuccess:"+JSON.stringify(data));
					_this.requestData();
				}).fail(function (header, status, errorThrown) {
					console.log("DeleteFailure:"+JSON.stringify(header));
			});

			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/file/"+imgid,
			  "cache": false,
			  "headers":apiHeader,
			  "data": {
			    "_method": "DELETE"
			  },
			  "type": "POST"
			}).success(function (data, status, header) {
				console.log("DeleteSuccessPic:"+JSON.stringify(data));
			}).fail(function (header, status, errorThrown) {
				console.log("DeleteFailurePic:"+JSON.stringify(header));
			});
		},
		//绑定删除按钮
		bindDelete:function(){
			var _this=this;//obj指针
			this.$TableContentWrapper.off('click.zcc').on('click.zcc', 'tr > th > .btn-danger', function(ev){
				ev.stopPropagation();
				var $this = $(this);//被点击的元素
				var index=layer.open({
				  title: '吉趣',
				  btn: ['确定', '取消'],
				  content: "确认是否删除文章（一旦删除将无法回复）",
				  btnAlign: 'c',
				  yes:function(){//第一个按钮的回调函数
				  	console.log("yes");
				  	//删除文章
				  	_this.loading();	
				  	_this.delArticle($this.attr('data-id'),$this.attr('img-id'));
				  	layer.close(index);			//关闭指定弹窗
				  },
				  btn2:function(){},
				  cancel: function(){}
				});  

			});
		},
		strDOM:function(retArray){
			var str="";
			for(var i=0;i<retArray.length;i++){
				str+=this.strLink(retArray[i],i+1);
			}
			this.$TableContentWrapper.html(str);
			this.loaded();
		},
		strLink:function(ret,i){
			var publicDate="-";
			var createDate = new Date(ret.createdAt).Format("yyyy/MM/dd");
			var status="";
			var button="";
			if(!ret.Read){ret.Read=0}
				//articlePublic_Check
			if (ret.Status==0) {//审核失败
				button='<a href="#articlePublic_Revise?id='+ret.id+'"><button type="button" class="btn btn-primary btn-sm">编辑</button> </a>'               	
	                	+'<button type="button" class="btn btn-danger btn-sm" data-id="'+ ret.id +'" img-id="'+ret.ImgId+'">删除</button> ';
	            status='<button type="button" class="btn btn-danger btn-xs">审核失败</button>';
			}else if(ret.Status==1){//等待审核
				button='<a href="#articlePublic_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">查看</button></a> ';
				status='<button type="button" class="btn btn-warning btn-xs">审核中</button>';
			}else if(ret.Status==2){//活跃
				publicDate=ret.Date;
				button='<a href="#articlePublic_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">查看</button></a> ';
				status='<button type="button" class="btn btn-success btn-xs">已发布</button>';
			}else if(ret.Status==3){//草稿
				button='<a href="#articlePublic_Newarticle?id='+ret.id+'"><button type="button" class="btn btn-primary btn-sm">编辑</button> </a>'  
				+'<button type="button" class="btn btn-danger btn-sm" data-id="'+ ret.id +'"   img-id="'+ret.ImgId+'">删除</button> ';
	            status='<button type="button" class="btn btn-default btn-xs">草稿</button>';
	            
			}else if(ret.Status==4){//过期
				publicDate=ret.Date;
				button='<a href="#articlePublic_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">查看</button></a> ';
	            status='<button type="button" class="btn btn-info btn-xs">不展示</button>';

			}
			var strArray=[
				'<tr>'
	                ,'<th>'+i+'</th>'
	                ,'<th>'+ret.Title+'</th>'
	                ,'<th>'+publicDate+'</th>'
	                ,'<th>'+createDate+'</th>'
	                ,'<th>'
	                	,status
	                ,'</th>'
	                ,'<th>'+ret.Read+'</th>'
	                ,'<th>'		           
	                	,button
	                ,'</th>'
	            ,'</tr>'
			]
			return strArray.join("");
		},
		//其他方法1：将createAt转换成string
		datePrototype:function(){
			Date.prototype.Format = function (fmt) { //author: meizz 
			    var o = {
			        "M+": this.getMonth() + 1, //月份 
			        "d+": this.getDate(), //日 
			        "h+": this.getHours(), //小时 
			        "m+": this.getMinutes(), //分 
			        "s+": this.getSeconds(), //秒 
			        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			        "S": this.getMilliseconds() //毫秒 
			    };
			    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			    for (var k in o)
			    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			    return fmt;
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
	}

	return obj;

})(jQuery,this)
LGQ.component.articleManage=(function($,window,undefined){
	//构造函数
	var obj=function(option){
		this.loading();
		this.init(option);
	};
	//属性
	obj.prototype={
		constructor:obj,
		//基本属性
		numbSkip:0,
		numbLimit:10,
		textsearch:"",//搜索关键词
		//方法
		init:function(option){
			this.loading();			
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.$PagerWrapper=option.$PagerWrapper;
			this.$SearchBox=option.$SearchBox;
			this.datePrototype();
			this.requestData();
			this.requestNumb();
			this.bindDelete();
			this.bindsearch();
		},
		//页面初始化
		initPager:function(numb){
			var _this=this;
			ZCC.component.Page({
				num:numb,				//页码数
				startnum:1,				//指定页码
				elem:_this.$PagerWrapper,
				callback:function(n){	//回调函数
						console.log(n);
						_this.numbSkip=_this.numbLimit*(n-1);
						//判断是否是搜索
						if(!_this.ifsearch){
							_this.requestData();
						}else{
							_this.requestSearchDaTa(_this.textsearch);
						}
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
			  "type": "GET"
			}).success(function (data, status, header) {
				var numb=Math.ceil((data.count)/_this.numbLimit);
				_this.initPager(numb);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			})
		},
		//请求数据
		requestData:function(){
			this.loading();
			var _this=this;
			$.ajax({
			  "url": "https://d.apicloud.com/mcm/api/Article",     
			  "cache":false,
			  "headers": apiHeader,
			  "data":{
			  		"filter": {
					    "skip": _this.numbSkip,
				    	"limit": _this.numbLimit,
				    	"where":{"State":{"ne":"3"}},
				    	"include": "AuthorPointer",
				    	"fields":["Title","Status", "Read","Date","Time","Author","id"],
				    	"includefilter": {
                    		"MyUser":   { "fields": [ "Nickname", "id"] } ,
               			},
			  		"order": ["Status ASC","createdAt DESC"]
					},
				},
			  "type":"GET"
			}).success(function (data, status, header) {
			  console.log(data);
			  _this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
			});
		},
		//请求搜索数据
		requestSearchDaTa:function(text){
			this.loading();
			var _this=this;
			$.ajax({
				"url": "https://d.apicloud.com/mcm/api/Article",
				"data":{
			  		"filter": {
							    "skip": _this.numbSkip,
				    			"limit": _this.numbLimit,
						    	"limit":2000,
				    			"include": "AuthorPointer",
				    			"includefilter": {
		                    		"MyUser":   { "fields": [ "Nickname", "id"] } ,
		               			},
						    	"fields":["Title","Status", "Read","Date","Time","Author","id"],
						    	"where":{"State":{"ne":"3"},"or":[{"Title": {"like": _this.textsearch+"+"}}]},
						    	"order": ["Status ASC","updatedAt DESC"],
					}
				},
				"cache": false,
				"headers": apiHeader,
				"type": "GET"
			}).success(function (data, status, header) {
				_this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
				console.log(JSON.stringify(header));
			});

		},
		//绑定搜索功能
		bindsearch:function(){
			var _this=this;
			this.$SearchBox.off('click.xdd').on('click.xdd', 'span > #ZCC-search-button', function(ev){
				ev.stopPropagation();
				//获取输入框内容
				var textarea=_this.$SearchBox.children("#ZCC-search-input");
				_this.loading();
				_this.textsearch=textarea.val();
				if(_this.textsearch){
					var text=_this.textsearch;
					_this.ifsearch=true;//进入查询状态
					_this.numbSkip=0;
					//查询搜索条数；重置pager
					$.ajax({
						"url": "https://d.apicloud.com/mcm/api/Article",
						"data":{
					  		"filter": {
							    "skip": _this.numbSkip,
						    	"limit":2000,
				    			"include": "AuthorPointer",
				    			"includefilter": {
		                    		"MyUser":   { "fields": [ "Nickname", "id"] } ,
		               			},
						    	"fields":["Title","Status", "Read","Author","id"],
						    	"where":{"State":{"ne":"3"},"or":[{"Title": {"like": text+"+"}}]},
						    	"order": ["Status ASC","Date DESC"],
							}
						},
						"cache": false,
						"headers": apiHeader,
						"type": "GET"
					}).success(function (data, status, header) {
						var page=Math.ceil(data.length/_this.numbLimit);
						_this.initPager(page);
					}).fail(function (header, status, errorThrown) {
						console.log(JSON.stringify(header));
					});
					_this.requestSearchDaTa(_this.textsearch);
				}else{
					//还原
					_this.ifsearch=false;
					_this.numbSkip=0;
					_this.requestNumb();//请求数据条数
					_this.requestData();//请求表格数据
				}
				
			});
		},
		//字符串拼接
		strLine:function(ret,i){
			var strArray=[];
			var state=ret.Status;
			var status="";
			var button="";
			if(!ret.Read){ret.Read=0}
			if(state==0){
				status='<button type="button" class="btn btn-danger btn-xs">审核失败</button> ';
				button='<a href="#articleManage_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">审查</button></a> '
				+'<button type="button" class="btn btn-danger btn-sm" data-id="'+ ret.id +'" img-id="'+ret.ImgId+'">删除</button> ';
			}else if(state==1){
				status='<button type="button" class="btn btn-warning btn-xs">等待审核</button> ';
				button='<a href="#articleManage_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">审查</button> </a>'
				+'<button type="button" class="btn btn-danger btn-sm" data-id="'+ ret.id +'" img-id="'+ret.ImgId+'">删除</button> ';
			}
			else if(state==2){
				status='<button type="button" class="btn btn-success btn-xs">已发布</button> ';
				button='<a href="#articleManage_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">审查</button> </a>'
				+'<button type="button" class="btn btn-danger btn-sm" data-id="'+ ret.id +'" img-id="'+ret.ImgId+'">删除</button> ';
			}
			else if(state==3){
				status='<button type="button" class="btn btn-btn-default btn-xs">尚未递交</button> ';
				button='<a href="#articleManage_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">审查</button> </a>'
				+'<button type="button" class="btn btn-danger btn-sm" data-id="'+ ret.id +'" img-id="'+ret.ImgId+'">删除</button> ';
			}else if(state==4){
				status='<button type="button" class="btn btn-info btn-xs">不展示</button> ';
				button='<a href="#articleManage_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">审查</button> </a>'
				+'<button type="button" class="btn btn-danger btn-sm" data-id="'+ ret.id +'" img-id="'+ret.ImgId+'">删除</button> ';
			}
			strArray=['<tr>'
		                ,'<th>'+i+'</th>'
		                ,'<th>'+ret.Title+'</th>'
		                ,'<th>'+ret.Author.Nickname+'</th>'
		                ,'<th>'+status+'</th>'
		                ,'<th>'+ret.Read+'</th>'
		                ,'<th>'+ret.Date+" "+ret.Time+'</th>'
		                ,'<th>'			                	
		                	,button
		                ,'</th>'
		            ,'</tr>'];
		    return strArray.join("");
		},
		//DOM操作
		strDOM:function(retArray){
			var str="";
			for(var i=0;i<retArray.length;i++){
				str+=this.strLine(retArray[i],i+1);
			}
			this.$TableContentWrapper.html(str);
			this.loaded();
			return true;
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
					if(!_this.ifsearch){
						_this.requestData();
					}else{
						_this.requestSearchDaTa(_this.textsearch);
					}
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
		}
	}

	return obj;
})(jQuery,this)
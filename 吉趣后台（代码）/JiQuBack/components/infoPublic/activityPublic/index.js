ZCC.component.activityPublic=(function($,window,undefined){
	var obj=function(option){
		this.init(option);
		this.requestData();
	};

	obj.prototype={
		constructor:obj,
		userid:window._UserId,
		init:function(option){
			this.$TableContentWrapper=option.$TableContentWrapper;
			this.datePrototype();
			this.bindDelete();
		},
		//请求数据
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
			  		"fields":["CreaterId","id","Name","createdAt","State","Time","Organizer","Attend","PicId"],
			  		"where":{CreaterId:_this.userid},
			  		"limit":2000,
			  		"order": ["State DESC","createdAt DESC"]
			  	}
			  }
			}).success(function (data, status, header) {
			  _this.strDOM(data);
			}).fail(function (header, status, errorThrown) {
			  //fail body
			  alert(JSON.stringify(header));
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
			var createDate = new Date(ret.createdAt).Format("yyyy-MM-dd");
			var state=ret.State;
			var button="";
			var status="";
			var attendButton="";
			if(state==0){
				status='<button type="button" class="btn btn-info btn-xs">不展示</button> ';
				button='<a href="#activityPublic_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">查看</button> </a>';
				attendButton='<a href="#activityPublic_Entered?id='+ret.id+'">  <button type="button" class="btn btn-default btn-xs">查看报名人('+ret.Attend.length+')</button> </a>';
			}else if(state==1){
				status='<button type="button" class="btn btn-success btn-xs">已发布</button> ';
				button='<a href="#activityPublic_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">查看</button> </a>';
				attendButton='<a href="#activityPublic_Entered?id='+ret.id+'"> <button type="button" class="btn btn-default btn-xs">查看报名人('+ret.Attend.length+')</button> </a>';
			}else if(state==2){
				status='<button type="button" class="btn btn-warning btn-xs">审核中</button> ';
				button='<a href="#activityPublic_Check?id='+ret.id+'"><button type="button" class="btn btn-default btn-sm">查看</button> </a>'
		                +'<button type="button" class="btn btn-danger btn-sm"  data-id="'+ ret.id +'" img-id="'+ret.PicId+'">删除</button> ';
			}else if(state==3){
				status='<button type="button" class="btn btn-danger btn-xs">审核失败</button> ';
				button='<a href="#activityPublic_Revise?id='+ret.id+'"><button type="button" class="btn btn-primary btn-sm">编辑</button> </a>'  
		                +'<button type="button" class="btn btn-danger btn-sm"  data-id="'+ ret.id +'" img-id="'+ret.PicId+'">删除</button> ';
			}else if(state==4){
				status='<button type="button" class="btn btn-default btn-xs">草稿</button>';
				button='<a href="#activityPublic_Newactivities?id='+ret.id+'"><button type="button" class="btn btn-primary btn-sm">编辑</button> </a>'
						+'<button type="button" class="btn btn-danger btn-sm"  data-id="'+ ret.id +'" img-id="'+ret.PicId+'">删除</button> ';
			}
			var strArray=[
				'<tr>'
	                ,'<th>'+i+'</th>'
	                ,'<th>'+ret.Name+'</th>'
	                ,'<th>'+ret.Organizer+'</th>'
	                ,'<th>'+createDate+'</th>'
	                ,'<th>'+ret.Time+'</th>'
	                ,'<th>'
	                	,status
	                ,'</th>'
	                ,'<th>'+attendButton+'</th>'
	                ,'<th>'		           
	                	,button
	                ,'</th>'
	            ,'</tr>'
			]
			return strArray.join("");
		},
		//删除文章数据(连带图片)
		delArticle:function(artid,imgid){
			var _this=this;
			$.ajax({
				  "url": "https://d.apicloud.com/mcm/api/Activities/"+artid,
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
		},
	}

	return obj;
})(jQuery,this)
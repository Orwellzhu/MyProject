ZCC.component.articlePublic_Check=(function($,window,undefined){

	var obj=function(option){
		this.init(option);
	};

	obj.prototype={
		constructor:obj,
		init:function(option){
			this.$title=option.$title;
			this.$date=option.$date;
			this.$content=option.$content;
			this.$imgbox=option.$imgbox;
			this.getId();
			this.requestData();
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
			  "url": "https://d.apicloud.com/mcm/api/Article",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"fields":["Title","Time","Date","Content","ImgUrl"],
			  		"where":{"id":_this.dataId},
			  		"order": ["Status ASC","createdAt DESC"]
			  	}
			  }
			}).success(function (data, status, header) {
			  console.log(data[0]);
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
	};

	return obj;

})(jQuery,this);
ZCC.component.activityPublic_Check=(function($,window,undefined){
	var obj=function(option){
		this.getId();
		this.init(option);
	}

	obj.prototype={
		constructor:obj,
		init:function(option){
			this.$upTitleInput=option.$upTitleInput;
			this.$upAddressInput=option.$upAddressInput;
			this.$upDateInput=option.$upDateInput;
			this.$upContactwayInput=option.$upContactwayInput;
			this.$upSponsorInput=option.$upSponsorInput;
			this.$upContentBox=option.$upContentBox;
			this.$upImgBox=option.$upImgBox;
			//请求
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
			  "url": "https://d.apicloud.com/mcm/api/Activities",
			  "cache": false,
			  "headers": apiHeader,
			  "type": "GET",
			  "data":{
			  	"filter":{
			  		"fields":["CreaterId","id","Name","createdAt","State","Time","Organizer","Attend","ContactWay","Detail","PicUrl","Place"],
			  		"where":{"id":_this.dataId},
			  		"order": ["Status ASC","createdAt DESC"]
			  	}
			  }
			}).success(function (data, status, header) {
			  console.log(data[0]);
			  _this.strDOM(data[0]);
			}).fail(function (header, status, errorThrown) {
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
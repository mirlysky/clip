function cropper(obj,option){
	var _ = {
		data:{
			width:option&&option.width||40,
			parent:{
				obj:obj,
				width:obj.width(),
				height:obj.height()},
			min:{
				width: option&&option.min&&option.min.width||option&&option.width||40,
				height: option&&option.min&&option.min.height||option&&option.width||40},
			borderPos:{
				top: 0,
				left: 0,
				bottom: 0,
				right: 0},
			opObj:{
				left   : 'right',
				right  : 'left',
				top    : 'bottom',
				bottom : 'top'},
			//暂存鼠标位置
			mpos:{
				x0:0,
				y0:0,
				x1:0,
				y1:0},
			curbd:'',
			init: function(){
				const w = _.data.parent.obj.width();
				const h = _.data.parent.obj.height();
				_.data.borderPos = {
					top: 0,
					left: 0,
					bottom: 0,
					right: 0}
				_.data.parent.width = w;
				_.data.parent.height = h;}
		},
		ui:{
			insertBorder: function(){
				const w = _.data.width/2;
				const borderHTML = `<div class='_lt_clip_preview_area' style='left:`+_.data.borderPos.left+`px;top:`+_.data.borderPos.top+`px;right:`+_.data.borderPos.right+`px;bottom:`+_.data.borderPos.bottom+`px;'></div>
									<div class='_lt_clip_left _lt_clip_border vertical'  style='width:`+_.data.width+`px;left:`+(_.data.borderPos.left-w)+`px' data-bd='left'></div>
									<div class='_lt_clip_top _lt_clip_border horizonal' style='height:`+_.data.width+`px;top:`+(_.data.borderPos.top-w)+`px' data-bd='top'></div>
									<div class='_lt_clip_right _lt_clip_border vertical'  style='width:`+_.data.width+`px;right:`+(_.data.borderPos.right-w)+`px' data-bd='right'></div>
									<div class='_lt_clip_bottom _lt_clip_border horizonal' style='height:`+_.data.width+`px;bottom:`+(_.data.borderPos.bottom-w)+`px' data-bd='bottom'></div>`;
				_.data.parent.obj.append(borderHTML);},
			bindEvent: function(){
				_.data.parent.obj.on('mousedown','._lt_clip_border',function(e){
					_.data.curbd = $(e.target).data('bd');
					_.logic.setMousePos(e.offsetX,e.offsetY,'start');
					$(this).get(0).addEventListener('mousemove',_.logic.borderMove,false);})
				.on('mouseup mouseout','._lt_clip_border',function(e){
					_.logic.initMousePos();
					$(this).get(0).removeEventListener('mousemove',_.logic.borderMove,false);})
				.on('dragstart',function(e){
					return false;
				});},
			render: function(border){
				border.css(_.data.curbd,(_.data.borderPos[_.data.curbd]-_.data.width/2)+'px');
				_.data.parent.obj.find('._lt_clip_preview_area').css({'left':_.data.borderPos.left+'px','top':_.data.borderPos.top+'px','right':_.data.borderPos.right+'px','bottom':_.data.borderPos.bottom+'px'});}
		},
		logic:{
			initMousePos: function(){
				_.data.mpos = {x0:0,y0:0,x1:0,y1:0}},
			setMousePos: function(x,y,flag){
				if(flag==='start'){
					_.data.mpos.x0 = x;
					_.data.mpos.y0 = y;					
				}else{
					_.data.mpos.x1 = x;
					_.data.mpos.y1 = y;
				}},
			updateBorderPos: function(bd){
				const type = bd==='top'||bd==='bottom'?'height':'width';
				const mouse_move_distance = {
					left   : _.data.mpos.x1 - _.data.mpos.x0,
					top    : _.data.mpos.y1 - _.data.mpos.y0,
					right  : _.data.mpos.x0 - _.data.mpos.x1,
					bottom : _.data.mpos.y0 - _.data.mpos.y1}
				let tmp = _.logic.isBorderPosValid(_.data.parent[type],_.data.borderPos[bd]+mouse_move_distance[bd],bd,type);
				_.data.borderPos[bd] = tmp;},
			//检查边框是否在容器中
			isBorderPosValid: function(max,val,bd,type){
				if(val<=0){ return 0;}
				else if(val>max){ return max;}
				else { return _.logic.isBorderMinValid(val,_.data.borderPos[_.data.opObj[bd]],_.data.parent[type],_.data.min[type]); }},
			isBorderMinValid: function(bdLength,opLength,total,min){
				const smaller_than_min = !!(total-bdLength-opLength<=min);
				if(smaller_than_min){
					return total-opLength-min;
				}else{
					return bdLength;
				}},
			borderMove: function(e){
				_.logic.setMousePos(e.offsetX,e.offsetY,'end');
				_.logic.updateBorderPos(_.data.curbd);
				_.ui.render($(e.target));}
		},
		init: function(){
			_.ui.insertBorder();
			_.ui.bindEvent();},
		resize: function(){
			_.data.parent.obj.empty();
			_.data.init();
			_.ui.insertBorder();},
		getData: function(){
			return _.data.borderPos;}
	}
	return _;
}

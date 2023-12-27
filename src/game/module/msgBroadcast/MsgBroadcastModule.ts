class MsgBroadcastModule extends BaseModule{
	/**歌词秀停留时间 */
	public static STORY_SEC:number = 4000;

	private DF_TEXT_W:number = 378; // 405
	private rollTipPanel:fairygui.GObject;
	private transRollTip:fairygui.Transition;
	private rollTipTxt:fairygui.GRichTextField;
	private bgImg:fairygui.GImage;
	private isShowing:boolean;
	private cache:MsgBoardcastCache;
	private group_story:fairygui.GGroup;
	private txt_story:fairygui.GRichTextField;
	private txt_tip:fairygui.GRichTextField;
	private img_story_bg:fairygui.GImage;
	private loader_story:GLoader;

	/**走马灯 */
	public panel_round:MsgBroadBasePanel; 
	/**场景广播 */
	public panel_radio:MsgBroadBasePanel;
	/**当前显示的剧情广播数据 */
	public curStoryData:any;
	public constructor(moduleId:ModuleEnum) {
		super(moduleId, PackNameEnum.MsgBroadcast, "Main", LayerManager.UI_Guide);
		this.cache = CacheManager.msg;
		this.touchable = false;
	}
	public initOptUI():void {
		this.loader_story = <GLoader>this.getGObject("loader_story");
		this.img_story_bg = this.getGObject("img_story_bg").asImage;
		this.rollTipPanel = this.getGObject("panel_rollTip");
		this.transRollTip = this.view.getTransition("trans_rollTip");
		this.rollTipTxt = this.getGObject("txt_rollTip").asRichTextField;
		this.group_story = this.getGObject("group_delivery").asGroup;
		this.txt_story = this.getGObject("txt_story").asRichTextField;
		this.txt_tip = this.getGObject("txt_tip").asRichTextField;
		this.group_story.visible = false;
		//this.txt_story.displayObject.filters = EFilters.GLOWS;
		this.bgImg = this.getGObject("img_bg").asImage;
		this.txt_tip.visible = false;
		this.panel_round = new MsgBroadRoundPanel(this.getGObject("panel_round").asCom);
		this.panel_radio = new MsgBroadRadioPanel(this.getGObject("panel_radio").asCom);
		this.panel_round.visible = false;
		this.panel_radio.visible = false;		
	}

	public updateAll():void{
		
	}

	/**
	 * 显示走马灯
	 */
	public showRound():void{
		if(!this.panel_round.visible){
			var data:any = CacheManager.chat.shiftBroadMsg(EShowArea.EShowAreaMiddle);
			if(data){
				this.panel_round.update(data);		
				this.panel_round.runTween(true);
			}
			
		}
		
	}

	/**
	 * 显示场景广播
	 */
	public showRadio():void{
		if(!this.panel_radio.visible){
			var data:any = CacheManager.chat.shiftBroadMsg(EShowArea.EShowAreaMiddleTop);
			if(data){
				this.panel_radio.update(data);
				this.panel_radio.runTween(true);
			}			
		}

	}

	public showTopTip(msg:string):void{
		if(msg){
			this.txt_tip.visible = true;
			this.txt_tip.scaleX = this.txt_tip.scaleY = 0;
			this.txt_tip.text = msg;
			TweenUtils.to(this.txt_tip,{scaleX:1,scaleY:1},300,()=>{
				App.TimerManager.doDelay(3000,this.onTopTipsEnd,this);
			},this);
		}
		
	}
	
	public showStory(isForce:boolean=false, delay:number = MsgBroadcastModule.STORY_SEC):void{
		if(!this.group_story.visible || isForce){
			var data:any = CacheManager.chat.shiftBroadMsg(EShowArea.EShowAreaMiddleDown);
			if(data){
				this.curStoryData = data;
				this.group_story.visible = true;
				let isImg:boolean = CacheManager.msg.isStoryImg(data.content_S);
				this.img_story_bg.visible = !isImg; 
				this.txt_story.visible = !isImg;
				this.loader_story.visible = isImg;
				if(isImg){
					this.loader_story.load(CacheManager.msg.getStoryUrl(data.content_S));
					this.txt_story.text = "";
				}else{
					this.loader_story.clear();
					this.txt_story.text = data.content_S;
				}				
				this.group_story.alpha = isForce?1:0;			
				TweenUtils.to(this.group_story,{alpha:1},200,()=>{
					App.TimerManager.doDelay(delay,this.onShowStoryEnd,this);
				},this);
			}else{
				this.curStoryData = null;
			}			
		}
		
	}
	public hideStory():void{
		if(this.group_story && this.group_story.visible && !this.curStoryData.changeMapNoClear){
			TweenUtils.kill(this.group_story);
			this.group_story.visible = false;
			this.curStoryData = null;
		}
		
	}
	private onTopTipsEnd():void{
		this.txt_tip.visible = false;
	}
	private onShowStoryEnd():void{
		if(this.curStoryData && CacheManager.chat.isSameBroadMsg(this.curStoryData,EShowArea.EShowAreaMiddleDown)){
			this.showStory(true);
		}else{
			TweenUtils.to(this.group_story,{alpha:0},200,()=>{
				this.group_story.visible = false;
				this.showStory();
			},this);	
		}
			
	}
	/**
	 * 中上部提示
	 */
	public showRollTip(tip:string, color:number=Color.White):void{
		this.cache.addRollTip(tip, color);
		this.transRollTip.stop();
		this.showOne();
	}

	private showOne():void{
		this.rollTipPanel.visible = false;
		this.isShowing = false;
		if(this.cache.getRollTip().length > 0){
			//this.isShowing = true; //去掉这行注销就不会顶掉了
			let tip = this.cache.getRollTip().shift();
			this.rollTipPanel.visible = true;
			this.rollTipTxt.text = tip.text;
			this.rollTipTxt.color = tip.color;

			//实现tips自动大小
			var bgW:number = Math.max(this.rollTipTxt.textWidth,this.DF_TEXT_W) + 27;
			this.bgImg.width = bgW;			
			this.rollTipTxt.x = this.bgImg.x + (bgW - this.rollTipTxt.textWidth>> 1);
			this.rollTipPanel.x = fairygui.GRoot.inst.width - this.bgImg.width >> 1;	

			this.transRollTip.play(this.showOne, this);
			
		}
	}
}
class CheckPointUpView extends BaseView {
	private passNum:number = -1;
	private copperTxt1:fairygui.GRichTextField;
	private copperTxt2:fairygui.GRichTextField;
	private expTxt1:fairygui.GRichTextField;
	private expTxt2:fairygui.GRichTextField;

	//主动点击查看效率文本
	private txt_copper:fairygui.GRichTextField;
	private txt_exp:fairygui.GRichTextField;

	private thisParent:fairygui.GComponent;
	private titleTxt:fairygui.GTextField;
	private c1:fairygui.Controller;
	public constructor(component:fairygui.GComponent) {
		super(component.getChild("com").asCom);
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.txt_copper = this.getGObject("txt_copper").asRichTextField;
		this.txt_exp = this.getGObject("txt_exp").asRichTextField;

		this.copperTxt1 = this.getGObject("n4").asRichTextField;
		this.copperTxt2 = this.getGObject("n9").asRichTextField;
		this.expTxt1 = this.getGObject("n5").asRichTextField;
		this.expTxt2 = this.getGObject("n8").asRichTextField;
		this.titleTxt = this.getGObject("titleTxt").asTextField;
		this.view.alpha = 0;
		this.thisParent = this.view.parent;
		this.view.removeFromParent();
	}
	
	public updateAll():void {

	}

	public updateRate(isTouch:boolean = false):void {
		if(this.view.inContainer && isTouch) return;
		if(this.passNum == CacheManager.checkPoint.passPointNum && !isTouch) return;
		if(this.passNum == -1){
			this.passNum = CacheManager.checkPoint.passPointNum;
		}
		if(isTouch) {
			this.c1.setSelectedIndex(1);
			this.titleTxt.text = "关卡效率";
		}
		else {
			this.c1.setSelectedIndex(0);
			this.titleTxt.text = "关卡效率提升";
		}
		let checkPointCfg:any = ConfigManager.checkPoint.getCheckPoint(this.passNum + 1);
		if(!checkPointCfg) {
			checkPointCfg = ConfigManager.checkPoint.getCheckPoint(this.passNum);
		}
		//策划需求只转化经验数值过大的情况，铜钱还是显示具体数值
		this.txt_exp.text = this.expTxt1.text = HtmlUtil.html(App.MathUtils.formatNum2(checkPointCfg.hourExp),Color.Green2) + "/小时";

		this.txt_copper.text = this.copperTxt1.text = HtmlUtil.html(checkPointCfg.hourCoin + "",Color.Green2) + "/小时";

		this.passNum = CacheManager.checkPoint.passPointNum;
		checkPointCfg = ConfigManager.checkPoint.getCheckPoint(this.passNum + 1);
		
		if(checkPointCfg){
			this.copperTxt2.text = HtmlUtil.html(checkPointCfg.hourCoin + "",Color.Green2) + "/小时";
			this.expTxt2.text = HtmlUtil.html(App.MathUtils.formatNum2(checkPointCfg.hourExp),Color.Green2) + "/小时";
		}
		else {
			this.copperTxt2.text = this.expTxt2.text = HtmlUtil.html("已通关",Color.Green2);
		}
		this.view.x = 248;
		this.view.y = 0;
		this.view.scaleX = this.view.scaleY = 1;
		this.thisParent.addChild(this.view);
		egret.Tween.removeTweens(this.view);
		this.view.alpha = 0;
		if(this.c1.selectedIndex == 0) {
			let posX:number = this.thisParent.width/2 + 180;
			let posY:number = -this.thisParent.y + 80;
			// this.thisParent.x + this.thisParent.width/2 + 180
			// -this.thisParent.y + 80
			egret.Tween.get(this.view).to({alpha:1},500).wait(2000).to({x:posX,y:posY,scaleX:0.1,scaleY:0.1},500,egret.Ease.circOut).call(function(){
				this.view.removeFromParent();
			},this);
		}
		else {
			egret.Tween.get(this.view).to({alpha:1},500).wait(2000).to({alpha:0},800).call(function(){
				this.view.removeFromParent();
			},this);
		}
	}
}
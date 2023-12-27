class BossTireExplainWindow extends BaseWindow {
	private btn_solo:fairygui.GButton;
	private txt_explain:fairygui.GTextField;
	private txt_title:fairygui.GTextField;
	// private img_bg:fairygui.GImage;

	private timeOutIdx:number = -1;
	public constructor() {
		super(PackNameEnum.Common,"WindowExplain");
		// this.isAnimateShow = false;
		
	}
	public initOptUI():void{
		this.txt_explain = this.getGObject("txt_explain").asTextField;
		this.txt_title = this.getGObject("txt_title").asTextField;
		// this.img_bg = this.getGObject("img_bg").asImage;
	}
	
	public updateAll(data?:any):void{
		this.txt_explain.text = data.desc;
		this.txt_title.text = data.title || LangCommon.L25;
		this.txt_explain["renderNow"]();
		// this.visible = false;
		// this.timeOutIdx = egret.setTimeout(function(){
		// 	this.timeOutIdx = -1;
		// 	this.center();
		// 	this.visible = true;
		// },this,100);
		// HtmlUtil.html("1、达到对应等级可解锁挑战野外BOSS",Color.Yellow3,false)+
		// HtmlUtil.html("1点",Color.Blue,false)+HtmlUtil.html("疲劳值",Color.Yellow3,true)+HtmlUtil.html("2.当人物疲劳值达到",Color.Yellow3,false)+
		// HtmlUtil.html("3点",Color.Blue,false)+HtmlUtil.html("本日将无法对世",Color.Yellow3)+HtmlUtil.html("界Boss造成伤害",Color.Yellow3,true)+HtmlUtil.html("3.疲劳值每日凌晨",Color.Yellow3,false)+
		// HtmlUtil.html("00:00:00",Color.Blue,false)+HtmlUtil.html("清零一次",Color.Yellow3,false);
		//this.txt_tip.y = this.img_bg.y + this.img_bg.height+5;
	}
	public hide():void {
		// if(this.timeOutIdx != -1) {
		// 	egret.clearTimeout(this.timeOutIdx);
		// 	this.timeOutIdx = -1;
		// }
		super.hide();
	}
}
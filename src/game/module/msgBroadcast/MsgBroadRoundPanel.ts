/**跑马灯广播 */
class MsgBroadRoundPanel extends MsgBroadBasePanel {
	private c1:fairygui.Controller;
	private mc : UIMovieClip;
	private cnt:fairygui.GComponent;
	public constructor(view: fairygui.GComponent) {
		super(view);
	}
	protected initUI(): void {
		this.maskX = 105+30;
		this.maskArea = 420;
		super.initUI();
		this.c1 = this.view.getController("c1");
		this.mc = UIMovieManager.get(PackNameEnum.MCLaba);
		this.view.addChild(this.mc);
       	this.mc.visible = this.mc.playing = true;
       	this.mc.scaleX = 1;
       	this.mc.scaleY = 1;
       	this.mc.x = this.maskX-65; //this.btnReward.x - 174;
       	this.mc.y = -13;//this.btnReward.y - 215;
		
		this.cnt = this.view.getChild("cnt").asCom;
		let mc:UIMovieClip = UIMovieManager.get(PackNameEnum.MCBroadRound);
		this.cnt.addChild(mc);
	}

	public runTween(isIn: boolean): void {		
		if (this.isTrumpet) { //喇叭就是缩放动画和场景广播效果一样 但是放在跑马灯的位置				
			this.tweenTar = this.view;
			this.scaleTween(isIn);
		} else { //其他就是跑马灯动画
			this.tweenTar = this.cell;
			this.roundTween();
		}
		
	}
	public update(data: any): void {
		super.update(data);			
		var idx:number = 0;
		if(this.isTrumpet){
			idx = 1;
		}
		this.c1.selectedIndex = idx;		
	}
	protected onShowComplete(): void { //出现的缓动结束		
		if (this.isTrumpet) { //喇叭的处理 和场景广播一样
			if(this.isTooWid){
				this.cell.x = this.maskX;
			}
			this.dealRadioTween();
		} else {
			this.roundTween();
		}
	}
	protected getRoundTweenProps():any{		
		if (this.isTrumpet){			
			return this.getRadioRoundProps();
		}else{
			return super.getRoundTweenProps();
		}
		
	}
	protected getNextData(): any {
		var nextData: any = CacheManager.chat.shiftBroadMsg(EShowArea.EShowAreaMiddle);
		return nextData;
	}



}
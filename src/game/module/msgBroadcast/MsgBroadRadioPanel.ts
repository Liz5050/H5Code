/**
 * 场景广播
 */
class MsgBroadRadioPanel extends MsgBroadBasePanel {

	protected isShowEnd: boolean;

	public constructor(view: fairygui.GComponent) {
		super(view);
	}
	protected initUI(): void {
		super.initUI();
		
	}
	public update(data: any): void {
		super.update(data);
		if(this.isTooWid){
			this.cell.x = this.maskX;
		}
	}
	public runTween(isIn: boolean): void {
		this.scaleTween(isIn);
	}

	protected onShowComplete(): void { //出现的缓动结束
		this.dealRadioTween();
	}
	protected getRoundTweenProps():any{		
		return this.getRadioRoundProps();
	}
	protected getNextData(): any {
		var nextData: any = CacheManager.chat.shiftBroadMsg(EShowArea.EShowAreaMiddleTop);
		return nextData;
	}

}
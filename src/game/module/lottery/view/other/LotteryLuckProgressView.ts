class LotteryLuckProgressView extends BaseView {
	private maskBg:fairygui.GImage;
	private maskObj:fairygui.GGraph;

	private curValue:number;
	private totalValue:number;
	private totalHeight:number;
	public constructor(component:fairygui.GComponent) {
		super(component);
	}

	public initOptUI():void {
		this.maskBg = this.getGObject("mask_bg").asImage;
		this.maskObj = this.getGObject("mask_obj").asGraph;
		this.maskBg.displayObject.mask = this.maskObj.displayObject;
		this.totalHeight = 148;
		// this.maskBg.height = 148/2;
		this.setValue(10,200);
	}

	public updateAll():void {
	}

	public setValue(current:number,total:number):void {
		if(current > total) {
			current = total;
		}
		let unit:number = this.totalHeight / total;
		let maskHeight:number = this.totalHeight - unit*current;
		if(maskHeight > 0) {
			maskHeight += 8;
		}
		else {
			maskHeight = 0;
		}
		this.maskObj.height = maskHeight;
	}
}
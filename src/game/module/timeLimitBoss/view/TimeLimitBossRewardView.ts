class TimeLimitBossRewardView extends BaseContentView {
	private closeBtn:fairygui.GButton;
	public constructor() {
		super(PackNameEnum.TimeLimitBoss,"TimeLimitBossReward");
		this.modal = true;
		this.modalAlpha = 0;
		this.isCenter = true;
		this.isPopup = true;
	}

	public initOptUI():void {
		this.closeBtn = this.getGObject("btn_close").asButton;
		this.closeBtn.addClickListener(this.hide,this);

		let codes:number[] = CacheManager.timeLimitBoss.rewardCodes;
		for(let i:number = 0; i < 4; i++) {
			let item:BaseItem = this.getGObject("baseItem_" + i) as BaseItem;
			item.isShowName = false;
			if(i < 2) {
				item.setData(new ItemData(codes[0]));
			}
			else {
				item.setData(new ItemData(codes[i - 1]));
			}
		}
	}

	public updateAll(data:any = null):void {
	}
} 
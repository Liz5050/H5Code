class RebatePreviewItem extends ListRenderer{
	private c1:fairygui.Controller;
	private item:BaseItem;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.item = this.getChild("baseItem") as BaseItem;
	}

	public setData(data:number):void {
		this._data = data;
		let info:any = CacheManager.activity.rebateInfo;
		let reward:ItemData = new ItemData(data);
		this.item.setData(reward);

		let codeCfgs:any[] = ConfigManager.rechargeRebate.getExRewardsByCode(data);
		let canGetList:number[] = info.canGetRewardIdList.data_I;
		let hadGet:boolean = true;
		for(let i:number = 0; i < codeCfgs.length; i++) {
			if(info.rewardRound == codeCfgs[i].round){
				if(info.rechargeDayNum >= codeCfgs[i].rechargeDay && canGetList.indexOf(codeCfgs[i].id) == -1) {
					//已领取
					continue;
				}	
				//只要存在一个未领取，代表这个额外奖励还未领取完成
				hadGet = false;
				break;
			}
		}

		if(hadGet) {
			//已领取
			this.c1.selectedIndex = 1;
		}
		else {
			//未达成、可领取
			this.c1.selectedIndex = 0;
		}
	}
}
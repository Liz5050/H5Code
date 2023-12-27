/**
 * 冲级奖励项
 */

class WelfareUpgradeItem extends ListRenderer{
	private levelTxt: fairygui.GTextField;
	private remainNumTxt: fairygui.GTextField;
	private rewardList: fairygui.GList;
	private receiveBtn: fairygui.GButton;
	private controller: fairygui.Controller;

	private lockClickTime: number = 500;
	private clickLastTime: number = 0;
	private clickCurrentTime: number;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.remainNumTxt = this.getChild("txt_num").asTextField;
		this.rewardList = this.getChild("list_reward").asList;
		this.receiveBtn = this.getChild("btn_receive").asButton;
		this.controller = this.getController("c1");
		this.receiveBtn.addClickListener(this.click, this);
	}

	public setData(data: any): void{
		let strs: Array<string> = data.rewardStr.split("#");
		let remainNum: number = 0;
		this._data = data;
		this.rewardList.removeChildrenToPool();
		for(let str of strs){
			let itemData: ItemData = RewardUtil.getReward(str);
			if(ItemsUtil.isTrueItemData(itemData)){
				let baseItem: BaseItem = <BaseItem>this.rewardList.addItemFromPool();
				baseItem.itemData = itemData;
				baseItem.showBind();
			}
		}
		this.levelTxt.text = data.level + "级\n礼包";
		remainNum = CacheManager.welfare.getRemainNum(data);
		if(remainNum < 0){
			this.remainNumTxt.visible = false;
		}else{
			this.remainNumTxt.visible = true;
			this.remainNumTxt.text = `剩余${remainNum}份`;
		}
		this.controller.selectedIndex = CacheManager.welfare.getLevelStatus(data);
	}

	private click(): void{
		this.clickCurrentTime = egret.getTimer();
		if (this.clickCurrentTime - this.clickLastTime > this.lockClickTime) {
			ProxyManager.welfare.getLevelGiftReward(this._data.level);
		}
		this.clickLastTime = this.clickCurrentTime;
	}
}
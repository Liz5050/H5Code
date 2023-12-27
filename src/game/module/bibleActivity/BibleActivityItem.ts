/**
 * 天书寻主奖励项
 */

class BibleActivityItem extends ListRenderer{
	private descTxt: fairygui.GTextField;
	private processTxt: fairygui.GTextField;
	private rewarItemList: fairygui.GList;
	private statusController: fairygui.Controller;
	private moneyController: fairygui.Controller;
	private getRewardBtn: fairygui.GButton;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.descTxt = this.getChild("txt_desc").asTextField;
		this.processTxt = this.getChild("txt_schedule").asTextField;
		this.rewarItemList = this.getChild("list_reward").asList;
		this.getRewardBtn = this.getChild("btn_receive").asButton;
		this.getRewardBtn.addClickListener(this.clickRewardBtn, this);
		this.statusController = this.getController("c1");
		this.moneyController = this.getController("c2");
	}

	public setData(data: any): void{
		this._data = data;
		let strs: Array<string>;
		let rewardArr: Array<string> = data.rewardStr.split(",");
		this.descTxt.text = data.desc;
		if(data.recommendShow){
			this.rewarItemList.defaultItem = URLManager.getPackResUrl(PackNameEnum.Common, "BaseItem");
			strs = data.recommendShow.split("#");
			this.rewarItemList.removeChildrenToPool();
			for(let str of strs){
				let itemData: ItemData = new ItemData(str);
				if(ItemsUtil.isTrueItemData(itemData)){
					let baseItem: BaseItem = <BaseItem> this.rewarItemList.addItemFromPool();
					baseItem.itemData = itemData;
					baseItem.showBind();
					baseItem.extData = {"bestRecommand": true};
				}
			}
		}else if(data.contentEx){
			this.rewarItemList.defaultItem = URLManager.getPackResUrl(PackNameEnum.BibleActivity, "BossItem");
			strs = data.contentEx.split("#");
			this.rewarItemList.removeChildrenToPool();
			for(let str of strs){
				if(str != ""){
					let array: Array<string> =  str.split(",");
					let bossItem: BossItem = <BossItem> this.rewarItemList.addItemFromPool();
					let bossData: any = {"map": array[0], "code": array[1]};
					bossItem.setData(bossData);
					bossItem.setGray(CacheManager.bibleActivity.getBossStatus(Number(array[1])));
					bossItem.setBossStatus(CacheManager.bibleActivity.getBossStatus(Number(array[1])));
				}
			}
		}
		switch(Number(rewardArr[1])){
			case EPriceUnit.EPriceUnitCoinBind:
				this.moneyController.selectedIndex = 0;
				break;
			case EPriceUnit.EPriceUnitRuneExp:
				this.moneyController.selectedIndex = 1;
				break;
			case EPriceUnit.EPriceUnitGoldBind:
				this.moneyController.selectedIndex = 2;
				break;
		}
		if(data.pageCode == CacheManager.bibleActivity.getCurrentPage()){
			let status: number = CacheManager.bibleActivity.getTargetInfo(data.index).status_I;
			this.statusController.selectedIndex = status - 1;
			if(status == EDeityBookStatus.EDeityBookStatusNotComplete){
				this.processTxt.text = `(${CacheManager.bibleActivity.getTargetProcess(data.index)}/${data.target})`;
			}else{
				this.processTxt.text = `(${data.target}/${data.target})`;
			}
		}else{
			this.statusController.selectedIndex = 2;
			this.processTxt.text = `(${data.target}/${data.target})`;
		}
	}

	private clickRewardBtn(): void{
		ProxyManager.bibleActivity.getDeityBookTargetReward(this._data.pageCode, this._data.index);
		// ProxyManager.bibleActivity.getDeityBookInfo();
	}
}
/**
 * 天书寻主
 */

class BibleActivityModule extends BaseWindow{
	private rewardTxt: fairygui.GTextField;
	private tabList: fairygui.GList;
	private loader: GLoader;
	private rewardList: List;
	private controller: fairygui.Controller;
	private tabData: any;
	private tabSelected: number = 0;
	private isScrollList: boolean;

	public constructor(moduleId: ModuleEnum) {
		super(PackNameEnum.BibleActivity, "Main", moduleId);
	}

	public initOptUI(): void{
		this.rewardTxt = this.getGObject("txt_schedule").asTextField;
		this.tabList = this.getGObject("list_item").asList;
		this.loader = <GLoader>this.getGObject("loader_img");
		this.rewardList = new List(this.getGObject("list_rankReward").asList);
		this.controller = this.getController("c1");
		this.tabList.addEventListener(fairygui.ItemEvent.CLICK, this.onChangeTab, this);
	}

	public updateAll(): void{
		ProxyManager.bibleActivity.getDeityBookInfo();
		this.isScrollList = true;
		// this.tabSelected = (CacheManager.rankRush.openIndex() > 0) ? (CacheManager.rankRush.openIndex() - 1) : 0;
		// this.updateTabList();
	}

	public updateBtnTips(): void{
		for(let i = 0; i < this.tabList.numItems; i++){
			let tabBtn: fairygui.GButton = this.tabList.getChildAt(i).asButton;
			CommonUtils.setBtnTips(tabBtn, CacheManager.bibleActivity.isTabBtnTips(this.tabData[i + 1].code));
		}
	}

	public onChangeTab(): void{
		let data: any = this.tabData[this.tabList.selectedIndex + 1];
		if(data.code <= CacheManager.bibleActivity.getCurrentPage()){
			this.updateRewardList();
			this.rewardList.scrollToView(0);
		}else{
			let lastBookName: any = this.tabData[this.tabList.selectedIndex].name;
			this.tabList.selectedIndex = this.tabSelected;
			Tip.showTip(`获得${lastBookName}后开启`);
		}
	}

	public updateTabList(): void{
		let dict: any = ConfigManager.mgDeityBookPage.getDict();
		this.tabData = dict;
		this.tabList.removeChildrenToPool();
		for(let key in dict){
			let item: fairygui.GButton = this.tabList.addItemFromPool().asButton;
			if(dict[key].code <= CacheManager.bibleActivity.getCurrentPage()){
				item.title = dict[key].name;
			}else{
				item.title = '？？？？';
			}
		}
		if(CacheManager.bibleActivity.getCurrentPage() > ConfigManager.mgDeityBookPage.configLength){
			this.tabList.selectedIndex = this.tabList.numItems - 1;
		}else{
			this.tabList.selectedIndex = CacheManager.bibleActivity.getCurrentPage() - 1;
		}
		this.tabList.scrollToView(this.tabList.selectedIndex);
		this.updateBtnTips();
		this.updateRewardList();
		if(this.isScrollList){
			this.rewardList.scrollToView(0);
			this.isScrollList = false;
		}
	}

	public updateRewardList(): void{
		this.tabSelected = this.tabList.selectedIndex;
		let str: string = "";
		let reWardItem: ItemData = RewardUtil.getReward(this.tabData[this.tabList.selectedIndex + 1].rewardStr);
		let pageCode: number = this.tabData[this.tabList.selectedIndex + 1].code;
		let data: Array<any> = ConfigManager.mgDeityBookTarget.select({"pageCode": pageCode});
		str = `领取所有奖励后获得<font color = ${Color.ItemColor[EColor.EColorRed]}>${reWardItem.getName()}</font>：`;
		if(pageCode == CacheManager.bibleActivity.getCurrentPage()){
			str += `<font color = ${Color.ItemColor[EColor.EColorRed]}>${CacheManager.bibleActivity.getProcess()}/${data.length}</font>`;
			this.controller.selectedIndex = 0;
		}else{
			str += `<font color = '#01AB24'>${data.length}/${data.length}</font>`;
			this.controller.selectedIndex = 1;
		}
		this.rewardTxt.text = str;
		this.rewardList.setVirtual(data);
		this.loader.load(URLManager.getPackResUrl(PackNameEnum.BibleActivity, `img_${pageCode}`));
		// this.rewardList.scrollToView(0);
		// this.bgLoader.load(URLManager.getPackResUrl(PackNameEnum.RankRush, `${PackNameEnum.RankRush}_${this.tabList.selectedIndex}`));
		// this.updateUpgrade();
		// this.updateLevel();
	}
}
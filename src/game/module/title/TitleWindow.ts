class TitleWindow extends BaseWindow {
	private controller: fairygui.Controller;
	private modelContainer: fairygui.GComponent;
	private categoryList: List;
	private titleList: List;
	private wearBtn: fairygui.GButton;
	private unloadBtn: fairygui.GButton;
	private timeTxt: fairygui.GTextField;
	private fightTxt: fairygui.GTextField;
	private getWayTxt: fairygui.GTextField;
	private propertyTxt:fairygui.GRichTextField;
	private playerModel: PlayerModel;

	private categoryIndex: number = -1;
	private titleIndex: number = -1;
	private titleCfg: any;
	private inUseItem:TitleNameItem;
	public constructor(moduleId: ModuleEnum) {
		super(PackNameEnum.Title, "Main", moduleId);
	}

	public initOptUI(): void {
		this.controller = this.getController("c1");
		this.modelContainer = this.getGObject("model_container").asCom;
		this.categoryList = new List(this.getGObject("list_label").asList);
		this.categoryList.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectCategory,this);
		this.categoryList.data = ConfigManager.titleCategory.getTitleCategoryList();

		this.titleList = new List(this.getGObject("list_title").asList);
		this.titleList.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectTitle,this);

		this.wearBtn = this.getGObject("btn_wear").asButton;
		this.wearBtn.addClickListener(this.onWearTitleHandler,this);
		this.unloadBtn = this.getGObject("btn_unload").asButton;
		this.unloadBtn.addClickListener(this.onUnloadTitleHandler,this);

		this.fightTxt = this.getGObject("txt_fighting").asTextField;
		this.timeTxt = this.getGObject("txt_time").asTextField;
		this.getWayTxt = this.getGObject("txt_source").asTextField;
		this.propertyTxt = this.getGObject("txt_attr").asRichTextField;
	}

	public updateAll(): void {
		if(!this.playerModel) {
			this.playerModel = new PlayerModel([EEntityAttribute.EAttributeClothes, EEntityAttribute.EAttributeWeapon,EEntityAttribute.EAttributeTitleMain]);
			this.playerModel.x = 332;
			this.playerModel.y = 410;
			(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.playerModel);
		}
		this.playerModel.updateAll();
		this.setCategoryIndex(0);
	}

	public updateTitleState():void {
		if (CacheManager.title.isActive(this.titleCfg.code)) {
			let itemIndex:number = this.titleList.data.indexOf(this.titleCfg);
			let item:TitleNameItem;
			if(itemIndex != -1){
				itemIndex = this.titleList.list.itemIndexToChildIndex(itemIndex);
				if(itemIndex >= 0)
				{
					item = this.titleList.list.getChildAt(itemIndex) as TitleNameItem
				}
			}
			if (CacheManager.title.isInUse(this.titleCfg.code)) {
				this.controller.selectedIndex = 2;
				if(item) {
					if(this.inUseItem != null){
						this.inUseItem.inUse = false;
					}
					this.inUseItem = item;
					this.inUseItem.inUse = true;
				}
			}
			else {
				this.controller.selectedIndex = 1;
				if(item) {
					item.inUse = false;
				}
			}
			if(this.titleCfg.existTime)
			{
				let title: any = CacheManager.title.getActiveTitle(this.titleCfg.code);
				if(title) {
					let leftTime:number = title.endDt_DT - CacheManager.serverTime.getServerTime();
					this.timeTxt.text = "剩余时间：" + App.DateUtils.getFormatBySecond(leftTime, 8);
				}
			}
			else
			{
				this.timeTxt.text = "剩余时间：永久";
			}
		}
		else {
			this.controller.selectedIndex = 0;
			if (this.titleCfg.existTime && this.titleCfg.existTime > 0) {
				this.timeTxt.text = "剩余时间：" + App.DateUtils.getFormatBySecond(this.titleCfg.existTime * 60 * 60, 8);
			}
			else {
				this.timeTxt.text = "剩余时间：永久";
			}
		}
	}	

	/**佩戴称号 */
	private onWearTitleHandler():void {
		EventManager.dispatch(LocalEventEnum.TitleUse,this.titleCfg.code);
	}

	/**卸下称号 */
	private onUnloadTitleHandler():void {
		EventManager.dispatch(LocalEventEnum.TitleUnload);
	}

	private onSelectCategory():void {
		let index:number = this.categoryList.selectedIndex;
		this.setCategoryIndex(index);
	}

	private onSelectTitle():void {
		let index:number = this.titleList.selectedIndex;
		this.setTitleIndex(index);
	}

	/**称号类型索引 */
	private setCategoryIndex(index: number, titleIndex: number = 0): void {
		if (this.categoryIndex == index) return;
		this.titleIndex = -1;
		this.categoryIndex = index;
		this.categoryList.selectedIndex = index;
		this.categoryList.list.scrollToView(index);

		let category: number = this.categoryList.selectedItem.getData().type;
		let titleList:any[] = ConfigManager.title.getTitlesByCategory(category);
		this.titleList.setVirtual(titleList);
		this.setTitleIndex(titleIndex,true);
	}

	/**称号索引 */
	private setTitleIndex(index: number,setScroll:boolean = false): void {
		if (this.titleIndex == index) return;
		this.titleIndex = index;
		this.titleList.selectedIndex = index;
		if(setScroll) this.titleList.list.scrollToView(index);
		this.titleCfg = this.titleList.data[index];
		this.updateTitleView();
	}

	/**更新当前选中的称号视图 */
	private updateTitleView(): void {
		this.updateTitleState();
		this.fightTxt.text = this.titleCfg.warfare + "";
		this.getWayTxt.text = this.titleCfg.desc;
		this.propertyTxt.text = WeaponUtil.getAttrDictStr(this.titleCfg.attrList,true);
		this.playerModel.updateTitle(this.titleCfg.icon);
	}

	public hide():void {
		this.categoryIndex = this.titleIndex = -1;
		this.titleCfg = null;
		if(this.playerModel) {
			this.playerModel.destroy();
			this.playerModel = null;
		}
		super.hide();
	}
}
/**
 * 守护ToolTip
 */
class ToolTipSpirit extends ToolTipBase {
	private nameTxt: fairygui.GRichTextField;
	private expireTxt: fairygui.GTextField;
	private baseItem: BaseItem;
	private scoreTxt: fairygui.GTextField;
	private totalScoreTxt: fairygui.GTextField;//综合评分
	private baseAttrTxt: fairygui.GRichTextField;
	private careerTxt: fairygui.GTextField;
	private typeTxt: fairygui.GTextField;
	private numTxt: fairygui.GRichTextField;
	private descTxt: fairygui.GRichTextField;

	private cOpt: fairygui.Controller;
	private btnList: fairygui.GList;
	private itemData: ItemData;

	private goldController: fairygui.Controller;
	private tipImg: fairygui.GImage;
	private shopGroup: fairygui.GGroup;
	private shopData: any;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipSpirit");
	}

	public initUI(): void {
		super.initUI();
		this.cOpt = this.getController("c_opt");
		this.btnList = this.getGObject("list_btn").asList;
		this.btnList.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.expireTxt = this.getChild("txt_expire").asTextField;
		this.scoreTxt = this.getChild("txt_equip_score").asTextField;
		this.totalScoreTxt = this.getChild("txt_composite_score").asTextField;
		this.baseItem = <BaseItem>this.getChild("loader_item");

		this.baseAttrTxt = this.getChild("txt_base").asRichTextField;
		this.descTxt = this.getChild("txt_desc").asRichTextField;

		this.scoreTxt = this.getChild("txt_equip_score").asTextField;
		this.careerTxt = this.getChild("txt_career").asTextField;
		this.typeTxt = this.getChild("txt_type").asTextField;
		this.numTxt = this.getChild("txt_num").asRichTextField;

		this.goldController = this.getController("c1");
		this.tipImg = this.getChild("window_itemtip").asImage;
		this.shopGroup = this.getChild("group_price").asGroup;
		
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				let itemInfo: any = this.itemData.getItemInfo();
				let itemExtInfo: any = this.itemData.getItemExtInfo();
				var name: string = this.itemData.getName(true);
				this.nameTxt.text = name;
				//处理过期显示
				if (itemExtInfo["exist"]) {
					let leftTime: number = Number(itemExtInfo["exist"] - CacheManager.serverTime.getServerTime());
					if (leftTime > 0) {//少于一天
						this.expireTxt.text = `【${DateUtils.formatSecond(leftTime)}】后过期`;
					} else {
						this.expireTxt.text = "【守护过期】";
					}
				} else {
					this.expireTxt.text = "";
				}
				this.scoreTxt.text = WeaponUtil.getScoreBase(this.itemData).toString();
				this.totalScoreTxt.text = WeaponUtil.getTotalScore(this.itemData).toString();
				this.baseAttrTxt.text = this.getBaseAttr(this.itemData);
				this.descTxt.text = "物品说明：\n" + this.itemData.getDesc();
				let career: number = this.itemData.getCareer();
				this.careerTxt.text = ConfigManager.mgCareer.getCareerName(career);
				let careerColor: number = 0xFF0000;;//CareerUtil.isCareerMatch(career) ? 0xFFFFFF : 0xFF0000;
				this.careerTxt.color = careerColor;
				this.typeTxt.text = WeaponUtil.getWeaponTypeName(this.itemData.getType());

				this.shopData = null;
				if (toolTipData.shopData != null) {
					this.shopData = toolTipData.shopData;
					// this.numTxt.text = this.shopData["sellData"].price;
					let shop: any = ConfigManager.shop.getByPk(this.shopData["sellData"].shopCode);
					if(MoneyUtil.checkEnough(shop.unit, this.shopData["sellData"].price, false, true)){
						this.numTxt.text = `${this.shopData["sellData"].price}`;
					}else{
						this.numTxt.text = `<font color = ${Color.ItemColor[EColor.EColorRed]}>${this.shopData["sellData"].price}</font>`;
					}
					this.shopGroup.y = this.descTxt.y + this.descTxt.height + 20;
					this.shopGroup.addRelation(this.descTxt, fairygui.RelationType.Top_Bottom);
					this.tipImg.removeRelation(this.descTxt);
					this.tipImg.height = this.shopGroup.y + this.shopGroup.height + 30;
					this.shopGroup.visible = true;
					let leftTime: number = Number(itemExtInfo["exist"]);
					this.expireTxt.text = `【${this.itemData.getItemInfo().existDay}天】后过期`;
					let shopData: any = ConfigManager.shop.getByPk(this.shopData["sellData"].shopCode);
					switch(shopData.unit){
						case EPriceUnit.EPriceUnitGold:
							this.goldController.selectedIndex = 0;
							break;
						case EPriceUnit.EPriceUnitGoldBind:
							this.goldController.selectedIndex = 1;
							break;
					}
				}
				else {
					if (this.shopGroup) {
						this.tipImg.removeRelation(this.shopGroup);
						this.shopGroup.visible = false;
					}
					this.tipImg.height = this.descTxt.y + this.descTxt.height + 30;
					this.tipImg.addRelation(this.descTxt, fairygui.RelationType.BottomExt_Bottom);
				}

				this.updateBtnList();
			}
			this.baseItem.itemData = this.itemData;
			this.enableOptList(toolTipData.isEnableOptList);
		}
	}

	public center(): void {
		let optListWidth: number = 130;
		let centerX: number = (fairygui.GRoot.inst.width - this.width + optListWidth) / 2;
		let centerY: number = (fairygui.GRoot.inst.height - this.height) / 2;
		this.setXY(centerX, centerY);
	}

	public enableOptList(enable: boolean): void {
		this.btnList.visible = enable;
	}

	/**
	 * 更新操作按钮
	 */
	private updateBtnList(): void {
		let data: Array<any> = [];
		if (CacheManager.pack.rolePackCache.isDressed(this.itemData)) {
			data.push(ToolTipOptEnum.Undress);
			this.cOpt.setSelectedIndex(1);
		} else {
			this.cOpt.setSelectedIndex(0);
			if (CacheManager.pack.backPackCache.hasItem(this.itemData)) {//背包中
				if (this.itemData.isExpire) {
					data.push(ToolTipOptEnum.Renew);
				} else {
					data.push(ToolTipOptEnum.Dress);
				}
				data.push(ToolTipOptEnum.Sell);
			}
		}

		//商城购买按钮
		if (this.shopData && this.shopData["limitNum"] != 0) {
			// data = [ToolTipOptEnum.Buy];
			data.push(ToolTipOptEnum.Buy);
		}

		this.btnList.removeChildrenToPool();
		for (let opt of data) {
			var button: fairygui.GButton = <fairygui.GButton>this.btnList.addItemFromPool();
			button.text = GameDef.ToolTipOptName[opt];
			button.name = opt;
		}
	}

	/**点击操作按钮 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let button: fairygui.GButton = <fairygui.GButton>e.itemObject;
		if (button != null) {
			switch (Number(button.name)) {
				case ToolTipOptEnum.Dress:
					EventManager.dispatch(LocalEventEnum.EquipToRole, this.itemData);
					break;
				case ToolTipOptEnum.Undress:
					EventManager.dispatch(LocalEventEnum.EquipUndressRole, this.itemData);
					break;
				case ToolTipOptEnum.Sell:
					EventManager.dispatch(LocalEventEnum.PackSale, this.itemData);
					break;
				case ToolTipOptEnum.Renew:
					EventManager.dispatch(UIEventEnum.ShopRenewSpiritOpen, this.itemData);
					break;
				case ToolTipOptEnum.Buy:
					if (this.shopData) {
						let shop: any = ConfigManager.shop.getByPk(this.shopData["sellData"].shopCode);
						if(MoneyUtil.checkEnough(shop.unit, this.shopData["sellData"].price, true, true)){
							ProxyManager.shop.buyItem(0, this.shopData["sellData"].shopCode, this.shopData["sellData"].itemCode, 1, 0, false);
						}
					} else {
						ProxyManager.test.addItem(this.itemData.getCode(), 1);
					}
					break;
			}
		}
		ToolTipManager.hide();
	}

	/**
	 * 获取基础属性串
	 */
	private getBaseAttr(itemData: ItemData): string {
		var attr: string = "";
		let dict: any = WeaponUtil.getBaseAttrDict(itemData);
		for (let key in dict) {
			let value: string = "";
			if (WeaponUtil.isPercentageAttr(Number(key))) {//有些属性是万分比
				value = `+${Number(dict[key]) / 100}%`;
			} else {
				value = dict[key];
			}
			attr += `${GameDef.EJewelName[key][0]}：${value}`;
			attr += "\n";
		}
		return attr;
	}
}
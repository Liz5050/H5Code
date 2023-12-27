/**物品数据 */
class ItemData {
	/**神装界面没有的装备添加浮动值的特殊处理 */
	public baseAttrAddRateGod: number = 0;
	private _data: any;
	private _itemInfo: any;
	private itemExInfo: any;
	private modelId: number;
	private cdTime: number = -1;
	private itemExpireDt: any;
	private effect: any;
	private _itemAmount: number = -1;
	/**当前强化等级 */
	private _strengthenLevel: number = 0;
	/**显示强化等级，仅用于显示 */
	private _showStrengthenLevel: number = 0;
	/**当前铸造总等级 */
	private _castingLevel: number = 0;
	/**部位显示铸造等级 */
	private _showCastingLevel: number = 0;
	/**精炼总等级 */
	private _refineLevel: number = 0;
	/**配置的物品code */
	private _cfgCode: number = 0;


	public constructor(param: any) {
		if (typeof param === 'number' || typeof param === 'string') {
			this.data = { "itemCode_I": param };
		} else {
			this.data = param;
		}
	}

	/**
	 * @param data SPlayerItem
	 */
	public set data(data: any) {
		if (data) {
			this._data = data;
			this.modelId = 0;
			this._itemInfo = ConfigManager.item.getByPk(Number(data.itemCode_I));
			if (this.itemInfo) {
				var re = /<br>/gi;
				if (this.itemInfo.usageDesc) {
					this.itemInfo.usageDesc = (this.itemInfo.usageDesc as string).replace(re, "\n");
				}
				this.cdTime = this.itemInfo.cdTime;
			}
			this.itemExpireDt = ConfigManager.item.getExpireInfo(data.itemCode_I);
			if (data.jsStr_S && data.jsStr_S != "") {
				let jobj = JSON.parse(data.jsStr_S);
				this.itemExInfo = jobj ? jobj : {};
				// if(this.itemExInfo && this.itemExInfo.type == EEquip.EEquipWing){
				// 	this.modelId = this.itemExInfo.cWingModelId;
				// 	itemInfo = ItemConfig.GetInfoByCode(self.itemExInfo.bWindModel)
				// }
			} else {
				this.itemExInfo = {};
			}
		}
	}

	public get data(): any {
		return this._data;
	}

	public getCategory(): number {
		return this.itemInfo.category;
	}

	public getType(): number {
		if (this.itemInfo.type != null) {
			return this.itemInfo.type;
		}
		return 0;
	}

	public getItemInfo(): any {
		if (!this._itemInfo) {
			Log.trace(Log.TEST, "道具配置获取错误：", this._data.itemCode_I);
			return null;
		}
		return this._itemInfo;
	}

	private get itemInfo(): any {
		if (!this._itemInfo) {
			Log.trace(Log.TEST, "道具配置获取错误：", this._data.itemCode_I);
			return null;
		}
		return this._itemInfo;
	}

	public getItemExtInfo(): any {
		return this.itemExInfo;
	}

	public getItemAmount(): number {
		if (this._itemAmount != -1) {
			return this._itemAmount;
		}
		if (this._data.itemAmount_I != null) {
			return this._data.itemAmount_I;
		}
		return 1;
	}

	public isNeedEffect(): boolean {
		let flag: boolean = true;
		let clr: number = this.getColor();
		if (clr == EColor.EColorPurple) { //紫色物品配置了才显示特效;其他默认显示
			let info: any = this.getItemInfo();
			flag = info && info.showEffect;
		}
		return flag;
	}

	/**
	 * 是否需要快速使用
	 */
	public get isQuickUse(): boolean {
		if (this.itemInfo) {
			return this.itemInfo.quickUseTip == 1;
		}
		return false;
	}

	public set itemAmount(itemAmount: number) {
		this._itemAmount = itemAmount;
	}

	public getUid(): string {
		return this._data.uid_S;
	}
	/**获取装备的排序等级 */
	public getOrderLevel(): number {
		let lv: number = 0;
		let r: number = this.getRebirthTimes();
		if (r > 0) {
			lv = r;
		} else {
			lv = this.getLevel();
		}
		return lv;
	}
	public getLevel(): number {
		if (this.itemInfo && this.itemInfo.level) {
			return this.itemInfo.level;
		}
		return 0;
	}

	public getItemLevel(): number {
		if (this.itemInfo && this.itemInfo.itemLevel) {
			return this.itemInfo.itemLevel;
		}
		return 0;
	}

	public getNewItemLevel(): number {
		if (this.itemInfo.newItemLevel) {
			return this.itemInfo.newItemLevel;
		}
		return 0;
	}

	public isGodEquipType(): boolean {
		if (this.itemInfo.godEquipType) {
			return true;
		}
		return false;
	}

	/**九黎装备类型 */
	public isShuraEquipType(): boolean {
		if (this.itemInfo.equipType && this.itemInfo.equipType == EEquipType.EEquipTypeJiuli) {
			return true;
		}
		return false;
	}

	public setPosType(value: number): void {
		if (this.data) {
			this.data.posType_I = value;
		}
	}

	public getPosType(): number {
		if (this.data) {
			return this.data.posType_I;
		}
		return -1;
	}

	public getIconRes(): string {
		if (this.itemInfo) {
			return URLManager.getIconUrl(this.itemInfo.icon, URLManager.ITEM_ICON)
		}
		return "";
	}

	public getColorRes(): string {
		if (this.itemInfo) {
			//return URLManager.getPackResUrl(PackNameEnum.Common, `color_${this.itemInfo.color}`);
			return URLManager.getItemColorUrl(`color_${this.itemInfo.color}`);
		}
		return "";
	}

	public getAncientRes(lv: number): string {
		if (lv > 0) {
			return URLManager.getItemColorUrl(`itembg${lv}`);
		}
		return "";
	}

	public getColor(): number {
		return this.itemInfo.color;
	}

	public setCfgCode(value: number) {
		this._cfgCode = value;
	}

	/**
	 * 获取实际配置的code
	 * 因为装备有职业映射,最后配置的code会是映射出来的code
	 *  */
	public getCfgCode(): number {
		if (this._cfgCode == 0) {
			return this.getCode();
		}
		return this._cfgCode;
	}

	public getCode(): number {
		return this.itemInfo.code;
	}

	public getUsageDesc(): string {
		return this.itemInfo.usageDesc;
	}

	public getUseFlag(): number {
		return this.itemInfo.useFlag;
	}

	public getAddSkills(): string {
		return this.itemInfo.addSkills;
	}

	/**是否每天有使用次数限制 */
	public isDayNumLimit():boolean{		
		if(this.itemInfo.dayUseNum){
			return true;
		}
		return false;
	}

	public getName(isColor: boolean = false): string {
		var name: string = this.getItemInfo().name;
		if (isColor) {
			name = `<font color="${Color.ItemColor[this.getColor()]}">${name}</font>`
		}
		return name;
	}

	public getColorString(str: string): string {
		return `<font color="${Color.ItemColor[this.getColor()]}">${str}</font>`
	}

	public getOverlay(): number {
		if (this.itemInfo) {
			return this.itemInfo.overlay;
		}
		return 0;
	}

	/**
	 * @returns 0 通用
	 */
	public getCareer(): number {
		var career: number = 0;
		if (this.itemInfo.career) {
			return this.itemInfo.career;
		}
		return career;
	}

	/**获取装备技能添加的战力 */
	public getAddSkillWarfare(): number {
		let warfare: number = 0;
		let itemInfo: any = this.getItemInfo();
		if (itemInfo) {
			let addSkill: number = ObjectUtil.getConfigVal(itemInfo, "addSkill", 0);
			if (addSkill > 0) {
				let skillInfo: any = ConfigManager.skill.getByPk(addSkill);
				warfare = skillInfo && skillInfo.warfare ? skillInfo.warfare : 0;
			}
		}
		return warfare;
	}

	/**
	 * 获取装备需要的转生
	 */
	public getRebirthTimes(): number {
		let rebirth: number = 0;
		let itemCareer: number = this.getCareer();
		rebirth = CareerUtil.getRebirthTimes(itemCareer);
		return rebirth;
	}

	/**
	 * 获取基础属性浮动 百分率(装备才有)
	 */
	public getBaseAttrAddRate(): number {
		if (this.baseAttrAddRateGod != 0) {
			return this.baseAttrAddRateGod;//神装界面特殊处理
		}
		var baseAttrAddRate: number = 0;
		let uids: string = this.getUid();
		if (ItemsUtil.isEquipItem(this) && uids) { //2018年9月6日10:38:17 没有获得的装备 不显示浮动值
			//如果是玩家背包和人物背包没有的装备,而且红色读最大浮动值
			let type: number = this.getType();
			if (this.itemExInfo && this.itemExInfo.baseAttrAddRate != null) {
				baseAttrAddRate = this.itemExInfo.baseAttrAddRate;
			} else if (!WeaponUtil.isSpecialTipsEquip(type) && (this.getColor() == EColor.EColorRed || this.isShuraEquipType() || type == EEquip.EEquipHeartLock)) {
				baseAttrAddRate = ConfigManager.const.getConstValue("RedEquipAttrAddRandomZone");
			}
		}

		return baseAttrAddRate;
	}

	/**装备获取角色索引(只有角色背包的物品有实际效果) */
	public getRoleIndex(): number {
		var index: number = 0;
		if (this.itemExInfo && this.itemExInfo.realRoleIndex) {
			index = this.itemExInfo.realRoleIndex;
		}
		return index;
	}
	/**
	 * 根据基础职业获取属于哪个角色的装备(-1表示通用所有角色,也就是配置的基础职业是0)
	 */
	public getBaseRoleIndex(): number {
		var index: number = -1;
		var career: number = this.getCareer();
		if (career > 0) {
			career = career % CareerUtil.Career_Divisor;
			index = CacheManager.role.getRoleIndex(career);
		}
		return index;
	}

	public getStrengthenLevel(): number {
		if (this.itemExInfo.strengthen) {
			return this.itemExInfo.strengthen;
		}
		return 0;
	}

	/**
	 * 获取装备宝石等级
	 */
	public getStoneLevel(): number {
		let level: number = 0;
		if (this.itemExInfo.hole) {
			let holeData: Array<any> = this.itemExInfo.hole;
			for (let value of holeData) {
				if (value) {
					level += ConfigManager.item.getByPk(value).itemLevel;
				}
			}
		}
		return level;
	}

	/**
	 * 获取装备最低宝石等级
	 */
	public getStoneMinLevel(): number {
		let level: number = 100;
		if (this.itemExInfo.hole) {
			let holeData: Array<any> = this.itemExInfo.hole;
			for (let i = 1; i < this.itemInfo.jewelNumMax + 1; i++) {
				if (holeData[i]) {
					level = level > ConfigManager.item.getByPk(holeData[i]).itemLevel ? ConfigManager.item.getByPk(holeData[i]).itemLevel : level;
				}
				else {
					return 0;
				}
			}
			return level;
		}
		return 0;
	}

	/**
	 * 是否已达到最大强化等级
	 */
	public isStrengthenMax(): boolean {
		return this.getStrengthenLevel() >= this.itemInfo.strengthenMax;
	}

	/**
	 * 获取生效的强化等级
	 */
	public getEnabledStrengthenLevel(): number {
		if (this.isStrengthenMax()) {
			return this.itemInfo.strengthenMax;
		}
		return this.getStrengthenLevel();
	}

	/**
	 * 获取熟练度
	 */
	public getLucky(): number {
		if (this.itemExInfo.lucky) {
			return this.itemExInfo.lucky;
		}
		return 0;
	}

	public get isBind(): boolean {
		if (this.itemInfo.bind) {
			return true;
		}
		return false;
	}

	/**
	 * 获取效果
	 */
	public getEffect(): number {
		if (this.itemInfo.effect != null) {
			return this.itemInfo.effect;
		}
		return 0;
	}

	/**
	 * 获取效果
	 */
	public getEffectEx(): number {
		if (this.itemInfo.effectEx != null) {
			return this.itemInfo.effectEx;
		}
		return 0;
	}

	/**
	 * 获取效果
	 */
	public getEffectEx2(): number {
		if (this.itemInfo.effectEx2 != null) {
			return this.itemInfo.effectEx2;
		}
		return 0;
	}

	/**
	 * 获取效果
	 */
	public getGainDesc(): string {
		if (this.itemInfo.gainDesc != null) {
			return this.itemInfo.gainDesc;
		}
		return "";
	}

	/**
	 * 获取宠物经验
	 */
	public getPetExp(): number {
		if (this.itemInfo.petExp != null) {
			return this.itemInfo.petExp;
		}
		return 0;
	}

	/**
	 * 获取外形
	 */
	public getShape(): number {
		if (this.itemInfo.shape) {
			return this.itemInfo.shape;
		}
		return 0;
	}

	/**
	 * 获取外形
	 */
	public getModelId(career: number = -1): number {
		if (this.itemInfo.modelIdList && career != -1) {
			let idDict: any = ItemsUtil.getModelIdDict(this.itemInfo.modelIdList);
			let modelId: number = idDict[CareerUtil.getBaseCareer(career)];
			if (modelId) {
				return modelId;
			}
			// return this.itemInfo.shape;
		} else if (this.itemInfo.modelId) {
			return this.itemInfo.modelId;
		}
		return 0;
	}

	public getDesc(): string {
		var re = /<br>/gi;
		let desc: string = this.itemInfo.descStr;
		let desc2: string = this.itemInfo.descStr2;
		if (desc == null) {
			desc = "";
		}
		if (desc2 == null) {
			desc2 = "";
		}
		desc = (desc + desc2).replace(re, "\n");
		return desc;
	}

	/**
	 * 是否已过期
	 */
	public get isExpire(): boolean {
		if (ItemsUtil.isEquipSpritItem(this)) {
			return CacheManager.serverTime.getServerTime() > this.itemExInfo["exist"];
		} else if (ItemsUtil.isWingUpLevelItem(this) || ItemsUtil.isWingUpgradeItem(this)
			|| ItemsUtil.isPetUpItem(this)
			|| ItemsUtil.isLawUpItem(this)
			|| ItemsUtil.isDragonScaleUpItem(this)) {
			//直升丹当天有效
			let serverDate: Date = new Date(CacheManager.serverTime.getServerTime() * 1000);
			let createDate: Date = new Date(this.pidt * 1000);
			return serverDate.getFullYear() != createDate.getFullYear() || serverDate.getMonth() != createDate.getMonth() || serverDate.getDay() != createDate.getDay();

		} else {
			if (this.itemExpireDt != null) {
				return CacheManager.serverTime.getServerTime() > this.itemExpireDt;
			}
		}

		return false;
	}

	public get sellPrice(): number {
		if (this.itemInfo.sellPrice != null) {
			return this.itemInfo.sellPrice;
		}
		return 0;
	}

	public get sellUnit(): number {
		if (this.itemInfo.sellUnit != null) {
			return this.itemInfo.sellUnit;
		}
		return 0;
	}

	public get sellUnitName(): string {
		let sellUnit: number = this.sellUnit;
		let name: string = "";
		if (sellUnit != 0) {
			if (sellUnit > 10000) {//物品
				let itemData: ItemData = new ItemData(sellUnit);
				name = itemData.getName(true);
			} else {
				name = GameDef.EPriceUnitName[sellUnit];
			}
		}
		return name;
	}

	/**物品创建时间，秒 */
	public get pidt(): number {
		if (this.itemExInfo.pidt != null) {
			return this.itemExInfo.pidt;
		}
		return 0;
	}

	/**
	 * 是否为背包中当前位置最高评分的装备
	 */
	public get isBestEquipInPack(): boolean {

		if (this.getUid() != null && ItemsUtil.isEquipItem(this)) {//自己拥有的装备
			let pos: EDressPos = ItemsUtil.getEqiupPos(this);
			if (pos != -1) {
				var roleIndex: number = this.getBaseRoleIndex();
				var flag: boolean = false;
				if (roleIndex == -1) {
					//检查各个角色
					for (let index in RoleIndexEnum.RoleIndexAll) {
						flag = this.checkBestEquipInPack(pos, roleIndex);
						if (flag) {
							break;
						}
					}
				} else {
					flag = this.checkBestEquipInPack(pos, roleIndex);
				}
				let et: number = egret.getTimer();
				return flag;
			}


		}
		return false;
	}

	private checkBestEquipInPack(pos, roleIndex): boolean {
		var bestItemData: ItemData = CacheManager.pack.backPackCache.getBestScoreEquip(pos, roleIndex);
		var equiped: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(pos);
		var flag: boolean = bestItemData != null && bestItemData.getUid() == this.getUid() && WeaponUtil.getScoreBase(bestItemData) > WeaponUtil.getScoreBase(equiped) && !this.isExpire;
		return flag;
	}

	/**获取镶嵌宝石的颜色 */
	public getStoneColor(): number {
		switch (this.getType()) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
				return EProp.EPropJewelAdvance;
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
				return EProp.EPropGuildBeastFood;
		}

	}

	/**
	 * 捐献获得的仓库积分
	 */
	public getCredit(): number {
		if (this.itemInfo.credit != null) {
			return this.itemInfo.credit;
		}
		return 0;
	}

	public getCareerMap(): string {
		return this.itemInfo.careerMap;
	}

	public set strengthenLevel(strengthenLevel: number) {
		this._strengthenLevel = strengthenLevel;
	}

	public get strengthenLevel(): number {
		return this._strengthenLevel;
	}

	public set refineLevel(level: number) {
		this._refineLevel = level;
	}

	public get refineLevel(): number {
		return this._refineLevel;
	}

	public set showStrengthenLevel(showStrengthenLevel: number) {
		this._showStrengthenLevel = showStrengthenLevel;
	}

	public get showStrengthenLevel(): number {
		return this._showStrengthenLevel;
	}

	public set castingLevel(level: number) {
		this._castingLevel = level;
	}

	public get castingLevel(): number {
		return this._castingLevel;
	}

	public set showCastingLevel(level: number) {
		this._showCastingLevel = level;
	}

	public get showCastingLevel(): number {
		return this._showCastingLevel;
	}

	/**
	 * 获得时是否展开显示
	 */
	public get isExpand(): boolean {
		if (this.itemInfo.expand != null) {
			return this.itemInfo.expand == 1;
		}
		return false;
	}

	/**
	 * 是否可以直接在背包中使用
	 */
	public get isCanUseInPack(): boolean {
		if (this.itemInfo.useType != null) {
			return this.itemInfo.useType == 1;
		}
		return false;
	}

	public get beastStrLevel(): number{
		if(this.getItemExtInfo().strLevel){
			return this.getItemExtInfo().strLevel;
		}
		return 0;
	}

	/**
	 * 基础属性，有配置读这个，没配读base开头字段
	 */
	public get baseAttrList(): string {
		if(this.itemInfo.baseAttrList){
			return this.itemInfo.baseAttrList;
		}
		return "";
	}

	/**
	 * 极品属性
	 */
	public get bestAttrList(): string {
		if(this.itemInfo.bestAttrList){
			return this.itemInfo.bestAttrList;
		}
		return "";
	}
}
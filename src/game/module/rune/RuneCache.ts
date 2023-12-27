class RuneCache implements ICache {
	private playerInlayData: any;
	/**符文镶嵌类型 */
	private inlayTypes: any;
	private selectedInlay: any;

	public decomIndexSel: any = {};//{index: true/false}

	public constructor() {
	}

	public setData(playerRuneDatas: Array<any>): void {
		let inlayData: Array<any> = [];
		let inlayType: any = {};
		if (!this.playerInlayData) {
			this.playerInlayData = {};
		}
		if (!this.inlayTypes) {
			this.inlayTypes = {};
		}
		for (let playerRune of playerRuneDatas) {
			inlayData = [];
			inlayType = {};
			for (let rune of playerRune.list.data) {
				inlayData.push({ "hole": rune.hole_BY, "open": rune.open_BY, "level": rune.level_SH, "item": rune.item_I });
				if (rune.item_I != 0) {
					inlayType[ConfigManager.item.getByPk(rune.item_I).type] = rune.hole_BY;
				}
			}
			this.playerInlayData[playerRune.index_I] = inlayData;
			this.inlayTypes[playerRune.index_I] = inlayType;
		}
	}

	public setSelected(data: any): void {
		this.selectedInlay = data;
	}

	public get runeData(): any {
		if (this.selectedInlay["item"]) {
			let itemCfg: any = ConfigManager.item.getByPk(this.selectedInlay["item"]);
			return ConfigManager.mgRune.getByPk(`${itemCfg.effect},${this.selectedInlay["level"]}`);
		}
		return null;
	}

	public get nextRuneData(): any {
		if (this.selectedInlay["item"]) {
			let itemCfg: any = ConfigManager.item.getByPk(this.selectedInlay["item"]);
			return ConfigManager.mgRune.getByPk(`${itemCfg.effect},${this.selectedInlay["level"] + 1}`);
		}
		return null;
	}

	public get attrDict(): any {
		if (this.runeData) {
			return WeaponUtil.getAttrDict(this.runeData.attrList);
		}
		return null;
	}

	public get nextAttrDict(): any {
		if (this.nextRuneData) {
			return WeaponUtil.getAttrDict(this.nextRuneData.attrList);
		}
		return null;
	}

	public get needExp(): number {
		if (this.nextRuneData) {
			let nextDecomposeExp: number = this.nextRuneData.decomposeExp ? this.nextRuneData.decomposeExp : 0;
			let decomposeExp: number = this.runeData.decomposeExp ? this.runeData.decomposeExp : 0;
			return nextDecomposeExp - decomposeExp;
		}
		return 0;
	}

	public getCurItem(index: number, hole: number): ItemData{
		let inlayData: Array<any> = this.getInlayData(index);
		let data: any = inlayData[hole - 1];
		let inlayItem: ItemData;
		if (data["item"]) {
			inlayItem = new ItemData(data.item);
		}
		return inlayItem;
	}

	/**符文镶嵌信息 */
	public getInlayData(index: number): Array<any> {
		if (this.playerInlayData && this.playerInlayData[index]) {
			return this.playerInlayData[index];
		}
		return [];
	}

	public getAttrDetailDict(index: number): any {
		let roleInlayData: Array<any> = this.getInlayData(index);
		let cfg: any;
		let runeAttrDict: any;
		let attrDicts: any = {};
		for (let data of roleInlayData) {
			if (data["item"]) {
				let itemCfg: any = ConfigManager.item.getByPk(data["item"]);
				cfg = ConfigManager.mgRune.getByPk(`${itemCfg.effect},${data["level"]}`);
				if (cfg) {
					runeAttrDict = WeaponUtil.getAttrDict(cfg.attrList);
					for (let key in runeAttrDict) {
						if (attrDicts[key]) {
							attrDicts[key] += runeAttrDict[key];
						} else {
							attrDicts[key] = runeAttrDict[key];
						}
					}
				}
			}
		}
		return attrDicts;
	}

	public getAttrDetailStr(attrDict: any): string {
		let str: string = "";
		let attrArr: Array<string> = [];
		for (let key in attrDict) {
			attrArr.push(key);
		}
		attrArr.sort((a: any, b: any): number => {
			return a - b;
		});
		for (let attrKey of attrArr) {
			if (WeaponUtil.isPercentageAttr(Number(attrKey))) {
				str += `${GameDef.EJewelName[attrKey][0]}：   <font color = ${Color.Color_8}>${attrDict[attrKey] / 100}%</font>\n`;
			} else {
				str += `${GameDef.EJewelName[attrKey][0]}：   <font color = ${Color.Color_8}>${attrDict[attrKey]}</font>\n`;
			}
		}
		return str;
	}

	public getInlayItem(): Array<ItemData> {
		let itemDatas: Array<ItemData> = [];
		itemDatas = CacheManager.pack.runePackCache.getRune();
		return itemDatas;
	}

	public hasRuneType(roleIndex: number, itemData: ItemData, hole: number): boolean {
		let inlayType: any;
		if (this.inlayTypes[roleIndex]) {
			inlayType = this.inlayTypes[roleIndex];
			if (!inlayType[itemData.getType()] || inlayType[itemData.getType()] == hole) {//该角色没有镶嵌的属性或者该孔位镶嵌属性
				return false;
			}
		}
		return true;
	}

	public isCanInlay(roleIndex: number, itemData: ItemData, hole: number): boolean {
		if (ConfigManager.mgRuneCopy.isRuneTypeOpen(itemData.getType())) {
			if (!this.hasRuneType(roleIndex, itemData, hole)) {
				return true;
			}
		}
		return false;
	}

	public checkInlayByIndex(index: number): boolean {
		let itemDatas: Array<ItemData> = this.getInlayItem();
		let inlayDatas: Array<any> = this.getInlayData(index);
		for (let inlayData of inlayDatas) {
			if (inlayData["open"] && !inlayData["item"]) {
				for (let itemData of itemDatas) {
					if (this.isCanInlay(index, itemData, inlayData["hole"])) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public checkInlay(): boolean {
		let isOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Rune, false);
		if (isOpen) {
			for (let key in this.playerInlayData) {
				if (this.checkInlayByIndex(Number(key))) {
					return true;
				}
			}
		}
		return false;
	}

	/**是否有同类型更高品质的符文 */
	public isHasHigtRune(inlayRuneInfo: any): boolean{
		let inlayItem: ItemData = new ItemData(inlayRuneInfo.item);
		let itemDatas: Array<ItemData> = this.getInlayItem();
		for (let itemData of itemDatas){
			if(itemData.getType() == inlayItem.getType() && itemData.getColor() > inlayItem.getColor()){
				return true;
			}
		}
		return false;
	}

	public canUpgradeRune(inlayRuneInfo: any): boolean {
		let itemCfg: any = ConfigManager.item.getByPk(inlayRuneInfo.item);
		let curRuneData: any = ConfigManager.mgRune.getByPk(`${itemCfg.effect},${inlayRuneInfo.level}`);
		let nextData: any = ConfigManager.mgRune.getByPk(`${itemCfg.effect},${inlayRuneInfo.level + 1}`);
		let needExp: number = 0;
		if (nextData) {
			needExp = (nextData.decomposeExp ? nextData.decomposeExp : 0) - (curRuneData.decomposeExp ? curRuneData.decomposeExp : 0);
			return MoneyUtil.checkEnough(EPriceUnit.EPriceUnitRuneExp, needExp, false);
		}
		return false;
	}

	/**能否升级或者替换更高品质的装备 */
	public checkUpgradeByIndex(index: number): boolean {
		let inlayData: Array<any> = this.getInlayData(index);
		for (let data of inlayData) {
			if (data["item"]) {
				if (this.canUpgradeRune(data) || this.isHasHigtRune(data)) {
					return true;
				}
			}
		}
		return false;
	}

	public checkUpgrade(): boolean {
		let isOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Rune, false);
		if (isOpen) {
			for (let key in this.playerInlayData) {
				if (this.checkUpgradeByIndex(Number(key))) {
					return true;
				}
			}
		}
		return false;
	}

	public checkRoleTips(index: number): boolean {
		if (this.checkInlayByIndex(index) || this.checkUpgradeByIndex(index)) {
			return true;
		}
		return false;
	}

	public checkTips(): boolean {
		if (this.checkInlay() || this.checkUpgrade()) {
			return true;
		}
		return false;
	}

	public clear(): void {

	}
}
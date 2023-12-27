/**
 * 金钱/资源工具类
 */
class MoneyUtil {
	public constructor() {
	}

	/**
	 * 检测人物金钱是否充足
	 * @param num 数量
	 * @param alert 是否需要提示
	 * @returns true 充足
	 */
	public static checkEnough(unit: EPriceUnit, num: number, alert: boolean = true, onlyBind: boolean = false,alertParam:any=null,alertCb:CallBack=null): boolean {
		let roleCache: RoleCache = CacheManager.role;
        let roleMoney: number = roleCache.getMoney(unit);

		if (unit == EPriceUnit.EPriceUnitGoldBind && !onlyBind) {
            roleMoney += roleCache.getMoney(EPriceUnit.EPriceUnitGold);
		}

		if (roleMoney < num) {
			if (alert) {
				if (unit == EPriceUnit.EPriceUnitGold) {
					MoneyUtil.alertMoney(GameDef.EPriceUnitName[unit],alertParam);
					//Alert.alert(`您的${GameDef.EPriceUnitName[unit]}不足，是否充值？`);
				} else {
					if (unit == EPriceUnit.EPriceUnitGoldBind && !onlyBind) {
						//Alert.alert(`您的${GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGold]}不足，是否充值？`);
						MoneyUtil.alertMoney(GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGold],alertParam);
					} else {
						Tip.showTip(`您的${GameDef.EPriceUnitName[unit]}不足`);
					}

				}
			}
			return false;
		}
		return true;
	}

    public static alertMoney(unitName:string,param:any=null,alertCb:CallBack=null):void{
		AlertII.show(`您的${unitName}不足，是否充值？`,null,
		function (type:AlertType) {
			if(type == AlertType.YES) {
				let index:number = param && param.rechargeFirstIdx!=null?param.rechargeFirstIdx:ViewIndex.Two;
				HomeUtil.openRecharge(index);
				if(alertCb){
					alertCb.fun.call(alertCb.caller,alertCb.param);
				}
			}
		},this);
	}

	public static getMoneyItemCodeByType(type: EPriceUnit): number {
		switch (type) {
			case EPriceUnit.EPriceUnitCoinBind:
				return 41950002;
			case EPriceUnit.EPriceUnitGold:
				return 0;
			case EPriceUnit.EPriceUnitGoldBind:
				return 41950004;
			case EPriceUnit.EPriceUnitHonour:
				return 0;
			case EPriceUnit.EPriceUnitArena:
				return 0;

		}
	}

	/**
	 * 获取资源文本
	 * @param ownedValue 拥有的资源
	 * @param costValue 消耗的资源
	 */
	public static getResourceText(ownedValue: number, costValue: number, prefix: string = "", suffix: string = ""): string {
		let color: string = Color.Color_6;
		if (ownedValue < costValue) {
			color = Color.Color_4;
		}
		return HtmlUtil.html(`${prefix}${ownedValue}/${costValue}${suffix}`, color);
	}

	public static getMoneyName(unit:EPriceUnit):string{
		return GameDef.EPriceUnitName[unit]
	}

	public static getMoneyNameByEProp(type:EProp):string {
		let unit:EPriceUnit;
		if(type == EProp.EPropGold) {
			unit = EPriceUnit.EPriceUnitGold;
		}
		else if(type == EProp.EPropCoinBind) {
			unit = EPriceUnit.EPriceUnitCoinBind;
		}
		if(unit) return MoneyUtil.getMoneyName(unit);
		return "error" + type;
	}

	/**
	 * 检测人物铜钱是否充足
	 * @param alertType 提示类型 true：铜钱获取途径弹框 false：快速购买弹框
	 */
	public static checkCoinEnough(unit: EPriceUnit, num: number, alertType: boolean = true):boolean{
		if(!MoneyUtil.checkEnough(unit, num, false)){
			if(alertType){
				//铜钱获取途径
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, {"itemCode": ItemCodeConst.Coin});
			}else{
				//快速购买
				EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, ItemCodeConst.CoinOfShop);
			}
			return false
		}
		return true;
	}
}
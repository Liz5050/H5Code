/**
 * 奖励工具类
 */
class RewardUtil {

	/**
	 * 获取奖励
	 * @param str 格式 3,60040030,5
	 */
	public static getReward(str: string): ItemData {
		if (str == null || str.length == 0) {
			return null;
		}
		let array: Array<string> = str.split(",");
		let itemData: ItemData = RewardUtil.fmtReward(Number(array[0]),Number(array[1]),Number(array[2].replace("#", "")));		
		return itemData;
	}
	/**
	 * 根据服务器的SReward结构体获取奖励
	 */
	public static getRewardBySReward(sReward:any):ItemData{
		return RewardUtil.fmtReward(sReward.type_I,sReward.code_I,sReward.num_L64);
	}

	/**
	 * 根据服务器的SReward结构体获取奖励
	 */
	public static getRewardByMoneyDic(moneyDic:any):ItemData[]{
		let items:ItemData[] = [];
        if (moneyDic.key_I) {
        	let uint:EPriceUnit;
        	let count:number;
            for (let i = 0; i < moneyDic.key_I.length; i++) {
                uint = moneyDic.key_I[i];
				count = moneyDic.value_I[i];
                items.push(RewardUtil.fmtReward(ETaskRewardType.Money,uint,count));
            }
		}
		return items;
	}

	/**
	 * 格式化奖励
	 * @param type
	 * @param code 如果type是货币 code是 EPriceUnit 
	 * @param type
	 */
	public static fmtReward(type:number,code:number,itemAmount:number):ItemData{
		let itemData: ItemData;
		switch (type) {
			case ETaskRewardType.Exp:
				itemData = new ItemData(ItemCodeConst.Exp);
				break;
			case ETaskRewardType.Money:
				let unit: number = code;
				if (unit == EPriceUnit.EPriceUnitCoinBind) {
					itemData = new ItemData(ItemCodeConst.Coin);
				} else if (unit == EPriceUnit.EPriceUnitGoldBind) {
					itemData = new ItemData(ItemCodeConst.GoldBind);
				} else if (unit == EPriceUnit.EPriceUnitRuneExp) {
					itemData = new ItemData(ItemCodeConst.RuneExp);
				}else if(unit == EPriceUnit.EPriceUnitGold){
					itemData = new ItemData(ItemCodeConst.Gold);
				}	
				else if(unit == EPriceUnit.EPriceUnitRuneCoin) {
					itemData = new ItemData(ItemCodeConst.RuneCoin);
				}else if(unit == EPriceUnit.EPriceUnitTalentExp){
					itemData = new ItemData(ItemCodeConst.TalentExp);
				}
				break;
			case ETaskRewardType.Item:
				itemData = new ItemData(code);
				//装备特殊处理，因为有分职业
				let careerMap: any = itemData.getCareerMap();//有配职业映射
				if (careerMap != null) {
					let codes: Array<string> = (careerMap as string).split("#");
					let baseCareer: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareer());
					if (baseCareer == 1) {
						itemData = new ItemData(Number(codes[0]));
					} else if (baseCareer == 2) {
						itemData = new ItemData(Number(codes[1]));
					} else {
						itemData = new ItemData(Number(codes[2]));
					}
				}
				itemData.setCfgCode(code);
				break;
			case ETaskRewardType.CalExp:
				itemData = new ItemData(ItemCodeConst.Exp);
				//公式计算
				let expCfg: any = ConfigManager.exp.getByPk(CacheManager.role.getRoleLevel());
				itemAmount = Math.floor(expCfg.baseExp * 1.0 * itemAmount / 100);
				break;
		}
		if (itemData != null) {
			itemData.itemAmount = itemAmount;
		}
		return itemData;
	}

	/**
	 * 获取通用奖励
	 * @param str 3,60040030,5#3,60040030,5#
	 */
	public static getStandeRewards(str: string): ItemData[] {
		let retArr: ItemData[] = [];
		let rewards: string[] = str.split("#");
		for (let i: number = 0; i < rewards.length; i++) {
			if(rewards[i]!=""){
				retArr.push(RewardUtil.getReward(rewards[i]));
			}			
		}
		return retArr;
	}

	/**
	 * @param str 41950001#41950006#41950002#;兼容:41950001,2#41950006#41950002# 有数量的
	 */
	public static getRewards(str: string): Array<ItemData> {
		let itemDatas: Array<ItemData> = [];
		if (str != null) {
			let codes: Array<string> = str.split("#");
			for (let itemCode of codes) {
				if (itemCode != "") {
					let codeInf: string[] = itemCode.split(",");
					let code: string = codeInf[0];
					let item: ItemData = new ItemData(code);
					itemDatas.push(item);
					if (codeInf.length == 2 && !isNaN(Number(codeInf[1]))) {
						item.itemAmount = Number(codeInf[1]);
					}
				}
			}
		}
		return itemDatas;
	}
	/**
	 * 格式化奖励串 有职业限制的:code,num,career#...
	 */
	public static getRewardCareer(str: string): ItemData[] {
		var result: ItemData[] = [];
		var arr: string[] = str.split("#");
		for (var i: number = 0; i < arr.length; i++) {
			var itemInf: string[] = arr[i].split(",");
			var career: number = Number(itemInf[2]);
			if (career == 0 || CacheManager.role.getRoleCareer() == career) {
				var item: ItemData = new ItemData(Number(itemInf[0]));
				item.itemAmount = Number(itemInf[1]);
				result.push(item);
			}

		}
		return result;
	}



}
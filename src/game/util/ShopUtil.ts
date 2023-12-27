/**
 * 商城工具类
 */
class ShopUtil {
	public constructor() {
	}

	/**
	 * 限购文本
	 * @param limitType 限购类型
	 * @param vipLevel vip限购等级
	 * @param limitNum 限购数量
	 */
	public static getLimitStr(limitType: number = 0, vipLevel: number = 0, limitNum: number = 0): string{
		let str: string = "";
		let limitStr: string = "";
		if(limitType == 1){
			limitStr = "今日";
		}else if(limitType == 2){
			limitStr = "本周";
		}else if(vipLevel != 0){
			limitStr = `VIP${vipLevel}`;
		}
		if(limitStr != "" && limitNum > 0){
			str = `${limitStr}可购买<font color = ${Color.GreenCommon}>${limitNum}</font>次`;
		}else{
			str = `${limitStr}可购买<font color = ${Color.RedCommon}>${limitNum}</font>次`;
		}
		return str;
	}

	public static getLimitStr2(limitType: number = 0, hasBuyNum: number = 0, limitNum: number = 0): string {
        let str: string = "";
        let limitStr: string = "";
        if(limitType == 1){
            limitStr = LangShop.L1;
        }else if(limitType == 2){
            limitStr = LangShop.L2;
        }else if(limitType == 3){
            limitStr = LangShop.L3;
        }else if(limitType == 4){
            limitStr = LangShop.L8;
        }
        if(limitStr != ""){
            str = App.StringUtils.substitude(limitStr
				, limitNum > 0 ? Color.GreenCommon : Color.RedCommon
                , limitNum
				, hasBuyNum+limitNum
			);
        }
        return str;
	}
}
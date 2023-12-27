/**
 * 符文工具类
 */
class RuneUtil {

	/**
	 * 是否展示符文
	 */
	public static isShowRune(runeType: ERune): boolean{
		if(runeType >= ERune.ERuneAttackAndPassAndLifeEx && runeType <= ERune.ERuneCoinAndExp){
			return false;
		}
		return true;
	}
}
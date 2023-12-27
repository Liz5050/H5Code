/**
 * 添加副本次数的配置 pk=copyType vipLevel
 */
class CopyAddNumConfig extends BaseConfig {
	public constructor() {
		super("t_mg_add_copy_num","copyType,vipLevel");
	}

	/**
	 * 根据副本id和vip等级获取可购买副本次数
	 */
	public getCanAddNum(code:number,vipLv:number = -1):number{
		var n:number = 0;
		vipLv==-1?vipLv = CacheManager.vip.vipLevel:null;
		var copyInf:any = ConfigManager.copy.getByPk(code);
		var pk:string = copyInf.copyType+","+vipLv;
		var cfgInf:any = this.getByPk(pk);
		if(cfgInf && cfgInf.maxAddNum){
			n = cfgInf.maxAddNum;
		}
		return n;
	}

}
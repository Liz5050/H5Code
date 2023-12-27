class MgDelegateConfig extends BaseConfig {
	public constructor() {
		super("t_mg_delegate","copyCode");
	}
	/**
	 * 获取扫荡消耗的元宝
	 * @param copyCode 副本id
	 */
	public getCostGold(copyCode:number):number{
		let gold:number = 0;
		let inf:any = this.getByPk(copyCode);
		if(inf && inf.needGold){
			gold = inf.needGold;
		}
		return gold;
	}

	/**
	 * 是否不需要打 就可以直接扫荡的副本
	 */
	public isOnlyDelegateCopy(code:number):boolean{		
		let inf:any = this.getByPk(code);
		var flag:boolean = inf && inf.type && inf.type==CopyEnum.DELEGATE_TYPE_ONLY;
		return flag;
	}

}
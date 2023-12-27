/**
 * 七天法宝
 */
class SevenDayMagicWeaponCache implements ICache{
	public activeCodes: Array<any> = [];
	private _activeCodeDict: any;
	private isFirst:boolean = true;
	public constructor() {
	}

	public updateActiveCode(codes:number[]):void {
		let oldCodes:number[] = this.activeCodes;
		this.activeCodes = codes;
		if(!this.isFirst) {
			if(oldCodes.length != this.activeCodes.length) {
				EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{type:EShape.EMagicweapon,modelId:this.activeCodes[this.activeCodes.length - 1]});
			}
		}
		this.isFirst = false;
	}

	public getMagicWeaponStatus(data: any): number{
		if(this.isMagicWeaponActived(data.code)){
			return 2;//已激活
		}
		if(ConfigManager.sevenDayMagicWeapon.isSpecialMagicWeapon(data.code)){
			if(CacheManager.welfare2.checkOnline(data.openDay) && this.activeCodes.length == 5){
				return 1;//可激活
			}
		}else{
			if(CacheManager.welfare2.checkOnline(data.openDay) || data.openVip <= CacheManager.vip.vipLevel){
				return 1;//可激活
			}
		}

		return 0;//未达到激活条件
	}

	public isSpecialMagicWeapon(data: any): boolean{
		if(data.code == 6){
			return true;
		}
		return false;
	}

	public isMagicWeaponActived(code: number): boolean{
		if(this.activeCodeDict[code]){
			return true;
		}
		return false;
	}

	public isCanFuse(): boolean{
		if(this.activeCodes.length == 6){
			return true;
		}
		return false;
	}

	public set activeCodeDict(dict: any){
		this._activeCodeDict = dict;
	}

	public get activeCodeDict(): any{
		if(this._activeCodeDict){
			return this._activeCodeDict;
		}
		return {};
	}

	/**
	 * 法宝是否可激活
	 * @param data t_seven_day_magic_weapon的数据
	 */
	public isMagicWeaponCanActived(magicWeaponData: any): boolean{
		if(this.getMagicWeaponStatus(magicWeaponData) == 1){
			return true;
		}
		return false;
	}

	public checkCanActived(): boolean{
		if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.MagicWeapon, false)){
			let datas: Array<any> = ConfigManager.sevenDayMagicWeapon.getDatas();
			for(let data of datas){
				if(this.isMagicWeaponCanActived(data)){
					return true;
				}
			}
		}
		return false;
	}

	/**主界面图标是否显示 */
	public isIconShow(): boolean{
		if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.MagicWeapon, false)){
			if(!this.isCanFuse()){//可以融合时（即全部法宝激活后）不显示
				return true;//七天法宝开启后--融合前 显示
			}
		}
		return false;
	}

	public clear(): void {
		this.isFirst = true;
	}
}
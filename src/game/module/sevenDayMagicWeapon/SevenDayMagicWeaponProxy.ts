class SevenDayMagicWeaponProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 七天法宝数据请求
	 */
	public sevenDayMagicWeapon():void {
		this.send("ECmdGameSevenDayMagicWeapon",{});
	}

	/**
	 * 七天法宝激活
	 */
	public activateSevenDayMagicWeapon(code: number):void {
		this.send("ECmdGameActivateSevenDayMagicWeapon",{"code": code});
	}

	public fuseSevenDayMagicWeapon() : void {
		this.send("ECmdGameMixSevenDayMagucWeapon" , {});
	}
}
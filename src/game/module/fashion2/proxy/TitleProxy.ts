class TitleProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 佩戴称号
	 */
	public useTitle(titleCode:number,roleIndex:number):void {
		this.send("ECmdGameEnableTitle",{titleCode : titleCode,roleIndex : roleIndex});
	}

	/**
	 * 卸下称号
	 */
	public unloadTitle(roleIndex:number):void {
		this.send("ECmdGameHideTitle",{roleIndex:roleIndex});
	}
}
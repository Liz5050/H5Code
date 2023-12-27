class SysSetProxy extends BaseProxy {

	/**
	 * 保存系统设置
	 */
	public save(jsonStr:string):void{
		this.send("ECmdGameSaveSysSetting", {"jsStr": jsonStr});
	}
}
/**
 * 客户端常量配置表。与const_config.json队友
 */
class ClientConst {
	/**x关卡前未自动挑战，增加提示特效 */
	public static CheckPointAutoMcPassPointNum: number;

	public static init(): void {
		let sourceData: any = ConfigManager.Data["const_config"];
		for(let key in sourceData) {
			ClientConst[key] = sourceData[key];
		}
	}
}
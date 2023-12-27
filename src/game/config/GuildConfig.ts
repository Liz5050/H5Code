/**
 * 仙盟配置
 */
class GuildConfig extends BaseConfig{
	public constructor() {
		super("t_guild_config", "level");
	}

	public getVIPIcoUrl():string{
		return URLManager.getModuleImgUrl("V.png",PackNameEnum.GuildNew);
	}
}
/**仙盟篝火配置 */
class GuildFireConfig extends BaseConfig {
    public constructor() {
        super("t_mg_guild_fire", "level");
    }

    public isMaxLevel(level: number): boolean {
        return level == 6;
    }
}
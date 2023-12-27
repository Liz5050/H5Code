/**仙盟心法配置 */
class GuildVeinConfig extends BaseConfig {
    public constructor() {
        super("t_mg_guild_vein", "veinType,level");
    }

    /**获取心法 */
    public getVeines(): Array<any> {
        let veines: Array<number> = [];
        let dict: any = this.getDict();
        for (let s in dict) {
            if (dict[s].level == null) {
                veines.push(dict[s]);
            }
        }
        return veines;
    }

    /**
     * 下一级心法
     * @returns null 已达到最高等级，无下一级
     */
    public getNextVein(veinType: EGuildVeinType, level: number): any {
        if (this.isMaxLevel(level)) {
            return null;
        } else {
            return this.getByPKParams(veinType, level + 1);
        }
    }

    public isMaxLevel(level: number): boolean {
        return level == 400;
    }

    /**
     * 获取心法名称
     * @param {EGuildVeinType} veinType
     * @returns {string}
     */
    public getVeinName(veinType: EGuildVeinType): string {
        let cfg: any = this.getByPKParams(veinType, 0);
        if(cfg) {
            return cfg.name;
        }
        return "";
    }
}
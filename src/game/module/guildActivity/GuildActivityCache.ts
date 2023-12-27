/**
 * 仙盟活动
 */
class GuildActivityCache implements ICache {
    /**
     * 心法信息
     */
    private _veinDict: { [roleIndex: number]: { [veinType: number]: number } };

    public constructor() {
    }

    public set sPlayerGuildVeinInfos(sPlayerGuildVeinInfos: any) {
        if (this._veinDict == null) {
            this._veinDict = {};
        }
        let levelDict: any;
        for (let sRoleGuildVeinInfos of sPlayerGuildVeinInfos.roleVeinInfos) {
            levelDict = StructUtil.dictIntIntToDict(sRoleGuildVeinInfos.infos);
            if (this._veinDict[sRoleGuildVeinInfos.index] == null) {
                this._veinDict[sRoleGuildVeinInfos.index] = {}
            }
            for (let veinType in levelDict) {
                this._veinDict[sRoleGuildVeinInfos.index][Number(veinType)] = levelDict[veinType];
            }
        }
    }

    /**
     * 获取心法等级
     * @param {number} roleIndex
     * @param {EGuildVeinType} veinType
     * @returns {number}
     */
    public getVeinLevel(roleIndex: number, veinType: EGuildVeinType): number {
        if (this._veinDict == null || this._veinDict[roleIndex] == null || this._veinDict[roleIndex][veinType] == null) {
            return 0;
        }
        return this._veinDict[roleIndex][veinType];
    }

    /**
     * 心法是否可以提升
     */
    public isVeinCanUpgrade(roleIndex: number, type: EGuildVeinType): boolean {
        return this.isRoleVeinTypeRedTip(roleIndex, type);
    }

    /**
     * 篝火等级
     * @returns {number}
     */
    public get fireLevel(): number {
        if (CacheManager.guildNew.playerGuildInfo && CacheManager.guildNew.playerGuildInfo.fireLevel_I != null) {
            return CacheManager.guildNew.playerGuildInfo.fireLevel_I;
        }
        return 0;
    }

    /**
     * 篝火经验
     * @returns {number}
     */
    public get fireExp(): number {
        if (CacheManager.guildNew.playerGuildInfo && CacheManager.guildNew.playerGuildInfo.fireExp_I != null) {
            return  CacheManager.guildNew.playerGuildInfo.fireExp_I;
        }
        return 0;
    }

    /**
     * 活动红点。心法可升级、盛会有道具
     * @returns {boolean}
     */
    public get isActivityRedTip(): boolean {
        return this.isVeinRedTip || this.isFireRedTip;
    }

    public get isVeinRedTip(): boolean {
        for (let i: number = 0; i < CacheManager.role.roles.length; i++) {
            if (this.isRoleVeinRedTip(i)) {
                return true;
            }
        }
        return false;
    }

    public isRoleVeinRedTip(roleIndex: number): boolean {
        for (let i: number = 1; i <= 3; i++) {//心法类型
            if (this.isRoleVeinTypeRedTip(roleIndex, i)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 角色指定心法是否需要红点
     * @param {number} roleIndex
     * @param {EGuildVeinType} type
     * @returns {boolean}
     */
    public isRoleVeinTypeRedTip(roleIndex: number, type: EGuildVeinType): boolean {
        let level = this.getVeinLevel(roleIndex, type);
        if (ConfigManager.guildVein.isMaxLevel(level)) {
            return false;
        }
        let cfg = ConfigManager.guildVein.getByPKParams(type, level);
        if (CacheManager.guildNew.playerGuildInfo && CacheManager.guildNew.playerGuildInfo.contribution_I >= cfg.costContribution &&
            MoneyUtil.checkEnough(EPriceUnit.EPriceUnitCoinBind, cfg.costCoin, false)) {
            if (!this.isUpgradeLimited(roleIndex, type)) {//没达到升级限制
                return true;
            }
        }
        return false;
    }

    public get isFireRedTip(): boolean {
        let isMaxLevel: boolean = ConfigManager.guildFire.isMaxLevel(this.fireLevel);
        let itemNum: number = CacheManager.pack.propCache.getItemCountByFun(ItemsUtil.isGuildFireWood, ItemsUtil);
        return !isMaxLevel && itemNum > 0;
    }

    /**
     * 是否到达提升限制。仙盟等级限制。
     */
    public isUpgradeLimited(roleIndex: number, type: EGuildVeinType): boolean {
        let level: number = this.getVeinLevel(roleIndex, type);
        let nextCfg: any = ConfigManager.guildVein.getByPKParams(type, level + 1);//需要判断是否可以升到下一级
        if (CacheManager.guildNew.playerGuildInfo.level_BY < nextCfg.guildLevelLimited) {
            return true;
        }
        return false;
    }

    public clear(): void {

    }
}
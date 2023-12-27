/**
 * 仙盟活动
 */
class GuildActivityController extends BaseController {
    private module: GuildActivityModule;

    public constructor() {
        super(ModuleEnum.GuildActivity);
    }

    protected initView(): any {
        this.module = new GuildActivityModule();
        return this.module;
    }

    protected addListenerOnInit(): void {
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGuildPlayerVeinInfos], this.onGuildPlayerVeinInfos, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGuildDonateFirewood], this.onGuildDonateFirewood, this);
        this.addListen0(NetEventEnum.moneyCoinBindUpdate, this.onMoneyCoinUpdate, this);
    }

    protected addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.GuildVeinUpgrade, this.guildVeinUpgrade, this);
        this.addListen1(LocalEventEnum.GuildDonateFirewood, this.guildDonateFirewood, this);
        this.addListen1(LocalEventEnum.GuildNewPlayerGuildInfoUpdate, this.onGuildPlayerInfoUpdate, this);

        this.addListen1(NetEventEnum.packPosTypePropChange, this.onPropPackChange, this);
    }

    /**
     * 心法信息推送
     * @param data S2C_SPlayerGuildVeinInfos
     */
    private onGuildPlayerVeinInfos(data: any): void {
        // data.roleVeinInfos
        CacheManager.guildActivity.sPlayerGuildVeinInfos = data;
        if (this.isShow) {
            this.module.updateCurrent();
        }
    }

    /**
     * 升级心法
     */
    private guildVeinUpgrade(data: any): void {
        if (data != null) {
            ProxyManager.guild.upgradeVeinNew(data.level, data.veinType, data.roleIndex);
        }
    }

    /**
     * 捐献柴火
     */
    private guildDonateFirewood(data: any): void {
        if (data != null) {
            ProxyManager.guild.donateFirewood(data.num);
        }
    }

    /**
     * 仙盟信息更新了
     */
    private onGuildPlayerInfoUpdate(): void {
        this.module.updateCurrent();
    }

    /**
     * 道具更新
     */
    private onPropPackChange(): void {
        this.module.onPropPackChange();
    }

    /**
     * 捐献柴火返回
     * @param data S2C_SDonateFirewood
     */
    private onGuildDonateFirewood(data: any = null): void {
        let usedNum: number = data.realNum;//实际使用的柴火个数
        let perExp: number = ConfigManager.const.getConstValue("DonateFirewoodExpReward");
        let perContribution: number = ConfigManager.const.getConstValue("DonateFirewoodContributionReward");
        if(ConfigManager.guildFire.isMaxLevel(CacheManager.guildActivity.fireLevel)){
            Tip.showRollTip(`个人仙盟贡献+${usedNum * perContribution}`);
        }else{
            Tip.showRollTip(`仙盟总篝火值+${usedNum * perExp}， 个人仙盟贡献+${usedNum * perContribution}`);
        }
        
    }

    private onMoneyCoinUpdate(): void {
        if(this.isShow) {
            this.module.updateCurrent();
        }
    }
}
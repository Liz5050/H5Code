/**
 * 仙盟活动
 */
class GuildActivityModule extends BaseTabModule {

    public constructor() {
        super(ModuleEnum.GuildActivity);
        this.indexTitle = false;
    }

    public initOptUI(): void {
        super.initOptUI();
        this.className = {
            [PanelTabType.GuildVein]:["GuildVeinPanel", GuildVeinPanel, PackNameEnum.GuildVein], 
            [PanelTabType.GuildBonfire]:["GuildBonfirePanel", GuildBonfirePanel, PackNameEnum.GuildBonfire]
        };
        this.tabBgType = TabBgType.High;
    }

    protected updateSubView(): void {
        if (this.curPanel instanceof GuildVeinPanel) {
            this.tabBgType = TabBgType.Default;
        } else if (this.curPanel instanceof GuildBonfirePanel) {
            this.tabBgType = TabBgType.None;
        }
    }

    public updateAll(data: any = null): void {
        this.checkRedTip();
    }

    public onPropPackChange(): void {
        if (this.curPanel instanceof GuildBonfirePanel) {
            this.curPanel.updateCurrent();
        }
        this.checkRedTip();
    }

    public updateCurrent(): void {
        if (this.curPanel instanceof GuildVeinPanel) {
            this.curPanel.updateCurrent();
        } else if (this.curPanel instanceof GuildBonfirePanel) {
            this.curPanel.updateAll();
        }
        this.checkRedTip();
    }

    private checkRedTip(): void {
        this.setBtnTips(PanelTabType.GuildVein, CacheManager.guildActivity.isVeinRedTip);
        this.setBtnTips(PanelTabType.GuildBonfire, CacheManager.guildActivity.isFireRedTip);
    }
}
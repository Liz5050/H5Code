/**
 * 登录奖励图标
 */
class LoginRewardIcon extends fairygui.GButton {
    private iconLoader: GLoader;
    private mc: UIMovieClip;
    private days: Array<number> = [3, 5, 10];
    private iconId: number = 1;

    public constructor() {
        super();
        this.addClickListener(this.click, this);
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.iconLoader = this.getChild("loader_icon") as GLoader;
        this.showEffect();
    }

    public updateAll(): void {
        if (CacheManager.welfare2.isLoginRewardGot(3)) {
            for (let day of this.days) {
                if (CacheManager.welfare2.isLoginRewardGot(day)) {
                    this.iconId = day;
                }
            }
        } else {
            this.iconId = 1;
        }
        this.iconLoader.load(URLManager.getModuleImgUrl(`icon/${this.iconId}.png`, PackNameEnum.Welfare2));
        CommonUtils.setBtnTips(this, CacheManager.welfare2.checkLoginRewardTips());
    }

    private showEffect(): void {
        if (!this.mc) {
            this.mc = UIMovieManager.get(PackNameEnum.MCHomeIcon);
            this.mc.setScale(0.97, 0.97);
            this.mc.x = -this.width / 2 + 15;
            this.mc.y = -this.height / 2 + 20;
        }
        this.addChild(this.mc);
    }

    private click(): void {
        this.removeEffect();
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Welfare2, { "tabType": PanelTabType.LoginReward });
    }

    private removeEffect(): void {
        if (this.mc) {
            this.mc.removeFromParent();
        }
    }
}
/**
 * 主界面好友按钮
 */
class HomeFriendIcon extends fairygui.GButton {
    private c1: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController("c1");

        this.addClickListener(this.click, this);
    }

    public updateStatus(): void {
        let isRedTip: boolean = CacheManager.friend.checkTips() || CacheManager.friend.isShowMail;
        CommonUtils.setBtnTips(this, isRedTip);
        this.isHasNewMail = CacheManager.friend.isShowMail;
    }

    public get isHasNewMail(): boolean {
        return this.c1.selectedIndex == 1;
    }

    public set isHasNewMail(value: boolean) {
        this.c1.selectedIndex = value ? 1:  0;
    }

    private click(): void {
        if (this.isHasNewMail) {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Friend, {"tabType": PanelTabType.FriendMail});
        } else {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Friend);
        }
    }
}
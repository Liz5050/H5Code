/**
 * 跨服BOSS标签
 * @author Chris
 */
class CrossBossPanel extends BaseTabView {

    public static POS:any[] = [[240, 350], [90, 90], [430, 80], [440, 550], [90, 584], [105, 584], [10, 320]];
    private static POS_LOCAL:any[] = [[70, 455], [410, 455], [240, 170]];
    private bossOwnTimeTxt: fairygui.GRichTextField;
    private collectTimeTxt: fairygui.GRichTextField;
    private txt_boss_assist:fairygui.GRichTextField;
    private itemList:CrossBossItem[];
    private container: fairygui.GComponent;
    private lastList:any[];

    public constructor() {
        super();
    }

    public initOptUI(): void {
        // this.c1 = this.getController('c1');
        this.container = this.getGObject("container").asCom;
        this.collectTimeTxt = this.getGObject("txt_collect").asRichTextField;
        this.bossOwnTimeTxt = this.getGObject("txt_boss_own").asRichTextField;
        this.txt_boss_assist = this.getGObject("txt_boss_assist").asRichTextField;
    }

    public updateAll(data?: any): void {
        let bossList:any[] = CacheManager.crossBoss.getBossListByType(this.tabType);
        if (this.listChange(bossList, this.lastList)) {
            let item:CrossBossItem;
            if (!this.itemList)
                this.itemList = [];
            else {
                while (this.itemList.length > bossList.length) {
                    item = this.itemList.pop();
                    item.removeClickListener(this.onClickItem, this);
                    item.dispose();
                }
            }

            let posArr:any[] = this.tabType == PanelTabType.CrossBoss ? CrossBossPanel.POS_LOCAL : CrossBossPanel.POS;
            for (let i = 0; i < bossList.length; i++) {
                item = this.itemList[i] || fairygui.UIPackage.createObject(PackNameEnum.CrossBoss,"CrossBossItem") as CrossBossItem;
                item.updateAll(bossList[i], i);
                item.x = posArr[i][0];
                item.y = posArr[i][1];
                item.addClickListener(this.onClickItem, this);
                this.container.addChild(item);
                if (!this.itemList[i]) this.itemList.push(item);
            }
            this.lastList = bossList;
        } else {
            this.updateBossListCD();
        }
        this.updateBossLeftTimes();
    }

    public updateBossListCD(): void {
        if (this.itemList)
            for (let item of this.itemList) {
                item.updateRefreshDt();
            }
    }

    public updateBossLeftTimes():void {
        let roleInfo:any = CacheManager.role.role;
        this.collectTimeTxt.text = App.StringUtils.substitude(LangCrossBoss.LANG1, roleInfo.collectTimes_BY);
        this.bossOwnTimeTxt.text = App.StringUtils.substitude(LangCrossBoss.LANG2, roleInfo.bossTimes_BY);
        this.txt_boss_assist.text = App.StringUtils.substitude(LangCrossBoss.LANG25, roleInfo.coTimes_BY);
    }

    private onClickItem(evt:TouchEvent) {
        let item:any = evt.target;
        if (CacheManager.role.getRoleState() < item.minRoleState) {
            Tip.showTip(App.StringUtils.substitude(LangCrossBoss.LANG8, item.minRoleState));
            return;
        }
        EventManager.dispatch(UIEventEnum.CrossBossShowOpen, item.getData());
    }

    private listChange(newList:any[], oldList:any[]) {
        return !this.itemList || this.itemList.length != newList.length || newList != oldList || checkListChange();
        function checkListChange():boolean {
            let bossA:any;
            let bossB:any;
            for (let i=0;i < newList.length;i++) {
                bossA = newList[i];
                bossB = oldList[i];
                if (bossA.bossCode_I != bossB.bossCode_I) return false;
                if (bossA.type_I != bossB.type_I) return false;
            }
            return true;
        }
    }
}
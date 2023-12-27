/**
 * 传奇之路-组队副本
 * @author Chris
 */
class CopyHallLegendPanel extends BaseTabView {
    public static SHIELD:boolean = true;
    private listCopy: List;

    public static showDatas:any[] = [];
    private tipBtn: fairygui.GButton;

    public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
        super();
    }

    public initOptUI(): void {
        //---- script make start ----
        this.listCopy = new List(this.getGObject("list_copy").asList);
        this.listCopy.list.foldInvisibleItems = true;
        this.listCopy.list.scrollItemToViewOnClick = false;

        this.listCopy.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
    }

    public updateAll(data?: any): void {
        let copys:any[] = ConfigManager.copy.getCopysByType(ECopyType.ECopyLegend);
        if (CopyHallLegendPanel.SHIELD) copys && (copys = copys.slice(0, 4));//暂时屏蔽最后一个
        let activateCopyCode:number = CopyUtils.getFirstStarNoFullCopyCode(CopyEnum.CopyLegend, ECopyType.ECopyLegend);
        if (activateCopyCode > 0) {
            for (let copy of copys) {
                if (copy.code == activateCopyCode) {
                    CopyHallLegendPanel.showDatas.push(copy);
                    break;
                }
            }
        }
        if (this.listCopy.list.numItems <= 0) {
            this.listCopy.setVirtual(copys);
        } else {
            this.listCopy.list.refreshVirtualList();
        }
    }

    private onClickItem(evt:fairygui.ItemEvent) {
        let item:LegendCopyItem = (evt.itemObject as LegendCopyItem);
        let clickY:number = item.globalToLocal(evt.stageX, evt.stageY).y;
        if (clickY > 150) return;
        let idx:number = CopyHallLegendPanel.showDatas.indexOf(item.getData());
        if (item.isShow()) {
            if (idx != -1) CopyHallLegendPanel.showDatas.splice(idx, 1);
        } else {
            if (idx == -1) CopyHallLegendPanel.showDatas.push(item.getData());
        }
        this.listCopy.list.refreshVirtualList();
    }

    public hide():void {
        super.hide();
        CopyHallLegendPanel.showDatas.length = 0;
    }
}
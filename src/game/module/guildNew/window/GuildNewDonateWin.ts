/**
 * 捐献窗口
 * @author zhh
 * @time 2018-07-19 10:23:34
 */
class GuildNewDonateWin extends BaseWindow {
    private listDonate:List;

	public constructor() {
		super(PackNameEnum.GuildNewCreate,"GuildNewDonateWin");

	}
	public initOptUI():void{
        //---- script make start ----
        this.listDonate = new List(this.getGObject("list_donate").asList);

        this.listDonate.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----

	}

	public updateAll(data?:any):void{
		let infos:any = ConfigManager.guildDonate.getDonateInfos();
        this.listDonate.setVirtual(infos);
	}

    public checkTips():void {
        this.listDonate.list.refreshVirtualList();
    }
    
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listDonate.list:
                break;

        }
               
    }


}
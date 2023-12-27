/**
 * 申请入会界面
 * @author zhh
 * @time 2018-07-17 11:03:48
 */
class GuildNewSearchListWin extends BaseWindow {
    private btnCreate:fairygui.GButton;
    private btnOneKey:fairygui.GButton;
    private listGuild:List;
    private c1:fairygui.Controller;
    private guilds:any[];
	public constructor() {
		super(PackNameEnum.GuildNewCreate,"GuildNewSearchListWin");

	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.btnCreate = this.getGObject("btn_create").asButton;
        this.btnOneKey = this.getGObject("btn_oneKey").asButton;
        this.listGuild = new List(this.getGObject("list_guild").asList);

        this.btnCreate.addClickListener(this.onGUIBtnClick, this);
        this.btnOneKey.addClickListener(this.onGUIBtnClick, this);
        this.listGuild.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listGuild.list.scrollItemToViewOnClick = false;
        //---- script make end ----

	}

	public updateAll(data?:any):void{
        if(data){
            this.guilds =  data;
        }
        let idx:number = 0;
        if(this.guilds){            
            idx = this.guilds.length>0?0:1;
            this.listGuild.setVirtual(this.guilds);
        }
        this.c1.setSelectedIndex(idx);
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnCreate:
                EventManager.dispatch(LocalEventEnum.GuildNewOpenCreate);
                this.hide();
                break;
            case this.btnOneKey:
                EventManager.dispatch(LocalEventEnum.GuildApplyOneKey);
                break;

        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listGuild.list:
                break;

        }
               
    }


}
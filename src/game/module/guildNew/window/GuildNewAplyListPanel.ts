/**
 * 申请加入公会的列表
 * @author zhh
 * @time 2018-07-18 15:17:07
 */
class GuildNewAplyListPanel extends BaseWindow {
    private txtInput:fairygui.GTextField;
    private btnCheck:fairygui.GButton;
    private listAply:List;
	public constructor() {
		super(PackNameEnum.GuildNewBasics,"GuildNewAplyListPanel")

	}
	public initOptUI():void{
        //---- script make start ----
        this.txtInput = this.getGObject("txt_input").asTextField;
        this.btnCheck = this.getGObject("btn_check").asButton;
        this.listAply = new List(this.getGObject("list_aply").asList);

        this.btnCheck.addClickListener(this.onGUIBtnClick, this);
        this.listAply.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        this.txtInput.addEventListener(egret.FocusEvent.FOCUS_IN,this.onFocusIn,this);
	}
    
	public updateAll(data?:any):void{
        let guildApplys:any[] = data;
        if(guildApplys){
            this.listAply.setVirtual(guildApplys);            
        } 
        this.txtInput.text = CacheManager.guildNew.playerGuildInfo.applyWarfare_L64 + "";
        this.btnCheck.selected = CacheManager.guildNew.playerGuildInfo.enterStatus_BY>0;             
        
	}

    private onFocusIn(e:egret.FocusEvent):void{
        if(this.txtInput.text=="0"){
            this.txtInput.text = "";
        }
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnCheck:
                EventManager.dispatch(LocalEventEnum.GuildNewReqAutoAgree,{isAutoAgree:this.btnCheck.selected});
                break;

        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listAply.list:
                break;

        }
    }

    public hide(param: any = null, callBack: CallBack = null):void{
        super.hide(param,callBack);        
        let fight:number = Number(this.txtInput.text); 
        if(!isNaN(fight) && fight!=CacheManager.guildNew.playerGuildInfo.applyWarfare_L64){
            EventManager.dispatch(LocalEventEnum.GuildNewReqApplySetSave,{level:0,fight:fight});
        }
        EventManager.dispatch(LocalEventEnum.GuildNewReqGuildMember,{guildId:0});
    }


}
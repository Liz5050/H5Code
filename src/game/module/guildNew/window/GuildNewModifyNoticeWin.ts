/**
 * 修改公告的窗口
 * @author zhh
 * @time 2018-07-18 19:31:02
 */
class GuildNewModifyNoticeWin extends BaseWindow {
    private txtNotice:fairygui.GTextField;
    private btnOk:fairygui.GButton;

	public constructor() {
		super(PackNameEnum.GuildNewBasics,"GuildNewModifyNoticeWin")

	}
	public initOptUI():void{
        //---- script make start ----
        this.txtNotice = this.getGObject("txt_notice").asTextField;
        this.btnOk = this.getGObject("btn_ok").asButton;

        this.btnOk.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----

	}

	public updateAll(data?:any):void{
		this.txtNotice.text = CacheManager.guildNew.getNotice();
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnOk:
                if(this.txtNotice.text.length==0){
                    Tip.showTip(LangGuildNew.L14);
                    return;
                }
                if(this.txtNotice.text.length>GuildnewCache.NOTICE_LEN){
                    Tip.showTip(App.StringUtils.substitude(LangGuildNew.L15,GuildnewCache.NOTICE_LEN));
                    return;
                }
                if(ConfigManager.chatFilter.isHasSensitive(this.txtNotice.text)){
                    Tip.showTip(LangGuildNew.L16);
                    return;
                }
                if(this.txtNotice.text!=CacheManager.guildNew.getNotice() ){
                    EventManager.dispatch(LocalEventEnum.GuildNewReqSaveNotice,{content:this.txtNotice.text,isNotice:true,isCost:false});
                }
                this.hide();
                break;

        }
    }

}
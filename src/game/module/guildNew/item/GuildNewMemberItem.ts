/**
 * 成员列表item
 * @author zhh
 * @time 2018-07-18 17:32:43
 */
class GuildNewMemberItem extends ListRenderer {
    private loaderPos:GLoader;
    private loaderIco:GLoader;
    private txtName:fairygui.GTextField;
    private txtVip:fairygui.GTextField;
    private txtContri:fairygui.GTextField;
    private txtFight:fairygui.GTextField;
    private txtOnline:fairygui.GTextField;
    private btnOpt1:fairygui.GButton;
    private btnOpt2:fairygui.GButton;
    private optInfo:any;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderPos = <GLoader>this.getChild("loader_pos");
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtVip = this.getChild("txt_vip").asTextField;
        this.txtContri = this.getChild("txt_contri").asTextField;
        this.txtFight = this.getChild("txt_fight").asTextField;
        this.txtOnline = this.getChild("txt_online").asTextField;
        this.btnOpt1 = this.getChild("btn_opt1").asButton;
        this.btnOpt2 = this.getChild("btn_opt2").asButton;

        this.btnOpt1.addClickListener(this.onGUIBtnClick, this);
        this.btnOpt2.addClickListener(this.onGUIBtnClick, this);
        this.loaderIco.addClickListener(this.onClickIco,this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data; //SGuildPlayer 4685 SPublicMiniPlayer 2708
		this.itemIndex = index;
        this.txtVip.visible = this._data.miniPlayer.vipLevel_BY > 0;
        this.txtName.text = this._data.miniPlayer.name_S;
        this.txtFight.text = "战斗力："+ HtmlUtil.html(this._data.miniPlayer.warfare_L64+"",Color.Color_5);
        this._data.lastLogoutDt_DT
        this.txtContri.text = "贡献度："+HtmlUtil.html(this._data.contribution_I+"","#ffffff");
        this.loaderPos.load(URLManager.getModuleImgUrl("pos_"+this._data.position_I+".png",PackNameEnum.GuildNew));
        this.txtVip.text = "V";//+this._data.miniPlayer.vipLevel_BY;
        var icoUrl: string = URLManager.getPlayerHead(this._data.miniPlayer.career_SH);
        this.loaderIco.load(icoUrl);

        if (this._data.miniPlayer.online_BY) {
            this.txtOnline.text = HtmlUtil.html("在线","#0df14b");
		} else {
			let logoutDt:number = this._data.lastLogoutDt_DT;
			let elapsed:number = CacheManager.serverTime.getServerTime() - logoutDt;
            this.txtOnline.text = HtmlUtil.html(App.DateUtils.getFormatBySecond(elapsed, 4),"#df140f");
		}
        this.txtOnline.visible = CacheManager.guildNew.isCanLevelUp;
        this.optInfo = CacheManager.guildNew.getOptInfo(CacheManager.guildNew.playerGuildInfo.position_BY,this._data.position_I);
        if(this.optInfo){
            this.btnOpt1.text = this.optInfo.lbl1; 
            this.btnOpt2.text = this.optInfo.lbl2; 
            this.btnOpt1.visible = this.optInfo.lbl1!="";
            this.btnOpt2.visible = this.optInfo.lbl2!="";
        }else{
            this.btnOpt1.visible = false;
            this.btnOpt2.visible = false;
        }        

	}
    private onClickIco(e:egret.TouchEvent):void{
        EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.miniPlayer.entityId});
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnOpt1:
                if(this.optInfo && this.optInfo.opt1!=null){
                    this.handlerOpt(this.optInfo.opt1);
                }
                break;
            case this.btnOpt2:
                if(this.optInfo && this.optInfo.opt2!=null){
                    this.handlerOpt(this.optInfo.opt2);
                }
                break;
        }
    }

    private handlerOpt(opt:number):void{        
        EventManager.dispatch(LocalEventEnum.GuildNewReqChangePosition,{miniPlayer:this._data.miniPlayer,opt:opt});
    }


}
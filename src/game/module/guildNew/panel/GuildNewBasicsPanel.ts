/**
 * 新的帮派基础页签内容
 * @author zhh
 * @time 2018-07-16 22:20:34
 */
class GuildNewBasicsPanel extends BaseTabView{
    private loaderBg:GLoader;
    private txtContribute:fairygui.GTextField;
    private txtNotice:fairygui.GTextField;
    private txtInfo:fairygui.GRichTextField;
    private btnContribute:fairygui.GButton;
    private btnLookup:fairygui.GButton;
    private btnModify:fairygui.GButton;
    private listMember:List;
    private lookupEffContainer:fairygui.GComponent;
    private lookEff:UIMovieClip;
	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.txtContribute = this.getGObject("txt_contribute").asTextField;
        let notice_com:fairygui.GComponent = this.getGObject("notice_com").asCom;
        this.txtNotice = notice_com.getChild("txt_notice").asTextField;
        this.txtInfo = this.getGObject("txt_info").asRichTextField;
        this.btnContribute = this.getGObject("btn_contribute").asButton;
        this.btnLookup = this.getGObject("btn_lookup").asButton;
        this.btnModify = this.getGObject("btn_modify").asButton;
        this.listMember = new List(this.getGObject("list_member").asList);
        this.lookupEffContainer = this.getGObject("lookup_eff").asCom;
        

        this.btnContribute.addClickListener(this.onGUIBtnClick, this);
        this.btnLookup.addClickListener(this.onGUIBtnClick, this);
        this.btnModify.addClickListener(this.onGUIBtnClick, this);
        this.listMember.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----

        this.loaderBg.load(URLManager.getModuleImgUrl("basics_bg.png",PackNameEnum.GuildNew));

	}
    public updateAll(param:any = null):void{
        super.updateAll(param);        
        this.upateGuildInfo();
        this.checkDonateTip();
    }

    public checkDonateTip():void {
        CommonUtils.setBtnTips(this.btnContribute, CacheManager.guildNew.checkCanDonateCoin());
    }

    public updateMember(data:any[]):void{
        data.sort(function (a:any,b:any):number{
            if(a.position_I>b.position_I){
                return -1;
            }else if(a.position_I<b.position_I){
                return 1;
            }else if(a.totalContribution_I>b.totalContribution_I){
                return -1;
            }else if(a.totalContribution_I<b.totalContribution_I){
                return 1;
            }
            return 0;
        }); 
        this.listMember.setVirtual(data);
    }
    public upateGuildInfo():void{
        this.btnLookup.visible = CacheManager.guildNew.isCanDealApply;
        let clr1:string = "#f2e1c0";
        let clr2:string = "#f3f232";        
        let info:any = ConfigManager.guild.getByPk(CacheManager.guildNew.playerGuildInfo.level_BY);
        this.txtInfo.text = HtmlUtil.html("名称：",clr1) + HtmlUtil.html(""+CacheManager.guildNew.playerGuildInfo.guildName_S,clr2,true)+
         HtmlUtil.html("等级：",clr1)+HtmlUtil.html(""+CacheManager.guildNew.playerGuildInfo.level_BY,clr2,true)+
         HtmlUtil.html("资金：",clr1)+HtmlUtil.html(""+CacheManager.guildNew.playerGuildInfo.money_I,clr2,true)+
         HtmlUtil.html("人数：",clr1)+HtmlUtil.html(CacheManager.guildNew.playerGuildInfo.playerNum_SH+"/"+info.maxNum,clr2,true);
        this.txtNotice.text = CacheManager.guildNew.getNotice(); 
        this.txtContribute.text = CacheManager.guildNew.playerGuildInfo.contribution_I+"";
        this.btnModify.visible = CacheManager.guildNew.isCanDealApply;
    }

    public updateLookEffect(isAdd:boolean):void{
        if(CacheManager.guildNew.isCanDealApply && isAdd){
            if(!this.lookEff){
                this.lookEff = UIMovieManager.get(PackNameEnum.MCOneKey,0,0,0.5,0.5);
            }
            this.lookupEffContainer.addChild(this.lookEff);
        }else if(this.lookEff){
            UIMovieManager.push(this.lookEff);
            this.lookEff = null;
        }
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnContribute:
                EventManager.dispatch(LocalEventEnum.GuildNewOpenDonateWin);
                break;
            case this.btnLookup:
                if(CacheManager.guildNew.isCanDealApply){
                    EventManager.dispatch(LocalEventEnum.GuildNewOpenLookupAply);
                }
                break;
            case this.btnModify:                
                if(CacheManager.guildNew.isCanDealApply){
                    EventManager.dispatch(LocalEventEnum.GuildNewOpenModifyNotice);
                }
                break;

        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listMember.list:
                break;

        }
               
    }
 
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}
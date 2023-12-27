/**
 * 仙盟管理
 * @author zhh
 * @time 2018-07-19 14:58:59
 */
class GuildNewManagerPanel extends BaseTabView{
    private loaderBg:GLoader;
    private txtDesc:fairygui.GTextField;
    private txtLv:fairygui.GRichTextField;
    private txtMoney:fairygui.GRichTextField;
    private btnUpgrade:fairygui.GButton;
    private listLog:List;
    private progressBar:UIProgressBar;
    private guildCfg:any;
    private guildInfo:any;
	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.txtDesc = this.getGObject("txt_desc").asTextField;
        this.txtLv = this.getGObject("txt_lv").asRichTextField;
        this.txtMoney = this.getGObject("txt_money").asRichTextField;
        this.btnUpgrade = this.getGObject("btn_upgrade").asButton;
        this.listLog = new List(this.getGObject("list_log").asList);
        this.progressBar = <UIProgressBar>this.getGObject("progressBar");
        this.btnUpgrade.addClickListener(this.onGUIBtnClick, this);
        this.listLog.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        this.progressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Common,"progressBar_4"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_4"),300,30,4,4);
        this.progressBar.labelType = BarLabelType.Current_Total;
        this.progressBar.labelSize = 20;
        this.loaderBg.load(URLManager.getModuleImgUrl("manage_bg.png",PackNameEnum.GuildNew));
	}

    public updateAll(param:any = null):void {
        let playerGuildInfo:any = CacheManager.guildNew.playerGuildInfo;
        this.guildInfo = playerGuildInfo;
        this.guildCfg = ConfigManager.guild.getByPk(playerGuildInfo.level_BY);
        this.progressBar.setValue(playerGuildInfo.money_I,this.guildCfg.updateMoney);
        this.txtLv.text = "等级："+HtmlUtil.html(""+playerGuildInfo.level_BY,"#f3f232");
        let isMoneyOk:boolean = this.guildInfo.money_I > this.guildCfg.updateMoney;
        let clr:string = isMoneyOk?Color.GreenCommon:Color.RedCommon;
        this.txtMoney.text = "需要资金："+HtmlUtil.html(""+this.guildCfg.updateMoney,clr);
        this.updateLogs();
        let grayed:boolean = !CacheManager.guildNew.isCanLevelUp;
        App.DisplayUtils.grayButton(this.btnUpgrade,grayed,grayed);
	}

    public updateLogs():void{
        let logs:any[] = CacheManager.guildNew.guildLogs;
        App.ArrayUtils.sortOn(logs,"timestamp_I",true);
        this.listLog.setVirtual(logs);
    }
    
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnUpgrade:
                if (this.guildInfo.money_I < this.guildCfg.updateMoney) {
                    Tip.showTip("仙盟资金不足");
                    return;
                }
                EventManager.dispatch(LocalEventEnum.GuildNewReqUpgradeGuild);                
                /*
                let tip: string = `是否花费<font color="#01AB24">${this.guildCfg.updateMoney}</font>资金升级仙盟？`;
                Alert.info(tip, () => {
                    
                }, this);
                */
                break;

        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listLog.list:
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
/**
 * 运营礼包有背景界面基类
 * @author zhh
 * @time 2018-11-23 15:35:24
 */
class OperatingBgPanel extends BaseTabView{
    private loaderBg:GLoader;
    protected txtFight:fairygui.GRichTextField;
    private btnOpt:fairygui.GButton;
    private listReward:List;
    private btnIcoLdr:GLoader;
    protected rewardType:EShareRewardType;
    protected txtCount:fairygui.GTextField;
    protected txtTime:fairygui.GTextField;
    protected c1:fairygui.Controller;

	public constructor() {
		super();
	}
    
	protected initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.txtFight = this.getGObject("txt_fight").asRichTextField;
        this.btnOpt = this.getGObject("btn_opt").asButton;
        this.listReward = new List(this.getGObject("list_reward").asList);
        this.txtFight.visible = false;
        this.txtCount = this.getGObject("txt_count").asTextField;
        this.txtTime = this.getGObject("txt_time").asTextField;
        this.c1 = this.getController("c1");

        this.btnOpt.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.btnIcoLdr = <GLoader>this.btnOpt.getChild("loader_icon");

	}

	public updateAll(data?:any):void{
        this.loaderBg.load(this.getBgUrl());
        this.btnIcoLdr.load(this.getBtnLblUrl());
        this.listReward.setVirtual(this.getRewards());
	}

    protected getRewards():ItemData[]{
        return ConfigManager.shareReward.getRewardByType(this.rewardType);
    }
    protected doOperating():void{
        if(this.isCanGet()){
            ProxyManager.operation.getPlatformReward(this.rewardType);
        }else{
            Sdk.platformOperation(this.rewardType);
        }
        HomeUtil.close(ModuleEnum.Operating);
    }
    protected isCanGet():boolean{
        return false;
    }
    protected getBgUrl():string{
        let name:string = PanelTabType[this._tabType].toLowerCase();
        return URLManager.getModuleImgUrl(`${name}.jpg`,PackNameEnum.Operating);
    }

    protected getBtnLblUrl():string{
        let name:string = PanelTabType[this._tabType].toLowerCase();
        return URLManager.getModuleImgUrl(`${name}.png`,PackNameEnum.Operating);
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        this.doOperating();
    }
    	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}
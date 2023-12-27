/**
 * 平台sdk相关奖励展示界面基类
 * @author zhh
 * @time 2018-08-02 14:46:06
 */
class BasePlatformWindow extends BaseWindow {
    private loaderBg:GLoader;
    private btnReward:fairygui.GButton;
    private listReward:List;
	protected rewardType:EShareRewardType;

	public constructor(pkgName: string, contentName: string="Main") {
		super(pkgName,contentName);
		this.isPopup = true;
		this.isForceCloseObj = true;
		this.isShowCloseObj = true;
	}
	
	public initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.btnReward = this.getGObject("btn_reward").asButton;
        this.listReward = new List(this.getGObject("list_reward").asList,{showGoldEffect:true});

        this.btnReward.addClickListener(this.onGUIBtnClick, this);
        this.listReward.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
		this.closeObj = this.getGObject("btn_close");
		this.loaderBg.load(this.getBgUrl());
	}

	public updateAll(data?:any):void{
		this.listReward.setVirtual(ConfigManager.shareReward.getRewardByType(this.rewardType));
		this.btnReward.icon = this.getBtnIco();
	}

	protected getBgUrl():string{
		return "";
	}

	protected getBtnIco():string{
		return "";
	}

	protected isCanGet():boolean{
		return false; //现在 微端下载和关注奖励都是上线后发邮件 在线是不能领取的
	}

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnReward:
				if(this.isCanGet()){
					ProxyManager.operation.getPlatformReward(this.rewardType);
				}else{
					Sdk.platformOperation(this.rewardType);
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
            case this.listReward.list:
                break;

        }
               
    }


}
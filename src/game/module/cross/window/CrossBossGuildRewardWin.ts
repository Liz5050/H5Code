/**
 * 神兽入侵奖励展示窗口
 * @author zhh
 * @time 2018-12-11 11:47:51
 */
class CrossBossGuildRewardWin extends BaseWindow {
    public static FROM_UI:number = 0;
    public static FROM_SCENE:number = 1;

    public static TYPE_REWARD:number = 0;
    public static TYPE_JOIN:number = 1;

    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private imgBg:fairygui.GImage;
    private btnReward0:fairygui.GButton;
    private btnReward1:fairygui.GButton;
    private listReward0:List;
    private listReward1:List;
    private _uiData:any;

	public constructor() {
		super(PackNameEnum.CrossBossGuild,"CrossBossGuildRewardWin")

	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.imgBg = this.getGObject("img_bg").asImage;
        this.btnReward0 = this.getGObject("btn_reward0").asButton;
        this.btnReward1 = this.getGObject("btn_reward1").asButton;
        this.listReward0 = new List(this.getGObject("list_reward0").asList);
        this.listReward1 = new List(this.getGObject("list_reward1").asList);

        this.btnReward0.addClickListener(this.onGUIBtnClick, this);
        this.btnReward1.addClickListener(this.onGUIBtnClick, this); 
        //---- script make end ----

	}

	public updateAll(data?:any):void{
        this._uiData = data;
		this.c2.setSelectedIndex(data.from);
		this.c1.setSelectedIndex(data.type);
        let mgGameBoss:any = typeof(data.codeOrInfo)=="number"?ConfigManager.mgGameBoss.getByPk(data.codeOrInfo):data.codeOrInfo;
        mgGameBoss.showGuildReward
        mgGameBoss.showGuildJoinReward
        let rw0:ItemData[]; //个人奖励
        let rw1:ItemData[]; //仙盟奖励
        if(data.type==CrossBossGuildRewardWin.TYPE_REWARD){ //归属
            rw0 = RewardUtil.getRewards(mgGameBoss.showReward);
            rw1 = RewardUtil.getRewards(mgGameBoss.showGuildReward);
        }else if(data.type==CrossBossGuildRewardWin.TYPE_JOIN){
            rw0 = RewardUtil.getRewards(mgGameBoss.showJoinReward);
            rw1 = RewardUtil.getRewards(mgGameBoss.showGuildJoinReward);
        }
        this.listReward0.setVirtual(rw0);
        this.listReward1.setVirtual(rw1);       
        //this.btnReward0.selected = data.type==CrossBossGuildRewardWin.TYPE_REWARD; //归属按钮         
        //this.btnReward1.selected = data.type==CrossBossGuildRewardWin.TYPE_JOIN; //奖励按钮         
	}
    public onShow(param: any = null): void {
        super.onShow(param);
        //this.setSize(this.width,this.imgBg.height);
    }

    public get height():number{
        return this.imgBg.height;
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnReward0:
                this._uiData.type = CrossBossGuildRewardWin.TYPE_REWARD;
                break;
            case this.btnReward1:
                this._uiData.type = CrossBossGuildRewardWin.TYPE_JOIN;
                break;

        }
        this.updateAll(this._uiData);
    }

}
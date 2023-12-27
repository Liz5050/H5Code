/**
 * 诛仙塔领取奖励展示界面
 * @author zhh
 * @time 2018-07-17 19:05:20
 */
class CopyTowerDayRewardWin extends BaseWindow {
    private c1:fairygui.Controller;
    private loaderFlower:GLoader;
    private loaderBox:GLoader;
    private loaderTitle:GLoader;
    private btnOk:fairygui.GButton;
    private listGuild:List;
    private itemDatas:ItemData[];
	public constructor() {
		super(PackNameEnum.CopyTower,"TowerDayRewardWin")

	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderFlower = <GLoader>this.getGObject("loader_flower");
        this.loaderBox = <GLoader>this.getGObject("loader_box");
        // this.loaderTitle = <GLoader>this.getGObject("title");
        this.btnOk = this.getGObject("btn_ok").asButton;
        this.listGuild = new List(this.getGObject("list_guild").asList);

        this.btnOk.addClickListener(this.onGUIBtnClick, this);
        this.listGuild.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        // this.loaderTitle.load(URLManager.getTitleUrl("tower_reward"));
        this.loaderFlower.load(URLManager.getModuleImgUrl("reward_.png",PackNameEnum.CopyTower));
        this.loaderBox.load(URLManager.getModuleImgUrl("reward_box.png",PackNameEnum.CopyTower));
	}

	public updateAll(data?:any):void{
		//SSeqReward
        let itemDatas:ItemData[] = [];
        for(let info of data.rewards.data){
            itemDatas.push(RewardUtil.getRewardBySReward(info));
        }
        itemDatas.sort(function (a:ItemData,b:ItemData):number{
            let clrA:number = a.getColor(); 
            let clrB:number = b.getColor(); 
            if( clrA > clrB){
                return -1;
            }else if(clrA < clrB){
                return 1;
            }
            return 0;
        });
        this.itemDatas = itemDatas;
        this.listGuild.setVirtual(itemDatas); // SeqReward 
        let idx:number = CacheManager.copy.isRunTowerReward?0:1;
        this.c1.setSelectedIndex(idx);
	}

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnOk:
                EventManager.dispatch(LocalEventEnum.CopyGetTowerDayReward);
                let stx:number = App.StageUtils.getWidth()/2;
                let sty:number = App.StageUtils.getHeight()/2;
                for(let item of this.itemDatas){
                    MoveMotionUtil.itemMoveToBag([item.getCode()], 0, LayerManager.UI_Popup, stx, sty);
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
            case this.listGuild.list:
                break;

        }
               
    }


}
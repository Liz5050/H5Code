class BossHomeDetailsView extends fairygui.GComponent {
    private txtVipdes:fairygui.GTextField;
    private txtTime:fairygui.GTextField;
    private txtFloor:fairygui.GTextField;
    private btnSet:fairygui.GButton;
    private listTop:List;
    private listBoss:List;

    private curIndex:number = -1;
    private floorCfgs:any[];
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.txtVipdes = this.getChild("txt_vipDes").asTextField;
        this.txtTime = this.getChild("txt_time").asTextField;
        this.btnSet = this.getChild("btn_set").asButton;
        this.txtFloor = this.getChild("txt_floor").asTextField;
        this.listTop = new List(this.getChild("list_top").asList);
        this.listTop.list.addEventListener(fairygui.ItemEvent.CLICK,this.onFloorChange,this);

        this.listBoss = new List(this.getChild("list_boss").asList);

        this.btnSet.addClickListener(this.onGUIBtnClick, this);
	}

	public setFloorCfgs(cfgs:any[]):void {
        this.floorCfgs = cfgs;
		this.listTop.data = cfgs;
	}

    private onFloorChange():void {
        let index:number = this.listTop.selectedIndex;
		// let item:BossHomeTopItem = this.listTop.list.getChildAt(index) as BossHomeTopItem;
        this.setIndex(index);
    }

    public setIndex(index:number):void {
        if(this.curIndex == index) return;
        let curFloor:any = this.floorCfgs[index];
        let vipLv:number = curFloor.vipLevel;
        if(CacheManager.vip.vipLevel < vipLv) {
            Tip.showTip("VIP等级不足");
            return;
        }
        let item:BossHomeTopItem;
        if(this.curIndex != -1) {
            let item:BossHomeTopItem = this.listTop.list.getChildAt(this.curIndex) as BossHomeTopItem;
            item.floorSelected = false;
        }
        this.curIndex = index;
        item = this.listTop.list.getChildAt(this.curIndex) as BossHomeTopItem;
        item.floorSelected = true;
        this.txtFloor.text = "BOSS之家" + curFloor.floor + "层";
        
        this.txtVipdes.text = "VIP" + curFloor.vipLevel + "无限挑战";
        let bossList:any[] = CacheManager.bossNew.getBossHomeSortCfgs(curFloor.floor);
        this.listBoss.setVirtual(bossList);
        this.listBoss.scrollToView(0);
    }

    public updateBossList():void {
        this.listBoss.list.refreshVirtualList();
    }

    public updateTime(leftTime:number):void {
        if(leftTime <= 0) {
            this.txtTime.text = "";    
        }
        else {
            this.txtTime.text = App.DateUtils.getTimeStrBySeconds(leftTime,"{2}:{1}:{0}",false) + "后刷新";
        }
    }
	
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnSet:
                EventManager.dispatch(UIEventEnum.BossSetOpen,CopyEnum.CopyBossHome);
                break;
        }
    }

    public hide():void {
        if(this.curIndex != -1) {
            (this.listTop.list.getChildAt(this.curIndex) as BossHomeTopItem).floorSelected = false;
            this.listBoss.list.numItems = 0;
            this.curIndex = -1;
        }
    }
}
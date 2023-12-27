class BossHomeEnterItem extends ListRenderer {
    private loaderBg:GLoader;
    private bossLoader:GLoader;
    private txtFloor:fairygui.GTextField;
    private txtCdtime:fairygui.GTextField;
    private txtDes:fairygui.GTextField;
    private txtVip:fairygui.GTextField;
    private listItem:List;

    public static ITEM_CLICK:string = "ITEM_CLICK";
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.loaderBg = <GLoader>this.getChild("loader_bg");
        this.loaderBg.load(URLManager.getModuleImgUrl("bossHomeItemBg.png",PackNameEnum.Boss));

        this.bossLoader = this.getChild("floor_boss_loader") as GLoader;
        

        this.txtFloor = this.getChild("txt_floor").asTextField;
        this.txtCdtime = this.getChild("txt_cdTime").asTextField;
        this.txtDes = this.getChild("txt_des").asTextField;
        this.txtVip = this.getChild("txt_vip").asTextField;
        this.listItem = new List(this.getChild("list_item").asList);
        this.getChild("touch_area").asGraph.addClickListener(this.onItemClickHandler,this);
        // this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.itemClick,this);
	}

	public setData(data:any):void{		
		this._data = data;
        this.txtFloor.text = data.floor + "";
        this.txtVip.text = data.vipLevel + "";
        this.bossLoader.load(URLManager.getModuleImgUrl("item_floor_" + data.floor + ".png",PackNameEnum.Boss));
        let itemDatas:ItemData[] = [];
        let rewardStr:string[] = data.rewards.split("#");
        for(let i:number = 0; i < rewardStr.length; i++) {
            itemDatas.push(new ItemData(Number(rewardStr[i])));
        }
        this.listItem.data = itemDatas;
        let bossList:any[] = ConfigManager.mgGameBoss.getHomeBossByFloor(data.floor);
        let levelStr:string;
        let roleState:number = bossList[0].roleState;
        if(roleState > 0) {
            levelStr = roleState + "转";
        }
        else {
            let bossCfg:any = ConfigManager.boss.getByPk(bossList[0].bossCode);
            levelStr = bossCfg.level + "级";
        }
        let lvRangeStr:string = levelStr;
        roleState = bossList[bossList.length - 1].roleState;
        if(roleState > 0) {
            levelStr = roleState + "转";
        }
        else {
            let bossCfg:any = ConfigManager.boss.getByPk(bossList[bossList.length - 1].bossCode);
            levelStr = bossCfg.level + "级";
        }
        lvRangeStr += "~" + levelStr + "BOSS无限击杀";
        this.txtDes.text = lvRangeStr;
	}

    private onItemClickHandler(evt:egret.Event):void {
        this.dispatchEventWith(BossHomeEnterItem.ITEM_CLICK,false,this._data);
    }
}
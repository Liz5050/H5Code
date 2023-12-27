class AllotMemberItemView extends ListRenderer {
    private c1:fairygui.Controller;
    private loader_head:GLoader;
    private txt_name:fairygui.GTextField;
    private txt_score:fairygui.GTextField;
    private txt_fight:fairygui.GTextField;
    private txt_position:fairygui.GTextField;
    private btn_checkBox:fairygui.GButton;
    private number_input:NumberInput;

    public allotUid:string = "";
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.loader_head = <GLoader>this.getChild("loader_head");
        this.txt_name = this.getChild("txt_name").asTextField;
        this.txt_score = this.getChild("txt_score").asTextField;
        this.txt_fight = this.getChild("txt_fight").asTextField;
        this.txt_position = this.getChild("txt_position").asTextField;
        this.btn_checkBox = this.getChild("btn_checkBox").asButton;
        this.number_input = this.getChild("number_input") as NumberInput;
        this.number_input.showExBtn = false;
        this.number_input.min = 0;
        this.number_input.value = 0;
        this.number_input.setChangeFun(this.onNumberChange,this);

        this.btn_checkBox.addClickListener(this.onGUIBtnClick, this);
	}

	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        
        this.loader_head.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(data.miniPlayer.career_SH)));
        this.txt_name.text = data.miniPlayer.name_S;
        this.txt_score.text = data.mgNewGuildWarScore_I;
        this.txt_fight.text = data.miniPlayer.warfare_L64.toString();
        this.txt_position.text = "[" + CacheManager.guildNew.getPosName(data.position_I) + "]";
        let leftCount:number = CacheManager.guildNew.getStoreItemLeftCount("",false);
        let allocateNum:number = CacheManager.guildNew.getAllocatePlayerCount(data.miniPlayer.entityId.id_I);//已分配数量
        if(leftCount > 0 || allocateNum > 0) {
            this.number_input.max = CacheManager.guildNew.getStoreItemLeftCount();
            this.number_input.value = allocateNum;
            this.btn_checkBox.visible = true;
            if(this.number_input.value > 0) {
                 this.c1.selectedIndex = 1;
            }
            else {
                 this.c1.selectedIndex = 0;
            }
        }
        else if(allocateNum == 0) {
            this.c1.selectedIndex = 0;
            this.btn_checkBox.visible = false;
            this.number_input.value = 0;
        }
	}

    private onNumberChange():void {
        CacheManager.guildNew.updateAllocateInfo(this._data.miniPlayer,this.number_input.value);
        let allocateAll:number = CacheManager.guildNew.getStoreItemAllocateCount();
        if(allocateAll > this.number_input.max) {
            this.number_input.value--;
            CacheManager.guildNew.updateAllocateInfo(this._data.miniPlayer,this.number_input.value);
            Tip.showTip("已经是最大数量");
        }
        EventManager.dispatch(LocalEventEnum.GuildAllocateItemUpdate);
    }

    private onGUIBtnClick(e:egret.TouchEvent):void{
        if(!this.btn_checkBox.selected) {
            this.number_input.value = 0;
        }
        else {
            this.number_input.value = 1;
        }
        this.onNumberChange();
    }
}
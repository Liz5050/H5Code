class LotteryProbabilityWindow extends BaseWindow {
    
    private level : number;
    private type : number;
    public perlist : List;
    public lvllist : List;
    private btn_lvl : fairygui.GButton;

    private lvls = ["0~80级","1转","2转","3转","4转","5转","6转","7转","8转","9转","10转","11转","12转","13转"];
    private runes = ["诛仙塔","诛仙塔20层","诛仙塔40层","诛仙塔60层","诛仙塔80层","诛仙塔100层","诛仙塔110层","诛仙塔130层","诛仙塔150层","诛仙塔190层","诛仙塔250层","诛仙塔270层","诛仙塔320层"];
    private towerlvl = [0,20,40,60,80,100,110,130,150,190,250,270,320];

    public constructor() {
		super(PackNameEnum.Lottery,"LotteryProbabilityWindow");
	}


    public initOptUI() : void {
        this.perlist = new List(this.getGObject("list_prob").asList);
        this.lvllist = new List(this.getGObject("list_lvl").asList);
        this.btn_lvl = this.getGObject("btn_lvl").asButton;
        this.btn_lvl.addClickListener(this.onLvlBtnClick, this);
        this.lvllist.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
        this.lvllist.list.visible = false;
        
    }

    public updateAll(data : any) :void {
        this.lvllist.list.visible = false;
        if(data) {
            this.type = data;
        }
        this.level = 0;
        if(this.type == 1) {
            this.title = "装备寻宝";
            this.lvllist.data = this.lvls;
            this.btn_lvl.visible = true;
            this.btn_lvl.title = this.lvls[0];
            this.level = 0;
            this.btn_lvl.visible = false;
        }
        if(this.type == 2) {
            this.title = "符文寻宝";
            this.lvllist.data = this.runes;
            this.btn_lvl.visible = true;
            this.btn_lvl.title = this.runes[0];
        }
        if(this.type == 3) {
            this.title = "混元寻宝";
            this.btn_lvl.visible = false;
        }
        this.updateShowProb();
        
       
    }

    public onLvlBtnClick () {
        this.lvllist.list.visible =  !this.lvllist.list.visible;
    }

    private onClickItem(e: fairygui.ItemEvent): void {
        let baseItem: LotteryLvlItem = <LotteryLvlItem>e.itemObject;
        let itemdata = baseItem.itemIndex;
        this.level = itemdata;
        if(this.type == 1) {
            this.title = "装备寻宝";
            this.lvllist.list.visible = false;
            this.btn_lvl.title = this.lvls[itemdata];
        }
        if(this.type == 2) {
            this.title = "符文寻宝";
            this.lvllist.list.visible = false;
            this.btn_lvl.title = this.runes[itemdata];
        }
        this.updateShowProb();
    }

    private updateShowProb() {
        if(this.type!=3) {
            var list : Array<PerData> = [];
            var cfgs =  ConfigManager.lotteryShow.getItemsByLotteryTypeToProb(this.type*1000 + this.level + 1);
            var index = 0;
            for(let i=0; i < cfgs.length; i++) {
                let item = new PerData();
                item.cfg1 = cfgs[i];
                if(++i < cfgs.length) {
                    item.cfg2 = cfgs[i];
                }
                item.id = index;
                list.push(item);
                index ++;
            }
            this.perlist.data = list;
        }
        else {
            var list : Array<PerData> = [];
            var cfgs =  ConfigManager.lotteryShow.getItemsByLotteryTypeToProb(3001);
            var index = 0;
            for(let i=0; i < cfgs.length; i++) {
                let item = new PerData();
                item.cfg1 = cfgs[i];
                if(++i < cfgs.length) {
                    item.cfg2 = cfgs[i];
                }
                item.id = index;
                list.push(item);
                index ++;
            }
            this.perlist.data = list;
        }
    }



    

    
}
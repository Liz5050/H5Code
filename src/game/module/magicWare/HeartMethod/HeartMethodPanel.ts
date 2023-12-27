class EquipData {
    public pos : number;
    public role : number;
    public data : any;        
}

class IndexsSelect {
    public index : number;
    public role : number;
}

class HeartMethodPanel extends BaseTabView {

    private _indexSelect : number;
    private level : number;


    private c1 : fairygui.Controller;
    
    //未激活
    private txt_active : fairygui.GTextField;
    private btn_active : fairygui.GButton;
    private btn_pre : fairygui.GButton;
    private btn_next : fairygui.GButton;

    //已激活
    private fight_panel : FightPanel;
    private txt_level : fairygui.GTextField;
    private txt_skill : fairygui.GTextField;
    private loader_skill : GLoader;
    private btn_decompose : fairygui.GButton;
    private list_star : fairygui.GList;
    private list_equip : List;
    private txt_attrcur : fairygui.GRichTextField;
    private txt_attrnext : fairygui.GRichTextField;
    private txt_attrfinal : fairygui.GRichTextField;
    private btn_lvlup : fairygui.GButton;
    private txt_getItem : fairygui.GButton;
    private txt_cost : fairygui.GRichTextField;
    private loader_cost : GLoader;
    private btn_info : fairygui.GButton;
    private modelContainer: fairygui.GComponent;
	private modelBody: egret.DisplayObjectContainer;
	private model: ModelShow;

    private equipContainer: fairygui.GComponent;
	private equipBody: egret.DisplayObjectContainer;
	private equip: ModelShow;

    private mcUpStar: UIMovieClip;
	private mcSuccess: UIMovieClip;
    private lvl_tips:fairygui.GTextField;
    private cfg : any;
    private cfgnext : any;

    private effectCfg : any;
    private suitCfg : any;
    private skillCfg : any;
    private isSkillOpen : boolean;
    private cuData:any;
    private selectData : any;
    private equipArray : Array<any>;

    private _roleIndex: number = RoleIndexEnum.Role_index0;
    private isMax : boolean;
    private isActive : boolean;
    private costcode : number;
    private costNum : number;
    private itemNum : number;
    private starNum : number;


    private strlist : Array<string> = ["天罡剑气触发可造成无视防御伤伤害", 
                                       "沐雨回春可提高战斗回复的治疗量", 
                                       "修罗之怒触发可对敌人造成巨额伤害", 
                                       "佛莲济世可大幅提高角色生命上限"]
    
    private title : string[] = ["攻击","生命","破甲", "防御"];
    private attrName : string[] = ["剑气伤害","回春恢复","修罗怒斩","生命属性"];
    private attrPerName : string[] = ["剑气几率","生命回春","修罗加成",""];

    private weight : number[] = [2, 5, 1, 0];

    private poslist : Array<number> = [100, 200, 300, 400];

    public constructor() {
		super();
	}

    public addListenerOnShow(): void {
        //this.indexSelect = 0;
    }

    public initOptUI(): void { 
        this.c1 = this.getController("c1");
        this.isMax = false;
        this.btn_active = this.getGObject("btn_activation").asButton;
        this.btn_pre = this.getGObject("btn_left").asButton;
        this.btn_next = this.getGObject("btn_right").asButton;
        this.txt_active = this.getGObject("active_desc").asTextField;
        this.fight_panel = <FightPanel>this.getGObject("panel_fight");
        this.txt_level = this.getGObject("txt_level").asTextField;
        this.txt_skill = this.getGObject("skill_name").asTextField;
        this.loader_skill = <GLoader>this.getGObject("loader_skill");
        this.btn_decompose = this.getGObject("btn_dep").asButton;
        this.list_star = this.getGObject("list_star").asList;
        this.list_equip = new List(this.getGObject("equip_list").asList);
        this.txt_attrcur = this.getGObject("txt_front").asRichTextField;
        this.txt_attrnext = this.getGObject("txt_after").asRichTextField;
        this.txt_attrfinal = this.getGObject("txt_final").asRichTextField;
        this.btn_lvlup = this.getGObject("btn_promote").asButton;
        this.txt_getItem = this.getGObject("getItem").asButton;
        this.txt_cost = this.getGObject("txt_material").asRichTextField;
        this.lvl_tips = this.getGObject("lvlup_tips").asTextField;
        this.loader_cost = <GLoader>this.getGObject("loader_material");
        this.btn_info = this.getGObject("btn_info").asButton;
        this.modelContainer = this.getGObject("effectContainer").asCom;
		this.model = new ModelShow(EShape.EHeartMethod);
		this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		this.modelBody.x = 12;
		this.modelBody.addChild(this.model);
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.equipContainer = this.getGObject("equipContainer").asCom;
		this.equip = new ModelShow(EShape.EHeartMethod);
		this.equipBody = ObjectPool.pop("egret.DisplayObjectContainer");
		this.equipBody.x = 12;
		this.equipBody.addChild(this.equip);
        (this.equipContainer.displayObject as egret.DisplayObjectContainer).addChild(this.equipBody);

        this.starListAddItem();

        this.btn_active.addClickListener(this.onClickActiveBtn, this);
        this.btn_decompose.addClickListener(this.onClickDecomposeItem, this);
        this.btn_info.addClickListener(this.onClickFightInfo, this);
        this.btn_pre.addClickListener(this.onClickPreArrow, this);
        this.btn_next.addClickListener(this.onClickNextArrow, this);
        this.btn_lvlup.addClickListener(this.onClickUplvlBtn, this);
        this.loader_skill.addClickListener(this.onClickSkillInfo, this);
        this.loader_cost.addClickListener(this.onLoaderClick , this);
        this.txt_getItem.addClickListener(this.onClickGetItem, this);
        this.indexSelect = 0;
        this.level = 0;
        this.list_equip.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
    }

    private onClickItem(e: fairygui.ItemEvent): void {
        let baseItem: HeartMethodItem = <HeartMethodItem>e.itemObject;
        let itemdata = baseItem.itemdata;
        if(itemdata.data) {
            //todo 弹出心法界面
            EventManager.dispatch(UIEventEnum.HeartLvlUpOpen, itemdata);
        }
        else{
            EventManager.dispatch(LocalEventEnum.EquipHeartMethod, itemdata.pos, this._roleIndex, 0);
        }
    }

    //升星处理
    private starListAddItem(): void {
		this.list_star.removeChildrenToPool();
		for (let i = 0; i < 10; i++) {
			let item: fairygui.GComponent = this.list_star.addItemFromPool().asCom;
		}
	}

    public setStarListNum(num: number): void {
		for (let i = 0; i < 10; i++) {
			let item: fairygui.GComponent = this.list_star.getChildAt(i).asCom;
			let controller: fairygui.Controller = item.getController("c1");
			controller.selectedIndex = i < num ? 1 : 0;
		}
        /*
        if(num == 10) {
            this.btn_lvlup.title = "升 阶";
            this.txt_cost.visible = false;
            this.loader_cost.visible = false;
        }
        else{
            this.btn_lvlup.title = "修 炼";
            this.txt_cost.visible = true;
            this.loader_cost.visible = true;
        }*/
        this.btn_lvlup.title = "修 炼";
        this.txt_cost.visible = true;
        this.loader_cost.visible = true;
        if(CacheManager.heartMethod.checkEquipFull(this.poslist[this.indexSelect],this.roleIndex)||this.indexSelect == 0) {
            return;
        }
        else {
            this.txt_cost.visible = false;
            this.loader_cost.visible = false;
        }
	}

    private playerUpStar(isUpStage: boolean): void {

        if(!this.cfg.level) {
            this.starNum = 0;
        }
        else {
            this.starNum = this.cfg.level%11;
           
        }
        this.setStarListNum(this.starNum);

        this.updateUIbyIndex();
        this.updateCfg();
        this.updateCostText();
        this.updateAttr();
        this.getFightCombat();
		if (this.mcUpStar == null) {
			this.mcUpStar = UIMovieManager.get(PackNameEnum.MCStar);//FuiUtil.createMc("MCStar", PackNameEnum.MovieClip);
			this.mcUpStar.x = -232;
			this.mcUpStar.y = -232;
		}

        if(this.starNum != 10) {
		    let starItem: fairygui.GComponent = this.list_star.getChildAt(this.starNum).asCom;
		    starItem.addChild(this.mcUpStar);
		    this.mcUpStar.setPlaySettings(0, -1, 1, -1, function (): void {
			    this.mcUpStar.removeFromParent();
			    this.mcUpStar.playing = false;
			    if (isUpStage) {
				    this.playerSuccessMc();
                    this.updateAll();
			    } else {
                    this.updateAll();
			    }
		    }, this);
		    this.mcUpStar.playing = true;
        }
        else{
            if (isUpStage) {
	    		this.playerSuccessMc();
                this.updateAll();
	    	} else {
	    		this.updateAll();
			}
        }
	}

    //升阶处理
    private playerSuccessMc(): void {
		if (this.mcSuccess == null) {
			this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
		}
		this.mcSuccess.x = this.modelContainer.x - 260;
		this.mcSuccess.y = this.modelContainer.y - 130;
		this.addChild(this.mcSuccess);
		this.mcSuccess.alpha = 1;
		egret.Tween.removeTweens(this.mcSuccess);
		this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
			egret.Tween.get(this.mcSuccess).to({ alpha: 0 }, 2000).call(() => {
				this.mcSuccess.removeFromParent();
				this.mcSuccess.playing = false;
			})
		}, this);
		this.mcSuccess.playing = true;
	}

    // 按钮事件
    private onClickActiveBtn() : void {
        EventManager.dispatch(LocalEventEnum.ActiveHeartMethod, this.poslist[this._indexSelect], this._roleIndex, this.level);
    }

    private onClickUplvlBtn() : void {
        if(CacheManager.heartMethod.checkEquipFull(this.poslist[this.indexSelect],this.roleIndex)||this.indexSelect == 0) {
            if(this.costNum <= this.itemNum) {
                EventManager.dispatch(LocalEventEnum.UpLevelHeartMethod, this.poslist[this._indexSelect], this._roleIndex, this.level + 1 );
            }
            else {
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.costcode });
                let itemCfg: any = ConfigManager.item.getByPk(this.costcode);
                Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
            }
        }
        else{
             EventManager.dispatch(LocalEventEnum.UpLevelHeartMethod, this.poslist[this._indexSelect], this._roleIndex, this.level + 1 );
        }
    }

    private onClickGetItem() : void {
        if(CacheManager.heartMethod.checkEquipFull(this.poslist[this.indexSelect],this.roleIndex)) { 
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.costcode });
        }
        else {
            var pos = this.indexSelect * 5 + 1;
            var item = ConfigManager.item.getMethodHeartByColorAndLevel(pos,2,0);
            if(item) {
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": Number(item.code) });
            }
        }
    }

    private onClickDecomposeItem() : void {
        EventManager.dispatch(UIEventEnum.HeartDecpWindowOpne, this.indexSelect);
    }

    private onClickSkillInfo() : void {
        var data = new IndexsSelect();
        data.index = this.indexSelect;
        data.role = this.roleIndex;
        EventManager.dispatch(UIEventEnum.HeartSkillWindowOpen,data);

    }

    private onClickFightInfo() : void {
        var strs = [this.txt_skill.text];
        var str = "";
        if(this.cfg) {
            var attr = WeaponUtil.getAttrDict(this.cfg.attr);
            var arr = WeaponUtil.getAttrArray(this.cfg.attr);
            var exNum = 0;
            if(this.cuData) {
                for(let i=1;i<=5;i++) {
                    if(this.cuData.levelInfo[i+5*this.indexSelect]) {
                        var itemcfg = ConfigManager.item.getByPk(this.cuData.levelInfo[i+5*this.indexSelect]);
                        if(itemcfg) {
                            if(itemcfg.basePhysicalAttack) {
                                attr[1] += itemcfg.basePhysicalAttack;
                            }
                            if(itemcfg.basePass) {
                                attr[3] += itemcfg.basePass;
                            }
                            if(itemcfg.baseLife) {
                                attr[2] += itemcfg.baseLife;
                            }
                            if(itemcfg.basePhysicalDefense) {
                                attr[4] += itemcfg.basePhysicalDefense;
                            }
                            if(itemcfg.baseAttrList) {
                                exNum += Number(itemcfg.baseAttrList.split("#")[0].split(",")[1]);
                            }
                        }
                    }
                }
            }
            for(let i=0; i<arr.length; i++) {
                let name = this.title[arr[i][0] - 1];
                if(arr[i][0] > 4) {
                    exNum += arr[i][1];
                }
            }
            if(attr[1]) {
                str += this.title[0] + ": <font color=" + Color.Color_8 +">" + attr[1] + "</font>\n";
            }
            if(attr[3]) {
                str += this.title[2] + ": <font color=" + Color.Color_8 +">" + attr[3] + "</font>\n";
            }
            if(attr[2]) {
                str += this.title[1] + ": <font color=" + Color.Color_8 +">" + attr[2] + "</font>\n";
            }
            if(attr[4]) {
                str += this.title[3] + ": <font color=" + Color.Color_8 +">" + attr[4] + "</font>\n";
            }
            if(this.indexSelect < 3) {
                if(this.isSkillOpen) {
                    var state = ConfigManager.state.getByPk(this.skillCfg.additionState);
                    if(this.indexSelect == 0) {
                        str += this.attrPerName[this.indexSelect] +": <font color=" + Color.Color_8 +">" + state.rate + "%</font>\n";
                    }
                    if(this.indexSelect == 1) {
                        str += this.attrPerName[this.indexSelect] +": <font color=" + Color.Color_8 +">" + state.hurtEffectValue + "%</font>\n";
                    }
                    if(this.indexSelect == 2) {
                        exNum += Math.floor(state.stateEffect1/1000);
                        str += this.attrPerName[this.indexSelect] +": <font color=" + Color.Color_8 +">" +  Math.floor(state.stateEffect1%1000) + "%</font>\n";
                    }
                }
            }
            if(exNum) {
                str += this.attrName[this.indexSelect] + ": <font color=" + Color.Color_8 +">" + exNum + "</font>\n";
            }
        }
        strs.push(str);
        EventManager.dispatch(UIEventEnum.HeartInfoOpen,strs);
    }

    private onClickPreArrow() : void {
        if(this.indexSelect > 0) {
            this.indexSelect -= 1;
        }
    }

    private onClickNextArrow() : void {
        if(this.indexSelect < 3) {
            this.indexSelect += 1;
        }
    }

    //选择角色处理
    public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
        //this._indexSelect = 0;
		this.updateAll();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}
    
    //当前心法处理
    public set indexSelect(index: number) {
		this._indexSelect = index;
		this.updateAll();
	}

	public get indexSelect(): number {
		return this._indexSelect;
	}


    //更新处理
    public UpdateArrow() {
        if(this.indexSelect == 3) {
            this.btn_pre.visible = true;
            this.btn_next.visible = false;
            return;
        }
        if(this.indexSelect == 0) {
            this.btn_pre.visible = false;
            this.btn_next.visible = true;
            return;
        }
        this.btn_next.visible = true;
        this.btn_pre.visible = true;
    }

    public updateAll(param:any = null):void {
        this.UpdateArrow();
        this.updateUIbyIndex();
        this.updateCfg();
        this.checkupdateState();
        this.updateCostText();
        this.updateStage();
        this.updateByState();
        this.setActiveBtnTips();
        this.setUplevelBtnTips();
        this.checkNextTips();
        this.checkDecoTips();
        this.checkPreTips();
        this.updateAttr();
        this.getFightCombat();
        this.updateModelByIndex();
        this.GetSkillNow();
	}

    //激活处理

    public onActive() : void {

    }

    public onUpDateData() : void {
        var newData = CacheManager.cultivate.getCultivateInfoByRoleAndType(this._roleIndex, ECultivateType.ECultivateTypeHeartMethod);
        if(newData) {
            if(newData.extStr) {
                var darr = JSON.parse(newData.extStr);
                if(darr) {
                if(darr[this.poslist[this.indexSelect]]||darr[this.poslist[this.indexSelect]] == 0) {
                    if( darr[this.poslist[this.indexSelect]] > this.level) {
                        if((darr[this.poslist[this.indexSelect]]) % 11 == 0){
                            this.playerUpStar(true);
                        }
                        else{
                            this.playerUpStar(false);
                        }
                    }
                    else {
                        this.updateAll();
                    }
                }
                }
            }
        }
    }

    private updateUIbyIndex() {
        this.isActive = false;
        this.isMax = false;
        this.cuData = CacheManager.cultivate.getCultivateInfoByRoleAndType(this._roleIndex, ECultivateType.ECultivateTypeHeartMethod);

        if(this.cuData) {
            if(this.cuData.extStr&&this.cuData.extStr!=null) {
                var darr = JSON.parse(this.cuData.extStr);   
                if(darr) {
                    if(darr[this.poslist[this.indexSelect]]||darr[this.poslist[this.indexSelect]] == 0) {
                        this.level = darr[this.poslist[this.indexSelect]];
                        if(this.level == ConfigManager.cultivate.getMaxLevel(ECultivateType.ECultivateTypeHeartMethod, this.poslist[this.indexSelect])) {
                            this.isMax = true;
                        }
                        this.isActive = true;
                        this.equipArray = [];
                        for(let i = 1;i <= 5 ; i++) {
                            let pos = i + 5 * this._indexSelect;
                            let qd = new EquipData();
                            qd.data = this.cuData.levelInfo[pos];
                            qd.pos = pos;
                            qd.role = this.roleIndex;
                            this.equipArray.push(qd);
                        }
                    }
                }
            }
            this.list_equip.data = this.equipArray;

        }
    }

    private updateByState() {
        if(this.isActive) {
            this.c1.selectedIndex = 1;
        }
        else {
            this.c1.selectedIndex = 0;
            this.txt_active.text = this.strlist[this._indexSelect]+ "\n" + this.cfg.roleState + "转开启";
        }
        if(this.isMax) {
            this.c1.selectedIndex = 2;
        }

    }

    private updateCfg() {
        if(!this.isActive) {
            this.cfg = ConfigManager.cultivate.getMinCfg(ECultivateType.ECultivateTypeHeartMethod, this.poslist[this.indexSelect]);
            this.cfgnext = this.cfg;
        }
        else {
            if(!this.isMax){
                this.cfg = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeHeartMethod, this.poslist[this.indexSelect],this.level );
                this.cfgnext = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeHeartMethod, this.poslist[this.indexSelect],this.level + 1);
            }
            else {
                this.cfg = ConfigManager.cultivate.getCfgByLevelAndType(ECultivateType.ECultivateTypeHeartMethod, this.poslist[this.indexSelect],this.level);
                this.cfgnext = this.cfg;
            }
        }
    }

    private updateAttr() {
        if(this.cfg) {
            this.setCurAttr(this.cfg.attr);
        }
        if(this.cfgnext) {
            this.setNextAttr(this.cfgnext.attr);
        }
    }

    private setCurAttr(attr : any) : void {
        this.txt_attrcur.text = "";
        let str : string = "";
        let arr =  WeaponUtil.getAttrArray(attr);
        for(let i=0; i<arr.length; i++) {
            let name = this.title[arr[i][0] - 1];
            if(arr[i][0] <= 4) {
                str += name +" :  "+ arr[i][1] + "\n";
            }
            else {
                str += this.attrName[this.indexSelect] +" :  "+arr[i][1] + "\n";
            }
        }
        this.txt_attrcur.text = str;
        this.txt_attrfinal.text = str;
    }
    
    private setNextAttr(attr : any) : void {
        this.txt_attrnext.text = "";
        let str : string = "";
        let arr =  WeaponUtil.getAttrArray(attr);
        for(let i=0; i<arr.length; i++) {
            let name = this.title[arr[i][0] - 1];
            if(arr[i][0] <= 4) {
                str += name +" :  "+ arr[i][1] + "\n";
            }
            else {
                str += this.attrName[this.indexSelect] +" :  "+arr[i][1] + "\n";
            }
        }
        
        this.txt_attrnext.text = str;
    }



    private updateCostText() {
        if(!this.isActive) {
            return ;
        }
        if(!this.cfg) {
            return ;
        }
        let color = 0x0DF14B;
        this.costcode = this.cfgnext.itemCode;
        this.costNum = this.cfgnext.itemNum;
        if(!this.costNum) {
            this.costNum = 0;
        }
        let itemCfg: any = ConfigManager.item.getByPk(this.costcode);
        this.loader_cost.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
        let costitems:ItemData = CacheManager.pack.propCache.getItemByCode(this.costcode);
        if(costitems){
            this.itemNum = costitems.getItemAmount();
        }
        else{
            this.itemNum = 0;
        }
        this.txt_cost.text = this.itemNum + "/" + this.costNum;
        if(this.itemNum >= this.costNum) {
            this.txt_cost.color = color;
        }
        else
        {
            this.txt_cost.color = Color.Red2;
        }
        /*if(this.costNum == 0) {
            this.btn_lvlup.title = "升 阶";
            this.txt_cost.visible = false;
            this.loader_cost.visible = false;
        }
        else {
            this.btn_lvlup.title = "修 炼";
            this.txt_cost.visible = true;
            this.loader_cost.visible = true;
        }*/
        this.btn_lvlup.title = "修 炼";
        this.txt_cost.visible = true;
        this.loader_cost.visible = true;
        if(CacheManager.heartMethod.checkEquipFull(this.poslist[this.indexSelect],this.roleIndex)||this.indexSelect == 0) {
            return;
        }
        else {
            this.txt_cost.visible = false;
            this.loader_cost.visible = false;
        }
        
    }

    private updateStage() {
        if(this.cfg) {
            if(this.cfg.level){
                this.txt_level.text = FuiUtil.getStageStr((this.cfg.level / 11 + 1)) + "阶";
                this.setStarListNum((this.cfg.level)%11);
            }
            else {
                this.txt_level.text = FuiUtil.getStageStr(1) + "阶";
                this.setStarListNum(0);
            }
        }
    }

    private updateFightPoint( fight : number) {
        this.fight_panel.updateValue(fight);
    }

    public onLoaderClick() : void{
        ToolTipManager.showByCode(this.costcode);
    }
    

    public updateProp(): void {
        this.updateUIbyIndex()
        this.updateCostText();
        this.setUplevelBtnTips();
        this.checkPreTips();
        this.checkNextTips();
        this.checkDecoTips();
    }

    public setUplevelBtnTips():void{
        CommonUtils.setBtnTips(this.btn_lvlup,CacheManager.heartMethod.checkHeartMethodCanUpdate(this.poslist[this.indexSelect],this._roleIndex));
    }

    public setActiveBtnTips(): void {
        CommonUtils.setBtnTips(this.btn_active, CacheManager.heartMethod.checkHeartMethodCanActive(this.poslist[this.indexSelect],this._roleIndex));
    }

    public checkPreTips() {
        var tips : boolean = false;
        for(let i = 0;i<this.indexSelect;i++) {
            if(CacheManager.heartMethod.checkHeartMethodPosTips(this.poslist[i],this.roleIndex)) {
                tips = true;
                break;
            }
        }
        CommonUtils.setBtnTips(this.btn_pre, tips);
        var show : boolean = false;
        for(let i = 0;i<this.indexSelect;i++) {
            if(CacheManager.heartMethod.checkHeartMethodCanActiveOrActived(this.poslist[i],this.roleIndex)) {
                show = true;
                break;
            }
        }
        this.btn_pre.visible = show;
    }

    public checkNextTips() {
        var tips : boolean = false;
        for(let i = this.indexSelect + 1;i<4;i++) {
            if(CacheManager.heartMethod.checkHeartMethodPosTips(this.poslist[i],this.roleIndex)) {
                tips = true;
                break;
            }
        }
        CommonUtils.setBtnTips(this.btn_next, tips);
        var show : boolean = false;
        for(let i = this.indexSelect + 1;i<4;i++) {
            if(CacheManager.heartMethod.checkHeartMethodCanActiveOrActived(this.poslist[i],this.roleIndex)) {
                show = true;
                break;
            }
        }
        this.btn_next.visible = show;
    }

    public checkDecoTips() {
        CommonUtils.setBtnTips(this.btn_decompose,CacheManager.heartMethod.checkHeartMethodCanDecompose( this.poslist[this._indexSelect], this.roleIndex));
    }

    public CheckCanActive() : boolean {
        if(this.isActive) {
            return false;
        }

        if(this.cfg) {
            let roleCareer: number = CacheManager.role.getRoleCareer();
            if(this.cfg.roleState <= CareerUtil.getRebirthTimes(roleCareer)) {
                return true;
            }
        }
        return false;
    }

    public CheckUpDateEnough() : boolean {
        if(this.isActive) {
            return (this.itemNum >= this.costNum);
        }
        return false;
    }

    
    public getFightCombat() {
        if(this.cfg) {
            var attr = WeaponUtil.getAttrDict(this.cfg.attr);
            for(let i=0 ;i< 4 ; i++) {
                if(!attr[i + 1]) {
                    attr[i + 1] = 0;
                }
            }
            var arr = WeaponUtil.getAttrArray(this.cfg.attr);
            var exNum = 0;
            if(this.cuData) {
                for(let i=1;i<=5;i++) {
                    if(this.cuData.levelInfo[i+5*this.indexSelect]) {
                        var itemcfg = ConfigManager.item.getByPk(this.cuData.levelInfo[i+5*this.indexSelect]);
                        if(itemcfg) {
                            if(itemcfg.basePhysicalAttack) {
                                attr[1] += itemcfg.basePhysicalAttack;
                            }
                            if(itemcfg.basePass) {
                                attr[3] += itemcfg.basePass;
                            }
                            if(itemcfg.baseLife) {
                                attr[2] += itemcfg.baseLife;
                            }
                            if(itemcfg.basePhysicalDefense) {
                                attr[4] += itemcfg.basePhysicalDefense;
                            }
                            if(itemcfg.baseAttrList) {
                                exNum += Number(itemcfg.baseAttrList.split("#")[0].split(",")[1]);
                            }
                        }
                    }
                }
            }

            for(let i=0; i<arr.length; i++) {
                let name = this.title[arr[i][0] - 1];
                if(arr[i][0] > 4) {
                    exNum += arr[i][1];
                }
            }
            this.fight_panel.updateValue(Number(WeaponUtil.getCombat(attr) + Math.ceil(exNum * this.weight[this.indexSelect])));
        }
    }

    public updateModelByIndex() {
        let modellevel = this.GetMethodSuitLevel();
        if(modellevel == 0) {
            this.model.setData(10001);
            this.model.setMcGrayed(true);
            this.equip.setData((this.indexSelect+ 1) * 1000 + 1);
            this.equip.setMcGrayed(true);
            this.equip.visible = true;
        }
        else {
            this.model.setData(9999+modellevel);
            this.model.setMcGrayed(false);
            this.equip.visible = true;
            this.equip.setData((this.indexSelect+ 1) * 1000 + modellevel - 1);
            this.equip.setMcGrayed(false);
        }
    }

    public GetBookModelIdByIndex() {
        var id = 10001;

    }

    public GetMethodSuitLevel() : number {
        var level = 10;
        if(this.cuData) {
            for(let i = 1;i <= 5 ; i++) {
                let pos = i + 5 * this._indexSelect;
                let qd = new EquipData();
                let code = this.cuData.levelInfo[pos];
                if(!code|| code == null) {
                    return 0;
                }
                let itemCfg: any = ConfigManager.item.getByPk(code);
                if(level > itemCfg.color) {
                    level = itemCfg.color;
                }
            }
        }
        else {
            return 0;
        }
        return level;
    }

    public GetSkillNow() {
        let level = this.GetMethodSuitLevel();
        this.isSkillOpen = level > 0;
        if(level == 0) {
            level = 2;
        }
        this.suitCfg = ConfigManager.cultivateSuit.getCurSuitInfoByCurLevelHeart(ECultivateType.ECultivateTypeHeartMethod, this._indexSelect+1 , level-1);
        if(this.suitCfg) {
            let arr:string[] = CommonUtils.configStrToArr(this.suitCfg.effectStr,false);		
			arr = arr[0].split(",");		
            this.effectCfg = ConfigManager.cultivateEffect.getByPk(arr[0]+","+(level-1));
            if(this.effectCfg) {
                this.skillCfg = ConfigManager.skill.getSkill(this.effectCfg.addSkillId);
                if(this.skillCfg) {
                    this.txt_skill.text = this.skillCfg.skillName;
                }
            }
        }
        this.loader_skill.load(URLManager.getModuleImgUrl((1001+this.indexSelect).toString()+".png", PackNameEnum.MagicWare));
    }

    private checkupdateState() {

        if(CacheManager.heartMethod.checkEquipFull(this.poslist[this.indexSelect],this.roleIndex)||this.indexSelect == 0) {
            this.txt_cost.visible = true;
            this.loader_cost.visible = true;
            this.lvl_tips.visible = false;
        }
        else {
            this.txt_cost.visible = false;
            this.loader_cost.visible = false;
            this.lvl_tips.visible = true;
        }
    }



}
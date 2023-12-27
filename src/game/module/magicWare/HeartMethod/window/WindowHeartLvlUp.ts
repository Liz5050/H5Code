class WindowHeartLvlUp extends BaseWindow {
    
    private txt_name : fairygui.GTextField;
    private list_star : fairygui.GList;
    private loader_icon: GLoader;
    private fight_panel : FightPanel;
    private txt_attr : fairygui.GRichTextField;
    private txt_cost : fairygui.GRichTextField;
    private btn_lvlup : fairygui.GButton;
    private btn_replace : fairygui.GButton;
    private mcUpStar: UIMovieClip;

    private cfg:any;
    private pdata:any

    private starmax : number;

    private isUp : boolean;
    private maxlvl : number;

    private modelContainer: fairygui.GComponent;
	private modelBody: egret.DisplayObjectContainer;
	private model: ModelShow;
    private isMax : boolean;
    private attrName : string[] =  ["剑气伤害","回春恢复","修罗怒斩","生命属性"];
    private weight : number[] = [2, 5, 1, 0];
    private c1 :fairygui.Controller;

    public constructor() {
        super(PackNameEnum.MagicWare , "WindowHeartLvlUp");
    }
    
    public initOptUI() : void {
        this.c1 = this.getController("c1");
        this.txt_name = this.getGObject("name").asTextField;
        this.list_star = this.getGObject("list_star").asList;
        this.loader_icon = <GLoader>this.getGObject("icon_loader");
        this.fight_panel = <FightPanel>this.getGObject("fight_panel");
        this.txt_attr = this.getGObject("attr_txt").asRichTextField;
        this.txt_cost = this.getGObject("cost_txt").asRichTextField;
        this.btn_lvlup = this.getGObject("uplvl_btn").asButton;
        this.btn_replace = this.getGObject("replace_btn").asButton;


        this.modelContainer = this.getGObject("effectContainer").asCom;
		this.model = new ModelShow(EShape.EHeartMethod);
		this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		this.modelBody.x = 12;
		this.modelBody.addChild(this.model);
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

        this.btn_lvlup.addClickListener(this.onClickUpLVL, this);
        this.btn_replace.addClickListener(this.onClickReplace, this);
        this.isUp = false;
        this.maxlvl = 5;
        this.list_star.removeChildrenToPool();
        this.starmax =5;
		for (let i = 0; i < 5; i++) {
			let item: fairygui.GComponent = this.list_star.addItemFromPool().asCom;
		}
    }

    public updateAll(data: any = null): void {

        if(data && data!=null) {
            this.pdata = data;
        }
        
        this.setUIbyItem(this.pdata);
        this.setStarListNum(this.cfg.newItemLevel);
        this.getFightCombat();
        this.checkTips();
	}


    private starListAddItem(num : number): void {
		for (let i = 0; i < 5; i++) {
			let item: fairygui.GComponent = this.list_star.getChildAt(i).asCom;
            item.visible = i < num;
			//let controller: fairygui.Controller = item.getController("c1");
		}
	}

    public setStarListNum(num: number): void {
        console.log(num);
		for (let i = 0; i < this.starmax; i++) {
			let item: fairygui.GComponent = this.list_star.getChildAt(i).asCom;
			let controller: fairygui.Controller = item.getController("c1");
			controller.selectedIndex = i < num ? 1 : 0;
		}
	}

    private playerUpStar(): void {
		if (this.mcUpStar == null) {
			this.mcUpStar = UIMovieManager.get(PackNameEnum.MCStar);//FuiUtil.createMc("MCStar", PackNameEnum.MovieClip);
			this.mcUpStar.x = -232;
			this.mcUpStar.y = -232;
		}
        var newlevel = this.cfg.newItemLevel;
        if(!newlevel) {
            newlevel = 0;
        }
		let starItem: fairygui.GComponent = this.list_star.getChildAt(newlevel).asCom;
		starItem.addChild(this.mcUpStar);
        this.setStarListNum(newlevel);
        this.setUIbyItem(this.pdata);
        this.checkTips();
        this.getFightCombat();
		this.mcUpStar.setPlaySettings(0, -1, 1, -1, function (): void {
			this.mcUpStar.removeFromParent();
			this.mcUpStar.playing = false;
            this.updateAll();
		}, this);
		this.mcUpStar.playing = true;
	}

    private setUIbyItem(data : any) : void {
        let cuData = CacheManager.cultivate.getCultivateInfoByRoleAndType(data.role, ECultivateType.ECultivateTypeHeartMethod);
        if(cuData) {
            let itemid = cuData.levelInfo[data.pos];
            this.cfg = ConfigManager.item.getByPk(itemid);
            this.loader_icon.load(URLManager.getModuleImgUrl(this.cfg.icon + "b.png",PackNameEnum.MagicWare));
            if(this.cfg) {
                this.updateUIbyCfg();
            }
        }
    }

    private updateUIbyCfg() {
        this.txt_name.text = this.cfg.name;
        this.txt_name.color = Color.ItemColor[this.cfg.color];
        this.txt_cost.text = "消耗 <font color=" + Color.getItemColr(this.cfg.color) + ">" + this.cfg.name + " </font>X1";
        if(this.cfg.color == 2){
            this.starListAddItem(3);
            this.maxlvl = 3;
            this.c1.selectedIndex = 0;
        }
        else {
            this.starListAddItem(5);
            this.maxlvl = 5;
            this.c1.selectedIndex = 1;
        }
        this.model.setData(20000+this.cfg.color-1);
        this.setAttrTxt();
        if(this.cfg.newItemLevel == this.maxlvl) {
            this.isMax = true;
        }
        else {
            this.isMax = false;
        }
        //this.btn_lvlup.visible = !this.isMax;
        this.txt_cost.visible = !this.isMax;
    }


    private setAttrTxt(){
        this.txt_attr.text = "";
        let str : string = "";
        if(this.cfg.baseLife) {
            str += "生       命   " + "<font color="+Color.Color_6 + ">+" +this.cfg.baseLife+"</font>" + "\n";
        }
        if(this.cfg.basePhysicalAttack) {
            str += "攻       击   " +"<font color="+Color.Color_6 + ">+"+ this.cfg.basePhysicalAttack +"</font>"+ "\n";
        }
        if(this.cfg.basePass) {
            str += "破       甲   " +"<font color="+Color.Color_6 + ">+"+ this.cfg.basePass +"</font>" + "\n";
        }
        if(this.cfg.basePhysicalDefense) {
            str += "防       御   " +"<font color="+Color.Color_6 + ">+"+ this.cfg.basePhysicalDefense + "</font>"+"\n";
        }
        if(this.cfg.baseAttrList) {

            str += this.attrName[Math.floor((this.pdata.pos - 1)/5)] +"   " +"<font color="+Color.Green + ">+"+ this.cfg.baseAttrList.split("#")[0].split(",")[1] + "</font>"+"\n";
        }

        this.txt_attr.text = str;
    }

    

    private onClickReplace() {
        EventManager.dispatch(LocalEventEnum.ReplaceHeartMethod,this.pdata.pos, this.pdata.role, 0);
        this.isUp = false;
    }

    private onClickUpLVL() {
        EventManager.dispatch(LocalEventEnum.UpLevelHeartMethod,this.pdata.pos, this.pdata.role, 0);
        this.isUp = true;
    }
    
    public onDataUpdate() {
        if(this.isUp) {
            this.playerUpStar();
            this.isUp = false;
        }
        else {
            this.updateAll();
        }
    }

    public getFightCombat() {

        if(this.cfg) {
            var attr = {1:0,2:0,3:0,4:0};
            if(this.cfg) {
                if(this.cfg.basePhysicalAttack) {
                    attr[1] += this.cfg.basePhysicalAttack;
                }
                if(this.cfg.basePass) {
                    attr[3] += this.cfg.basePass;
                }
                if(this.cfg.baseLife) {
                    attr[2] += this.cfg.baseLife;
                }
                if(this.cfg.basePhysicalDefense) {
                    attr[4] += this.cfg.basePhysicalDefense;
                }
            }
            var ex : string = this.cfg.baseAttrList;
            var exnum : number = 0;
            if(ex) {
                exnum = Number(ex.split("#")[0].split(",")[1]);
            }
            this.fight_panel.updateValue(WeaponUtil.getCombat(attr) + Math.ceil(exnum * this.weight[Math.floor((this.pdata.pos - 1)/5)]));
        }
    }
            
    public checkCanUplvlTips() {
         CommonUtils.setBtnTips(this.btn_lvlup, CacheManager.heartMethod.checkEquipCanUplvl(this.pdata.pos, this.pdata.role));
    }

    public checkCanReplaceTips() {
        CommonUtils.setBtnTips(this.btn_replace, CacheManager.heartMethod.checkEquipCanReplace(this.pdata.pos, this.pdata.role));
    }



    public checkTips() {
        this.checkCanUplvlTips();
        this.checkCanReplaceTips();
    }

    public updateProp() {
        this.checkTips();
    }

        




}
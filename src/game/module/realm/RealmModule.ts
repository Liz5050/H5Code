class RealmModule extends BaseWindow {
	
	private btn_up:fairygui.GButton;
	private baseitem:BaseItem;

	private txt_fighting:fairygui.GTextField;
	private txt_current:fairygui.GTextField;
	private txt_attribute1:fairygui.GTextField;
	private txt_next:fairygui.GTextField;
	private txt_attribute2:fairygui.GTextField;	
	private loader_current:GLoader;
	private loader_next:GLoader;
	private curCfgInf:any;
	private c1:fairygui.Controller;
	private nextInf:any;
	private isFightOk:boolean;
	private isItemOk:boolean;
	public constructor() {
		super(PackNameEnum.Realm,"Main",ModuleEnum.Realm);
	}

	public initOptUI():void{
		this.btn_up = this.getGObject("btn_up").asButton;
		this.baseitem = <BaseItem>this.getGObject("baseitem");

		this.txt_fighting = this.getGObject("txt_fighting").asTextField;
		this.txt_current = this.getGObject("txt_current").asTextField;
		this.txt_attribute1 = this.getGObject("txt_attribute1").asTextField;
		this.txt_next = this.getGObject("txt_next").asTextField;
		this.txt_attribute2 = this.getGObject("txt_attribute2").asTextField;

		this.loader_current = <GLoader>this.getGObject("loader_current");
		this.loader_next = <GLoader>this.getGObject("loader_next");

		this.c1 = this.getController("c1");

		this.btn_up.addClickListener(this.onClick,this);
	}

	public updateAll(data?:any):void{
		super.updateAll(data);
		var curLevel:number = CacheManager.role.role.realmLevel_BY;
		var curInf:any = ConfigManager.realm.getByPk(curLevel);
		var nextLv:number = curLevel + 1;
		var nextInf:any = ConfigManager.realm.getByPk(nextLv);
		var idx:number = 0;
		this.curCfgInf = curInf || nextInf;
		var needFight:number = 0;
		var nextFightStr:string = "";		
		if(!curInf){
			idx = 0;
			this.updateNext(nextInf);
			needFight = nextInf.warfareLimit || 0;
		}else if(!nextInf){
			idx = 2;
			nextInf = curInf;
			this.updateCur(this.curCfgInf);
			nextFightStr = HtmlUtil.html("----",Color.Green);
			this.baseitem.iconLoader.grayed = true;
			this.baseitem.touchable = false;
			App.DisplayUtils.grayButton(this.btn_up,true);
			this.btn_up.title = "已满级";
		}else{
			idx = 1;
			this.updateCur(this.curCfgInf);
			this.updateNext(nextInf);
			needFight = nextInf.warfareLimit || 0;
		}
		this.nextInf = nextInf;
		this.c1.selectedIndex = idx;
		this.isFightOk = CacheManager.role.combatCapabilities >= needFight;
		var clr:any = this.isFightOk?Color.Green:Color.Red;
		var combatCapabilities:string = ""+HtmlUtil.html(""+App.MathUtils.formatNum(CacheManager.role.combatCapabilities,false),clr);
		if(!nextFightStr){
			nextFightStr = HtmlUtil.html(""+App.MathUtils.formatNum(needFight,false),Color.Green);
		}
		this.txt_fighting.text = combatCapabilities+"/"+nextFightStr;// 玩家/下一境界配置
		this.updateItem();
	}

	public updateItem():void{
		if(this.nextInf){
			this.baseitem.itemData = new ItemData(this.nextInf.costItemCode);
			var hasNum:number = CacheManager.pack.backPackCache.getItemCountByCode2(this.nextInf.costItemCode);
			var costNum:number = this.nextInf.costItemNum || 0;
			this.isItemOk = hasNum >= costNum;
			var clr:any =  this.isItemOk?Color.Green:Color.Red;
			this.baseitem.updateNum(HtmlUtil.html(hasNum+"/"+costNum,clr));
		}		
	}

	private getInfStr(inf:any):string{
		let attrDict: any = WeaponUtil.getAttrDict(inf.attrList);
		var curHtml:string = HtmlUtil.html("战力：",Color.BASIC_COLOR_1)+HtmlUtil.html("+"+WeaponUtil.getCombat(attrDict),Color.BASIC_COLOR_2)+HtmlUtil.brText;
		curHtml += WeaponUtil.getAttrText(WeaponUtil.getAttrArray(inf.attrList),true,Color.BASIC_COLOR_2,Color.BASIC_COLOR_1);
		return curHtml;
	}

	private updateCur(curInf:any):void{
		var curHtml:string = this.getInfStr(curInf);		
		this.txt_attribute1.text = curHtml;
		var resId:string = this.getNameUrl(curInf);
		this.loader_current.load(resId);
	}

	private updateNext(nextInf:any):void{
		var curHtml:string = this.getInfStr(nextInf);		
		this.txt_attribute2.text = curHtml;
		var resId:string = this.getNameUrl(nextInf);
		this.loader_next.load(resId);
		
	}

	private getNameUrl(inf:any):string{
		var resId:string = URLManager.getIconUrl("name_"+inf.level,URLManager.REALM_ICON);
		return resId;
	}
	
	private onClick(e:egret.TouchEvent):void{
		if(!this.isFightOk){
			Tip.showTip(LangRealm.L1);
		}else if(!this.isItemOk){
			Tip.showTip(LangRealm.L2);
		}else{
			ProxyManager.player.upgradeRealm();
		}		
	}


}
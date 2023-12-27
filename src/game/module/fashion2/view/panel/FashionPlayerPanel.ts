class FashionPlayerPanel extends FashionBaseTabView {
	private fashionList: List;
	private attrList: fairygui.GList;
	private activeBtn: fairygui.GButton;
	private upgradeBtn: fairygui.GButton;
	private dressBtn: fairygui.GButton;
	private costBtn: fairygui.GButton;
	private statusController: fairygui.Controller;
	private fightPanel:FightPanel;
	
	private modelContainer: fairygui.GComponent;
	private playerModel: PlayerModel;

	private fashionType: number = -1;
	private selectedFahionData: any;
    private toolTipData: ToolTipData;
	private star: number;
	private isCanActOrUp: boolean = false;
	private isCanDress: boolean;
	private isMax: boolean;
	private datas:Array<any>;
	
	public constructor() {
		super();
	}

	public initOptUI():void {
		this.fashionList = new List(this.getGObject("list_fashion").asList);
		this.attrList = this.getGObject("list_attr").asList;
		this.activeBtn = this.getGObject("btn_active").asButton;
		this.upgradeBtn = this.getGObject("btn_upgrade").asButton;
		this.dressBtn = this.getGObject("btn_dress").asButton;
		this.costBtn = this.getGObject("btn_cost").asButton;

		this.statusController = this.getController("c1");
		this.fightPanel = <FightPanel>this.getGObject("fightPanel");

		this.modelContainer = this.getGObject("model_container").asCom;
		this.playerModel = new PlayerModel();
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.playerModel);

		this.activeBtn.addClickListener(this.clickActiveBtn, this);
		this.upgradeBtn.addClickListener(this.clickUpgradeBtn, this);
		this.dressBtn.addClickListener(this.clickDressBtn, this);
        this.costBtn.addClickListener(this.clickCostBtn, this);
		this.fashionList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
	}

	public updateAll(data:any=null):void {
		if(this.fashionType == -1){
			switch(this._tabType){
				case PanelTabType.FashionClothes:
					this.fashionType = EFashionType.EFashionClothes;
					break;
				case PanelTabType.FashionWeapon:
					this.fashionType = EFashionType.EFashionWeapon;
					break;
				case PanelTabType.FashionWing:
					this.fashionType = EFashionType.EFashionWing;
					break;
			}
		}
        this.datas = ConfigManager.mgFashion.getFashionByType(this.fashionType);
		let index:number = 0;
        if(data != null && data.fashionData != null && data.fashionData.code != null){
            index = this.getPlayerItemIndex(data.fashionData.code);
        }
		this.updateList(index);
	}

	protected updateRoleIndexView():void {
		CacheManager.fashionPlayer.operationIndex = this.roleIndex;
		this.fashionList.list.refreshVirtualList();
		this.updateAttr();
		this.updateModel();
		// this.playerModel.updateAll(this.roleIndex);
	}

	private clickActiveBtn(): void{
		if(this.isCanActOrUp){
			App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
			ProxyManager.fashionPlayer.activateFashion(this.fashionType, this.selectedFahionData.code, this.roleIndex);
		}else{
			Tip.showOptTip("时装激活道具不足");
		}
	}

	private clickUpgradeBtn(): void{
		if(this.selectedFahionData.timeLimit){
			Tip.showOptTip("限时装扮不能升级");
			return;
		}
		if(this.isMax){
			Tip.showOptTip("已升到满级");
			return;
		}
		if(this.isCanActOrUp){
			ProxyManager.fashionPlayer.upgradeFashion(this.fashionType, this.selectedFahionData.code, this.roleIndex);
		}else{
			Tip.showOptTip("时装升级道具不足");
		}
	}

	private clickDressBtn(): void{
		if(this.isCanDress){
			ProxyManager.fashionPlayer.dressFashion(this.fashionType, this.selectedFahionData.code, this.roleIndex);
			Tip.showOptTip("幻化形象成功");
		}else{
			ProxyManager.fashionPlayer.undressFashion(this.fashionType, this.selectedFahionData.code, this.roleIndex);
			Tip.showOptTip("取消幻化形象成功");
		}
	}

	private clickCostBtn():void{
        if (!this.toolTipData) {
            this.toolTipData = new ToolTipData();
            this.toolTipData.type = ToolTipTypeEnum.Fashion;
        }
		this.toolTipData.roleIndex = this.roleIndex;
        this.toolTipData.data = this.selectedFahionData;
        ToolTipManager.show(this.toolTipData);
    }

	/**消息推送后更新 */
	public updateFashionInfo(): void{
		this.fashionList.list.refreshVirtualList();
		this.onClickItem();
	}

	private onClickItem(): void{
		this.selectedFahionData = this.fashionList.selectedData;
		this.updateAttr();
	}

	private updateList(index:number = 0): void{
		this.fashionList.setVirtual(this.datas);
		this.fashionList.selectedIndex = index;
		this.selectedFahionData = this.fashionList.selectedData;
	}

	private updateAttr(): void{
		this.star = CacheManager.fashionPlayer.getFashionStar(this.roleIndex, this.selectedFahionData.code);
		this.isMax = this.star == ConfigManager.mgFashionStar.getMaxStar(this.selectedFahionData.code);
		let isActived: boolean = CacheManager.fashionPlayer.isFashionActived(this.roleIndex, this.selectedFahionData.code);
		let attrListData: Array<AttrInfo> = MgFashionStarConfig.getAttrListData(this.selectedFahionData.code, this.star);
		this.attrList.removeChildrenToPool();
		for (let data of attrListData) {
			let item: fairygui.GComponent = this.attrList.addItemFromPool().asCom;
			let curTxt: fairygui.GTextField = item.getChild("txt_cur").asTextField;
			let nextTxt: fairygui.GTextField = item.getChild("txt_next").asTextField;
			curTxt.text = `${data.name}: ${data.value}`;
			if(this.isMax){
				nextTxt.text = "";
			}else if(!isActived){
				nextTxt.text = `激活+${data.addValue}`;
			}else{
				nextTxt.text = `升级+${data.addValue}`;
			}
		}
		this.statusController.selectedIndex = isActived ? 1 : 0; 
		this.updateStatus();
		this.updateFight();
		this.updateCost(isActived);
		this.updateModel();
	}

	private updateFight(): void{
		let cfg: any = ConfigManager.mgFashionStar.getByCodeAndStar(this.selectedFahionData.code, this.star);
		let combat: number;
		if(!cfg){
			combat = 0;
		}else{
			combat = WeaponUtil.getCombat(WeaponUtil.getAttrDict(cfg.attrList));
		}
		this.fightPanel.updateValue(combat);
	}

	private updateStatus(): void{
		this.isCanDress = !CacheManager.fashionPlayer.isCurFashion(this.roleIndex, this.fashionType, this.selectedFahionData.code);
		if(this.isCanDress){
			this.dressBtn.title = "幻  化";
		}else{
			this.dressBtn.title = "卸  下";
		}
	}

	private updateCost(isActived: boolean): void{
		this.isCanActOrUp =  CacheManager.pack.propCache.getItemCountByCode2(this.selectedFahionData.propCode) > 0;
		let color: number = this.isCanActOrUp ? Color.Green2 : Color.Red2;
		this.costBtn.titleColor = color;
		if(!isActived){
			this.costBtn.title = `<font color=${Color.Color_8}>需要：</font><u>${this.selectedFahionData.name}x${this.selectedFahionData.useNum}</u>`;
		}else{
			let data: any = ConfigManager.mgFashionStar.getByCodeAndStar(this.selectedFahionData.code, this.star);
			this.costBtn.title = `<font color=${Color.Color_8}>需要：</font><u>${this.selectedFahionData.name}x${data.propNum}</u>`;
		}
		if(this.isMax){
			this.costBtn.visible = false;
		}else{
			this.costBtn.visible = true;
		}
	}

	private updateModel(): void{
		let modelDict: any = WeaponUtil.getAttrDict(this.selectedFahionData.modelIdList);
		let career: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(this.roleIndex));
		let weapons: any;
		CacheManager.fashionPlayer.setPlayerModel(modelDict, this.selectedFahionData.type);
		weapons = CacheManager.fashionPlayer.getPlayerModel(this.roleIndex);
		this.playerModel.updatePlayerModelAll(weapons, career);
	}

	private getPlayerItemIndex(code:number):number{
	    for(let i:number = 0; i < this.datas.length; i++){
	        if(code == this.datas[i].code){
	            return i;
            }
        }
        return 0;
    }

}
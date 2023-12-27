/**
 * 七天法宝激活界面
 */
class MagicWeaponActivePanel extends BaseTabPanel {
	private statusController: fairygui.Controller;
	private specialController: fairygui.Controller;
	private activeBtn: fairygui.GButton;
	private magicWeaponList: List;
	private attrList: fairygui.GList;
	private nameLoader: GLoader;
	private condTxt: fairygui.GTextField;
	private specialDescTxt: fairygui.GRichTextField;
	// private itemDatas: Array<ItemData>;

	/**模型展示 */
	private modelContainer: fairygui.GComponent;
	private modelBody: egret.DisplayObjectContainer;
	private model: ModelShow;

	private selectedIdx: number;
	private magicWeaponDatas: Array<any>;
	private curData: any;

	public initOptUI(): void {
		this.statusController = this.getController("c1");
		this.specialController = this.getController("c2");
		this.activeBtn = this.getGObject("btn_active").asButton;
		this.activeBtn.addClickListener(this.clickActiveBtn, this);
		this.magicWeaponList = new List(this.getGObject("list_magicWeapon").asList);
		this.attrList = this.getGObject("list_attr").asList;
		this.nameLoader = <GLoader>this.getGObject("loader_name");
		this.condTxt = this.getGObject("txt_cond").asTextField;
		this.specialDescTxt = this.getGObject("txt_specialDesc").asRichTextField;

		// this.effectContainer = this.getGObject("effectContainer").asCom;

		this.modelContainer = this.getGObject("effectContainer").asCom;
		this.model = new ModelShow(EShape.EMagicweapon);
		this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		this.modelBody.addChild(this.model);
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

		this.magicWeaponList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.magicWeaponDatas = ConfigManager.sevenDayMagicWeapon.getDatas();

		this.setActiveBtnEffect();

		GuideTargetManager.reg(GuideTargetName.SevenDayMagicWeaponModuleActiveBtn, this.activeBtn);
	}

	//根据缓存更新
	public updateAll(): void {
		// this.selectedIdx = 0;
		this.statusController.selectedIndex = 1;
		this.updateList();
		this.onClickItem();
	}

	/**法宝更新 */
	public updateInfo(): void{
		this.updateList();
		this.onClickItem();
	}

	private clickActiveBtn(): void{
		// this.controller.selectedIndex = 1;
		ProxyManager.sevenDayMagicWeapon.activateSevenDayMagicWeapon(this.curData.code);
	}

	private onClickItem(): void{
		this.selectedIdx = this.magicWeaponList.selectedIndex;
		this.curData = this.magicWeaponList.selectedData;
		if(this.curData){
			this.updateCurAttr();
		}
	}

	private updateList(): void{
		this.magicWeaponList.data = this.magicWeaponDatas;
		this.selectedIdx = this.updateSelect();
		this.magicWeaponList.selectedIndex = this.selectedIdx;
	}

	private updateSelect(): number{
		let datas: Array<any> = this.magicWeaponList.data;
		let sel: number = 0;
		for(let i = 0; i < datas.length; i++){
			let status: number = CacheManager.sevenDayMagicWeapon.getMagicWeaponStatus(datas[i]);
			if(status == 2){
				sel = i;
			}else if(status == 1){
				sel = i;
				break;
			}
		}
		return sel;
	}

	private updateCurAttr(): void{
		this.nameLoader.load(URLManager.getModuleImgUrl(`name/${this.curData.code}.png`, PackNameEnum.SevenDayMagicWeapon));
		
		let idx: number = CacheManager.sevenDayMagicWeapon.getMagicWeaponStatus(this.curData);
		this.statusController.selectedIndex = idx;
		if(idx == 0){
			this.condTxt.text = ConfigManager.sevenDayMagicWeapon.getCondStr(this.curData.code, true);
		}

		if(ConfigManager.sevenDayMagicWeapon.isSpecialMagicWeapon(this.curData.code)){
			this.specialController.selectedIndex = 1;
			this.specialDescTxt.text = HtmlUtil.br(this.curData.desc);
		}else{
			this.specialController.selectedIndex = 0;
			let attrDict: any = WeaponUtil.getAttrDict(this.curData.attrList);
			this.attrList.removeChildrenToPool();
			for(let key in attrDict){
				let item: fairygui.GComponent = this.attrList.addItemFromPool().asCom;
				let attrTxt: fairygui.GTextField = item.getChild("txt_attr").asTextField;
				attrTxt.text = `${GameDef.EJewelName[key][0]}+${attrDict[key]}`;
			}
		}
		this.updateModel();
	}

	private updateModel(): void{
		this.model.setData(this.curData.code);
		if(this.curData.code == 3){
			this.modelContainer.setScale(1.2, 1.2);
		}else if(this.curData.code == 4){
			this.modelContainer.setScale(1.1, 1.1);
		}else if(this.curData.code == 5){
			this.modelContainer.setScale(1.2, 1.2);
		}else if(this.curData.code == 6){
			this.modelContainer.setScale(1.4, 1.4);
		}else{
			this.modelContainer.setScale(1, 1);
		}

		let isActived: boolean = CacheManager.sevenDayMagicWeapon.getMagicWeaponStatus(this.curData) == 2;
		this.model.setMcGrayed(!isActived);
	}

	private setActiveBtnEffect(): void{
		App.DisplayUtils.addBtnEffect(this.activeBtn, true);
		// let btnMC: UIMovieClip = UIMovieManager.get(PackNameEnum.MCOneKey);
		// this.activeBtn.addChild(btnMC);
		// btnMC.x = -164;
		// btnMC.y = -222;
	}
}
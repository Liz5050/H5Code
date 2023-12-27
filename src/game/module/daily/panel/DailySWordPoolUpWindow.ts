/**
 * 剑池外形升级窗口
 */
class DailySWordPoolUpWindow extends BaseWindow {
	private c1: fairygui.Controller;
	private nameLoader: GLoader;
	private fightTxt: fairygui.GTextField;
	private modelContainer: fairygui.GComponent;
	private modelBody: egret.DisplayObjectContainer;
	private model: ModelShow;
	private leftBtn: fairygui.GButton;
	private rightBtn: fairygui.GButton;
	private attrTxt: fairygui.GTextField;
	private hideCb: fairygui.GButton;
	private changeBtn: fairygui.GButton;
	private lv1Txt: fairygui.GTextField;
	private lv2Txt: fairygui.GTextField;
	private expProgress: fairygui.GProgressBar;
	private upBtn: fairygui.GButton;
	private openTxt: fairygui.GTextField;
	private cfg: any;
	/**当前模型序号 */
	private modelIndex: number;
	private modelArray: Array<any>;
	private modelNum: number;

	public constructor() {
		super(PackNameEnum.Daily, "WindowSWordPoolUp");
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.nameLoader = <GLoader>this.getGObject("loader_name");
		this.modelContainer = this.getGObject("model_container").asCom;
		this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		this.model = new ModelShow(EShape.EShapeSoul);
		this.modelBody.addChild(this.model);
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

		this.fightTxt = this.getGObject("txt_fight").asTextField;
		this.leftBtn = this.getGObject("btn_left").asButton;
		this.rightBtn = this.getGObject("btn_right").asButton;
		this.leftBtn.addClickListener(this.clickLeft, this);
		this.rightBtn.addClickListener(this.clickRight, this);
		this.attrTxt = this.getGObject("txt_attr").asTextField;
		this.hideCb = this.getGObject("cb_hide").asButton;
		this.hideCb.addClickListener(this.clickCb, this);
		this.changeBtn = this.getGObject("btn_change").asButton;
		this.changeBtn.addClickListener(this.clickChange, this);
		this.lv1Txt = this.getGObject("txt_level1").asTextField;
		this.lv2Txt = this.getGObject("txt_level2").asTextField;
		this.expProgress = this.getGObject("progressBar").asProgress;
		this.upBtn = this.getGObject("btn_up").asButton;
		this.upBtn.addClickListener(this.clickUp, this);
		this.openTxt = this.getGObject("txt_open").asTextField;

		this.modelArray = ConfigManager.swordPool.modelArray;
		this.modelNum = this.modelArray.length;
	}

	public updateAll(data: any = null): void {
		let sWordPool: any = CacheManager.daily.swordPool;
		this.lv1Txt.text = `Lv.${sWordPool.level_I}`;
		this.lv2Txt.text = `Lv.${sWordPool.level_I + 1}`;
		this.cfg = ConfigManager.swordPool.getByPk(sWordPool.level_I);
		if (this.cfg) {
			if (data != null) {
				this.modelIndex = this.getModelIndex(data);
			} else {
				this.modelIndex = this.getModelIndex(this.cfg.modelId);
			}

			this.expProgress.value = sWordPool.exp_I;
			this.expProgress.max = this.cfg.needExp;
			// let attrArray: Array<any> = WeaponUtil.getAttrArray(this.cfg.attrList);
			let attrDict: any = WeaponUtil.getAttrDict(this.cfg.attrList);
			let attr: string = "";
			for (let key in attrDict) {
				attr += `${GameDef.EJewelName[key][0]}:+${attrDict[key]}\n`;
			}
			this.attrTxt.text = attr;
			this.fightTxt.text = WeaponUtil.getCombat(attrDict).toString();
			this.updateModel(this.cfg.modelId);
		}
		this.processLRBtn();
		this.updateModelByModelIndex(this.modelIndex);
	}

	private getModelIndex(modelId: number): number {
		for (let i: number = 0; i < this.modelNum; i++) {
			if (this.modelArray[i].modelId == modelId) {
				return i;
			}
		}
		return -1;
	}

	private updateModel(modelId: number): void {
		this.model.setData(modelId);
		this.model.x = 300;
		this.model.y = 350;
		this.nameLoader.load(URLManager.getPackResUrl(PackNameEnum.Daily, `img_name${modelId}`));
	}

	private clickLeft(): void {
		this.modelIndex -= 1;
		this.updateModelByModelIndex(this.modelIndex);
	}

	private clickRight(): void {
		this.modelIndex += 1;
		this.updateModelByModelIndex(this.modelIndex);
	}

	private updateModelByModelIndex(modelIndex: number): void {
		let cfg: any = this.modelArray[modelIndex];
		if (CacheManager.daily.swordPoolLevel < cfg.level) {
			this.c1.selectedIndex = 2;
			this.openTxt.text = `Lv${cfg.level}可激活`;
		} else {
			this.c1.selectedIndex = CacheManager.daily.swordPoolModelId == cfg.modelId ? 1 : 0;
		}

		this.updateModel(cfg.modelId);
		this.processLRBtn();
	}

	private processLRBtn(): void {
		this.leftBtn.visible = this.modelIndex != 0;
		this.rightBtn.visible = this.modelIndex < this.modelNum - 1;
	}

	private clickCb(): void {
		EventManager.dispatch(LocalEventEnum.DailySPNotShow, this.hideCb.selected);
	}

	/**
	 * 化形
	 */
	private clickChange(): void {
		let cfg: any = this.modelArray[this.modelIndex];
		EventManager.dispatch(LocalEventEnum.DailySPChangeModel, cfg.modelId);
	}

	/**
	 * 点击升级
	 */
	private clickUp(): void {
		if (this.c1.selectedIndex == 2) {
			Tip.showTip(this.openTxt.text);
			return;
		}
		if (CacheManager.daily.swordPoolExp < this.cfg.needExp) {
			Tip.showTip("经验不足，无法升级");
			return;
		}
		EventManager.dispatch(LocalEventEnum.DailySPUpgrade);
	}
}
/**
 * 外形
 */
class ShapeController extends BaseController {
	private module: ShapeModule;
	private shapeSkillTipView: ShapeSkillTipView;
	private replaceWindow : ShapeWindowReplace;
	private toolTipData: ToolTipData;

	//外形子控制器
	private mount: MountController;
	private pet: PetController;
	private battleArray: BattleArrayController;
	private wing: WingController;
	private magicArray : MagicArrayController;

	public constructor() {
		super(ModuleEnum.Shape);
	}

	public initView(): BaseModule {
		this.module = new ShapeModule();
		this.mount.setModule(this.module);
		this.pet.setModule(this.module);
		this.battleArray.setModule(this.module);
		this.magicArray.setModule(this.module);
		this.wing.setModule(this.module);
		return this.module;
	}

	public addListenerOnInit(): void {
		this.mount = new MountController();
		this.pet = new PetController();
		this.battleArray = new BattleArrayController();
		this.wing = new WingController();
		this.magicArray = new MagicArrayController();

		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateShapeList], this.onShapeList, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateShape], this.onShape, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeUpgrade], this.onShapeUpgrade, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeUpgradeEx], this.onShapeUpdateEx, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeActivate], this.onShapeActivate, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeDressEquip], this.onShapeDressEquip, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeUpgradeEquip], this.onShapeUpgradeEquip, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeUpgradeChangeEx], this.onShapeUpgradeChangeEx, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeUpgradeChangeSkill], this.onShapeUpgradeChangeSkill, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeChangeUseModel], this.onShapeChangeUseModel, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeChangeUseModelEx], this.onShapeChangeUseModelEx, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameStrengthenExWingChangeUseModel], this.onWingShapeChangeUseModel, this);

		this.addListen0(UIEventEnum.ShapeSkillTipViewOpen, this.shapeSkillTipViewOpen, this);
		this.addListen0(UIEventEnum.ShapeEquipReplaceOpen, this.openEquipReplaceWindow, this);

		this.addListen0(LocalEventEnum.ShapeChangeModel, this.shapeChangeModel, this);
		this.addListen0(LocalEventEnum.ShapeChangeModelCancel, this.shapeChangeModelCancel, this);
		this.addListen0(UIEventEnum.ShapeChangePropTip, this.showChangePropTip, this);
	}

	protected addListenerOnShow(): void {
		this.mount.addListenerOnShow();
		this.pet.addListenerOnShow();
		this.battleArray.addListenerOnShow();
		this.wing.addListenerOnShow();

		this.addListen1(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);
		this.addListen1(LocalEventEnum.GameCrossDay, this.onUpdateIcon, this);//服务器跨天
	}

	/**
	 * 道具背包更新
	 */
	private packPosTypePropChange(): void {
		this.module.onPropUpdate();
	}

	private onUpdateIcon(): void{
		this.module.updateIcon();
	}

	/**
	 * 登录更新外形列表
	 * @param data SShapeList
	 */
	private onShapeList(data: any): void {
		let shapeInfo: any = {};
		for (let shape of data.list.data) {
			if (!shapeInfo[shape.shape_I]) {
				shapeInfo[shape.shape_I] = {};
			}
			if (shape.shape_I == EShape.EShapePet || shape.shape_I == EShape.EShapeSpirit) {
				shapeInfo[shape.shape_I] = shape;
			}
			else {
				shapeInfo[shape.shape_I][shape.roleIdx_I] = shape;
			}
		}
		CacheManager.shape.shapeInfo = shapeInfo;
		EventManager.dispatch(LocalEventEnum.ShapeListUpdate);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Shape, CacheManager.shape.checkTips());
		this.shapeListUpdate();

		if(this.module && this.module.isShow){
			this.module.updatePanel();
		}
	}

	/**
	 * 外形升级
	 * @param data SShapeList
	 */
	private onShape(data: any): void {
		CacheManager.shape.shapeInfoUpdate(data);
		EventManager.dispatch(LocalEventEnum.ShapeUpdate);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Shape, CacheManager.shape.checkTips());
		this.shapeUpdate(data.shape_I);

		if(this.module && this.module.isShow){
			this.module.updatePanel();
		}
	}

	/**外形（宠物/坐骑）进阶
	 * @param data S2C_SShapeUpgrade
	 */
	private onShapeUpgrade(data: any): void {
		let shapeInfo: any = CacheManager.shape.getShapeInfo(data.shape, data.roleIdx);
		if (shapeInfo) {
			if (data.result) {//升星
				shapeInfo.lucky_I = data.addLucky;
			} else {
				shapeInfo.lucky_I += data.addLucky;
			}
			CacheManager.shape.shapeInfoUpdate(shapeInfo);
		}
		EventManager.dispatch(LocalEventEnum.ShapeUpgrade, data);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Shape, CacheManager.shape.checkTips());

		if(this.module && this.module.isShow){
			this.module.luckUpgrade(data);
		}
	}

	/**外形进阶扩展（神兵/翅膀/法宝）
	 * @param data S2C_SShapeUpgradeEx
	 */
	private onShapeUpdateEx(data: any): void {
		let shapeInfo: any = CacheManager.shape.getShapeInfo(data.shape);
		if (shapeInfo) {
			if (data.result) {//升星
				shapeInfo.lucky_I = data.addLucky;
			} else {
				shapeInfo.lucky_I += data.addLucky;
			}
			CacheManager.shape.shapeInfoUpdate(shapeInfo);
		}
		EventManager.dispatch(LocalEventEnum.ShapeUpgradeEx);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Shape, CacheManager.shape.checkTips());
		// let result: boolean = data.result;
		// let addLucky: number = data.addLucky;
	}

	/**外形激活
	 * @param data S2C_SShapeActivate
	 */
	protected onShapeActivate(data: any): void {
		EventManager.dispatch(LocalEventEnum.ShapeActivate, data.shape);
		// if(this.isShow) {
		// 	//打开界面的情况下是手动点击激活，界面未打开是通过任务激活的
		// 	EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{type:data.shape,roleIndex:data.roleIdx});
		// }
	}

	/**
	 * 穿戴外形装备
	 * @param data S2C_SDressShapeEquip
	 */
	private onShapeDressEquip(data: any): void {
		EventManager.dispatch(LocalEventEnum.ShapeDressEquip, data.shape);
	}

	/**
	 * 升级外形装备
	 * @param data S2C_SUpgradeShapeEquip
	 */
	private onShapeUpgradeEquip(data: any): void {
		EventManager.dispatch(LocalEventEnum.ShapeUpgradeEquip, data);

		// if(data.shape == EShape.EShapePet){
		// 	let equips: any = CacheManager.pet.getEquips();
		// 	let itemCfg: any = ConfigManager.item.getByPk(equips[data.type]);
		// 	if(itemCfg){
				// Tip.showTip(`获得<font color = ${Color.ItemColor[itemCfg.color]}>${itemCfg.name}x1</font>`);
		// 	}
		// }
	}

	/**
	 * 升级化形（宠物/坐骑）
	 * @param data S2C_SUpgradeChangeEx
	 */
	private onShapeUpgradeChangeEx(data: any): void {
		CacheManager.shape.updateChangeLucky(data);
		EventManager.dispatch(LocalEventEnum.ShapeUpgradeChangeEx, data);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Shape, CacheManager.shape.checkTips());
	}

	/**
	 * 升级化形技能
	 * @param data S2C_SUpgradeChangeSkill
	 */
	private onShapeUpgradeChangeSkill(data: any): void {

	}

	/**
	 * 幻化模型返回
	 * @param data S2C_SChangeUseModel
	 */
	private onShapeChangeUseModel(data: any): void {
		CacheManager.shape.sChangeUseModelEx = data;
		EventManager.dispatch(LocalEventEnum.ShapeChangeModelCancelSuccess, data);
	}

	/**
	 * 幻化模型返回
	 * @param data S2C_SChangeUseModelEx
	 */
	private onShapeChangeUseModelEx(data: any): void {
		CacheManager.shape.sChangeUseModelEx = data;
		EventManager.dispatch(LocalEventEnum.ShapeChangeModelSuccess, data);
	}

	private onWingShapeChangeUseModel(data : any): void {
		CacheManager.shape.wingChangeUseModel = data;
		EventManager.dispatch(LocalEventEnum.ShapeChangeModelSuccess, data);
	}

	/**外形列表更新 */
	protected shapeListUpdate(): void {

	}

	/**外形更新(单个) */
	protected shapeUpdate(shape: EShape): void {

	}

	/**外形（宠物/坐骑）进阶 */
	protected shapeUpgrade(data: any): void {

	}

	/**外形进阶扩展（神兵/翅膀/法宝） */
	protected shapeUpdateEx(data: any): void {

	}


	/**
	 * 打开技能tip
	 */
	private shapeSkillTipViewOpen(data: any): void {
		if (this.shapeSkillTipView == null) {
			this.shapeSkillTipView = new ShapeSkillTipView();
		}
		this.shapeSkillTipView.show(data);
	}

	/**打开外形装备替换窗口 */
	public openEquipReplaceWindow(data : any) {
		if(!this.isShow) {
			return;
		}
		if(!this.replaceWindow) {
			this.replaceWindow = new ShapeWindowReplace();
		}
		this.replaceWindow.show(data);
	}

	/**
	 * 幻化模型
	 */
	private shapeChangeModel(data: any): void {
		let roleIndex: number = data.roleIndex ? data.roleIndex : 0;
		if (data.shape == EShape.EShapeSpirit) {
			ProxyManager.shape.shapeChangeUseModelByC(data.shape, data.change);
		}
		else if(data.shape == EShape.EShapeWing) {
			ProxyManager.shape.wingChangeUseUseModel(data.shape, data.change,roleIndex);
		}
		else {
			ProxyManager.shape.shapeChangeUseModelEx(data.shape, data.change, roleIndex);
		}
	}


	/**
	 * 取消幻化
	 */
	private shapeChangeModelCancel(data: any): void {
		let roleIndex: number = data.roleIndex ? data.roleIndex : 0;
		let shape: number = data.shape;
		let stage: number;
		let cfg: any;


		switch (shape) {
			case EShape.EShapePet:
				cfg = ConfigManager.mgShape.getByShapeAndLevel(shape, CacheManager.pet.level);
				break;
			case EShape.EShapeLaw:
				cfg = ConfigManager.mgShape.getByShapeAndLevel(shape, CacheManager.magicArray.getLevel(roleIndex));
				break;
			case EShape.EShapeSpirit:
				cfg = ConfigManager.mgShape.getByShapeAndLevel(shape, CacheManager.magicWeaponStrengthen.level);
				break;
			case EShape.EShapeBattle:
				cfg = ConfigManager.mgShape.getByShapeAndLevel(shape, CacheManager.battleArray.getLevel(roleIndex));
				break;
			case EShape.EShapeMount:
				cfg = ConfigManager.mgShape.getByShapeAndLevel(shape, CacheManager.mount.getLevel(roleIndex));
				break;
			case EShape.EShapeSwordPool:
				cfg = ConfigManager.mgShape.getByShapeAndLevel(shape, CacheManager.swordPool.getLevel(roleIndex));
				break;
			case EShape.EShapeWing:
				ProxyManager.shape.wingChangeCancelUseModel(roleIndex);
				return;
		}
		stage = cfg.stage;
		ProxyManager.shape.shapeChangeUseModelByS(shape, stage, roleIndex);
	}


	private showChangePropTip(itemData: ItemData): void {
		if (!this.toolTipData) {
			this.toolTipData = new ToolTipData();
			this.toolTipData.type = ToolTipTypeEnum.ShapeChangeProp;
		}
		this.toolTipData.data = itemData;
		ToolTipManager.show(this.toolTipData);
	}

}
class UpgradeSuccessView extends BaseWindow{
	private c1:fairygui.Controller;
	private loader_title:GLoader;
    private bg1Loader: GLoader;
    private bg2Loader: GLoader;
    private loaderIco: GLoader;
    private stageLoader: GLoader;
    private nameLoader: GLoader;
    private descLoader: GLoader;
    private modelContainer: ModelContainer;

    private mcStage: UIMovieClip;
	private mcSuccess: UIMovieClip;

    private shape: EShape;
	private fashionType:EFashionType;
	private roleIndex:number = 0;
	public constructor() {
		super(PackNameEnum.Open,"UpgradeSuccessView");
		this.isShowCloseObj = true;
	}
	
	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.loader_title = this.getGObject("loader_title") as GLoader;
        this.bg1Loader = this.getGObject("loader_bg1") as GLoader;
        this.bg2Loader = this.getGObject("loader_bg2") as GLoader;
        this.stageLoader = this.getGObject("loader_stage") as GLoader;
        this.nameLoader = this.getGObject("loader_name") as GLoader;
        this.descLoader = this.getGObject("loader_desc") as GLoader;
        this.loaderIco = this.getGObject("loader_ico") as GLoader;

        this.modelContainer = new ModelContainer(this.getGObject("model_container").asCom, EShape.EShapePet);
        this.mcStage = UIMovieManager.get(PackNameEnum.MCStage, -350, -160);
        this.modelContainer.addChildAt(this.mcStage, 0);
        this.modelContainer.isShapeChangeMc = true;

        this.bg1Loader.load(URLManager.getModuleImgUrl("bg1.png", PackNameEnum.Open));
        this.bg2Loader.load(URLManager.getModuleImgUrl("bg2.png", PackNameEnum.Open));
        // this.haloLoader.load(URLManager.getModuleImgUrl("halo.png", PackNameEnum.Open));
        this.stageLoader.load(URLManager.getModuleImgUrl("bg_stage.png", PackNameEnum.Open));
		this.loader_title.load(URLManager.getModuleImgUrl("title.png", PackNameEnum.Activation));
    }

	public updateAll(data: any = null): void {
        this.shape = data.type;
		this.fashionType = data.fashionType;
		this.roleIndex = data.roleIndex >= 0 ? data.roleIndex : 0;
		let toY:number = 0;
		let toX:number = 0;
		let modelId:number = 0;
		let nameUrl:string = "";
		let descUrl:string = "";
		let curCfg:any;
		let changePackName:string;
		let playMc:boolean = true;
		if(data.fashionType) {
			//激活时装
			switch(this.fashionType) {
				case EFashionType.EFashionClothes:
					this.shape = EShape.ECustomPlayer;
					toY = 30;
					break;
				case EFashionType.EFashionWeapon:
					this.shape = EShape.EShapeMagic;
					toX = 130;
					toY = -20;
					break;
				case EFashionType.EFashionWing:
					this.shape = EShape.EShapeWing;
					break;
			}
			curCfg = ConfigManager.mgFashion.getByPk(data.fashionCode);
			let career: number = CacheManager.role.getRoleCareerByIndex(this.roleIndex, true);
			let modelDict: any = WeaponUtil.getAttrDict(curCfg.modelIdList);
			modelId = modelDict[career];
			playMc = false;
		}
		else if(data.type){
			switch(this.shape) {
				case EShape.EShapePet:
					changePackName = PackNameEnum.PetChange;
					curCfg = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapePet, CacheManager.pet.level);
					modelId = curCfg.modelId;
					nameUrl = URLManager.getModuleImgUrl(curCfg.modelId + ".png", PackNameEnum.Pet);
					descUrl = URLManager.getModuleImgUrl("pet_1.png", PackNameEnum.Open);
					break;
				case EShape.EShapeMount:
					changePackName = PackNameEnum.MountChange;
					curCfg = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeMount, CacheManager.mount.getLevel(this.roleIndex));
					modelId = curCfg.modelId;
					nameUrl = URLManager.getModuleImgUrl(curCfg.modelId + ".png", PackNameEnum.Mount);
					descUrl = URLManager.getModuleImgUrl("mount_1.png", PackNameEnum.Open);
					break;
				case EShape.EShapeWing:
					changePackName = PackNameEnum.MagicWingChange;
					curCfg = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeWing, this.roleIndex);
					// curCfg = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeWing, this.roleIndex);
					modelId = curCfg.modelId;
					nameUrl = URLManager.getModuleImgUrl(curCfg.modelId + ".png", PackNameEnum.MagicWingChange);
					descUrl = URLManager.getModuleImgUrl("wing_1.png", PackNameEnum.Open);
					break;
				case EShape.EShapeLaw:
					toY = 130;
					break;
				case EShape.EShapeBattle:
					changePackName = PackNameEnum.ShapeBattle;
					toY = 65;
					curCfg = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeBattle, CacheManager.battleArray.getLevel(this.roleIndex));
					modelId = curCfg.modelId;
					nameUrl = URLManager.getModuleImgUrl(curCfg.modelId + ".png", PackNameEnum.ShapeBattle);
					descUrl = URLManager.getModuleImgUrl("battle_1.png", PackNameEnum.Open);
					break;
				case EShape.EShapeSwordPool:
					changePackName = PackNameEnum.SwordPool;
					toY = 30;
					curCfg = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeSwordPool, CacheManager.swordPool.getLevel(this.roleIndex));
					modelId = curCfg.modelId;
					nameUrl = URLManager.getModuleImgUrl(curCfg.modelId + ".png", PackNameEnum.SwordPool);
					descUrl = URLManager.getModuleImgUrl("swordpool_1.png", PackNameEnum.Open);
					break;
				case EShape.EDragonScale:
					// curCfg = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeDragonSoul, this.roleIndex);
					modelId = 1;
					nameUrl = URLManager.getModuleImgUrl("dragonsoul_0.png", PackNameEnum.Open);
					break;
				case EShape.EMagicweapon:
					nameUrl = URLManager.getModuleImgUrl("name/name_" + data.modelId +".png", PackNameEnum.SevenDayMagicWeapon);
					playMc = false;
					break;
				case EShape.EShapeSpirit:
					changePackName = PackNameEnum.MagicWeaponChange;
					break;
			}
		}

		if(data.modelId > 0) {
			modelId = data.modelId;
		}

		if(data.changeId > 0) {
			//激活幻形
			nameUrl = URLManager.getModuleImgUrl(data.changeId + ".png", changePackName);
			descUrl = "";
			playMc = false;
		}

		if(modelId > 0) { 
			//有动态模型
			this.loaderIco.visible = false;
			this.modelContainer.setBodyVisible(true);
			this.modelContainer.updateModel(modelId, this.shape);
			this.modelContainer.updatePosition(toX, toY);
		}
		else {
			this.loaderIco.visible = true;
			// this.loaderIco.load(info.urlModel);
			this.modelContainer.setBodyVisible(false);
		}            

		if(!nameUrl) {
			this.nameLoader.clear();
			this.c1.selectedIndex = 1;
		}
		else {
			this.nameLoader.load(nameUrl);
			this.c1.selectedIndex = 0;
		}
		if(!descUrl) {
			this.descLoader.clear();
		}
		else {
			this.descLoader.load(descUrl);
		}            
		if(playMc) {
			this.playSuccessMc();
			this.loader_title.visible = false;
		}
		else {
			this.loader_title.visible = true;
		}
    }

	//进阶成功特效
	private playSuccessMc(): void {
		this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
        this.mcSuccess.x = 56;
        this.mcSuccess.y = -200;
        this.addChild(this.mcSuccess);
        this.mcSuccess.alpha = 1;
        egret.Tween.removeTweens(this.mcSuccess);
        this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
            egret.Tween.get(this.mcSuccess).to({ alpha: 0 }, 2000).call(() => {
				UIMovieManager.push(this.mcSuccess);
				this.mcSuccess = null;
            })
        }, this);
        this.mcSuccess.playing = true;
    }

	public hide():void {
		super.hide();
		if(this.mcSuccess) {
			egret.Tween.removeTweens(this.mcSuccess);
			UIMovieManager.push(this.mcSuccess);
			this.mcSuccess = null;
		}
	}
}
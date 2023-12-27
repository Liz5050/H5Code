/**
 * 玩家模型展示
 */
class PlayerModel extends egret.DisplayObjectContainer {
	private wingContainer: egret.DisplayObjectContainer;
	private playerContainer: egret.DisplayObjectContainer;
	private weaponContainer: egret.DisplayObjectContainer;
	private spiritContainer: egret.DisplayObjectContainer;
	private lawContainer1 : egret.DisplayObjectContainer;
	private lawContainer2 : egret.DisplayObjectContainer;
	private swordPoolContainer: egret.DisplayObjectContainer;

	private player: ModelShow;//人物
	private spirit: ModelShow;//法宝
	private weapon: ModelShow;//武器
	private wing: ModelShow;//翅膀
	private title: ModelShow;//称号
	private ancient: ModelShow;//混元装备
	private law1 : ModelShow;
	private law2 : ModelShow;
	private swordPool : ModelShow;
	private _showArray: Array<number>;
	private lastModelDict: any = {};//上一次显示的模型
	private curRoleIndex:number = 0;
	/**
	 * 需要显示的模型类型
	 */
	public constructor(showArray: Array<EEntityAttribute> = null) {
		super();
		this.wingContainer = new egret.DisplayObjectContainer();
		this.playerContainer = new egret.DisplayObjectContainer();
		this.weaponContainer = new egret.DisplayObjectContainer();
		this.spiritContainer = new egret.DisplayObjectContainer();
		this.lawContainer1 = new egret.DisplayObjectContainer();
		this.lawContainer2 = new egret.DisplayObjectContainer();
		this.swordPoolContainer = new egret.DisplayObjectContainer();
		// this.titleContainer

		this.addChild(this.lawContainer1);
		this.addChild(this.wingContainer);
		this.addChild(this.weaponContainer);
		this.addChild(this.playerContainer);
		this.addChild(this.spiritContainer);
		this.addChild(this.lawContainer2);
		this.addChild(this.swordPoolContainer);

		this.lawContainer1.x += 10;
		this.lawContainer1.y += 140;
		this.lawContainer2.x += 10;
		this.lawContainer2.y += 140;

		this.swordPoolContainer.y -= 60;


		if (showArray == null) {
			showArray = [EEntityAttribute.EAttributeClothes, 
			EEntityAttribute.EAttributeWing, EEntityAttribute.EAttributeWeapon, 
			EEntityAttribute.EAttributeTitleMain,
			EEntityAttribute.EAttributeForeverEquipSuit,
			EEntityAttribute.EAttributeShapeLaw,
			EEntityAttribute.EAttributeShapeSwordPool,
			];
		}
		this.showArray = showArray;

	}

	public set showArray(showArray: Array<EEntityAttribute>) {
		this._showArray = showArray;
	}

	public get showArray(): Array<EEntityAttribute> {
		return this._showArray;
	}

	/**
	 * 更新模型
	 */
	public updateModelByType(type: EEntityAttribute): void {
		switch (type) {
			case EEntityAttribute.EAttributeWing:
				this.updateWing();
				break;
			case EEntityAttribute.EAttributeShapeMagic:
			case EEntityAttribute.EAttributeWeapon:
				this.updateWeapon();
				break;
			case EEntityAttribute.EAttributeForeverEquipSuit:
				this.updateAncient();
				break;
			case EEntityAttribute.EAttributeClothes:
				this.updatePlayer();
				break;
			case EEntityAttribute.EAttributeShapeSpirit:
				this.updateSpirit();
				break;
			case EEntityAttribute.EAttributeShapeSwordPool:
				this.updateSwordPoolModel();
				break;
		}
	}

	public updateAll(roleIndex:number=0): void {
		this.curRoleIndex = roleIndex;
		this.updateWing();
		this.updateWeapon();
		this.updatePlayer();
		this.updateSpirit();
		this.updateAncient();
		this.updateSwordPoolModel();
	}

	/**
	 * 根据weapons更新玩家所有外观模型
	 */
	public updatePlayerModelAll(weapons:any,career:number):void {
		if (!weapons) {
			this.reset();
			return;
		}
		if (weapons.key_I) {//是miniPlayer中的roleWeapons
			let w:any = {};
            for (let i: number = 0; i < weapons.key_I.length; i++) {
                w[weapons.key_I[i]] = weapons.value_I[i];
            }
            weapons = w;
		}
		let modelId: number = WeaponUtil.getModelId(EEntityAttribute.EAttributeWing, weapons, career);
		this.updateWing(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeWeapon, weapons, career);
		this.updateWeapon(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeClothes, weapons, career);
		this.updatePlayer(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeShapeSpirit, weapons, career);
		this.updateSpirit(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeShapeLaw, weapons, career);
		this.updateLawModel(modelId);

		modelId = WeaponUtil.getModelId(EEntityAttribute.EAttributeShapeSwordPool, weapons, career);
		this.updateSwordPoolModel(modelId);
	}

	/**
	 * 更新翅膀
	 */
	public updateWing(modelId: number = -1): void {
		if (modelId == -1) {
			modelId = CacheManager.role.getModelId(EEntityAttribute.EAttributeWing,this.curRoleIndex);
		}
		if(!modelId) {
			if(this.wing) {
				this.wing.destroy();
				this.wing = null;
				delete this.lastModelDict[EEntityAttribute.EAttributeWing];
			}
			return;
		}
		this.setWingPosition(); //如果下面return，不用改变模型，位置也要重置
		if (this.lastModelDict[EEntityAttribute.EAttributeWing] == modelId) {
			return;
		} else {
			if( this.showArray.indexOf(EEntityAttribute.EAttributeWing) == -1) {
				return;
			}
		}
		if(!this.wing)
		{
			this.wing = new ModelShow(EShape.EShapeWing);
			this.wingContainer.addChild(this.wing);
		}
		this.wing.setData(modelId);
		this.setWingPosition();

		this.lastModelDict[EEntityAttribute.EAttributeWing] = modelId;
	}

	private setWingPosition():void {
		if (this.wing) {
			let roleCareer: number = CacheManager.role.getRoleCareer();
			let roleBaseCareer: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(this.curRoleIndex));
			let cfg: any;
			if (1 != roleBaseCareer) { //不是战士
				cfg = ModelDef.ModelPlayerPos["wing"][1];
			} else { //默认是战士
				cfg = ModelDef.ModelPlayerPos["wing"][0];
			}
			if (null != cfg) {
				this.wing.x = cfg.x;
				this.wing.y = cfg.y;
			}
		}
	}

	/**
	 * 更新武器/神兵
	 */
	public updateWeapon(modelId: number = -1): void {
		if (modelId == -1) {
			modelId = CacheManager.role.getModelId(EEntityAttribute.EAttributeWeapon,this.curRoleIndex);
		}
		if(!modelId) {
			if(this.weapon) {
				this.weapon.destroy();
				this.weapon = null;
				delete this.lastModelDict[EEntityAttribute.EAttributeWeapon];
			}
			return;
		}
		if (this.lastModelDict[EEntityAttribute.EAttributeWeapon] == modelId) {
			return;
		} else {
			// if (this.weapon != null) {
			// 	this.weapon.destroy();
			// 	this.weapon = null;
			// }
			if( this.showArray.indexOf(EEntityAttribute.EAttributeWeapon) == -1){
				return;
			}
		}
		if(!this.weapon)
		{
			this.weapon = new ModelShow(EShape.EShapeMagic);
			this.weaponContainer.addChild(this.weapon);
		}
		this.weapon.setData(modelId);

		let cfg: any = ModelDef.ModelPlayerPos["weapon"][modelId];
		if (cfg == null) {
			cfg = ModelDef.ModelPlayerPos["weapon"][0];
		}
		this.weapon.x = cfg.x;
		this.weapon.y = cfg.y;

		this.lastModelDict[EEntityAttribute.EAttributeWeapon] = modelId;
	}

	/**
	 * 更新衣服
	 */
	public updatePlayer(modelId: number = -1): void {
		if (modelId == -1) {
			modelId = CacheManager.role.getModelId(EEntityAttribute.EAttributeClothes,this.curRoleIndex);
		}
		if(!modelId) {
			if(this.player) {
				this.player.destroy();
				this.player = null;
				delete this.lastModelDict[EEntityAttribute.EAttributeClothes];
			}
			return;
		}
		if (this.lastModelDict[EEntityAttribute.EAttributeClothes] == modelId) {
			return;
		} else {
			// if (this.player != null) {
			// 	this.player.removeEventListener(MovieClip.RES_READY_COMPLETE,this.onMcLoadCompleteHandler,this);
			// 	this.player.destroy();
			// 	this.player = null;
			// }
			if( this.showArray.indexOf(EEntityAttribute.EAttributeClothes) == -1){
				return;
			}
		}

		if(!this.player)
		{
			this.player = new ModelShow(EShape.ECustomPlayer);
			this.playerContainer.addChild(this.player);
		}
		this.player.setData(modelId);

		this.lastModelDict[EEntityAttribute.EAttributeClothes] = modelId;
	}

	/**
	 * 更新法宝
	 */
	public updateSpirit(modelId: number = -1): void {
		if (modelId == -1) {
			modelId = CacheManager.role.getModelId(EEntityAttribute.EAttributeShapeSpirit,this.curRoleIndex);
		}
		if(!modelId) {
			if(this.spirit) {
				this.spirit.destroy();
				this.spirit = null;
				delete this.lastModelDict[EEntityAttribute.EAttributeShapeSpirit];
			}
			return;
		}
		if (this.lastModelDict[EEntityAttribute.EAttributeShapeSpirit] == modelId) {
			return;
		} else {
			// if (this.spirit != null) {
			// 	this.spirit.removeEventListener(MovieClip.RES_READY_COMPLETE,this.onMcLoadCompleteHandler,this);
			// 	this.spirit.destroy();
			// 	this.spirit = null;
			// }
			if( this.showArray.indexOf(EEntityAttribute.EAttributeShapeSpirit) == -1){
				return;
			}
		}
		if(!this.spirit)
		{
			this.spirit = new ModelShow(EShape.EShapeSpirit);
			this.spiritContainer.addChild(this.spirit);
		}
		this.spirit.setData(modelId);
		this.spirit.scaleX = 0.5;
		this.spirit.scaleY = 0.5;
		let cfg: any = ModelDef.ModelPlayerPos["spirit"][modelId];
		if (cfg == null) {
			cfg = ModelDef.ModelPlayerPos["spirit"][0];
		}
		this.spirit.x = cfg.x;
		this.spirit.y = cfg.y;

		this.lastModelDict[EEntityAttribute.EAttributeShapeSpirit] = modelId;
	}

	public updateLawModel(modelId: number = -1) : void {
		if(modelId == -1) {
			modelId = CacheManager.role.getModelId(EEntityAttribute.EAttributeShapeLaw,this.curRoleIndex);
		}
		if(!this.law1) { 
			this.law1 = new ModelShow(EShape.EShapeLaw);
			this.lawContainer1.addChild(this.law1);
		}
		if(!this.law2) {
			this.law2 = new ModelShow(EShape.EShapeLaw);
			this.lawContainer2.addChild(this.law2);
		}
		if(modelId) {
			if(modelId == 1001) {
				this.law1.visible = true;
				this.law2.visible = true;
				this.law1.setData(1001);
				this.law2.setData(1002);
			}
			else {
				this.law1.visible = true;
				this.law2.visible = false;
				this.law1.setData(modelId);
			}
		}
		else{
			this.law1.visible = false;
			this.law2.visible = false;
		}
	}

	public updateSwordPoolModel(modelId: number = -1): void {
		if(modelId == -1) {
			modelId = CacheManager.role.getModelId(EEntityAttribute.EAttributeShapeSwordPool,this.curRoleIndex);
		}
		if(!this.swordPool) {
			this.swordPool = new ModelShow(EShape.EShapeSwordPool);
			this.swordPoolContainer.addChild(this.swordPool);
		}
		this.swordPool.setData(modelId);
		
	}


	/**
	 * 更新混元装备套装
	 */
	public updateAncient(modelId: number = -1): void {
		if (modelId == -1) {
			modelId = CacheManager.role.getModelId(EEntityAttribute.EAttributeForeverEquipSuit,this.curRoleIndex);
		}
		if(!modelId) {
			if(this.ancient) {
				this.ancient.destroy();
				this.ancient = null;
				delete this.lastModelDict[EEntityAttribute.EAttributeForeverEquipSuit];
			}
			return;
		}
		if (this.lastModelDict[EEntityAttribute.EAttributeForeverEquipSuit] == modelId) {
			return;
		} 
		else {
			if( this.showArray.indexOf(EEntityAttribute.EAttributeForeverEquipSuit) == -1) {
				return;
			}
		}
		if(!this.ancient) {
			this.ancient = new ModelShow(EShape.EAncient);
			this.addChild(this.ancient);
		}
		this.ancient.setData(modelId);

		// let cfg: any = ModelDef.ModelPlayerPos["ancient"][modelId];
		// if (cfg == null) {
		// 	cfg = ModelDef.ModelPlayerPos["ancient"][0];
		// }
		// this.ancient.x = cfg.x;
		// this.ancient.y = cfg.y;

		this.lastModelDict[EEntityAttribute.EAttributeForeverEquipSuit] = modelId;
	}
	/**更新称号 */
	public updateTitle(modelId: number = -1):void {
		if (modelId == -1) {
			modelId = CacheManager.role.getModelId(EEntityAttribute.EAttributeTitleMain,this.curRoleIndex);
		}
		if(!modelId) {
			if(this.title) {
				this.title.destroy();
				this.title = null;
				delete this.lastModelDict[EEntityAttribute.EAttributeTitleMain];
			}
			return;
		}
		if (this.lastModelDict[EEntityAttribute.EAttributeTitleMain] == modelId) {
			return;
		} 
		else {
			if( this.showArray.indexOf(EEntityAttribute.EAttributeTitleMain) == -1) {
				return;
			}
		}
		if(!this.title) {
			this.title = new ModelShow(EShape.EShapeTitle);
			this.addChild(this.title);
		}
		this.title.setData(modelId);

		let cfg: any = ModelDef.ModelPlayerPos["title"][modelId];
		if (cfg == null) {
			cfg = ModelDef.ModelPlayerPos["title"][0];
		}
		this.title.x = cfg.x;
		this.title.y = cfg.y;

		this.lastModelDict[EEntityAttribute.EAttributeTitleMain] = modelId;
	}

	public removeFromParent(): void {
		if (this.parent != null) {
			this.parent.removeChild(this);
		}
	}

	

	public reset():void {
		this.updateWing(0);
		this.updateWeapon(0);
		this.updatePlayer(0);
		this.updateSpirit(0);
		this.updateTitle(0);
		this.updateAncient(0);
		this.updateLawModel(0);
		this.updateSwordPoolModel(0);
	}

	public destroy():void {
		if(this.player) {
			this.player.destroy();
			this.player = null;
		}
		
		if(this.spirit) {
			this.spirit.destroy();
			this.spirit = null;
		}
		
		if(this.weapon) {
			this.weapon.destroy();
			this.weapon = null;
		}
		
		if(this.wing) {
			this.wing.destroy();
			this.wing = null;
		}
		
		if(this.title) {
			this.title.destroy();
			this.title = null;
		}
		
		this.removeFromParent();
	}
}
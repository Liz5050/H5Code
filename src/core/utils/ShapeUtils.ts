class ShapeUtils {

	/**骑宠可以使用祝福卡的最小等级 */
	public static CAN_BLESS_LV:number = 11;
	/**骑宠满星等级 */
	public static PET_MOUNT_TOP_LEVEL:number = 100;
	/**外形满星等级(时装、武器) */
	public static SHAPE_FULL_STAR_LV:number = 5;
	/**翅膀 法宝等满级等级 */
	public static PLAYER_SHAPE_MAX_LV:number = 400;
	/**披风600级 */
	public static PLAYER_SHAPE_MAX_LV2:number = 600;
	
	private static playerModel:any;
	private static SHAPE_DRUP_DICT:any = {};
	/**
	 * 是否精华材料
	 */
	public static isHasMaterial(shape:number,type:number=EProp.EPropEquipRefineMaterial):boolean{
		var flag:boolean = false;		
		flag = CacheManager.pack.backPackCache.isHasByCTAndShapeColor(ECategory.ECategoryMaterial,type,shape, EColor.EColorBlue, EColor.EColorOrange);
		return flag;
	}

	/**
	 * 检查某个外形是否有tips (人物面板的外形)
	 */
	public static checkTips(openKey:string,shape:number):boolean{
		var flag:boolean = false;
		flag = this.isHasDrup(shape);			
		if(!flag){
			var isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(openKey,false);
			var isFullStar:boolean = ShapeUtils.isPlayerShapeFullStar(shape);					
			if(isOpen && !isFullStar){
				flag = this.isHasMaterial(shape);
			}			
		}
		return flag;
	}

	public static isPlayerShapeUpgrade(eShape:number):boolean{
		var isFullStar:boolean = ShapeUtils.isPlayerShapeFullStar(eShape);
		var flag:boolean = false;
		if(!isFullStar){
			flag = ShapeUtils.isHasMaterial(eShape)
		}
		return flag;
	}

	/**
	 * 人物的外形是否满星（翅膀、法宝、神兵、披风）
	 */
	public static isPlayerShapeFullStar(eShape:number):boolean{
		var level:number = 0;
		var cache:any = ShapeUtils.getShapeCahe(eShape);
		if(cache){
			level = cache.level || 0; 
		}
		var max:number = eShape==EShape.EShapeCloak?ShapeUtils.PLAYER_SHAPE_MAX_LV2:ShapeUtils.PLAYER_SHAPE_MAX_LV;
		return level>=max;
	}

	/**
	 * (翅膀、法宝、神兵、披风;骑宠也通用)是否有属性提升丹
	 */
	public static isHasDrup(shape:number):boolean{
		var drupItems:ItemData[] = this.getDrugs(shape);
		var flag:boolean = false;
		for(var i:number=0;i<drupItems.length;i++){
			var item:ItemData = <ItemData>drupItems[i];
			var isMax:boolean = ShapeUtils.isDrupMax(shape,i);
			if(!isMax){
				var num:number = CacheManager.pack.backPackCache.getItemCountByCode(item.getCode());
				if(num>0){
					flag = true;
					break;
				}
			}			
		}
		return flag;
	}

	public static isDrupMax(eShape:number,index:number):boolean{
		var flag:boolean = false;
		var cache:any = ShapeUtils.getShapeCahe(eShape);
		if(cache && cache.drugDictValue && cache.drugItemMax){
			flag = cache.drugDictValue[index] >= cache.drugItemMax[index];
		}
		return flag;
	}
	/**获取外形cache */
	public static getShapeCahe(eShape:number):any{
		var cache:any;
		switch(eShape){
			case EShape.EShapeWing:
				cache = CacheManager.wing;
				break;
			case EShape.EShapeSpirit:
				cache = CacheManager.spirit;
				break;
			case EShape.EShapeMagic:
				cache = CacheManager.magic;
				break;
			case EShape.EShapeCloak:
				cache = CacheManager.cloak;
				break;
			// case EShape.EShapePet:
			// 	cache = CacheManager.petMountPet;
			// 	break;
			// case EShape.EShapeMount:
			// 	cache = CacheManager.mount;
			// 	break;
		}
		return cache;
	}
	/**获取化形cache */
	public static getShapeChangeCahce(eShape:number):any{
		var cache:any;
		switch(eShape){
			// case EShape.EShapeWing:
			// 	cache = CacheManager.wingChange;
			// 	break;
			// case EShape.EShapeSpirit:
			// 	cache = CacheManager.spiritChange;
			// 	break;
			// case EShape.EShapeMagic:
			// 	cache = CacheManager.magicChange;
			// 	break;
			// case EShape.EShapeCloak:
			// 	cache = CacheManager.cloakChange;
			// 	break;
			// case EShape.EShapePet:
			// 	cache = CacheManager.petChange;
			// 	break;
			// case EShape.EShapeMount:
			// 	cache = CacheManager.mountChange;
			// 	break;
		}
		return cache;
	}

	public static getDrugs(shape:number):ItemData[]{
		var drugItems:ItemData[] =  this.SHAPE_DRUP_DICT[shape];
		if(!drugItems){
			drugItems = [];
			this.SHAPE_DRUP_DICT[shape] = drugItems;
			let drugs:any;
			drugs = ConfigManager.mgShapeDrugAttr.getByPk(shape);
			for(let i = 0; i < 3; i++){
				let itemData:ItemData = new ItemData(drugs['drug' + (i+1) +'ItemCode']);
				drugItems.push(itemData);
			}
		}		
		return drugItems;
	}

	/**
	 * 检查某个化形是否有可激活的或可升级的
	 */
	public static isShapeUpgradeOrActive(shape:number):boolean{
		var flag:boolean = false;
		var shapeData:any[];		
		var cache:any = ShapeUtils.getShapeChangeCahce(shape);
		if(cache){
			shapeData = cache.shapesData;
		}
		if(shapeData){
			var level:number = 0;
			for(let value of shapeData){			
				level = value.level || 0;	
				var isFullStar:boolean = ShapeUtils.isShapeFullStar(level);
				if(!isFullStar){
					flag = ShapeUtils.isShapeDataOk(value);				
				}
				if(flag){					
					break;
				}
				
			}
		}
		return flag;
	}
	
	public static isShapeFullStar(level:number):boolean{
		return level >= ShapeUtils.SHAPE_FULL_STAR_LV;
	}
	/**
	 * 判断骑宠等级能否使用祝福卡
	 */
	public static isPetMountUseBless(level:number):boolean{
		return level >= ShapeUtils.CAN_BLESS_LV;
	}
	/**
	 * 骑宠是否满阶满星
	 */
	public static isPetMountFullStar(level:number):boolean{
		return level >= ShapeUtils.PET_MOUNT_TOP_LEVEL;
	}
	
	/**
	 * 根据外形的数据判断数量和转职是否符合可升级或激活
	 */
	public static isShapeDataOk(value:any):boolean{
		var roleState:number = value.roleState || 0;
		var isRoleState:boolean = CacheManager.role.getRoleState()>=roleState; //转职是否符合
		var isNum:boolean = value.useItemNum<=CacheManager.pack.propCache.getItemCountByCode2(value.useItemCode);
		return isRoleState && isNum;
	}

	public static getModelShowType(type: EFashionType): EShape {
        switch (type) {
            case EFashionType.EFashionClothes:
                return EShape.ECustomPlayer;
            case EFashionType.EFashionWeapon:
                return EShape.EShapeMagic;
            case EFashionType.EFashionWing:
                return EShape.EShapeWing;
            default:
                return EShape.ECustomPlayer;
        }
    }
	/**
	 * 根据时装类型获取角色模型属性
	 */
	public static getFashionAttrType(type:EFashionType):EEntityAttribute{
        switch (type){
            case EFashionType.EFashionClothes:
                return EEntityAttribute.EAttributeClothes;
            case EFashionType.EFashionWeapon:
                return EEntityAttribute.EAttributeWeapon;
            case EFashionType.EFashionWing:
                return EEntityAttribute.EAttributeWing;
        }
		return null;
    }

	public static setPlayerModel(modelDict: any, fashionType: number): void{
		if(!this.playerModel){
			this.playerModel = {};
		}
		for(let i = 0; i < CacheManager.role.roles.length; i++){
			if(!this.playerModel[i]){
				this.playerModel[i] = {};
			}
			let career: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(i));
			let showType: EEntityAttribute = this.getFashionAttrType(fashionType);
			this.playerModel[i][showType] = modelDict[career];
		}
	}

	public static getPlayerModel(roleIndex: number,isCopyReset:boolean=true): any{
		if(!this.playerModel){
			this.playerModel = {};
		}
		if(!this.playerModel[roleIndex]){
			this.playerModel[roleIndex] = {};
		}
		if(!this.playerModel[roleIndex][EEntityAttribute.EAttributeClothes]){
			this.playerModel[roleIndex][EEntityAttribute.EAttributeClothes] = CacheManager.role.getModelId(EEntityAttribute.EAttributeClothes,roleIndex);
		}
		if(!this.playerModel[roleIndex][EEntityAttribute.EAttributeWeapon]){
			this.playerModel[roleIndex][EEntityAttribute.EAttributeWeapon] = CacheManager.role.getModelId(EEntityAttribute.EAttributeWeapon,roleIndex);
		}
		if(!this.playerModel[roleIndex][EEntityAttribute.EAttributeWing]){
			this.playerModel[roleIndex][EEntityAttribute.EAttributeWing] = CacheManager.role.getModelId(EEntityAttribute.EAttributeWing,roleIndex);
		}
		let retObj:any;
		if(isCopyReset){		
			retObj = {};	
			ObjectUtil.copyProToRef(this.playerModel[roleIndex],retObj,true);
			ObjectUtil.emptyObj(this.playerModel[roleIndex]);
		}else{
			retObj = this.playerModel[roleIndex];
		}

		return retObj;
	}


}
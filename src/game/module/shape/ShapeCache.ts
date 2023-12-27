/**
 * 外形
 */
class ShapeCache implements ICache {
	/**所有外形信息字典 */
	private _shapeInfo: {[shape: number]: any};
	/**
	 * 幻化后的模型字典
	 */
	private _changeModelDict: any;

	public constructor() {
		this._changeModelDict = {};
	}

	public shapeInfoUpdate(info: any): void {
		let oldInfo:any = this.getShapeInfo(info.shape_I,info.roleIdx_I);
		let shapes: any = this.shapeInfo;
		if(info.shape_I == EShape.EShapePet || info.shape_I == EShape.EShapeSpirit) {
			shapes[info.shape_I] = info;
		}
		else {
			if(!shapes[info.shape_I]){
				shapes[info.shape_I] = {};
			}
			shapes[info.shape_I][info.roleIdx_I] = info;
		}
		// switch(info.shape_I){
		// 	case EShape.EShapeLaw:
		// 		CacheManager.magicArray.setShapeInfo(shapes[info.shape_I][info.roleIdx_I], info.roleIdx_I);
		// 		break;
		// 	case EShape.EShapeBattle:
		// 		CacheManager.battleArray.setShapeInfo(shapes[info.shape_I][info.roleIdx_I], info.roleIdx_I);
		// 		break;
		// 	default:
		// 		break;
		// }
		this.shapeInfo = shapes;
		if(oldInfo) {
			let changesEx:any[] = oldInfo.changesEx.data;
			let newChanges:any[] = info.changesEx.data;
			let config:BaseConfig = ConfigManager.mgShapeChangeEx;
			if(info.shape_I == EShape.EShapeSpirit) {
				changesEx = oldInfo.changes.data;
				newChanges = info.changes.data;
				config = ConfigManager.mgShapeChange;
			}
			if(changesEx.length != newChanges.length) {
				//新激活了幻形外观
				let changeInfo:any;
				for(let i:number = 0; i < newChanges.length; i++) {
					changeInfo = newChanges[i];
					for(let k:number = 0; k < changesEx.length; k++) {
						if(changeInfo.change_I == changesEx[k].change_I) {
							changeInfo = null;//已激活的
							break;
						}
					}
					if(changeInfo) {
						let changeCfg:any = config.getByPk(info.shape_I + "," + changeInfo.change_I + "," + changeInfo.level_I);
						if(changeCfg) {
							EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{type:changeCfg.shape,modelId:changeCfg.modelId,changeId:changeInfo.change_I});
						}
						break;
					}
				}
			}
		}
	}

	public getShapeInfo(eshape: EShape, roleIndex:number = 0): any {
		if(eshape == EShape.EShapePet || eshape == EShape.EShapeSpirit) {
			return this.shapeInfo[eshape];
		}
		else{
			if(this.shapeInfo[eshape]) {
				if (this.shapeInfo[eshape][roleIndex]) {
					return this.shapeInfo[eshape][roleIndex];
				}
			}
		}
		return null;
	}


	public getChangesInfoRole(eshape : EShape, roleindex:number): Array<any> {
		let info: any = this.getShapeInfo(eshape, roleindex);
		if (info) {
			return info.changesEx.data;
		}
		return [];
	}

	public getChangesInfo(eshape: EShape): Array<any> {
		let info: any = this.getShapeInfo(eshape);
		if (info) {
			switch(eshape){
				case EShape.EShapePet:
					return info.changesEx.data;
				case EShape.EShapeSpirit:
					return info.changes.data;
			}
			// return info.changesEx.data;
		}
		return [];
	}

	/**
	 * 升级化形（宠物/坐骑）
	 * @param updateInfo S2C_SUpgradeChangeEx
	 */
	public updateChangeLucky(updateInfo: any): void {
		let changesInfo: any = this.getChangesInfo(updateInfo.shape);
		if(changesInfo.length == 0) {
			changesInfo = this.getChangesInfoRole(updateInfo.shape, updateInfo.roleIdx);
		}
		for (let changeEx of changesInfo) {//升星
			if (changeEx.change_I == updateInfo.change) {
				if (updateInfo.result) {
					changeEx.lucky_I = updateInfo.addLucky;
				} else {
					changeEx.lucky_I += updateInfo.addLucky;
				}
				break;
			}
		}
	}

	public set shapeInfo(infos: any) {
		this._shapeInfo = infos;
	}

	public get shapeInfo(): any {
		if (this._shapeInfo) {
			return this._shapeInfo;
		}
		return [];
	}

	/**
	 * 单个幻化信息
	 */
	public set sChangeUseModelEx(sChangeUseModelEx: any) {
		let useModelId: number = sChangeUseModelEx.useModelId;
		let shape: number = sChangeUseModelEx.shape;
		let change: number = sChangeUseModelEx.change;
		if(shape == EShape.EShapePet || shape == EShape.EShapeSpirit) {
			if (this._shapeInfo[shape] != null) {
				this._shapeInfo[shape].useModelId_I = useModelId;
			}
		}
		else {
			if(this.getShapeInfo(shape, sChangeUseModelEx.roleIdx) != null) {
				this.getShapeInfo(shape, sChangeUseModelEx.roleIdx).useModelId_I = useModelId;
			}
		}
	}

	public set wingChangeUseModel(wingChange : any) {
		if(wingChange.result == 0) {
			return;
		}
		if(this.getShapeInfo(EShape.EShapeWing, wingChange.index) != null) {
				this.getShapeInfo(EShape.EShapeWing, wingChange.index).useModelId_I = wingChange.useModelId;
		}
	}

	/**
	 * 是否幻化了模型
	 */
	public isChangedModel(shape: number, modelId: number, roleIdx:number = -1): boolean {
		return this.getShapeInfo(shape,roleIdx)!=null && this.getShapeInfo(shape,roleIdx).useModelId_I == modelId;
	}

	// public isChangedModel(shape : number, modelId:number, roleIdx:number) : boolean {
	// 	return this.getShapeInfo(shape,roleIdx)!=null && this.getShapeInfo(shape,roleIdx).useModelId_I == modelId;
	// }

	public checkTips(): boolean{
		let flag: boolean = false;
		if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Pet, false)){//外观按钮没开启之前不给红点
			return false;
		}
		if(!flag){
			flag = CacheManager.mount.checkTips();
		}
		if(!flag){
			flag = CacheManager.pet.checkTips();
		}
		if(!flag){
			flag = CacheManager.battleArray.checkTips();
		}
		if(!flag) {
			flag = CacheManager.magicArray.checkTips();
		}
		if(!flag) {
			flag = CacheManager.magicWare.isTabRedTip(EStrengthenExType.EStrengthenExTypeWing);
		}
		if(!flag) {
			flag = CacheManager.swordPool.checkTips();
		}
		return flag;
	}


	public getEquipNow(shape : number , pos : number, roleIndex : number = 0 ) {
		if (this.getShapeInfo(shape,roleIndex)) {
			let equipInfo: any = this.getShapeInfo(shape,roleIndex).equipDict;
			for(let i = 0; i < equipInfo.key_I.length; i++){
				if(equipInfo.key_I[i] == pos){
					return equipInfo.value_I[i];
				}
			}
		}
		return 0;
	}

	public clear(): void {

	}
}
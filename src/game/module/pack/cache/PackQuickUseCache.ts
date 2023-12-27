class PackQuickUseCache implements ICache{

	public static QUICK_USE_EQUIP:number = 1;
	public static QUICK_USE_PROP:number = 0;

	/**快速使用队列 */
    private _quickItemDict:any;
	private _param:any;

	public constructor() {
	}

	/**添加一个快速使用物品 */
	public addQuickUseItem(item:any,isPiece:boolean=false):boolean{		
		if(!isPiece && !this.checkShow(item)){
			return false;
		}
		let flag:boolean = true;
        if(!this._quickItemDict){
            this._quickItemDict = {};
        }		
        let key:number = this.getQuickUseType(item);
        let cates:any[];
        if(!this._quickItemDict[key]){
            cates = [];         
			this._quickItemDict[key] = cates;   
        }		
		cates = this.getCateItems(key);

		if(isPiece){ //神器碎片
			cates.push(item);
			return true;
		}
		let isAdd:boolean = true;
		for(let itemEle of cates){
			if(!itemEle.isPiece && itemEle instanceof ItemData&& itemEle.getCode()==item.getCode()){ //不放入相同的 显示最早的
				isAdd = false;
				let type:number = this.getQuickUseType(itemEle);
				if(PackQuickUseCache.QUICK_USE_PROP==type){ //获得一个已存在的 修改数量
					let c:number = itemEle.getItemAmount();
					itemEle.itemAmount = c + 1;
				}
				break;
			}
		}
		if(isAdd){
			cates.push(item);
		}
        return flag;
    }
	

	/**删除一个 */
    public delQuickUseItem(item:ItemData,byUid:boolean=true):void{
        let key:number = this.getQuickUseType(item);
		let cates:any[] = this.getCateItems(key);
		if(!cates){
			return;
		}
		for(let i:number = 0;i<cates.length;i++){
			let itemEle:any = cates[i];
			let isItem:boolean = itemEle instanceof ItemData;
			if( ( byUid && isItem && itemEle.getUid()==item.getUid() ) || ( isItem && itemEle.getCode()==item.getCode() ) ){
				cates.splice(i,1);
				break;
			}	
		}
    }

	public delQuickPiece():void{
		let cates:any[] = this.getCateItems(PackQuickUseCache.QUICK_USE_PROP);
		if(cates){
			for(let i:number = 0;i<cates.length;i++){
				let itemEle:any = cates[i];
				if(itemEle.isPiece && !CacheManager.godWeapon.isGodWPieceCanAct(itemEle.item.code,itemEle.item.piece) ){
					cates.splice(i,1);
					break;
				}	
			}
		}
		
	}

	/**
	 * 删除队列中比目标装备评分低的装备
	 */
	public delLowEquip(item:ItemData):void{
		let cates:ItemData[] = this.getCateItems(PackQuickUseCache.QUICK_USE_EQUIP);
		if(cates){
			let tarScore:number = WeaponUtil.getScoreBase(item);
			let tarCar:number = CareerUtil.getBaseCareer(item.getCareer());
			let tarType:number = item.getType();
			for (var index = 0; index < cates.length; index++) {
				let bCar:number = CareerUtil.getBaseCareer(cates[index].getCareer());
				//删掉同职业、同部位评分低的装备
				if(tarCar==bCar && tarType==cates[index].getType() &&  WeaponUtil.getScoreBase(cates[index])<tarScore ){
					cates.splice(index,1);
					index--;					
				}				
			}
		}
	}

	public delLowEquipAll():void{
		let cates:ItemData[] = this.getCateItems(PackQuickUseCache.QUICK_USE_EQUIP);
		if(cates){			
			for (var index = 0; index < cates.length; index++) {
				let roleIndex:number = this.getEquipRoleIndex(cates[index]);
				//删掉同职业、同部位评分低的装备
				if(roleIndex==-1){
					cates.splice(index,1);
					index--;					
				}				
			}
		}
	}

	/**
	 * 获取队列中一个快速使用物品
	 * 优先显示最早获得的
	 **/
	public pop():any{
		let itm:any;
		let keys:number[] = [PackQuickUseCache.QUICK_USE_EQUIP,PackQuickUseCache.QUICK_USE_PROP];		
		for(let i:number = 0;i<keys.length;i++){
			let cates:any[] = this.getCateItems(keys[i]);
			if(cates && cates.length){
				itm = cates.shift();
				break;
			}
		}
		return itm;
	}
	private getQuickUseType(item:any):number{
		let key:number;
		if(item instanceof ItemData){
			let cate:number = item.getCategory();
			let type:number = item.getType(); //必杀碎片属于装备大类 但是放到物品类别里
            key = cate==ECategory.ECategoryEquip && type!=EEquip.EEquipKill?PackQuickUseCache.QUICK_USE_EQUIP:PackQuickUseCache.QUICK_USE_PROP; //装备是1其他都是0;
		}else{
			key = PackQuickUseCache.QUICK_USE_PROP; //其他；例如神器碎片
		}
        
        return key;
    }
	
	public getQuickParam(item:any):any{
		if(!this._param){
			this._param = {};
		}
		if(item.isPiece){
			this._param.item = item.item;
		}else{
			this._param.item = item;
		}		
		this._param.isPiece = item.isPiece;
		this._param.type = this.getQuickUseType(item);
		this._param.label = LangPack.L_QUICK_LABEL[this._param.type];
		return this._param;
	}

	/**判断某个物品是否需要显示快捷使用 */
	public checkShow(item:ItemData):boolean{
		let flag:boolean = true;
		if(ItemsUtil.isEquipItem(item) && !ItemsUtil.isKillItem(item)){
			flag = this.getEquipRoleIndex(item)>-1;				
		}
		return flag;
	}

	public getEquipRoleIndex(item:ItemData):number{
		let roleIndex:number = -1;
		let pos:number = ItemsUtil.getEquipPosByType(item.getType());
		let bScore:number = WeaponUtil.getScoreBase(item);			
		for(let i:number = 0;i<RoleIndexEnum.RoleIndexAll.length;i++){
			let idx:number = RoleIndexEnum.RoleIndexAll[i];
			let dresScore:number = CacheManager.pack.rolePackCache.getDressEquipScoreByPos(pos,idx);
			if(dresScore<bScore && WeaponUtil.isCanEquip(item,idx)){ //某个角色身上的评分低于当前获得的装备的评分
				roleIndex = idx;
				break;
			}
		}
		return roleIndex;
	}

	private getCateItems(key:number):ItemData[]{
		if(this._quickItemDict){
			return this._quickItemDict[key];
		}
		return null;
	}

	public clear():void{

	}
}
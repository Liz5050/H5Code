/**秘籍数据缓存 */
class SkillCheatsCache implements ICache  {
	public static TOTAL_POS:number = 8;

	private _cheatsInfo:any;

	public constructor() {
		this._cheatsInfo = {};
	}
	public checkTips():boolean{
		let flag:boolean = false;
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.SkillCheats],false)){
			return false;
		}	
		for(let i:number=0;i<CacheManager.role.roles.length;i++){
			let idx:number = CacheManager.role.roles[i].index_I?CacheManager.role.roles[i].index_I:i;
			flag = this.checkRoleTips(idx);
			if(flag){
				break;
			}
		}	
		return flag;
	}

	/**红点只检查第一个孔位 */
	public checkRoleTips(roleIndex:number):boolean{
		let flag:boolean = false;
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.SkillCheats],false)){
			return false;
		}
		let items:ItemData[] = CacheManager.pack.propCache.getByC(ECategory.ECategoryCheats);
		let pos:number = 0;
		flag = items.length>0 && this.isPosOpen(roleIndex,pos) && !this.isPosEmbeld(roleIndex,pos);
		return flag;
	}
	
	/**判断某个孔位是否开启 */
	public isPosOpen(roleIndex:number,pos:number):boolean{
		let flag:boolean = true;
		let cfg:any = ConfigManager.cheatsPos.getByPk(pos);
		if(cfg){
			if(cfg.openRotate){//有转生限制
				let roleState:number = CacheManager.role.getRoleState();
				flag = roleState>=cfg.openRotate;
			}else{
				let roleLv:number = CacheManager.role.getRoleLevel();				
				flag = roleLv>=cfg.openLevel;
			}
		}
		return flag;
	}
	/**判断某个孔位是否镶嵌 */
	public isPosEmbeld(roleIndex:number,pos:number):boolean{
		let flag:boolean = true;
		let code:number=this.getPosItemCode(roleIndex,pos);
		flag = code>0;
		return flag;
	}

	/**
	 * 设置秘籍信息
	 * S2C_SCheatsInfo
	 */
	public setCheatsInfo(value:any){		
		if(value.infos){
			for(let i:number=0;i<value.infos.length;i++){
				let scheat:any = value.infos[i];
				if(!this._cheatsInfo[scheat.roleIndex]){
					this._cheatsInfo[scheat.roleIndex] = {};
				}				
				this._cheatsInfo[scheat.roleIndex] = scheat;
			}
		}
		
	}
	/**是否下一个开启的孔位 */
	public isNextOpenPos(roleIndex:number,pos:number):boolean{
		let flag:boolean = false;
		for(let i:number = 0; i<SkillCheatsCache.TOTAL_POS;i++){
			if(!this.isPosOpen(roleIndex,i)){
				flag = pos==i;
				break;
			}
		}
		return flag;
	}
	/**
	 * 根据位置获取镶嵌的秘籍物品code
	 */
	public getPosItemCode(roleIndex:number,pos:number):number{
		let code:number = 0;
		let scheat:any = this._cheatsInfo[roleIndex];
		if(scheat){
			if(scheat.seqPos.data_I[pos]){
				code = scheat.seqPos.data_I[pos];				
			}
		}
		return code;
	}
	/**获取某个角色的秘境战力 */
	public getTotalFight(roleIndex:number):number{
		let fight:number = 0;
		let scheat:any = this._cheatsInfo[roleIndex];
		if(scheat){
			if(scheat.seqPos && scheat.seqPos.data_I){
				for(let code of scheat.seqPos.data_I){
					if(code>0){
						fight+=ConfigManager.cheats.getFight(code);
					}
				}
			}
		}
		return fight;
	}
	/**判断是否镶嵌了某类型的秘境 */
	public isEmbed(roleIndex:number,type:number,color:number):boolean{
		let flag:boolean = false;
		let scheat:any = this._cheatsInfo[roleIndex];
		if(scheat && scheat.seqPos && scheat.seqPos.data_I){
			for(let code of scheat.seqPos.data_I){
				let cfg:any=ConfigManager.item.getByPk(code);
				let cfgType:number =cfg.type?cfg.type:0; 
				let cfgColor:number =cfg.color?cfg.color:0; 
				flag = cfg && cfgType==type && cfgColor>=color;
				if(flag){
					break;
				}
			}
		}
		return flag;
	}
	

	/**排序 */
	public sortCheats(items:ItemData[],roleIndex:number):void{
		items.sort(function (a:ItemData,b:ItemData):number{
            let colorA:number = a.getColor(); 
            let colorB:number = b.getColor(); 
            if(colorA>colorB){
                return 1;
            }else if(colorA<colorB){
                return -1;
            }else if(colorA==colorB && roleIndex>-1){ //是否需要根据已学排序
                let isEmbedA:boolean = CacheManager.cheats.isEmbed(roleIndex,a.getType(),colorA);
                let isEmbedB:boolean = CacheManager.cheats.isEmbed(roleIndex,b.getType(),colorB);
                if(!isEmbedA && isEmbedB){
                    return -1;
                }else if(isEmbedA && !isEmbedB){
                    return 1;
                }
            }
            return 0;
        });
	}

	public clear():void{

	}
}
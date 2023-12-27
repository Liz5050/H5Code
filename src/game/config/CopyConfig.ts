class CopyConfig extends BaseConfig {
	private _copyTypeDict:any;
	private _dfSkillInfo:any[]; //守护副本技能信息
	private _dfProCode:number = 0; //守护神剑要保护的怪物id
	private defendInfo:BaseConfig;
	private QCStarCfg:BaseConfig; //穹苍副本层星级相关
	private QCStarCopyCfg:BaseConfig; //穹苍副本层奖励
	private starPng:string[];
	public constructor() {
		super("t_copy",'code');
		this.starPng = ["C","B","A","S"];
		this.defendInfo = new BaseConfig("t_mg_normal_defense_static","id");		
		this.QCStarCfg = new BaseConfig("t_mg_qiong_cang_copy_star","copyCode,floor");
		this.QCStarCopyCfg = new BaseConfig("t_mg_qiong_cang_copy","floor");
		this._copyTypeDict = {};
	}
	/**
	 * 根据code获取副本类型
	 * 
	 */
	public getCopyType(code:number):number{
		let inf = this.getByPk(code);
		var t:number = inf.copyType?inf.copyType:0;
		return inf.copyType;
	}

	/**获取同类型的所有副本 */
	public getCopysByType(type:ECopyType):Array<any>{
		var resultArr:Array<any> = this._copyTypeDict[type];
		if(!resultArr){
			resultArr = [];
			var dict:any = this.getDict();
			for(let key in dict){ //let v of arr 只对array有效
				var inf:any = dict[key];
				if(this.getCopyType(inf.code)==type){
					if(inf.name == "宠物副本") {
						if(CacheManager.serverTime.serverOpenDay > 0) {
							resultArr.push(inf);
						}
					}
					else 
					{
						resultArr.push(inf);
					}

				}
			}
			this._copyTypeDict[type] = resultArr;
		}
		return resultArr;
	}

	/**
	 * 通过副本地图id 和副本类型获取副本配置
	 * @param type 副本类型
	 */
	public getCopysByMapId(copyMapId:number,type:ECopyType):any {
		let typeList:any[] = this.getCopysByType(type);
		for(let i:number = 0; i < typeList.length; i++) {
			if(typeList[i].intoMapId && typeList[i].intoMapId == copyMapId){
				return typeList[i];
			}
		}	
		return null;
	}

	/**
	 * 获取跨服组队副本
	 */
	public getCrossTeamCopyList():any[]
	{
		let typeCopys:any[] = this.getCopysByType(ECopyType.ECopyCrossTeam);
		let lvCopys:any[] = [];
		let stateCopys:any = [];
		for (let copy of typeCopys) {
			if (!copy.enterMinRoleState) lvCopys.push(copy);
			else stateCopys.push(copy);
		}
        lvCopys.sort((c1:any, c2:any):number=>{
			return c1.enterMinLevel - c2.enterMinLevel;
        });
        stateCopys.sort((c1:any, c2:any):number=>{
			return c1.enterMinRoleState - c2.enterMinRoleState;
        });

		return lvCopys.concat(stateCopys);
	}
	public getRoleDefendCopy():any{
		let copyInfo:any;
		let copys:any[] = this.getCopysByType(ECopyType.ECopyMgNormalDefense);
		App.ArrayUtils.sortOn(copys,"enterMinRoleState");
		let roleState:number = CacheManager.role.getRoleState();
		let idx:number = 0;
		let flag:boolean = false;
		for(let i:number=0;i<copys.length;i++){
			let copy:any =  copys[i];
			if(copy.enterMinRoleState && copy.enterMinRoleState>roleState){ 
				idx = Math.max(0,i-1); //可以挑战上一个副本
				flag = true;
				break;
			}
		}
		if(!flag){//所有都符合,最后一个副本
			idx = copys.length - 1;
		}
		copyInfo = copys[idx];
		return copyInfo;
	}


	/**获取守护副本的技能信息 */
	public getDefendSkills():any[]{
		if(!this._dfSkillInfo){
			this._dfSkillInfo = [];
			let info:any = this.defendInfo.getByPk(1); //只有一行
			if(info){
				let ids:string[] = CommonUtils.configStrToArr(info.skillIds,false);
				let costs:string[] = CommonUtils.configStrToArr(info.skillCosts,false);
				for(let i:number = 0;i<ids.length;i++){
					this._dfSkillInfo.push({id:ids[i],cost:costs[i]});
				}
			}
		}
		return this._dfSkillInfo;
	}
	/**守护神剑要保护的怪物id */
	public get dfProCode():number{
		if(!this._dfProCode){
			let info:any = this.defendInfo.getByPk(1); //只有一行
			if(info){
				this._dfProCode = info.protectBossCode;
			}			
		}
		return this._dfProCode;
	}

	public get luckCost():number{
		let c:number = 0;
		let info:any = this.defendInfo.getByPk(1); //只有一行
		if(info){
			c = info.luckyBossCost;
		}
		return c;
	}

	public getQCCopyInfo(floor:number):any{
		return this.QCStarCopyCfg.getByPk(`${floor}`); //${CopyEnum.CopyQC}
	}

	public getCopyStarInf(code:number,floor:number):any{
		return this.QCStarCfg.getByPk(`${code},${floor}`);
	}

	/**
	 * 星级评价的url
	 */
	public getCopyStarUrl(star:number):string{
		let url:string = "";
		if(star>-1){
			url = URLManager.getModuleImgUrl(`star/${this.starPng[star]}.png`,PackNameEnum.Copy);
		}		
		return url;
	}
	
	public getCopyStarStr(star:number):string{
		return this.starPng[star];
	}

	public getLastTeamCopy(code : number) : any {
		var copys = this.getCopysByType(ECopyType.ECopyCrossTeam);
		for(let i = 0;i<copys.length; i++) {
			if(copys[i].code == code) {
				if(i > 0) {
					return copys[i - 1];
				}
				else {
					return null;
				}
			}
		}
	}

}
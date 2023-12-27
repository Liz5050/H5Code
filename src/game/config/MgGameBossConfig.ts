class MgGameBossConfig extends BaseConfig {

	private _copyCodeData: any;
	private _mapIdInfs: any;
	private _copyTypeData:any;
	/**Boss之家每一层的boss列表 */
	private floorBoss:{[floor:number]:any};

	private bossComing:BaseConfig;//boss来袭配置

	private bossComingCfgs:any[];
	public constructor() {
		super("t_mg_game_boss", "bossCode");
		this._copyCodeData = {};
		this._mapIdInfs = {};
		this._copyTypeData = {};
		this.bossComing = new BaseConfig("t_mg_boss_intruder","bossCode");
	}
	/**
	 * 根据副本类型获取boss信息
	 * @param copyType 副本类型
	 */
	public getByCopyType(copyType:number):any[]{
		let retArr:any[] = this._copyTypeData[copyType];
		if(!retArr){
			retArr = [];
			var dict: any = this.getDict();
			for (var key in dict) {
				let inf: any = dict[key];
				let copyInf:any = ConfigManager.copy.getByPk(inf.copyCode);
				if (copyInf.copyType == copyType) {
					retArr.push(inf);
				}
			}
			this._copyTypeData[copyType] = retArr;
		}
		return retArr;
	}

	/**获取穹苍阁boss列表 */
	public getQCAtticBossList(sortFlag:boolean=true):any[]{
		let bossInfo:any[] = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgQiongCangAttic);
		if(sortFlag){
			bossInfo.sort(function (value1:any,value2:any):number {
				return value1.copyCode - value2.copyCode;
			});
		}
		return bossInfo;
	}

	/**是否穹苍阁最高转数那个boss */
	public isQCMaxBoss(bossCode:number):boolean{
		let bossInfos:any[] = this.getQCAtticBossList();
		return bossInfos && bossInfos[bossInfos.length-1].bossCode==bossCode;
	}
	
	/**
	 * 根据副本code获取所有boss信息
	 * 
	 */
	public getByCopyCode(copyCode: number): Array<any> {
		var copyBossInfs: Array<any>;
		if (this._copyCodeData[copyCode]) {
			copyBossInfs = this._copyCodeData[copyCode];
		} else {
			copyBossInfs = [];
			var dict: any = this.getDict();
			for (var key in dict) {
				var inf: any = dict[key];
				if (inf.copyCode == copyCode) {
					copyBossInfs.push(inf);
				}
			}
			this.sortArr(copyBossInfs);
			this._copyCodeData[copyCode] = copyBossInfs;
		}

		return copyBossInfs;
	}

	public getBossFixName(bossInf:any):string{
		let fixname:string  = "";
		let privilegeCardLimit:number = bossInf.privilegeCardLimit?bossInf.privilegeCardLimit:0;
		let goldCardLimit:number = bossInf.goldCardLimit?bossInf.goldCardLimit:0;
		let freeVip:number = bossInf.freeVip?bossInf.freeVip:0;
		if(privilegeCardLimit){
			fixname = "特权月卡";
		}else if(goldCardLimit){
			fixname = "元宝月卡";
		}else if(freeVip){
			fixname = "VIP"+freeVip;
		}else{
			fixname = this.getLevelStr(bossInf);
		}
		return fixname;
	}

	public getLevelStr(gameBoss:any):string{
		let str:string = "";
		if(typeof(gameBoss)=="number"){
			gameBoss = ConfigManager.mgGameBoss.getByPk(gameBoss);
		}
		if(gameBoss && gameBoss.roleState) {
			//如有配置转生限制，仅判断转生等级
			str = gameBoss.roleState+"转";
		}else{
			let bossConfig:any = ConfigManager.boss.getByPk(gameBoss.bossCode);
			str = bossConfig.level+"级";
		}
		
		return str;
	}
	public getByMapId(mapId: number): Array<any> {
		var mapInfArr: Array<any>;
		if (this._mapIdInfs[mapId]) {
			mapInfArr = this._mapIdInfs[mapId];
		} else {
			mapInfArr = [];
			var dict: any = this.getDict();
			for (var key in dict) {
				var inf: any = dict[key];
				if (inf.mapId == mapId) {
					mapInfArr.push(inf);
				}
			}
			this.sortArr(mapInfArr);
			this._mapIdInfs[mapId] = mapInfArr;
		}
		return mapInfArr;
	}

	private sortArr(copyBossInfs:Array<any>): void {
		copyBossInfs.sort((a: any, b: any) => {
			var bossCfgA: any = ConfigManager.boss.getByPk(a.bossCode);
			var bossCfgB: any = ConfigManager.boss.getByPk(b.bossCode);
			if (bossCfgA.level < bossCfgB.level) {
				return -1;
			} else if (bossCfgA.level > bossCfgB.level) {
				return 1;
			}
			return 0;
		});
	}

	/**
	 * 获取boss之家某一层的所有配置
	 */
	public getHomeBossByFloor(floor:number):any[] {
		if(!this.floorBoss) {
			this.floorBoss = {};
			let homeBossCfgs:any [] = this.getByCopyType(ECopyType.ECopyMgNewBossHome);
			for(let i:number = 0; i < homeBossCfgs.length; i++) {
				let list:any[] = this.floorBoss[homeBossCfgs[i].floor];
				if(!list) {
					list = [];
					this.floorBoss[homeBossCfgs[i].floor] = list;
				}
				list.push(homeBossCfgs[i]);
			}
		}
		return this.floorBoss[floor];
	}

	/**
	 * 穹苍圣殿Boss列表
	 */
	public getQiongCangBossList():any[] {
		let bossList:any[] = this.getByCopyType(ECopyType.ECopyMgQiongCangHall);
		let result:any[] = [];
		for(let i:number = 0; i < bossList.length; i ++) {
			if(CacheManager.bossNew.getBossIsOpened(bossList[i].bossCode)) {
				result.push(bossList[i]);
				break;
			}
		}
		result = result.concat(this.getByCopyType(ECopyType.ECopyMgQiongCangAttic));
		return result;
	}

	/**
	 * 可以设置关注的boss
	 */
	public getCanFollowList():any[] {
		let bossList:any[] = this.getByCopyType(ECopyType.ECopyMgNewWorldBoss);
		bossList = bossList.concat(this.getByCopyType(ECopyType.ECopyMgNewBossHome),
		this.getByCopyType(ECopyType.ECopyMgSecretBoss),
		this.getByCopyType(ECopyType.ECopyMgQiongCangAttic),
		this.getByCopyType(ECopyType.ECopyMgDarkSecretBoss),
		this.getByCopyType(ECopyType.ECopyMgQiongCangHall));
		return bossList;
	}

	/**
	 * 获取boss来袭boss列表
	 */
	public getBossComingCfgList():any[] {
		if(!this.bossComingCfgs) {
			this.bossComingCfgs = [];
			let dict:any = this.bossComing.getDict();
			for(let key in dict) {
				this.bossComingCfgs.push(dict[key]);
			}
		}
		this.bossComingCfgs.sort(function(value1:any,value2:any):number {
			let isCd1:boolean = CacheManager.bossNew.isBossComingCd(value1.bossCode);
			let isCd2:boolean = CacheManager.bossNew.isBossComingCd(value2.bossCode);
			if(!isCd1 && isCd2) return -1;
			if(isCd1 && !isCd2) return 1;
			let bossCfg1:any = ConfigManager.boss.getByPk(value1.bossCode);
			let bossCfg2:any = ConfigManager.boss.getByPk(value2.bossCode);
			return bossCfg1.level - bossCfg2.level;
		});
		return this.bossComingCfgs;
	}

	public getBossComingCfg(bossCode:number):any {
		return this.bossComing.getByPk(bossCode);
	}
}
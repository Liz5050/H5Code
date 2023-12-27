/**诛仙塔 */
class MgRuneCopyConfig extends BaseConfig {
	private _MAX_FLOOR:number = -1;
	public constructor() {		
		super("t_mg_rune_copy","floor");				
	}

	/**
	 * 符文塔最高层
	 */
	public get MAX_FLOOR():number{
		if(this._MAX_FLOOR==-1){
			this._MAX_FLOOR = 0;
			let dict:any = this.getDict();
			for(let key in dict){
				if(dict[key].floor && dict[key].floor>this._MAX_FLOOR){
					this._MAX_FLOOR = dict[key].floor;
				}
			}
		}
		return this._MAX_FLOOR;
	}

	/**
	 * 根据通关层数获取已开启的符文类型
	 */
	public getRuneTypesByFloor(floor:number):string[] {
		let dict:any = this.getDict();
		let typeStr:string = "";
		for(let i:number = 0; i <= floor; i++) {
			if(!dict[i] || !dict[i].openType) continue;
			typeStr += dict[i].openType;
		}
		return typeStr.split("#");
	}

	public isRuneTypeOpen(runeType: number): boolean{
		let floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
		let typeStr: Array<string> = this.getRuneTypesByFloor(floor);
		for(let type of typeStr){
			if(Number(type) == runeType){
				return true;
			}
		}
		return false;
	}
	/**
	 * 根据当前已经通关的层数 获取下一个可以开启符文的层数信息
	 * @param curFloor
	 * @param isHole   是否寻找下一个可开孔的塔层信息
	 */
	public getOpenTypeInf(curFloor:number,isHole:boolean=false):any{
		curFloor = Math.max(curFloor,1);
		var inf:any;		
		while(true){			
			inf = this.getByPk(curFloor);
			curFloor++;
			if(inf){				
				if(isHole){
					if(inf.openHole){
						break;
					}
				}else{
					if(inf.openType || inf.openHole){
						break;
					}
				}	
				
			}else{
				break;
			}
		}
		return inf;
	}

	/**
	 * 获取所有开启符文的层数信息--(符文总览展示用)
	 */
	public getAllOpenTypeInf(): Array<any>{
		let inf:any;
		let curFloor: number = -1;
		let infs:Array<any> = [];
		while(true){
			curFloor++;
			inf = this.getByPk(curFloor);
			if(inf){				
				if(inf.openType){
					let towerOpenType: Array<string> = inf.openType.split("#");
					let isShow: boolean = false;
					for(let type of towerOpenType){
						if(type != "" && RuneUtil.isShowRune(Number(type))){
							isShow = true;
							break;
						}
					}
					if(isShow){
						infs.push(inf);
					}
				}
			}else{
				break;
			}
		}
		return infs;
	}

	/**
	 * 根据当前已经通关的层数 获取下一个可以开启符文孔位的层数信息
	 */
	public getOpenHoleInf(curFloor:number):any{
		var inf:any;		
		while(true){
			curFloor++;
			inf = this.getByPk(curFloor);
			if(inf){				
				if(inf.openHole){
					break;
				}
			}else{
				break;
			}
		}
		return inf;
	}

}
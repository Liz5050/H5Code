class GodWeaponConfig extends BaseConfig {
	private _godWeaponList:any[];
	private _pieceDict:any;
	private _checkPointDict:any;
	private _taskDict:any;
	private _checPoints:number[];
	private _specialCode:number[];
	public constructor() {
		super("t_god_weapon_config","code,piece");
		this._specialCode = [1,2,3,4];
	}

	/**
	 * 获取神器列表 code唯一的 不包括碎片
	 */
	public getGodWPList():any[]{
		if(!this._godWeaponList){
			this._godWeaponList = [];
			let dict:any = this.getDict();
			let preCode:number = -1;
			for(let key in dict){
				let info:any = dict[key];
				if(info.code!=preCode){
					preCode = info.code; 
					this._godWeaponList.push(info);
				}
			}
			App.ArrayUtils.sortOn(this._godWeaponList,"code");
		}
		return this._godWeaponList;
	}
	/**
	 * 获取某个神器的碎片列表
	 */
	public getPieceList(code:number):any[]{
		if(!this._pieceDict){
			this._pieceDict = {};
			let dict:any = this.getDict();
			for(let key in dict){
				let info:any = dict[key];
				if(!this._pieceDict[info.code]){
					this._pieceDict[info.code] = [];
				}
				this._pieceDict[info.code].push(info);
			}			
		}
		return this._pieceDict[code];
	}

	/**根据code获取某个神器是所有属性 */
	public getTotalAttr(code:number):any{
		let pieces: any[] = this.getPieceList(code);		
		return this.getAttrByPieces(pieces);
	}

	public getAttrByPieces(pieces:any[]):any{
		let totalAttr: any = {};
		for (let inf of pieces) {
			ObjectUtil.mergeObj(totalAttr, WeaponUtil.getAttrDict(inf.attr));
		}
		return totalAttr;
	}

	public getByTaskCode(taskCode:number):any{
		this.initTaskCode();
		return this._taskDict[taskCode];
	}

	/**特殊神器 提示的美术字没有 领悟 的*/
	public isSpecial(code:number):boolean{
		return this._specialCode.indexOf(code)>-1;
	}

	/**获取神器的提示文本url */
	public getGodWeaponTipsUrl(code:number):string{		
		return URLManager.getModuleImgUrl(`godWeapon/tipText/godWP_tip${code}.png`,PackNameEnum.Train);
	}

	/**
	 * 根据通关的关卡获取可激活的碎片
	 */
	public getByCheckPoint(passNum:number):any{
		this.initCheckPoint();
		return this._checkPointDict[passNum];
	}
	/**所有可以激活碎片的关卡 */
	public get checPoints():number[]{
		this.initCheckPoint();
		return this._checPoints;
	}
	/**获取包名 */
	public getPkgName(code:number):string{
		return `TrainGW${code}`;
	}
	/**获取组件名 */
	public getComName():string{
		return "trainWP";
	}

	/**
	 * 获取碎片的图片地址
	 */
	public getPieceUrl(info:any):string{
		let code:number = ObjectUtil.getConfigVal(info,"code");
		let piece:number = ObjectUtil.getConfigVal(info,"piece");
		let url:string = URLManager.getIconUrl(`img_piece_${code}_${piece}`,URLManager.GODWP_PIECE);
		return url;
	}
	/**
	 * 获取神器或神器名称的图片地址
	 */
	public getWeaponUrl(codeOrInf:any,isName:boolean=false,isMini:boolean=false):string{
		let url:string = "";
		let code:number;
		if(typeof(codeOrInf)=="number"){
			code = codeOrInf;
		}else{
			code = codeOrInf.code;
		}
		let key:string;
		if(isName){
			key = "name_"+code;
			url = URLManager.getIconUrl(key,URLManager.GOD_WEAPON+"/name");
		}else{
			key = "weapon_"+code;
			let model:string = isMini?"model_min":"model";
			url = URLManager.getIconUrl(key,URLManager.GOD_WEAPON+"/"+model);
		}		 
		return url;
	}

	private initCheckPoint():void{
		if(!this._checkPointDict){
			this._checkPointDict = {};
			this._checPoints = [];
			let dict:any = this.getDict();
			let preCode:number = -1;
			for(let key in dict){
				let info:any = dict[key];
				this._checkPointDict[info.checkPoint] = info;
				this._checPoints.push(info.checkPoint);
			}
			App.ArrayUtils.sortOn(this._checPoints);
		}
	}
	
	private initTaskCode():void{
		if(!this._taskDict){
			this._taskDict = {};
			let dict:any = this.getDict();
			for(let key in dict){
				let info:any = dict[key];
				if(info.taskCode){
					this._taskDict[info.taskCode] = info;
				}				
			}
		}
	}

}
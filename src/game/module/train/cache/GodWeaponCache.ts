class GodWeaponCache implements ICache {

	/**各个神器的战斗力 没有激活的返回0 */
	private godWPFightValDict: any;

	/**已经激活的神器属性 */
	private godWPActAttrDict: any;

	/**
	 * 开启的神器信息{god_weapons:[code,...],pieces:{code:[pieceId,..]}}
	 */
	private godWeaponInfo: any;
	private _godWPTotalAttrText: string = "";
	private _godWPTotalAttrDict: any;
	private _isReady: boolean;
	/**激活神器需要打开模块的字典 */
	private _actOpenModuelDict: any;

	/**新激活神器 不显示激活界面的code */
	private _actUnShowActCode: number[];

	public constructor() {
		this.godWPFightValDict = {};
		this.godWPActAttrDict = {};
		this._actOpenModuelDict = {
			[-1]: { moduleId: ModuleEnum.Player, param: { tabType: PanelTabType.UniqueSkill } },//不打开必杀
			//[2]: { moduleId: ModuleEnum.SevenDayMagicWeapon, param: {} },
			//[3]: { moduleId: ModuleEnum.Train, param: { tabType: PanelTabType.TrainNobility } },
		}

		this._actUnShowActCode = [1];
	}

	/**
	 * 判断某个神器是否已经激活
	 */
	public isGodWPAct(code: number): boolean {
		let flag: boolean = false;
		if (this.godWeaponInfo && this.godWeaponInfo.god_weapons) {
			flag = this.godWeaponInfo.god_weapons.indexOf(code) > -1;
		}
		return flag;
	}
	/**
	 * 判断某个神器是否可激活
	 */
	public isGodWPCanAct(code: number): boolean {
		let flag: boolean = false;
		//所有碎片都已经激活 则可以激活
		if (!this.isGodWPAct(code)) {
			let pieceIds: number[] = this.getActPieces(code);
			let cfgPieces: any[] = ConfigManager.godWeapon.getPieceList(code);
			flag = pieceIds.length == cfgPieces.length;
		}
		return flag;
	}
	/**
	 * 判断某个碎片是否已激活
	 */
	public isGodWPieceAct(code: number, piece: number): boolean {
		let flag: boolean = false;
		if (this.isGodWPAct(code)) {
			flag = true;
		} else {
			//根据推送回来的列表判断
			let pieceIds: number[] = this.getActPieces(code);
			flag = pieceIds.indexOf(piece) > -1;
		}
		return flag;
	}

	/**
	 * 判断某个碎片是否可激活
	 */
	public isGodWPieceCanAct(code: number, piece: number): boolean {
		let flag: boolean = false;
		if (!this.isGodWPieceAct(code, piece)) {
			let inf: any = ConfigManager.godWeapon.getByPk(`${code},${piece}`);
			if (inf) {
				let taskCode: number = ObjectUtil.getConfigVal(inf, "taskCode", 0);
				if (taskCode > 0) {
					flag = this.isTaskOk(taskCode);//
				} else {
					let passPointNum: number = CacheManager.checkPoint.passPointNum;
					flag = passPointNum >= inf.checkPoint;
				}
			}
		}
		return flag;
	}
	public isTaskOk(code: number): boolean {
		let flag: boolean = CacheManager.task.isTaskOpenEnd(code); //在线做任务 能够实时判断
		if (!flag && this.godWeaponInfo && this.godWeaponInfo.hadEndTaskList) {
			flag = this.godWeaponInfo.hadEndTaskList.indexOf(code) > -1; //重新登录 记录
		}
		return flag
	}
	/**
	 * 获取已经激活的碎片列表
	 */
	public getActPieces(code: number): number[] {
		let pieces: number[] = [];
		//根据推送回来的列表判断
		if (this.godWeaponInfo && this.godWeaponInfo.pieces && this.godWeaponInfo.pieces[code]) {
			pieces = this.godWeaponInfo.pieces[code];
		}
		return pieces;
	}

	/**
	 * 获取某个神器的战斗力
	 */
	public getGodWPFightVal(code: number): number {
		let val: number = 0;
		if (this.isGodWPAct(code)) {
			//已经激活的只计算一次
			if (!this.godWPFightValDict[code]) {
				let totalAttr: any = ConfigManager.godWeapon.getTotalAttr(code);
				val = WeaponUtil.getCombat(totalAttr);
				this.godWPFightValDict[code] = val;
			} else {
				val = this.godWPFightValDict[code];
			}
		} else {
			//激活部分碎片的 每次都计算
			let actPieces: number[] = this.getActPieces(code);
			let totalAttr: any = {};
			for (let piece of actPieces) {
				let info: any = ConfigManager.godWeapon.getByPk(code + "," + piece);
				ObjectUtil.mergeObj(totalAttr, WeaponUtil.getAttrDict(info.attr));
			}
			val = WeaponUtil.getCombat(totalAttr);

		}
		return val;
	}

	/**
	 * 获取所有已经激活的碎片战斗力
	 */
	public getActWPTotalFight(): number {
		let total: number = 0;
		let totalAttr: any = {};
		if (this.godWeaponInfo) {
			if (this.godWeaponInfo.god_weapons) {
				for (let code of this.godWeaponInfo.god_weapons) {
					if (!this.godWPActAttrDict[code]) {
						this.godWPActAttrDict[code] = ConfigManager.godWeapon.getTotalAttr(code);
					}
					ObjectUtil.mergeObj(totalAttr, this.godWPActAttrDict[code]);
				}
			}
			if (this.godWeaponInfo.pieces) {
				for (let code in this.godWeaponInfo.pieces) {
					let actPieces: number[] = this.getActPieces(Number(code));
					for (let piece of actPieces) {
						let info: any = ConfigManager.godWeapon.getByPk(code + "," + piece);
						ObjectUtil.mergeObj(totalAttr, WeaponUtil.getAttrDict(info.attr));
					}
				}
			}
		}
		total = WeaponUtil.getCombat(totalAttr);
		return total;
	}

	/**
	 * 是否有红点提示
	 */
	public checkTips(): boolean {
		//当玩家有可激活的碎片或神器时，【历练】按钮、【神器】按钮加上红点显示。

		let flag: boolean = false;
		let godWPList: any[] = ConfigManager.godWeapon.getGodWPList();
		for (let i: number = 0; i < godWPList.length; i++) {
			let info: any = godWPList[i];
			let b: boolean = false;
			if (this.isGodWPCanAct(info.code)) { //首先判断神器是否可激活
				flag = true;
				break;
			} else if (!this.isGodWPAct(info.code)) { //再判断是否有可激活的碎片
				b = this.isHasPieceCanAct(info.code);
				/*
				let pieceList: any[] = ConfigManager.godWeapon.getPieceList(info.code);
				for (let j: number = 0; j < pieceList.length; j++) {
					let pieceInfo: any = pieceList[j];
					if (this.isGodWPieceCanAct(info.code, pieceInfo.piece)) { //有可激活的碎片
						b = true;
						break;
					}
				}
				*/
			}
			if (b) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	public isHasPieceCanAct(code: number): boolean {
		let b: boolean = false;
		let pieceList: any[] = ConfigManager.godWeapon.getPieceList(code);
		for (let j: number = 0; j < pieceList.length; j++) {
			let pieceInfo: any = pieceList[j];
			if (this.isGodWPieceCanAct(code, pieceInfo.piece)) { //有可激活的碎片
				b = true;
				break;
			}
		}
		return b;
	}

	/**
	 * 设置推回来的神器信息
	 */
	public setGodWPInfos(data: any): void {
		let isUpdate: boolean = true;
		this._isReady = true;
		if (!this.godWeaponInfo) {
			this.godWeaponInfo = {}; //登录推
			this.godWeaponInfo.pieces = {};
			isUpdate = false;
		}
		if (data.god_weapons) {
			let god_weapons: number[] = data.god_weapons.data_I;
			god_weapons.sort();
			let oldWeapons: number[] = this.godWeaponInfo.god_weapons;
			this.godWeaponInfo.god_weapons = god_weapons;
			if (isUpdate) {
				!oldWeapons ? oldWeapons = [] : null;
				if (oldWeapons.length != god_weapons.length) {
					let actInfo: any;
					for (let i: number = 0; i < god_weapons.length; i++) {
						if (oldWeapons.indexOf(god_weapons[i]) == -1) {
							actInfo = ConfigManager.godWeapon.getByPk(`${god_weapons[i]},1`);
							break;
						}
					}
					if (actInfo) {
						let isShowAct:boolean = this._actUnShowActCode.indexOf(actInfo.code)==-1;
						//新激活神器
						let urlModel: string = ConfigManager.godWeapon.getWeaponUrl(actInfo);
						let value: number = ConfigManager.mgOpen.getOpenTypeValue(PanelTabType[PanelTabType.TrainMedal], EOpenCondType.EOpenCondTypeGodWeapon);

						let openInf: any = this._actOpenModuelDict[actInfo.code]; //
						if (openInf) {//激活神器时打开模块界面
							let moduleId: number = openInf.moduleId;
							let param: any = openInf.param;
							param.callBack = new CallBack(() => {
								if (GuideAutoExecutor.isAutoActiveGodWeapon) {
									GuideAutoExecutor.isAutoActiveGodWeapon = false;
								} else if(isShowAct){
									/*
									if (actInfo.code == 2) { //法宝不弹出激活界面 2019年2月20日14:11:14
										//EventManager.dispatch(LocalEventEnum.ActivationShow, {"name": actInfo.name, "model": 6, "modelType": EShape.EMagicweapon, isOpenMedal:value==actInfo.code});
									}
									else {
										
									}
									*/
									EventManager.dispatch(LocalEventEnum.ActivationShow, { "name": actInfo.name, "urlModel": urlModel, isOpenMedal: value == actInfo.code });
								}
							}, this);
							EventManager.dispatch(UIEventEnum.ModuleOpen, moduleId, param);
						} else {
							if (GuideAutoExecutor.isAutoActiveGodWeapon) {
								GuideAutoExecutor.isAutoActiveGodWeapon = false;
							} else if(isShowAct) {
								EventManager.dispatch(LocalEventEnum.ActivationShow, { "name": actInfo.name, "urlModel": urlModel, isOpenMedal: value == actInfo.code });
							}
						}
						EventManager.dispatch(LocalEventEnum.TrainNewGodWeaponActive, actInfo);
					}
				}
			}
		}
		if (data.pieces) {
			let pieces: any = {};
			ObjectUtil.dictToJsObj(data.pieces, pieces, "value", "key_I");
			for (let key in pieces) {
				this.godWeaponInfo.pieces[key] = pieces[key].data_I;
			}
		} else {
			if (this.godWeaponInfo && this.godWeaponInfo.pieces) {
				ObjectUtil.emptyObj(this.godWeaponInfo.pieces);
			}
		}
		if (data.hadEndTaskList) {
			this.godWeaponInfo.hadEndTaskList = data.hadEndTaskList.data_I;
		} else {
			this.godWeaponInfo.hadEndTaskList = null;
		}
		if (isUpdate) {
			this.makeTotalAttrText();
			EventManager.dispatch(LocalEventEnum.TrainGodWeaponInfoUpdate);
		}
	}
	/**
	 * 获取已激活的神器code列表
	 */
	public getActGodWPCodes(): number[] {
		let actCodes: number[];
		if (this.godWeaponInfo && this.godWeaponInfo.god_weapons) {
			actCodes = this.godWeaponInfo.god_weapons;
		} else {
			actCodes = [];
		}
		return actCodes;
	}
	/**
	 * 获取当前指引的神器信息
	 */
	public getCurGuideGodWPInfo(): any {
		let inf: any;
		let checkPoints: number[] = ConfigManager.godWeapon.checPoints;
		let curProcess: number = CacheManager.checkPoint.passPointNum;
		for (let i: number = 0; i < checkPoints.length; i++) {
			let cp: number = checkPoints[i];
			if (cp > curProcess) {
				let tempInf: any = ConfigManager.godWeapon.getByCheckPoint(cp);
				if (tempInf.isGuide) {
					if (tempInf.code == 2) {
						if (this.isGodWPAct(1)) {
							inf = tempInf;
						}
						break;
					} else {
						inf = tempInf;
						break;
					}
				}

			}
		}
		return inf;
	}

	/**神器数据是否回来了 */
	public get isReady(): boolean {
		return this._isReady;
	}

	private getActGodWPAttrDict(): any {
		let totalAttr: any;
		if (this.godWeaponInfo && this.godWeaponInfo.god_weapons) {
			for (let code of this.godWeaponInfo.god_weapons) { //计算所有已经激活的神器的属性
				!totalAttr ? totalAttr = {} : null;
				let piecesList: any[] = ConfigManager.godWeapon.getPieceList(code);
				for (let inf of piecesList) {
					let base: any = WeaponUtil.getAttrDict(inf.attr);
					ObjectUtil.mergeObj(totalAttr, base);
				}
			}
		}
		return totalAttr;
	}
	private getActPieceAttrDict(): any {
		let totalAttr: any;
		//计算已经激活的碎片
		if (this.godWeaponInfo.pieces) {
			for (let key in this.godWeaponInfo.pieces) {
				!totalAttr ? totalAttr = {} : null;
				let pieceIds: number[] = this.godWeaponInfo.pieces[key];
				let code: number = Number(key);
				for (let piece of pieceIds) {
					let inf: any = ConfigManager.godWeapon.getByPk(`${code},${piece}`);
					let base: any = WeaponUtil.getAttrDict(inf.attr);
					ObjectUtil.mergeObj(totalAttr, base);
				}
			}
		}
		return totalAttr;
	}
	private makeTotalAttrText(): void {
		let totalAttr: any = {};
		let actGodWpAttrDict: any = this.getActGodWPAttrDict();
		let actPieceAttrDict: any = this.getActPieceAttrDict();
		if (!actGodWpAttrDict && !actPieceAttrDict) {
			let inf: any = ConfigManager.godWeapon.getGodWPList()[0];
			totalAttr = WeaponUtil.getAttrDict(inf.attr);
			for (let key in totalAttr) {
				totalAttr[key] = 0;
			}
		} else {
			if (actGodWpAttrDict) {
				ObjectUtil.mergeObj(totalAttr, actGodWpAttrDict);
			}
			if (actPieceAttrDict) {
				ObjectUtil.mergeObj(totalAttr, actPieceAttrDict);
			}
		}
		//this._godWPTotalAttrDict = totalAttr; //有需要再保存
		this._godWPTotalAttrText = WeaponUtil.getAttrText2(totalAttr, true, "#f2e1c0", Color.BASIC_COLOR_3, true, false);

	}
	public getGodWPTotalAttrText(): string {
		if (this._godWPTotalAttrText == "") {
			this.makeTotalAttrText();
		}
		return this._godWPTotalAttrText;
	}

	public clear(): void {

	}

}
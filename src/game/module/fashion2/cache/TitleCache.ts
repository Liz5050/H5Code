class TitleCache implements ICache {

	private titleList: { [code: number]: any } = {};
	// private useTitleCode: number;
	private roleUseTitle:{[index:number]:number} = {};

	/**称号展开状态 */
	private showPropertyList:number[] = [];
	/**当前操作的角色索引 */
	public operationIndex:number = 0;
	public constructor() {
	}

	/**
	 * 	更新称号列表
	 */
	public updateTitleList(titles: any[]): void {
		this.titleList = {};
		for (let i: number = 0; i < titles.length; i++) {
			let title: any = titles[i];
			this.titleList[title.titleCode_I] = title;
		}
	}

	/**
	 * 更新称号
	 */
	public updateTitle(title:any):void {
		this.titleList[title.titleCode_I] = title;
	}	

	/**
	 * 新增称号
	 */
	public addTitle(title:any):void {
		this.titleList[title.titleCode_I] = title;
	}

	/**
	 * 称号属性展开显示
	 */
	public addShowProperty(code:number,isShow:boolean):void {
		let index:number = this.showPropertyList.indexOf(code);
		if(isShow) {
			if(index == -1) {
				this.showPropertyList.push(code);
			}
		}
		else {
			if(index != -1) {
				this.showPropertyList.splice(index,1);
			}
		}
	}

	/**
	 * 称号属性是否展开
	 */
	public isShowProperty(code:number):boolean {
		return this.showPropertyList.indexOf(code) != -1;
	}

	/**
	 * 清空属性展开状态
	 */
	public clearShowPropertys():void {
		this.showPropertyList = [];
	}

	/**
	 * 移除称号
	 */
	public removeTitle(title:any):void {
		if(this.titleList[title.titleCode_I]) delete this.titleList[title.titleCode_I];
	}

	/**
	 * 使用中的称号更新
	 */
	public updateInUseTitle(title: any): void {
		this.roleUseTitle[title.roleIndex_I] = title.titleCode_I;
		// this.useTitleCode = title.titleCode_I;
	}

	/**
	 * 使用中的称号
	 */
	public getUseTitle(roleIndex:number): any {
		if(!this.titleList) return null;
		let code:number = this.roleUseTitle[roleIndex];
		if(!code) return null;
		return this.titleList[code];
	}

	/**
	 * 称号是否使用中
	 * @param roleIndex 指定判断对应的角色是否穿戴 -1不指定角色，只要有角色佩戴就是true
	 */
	public isInUse(titleCode: number,roleIndex:number = -1): boolean {
		if(roleIndex == -1) {
			for(let index in this.roleUseTitle) {
				if(titleCode == this.roleUseTitle[index]) {
					return true;
				}
			}
		}
		else {
			return this.roleUseTitle[roleIndex] == titleCode;
		}
		return false;
	}

	/** 
	 * 称号是否已激活
	 */
	public isActive(titleCode: number): boolean {
		if(!this.titleList) return false;
		let title: any = this.titleList[titleCode];
		return title != null;// && title.endDt
	}

	/**获取一个激活的称号 */
	public getActiveTitle(titleCode:number):any {
		if(!this.titleList) return null;
		return this.titleList[titleCode];
	}	

	/**
	 * 获取已激活称号的总属性列表
	 */
	public getActiveTitleTotalProperty():number[][] {
		let result:{[type:number]:number} = {};
		for(let code in this.titleList) {
			let titleCfg:any = ConfigManager.title.getByPk(code);
			if(!titleCfg) {
				Log.trace(Log.SERR,"t_title_config error : ", code);
				continue;
			}
			let attrs:number[] = WeaponUtil.getAttrArray(titleCfg.attrList);
			for(let i:number = 0; i < attrs.length; i++) {
				let type:number = attrs[i][0];
				let value:number = attrs[i][1];
				if(!result[type]) {
					result[type] = value;
				}
				else {
					result[type] += value;
				}
			}
		}
		let resultArr:number[][] = [];
		for(let type in result) {
			resultArr.push([Number(type),result[type]]);
		}
		return resultArr;
	}

	public clear(): void {

	}
}
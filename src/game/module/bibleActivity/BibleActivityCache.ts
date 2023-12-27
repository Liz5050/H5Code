class BibleActivityCache implements ICache{
	public deityBookInfo: any;
	private targetInfo: any;
	private bossCode: any;

	public constructor() {
	}

	public updateTargetInfo(): void{
		this.targetInfo = {};
		this.bossCode = {};
		if(this.deityBookInfo && this.deityBookInfo.info.currentPage_I){
			for(let d of this.deityBookInfo.info.targetInfos.data){
				this.targetInfo[d.index_I] = d;
				if(d.processDetail.data_I.length > 0){
					for(let code of d.processDetail.data_I){
						this.bossCode[code] = true;
					}
				}
			}
		}
	}

	public getTargetInfo(index: number): any{
		if(this.targetInfo){
			return this.targetInfo[index];
		}
		return null;
	}

	public getBossStatus(code: number): boolean{
		if(this.bossCode && this.bossCode[code]){
			return true;
		}
		return false;
	}

	public getTargetProcess(index: number): number{
		if(this.targetInfo){
			return Number(this.getTargetInfo(index).process_L64);
		}
		return -1;
	}

	public getCurrentPage(): number{
		ConfigManager.mgDeityBookPage.getDict();
		if(this.deityBookInfo){
			return this.deityBookInfo.info.currentPage_I;
		}
		return 0;
	}

	public getProcess(): number{
		if(this.deityBookInfo){
			return this.deityBookInfo.info.process_I;
		}
		return 0;
	}

	public getStatus(): number{
		if(this.deityBookInfo){
			return this.deityBookInfo.info.status_I;
		}
		return 0;
	}

	public isTabBtnTips(page: number): boolean{
		if(page == this.getCurrentPage()){
			return this.checkTips();
		}
		return false;
	}

	public checkTips(): boolean{
		if(this.isOpen()){
			if(this.getStatus() == EDeityBookStatus.EDeityBookStatusComplete){
				return true;
			}else{
				for(let data of this.deityBookInfo.info.targetInfos.data){
					if(data.status_I == EDeityBookStatus.EDeityBookStatusComplete){
						return true;
					}
				}
			}
		}
		return false;
	}

	public isOpen(): boolean{
		if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.DeityBook, false)){
			if(this.getCurrentPage() != 0  && this.getCurrentPage() <= ConfigManager.mgDeityBookPage.configLength){
				return true;
			}
		}
		return false;
	}

	public clear(): void{

	}
}
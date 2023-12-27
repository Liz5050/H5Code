/**
 * 必杀碎片兑换窗口
 */

class UniqueSkillExchangeWindow extends BaseWindow{
	private exchangeList: List;
	private btnList: fairygui.GList;
	private chipExchangeBtn: fairygui.GButton;
	private highLevelChipTxt: fairygui.GTextField;
	private lowLevelChipTxt: fairygui.GTextField;

	private cultivateDict: any;
	private levelDict: any;

	public constructor() {
		super(PackNameEnum.UniqueSkill, "WindowExchange");
	}

	public initOptUI():void{
		this.exchangeList = new List(this.getGObject("list_exchange").asList);
		this.btnList = this.getGObject("list_btn").asList;
		this.chipExchangeBtn = this.getGObject("btn_chipExchange").asButton;
		this.highLevelChipTxt = this.getGObject("txt_highChip").asTextField;
		this.lowLevelChipTxt = this.getGObject("txt_lowChip").asTextField;

		this.chipExchangeBtn.addClickListener(this.clickChipExchange, this);
	}

	public updateAll(): void{
		this.updateData();
		this.updateBtnList();
		this.updateMoneyTxt();
		this.updateBtnTips();
		this.btnList.selectedIndex = 0;
		this.updateChipList();
		this.exchangeList.scrollToView(0);
	}

	/**金钱更新 */
	public moneyUpdate(): void{
		this.updateChipList();
		this.updateMoneyTxt();
		this.updateBtnTips();
	}

	/**背包更新 */
	public packUpdate(): void{
		this.updateChipList();
		this.updateBtnTips();
	}

	private updateBtnTips(): void{
		let btn: fairygui.GButton;
		for(let item of this.btnList._children){
			btn = item as fairygui.GButton;
			let level:number = Number(btn.name.replace("btn_", ""));
			CommonUtils.setBtnTips(btn, CacheManager.uniqueSkill.isCanExchangeByLevel(level));
		}
	}

	private onClickLevelBtn(e: any): void{
		this.updateChipList();
	}

	private clickChipExchange(): void{
		EventManager.dispatch(UIEventEnum.UniqueSkillChipExchangeOpen);
	}

	private updateData(): void{
		let cultivateDatas: any = ConfigManager.cultivate.select({"cultivateType": ECultivateType.ECultivateTypeKill});
		this.cultivateDict = {};
		this.levelDict = {};
		for(let key in cultivateDatas){
			let data: any = cultivateDatas[key];
			if(!this.cultivateDict[data.level]){
				this.cultivateDict[data.level] = {};
				this.levelDict[data.level] = data.posDesc;
			}
			this.cultivateDict[data.level][data.position] = data.itemCode;
		}
	}

	private updateBtnList(): void{
		let openLevel: number = CacheManager.uniqueSkill.getExchangeOpenLevel();
		let btnLevelArr: number[] = [];
		this.btnList.removeChildrenToPool();
		for(let key in this.levelDict){
			if(Number(key) <= openLevel){
				btnLevelArr.push(Number(key));
				// let btn: fairygui.GButton = this.btnList.addItemFromPool().asButton;
				// btn.title = this.levelDict[key];
				// btn.name = `btn_${key}`;
				// btn.addClickListener(this.onClickLevelBtn, this);
			}
		}
		btnLevelArr = this.sortLevelBtn(btnLevelArr);

		for(let level of btnLevelArr){
			let btn: fairygui.GButton = this.btnList.addItemFromPool().asButton;
			btn.title = this.levelDict[level];
			btn.name = `btn_${level}`;
			btn.addClickListener(this.onClickLevelBtn, this);
		}
	}

	private updateChipList():void{
		let btn: fairygui.GButton = this.btnList.getChildAt(this.btnList.selectedIndex).asButton;
		let name:string = btn.name;
		let level:number = Number(name.replace("btn_", ""));
		let selectedData: any = this.cultivateDict[level];
		let selectedArr: Array<ItemData> = [];
		if(selectedData){
			for(let key in selectedData){
				let itemData: ItemData = new ItemData(selectedData[key]);
				selectedArr.push(itemData);
			}
			this.exchangeList.data = selectedArr;
			
		}
	}

	private updateMoneyTxt(): void{
		this.lowLevelChipTxt.text = `${CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentJunior)}`;
		this.highLevelChipTxt.text = `${CacheManager.role.getMoney(EPriceUnit.EPriceUnitKillFragmentSenior)}`;
	}

	private sortLevelBtn(btnLevelArr: number[]): number[]{
		if(btnLevelArr && btnLevelArr.length > 0){
			btnLevelArr.sort((a: any, b:any): number =>{
				return this.getBtnSort(a,b);
			});
		}
		return btnLevelArr;
	}

	private getBtnSort(a:number, b:number):number{
		if(!CacheManager.uniqueSkill.isLevelAllAct(a) && CacheManager.uniqueSkill.isLevelAllAct(b)){
			return -1;
		}else if(CacheManager.uniqueSkill.isLevelAllAct(a) && !CacheManager.uniqueSkill.isLevelAllAct(b)){
			return 1;
		}else if(!CacheManager.uniqueSkill.isLevelAllAct(a) && !CacheManager.uniqueSkill.isLevelAllAct(b)){
			return a - b;
		}else{
			return b - a;
		}
	}
}
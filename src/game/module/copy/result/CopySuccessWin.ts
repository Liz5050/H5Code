/**
 * 副本成功窗口
 */
class CopySuccessWin extends CopyResultBaseWin {
	protected rewardList: List;
	private btn_close: fairygui.GButton;
	private btn_next: fairygui.GButton;
	private btn_confirm: fairygui.GButton;
	private btn_oneMore: fairygui.GButton;
	protected groupHj: fairygui.GGroup; //符文魂晶组
	protected groupRuneExp: fairygui.GGroup; //符文魂晶组
	protected group_button: fairygui.GGroup; //符文魂晶组
	protected group_sweep: fairygui.GGroup; //符文魂晶组
	protected group_sweepbutton: fairygui.GGroup; //符文魂晶组
	protected starLoaders:fairygui.GLoader[];S
	private txt_num:fairygui.GTextField; //扫荡卷数量显示
	private txt_residueDegree:fairygui.GTextField; //扫荡卷数量显示
	private deleteGateData:any;	
	/**关闭界面是否需要显示幸运转盘 */
	private isRunableShow:boolean;
	private isExitCopy:boolean;
	private openInf:any;
	private curType:number;

	private isNextFloor:boolean;

	public constructor() {
		super("WindowCopyResultSucess",PackNameEnum.CopyResult);
	}

	public initOptUI(): void {
		super.initOptUI();

		
		this.txt_exp = this.getGObject("txt_exp").asRichTextField;
		this.txt_runeExp = this.getGObject("txt_runeExp").asTextField;

		this.rewardList = new List(this.getGObject("list_thing").asList,{isResetSelect:true,isShowCareerIco:true,isTxtNameStroke:false});
		this.groupHj = this.getGObject("group_hj").asGroup;
		this.groupRuneExp = this.getGObject("group_runeExp").asGroup;
		this.group_button = this.getGObject("group_button").asGroup;
		this.group_sweep = this.getGObject("group_sweep").asGroup;
		this.group_sweepbutton = this.getGObject("group_sweepbutton").asGroup;
		this.btn_next = this.getGObject("btn_next").asButton;
		this.txt_num = this.getGObject("txt_num").asTextField;
		this.txt_residueDegree = this.getGObject("txt_residueDegree").asTextField;

		this.btn_close = this.getGObject("btn_close").asButton;
		this.btn_confirm = this.getGObject("btn_confirm").asButton;
		this.btn_oneMore = this.getGObject("btn_oneMore").asButton;		
		
		this.btn_confirm.addClickListener(this.onClickHandler,this);
		this.btn_oneMore.addClickListener(this.onClickHandler,this);
		this.btn_next.addClickListener(this.onClickHandler,this);
		this.btn_close.addClickListener(this.onClickHandler,this);

		//this.initStarLoaders();
		this.loaderBg.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
		GuideTargetManager.reg(GuideTargetName.SysSetWindowCloseBtn, this.btn_close);
	}
	
	protected updateResult(data: any): void {
		super.updateResult(data);		
		var copyCode:number = data.copyCode_I;
		var isSuccess: boolean = data.isSuccess_B;		
		var rewardItems: any = data.rewardItems;
		var starNum: number = data.passStar_SH;
		var rewardMoneys: any = data.rewardMoneys;
		let copyInf:any = ConfigManager.copy.getByPk(copyCode);
		this.curType = copyInf.copyType;
		this.isExitCopy = true;
		this.openInf = CopyUtils.getSuccessOpenInf(copyCode);
		switch (this.c1.selectedIndex) {
			case CopyResultBaseWin.Cindex_Normal:
				break;
			case CopyResultBaseWin.Cindex_Tower:
				this.updateTower(data);
				break;
		}
		//this.updateStar(starNum);
		this.updateItemList(rewardItems);		

	}
	protected updateByDelegate(data:any):void{
		this.isExitCopy = false;
		this.deleteGateData = data;
		this.c1.selectedIndex = 2;
		this.closeObj.visible = true;
		let copyInf:any = ConfigManager.copy.getByPk(this.deleteGateData.copyCode);
		var rewards:any[] = data.showRewards.data;
		this.txt_exp.text = ""+App.MathUtils.formatNum64(data.dropExp,false);
		var rewardArr:ItemData[] = [];
		for(var i:number = 0;i<rewards.length;i++){
			var item:ItemData = new ItemData(rewards[i].code_I);
			item.itemAmount = rewards[i].num_L64;
			rewardArr.push(item);
		}
		this.rewardList.setVirtual(rewardArr);
		let inf:any = ConfigManager.mgDelegate.getByPk(this.deleteGateData.copyCode);
		let needGold:number = ObjectUtil.getConfigVal(inf,"needGold");
		let isMate:boolean = copyInf.copyType==ECopyType.ECopyMgMaterial;
		this.txt_num.text = inf.needGold+"";
		this.txt_residueDegree.text = "剩余"+CacheManager.copy.getEnterLeftNum(this.deleteGateData.copyCode)+"次";
		this.group_sweep.visible = isMate;
		this.group_sweepbutton.visible = isMate;
	}	
	protected onTimerRun():void{
		var leftSec:number = this.calLeftSec();
		if(leftSec<=0){
			if(this.isNextFloor){
				//通关第1层后不能自动下一层，也不能关闭，需要强制指引点确定
				let curFloor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
				if (curFloor == 1) {
					return;
				}
				this.goNextFloor();
				this.isExitCopy = false;
			}else{
				this.isExitCopy = true;
			}
			
			this.hide();			
		}
	}
	protected setCloseBtnText(leftSec:number):void{
		if(this.closeObj){
			this.closeObj.text = `领取奖励(${HtmlUtil.colorSubstitude(LangCommon.L48, leftSec)})`;
		}
		if(this.isNextFloor){
			if(this.btn_next){
				let curFloor:number = CacheManager.copy.getCopyProcess(this.retData.data.copyCode_I);
				let lbl:string="下一层";
				if(curFloor == 1){ //通关诛仙塔第一层不回到界面
					this.btn_next.text = lbl;
				} else {
					this.btn_next.text = `${lbl}(${leftSec}S)`;
				}
			}
		}
		
	}

	private onClickHandler(e:egret.TouchEvent):void{
		switch(e.target){
			case this.btn_confirm:					
				break;
			case this.btn_close:
				this.isExitCopy = true;				
				break;
			case this.btn_oneMore:
				if(this.deleteGateData){
					EventManager.dispatch(LocalEventEnum.CopyDelegate,this.deleteGateData.copyCode,this.deleteGateData.key1,false);
				}
				break;
			case this.btn_next:
				this.goNextFloor();
				break;
		}
		this.hide();
		this.deleteGateData = null;

	}
	
	private goNextFloor():void{
		ProxyManager.copy.enterNextFloor();
		this.openInf = null; //继续下一层不需要打开
	}

	private initStarLoaders():void{
		var idx:number = 1;
		var nameFix:string = "loader_star";
		var star:fairygui.GLoader = this.getGObject(nameFix+idx).asLoader;
		this.starLoaders = [];
		while(star){
			this.starLoaders.push(star);
			idx++;
			var gobj:fairygui.GObject = this.getGObject(nameFix+idx);
			if(!gobj){
				break;
			}
			star = gobj.asLoader;
		}
	}
	private updateStar(starNum:number):void{
		for(var i:number=0;i<this.starLoaders.length;i++){
			var url:string;
			if(i<starNum){
				url = "ui://a60u8liper5i9g";
			}else{
				url = "ui://a60u8liper5i9h";
			}
			this.starLoaders[i].url = url;
		}
	}

	private updateTower(data: any): void {

		var rewardMoneys: any = data.rewardMoneys;
		var isSuccess: boolean = data.isSuccess_B;		
		let copyCode:number = data.copyCode_I;
		let floor:number = CacheManager.copy.getCopyProcess(copyCode);		
		var keys: number[] = rewardMoneys.key_I;
		var idx: number = keys.indexOf(EPriceUnit.EPriceUnitRuneExp);//符文经验
		var runExp: number = rewardMoneys.value_I[idx] ? rewardMoneys.value_I[idx] : 0;
		this.txt_runeExp.text = "" + runExp;
		idx = keys.indexOf(EPriceUnit.EPriceUnitRuneCoin);//符文碎片
		var runCoin: number = rewardMoneys.value_I[idx] ? rewardMoneys.value_I[idx] : 0;		
		if(isSuccess && CacheManager.towerTurnable.isCanLottry()){ // floor > 0 && floor%10==0 改成有抽奖次数 都要弹出抽奖界面 2018年9月11日22:18:54
			//this.openInf = null; //设置为打开幸运转盘
			this.closeObj.visible = true;
			this.group_button.visible = false;
			this.isRunableShow = true;
			this.isExitCopy = true;
			
		}else{
			this.group_button.visible = true;
			this.isExitCopy = false;
			this.isNextFloor = true;
		}
		
	}
	private updateItemList(rewardItems:any):void{
		var itemDtas: Array<ItemData> = [];
		if (rewardItems.key_I.length > 0 && rewardItems.value_I.length > 0) {
			for (var i: number = 0; i < rewardItems.key_I.length; i++) {
				let count:number = rewardItems.value_I[i];
				var idata: ItemData = new ItemData(rewardItems.key_I[i]);
				//材料副本所有都拆分 个人boss只拆分装备		
				if(count>1 && (this.curType==ECopyType.ECopyMgMaterial || 
					(this.curType==ECopyType.ECopyMgPersonalBoss && ItemsUtil.isEquipItem(idata) ) )){
					for(let j:number = 0;j<count;j++){
						let tempEquip:ItemData = new ItemData(rewardItems.key_I[i]);
						tempEquip.itemAmount = 1;
						itemDtas.push(idata);
					}
				}else if(count>1 && this.curType==ECopyType.ECopyMgParadiesLost){
					let costNum:number = 5; //列表图标个数
					let lostNum:number = count%costNum;//余数		
					count = Math.floor(count/costNum); //单个数量							 			
					for(let j:number = 0;j<costNum;j++){
						let tempEquip:ItemData = new ItemData(rewardItems.key_I[i]);
						tempEquip.itemAmount = count;
						itemDtas.push(tempEquip);
					}
					if(lostNum>0){
						let tempEquip:ItemData = new ItemData(rewardItems.key_I[i]);
						tempEquip.itemAmount = lostNum;
						itemDtas.push(tempEquip);
					}
				}else{ //其他副本不拆分
					idata.itemAmount = count;
					itemDtas.push(idata);
				}				
			}
		}
		itemDtas.sort(function (a:ItemData,b:ItemData):number{
			let ret:number = 0;
			let equipA:boolean = ItemsUtil.isEquipItem(a);
			let equipB:boolean = ItemsUtil.isEquipItem(b); 
			//装备排在后面
			if( equipA && !equipB){ 
				ret = 1;
			}else if(!equipA && equipB){
				ret = -1;
			}else if(equipA && equipB){
				let clrA:number = a.getColor();
				let clrB:number = b.getColor();
				if(clrA>clrB){ //品质排序
					ret = -1;
				}else if(clrA<clrB){
					ret = 1;
				}else{
					let olvA:number = a.getOrderLevel();
					let olvB:number = b.getOrderLevel(); //等级排序
					if(olvA>olvB){
						ret = -1;
					}else if(olvA<olvB){
						ret = 1;
					}else{
						let scoreA:number = WeaponUtil.getTotalScore(a);
						let scoreB:number = WeaponUtil.getTotalScore(b);
						if(scoreA>scoreB){
							ret = -1;
						}else if(scoreA<scoreB){
							ret = 1;
						}
					}
				}
			}

			return ret;
		});
		//this.rewardList.setVirtual(itemDtas,this.setItemRender,this);		
		if(this.txt_noReward) {
			this.txt_noReward.visible = itemDtas.length == 0;
		}
		this.rewardList.setVirtual(itemDtas);		
		this.rewardList.scrollToView(0);
	}

	private setItemRender(index:number,item:BaseItem):void{
		if (item["setData"] == undefined) return;
		item.isNameCount = this.curType==ECopyType.ECopyMgParadiesLost;
		item.setData(this.rewardList.data[index]);
	}

	public hide(param: any = null, callBack: CallBack = null): void{
		super.hide(param,callBack);
		/*
		if(this.isExitTower){			
			EventManager.dispatch(LocalEventEnum.CopyReqExit);		
			this.isExitTower = false;
		}
		*/
		this.isNextFloor = false;
		if(this.isRunableShow){
			this.isRunableShow = false;
			//打开幸福转盘，退出副本			
		}
		if(this.isExitCopy && CacheManager.copy.isInCopyByCode(this.retData.data.copyCode_I)){
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
		}
		if(this.openInf){

			let copyInfo:any = ConfigManager.copy.getByPk(this.retData.data.copyCode_I);
			if(copyInfo.copyType==ECopyType.ECopyMgRune){
				let curFloor:number = CacheManager.copy.getCopyProcess(this.retData.data.copyCode_I);
				if(curFloor==1){ //通关诛仙塔第一层不回到界面
					return;
				}
			}
			
			HomeUtil.open(this.openInf.mId,false,this.openInf.args);
			if(this.openInf.subMId){
				HomeUtil.open(this.openInf.subMId);
			}
			this.openInf = null;
		}
	}


}
class CopyFailWin extends CopyResultBaseWin {
	private c2:fairygui.Controller;
	private c3:fairygui.Controller;
	protected loaderTip:GLoader;
	private mc_container:fairygui.GComponent;
	private gotoMc:UIMovieClip;
	private txtVipLv:fairygui.GTextField;
	protected retData:any;
	private loaderIco0:GLoader;
	public constructor() {
		super("WindowCopyResultFail",PackNameEnum.CopyResult);
	}
	public initOptUI():void{
		super.initOptUI();
		this.c2 = this.getController("c2");		
		this.c3 = this.getController("c3");		
		this.btn_toBoss = this.getGObject("btn_toBoss").asButton;
		this.btn_recharge = this.getGObject("btn_recharge").asButton;
		this.btn_tofaqi = this.getGObject("btn_tofaqi").asButton;
		this.btn_torefine = this.getGObject("btn_torefine").asButton;
		this.btn_txt = this.getGObject("btn_txt").asButton;
		this.mc_container = this.getGObject("mc_container").asCom;
		this.txtVipLv = this.getGObject("txt_viplevel").asTextField;

		this.btn_toBoss.addClickListener(this.onClickModuleBtn,this);
		this.btn_recharge.addClickListener(this.onClickModuleBtn,this);
		this.btn_tofaqi.addClickListener(this.onClickModuleBtn,this);
		this.btn_torefine.addClickListener(this.onClickModuleBtn,this);
		this.btn_txt.addClickListener(this.onClickModuleBtn,this);
		this.loaderTip = <GLoader>this.getGObject("loader_tip");

				
		this.loaderBg.load(URLManager.getModuleImgUrl("copy_result_fail.png",PackNameEnum.Copy));
		for(let i:number = 0; i < 4; i++) {
			let obj:fairygui.GObject = this.getGObject("loader_" + i);
			if(obj) {
				let ldr:GLoader = (obj as GLoader);
				ldr.load(URLManager.getModuleImgUrl("upgrade_icon_" + i + ".png",PackNameEnum.Copy));
				if(i==0){
					this.loaderIco0 = ldr;
				}
			}
		}
	}
	public updateAll(data?:any):void{
		this.retData = data;
		this.closeObj.visible = true;
		let idx:number = 0;		
		let isFull:boolean = CacheManager.role.isRoleFull();
		if(!isFull){
			let len:number = CacheManager.role.roles.length;
			let urls:string = `personal_fail_tips_${len}.jpg`;
			this.loaderTip.load(URLManager.getModuleImgUrl(urls,PackNameEnum.Copy));
		}else{
			this.loaderTip.clear();
			idx = 1;
		}
		this.addEff(!isFull);
		this.c2.setSelectedIndex(idx);
		let url:string = "";
		if(!CacheManager.recharge.isFirstRecharge()){
			idx = 0;
			url = URLManager.getModuleImgUrl("upgrade_icon_0.png",PackNameEnum.Copy);
		}else if(!CacheManager.activity.dayRechargeHadAllGet()){
			idx = 1;
			url = URLManager.getModuleImgUrl("upgrade_icon_0_1.png",PackNameEnum.Copy);
		}else{
			idx = 2;
			this.txtVipLv.text = ""+CacheManager.vip.vipLevel;
		}
		this.c3.setSelectedIndex(idx);
		if(this.loaderIco0 && url){
			this.loaderIco0.load(url);
		}
	}
	protected setCloseBtnText(leftSec:number):void{
		if(this.closeObj){
			this.closeObj.text = `退  出(${HtmlUtil.colorSubstitude(LangCommon.L48, leftSec)})`;
		}
	}
	private addEff(isAdd:boolean):void{
		if(isAdd){
			this.gotoMc = UIMovieManager.get(PackNameEnum.MCGoto);
			this.mc_container.addChild(this.gotoMc);
		}
	}

	protected onClickModuleBtn(e:egret.TouchEvent):void{
		switch(e.target){
			case this.btn_recharge:
				this.openRecharge();
				break;
			case this.btn_toBoss:
				HomeUtil.open(ModuleEnum.Lottery);
				break;
			case this.btn_tofaqi:				
				HomeUtil.open(ModuleEnum.MagicWare,false,{},ViewIndex.One);
				break;
			case this.btn_torefine:
				HomeUtil.open(ModuleEnum.Forge);
				break;
			case this.btn_txt: 
				HomeUtil.open(ModuleEnum.OpenRole,false,{},ViewIndex.One);
				break;
		}
		this.hide();		
	}

	private openRecharge():void{
		switch(this.c3.selectedIndex){
			case 0:
			case 2: //vip
				HomeUtil.openRecharge(ViewIndex.One);
				break;
			case 1: //每日充值
				//HomeUtil.open(ModuleEnum.);
				EventManager.dispatch(LocalEventEnum.OpenDayRecharge);
				break;			
		}
	}

	public hide(param: any = null, callBack: CallBack = null): void{
		super.hide(param,callBack);
		if(CacheManager.copy.isInCopy && CacheManager.copy.isInCopyByCode(this.retData.data.copyCode_I)){
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
		}
		if(this.gotoMc){
			this.gotoMc.destroy();
			this.gotoMc = null;
		}
	}
}
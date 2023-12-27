/**
 * 开角色窗口
 * 
 */
class OpenRoleModule extends BaseModule {

    private comrole: fairygui.GComponent;

    private realRoleCareers: number[];

	private role1ImgDict: { [career: number]: fairygui.GComponent };
	private openTipImgDic :  {[career: number]: fairygui.GImage};
    private selectedCareer: number;
	private onMove : boolean = false;
	private btnOpen : fairygui.GButton;

	private c1 : fairygui.Controller;
	private leftGoldVip2 : number;
	private leftGoldVip4 : number;
	private btnNext : fairygui.GButton;
	private btnPre : fairygui.GButton;
	private mc:UIMovieClip;
	private mc1:UIMovieClip;

	private beginX : number ;
	private sel1 : GLoader;
	private sel2 : GLoader;


	private num_loader : GLoader;
	private img_tips : fairygui.GImage;
	private open_tip : fairygui.GRichTextField;

	private role0 : fairygui.GComponent;
	private role1 : fairygui.GComponent;
	private role2 : fairygui.GComponent;
	private lastX : number;
	private beginTime : number = 0;
	private touchSpeed : number = 0;
	private lastTouchTime : number = 0;

	private indexAngles : Array<number> = [-120, 0 , 120];
	private Angles :any = {
		"1": 0,
		"2": -120,
		"4": 120
	}

	private angleTween : any = {
		"1": 0,
		"2": -120,
		"4": 120
	}
	private lastSelect :number = 1;
	private hasMove = false;

    private careerIndexDict: any = {
		"1": [2, 1, 4],
		"2": [4, 2, 1],
		"4": [1, 4, 2]
	}

	/**控制器，键为职业 */
	private cDict: any = {
		"1": 0,
		"2": 1,
		"4": 2
	}

    private grayPosDic : any = {
        "0": [-38, 155],
		"1": [98, 203],
		"2": [411, 155]
    }

    private rolePosDic : any = {
        "0": [-124, 75],
		"1": [100, 197],
		"2": [324, 75]
    }

    private butPosDic : any = {
        "0": [32, 468],
		"1": [222, 623],
		"2": [489, 468]
    }

    private titlePosDic : any = {
        "0": [59, 73],
		"1": [271, 128],
		"2": [498, 74]
    }

    private roleScaleDic : any = {
        "0": [0.7,0.7],
        "1": [1,1]
    }

    private grayScaleDic : any = {
        "0" : [1,1],
        "1" : [1.42,1.42],
    }

    private titleScaleDic : any = {
        "0" : [0.8,0.8],
        "1" : [1,1],
    }

    private butScaleDic : any = {
        "0" : [0.7,0.7],
        "1" : [1,1],
    }

	private OpenTipDic : any = {
        "0": [87, 543],
		"1": [310, 739],
		"2": [550, 543]
    }

	private alphaDic : any = {
		"0" :0.8,
        "1" :1,
	}



    public constructor() {
		super(ModuleEnum.OpenRole, PackNameEnum.OpenRole);
		this.role1ImgDict = {};

		this.openTipImgDic = {};
		this.isCenter = true;
	}


    public initOptUI(): void {
		this.c1 = this.getController("c1");
        this.comrole = this.getGObject("roleGroup").asCom;
		this.open_tip = this.getGObject("open_tip").asRichTextField;

        this.realRoleCareers = ConfigManager.const.getRealRoleCareers();
		this.num_loader = <GLoader>this.getGObject("num_loader");
		
		this.btnOpen = this.getGObject("open_btn").asButton;
		this.btnOpen.addClickListener(this.ClickOpen, this);

		this.btnPre = this.getGObject("pre").asButton;
		this.btnPre.addClickListener(this.clickPre, this);
		this.btnNext = this.getGObject("next").asButton;
		this.btnNext.addClickListener(this.ClickNext, this);


		this.sel1 = <GLoader>this.getGObject("sel1");
		this.sel2 = <GLoader>this.getGObject("sel2");

		this.sel1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.sel1.addEventListener(egret.TouchEvent.TOUCH_END, this.touchRelease, this);
		this.sel1.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchRelease, this);
		this.sel2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.sel2.addEventListener(egret.TouchEvent.TOUCH_END, this.touchRelease, this);
		this.sel2.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchRelease, this);


		this.comrole.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.comrole.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMove, this);
		this.comrole.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
		this.comrole.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchRelease, this);
		// /this.checkShowTips();
        for (let career of this.realRoleCareers) {

			//this.role0ImgDict[career].addClickListener(this.clickRole0Loader, this);


			this.role1ImgDict[career] = this.comrole.getChild(`role${career}`).asCom;
			this.role1ImgDict[career].addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
			this.role1ImgDict[career].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
			this.role1ImgDict[career].addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchRelease, this);


			this.openTipImgDic[career] = this.role1ImgDict[career].getChild(`open_tips`).asImage;
	
		}
		this.img_tips = this.getGObject("tips").asImage;


		this.mc = UIMovieManager.get(PackNameEnum.MCRcgBtn2);
        this.btnOpen.addChild(this.mc);
        this.mc.visible = this.mc.playing = false;
        this.mc.scaleX = 1;
        this.mc.scaleY = 1;
        this.mc.x = -5; //this.btnReward.x - 174;
        this.mc.y = -9;//this.btnReward.y - 215;

    }

    private clickRole0Loader(e: egret.TouchEvent): void {
		let loader = e.target;
		if (loader != null) {
			let career: number = Number(loader.name.replace("role", ""));
			this.selectRole(career);
		}
	}


    /**
	 * 按职业选中角色
	 * @param selectedCareer 需要选中的职业
	 */
	private selectRole(selectedCareer: number, movetime :number = 1000): void {
		this.moveStep = 0;
		if(!this.selectedCareer) {
			this.selectedCareer = 1;
		}
		let clickIndex = this.getIndexByCareer(selectedCareer);
		this.hasMove = true;

		for (let career of this.careerIndexDict[this.selectedCareer]) {
			this.Angles[career] = this.angleTween[career];
		}

		this.lastTouchTime = Date.now();
		this.lastSelect = this.selectedCareer;
		egret.Tween.removeTweens(this);
		if(clickIndex == 0) {//往右转
			this.touchSpeed = 1;
			this.factor0 = 0.01;
			this.GotoCloseRole();
		}
		else if(clickIndex == 2){//往左转
			this.touchSpeed = -1;
			this.factor0 = -0.01;
			this.GotoCloseRole();
		}

		this.selectedCareer = selectedCareer;

		this.updateOpenRole();


	}



	
    public updateAll(data : any): void {
		if(data == false) {
			this.UpdateUI();
			return;
		}
		else {
			this.setPosDir(this.getDefSelectCareer());
			this.lastTouchTime = Date.now();
			this.hasMove = false;
			this.moveStep = 0;
			//egret.setTimeout(this.goCircle, this, 2000);
			this.UpdateUI();
		}
		this.addEventListener(egret.Event.ENTER_FRAME,this.checkCanGoCircle,this);
	}

    private getDefSelectCareer(): number {
		/**for (let career of [1, 2, 4]) {
			if (!CacheManager.role.isOpenedCareer(career)) {
				return career;
			}
		}*/
		
		return CacheManager.role.roles[0].career_I % 1000;
	}

    private getIndexByCareer(career: number): number {
		return this.careerIndexDict[this.selectedCareer].indexOf(career);
	}

	private getLastIndexByCareer(career : number) : number {
		return this.careerIndexDict[this.lastSelect].indexOf(career);
	}

	private ClickNext() {
		this.selectRole(this.careerIndexDict[this.selectedCareer][0]);
	}

	private clickPre() {
		this.selectRole(this.careerIndexDict[this.selectedCareer][2]);
	}

	private checkShowTips() {
		this.CheckOpenLoader();
	}

	private UpdateUI() {
		this.mc.visible = this.mc.playing = true;
		CommonUtils.setBtnTips(this.btnOpen,CacheManager.role.checkCanOpenRole());
		if(CacheManager.role.checkCanOpenRole()) {
			this.c1.selectedIndex = 2;
		}
		else if(CacheManager.role.roles.length == 1) {
			this.c1.selectedIndex = 0;
		}
		else if(CacheManager.role.roles.length == 2) {
			this.c1.selectedIndex = 1;
		}

		if(CacheManager.role.roles.length == 1) {
			this.num_loader.visible = true;
			this.btnOpen.visible = true;
			this.img_tips.visible = true;
			this.num_loader.load(URLManager.getModuleImgUrl("2.png", PackNameEnum.OpenRole));
			this.open_tip.text = LangOpenRole.L1;
		}
		if(CacheManager.role.roles.length == 2) {
			this.num_loader.visible = true;
			this.btnOpen.visible = true;
			this.img_tips.visible = true;
			this.num_loader.load(URLManager.getModuleImgUrl("3.png", PackNameEnum.OpenRole));
			this.open_tip.text = LangOpenRole.L2;
		}
		this.UpdateTips();
	}

	private UpdateTips() {
		if(this.c1.selectedIndex == 2) {
			return;
		}
		this.GetLeftToVip2();
		this.GetLeftToVip4();

	}

	private GetLeftToVip2() : string{
		this.leftGoldVip2 = 50 - CacheManager.vip.growth/100;
		return `${this.leftGoldVip2}元成为VIP2`
	}

	private GetLeftToVip4() {
		this.leftGoldVip4 = 200 - CacheManager.vip.growth/100;
		return `${this.leftGoldVip4}元成为VIP4`
	}

	private ClickOpen() {
		if(!CacheManager.role.checkCanOpenRole()) {
			if(CacheManager.role.roles.length == 1) {
				this.ClickOpen2();
				return ;
			}
			if(CacheManager.role.roles.length == 2) {
				this.ClickOpen3();
				return ;
			}
		}

		if (!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.CreateNewRole)) {
			return;
		}
		var indexs = [1,2,4];

		if(CacheManager.role.isOpenedCareer(this.selectedCareer)) {
			var indexs = [1,2,4];
			for(let i = 0;i<3;i ++) {
				if(!CacheManager.role.isOpenedCareer(indexs[i])) {
					EventManager.dispatch(LocalEventEnum.PlayerOpenNewRole, indexs[i]);
					this.selectRole(indexs[i]);
					return;
				}
			}
		}
		else {
			EventManager.dispatch(LocalEventEnum.PlayerOpenNewRole, this.selectedCareer);
		}
	}

	private ClickOpen2() {
		if(CacheManager.welfare2.onlineDays < 2) {
			Tip.showLeftTip("提升VIP等级或次日才可开启角色");
		}
		else {
			Tip.showLeftTip("提升VIP等级或达到80级才可开启角色");
		}
		var cfg = this.getRechargeId(this.leftGoldVip2);
		console.log("充值" + cfg.money);
		
		EventManager.dispatch(LocalEventEnum.RechargeReqSDK,cfg.money,cfg.productId);
	}

	private ClickOpen3() {
		if(CacheManager.welfare2.onlineDays < 2) {
			Tip.showLeftTip("提升VIP等级或次日才可开启角色");
		}
		else {
			Tip.showLeftTip("提升VIP等级或达到3转才可开启角色");
		}
		var cfg = this.getRechargeId(this.leftGoldVip4);
		console.log("充值" + cfg.money);
		EventManager.dispatch(LocalEventEnum.RechargeReqSDK,cfg.money,cfg.productId);
	}

	private getRechargeId(num : number) : any {
		var cfgs = ConfigManager.mgRecharge.getByType(ERechargeType.RechargeGold);
		for(let i = 0;i < cfgs.length; i++) {
			if(cfgs[i].money >= num) {
				return cfgs[i]
			}
		}
	}

	private updateOpenRole() {

	}

	private CheckOpenLoader() {

	}

	

	private touchBegin(evt : egret.TouchEvent) {
		this.beginX = evt.stageX;
		this.beginTime = Date.now();
		this.lastTouchTime = Date.now();
		this.lastX = evt.stageX;
		egret.Tween.pauseTweens(this);
		this.hasMove = true;
		this.moveStep = 0;
		this.inAutoMove = false;
		//egret.Tween.removeTweens(this);
	}

	private touchEnd(evt : egret.TouchEvent) {
		let touchTime = (Date.now() - this.beginTime)/1000;
		this.lastTouchTime = Date.now();
		if(touchTime <= 0.003 || Math.abs(evt.stageX - this.beginX) < 3) {
			egret.Tween.resumeTweens(this);
			return;
		}
		egret.Tween.removeTweens(this);
		let speed = (evt.stageX - this.beginX)/6/touchTime;
		this.touchSpeed = speed/50;
		let lefts = speed < 0;
		let fac = 0.5 * speed/Math.abs(speed);
		egret.Tween.get(this).to({factor1: fac}, 1000).call(this.findCloseRole,this); 
		this.moveStep = 0;
		this.inAutoMove = false;
	}

	private touchMove(evt : egret.TouchEvent) {
		let nowX = evt.stageX;
		this.lastTouchTime = Date.now();
		let move = (nowX - this.lastX)/6;
		this.lastX = nowX;
		this.factor1 = move;
		this.moveStep = 0;
		this.inAutoMove = false;
	}

	private touchCancel(evt : egret.TouchEvent) {
		this.touchEnd(evt);
	}

	private touchRelease(evt : egret.TouchEvent) {
		this.touchEnd(evt);
	}

	public get factor0():number {
		return 0;
	}

	public set factor0(value:number) {
		this.lastTouchTime = Date.now();
		for (let career of this.careerIndexDict[this.selectedCareer]) {
			let indexNow : number = this.getLastIndexByCareer(career);
			let anNow : number = this.Angles[career];
			this.angleTween[career] = anNow + value;
			let an = (anNow + value)/180 * Math.PI;
			let role1Img = this.role1ImgDict[career];
			role1Img.x = 100 + 300 *Math.sin(an);
			role1Img.y = 100* Math.cos(an);
			let scale = 0.6 + 0.4 * (role1Img.y + 100) / 200;
			let alpha = 0.7 + 0.3 * (role1Img.y + 100) / 200;
			role1Img.scaleX = scale;
			role1Img.scaleY = scale;
			role1Img.alpha = alpha;
			if(role1Img.y >0) {
				this.comrole.setChildIndex(role1Img, 2);
			}
			else if(role1Img.y < -60) {
				this.comrole.setChildIndex(role1Img, 0);
			}
			else {
				this.comrole.setChildIndex(role1Img, 1);
			}
		}
	}
	

	public setPosDir(selectedCareer: number) {
		if(this.onMove) {
			this.onMove = false;
		}
		egret.Tween.removeTweens(this);

		if(!this.selectedCareer) {
			this.selectedCareer = 1;
		}
		this.selectedCareer = selectedCareer;

		this.updateOpenRole();
		let scaleArray :Array<number>;
		let index: number;
		this.comrole.setChildIndex(this.role1ImgDict[this.careerIndexDict[selectedCareer][0]],3);
		this.comrole.setChildIndex(this.role1ImgDict[this.careerIndexDict[selectedCareer][1]],2);
		this.comrole.setChildIndex(this.role1ImgDict[this.careerIndexDict[selectedCareer][2]],1);
		
		for (let career of this.careerIndexDict[selectedCareer]) {

			index = this.getIndexByCareer(career);


			this.openTipImgDic[career].visible = CacheManager.role.isOpenedCareer(career);
            let scaleindex = career == selectedCareer ? 1 : 0;
			let alphaNum = career == selectedCareer ? 1 : 0.8;

			//亮图片
			let role1Img = this.role1ImgDict[career];
			scaleArray = this.roleScaleDic[scaleindex];
			let angle : number = this.indexAngles[index];

			role1Img.x = 100 + 300 *Math.sin(angle/180 * Math.PI);
			role1Img.y = 100* Math.cos(angle/180 * Math.PI);
			role1Img.scaleX = scaleArray[0];
			role1Img.scaleY = scaleArray[1];
			role1Img.alpha = alphaNum;
			let indexNow : number = this.getIndexByCareer(career);
			let anNow : number = this.indexAngles[indexNow];
			this.Angles[career] = anNow;
			this.angleTween[career] = anNow;
		}
	}

	public goCircle() {
		if(this.hasMove) {
			return ;
		}
		egret.Tween.get(this).to({factor0: 360}, 6000);

	}


	public endDeal() : void {
		this.onMove = false
		for (let career of this.careerIndexDict[this.selectedCareer]) {
			let indexNow = this.getIndexByCareer(career);
			let anNow = this.indexAngles[indexNow];
			this.Angles[career] = anNow;
			this.angleTween[career] = anNow;
		}
		//console.log(this.Angles);
	}


	public get factor1() {
		return this.touchSpeed;
	}

	public set factor1(value:number) {
		this.lastTouchTime = Date.now();
		for (let career of this.careerIndexDict[this.selectedCareer]) {
			let anNow : number = this.angleTween[career]
			let an = (anNow + value)/180 * Math.PI;
			let role1Img = this.role1ImgDict[career];
			role1Img.x = 100 + 300 *Math.sin(an);
			role1Img.y = 100* Math.cos(an);
			let scale = 0.6 + 0.4 * (role1Img.y + 100) / 200;
			let alpha = 0.7 + 0.3 * (role1Img.y + 100) / 200;
			role1Img.scaleX = scale;
			role1Img.scaleY = scale;
			role1Img.alpha = alpha;
			if(role1Img.y >0) {
				this.comrole.setChildIndex(role1Img, 2);
			}
			else if(role1Img.y < -60) {
				this.comrole.setChildIndex(role1Img, 0);
			}
			else {
				this.comrole.setChildIndex(role1Img, 1);
			}
			this.angleTween[career] = anNow + value;
			this.Angles[career] = anNow + value;
		}
	}

	public findCloseRole() {
		let left = this.touchSpeed < 0;
		if(left) {
			let anNow = this.angleTween[1];
			let anNeed = 0;
			while(anNow >= 180) {
				anNow = anNow - 360;
			}
			while(anNow < -180) {
				anNow = anNow + 360;
			}  
			if(anNow >= 0 && anNow <= 120) {
				anNeed = 0 -anNow;
			}
			if( anNow > 120 ) {
				anNeed = 120- anNow;
			}
			if(anNow >= -120 && anNow <0) {
				anNeed = -120 - anNow;
			}
			if(anNow < -120) {
				anNeed = -240 - anNow;
			}
			let timeNeed = Math.abs(anNeed/0.05);
			//console.log(anNeed + "   " + timeNeed + "   " + anNow);
			egret.Tween.get(this).to({factor0: anNeed}, timeNeed).call(this.findNowCenter);
			return;
		}
		else {
			let anNow = this.angleTween[1];
			let anNeed = 0;
			while(anNow >= 180) {
				anNow = anNow - 360;
			}
			while(anNow < -180) {
				anNow = anNow + 360;
			}  
			if(anNow >= 0 && anNow <= 120) {
				anNeed = 120 -anNow;
			}
			if( anNow > 120 ) {
				anNeed = 240- anNow;
			}
			if(anNow >= -120 && anNow <0) {
				anNeed = 0 - anNow;
			}
			if(anNow < - 120) {
				anNeed = -120 - anNow;
			}
			let timeNeed = Math.abs(anNeed/0.05);
			egret.Tween.get(this).to({factor0: anNeed}, timeNeed).call(this.findNowCenter);
			//console.log(anNeed + "   " + timeNeed + "   " + anNow);
			return;
		}
	}

	public findNowCenter() 
	{
		console.log("findCenter");
		console.log(this.angleTween);
		this.lastTouchTime = Date.now();
		for (let career of this.careerIndexDict[this.selectedCareer]) {
			let anNow = this.angleTween[career];
			while(anNow >= 180) {
				anNow = anNow - 360;
			}
			while(anNow < -180) {
				anNow = anNow + 360;
			}  
			if(Math.abs(anNow) < 10) {
				this.setPosDir(career);
				return ;
			}
		}

	}


	public GotoCloseRole() {
		let left = this.touchSpeed < 0;
		if(left) {
			let anNow = this.angleTween[1];
			let anNeed = 0;
			while(anNow >= 180) {
				anNow = anNow - 360;
			}
			while(anNow < -180) {
				anNow = anNow + 360;
			}  
			if(anNow >= 0 && anNow <= 120) {
				anNeed = 0 -anNow;
			}
			if( anNow > 120 ) {
				anNeed = 120- anNow;
			}
			if(anNow >= -120 && anNow <0) {
				anNeed = -120 - anNow;
			}
			if(anNow < -120) {
				anNeed = -240 - anNow;
			}
			
			if( this.inAutoMove ) {
				if(anNeed < 10) {
					anNeed -= 120;
				}
				this.inAutoMove = false;
			}
			let timeNeed = Math.abs(anNeed/0.15);
			//console.log(anNeed + "   " + timeNeed + "   " + anNow);
			egret.Tween.get(this).to({factor0: anNeed}, timeNeed,egret.Ease.circOut).call(this.findNowCenter);
			return;
		}
		else {
			let anNow = this.angleTween[1];
			let anNeed = 0;
			while(anNow >= 180) {
				anNow = anNow - 360;
			}
			while(anNow < -180) {
				anNow = anNow + 360;
			}  
			if(anNow >= 0 && anNow <= 120) {
				anNeed = 120 -anNow;
			}
			if( anNow > 120 ) {
				anNeed = 240- anNow;
			}
			if(anNow >= -120 && anNow <0) {
				anNeed = 0 - anNow;
			}
			if(anNow < - 120) {
				anNeed = -120 - anNow;
			}
			if( this.inAutoMove ) {
				if(anNeed < 10) {
					anNeed += 120;
				}
				this.inAutoMove = false;
			}
			let timeNeed = Math.abs(anNeed/0.15);
			egret.Tween.get(this).to({factor0: anNeed}, timeNeed,egret.Ease.circOut).call(this.findNowCenter);
			//console.log(anNeed + "   " + timeNeed + "   " + anNow);
			return;
		}
	}

	public moveStep : number = 0;
	public inAutoMove : boolean = false;

	public checkCanGoCircle() {
		var idleTime = Date.now() - this.lastTouchTime;

		if(idleTime  > 17  && idleTime < 1000 && this.moveStep == 0) {
			this.inAutoMove = true;
			egret.Tween.get(this).to({factor2: 6}, 983, egret.Ease.quadOut ).call(this.endFunc);
			this.moveStep = 1;
			return;
		}
		else if(idleTime  >= 1000 && idleTime < 2000 && this.moveStep == 1) {
			this.inAutoMove = true;
			egret.Tween.get(this).to({factor2: -6}, 1000,egret.Ease.quadIn).call(this.endFunc)
			this.moveStep = 2;
			return;
		}
		else if(idleTime  >= 2000 && idleTime < 3000 && this.moveStep == 2) {
			this.inAutoMove = true;
			egret.Tween.get(this).to({factor2: -6}, 1000,egret.Ease.quadOut).call(this.endFunc);
			this.moveStep = 3;
			return;
		}		
		/**else if(idleTime  >= 3000 && idleTime < 4000 && this.moveStep == 3) {
			this.inAutoMove = true;
			egret.Tween.get(this).to({factor2: 6}, 1000).call(this.endFunc);
			this.moveStep = 0;
			return;
		}*/
		else if(Date.now() - this.lastTouchTime > 3000) {
			egret.Tween.get(this).to({factor0: 132}, 3000, egret.Ease.quadInOut ).call(()=>{
					this.endFunc();
					this.lastTouchTime = Date.now() + 17 - 1000;
					this.moveStep = 2;
					this.factor2 = 0;
					egret.Tween.get(this).to({factor2: -6}, 999,egret.Ease.quadIn).call(()=>{
						this.findNowCenter();
						this.lastTouchTime -= 2000;
					});
					
				}
			)
			this.lastTouchTime = Date.now();
			this.moveStep = 1;
			return;
		}
	}

	
	public hide() {
		super.hide();
		this.removeEventListener(egret.Event.ENTER_FRAME,this.checkCanGoCircle,this);
	}


	public get factor2():number {
		return 0;
	}

	public endFunc() {
		this.onMove = false
		this.inAutoMove = false;
		for (let career of this.careerIndexDict[this.selectedCareer]) {
			this.Angles[career] = this.angleTween[career];
		}
	}

	public set factor2(value:number) {
		for (let career of this.careerIndexDict[this.selectedCareer]) {
			let indexNow : number = this.getLastIndexByCareer(career);
			let anNow : number = this.Angles[career];
			this.angleTween[career] = anNow + value;
			let an = (anNow + value)/180 * Math.PI;
			let role1Img = this.role1ImgDict[career];
			role1Img.x = 100 + 300 *Math.sin(an);
			role1Img.y = 100* Math.cos(an);
			let scale = 0.6 + 0.4 * (role1Img.y + 100) / 200;
			let alpha = 0.7 + 0.3 * (role1Img.y + 100) / 200;
			role1Img.scaleX = scale;
			role1Img.scaleY = scale;
			role1Img.alpha = alpha;
			if(role1Img.y >0) {
				this.comrole.setChildIndex(role1Img, 2);
			}
			else if(role1Img.y < -60) {
				this.comrole.setChildIndex(role1Img, 0);
			}
			else {
				this.comrole.setChildIndex(role1Img, 1);
			}
		}
	}
	


}
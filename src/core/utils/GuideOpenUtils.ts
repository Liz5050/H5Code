class GuideOpenUtils {

	public static SKILL_TASK_START:number = 300001;
	/**结束合击展示的任务id */
	public static SKILL_TASK_END:number = 300012;
	

	public constructor() {
	}

	/**返回主界面指引模型信息  {urlModel:"",urlName:"",desc1:"",desc2:""} */
	/*
	public static getGuideInfo(argData:any):any{
		let data:any = argData.data;
		let info:any = {urlModel:"",urlName:"",desc1:"",desc2:""};
		switch(argData.type){
			case EGuidePanel.GodWeapon:
				info.urlModel = ConfigManager.godWeapon.getWeaponUrl(data,false,true);
				info.urlName = ConfigManager.godWeapon.getWeaponUrl(data,true);
				let needCheckPoint:number = data.checkPoint;
				let curProcess:number = CacheManager.checkPoint.passPointNum;
				let n:number = needCheckPoint - curProcess;
				info.desc1 =  `再战 <font color='#0df14b'>${n}</font> 关`;
				info.desc2 = ObjectUtil.getConfigVal(data,"guideDesc","");		
				break;
			case EGuidePanel.SkillAtk:
				info.urlModel = URLManager.getModuleImgUrl("skill_atk_min.png",PackNameEnum.GuildePanel);
				info.urlName = URLManager.getModuleImgUrl("skill_atk_name.png",PackNameEnum.GuildePanel);
				let taskDist:number = GuideOpenUtils.getSkillTaskDist(data.curTaskCode);
				info.desc1 =  ``;
				info.desc2 = `还差<font color='#0df14b'>${taskDist}</font>个任务`;
				break;
		}
		return info;
	}
	*/

	/**
	 * 获取开启提示面板的信息 {url:"",cur:0,max:100,desc1:"",desc2:""}
	 */
	public static getOpenInfo(argData:any):any{
		let info:any = {url:"",cur:0,max:100,desc1:"",desc2:"",btnLabel:"",title:""};
		let data:any = argData.data;
		switch(argData.type){
			case EGuidePanel.GodWeapon:
				info = GuideOpenUtils.getGodWeaponOpenInf(data);
				info.btnLabel = "挑战";
				info.title = "通关收集神器";
				break;
			case EGuidePanel.SkillAtk:
				info.url = URLManager.getModuleImgUrl("skill_atk_max.png",PackNameEnum.GuildePanel);
				info.cur = data.curTaskCode - GuideOpenUtils.SKILL_TASK_START;
				info.max = GuideOpenUtils.SKILL_TASK_END  - GuideOpenUtils.SKILL_TASK_START;
				let taskDist:number =  GuideOpenUtils.getSkillTaskDist(data.curTaskCode);
				let clr:string = Color.Color_2;
				info.desc1 = `1.集三角色攻击力总和${HtmlUtil.brText}2.对玩家造成<font color='${clr}'>480%</font>的伤害${HtmlUtil.brText}3.对怪物造成<font color='#0df14b'>1050%</font>的伤害`;
				info.desc2 = `再完成<font color='#0df14b'>${taskDist}</font>个任务领取<font color='#0df14b'>九霄秘法</font>开启必杀技能`;
				info.btnLabel = "继续任务";
				info.title = "开启必杀技能";
				break;
		}
		return info;
	}

	private static getSkillTaskDist(curTaskCode:number):number{
		let taskDist:number = GuideOpenUtils.SKILL_TASK_END - curTaskCode+1;
		return taskDist;
	}

	/**是否可以显示神器引导台 */
	public static isCanGodWPGuide():boolean{
		// return CacheManager.task.isReady && CacheManager.task.isHadComplete(GuideOpenUtils.SKILL_TASK_END);
		return CacheManager.task.isReady && ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.UniqueSkillPreviewEnd, false);
	}
	/**
	 * 是否可以显示必杀引导台
	 */
	public static isCanSkillGuide():boolean{
		let curCode:number = CacheManager.task.currentTraceTask?CacheManager.task.currentTraceTask.task.code_I:0;
		// return curCode>=GuideOpenUtils.SKILL_TASK_START && !CacheManager.task.isHadComplete(GuideOpenUtils.SKILL_TASK_END);
		return curCode>=GuideOpenUtils.SKILL_TASK_START && !ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.UniqueSkillPreviewEnd, false);
	}
	/**获取引导台的数据  {type:EGuildePanel,data:{必须},openData:{非必须}} */
	public static getGuideData():any{
		let data:any;
        if(GuideOpenUtils.isCanSkillGuide()){
			data = {type:EGuidePanel.SkillAtk,data:{curTaskCode:CacheManager.task.currentTraceTask.task.code_I}};
        }else if(GuideOpenUtils.isCanGodWPGuide()){
            let info: any = CacheManager.godWeapon.getCurGuideGodWPInfo(); //要指引的神器配置信息 空表示不显示指引
            if (ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.TrainGodWeapon], false) && info && !CacheManager.copy.isInCopy) {
                data = {type:EGuidePanel.GodWeapon,data:info};                
            }
        }
		return data;
	}

	private static getGodWeaponOpenInf(data:any):any{
		let info:any = {urlModel:"",urlName:"",desc1:"",desc2:""};
		info.url = ConfigManager.godWeapon.getPieceUrl(data);
		let needCheckPoint:number = data.checkPoint;
		let curProcess:number = CacheManager.checkPoint.passPointNum;
		let n:number = needCheckPoint - curProcess;
		let green:string = Color.Color_2;//Color.toStr();
		info.desc2 = `再战<font color='${green}'> ${n} </font>关获得<font color='${green}'>${data.pieceName}</font>`;
		let pieceList:any[] = ConfigManager.godWeapon.getPieceList(data.code);
		let c:number = 0;
		for(let pieceInf of pieceList){
			if(!CacheManager.godWeapon.isGodWPieceCanAct(pieceInf.code,pieceInf.piece)){
				c++;
			}
		}
		info.desc1 = `1.再收集<font color='${green}'> ${c} </font>个碎片可合成神器<font color='${green}'>${data.name}</font>`+HtmlUtil.brText+"2."+data.weaponDesc;
		let checkPoints:number[] = ConfigManager.godWeapon.checPoints;
		let curIdx:number = checkPoints.indexOf(data.checkPoint);        
		let preNeedCp:number = 0; //激活上一个碎片需要的关卡数
		if(curIdx>0){
			let preInf:any = ConfigManager.godWeapon.getByCheckPoint(checkPoints[curIdx-1])
			preNeedCp = preInf.checkPoint;
		}
		let max:number = 100;
		let percent:number = (1-(n/(data.checkPoint-preNeedCp)))*max;
		info.cur = percent;
		info.max = max;
		return info;
	}

	//======================新的 ============
	public static getGuideInfo(cfg:any,isMax:boolean):any{
		let modelId:number = cfg.modelId;
		let data:any = {};
		let sub:string = isMax?'max':'min';
		data.urlModel = URLManager.getModuleImgUrl(sub+'/'+modelId+'.png',PackNameEnum.GuildePanel);
		data.urlName = URLManager.getModuleImgUrl(sub+'/'+cfg.openId+'_title.png',PackNameEnum.GuildePanel);		
		data.desc1 = isMax?GuideOpenUtils.getMaxCondDesc(cfg):GuideOpenUtils.getMinCondDesc(cfg);
		return data;
	}

	public static getMinCondDesc(cfg:any):string{
		let retDesc:string = "";
		if(cfg.condDesc){
			return cfg.condDesc;
		}
		let openCfg:any = ConfigManager.mgOpen.getByPk(cfg.openId);
		if(openCfg){			
			let conditions: string[] = openCfg.openCondList.split("#");
			let desc:string = "";
			let value: number = 0;
			let dif:number = 0;
			if(openCfg.openTask > 0 && !CacheManager.task.isTaskOpenEnd(openCfg.openTask)){ //未完成的任务条件
				let curCode:number = CacheManager.task.currentTraceTask?CacheManager.task.currentTraceTask.task.code_I:0;
				if(curCode>0){					
					dif = dif = GuideOpenUtils.calTaskCount(openCfg.openTask);
					desc = LangOpen.L23;
				}
								
			}else{
				for (let i: number = 0; i < conditions.length; i++) {
					if (conditions[i] == "") continue;
					let openTypeStr: string = conditions[i];
					let arr: string[] = openTypeStr.split(",");
					let type: number = Number(arr[0]);
					value = Number(arr[1]);
					switch (type) {
						case EOpenCondType.EOpenCondTypeLevel://角色等级限制
							dif = value - CacheManager.role.getRoleLevel();
							desc = LangOpen.L21;
							break;						
						case EOpenCondType.EOpenCondTypeCheckPoint://关卡通关数限制
							dif = value - CacheManager.checkPoint.passPointNum;
							desc = LangOpen.L22;
							break;
						case EOpenCondType.EOpenCondTypeGodWeapon:
							dif = CacheManager.godWeapon.isGodWPAct(value)?0:1;
							let cfgInfo:any = ConfigManager.godWeapon.getByPk(`${value},1`);
							desc = App.StringUtils.substitude(LangOpen.L24,cfgInfo.name);
							break;			
					}
					if(dif>0){
						break;
					}
				}
			}
			if(dif>0 && desc){
				retDesc = App.StringUtils.substitude(desc,value,dif);
			}			
			return retDesc;
		}
	}

	public static getMaxCondDesc(cfg:any):string{
		let retDesc:string = "";
		let openCfg:any = ConfigManager.mgOpen.getByPk(cfg.openId);
		if(openCfg){			
			let conditions: string[] = openCfg.openCondList.split("#");
			let desc:string = "";
			let value: number = 0;
			let dif:number = 0;
			if(openCfg.openTask > 0){
				let tarTaskInfo:any = ConfigManager.task.getByPk(openCfg.openTask);
				if(CacheManager.task.isTaskOpenEnd(openCfg.openTask)){
					retDesc+=HtmlUtil.html(App.StringUtils.substitude(LangOpen.L43,tarTaskInfo.coutTask),Color.Color_6)+HtmlUtil.brText;
				}else{	 //未完成的任务条件										
					dif = GuideOpenUtils.calTaskCount(openCfg.openTask);
					retDesc+=App.StringUtils.substitude(LangOpen.L33,tarTaskInfo.coutTask,dif);
				}
											
			}else{
				for (let i: number = 0; i < conditions.length; i++) {
					if (conditions[i] == "") continue;
					let openTypeStr: string = conditions[i];
					let arr: string[] = openTypeStr.split(",");
					let type: number = Number(arr[0]);
					value = Number(arr[1]);
					switch (type) {
						case EOpenCondType.EOpenCondTypeLevel://角色等级限制
							dif = value - CacheManager.role.getRoleLevel();
							desc = dif>0?LangOpen.L31:LangOpen.L41;
							break;						
						case EOpenCondType.EOpenCondTypeCheckPoint://关卡通关数限制
							dif = value - CacheManager.checkPoint.passPointNum;
							desc = dif>0?LangOpen.L32:LangOpen.L42;
							break;		
						case EOpenCondType.EOpenCondTypeGodWeapon:
							dif = CacheManager.godWeapon.isGodWPAct(value)?0:1;
							let cfgInfo:any = ConfigManager.godWeapon.getByPk(`${value},1`);
							desc = App.StringUtils.substitude((dif>0?LangOpen.L34:LangOpen.L44),cfgInfo.name);
							break;			
					}
					retDesc += HtmlUtil.html(App.StringUtils.substitude(desc,value,dif),(dif>0?Color.Color_4:Color.Color_6))+HtmlUtil.brText;
				}
			}
						
			return retDesc;
		}
	}

	private static calTaskCount(openTask:number):number{
		let tarTaskInfo:any = ConfigManager.task.getByPk(openTask);
		let curCode:number = CacheManager.task.currentTraceTask?CacheManager.task.currentTraceTask.task.code_I:0;
		let cutTaskInfo:any = ConfigManager.task.getByPk(curCode);					
		let dif:number = cutTaskInfo?tarTaskInfo.coutTask-cutTaskInfo.coutTask+1:tarTaskInfo.coutTask;
		return dif;
	}

	/**不能显示功能开启引导 */
	public static isNotShowGuide():boolean{
		return CacheManager.copy.isInCopy || CacheManager.map.isInMainCity;
	}


}
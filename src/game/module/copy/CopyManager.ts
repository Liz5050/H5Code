/**副本管理类 */
class CopyManager {
	private static _isInit:Boolean = true; 
	private static _instance:CopyManager;

	/**面板类注册池 根据副本类型*/
	private TYPE_CLS:Object;

	/**面板实例池 根据副本类型 */
	private TYPE_INST:Object;
	
	/**面板类注册池 根据副本code */
	private CODE_CLS:Object;
	/**面板实例池 根据副本code */
	private CODE_INST:Object;

	

	public constructor() {
		if(CopyManager._isInit)
		{
			throw new Error("CopyManager单例")
		}
		this.TYPE_CLS = {};
		this.TYPE_INST = {};
		this.CODE_CLS = {};
		this.CODE_INST = {};

	}
	public static get instance():CopyManager{
		if(!CopyManager._instance)
		{
			CopyManager._isInit = false;
			CopyManager._instance = new  CopyManager();
			CopyManager._isInit = true;
		}
		return CopyManager._instance
	}

	/**
	 * 初始化管理类
	 * 根据类型注册面板类,新增副本类型在该方法注册
	 * */
	public init():void{
		//有时间看看是否可以优化成多个副本用同一个类的,只实例化一个对象
		this.regCls(ECopyType.ECopyNormal,DemonCopyPanel,false);	
		this.regCls(ECopyType.ECopyMgRune,TowerCopyPanel,false);	
		this.regCls(ECopyType.ECopyMgNewExperience,ExpCopyPanel,false); 
		this.regCls(ECopyType.ECopyMgMaterial,MaterialCopyPanel,false); 
		this.regCls(ECopyType.ECopyMgPersonalBoss,PersonalBossCopyView,false);
		this.regCls(ECopyType.ECopyMgHideBoss,PersonalBossCopyView,false); //暗之秘籍刷出的隐藏BOSS
		this.regCls(ECopyType.ECopyMgNewWorldBoss,WorldBossCopyPanel,false);
		this.regCls(ECopyType.ECopyMgCrossGuildBossIntruder,WorldBossCopyPanel,false);
		this.regCls(ECopyType.ECopyMgSecretBoss,SecretBossCopyView,false);
		this.regCls(ECopyType.ECopyMgDarkSecretBoss,SecretBossCopyView,false);//暗之秘籍
		this.regCls(ECopyType.ECopyMgNewBossHome,WorldBossCopyPanel,false);
		this.regCls(ECopyType.ECopyMgBossLead,WorldBossCopyPanel,false);	
		this.regCls(ECopyType.ECopyMgWildBossEntranceLead,WorldBossCopyPanel,false);
		this.regCls(ECopyType.ECopyMgQiongCangAttic,QiongCangCopyView,false);
		this.regCls(ECopyType.ECopyMgQiongCangHall,QiongCangCopyView,false);
		this.regCls(ECopyType.ECopyMgNormalDefense,CopyDefendPanel,false); //守护神剑
		this.regCls(ECopyType.ECopyMgBloodMatrix,GuildCopyPanel2,false);
		this.regCls(ECopyType.ECopyMgRingBoss,GuildCopyPanel2,false);
		this.regCls(ECopyType.ECopyMgKingStife,KingBattleCopyView,false);
		this.regCls(ECopyType.ECopyEncounter,EncounterCopyView,false);
		this.regCls(ECopyType.ECopyPunchLead,PunchLeadCopyView,false);
		this.regCls(ECopyType.ECopyWorldBoss,TimeLimitBossCopyView,false);
		this.regCls(ECopyType.ECopyMgMining,MiningCopyView,false);
		this.regCls(ECopyType.ECopyMgMiningChallenge,MiningChallengeCopyView,false);
		this.regCls(ECopyType.ECopyPosition,ExpPositionOccupyView,false);
		this.regCls(ECopyType.ECopyBattleBich,CampBattleCopyView,false);
		this.regCls(ECopyType.ECopyMgNewGuildWar,GuildBattleCopyView,false);
		this.regCls(ECopyType.ECopyNewCrossBoss,CrossBossCopyView,false);
		this.regCls(ECopyType.ECopyLegend,LegendCopyView,false);
		this.regCls(ECopyType.ECopyMgQiongCangDreamland,QCFirylandCopyPanel,false);
		this.regCls(ECopyType.ECopyCrossTeam,CrossTeamCopyView,false);
		this.regCls(ECopyType.ECopyMgPeakArena,PeakArenaCopyView,false);
		this.regCls(ECopyType.ECopyGuildTeam,GuildTeamCopyView,false);
		this.regCls(ECopyType.ECopyMgBossIntruder,QiongCangCopyView,false);
		this.regCls(ECopyType.ECopyCrossStair,CrossStairCopyView,false);
		this.regCls(ECopyType.ECopyMgGuildDefense,GuildDefendPanel,false); //仙盟守护
		this.regCls(ECopyType.ECopyQualifying,QualifyingCopyView,false); //3v3
		this.regCls(ECopyType.ECopyCheckPoint,CheckPointBossCopyView,false); //关卡boss


		this.regCls(CopyEnum.CopyGhosts,GuildCopyPanel1,true);
		this.regCls(CopyEnum.CopyLeader,GuildCopyPanel2,true);	
		this.regCls(CopyEnum.CopyDisorderly,GuildCopyPanel2,true);
	}
	public regCls(typeOrCode:number,cls:any,isCode:boolean):void{
		if(isCode){
			this.CODE_CLS[typeOrCode] = cls;
		}else{
			this.TYPE_CLS[typeOrCode] = cls;
		}		
	}

	public unRegCls(typeOrCode:number,isCode:boolean):void{
		if(isCode){
			delete this.CODE_CLS[typeOrCode];
		}else{
			delete this.TYPE_CLS[typeOrCode];
		}	
		
	}


	public getCls(type:number,code:number):any{
		if(this.CODE_CLS[code]){
			return this.CODE_CLS[code];
		}
		return this.TYPE_CLS[type];
	}

	public regPanel(type:number,code:number,panel:BaseCopyPanel):void{
		var isCode:boolean = this.CODE_CLS[code]!=null;
		if(isCode){
			this.CODE_INST[code] = panel;
		}else{
			this.TYPE_INST[type] = panel;
		}
		
	}
	/**	 
	 * 根据类型获取副本面板实例
	 */
	public getPanel(type:number,code:number):BaseCopyPanel{
		var panel:BaseCopyPanel = this.TYPE_INST[type];
		return panel;
	}

	public unRegPanel(type:number):void{
		delete this.TYPE_INST[type];
	}

}
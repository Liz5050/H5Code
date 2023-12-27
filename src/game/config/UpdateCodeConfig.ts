/**更新原因配置 */
class UpdateCodeConfig extends BaseConfig {
	/**人物升级 */
	public static EUpdateCodeLevelUp:number = 1492;
	/**副本杀怪掉落 */
	private static EUpdateCodeByKillBossCopy:number = 362;
	/**红名玩家被杀掉落 */
	private static EUpdateCodeRedNameKilled:number = 1486;
	/**拾取物品 */
	private static EUpdateCodeByPikeItem:number = 361;
	/**Boss归属奖励 */
	private static EUpdateCodeBossOwnReward:number = 1669;
	/**副本扫荡 */
	private static EUpdateCodeDelegate:number = 815;
	/**秘籍 */
	private static EUpdateCodeCheats:number = 1687;
	/**符文塔转盘 */
	private static EUpdateCodeRuneCopyLottery:number = 1697;
	/**boss参与奖励 */
	private static EUpdateCodeBossJoinReward:number = 1618;
	/**Vip奖励 */
    public static EUpdateCodeVip:number = 1646;
	/**Vip礼包购买 */
    public static EUpdateCodeVipGiftPackage:number = 1677;


	/**是否是需要延时显示战斗力动画的code */
	private static DelayCombatCodes:number[] = [
		UpdateCodeConfig.EUpdateCodeCheats
	];

	private static DelayCombatCodesMs:any = {
		[UpdateCodeConfig.EUpdateCodeCheats]:3200,
	};
	/**获取物品 需要延时的提示的毫秒 */
	private static DelayTipsCodesMs:any = {
		[UpdateCodeConfig.EUpdateCodeRuneCopyLottery]:4000,
	};
	private static DELAY_TIPS_CODE:number[] = [
		UpdateCodeConfig.EUpdateCodeRuneCopyLottery,
	];

	private static EquipTipsCodes:number[] = [
		UpdateCodeConfig.EUpdateCodeByKillBossCopy,
		UpdateCodeConfig.EUpdateCodeBossJoinReward,
		UpdateCodeConfig.EUpdateCodeByPikeItem,
		UpdateCodeConfig.EUpdateCodeDelegate,
		UpdateCodeConfig.EUpdateCodeBossOwnReward,
	];

	

	private static SceneCodes:number[] = [
		UpdateCodeConfig.EUpdateCodeByKillBossCopy,
		UpdateCodeConfig.EUpdateCodeRedNameKilled,
		UpdateCodeConfig.EUpdateCodeByPikeItem
		];
		

	/**神装合成更新 */
	private EUpdateCodeGenerateGodEquip:number = 1624;

	public constructor() {
		super("t_update_code", "updateCode");
		 
	}

	public isShow(code: number): boolean {
		let cfg: any = this.getByPk(code);
		return cfg != null && cfg.isShow == 1;
	}
	/**来自场景掉落的物品 */
	public isFromScene(code: number):boolean{
		var flag:boolean = UpdateCodeConfig.SceneCodes.indexOf(code)>=0;		
		return flag;
	}
	/**是否是需要飘红装提示来源 */
	public isEquipTips(code: number):boolean{
		var flag:boolean = UpdateCodeConfig.EquipTipsCodes.indexOf(code)>=0;		
		return flag; 
	}

	/**是否秘境 */
	public isCheats(code:number):boolean{	
		return UpdateCodeConfig.EUpdateCodeCheats==code;
	}

	public isDelayCombatCode(code:number):boolean{
		return UpdateCodeConfig.DelayCombatCodes.indexOf(code)>-1;
	}
	/**战力动画延时时长 */
	public getDelayCombatMs(code:number):number{
		let ms:number = UpdateCodeConfig.DelayCombatCodesMs[code];
		!ms?ms = 0:null;
		return ms;
	}

	/**是否是需要延时物品提示的code */
	public isDelayTipCode(code:number):boolean{
		return UpdateCodeConfig.DELAY_TIPS_CODE.indexOf(code)>-1;
	}

	public getDelayTipsCodesMs(code:number):number{
		let ms:number = UpdateCodeConfig.DelayTipsCodesMs[code];
		!ms?ms = 0:null;
		return ms;
	}

	/**是否神装合成updatecode */
	public isGodEquipCode(code:number):boolean{
		return code==this.EUpdateCodeGenerateGodEquip;
	}


}
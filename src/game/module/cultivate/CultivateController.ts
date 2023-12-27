/**
 * 养成系统
 */

class CultivateController extends BaseController {
	public constructor() {
		super(ModuleEnum.Cultivate);
	}

	public addListenerOnInit(): void{
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameCultivateInfo], this.onCultivateInfo, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameCultivateActiveRet], this.OnActiveRet, this);
		ECmdGame.ECmdGameCultivateActive
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateIllustratedWarfare], this.onIllustratedWarfareUpdate, this);
		
	}

	/**
	 * 养成系统信息 
	 * @param data S2C_SCultivateInfo
	 * @param key_I pos
	 * @param value_I level
	 */
	private onCultivateInfo(data: any): void{
		let info: any = CacheManager.cultivate.cultivateInfo;
		let levelInfo: any;
		let typeDic:any = {};
		if(data.infos.length > 0) {
			for(let d of data.infos){
				// levelInfo = {};
				// if(d.levelInfo && d.levelInfo.key_I.length > 0){
				// 	for(let i = 0; i < d.levelInfo.key_I.length; i++){
				// 		levelInfo[d.levelInfo.key_I[i]] = d.levelInfo.value_I[i];
				// 	}
				// }
				if(d.levelInfo) {
					levelInfo = StructUtil.dictIntIntToDict(d.levelInfo);
				} else {
					levelInfo = {};
				}
				if(info[d.roleIndex] == null){
					info[d.roleIndex] = {};
				}				
				d.levelInfo = levelInfo;
				info[d.roleIndex][d.cultivateType] = d;
				typeDic[d.cultivateType] = true;
			}
		}

		if(typeDic[ECultivateType.ECultivateTypeKill]) {
			EventManager.dispatch(NetEventEnum.CultivateInfoUpdateKill);
		}
		if(typeDic[ECultivateType.ECultivateTypeStrengExAccessory]) {
			EventManager.dispatch(NetEventEnum.CultivateInfoUpdateStrengExAccessory);
		}
		if(typeDic[ECultivateType.ECultivateTypeIllustrated]) {
			EventManager.dispatch(NetEventEnum.CultivateInfoUpdateIllustrated);
		}
		if(typeDic[ECultivateType.ECultivateTypeImmortals]) {
			EventManager.dispatch(NetEventEnum.CultivateInfoUpdateImmortal);
		}
		if(typeDic[ECultivateType.ECultivateTypeForeverEquip]) {
			EventManager.dispatch(NetEventEnum.CultivateInfoUpdateAncientEquip);
		}
		if(typeDic[ECultivateType.ECultivateTypeHeartMethod]) {
			EventManager.dispatch(NetEventEnum.CultivateInfoUpdateHeartMethod);
		}
		if(typeDic[ECultivateType.ECultivateTypeTalent]) {
			EventManager.dispatch(NetEventEnum.CultivateInfoUpdateTalent);
		}
	}

	private OnActiveRet(data:any) : void {
		if(data.cultivateType_I == ECultivateType.ECultivateTypeHeartMethod) {
			EventManager.dispatch(NetEventEnum.CultivateInfoActiveHeartMethod);
		}
	}

	/**
	 * 图鉴战力更新
	 */
	private onIllustratedWarfareUpdate(data:any):void {
		CacheManager.cultivate.updateCultivateFight(ECultivateType.ECultivateTypeIllustrated,data.value_I);
	}
}
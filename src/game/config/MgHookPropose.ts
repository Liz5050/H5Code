/** mapId,bossCode 主键   */
class MgHookPropose extends BaseConfig {
	public constructor() {
		super("t_mg_hook_propose", "mapId,bossCode");
	}

	public getProposes(mapId: number, bossCode: number = -1): Array<any> {
		let proposes: Array<any> = [];
		let dict: any = this.getDict();
		let propose: any;
		for (let key in dict) {
			propose = dict[key];
			if (propose.mapId == mapId && (bossCode == -1 || bossCode == propose.bossCode)) {
				if(propose.desc != null && propose.desc != ""){
					propose.desc = propose.desc.replace(/<br>/gi, "\n");
				}
				proposes.push(propose);
			}
		}
		return proposes;
	}

	/**
	 * 获取最优挂机点。
	 * 等级达到进入地图需要等级，等级和防御力最接近怪最高要求
	 */
	public getBestPropose(): any {
		let bestPropose: any;
		let bestProposeMapLevel: number;
		let dict: any = this.getDict();
		let propose: any;
		let roleLevel: number = CacheManager.role.getRoleLevel();
		let roleDefense: number = (Number(CacheManager.role.fightAttr.physicalDefense_I) + Number(CacheManager.role.fightAttr.magicDefense_I));
		let mapInfo: MapInfo;
		let mapLevel: number;
		let boss: any;
		for (let key in dict) {
			propose = dict[key];
			mapInfo = ConfigManager.map.getMapInfo(propose.mapId);
			if (mapInfo.sourceData == null) {
				continue;
			}
			mapLevel = mapInfo.getByKey("needLevel");
			boss = ConfigManager.boss.getByPk(propose.bossCode);
			if (roleLevel >= mapLevel && roleLevel >= propose.proposeLevel) {
				if (bestPropose == null) {
					bestPropose = propose;
					bestProposeMapLevel = mapLevel;
				} else {
					if (propose.proposeLevel > bestPropose.proposeLevel) {
						if (roleDefense < propose.proposeDefense || propose.proposeDefense > bestPropose.proposeDefense) {
							bestPropose = propose;
							bestProposeMapLevel = mapLevel;
						}
					}
				}
			}
		}
		return bestPropose;
	}
}
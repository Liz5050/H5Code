/**
 * 养成系统
 */

class CultivateProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 养成系统部位激活（升级)
	 * @param cultivateType 系统
	 * @param position 部位
	 * @param level 等级
	 * @param roleIndex 索引
	 * @param cmdType 命令类型 0-部位升级 激活 1-部位替换
	 */
	public cultivateActive(cultivateType: number, position: number, level: number, roleIndex: number): void {
		this.send("ECmdGameCultivateActive", { "cultivateType": cultivateType, "position": position, "level": level, "roleIndex": roleIndex});
	}

	public heartMethondActiveLevelup(cultivateType: number, position: number, level: number, roleIndex: number): void {
		this.send("ECmdGameCultivateActive", { "cultivateType": cultivateType, "position": position, "level": level, "roleIndex": roleIndex, "cmdType" : 0});
	}

	public heartMethondReplace(cultivateType: number, position: number, level: number, roleIndex: number): void {
		this.send("ECmdGameCultivateActive", { "cultivateType": cultivateType, "position": position, "level": level, "roleIndex": roleIndex, "cmdType" : 1});
	}

	/**
	 * 天赋升级
	 */
	public talentUpgrade(cultivateType: number, position: number, roleIndex: number): void{
		this.send("ECmdGameCultivateActive", { "cultivateType": cultivateType, "position": position, "roleIndex": roleIndex, "cmdType" : 0});
	}

	/**
	 * 天赋装备镶嵌
	 * @param cmdType 命令类型 0-部位升级 激活 1-部位替换
	 * @param itemCode 装备code
	 */
	public talentEquipInlay(cultivateType: number, position: number, roleIndex: number, cmdType: number, itemCode: number): void{
		this.send("ECmdGameCultivateActive", { "cultivateType": cultivateType, "position": position, "roleIndex": roleIndex, "cmdType": cmdType, "extNum": itemCode});
	}

	/**
	 * 天赋技能升级
	 * @param skillId 待升级技能id
	 */
	public talentSkillUpgrade(roleIndex: number, skillId: number): void{
		this.send("ECmdGameTalentSkillUpgrade", {"roleIndex": roleIndex, "skillId": skillId});
	}

	/**
	 * 天赋技能点重置
	 */
	public talentSkillReset(roleIndex: number): void{
		this.send("ECmdGameTalentSkillReset", {"roleIndex": roleIndex});
	}

	/**
	 * 分解图鉴碎片
	 * @param uid 待分解道具uid
	 * @param amount 待分解道具数量
	 * @param posType 背包类型
	 */
	public decomposeItem(uid:string, amount:number, posType:EPlayerItemPosType = EPlayerItemPosType.EPlayerItemPosTypeProp): void {
		let dic = {"key_S": [uid], "value_I": [amount]}
		this.send("ECmdGameDecomposeItem", { "posType": posType , "mapUid": dic});
	}

	public decomposeMethod(uids: Array<string>, amounts: Array<number>, posType:EPlayerItemPosType = EPlayerItemPosType.EPlayerItemPosTypeProp): void {
		let dic = {"key_S": uids, "value_I": amounts}
		this.send("ECmdGameDecomposeItem", { "posType": posType , "mapUid": dic});
	}


	
	/**
	 * 神兵操作 C2S_SImmortalsCmd
	 * @param roleIndex 
	 *@param cmdtype EImmortalCmd 1-解锁 2-使用 3-取消使用 4-替换
	 *@param subtype 对应的神兵
	 * */
	public immortalsOpt(roleIndex:number,cmdtype:EImmortalCmd,subtype:number):void{
		this.send("ECmdGameImmortalsCmd",{roleIndex:roleIndex,cmdtype:cmdtype,subtype:subtype});
	}



}
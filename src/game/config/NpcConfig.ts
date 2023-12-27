/**Npc配置 */
class NpcConfig extends BaseConfig {
	public constructor() {
		super("t_npc", "npcId");
	}

	/**获取Npc模型资源ID */
	public getModelId(npcId: number): string {
		return this.getByPk(npcId).modelId;
	}
}
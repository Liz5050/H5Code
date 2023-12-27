/**
 * 任务地点。包含接任务点、执行任务点、提交任务点
 * 优先使用npc
 */
class TaskPoint {
	public npcId: number = -1;
	public mapId: number;
	public x: number;
	public y: number;

	public constructor() {
	}
}
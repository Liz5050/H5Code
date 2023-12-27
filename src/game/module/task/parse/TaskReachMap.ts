/**
 * 到达地图
 * contents[0] - 地图
	contents[1] - x
	contents[2] - y（若x,y坐标为0,表示只需进入该地图就可完成任务）
	contents[3] - 刷怪方案编号（目前只用于刺探寻宝任务）
    "contents":[目标地图id,坐标x,坐标y,0]
 */
class TaskReachMap extends TaskBase {

    /**执行任务 */
    public executeTask(isConvey: boolean = false): void {
        let mapId: number = this.processContent[0];
        let x: number = this.processContent[1];
        let y: number = this.processContent[2];
        EventManager.dispatch(LocalEventEnum.SceneRouteToGrid, { "mapId": mapId});
    }
}
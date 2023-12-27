/**
 * 客户端任务配置
 */
class TaskClientConfig {
	private static dataDict:any;

	/**
	 * 获取任务对话
	 */
	public static getTaskTalk(taskCode:number, status:ETaskStatus):string{
		return TaskClientConfig.getDict()["task_talk"][taskCode + "_" + status];
	}

	private static getDict(): any {
		if (TaskClientConfig.dataDict == null) {
			TaskClientConfig.dataDict = RES.getRes("task_config_json");
		}
		return TaskClientConfig.dataDict;
	}
}
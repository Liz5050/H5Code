/**
 * 主界面返回拦截器
 */
class HomeReturnInterceptor {

	public constructor() {
	}

	/**
	 * 拦截
	 * @returns true拦截执行返回后续操作
	 */
	public static intercept(key: ModuleEnum): boolean {
		let isIntercept: boolean = false;
		switch (key) {
			case ModuleEnum.Team:
				// if (CacheManager.team.captainIsMe) {
					AlertII.show(LangLegend.LANG1, null, (type:AlertType)=>{
						if (type == AlertType.YES) {
                            EventManager.dispatch(LocalEventEnum.ExitTeam);
						}
					});
                    isIntercept = true;
				// }
				break;
		}
		return isIntercept;
	}
}
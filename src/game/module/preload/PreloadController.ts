/**
 * 通用体验预加载
 * 可以统一做预加载的控制管理
 * 1. 欢迎页的预加载：client_config.json的welcome_preload
 * 2. 根据等级的预加载：client_config.json的level_preload
 * 3. 根据任务预加载：client_config.json的task_preload
 */
class PreloadController extends BaseController {

    private curLevel: number = 0;

    public constructor() {
        super(ModuleEnum.Preload);
    }

    /** 欢迎页的预加载 */
    public welcomePreload(): void {
        if (CacheManager.role.role && CacheManager.role.role.career_I != null) {
            let roleCareer: number = CacheManager.role.getRoleCareer();
            let roleBaseCareer: number = CareerUtil.getBaseCareer(roleCareer);
            let preloadArr: Array<string> = ConfigManager.client.getWelcomePreload(roleBaseCareer.toString());
            let framExc: FrameExecutor = new FrameExecutor(2); //分帧处理
            for (let i: number = preloadArr.length - 1; i >= 0; i--) {
                let item: string = preloadArr[i];
                if (!App.StringUtils.isEmptyStr(item)) {
                    framExc.regist(() => {
                        if (this.isUrlRes(item)) {
                            App.LoaderManager.getResByUrl(item);
                        } else {
                            App.LoaderManager.getModelResByUrl(item);
                        }
                    }, this);
                }
            }
            framExc.execute();
        }
    }

    public preloadNewbieNecessary(): void {
		let framExc: FrameExecutor = new FrameExecutor(2);
		let newbieNecessaryArr: Array<string> = [PackNameEnum.TaskDialog, PackNameEnum.Home, PackNameEnum.MCFightFire, PackNameEnum.MCCheckPointFull, PackNameEnum.GuildePanel,
		PackNameEnum.MCTaskGet, PackNameEnum.MCTaskEnd, PackNameEnum.MCTaskComplete];
		for (let item of newbieNecessaryArr) {
			framExc.regist(function () {
				ResourceManager.load(item);
			}, this);
		}
		framExc.execute();
	}

    public addListenerOnInit(): void {
        this.addListen1(NetEventEnum.roleLevelUpdate, this.onRoleLevel, this);
        this.addListen0(LocalEventEnum.TaskFinished, this.onTaskFinished, this);
    }

    /** 主角升级 */
    private onRoleLevel(data: any = null): void {
        let levelNum: number = data.cur;
        this.curLevel = levelNum;
        if (this.isEnable()) {
            return;
        }

        if (CacheManager.role.role && CacheManager.role.role.career_I != null) {
            let roleCareer: number = CacheManager.role.getRoleCareer();
            let roleBaseCareer: number = CareerUtil.getBaseCareer(roleCareer);
            let preloadArr: Array<string> = ConfigManager.client.getLevelPreload(levelNum.toString(), roleBaseCareer.toString());
            let framExc: FrameExecutor = new FrameExecutor(2); //分帧处理
            for (let item of preloadArr) {
                if (!App.StringUtils.isEmptyStr(item)) {
                    framExc.regist(() => {
                        if (this.isUrlRes(item)) {
                            App.LoaderManager.getResByUrl(item);
                        } else {
                            App.LoaderManager.getModelResByUrl(item);
                        }
                    }, this);
                }
            }
            framExc.execute();
        }
    }

    /** 任务完成 */
    private onTaskFinished(taskNum: number = 0): void {
        if (this.isEnable()) {
            return;
        }

        if (CacheManager.role.role && CacheManager.role.role.career_I != null) {
            let roleCareer: number = CacheManager.role.getRoleCareer();
            let roleBaseCareer: number = CareerUtil.getBaseCareer(roleCareer);
            let preloadArr: Array<string> = ConfigManager.client.getTaskPreload(taskNum.toString(), roleBaseCareer.toString());
            let framExc: FrameExecutor = new FrameExecutor(2); //分帧处理
            for (let item of preloadArr) {
                if (!App.StringUtils.isEmptyStr(item)) {
                    framExc.regist(() => {
                        if (this.isUrlRes(item)) {
                            App.LoaderManager.getResByUrl(item);
                        } else {
                            App.LoaderManager.getModelResByUrl(item);
                        }
                    }, this);
                }
            }
            framExc.execute();
        }
    }

    private isEnable(): boolean {
        return this.curLevel > ConfigManager.client.getPreloadEnabled();
    }

    /**是否为url资源 */
    private isUrlRes(url: string): boolean {
        return url.indexOf(".") != -1;
    }
}
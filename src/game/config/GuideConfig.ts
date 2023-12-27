/**
 * 指引配置
 */
class GuideConfig extends BaseConfig {
    // private dataDict: any;

    public constructor() {
        super("t_mg_guide", 'id');
    }

    /**
     * 根据任务获取指引信息。
     * 一个任务可以对应多个指引
     */
    // public getByTask(taskCode: number): Array<GuideInfo> {
    // 	let guideInfos: Array<GuideInfo> = [];
    // 	let dict: any = this.getDict();
    // 	for (let key in dict) {
    // 		if (key.indexOf(taskCode.toString()) != -1) {
    // 			guideInfos.push(this.getGuideInfo(key));
    // 		}
    // 	}
    // 	return guideInfos;
    // }

    /**
     * 任务是否有指引
     */
    public isHadGuide(taskCode: number): boolean {
        let dict: any = this.getDict();
        for (let key in dict) {
            if (key.indexOf(taskCode.toString()) != -1) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取一个任务的指引信息
     */
    public getGuideInfo(taskCode: number, status: ETaskStatus): GuideInfo {
        let key: string = taskCode + "_" + status;
        let guideInfo: GuideInfo = new GuideInfo(key);
        let dict: any = this.getDict();
        let cfg: any;
        for (let id in dict) {
            cfg = dict[Number(id)];
            if (cfg.taskCode == taskCode && cfg.taskStatus == status) {
                let guideStepInfo: GuideStepInfo = new GuideStepInfo(key, cfg);
                guideStepInfo.taskKey = key;
                guideStepInfo.taskCode = taskCode;
                guideInfo.steps.push(guideStepInfo);
            }
        }
        //按步骤排序
        guideInfo.steps.sort(function (a: GuideStepInfo, b: GuideStepInfo): number {
            return a.step - b.step;
        });
        return guideInfo;
    }

    /**
     * 获取一个指引步骤
     */
    public getGuideStepInfo(id: number): GuideStepInfo {
        let cfg: any = this.getByPk(id);
        let key: string = cfg.taskCode + "_" + cfg.taskStatus;
        let guideStepInfo: GuideStepInfo = new GuideStepInfo(key, cfg);
        guideStepInfo.taskKey = key;
        guideStepInfo.taskCode = cfg.taskCode;
        return guideStepInfo;
    }
}
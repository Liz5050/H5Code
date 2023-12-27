class ChangeCareerConfig {
    public static COST_ONEKEY:number = 1000;

    private roleStateCfg:RoleStateConfig;
    private careerChapterCfg:BaseConfig;
    private stateDict: any;
    private chapterDict: any;

    public constructor(){
        this.roleStateCfg = ConfigManager.roleState;
        this.careerChapterCfg = new BaseConfig("t_change_career", "roleState,roleSubState");
    }

    /**
     * 获取转职配置
     * @param {number} state
     * @param {number} career
     * @returns {ChangeCareerStateData}
     */
    public getStateData(state:number, career:number):ChangeCareerStateData {
        if (!this.stateDict) {
            this.makeStateDict();
        }
        return this.stateDict[state][career];
    }

    private makeStateDict():void {
        this.stateDict = {};
        let state:number;
        let career:number;
        let data:any;
        let vo:ChangeCareerStateData;
        for (let i = 0; i < 3; i++) {
            state = i;
            this.stateDict[state] = [];
            for (let j = 1; j <= 2; j++) {
                career = j;
                data = this.roleStateCfg.getByPk(state + "," + career);
                if (data.title && data.title != "") {
                    vo = new ChangeCareerStateData(data);
                    this.stateDict[state][career] = vo;
                }
            }
        }
    }

    /**
     * 获取章节配置
     * @param {number} state
     */
    public getChapterData(state:number):Array<ChangeCareerChapterData> {
        if (!this.chapterDict) {
            this.makeChapterDict();
        }
        return this.chapterDict[state];
    }

    private makeChapterDict():void {
        this.chapterDict = {};
        let state:number;
        let subState:number;

        let dataDict:any = this.careerChapterCfg.getDict();
        let data:any;
        for (let key in dataDict) {
            data = dataDict[key];
            state = data.roleState || 0;
            subState = data.roleSubState;
            if (!subState) continue;
            if (!this.chapterDict[state]) {
                this.chapterDict[state] = [];
            }
            this.chapterDict[state].push(new ChangeCareerChapterData(data));
        }
    }
}
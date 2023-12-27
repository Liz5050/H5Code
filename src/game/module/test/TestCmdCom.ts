class TestCmdCom extends fairygui.GComponent {
	private petStageInput: fairygui.GTextInput;
	private txt_number:fairygui.GTextInput;
    private preloadBtn: fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.getChild("btn_shape_submit").addClickListener(this.clickSubmitShape, this);
		this.getChild("btn_formatNum").addClickListener(this.formatNumberHandler, this);
		this.preloadBtn = this.getChild("btn_checkpreload").asButton;
        this.preloadBtn.addClickListener(this.checkPreload, this)
		this.txt_number = this.getChild("txt_number").asCom.getChildAt(1).asTextInput;
	}

	public updateAll(): void {

	}

	private clickSubmitShape(): void {
		let star: number = this.getTextNumberValue("txt_shape_star");
		let type: number = Number(this.getChild("combo_shape_type").asComboBox.value);
		let roleIndex: number = Number(this.getChild("combo_shape_roleIndex").asComboBox.value);
		if (type == EShape.EShapeWing) {
			ProxyManager.test.exeCmd(257, [8, star, roleIndex]);
		} else {
			ProxyManager.test.exeCmd(13, [type, star, roleIndex]);
		}
	}

	private formatNumberHandler():void {
		let num:number = Number(this.txt_number.text);
		this.txt_number.text = App.MathUtils.formatNum2(num);
	}

	private checkPreload():void {
		if (this.preloadBtn.title == "检查中...") return;
        this.preloadBtn.title = "检查中...";
        let welcomePreload:any = ConfigManager.client.getByKey("welcome_preload");
        let levelPreload:any = ConfigManager.client.getByKey("level_preload");
        let taskPreload:any = ConfigManager.client.getByKey("task_preload");
        let preLoadUrls:string[] = [];
        let kCareers:number[] = [1, 2, 4];
        for (let career of kCareers) {
        	if (!welcomePreload[career] || !welcomePreload[career].length) {
        		AlertII.show(`WelCome Preload配置出错,职业${career}`);
        		return;
            }
            preLoadUrls = preLoadUrls.concat(welcomePreload[career]);
		}
		for (let k in levelPreload) {
        	let lp = levelPreload[k];
            for (let career of kCareers) {
                if (!lp[career] || !lp[career].length) {
                    AlertII.show(`Level Preload配置出错,等级${k}, 职业${career}`);
                    return;
                }
                preLoadUrls = preLoadUrls.concat(lp[career]);
            }
		}
        for (let k in taskPreload) {
        	if (!ConfigManager.task.getByPk(k)) {
                AlertII.show(`Task Preload配置出错,任务ID${k},没有此任务ID`);
                return;
			}
            let tp = taskPreload[k];
            for (let career of kCareers) {
                if (!tp[career] || !tp[career].length) {
                    AlertII.show(`Task Preload配置出错,任务ID${k}, 职业${career}`);
                    return;
                }
                preLoadUrls = preLoadUrls.concat(tp[career]);
            }
        }
        let loadLen:number = preLoadUrls.length;
        loadNext(null, this.preloadBtn);

		function loadNext(compUrl:string, btn:any) {
        	if (compUrl) {
                if (compUrl.indexOf(".") == -1) {
					if (!CacheManager.res.getModelCache(compUrl)) {
                        AlertII.show(`Preload配置出错, 资源${compUrl}`);
                        return;
					}
                } else if (!App.LoaderManager.getCache(compUrl)) {
                    AlertII.show(`Preload配置出错, 资源${compUrl}`);
                    return;
				}
			}

			if (preLoadUrls.length) {
                let url = preLoadUrls.pop();
                if (url.indexOf(".") == -1) {
                    let res = App.LoaderManager.getModelResByUrl(url, loadNext, null, ELoaderPriority.TOP, [url, btn]);
                    if (res) loadNext(url, btn);
                } else {
                    App.LoaderManager.getResByUrl(url, loadNext, null, ELoaderPriority.TOP, [url, btn]);
                }
			} else {
                btn.title = "检查预加载";
                AlertII.show(`Preload配置检查完成,${loadLen}个资源加载无误`);
			}
		}
	}

	private getTextStringValue(name: string): string {
		return this.getChild(name).asCom.getChildAt(1).asTextInput.text;
	}

	private getTextNumberValue(name: string): number {
		return Number(this.getChild(name).asCom.getChildAt(1).asTextInput.text);
	}
}
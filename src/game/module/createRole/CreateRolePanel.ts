class CreateRolePanel extends BaseTabPanel {
    /**app未初始化完前点击了创角按钮，等app初始化完成后自动创角 */
    private static isHasClickCreate: boolean;
    private bgLoader: GLoader;
    private nameCom: fairygui.GComponent;
    private nameTxt: fairygui.GRichTextField;
    private nameInput: NumberInput;
    private selectNameBtn: fairygui.GButton;
    private roleController: fairygui.Controller;
    private sex: number = 1;
    private selectCareer: number = 1;
    private loaderDict: { [career: number]: GLoader };
    private createGroup: fairygui.GGroup;
    private mc: UIMovieClip;
    private createBtn: fairygui.GButton;
    private careers: Array<number>;
    private isNameInit: boolean;
    private randomName: string;
    private inputName: string;
    private autoSeconds: number = 20000;//x秒后自动创建

    public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
        super(view, controller, index);
    }

    public initOptUI(): void {
        this.careers = [1, 2, 4];
        this.loaderDict = {};
        this.bgLoader = <GLoader>this.getGObject("loader_bg");
        this.nameInput = <NumberInput>this.getGObject("input_name");
        this.selectNameBtn = this.getGObject("btn_random").asButton;
        this.roleController = this.view.getController("c1");
        this.createBtn = this.getGObject("btn_create").asButton;
        App.TimerManager.doDelay(1000, () => {
            this.mc = UIMovieManager.get(PackNameEnum.MCStartGame1, -28, -109);
            this.createBtn.addChild(this.mc);
        }, this)
        this.getGObject("btn_random").addClickListener(this.clickRandomBtn, this);
        this.createBtn.addClickListener(this.clickCreateRoleBtn, this);
        this.getGObject("btn_return").addClickListener(this.clickReturnBtn, this);
        //上线版本屏蔽返回
        // this.getGObject("btn_return").visible = !Sdk.IsOnlineVersion;
        this.getGObject("btn_return").visible = false;

        this.roleController.addEventListener(fairygui.StateChangeEvent.CHANGED, this.changeRole, this);
        this.nameInput.addEventListener(egret.Event.CHANGE, this.onChanged, this);
        // this.bgLoader.load(URLManager.getModuleImgUrl("bg.jpg", PackNameEnum.CreateRole));

        let loader: GLoader;
        for (let career of this.careers) {
            loader = <GLoader>this.getGObject("loader_role_" + career);
            this.loaderDict[career] = loader;
            loader.addEventListener(GLoader.RES_READY, this.onRoleLoaded, this);
        }
        this.nameCom = this.getGObject("com_name").asCom;
        this.createGroup = this.getGObject("group_create").asGroup;
        this.createGroup.visible = true;
    }

    public updateAll(): void {
        //移除php页面的div
        // Sdk.SdkToShowGame(); //移到this.onRoleLoaded
        Sdk.SdkToShowLoadProgress(0, "");

        if (!CreateRoleController.isModuleShow) {
            CreateRoleController.isModuleShow = true;
            this.roleController.selectedIndex = Sdk.createRoleSelectIndex;
            this.randomRoleName(true);
            //5. "show_create_role" //(H5)显示创角界面
            if (Sdk.is_new) {
                Sdk.logStep(Sdk.LogStepNew[5]);
                // Sdk.logStep(Sdk.LogPreloadStep[9]);
            }
            this.startAutoCreateTimer();
        }

        if (!App.isInit) {
            Main.gameStart.start_load_game();
            return;
        }
        App.TimerManager.doDelay(1000, this.preloadCommon, this);
        if (!this.isNameInit) {
            this.showRandomName();
            this.isNameInit = true;
        }
        // this.createGroup.visible = true;
        // this.createGroup.y = fairygui.GRoot.inst.height;
        // egret.Tween.get(this.createGroup).to({y: fairygui.GRoot.inst.height - 350}, 500, egret.Ease.backIn);
        // App.TimerManager.doDelay(200, this.preloadStartStoty, this);
        // console.log("2次读条: 创角界面打开");
        if (Sdk.is_new) {
            App.TimerManager.doDelay(2000, this.preloadConfig, this);
        }
    }

    public clearRoleLoader(): void {
        for (let career of this.careers) {
            this.loaderDict[career].clear();
        }
    }

    private startAutoCreateTimer(): void {
        App.TimerManager.remove(this.autoCreateRole, this);
        App.TimerManager.doDelay(this.autoSeconds, this.autoCreateRole, this);
    }

    /**
     * 打开界面，静默加载Common
     */
    private preloadCommon(): void {
        ResourceManager.load(PackNameEnum.Common, UIManager.getPackNum(PackNameEnum.Common), new CallBack(() => {
            // if (Sdk.is_new) {
            //     Sdk.logStep(Sdk.LogPreloadStep[10]);
            // }
            CreateRoleModule.isCommonLoaded = true;
            //在创角界面，静默加载完common后，也加载导航包、Home包
            let framExc: FrameExecutor = new FrameExecutor(2);
            let newbieNecessaryArr: Array<string> = [PackNameEnum.Navbar, PackNameEnum.Home];
            for (let item of newbieNecessaryArr) {
                framExc.regist(function () {
                    ResourceManager.load(item, UIManager.getPackNum(item));
                }, this);
            }
            framExc.regist(() => {
                this.clickGoOnEnter();
            }, this);
            framExc.execute();
        }, this));
    }

    /**
     * 打开界面，静默加载StartStory
     */
    private preloadStartStoty(): void {
        ResourceManager.load(PackNameEnum.StartStory);
    }

    /**
     * 打开界面，静默加载配置
     */
    private preloadConfig(): void {
        var groupName: string = "preload_new";
        var subGroups: Array<string> = ["preload_config"];
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadCompleteNew, this.onResourceLoadProgressNew, this);
    }

    private onResourceLoadCompleteNew(groupName: string): void {
        // if (Sdk.is_new) {
        //     Sdk.logStep(Sdk.LogPreloadStep[11]);
        // }
        CreateRoleController.isSecondPreloadDone = true;
    }

    private onResourceLoadProgressNew(itemsLoaded: number, itemsTotal: number, itemName: string = ""): void {
    }

    /**
     * 点击随机按钮
     */
    private clickRandomBtn(): void {
        this.randomRoleName(true);
    }

    /**
     * 更换角色
     */
    private changeRole(): void {
        let isNeedRandom: boolean = this.nameInput.text == this.randomName;//没有手动改名字
        this.randomRoleName(isNeedRandom);
    }

    private randomRoleName(isNeedRandom: boolean): void {
        this.startAutoCreateTimer();
        if (isNeedRandom) {
            this.nameInput.text = "";
        }
        App.SoundManager.stopTalk();
        let randomName: string;
        if (this.roleController.selectedIndex == 0) {
            randomName = App.RandomUtils.randomArray(RandName.firstNames) + App.RandomUtils.randomArray(RandName.secondWoman0) + App.RandomUtils.randomArray(RandName.secondWoman1);
            this.sex = 2;
            this.selectCareer = 2;
        } else if (this.roleController.selectedIndex == 1) {
            randomName = App.RandomUtils.randomArray(RandName.firstNames) + App.RandomUtils.randomArray(RandName.secondMan0) + App.RandomUtils.randomArray(RandName.secondMan1);
            this.sex = 1;
            this.selectCareer = 1;
        } else if (this.roleController.selectedIndex == 2) {
            randomName = App.RandomUtils.randomArray(RandName.firstNames) + App.RandomUtils.randomArray(RandName.secondWoman0) + App.RandomUtils.randomArray(RandName.secondWoman1);
            this.sex = 2;
            this.selectCareer = 4;
        }
        this.randomName = randomName;
        if (isNeedRandom) {
            this.nameInput.text = randomName;
        }
        this.loaderDict[this.selectCareer].visible = true;
        this.loaderDict[this.selectCareer].load(URLManager.getModuleImgUrl(`img_role_${this.selectCareer}.jpg`, PackNameEnum.CreateRole));

        //预加载头像
        App.LoaderManager.getResByUrl(URLManager.getPlayerHead(this.selectCareer));
    }

    private clickReturnBtn(): void {
        EventManager.dispatch(UIEventEnum.CreateReturn);
    }

    /**app初始化完成 */
    public onAppInited(): void {
        this.clickGoOnEnter();
    }

    public clickCreateRoleBtn(): void {
        if (Sdk.is_new) {
            Sdk.logStep(Sdk.LogPreloadStep[12]);
        }
        if (!App.isInit || !App.Socket.isConnecting() || !CreateRoleModule.isCommonLoaded) {
            CreateRolePanel.isHasClickCreate = true;
            return;
        }
        //关闭预加载定时器
        App.TimerManager.remove(this.preloadConfig, this);

        ResourceManager.load(PackNameEnum.Common, UIManager.getPackNum(PackNameEnum.Common), new CallBack(this.onCommonLoadComplete, this));
    }

    private onChanged(): void {
        // if (App.StringUtils.getStringLength(this.nameInput.text.toString()) > 7) {
        //     this.nameInput.text = this.nameInput.text.toString().slice(0, 7);
        //     this.nameInput.requestFocus();
        // }
        this.inputName = this.nameInput.text;
        this.startAutoCreateTimer();
    }

    private clickGoOnEnter(): void {
        if (CreateRolePanel.isHasClickCreate) {
            this.clickCreateRoleBtn();
            CreateRolePanel.isHasClickCreate = false;
        }
    }

    private onCommonLoadComplete(): void {
        CreateRoleModule.isCommonLoaded = true;
        let name: string = this.nameInput.text.trim();
        if (name.length == 0) {
            Tip.showTip("名称不能为空");
            return;
        }
        // if (App.StringUtils.getStringLength(name) > 7 || name.indexOf(" ") != -1 || ConfigManager.chatFilter.isHasSensitive(name)) {
        if (App.StringUtils.getStringLength(name) > 7 || name.indexOf(" ") != -1) {
            Tip.showTip("名称不能超过7个字，不能包含空格和敏感词");
            return;
        }
        ProxyManager.createRole.createRole(name, 1, this.sex, this.selectCareer, "", "", "");
    }

    private onRoleLoaded(): void {
        for (let career of this.careers) {
            this.loaderDict[career].visible = career == this.selectCareer;
        }
        Sdk.SdkToShowGame(); //先加载完角色才去掉加载页
    }

    /**
     * 滚动显示随机名称
     */
    private showRandomName(): void {
        this.nameTxt = this.nameCom.getChild("txt_name").asRichTextField;
        this.nameTxt.text = this.getRandomName();
        this.randomName = this.nameInput.text;
        let nameHeight: number = this.nameTxt.height;
        this.nameTxt.y = 110;
        egret.Tween.get(this.nameTxt, { loop: true }).to({ y: -nameHeight }, 30000).call(() => {
            this.nameTxt.y = 110;
        }, this);
    }

    private getRandomName(): string {
        let names: string = "";
        let name: string;
        for (let i: number = 0; i < 10; i++) {
            name = App.RandomUtils.randomArray(RandName.firstNames) + App.RandomUtils.randomArray(RandName.secondWoman0) + App.RandomUtils.randomArray(RandName.secondWoman1);
            names += this.getName(name) + "\n";
            name = App.RandomUtils.randomArray(RandName.firstNames) + App.RandomUtils.randomArray(RandName.secondMan0) + App.RandomUtils.randomArray(RandName.secondMan1);
            names += this.getName(name) + "\n";
            name = App.RandomUtils.randomArray(RandName.firstNames) + App.RandomUtils.randomArray(RandName.secondWoman0) + App.RandomUtils.randomArray(RandName.secondWoman1);
            names += this.getName(name) + "\n";
        }
        return names;
    }

    private getName(name: string): string {
        return `<font color="#F2E1C0">玩家  <font color="#00effe">${name}</font>  进入游戏</font>`;
    }

    /**自动创角 */
    private autoCreateRole(): void {
        if (!CreateRoleController.isCreateRoleSuccess) {
            this.clickCreateRoleBtn();
            console.log("自动创角......");
            if (Sdk.is_new) {
                Sdk.logStep(Sdk.LogPreloadStep[13]);
            }
        }
    }
}
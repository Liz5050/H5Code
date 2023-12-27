/**
 * 矿工怪头顶控件
 * @author Chris
 */
class MinerHeadComponent extends Component {
    private robImg:GLoader;
    private robbedIngImg:GLoader;
    private countTxt:egret.TextField;
    private nameTxt:egret.TextField;
    private _canRob:boolean = false;
    private _isRobbedIng:boolean = false;
    private parent:egret.DisplayObjectContainer;
    private container:egret.DisplayObjectContainer;
    private miningInfo: any;
    private leftSecs: number;

    public constructor() {
        super();
    }

    public start(): void {
        super.start();
        this.initView();
        this.onUpdatePlayerMiningInfo();
        EventManager.addListener(LocalEventEnum.UpdateMiningInfo, this.onUpdatePlayerMiningInfo, this);
        EventManager.addListener(LocalEventEnum.UpdatePlayerMiningInfo, this.onUpdatePlayerMiningInfo, this);
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);
    }

    public stop(): void {
        super.stop();
        this._canRob = false;
        this._isRobbedIng = false;
        App.TimerManager.remove(this.onCd, this);
        EventManager.removeListener(LocalEventEnum.UpdateMiningInfo, this.onUpdatePlayerMiningInfo, this);
        EventManager.removeListener(LocalEventEnum.UpdatePlayerMiningInfo, this.onUpdatePlayerMiningInfo, this);
    }

    private onUpdatePlayerMiningInfo(playerMiningInfo:any = null) {
        this.miningInfo = CacheManager.mining.getMiningInfo(this.entity.entityInfo.minerPos_BY);
        if (this.miningInfo) {
            if (playerMiningInfo && (this.miningInfo.floor_I != playerMiningInfo.floor_I || this.miningInfo.pos_I != playerMiningInfo.pos_I)) {
                return;
            }
            this.nameTxt.text = App.StringUtils.substitude(LangMining.LANG50, this.miningInfo.player.name_S, this.entity.entityInfo.name_S);
            this.nameTxt.textColor = Color.toNum(Color.getRumor((2 + this.miningInfo.minerId_I) + ""));
            this.leftSecs = CacheManager.mining.getMiningLeftSecs(this.miningInfo);
            if (this.leftSecs > 0) {
                this.updateCountTxt();
                App.TimerManager.doTimer(1000, 0, this.onCd, this);
            } else {
                App.TimerManager.remove(this.onCd, this);
            }
            this.canRob = CacheManager.mining.canRobOther(this.miningInfo);
            this.isRobbedIng = this.miningInfo.status_I == EMiningStatus.ROBBED;
        }
    }

    private onCd() {
        this.leftSecs--;
        if (this.leftSecs > 0) {
            this.updateCountTxt();
        } else {
            this.countTxt.text = "";
        }
    }

    private updateCountTxt() {
        let timeStr:string = App.DateUtils.getTimeStrBySeconds(this.leftSecs, DateUtils.FORMAT_6, false);
        this.countTxt.text = timeStr;
    }

    private initView() {
        let avatarComponent: AvatarComponent = <AvatarComponent>this.entity.getComponent(ComponentType.Avatar);
        this.parent = avatarComponent.bodyUI;
        this.container = new egret.DisplayObjectContainer();
        this.countTxt = new egret.TextField();
        this.countTxt.size = 18;
        this.countTxt.textColor = 0x0df14b;
        this.countTxt.width = 100;
        this.countTxt.height = 20;
        this.countTxt.textAlign = egret.HorizontalAlign.CENTER;
        this.countTxt.strokeColor = 0x000000;
        this.countTxt.stroke = 2;
        this.countTxt.x = -50;
        this.countTxt.y = -185;
        this.container.addChild(this.countTxt);

        this.nameTxt = new egret.TextField();
        this.nameTxt.size = 18;
        this.nameTxt.textColor = 0x0df14b;
        this.nameTxt.width = 300;
        this.nameTxt.height = 24;
        this.nameTxt.textAlign = egret.HorizontalAlign.CENTER;
        this.nameTxt.strokeColor = 0x000000;
        this.nameTxt.stroke = 2;
        this.nameTxt.x = -150;
        this.nameTxt.y = -160;
        this.container.addChild(this.nameTxt);
        this.parent.addChild(this.container);
    }

    set canRob(value: boolean) {
        if (this._canRob != value) {
            this._canRob = value;
            if (this._canRob) {
                if (!this.robImg) {
                    this.robImg = ObjectPool.pop("GLoader");
                    this.robImg.load(URLManager.getModuleImgUrl("mining/head_rob.png", PackNameEnum.Scene));
                    this.robImg.x = -48;
                    this.robImg.y = -215;
                }
                this.container.addChild(this.robImg.displayObject);
            } else if (this.robImg) {
                this.robImg.destroy();
                this.robImg = null;
            }
        }
    }

    set isRobbedIng(value: boolean) {
        if (this._isRobbedIng != value) {
            this._isRobbedIng = value;
            if (this._isRobbedIng) {
                if (!this.robbedIngImg) {
                    this.robbedIngImg = ObjectPool.pop("GLoader");
                    this.robbedIngImg.load(URLManager.getModuleImgUrl("mining/head_robbed_ing.png", PackNameEnum.Scene));
                    this.robbedIngImg.x = -25;
                    this.robbedIngImg.y = -265;
                }
                this.container.addChild(this.robbedIngImg.displayObject);
            } else if (this.robbedIngImg) {
                this.robbedIngImg.destroy();
                this.robbedIngImg = null;
            }
        }
    }

}
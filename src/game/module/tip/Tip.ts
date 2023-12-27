/**
 * Tip调用入口
 */
class Tip {
    private static rollTip: TipRoll;
    private static mcFightAdd: MCFightAdd;
    private static tipExecutor: TipExecutor;
    private static tipTaskTop: TipTaskTop;

    /**
     * 增加Tip
     * @param tip 可以为字符串或者数组
     */
    public static addTip(tip: any, tipType: TipType = TipType.LeftBottomText): void {
        if (!ResourceManager.isPackageLoaded(PackNameEnum.Common)) {
            return;
        }
        if (Tip.tipExecutor == null) {
            Tip.tipExecutor = new TipExecutor();
        }
        if (tip instanceof Array) {
            Tip.tipExecutor.addTip(tipType, tip);
        } else {
            Tip.tipExecutor.addTip(tipType, [tip]);
        }
    }

    /**
     * 顶部提示
     */
    public static showTip(tip: string, color: number = Color.White, isToLeft: boolean = true): void {
        if (isToLeft) {
            Tip.showLeftTip(HtmlUtil.html(tip, color));
        } else {
            EventManager.dispatch(LocalEventEnum.ShowRollTip, tip, color);
        }
    }

    /**
     * 显示左侧提示
     */
    public static showLeftTip(tip: string): void {
        Tip.addTip(tip, TipType.LeftBottomText);
    }

    /**
     * 显示居中提示
     */
    public static showCenterTip(tip: string): void {
        Tip.addTip(tip, TipType.CenterText);
    }

    /**
     * 滚动提示
     */
    public static showRollTip(tip: string, x: number = -1, y: number = -1, toY: number = -1): void {
        if (Tip.rollTip == null) {
            Tip.rollTip = new TipRoll();
        }
        // Tip.rollTip.addTip(tip, x, y, toY);
        Tip.rollTip.show(tip);
    }

     /**
     * 显示操作提示
     */
    public static showOptTip(tip: string): void {
        Tip.addTip(tip, TipType.Opt);
    }

    public static showFightAdd(value: number): void {
        App.SoundManager.playEffect(SoundName.Effect_FightUpgrade);
        if (Tip.mcFightAdd == null) {
            Tip.mcFightAdd = new MCFightAdd();
        }
        Tip.mcFightAdd.play(value);
    }

    /**
     * 检测背包空位
     */
    public static checkPackIsFull(showAlert: boolean): boolean {
        if (CacheManager.pack.backPackCache.usedCapacity >= CacheManager.pack.backPackCache.capacity) {
            if (showAlert) {
                AlertII.show("背包已满，请前往整理！", null, function () {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Pack);
                }, this, [AlertType.YES], ["前往整理"]);
            }
            return true;
        }
        return false;
    }

    /**
     * 显示任务追踪上方的提示
     */
    public static showTaskTopTip(tip: string): void {
        if (Tip.tipTaskTop == null) {
            Tip.tipTaskTop = new TipTaskTop();
        }
        Tip.tipTaskTop.showTip(tip);
    }
}
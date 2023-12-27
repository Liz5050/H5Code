/**
 * 巅峰竞技图标
 * @author Chris
 */
class PeakIcon extends BaseIcon {

    public constructor(iconId: number) {
        super(iconId);
    }

    protected initView(): void {
        super.initView();
    }

    public setPeakState() {
        this.setText(PeakCache.getIconStateStr(CacheManager.peak.curState, CacheManager.peak.isCrossOpen));
    }
}
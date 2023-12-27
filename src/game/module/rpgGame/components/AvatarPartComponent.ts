
class AvatarPartComponent extends Component {
    protected mc: RpgMovieClip;

    public constructor() {
        super();
    }

    public start(): void {
        super.start();

        this.mc = ObjectPool.pop("RpgMovieClip");
        // this.mc.setComplateAction(this.complateAction, this);
    }

    public stop(): void {
        super.stop();

        this.mc.destroy();
        this.mc = null;
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);
    }

    public get movieClip(): RpgMovieClip {
        return this.mc;
    }

    public playAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1): void {
        if (this.mc && this.mc.parent) {
            this.mc.gotoAction(gotoAction, gotoDir, compFun, attackNO);
        }
    }

    // protected complateAction(): void {
    // }
}
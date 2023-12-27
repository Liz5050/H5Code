class EffectMcComponent extends Component {
    private bodyMc: MovieClip;//特效

    public constructor() {
        super();
    }

    public start(): void {
        super.start();
        this.initMc();
    }

    private initMc() {
        this.bodyMc = ObjectPool.pop("MovieClip");
        this.bodyMc.playFile(this.entity.mcPath + this.entity.mcName, -1);
        this.bodyMc.x = this.entity.x;
        this.bodyMc.y = this.entity.y;
        this.bodyMc.scaleX = this.entity.entityInfo.scaleX;
        this.bodyMc.scaleY = this.entity.entityInfo.scaleY;
        this.entity.gameView.getGameGroundLayer().addChild(this.bodyMc);
    }

    public stop(): void {
        if (this.bodyMc) {
            this.bodyMc.destroy();
            this.bodyMc = null;
        }
    }

}
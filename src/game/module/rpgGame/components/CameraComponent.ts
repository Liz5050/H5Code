
class CameraComponent extends Component {
    private background: RpgBackground;
    private playerX: number;
    private playerY: number;
    private playerCol: number;
    private playerRow: number;

    public constructor() {
        super();
    }

    public start(): void {
        this.background = this.entity.gameView.getBackground();
        super.start();
    }

    public stop(): void {
        super.stop();

        this.background = null;
        this.playerX = null;
        this.playerY = null;
        this.playerCol = null;
        this.playerRow = null;
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);
        if (ControllerManager.scene.sceneState != SceneStateEnum.AllReady)
            return;

        if (this.playerPosChange()) {
            this.playerX = this.entity.x;
            this.playerY = this.entity.y;
            this.entity.gameView.moveGameLayer();
        }

        if (this.playerCellChange()) {
            this.playerCol = this.entity.col;
            this.playerRow = this.entity.row;
            EventManager.dispatch(UIEventEnum.SceneRolePosUpdated);
            if(this.background) this.background.updateCameraPos(this.playerX, this.playerY, this.entity.movingDir);
        }
    }

    private playerPosChange(): boolean {
        let isPosChange:boolean = this.playerX != this.entity.x || this.playerY != this.entity.y;
        // Log.trace("playerPosChange: ", isPosChange, this.entity.x, this.entity.y);
        return isPosChange;
    }

    private playerCellChange(): boolean {
        let isCellChange:boolean = this.playerCol != this.entity.col || this.playerRow != this.entity.row;
        // Log.trace("playerCellChange: ", isCellChange, this.entity.col, this.entity.row);        
        return isCellChange;
    }
}
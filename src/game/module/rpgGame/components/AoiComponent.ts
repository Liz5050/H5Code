
class AoiComponent extends Component {
    public constructor() {
        super();
    }

    public start(): void {
        super.start();

        this.dealInterval = 1000;
        this.dealTime = this.dealInterval;
    }

    public stop(): void {
        super.stop();
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);

        this.setEntityAoi();
    }

    private setEntityAoi(): void {
        let inCamera: boolean = RpgGameUtils.inCamera(this.entity.x, this.entity.y);
        if (inCamera) {
            if (!this.entity.getInCamera()) {
                this.entity.setInCamera(true);
            }
        }
        else {
            if (this.entity.getInCamera()) {
                this.entity.setInCamera(false);
            }
        }
    }
}
class LogWindow extends BaseWindow {
    private logList: List;
    public constructor() {
        super(PackNameEnum.Test, "LogWindow");
    }

    public initOptUI(): void {
        this.logList = new List(this.getGObject("list_log").asList);
    }

    public updateAll(data: any = null): void {
        this.logList.data = data;
    }

}
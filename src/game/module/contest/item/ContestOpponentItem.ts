class ContestOpponentItem extends ListRenderer {

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
    }

    public setData(data: any, index: number): void {
        this.icon = URLManager.getPlayerHead(data.career_I);
        this.title = data.name_S;
    }

}
/**
 * 生命进度条
 */
class LifeProgressBar extends fairygui.GProgressBar {
    private maskGraph: fairygui.GGraph;
    private graphHeight:number = 96;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.maskGraph = this.getChild("graph_mask").asGraph;
    }

    public update(newValue: number): void {
        super.update(newValue);
        let y = this.graphHeight - (newValue/this.max)*this.graphHeight
        this.maskGraph.y = y;
    }
}
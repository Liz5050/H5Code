/**
 * 跨服协议代理
 * @author Chris
 */
class CrossProxy extends BaseProxy {
    public constructor() {
        super();
    }

    public reqEnterCrossBoss(copyCode:number, mapId:number):void {
        this.send("ECmdPublicNewCrossBossEnter",{copyCode:copyCode,mapId:mapId});
    }

    public reqGetCrossBossList() {
        this.send("ECmdPublicNewCrossBossGetList",{});
    }

    public onReqCanclBossOwn() {
        this.send("ECmdPublicNewCrossBossCancelOwner",{});
    }
}
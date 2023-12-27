class QualifyingResultItem extends ListRenderer {
    private nameTxt: fairygui.GTextField;
    private gainTxt: fairygui.GTextField;
    private scoreTxt: fairygui.GTextField;
    private killAndAssistTxt: fairygui.GTextField;
    private goalTxt: fairygui.GTextField;
    private c1: fairygui.Controller;//0其他1第一名2...
    private c2: fairygui.Controller;//0非团队第一1团队第一
    private c3: fairygui.Controller;//0非连胜
    private c4: fairygui.Controller;//0非MVP
    private c5: fairygui.Controller;//0非1血
    private c6: fairygui.Controller;//0非1采
    private c7: fairygui.Controller;//0非逃跑
    private rankTxt: fairygui.GTextField;
    private continueWin: boolean;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.c3 = this.getController('c3');
        this.c4 = this.getController('c4');
        this.c5 = this.getController('c5');
        this.c6 = this.getController('c6');
        this.c7 = this.getController('c7');
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.killAndAssistTxt = this.getChild("txt_k_a").asTextField;
        this.gainTxt = this.getChild("txt_gain").asTextField;
        this.scoreTxt = this.getChild("txt_score").asTextField;
        this.goalTxt = this.getChild("txt_goal").asTextField;
        this.rankTxt = this.getChild("txt_rank").asTextField;

    }

    public setData(data: simple.ISQualifyingPlayerCopyInfo, index: number): void {
        this._data = data;
        this.itemIndex = index;
        this.c1.selectedIndex = index > 2 ? 0 : index + 1;
        this.rankTxt.text = index + 1 + '';
        this.nameTxt.text = data.name_S;
        this.killAndAssistTxt.text = data.killCount_I + '/' + data.assistCount_I;
        this.goalTxt.text = data.copyScore_I + '';
        this.gainTxt.text = data.collectCount_I + '';
        let addStr:string = '';
        if (data.addScore_I > 0) addStr = '+' + data.addScore_I;
        else if (data.addScore_I < 0) addStr = '' + data.addScore_I;
        this.scoreTxt.text = data.score_I + addStr;
        this.c2.selectedIndex = data.force_I == CacheManager.qualifying.myCopyForce ? 1 : 0;
        this.continueWin = data.continueWin_B;
        this.c7.selectedIndex = data.runAway_B ? 1 : 0;
    }

    public updateTags(data:simple.SQualifyingCopyShowReward):void {
        let entityId:any = this._data.entityId;
        this.c3.selectedIndex = this.continueWin ? 1 : 0;
        this.c4.selectedIndex = EntityUtil.isSame(entityId, data.mvpId1, true) || EntityUtil.isSame(entityId, data.mvpId2, true) ? 1 : 0;
        this.c5.selectedIndex = EntityUtil.isSame(entityId, data.firstKillId, true) ? 1 : 0;
        this.c6.selectedIndex = EntityUtil.isSame(entityId, data.firstCollectId, true) ? 1 : 0;
    }

}
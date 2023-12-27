/**
 * 贡献排行
 */
class GuildHomeRankItem extends ListRenderer {
    private nameTxt: fairygui.GTextField;
    private posTxt: fairygui.GTextField;
    private contributionTxt: fairygui.GTextField;

    private sGuildPlayer: any;

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.posTxt = this.getChild("txt_pos").asTextField;
        this.contributionTxt = this.getChild("txt_contribution").asTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.sGuildPlayer = data;
        if(this.sGuildPlayer) {
            this.nameTxt.text = this.sGuildPlayer.miniPlayer.name_S;
            this.posTxt.text = CacheManager.guildNew.getPosName(this.sGuildPlayer.position_I);
            this.contributionTxt.text = this.sGuildPlayer.contributionDay_I.toString();
        }
    }
}
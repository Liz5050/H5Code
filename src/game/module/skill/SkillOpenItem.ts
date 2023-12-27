class SkillOpenItem extends fairygui.GComponent {
    private skillIconLoader: GLoader;
    private skillNameTxt: fairygui.GTextField;
    private static isPlaying: boolean;
    private static pool: any[] = [];
    private static instance: SkillOpenItem;

    public constructor() {
        super();
    }

    public static showItem(skillData: SkillData, parentWidth: number, ix: number, iy: number, parent: egret.DisplayObjectContainer): void {
        SkillOpenItem.pool.push([skillData, parentWidth, ix, iy, parent]);
        SkillOpenItem.playNext();
    }

    private static playNext(): void {
        if (!SkillOpenItem.isPlaying && SkillOpenItem.pool.length) {
            let item: SkillOpenItem = SkillOpenItem.instance || fairygui.UIPackage.createObject(PackNameEnum.Home, "SkillOpen") as SkillOpenItem;
            let data: any[] = SkillOpenItem.pool.shift();
            item.displayObject.x = data[2] + (data[1] - item.width) / 2;
            item.displayObject.y = data[3];
            item.setData(data[0], data[4]);
            SkillOpenItem.instance = item;
        }
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.skillIconLoader = this.getChild("loader_skill") as GLoader;
        this.skillNameTxt = this.getChild("txt_skillName").asTextField;
    }

    public setData(skillData: SkillData, parent: egret.DisplayObjectContainer): void {
        SkillOpenItem.isPlaying = true;
        let iconUrl: string = URLManager.getIconUrl(skillData.skill.skillIcon, URLManager.SKIL_ICON);
        this.skillIconLoader.load(iconUrl);
        this.skillNameTxt.text = skillData.skill.skillName;

        parent.addChild(this.displayObject);
        egret.Tween.get(this.displayObject).to({ y: this.displayObject.y - 162 }, 1000, egret.Ease.circOut).to({}, 1000).call(() => {
            this.dispose();
        });;
    }

    public dispose(): void {
        SkillOpenItem.isPlaying = false;
        App.DisplayUtils.removeFromParent(this.displayObject);
        if (SkillOpenItem.pool.length <= 0) {
            super.dispose();
            SkillOpenItem.instance = null;
        } else {
            SkillOpenItem.playNext();
        }
    }

}
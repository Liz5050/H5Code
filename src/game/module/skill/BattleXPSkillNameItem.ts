/**
 * 战斗XP技能名飘字
 * @author Chris
 */
class BattleXPSkillNameItem extends fairygui.GComponent {
    private skillNameImg: fairygui.GLoader;
    private isPlaying: boolean;
    private skillId: number;
    private lastY: number;

    public constructor() {
        super();
        this.skillNameImg = ObjectPool.pop("GLoader");
        this.skillNameImg.width = 88;
        this.skillNameImg.height = 128;
        this.skillNameImg.setPivot(0.5, 0.5, true);
        this.addChild(this.skillNameImg);
    }

    public play(skillId:number, parent:fairygui.GComponent):void {
        this.skillId = skillId;
        if (this.isPlaying)
        {
            this.resetItem();
        }
        this.randomPos();
        this.isPlaying = true;
        this.skillNameImg.url = URLManager.getModuleImgUrl("skill/skill_name_"+ this.skillId + ".png", PackNameEnum.Scene);
        this.displayObject.scaleX = 3;
        this.displayObject.scaleY = 3;
        egret.Tween.get(this.displayObject).wait(600)
            .call(this.addToParent, this, [parent])
            .to({scaleX:1, scaleY:1}, 200)
            .to({scaleX:1.3, scaleY:1.3}, 60)
            .to({scaleX:1, scaleY:1}, 60)
            .wait(400).call(this.resetItem, this);
    }

    private resetItem() {
        if (!this.isPlaying)
            return;
        this.isPlaying = false;
        if (this.parent)
            this.parent.removeChild(this);
        egret.Tween.removeTweens(this.displayObject);
    }

    private addToParent(parent:fairygui.GComponent):void {
        if (this.parent != parent)
        {
            parent.addChild(this);
        }
    }

    private onRemoveFromStage(e:egret.Event):void {
        this.resetItem();
    }

    private randomPos():void {
        this.x = fairygui.GRoot.inst.width / 9;
        this.y = fairygui.GRoot.inst.height / 7;
    }

}
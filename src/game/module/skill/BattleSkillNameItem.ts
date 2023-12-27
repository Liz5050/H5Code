/**
 * 战斗技能名飘字
 * @author Chris
 */
class BattleSkillNameItem extends fairygui.GComponent
{
    private skillNameImg:GLoader;
    private isPlaying: boolean;
    private skillId: number;
    private lastY:number;
    private skillBgImg: GLoader;

    public constructor()
    {
        super();
        this.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    protected constructFromXML(xml: any): void
    {
        super.constructFromXML(xml);
        this.skillBgImg = this.getChild("skillBg") as GLoader;
        this.skillNameImg = this.getChild("skillNameImg") as GLoader;
    }

    public play(skillId:number, parent:egret.DisplayObjectContainer):void
    {
        this.skillId = skillId;
        if (this.isPlaying)
        {
            this.resetItem();
        }
        if (this.displayObject.parent != parent)
        {
            parent.addChild(this.displayObject);
        }
        this.randomPos();
        this.isPlaying = true;
        let bgUrl:string = URLManager.getModuleImgUrl("skill/skill_bg" + CacheManager.role.getBaseCareer() + ".png", PackNameEnum.Scene);
        if (this.skillBgImg.url != bgUrl)
        {
            this.skillBgImg.load(bgUrl);
        }
        this.skillNameImg.load(URLManager.getModuleImgUrl("skill/skill_name_"+ this.skillId + ".png", PackNameEnum.Scene));
        this.displayObject.y = this.lastY;
        egret.Tween.get(this.displayObject).to({y:this.lastY-150}, 300, egret.Ease.circOut)
        .to({}, 500).to({scaleX:0, scaleY:0}, 300, egret.Ease.circOut).call(this.resetItem, this);
    }

    private resetItem()
    {
        if (!this.isPlaying)
            return;
        this.isPlaying = false;
        this.displayObject.scaleX = 1;
        this.displayObject.scaleY = 1;
        App.DisplayUtils.removeFromParent(this.displayObject);
        egret.Tween.removeTweens(this.displayObject);
    }

    private onRemoveFromStage(e:egret.Event):void
    {
        this.resetItem();
    }

    private randomPos():void
    {
        //this.displayObject.y += -500;
        this.lastY =  this.displayObject.y;
        this.displayObject.x += Math.random() > 0.5 ? -150 : 150 - this.width;
    }
}
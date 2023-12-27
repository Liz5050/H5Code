/**
 * 特效组配置
 * @author Chris
 */
class EffectListData
{
    public listId:number;
    /**特效组 */
    public effectList:Array<any>;
    /**目标类型 */
    public effectPos:number;
    /**特效类型 */
    public effectType:number;
    /**伤害飘血延迟时间 */
    public effectHurts:Array<number>;
    /**死亡动作延迟时间 */
    public delayDie:number;
    /**震屏参数 */
    public shakes:any[];
    /**从属特效 */
    public isDependent:boolean;
    public constructor(conf:any)
    {
        this.listId = conf.listId;
        this.effectList = JSON.parse(conf.effectList);
        this.effectPos = conf.effectPos;
        this.effectType = conf.effectType;
        this.effectHurts = conf.effectHurt ? JSON.parse(conf.effectHurt) : null;
        this.delayDie = conf.delayDie;
        let shakeCf = conf.shake ? JSON.parse(conf.shake) : null;
        if (shakeCf) {
            if (shakeCf.time) {//单个
                this.shakes = [shakeCf];
            } else {//多个
                this.shakes = shakeCf;
            }
        }
    }
}
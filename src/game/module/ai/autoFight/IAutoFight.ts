interface IAutoFight
{
    /**
     * 挂机循环
     */
    update():boolean;
    /**
     * 挂机移动过程中循环,实现需求如：寻找挂机点时遇到可攻击目标直接进入攻击
     */
    updateOnMoving():void;
    /**
     * 挂机的怪物id
     */
    getBossCode():number;
    /**
     * 寻找挂机的怪物/敌人/.. - 所有挂机找怪的接口写在这
     */
    findTargetToAttack():RpgGameObject;
    /**
     * 设置首次update时间time，一般用于首次挂机停顿时间
     */
    setUpdateDelay(delay:number);
    /**
     * 获取首次update时间time，一般用于首次挂机停顿时间
     */
    getUpdateDelay():number;
}
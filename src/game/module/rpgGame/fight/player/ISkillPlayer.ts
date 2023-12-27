interface ISkillPlayer {
    /**
     * 播放
     *
     */
    play(skillId:number, listVo:EffectListData, fromObj:RpgGameObject, toObj:RpgGameObject, toObjList:Array<RpgGameObject>, targetPointX:number, targetPointY:number):void;
    /**
     * 重置
     *
     */
    reset():void;
    /**
     * 获取所属技能特效类型
     * @return
     */
    getEffectType():number;
}
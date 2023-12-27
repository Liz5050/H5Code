/**
 * 关卡推图挂机子控制器
 * @author Chris
 */
class AutoFightCheckPoint extends AutoFightNormal implements IAutoFight {
    private hasArrivedMonPos:boolean;
    private isInCopy:boolean;
    private totalWave:number;
    private curWave:number;

    public constructor(data: any) {
        super();
        if (data) {
            this.data = data;
            this.mapId = 0;
            this.totalWave = data.wave || 0;
            let curWave:number = 0//(Math.random() * this.totalWave >> 0);
            let plan:number = data.plan1 + curWave;//刷怪点方案
            this.curWave = curWave;
            this.isInCopy = CacheManager.copy.isInCopy;

            this.makeMonPos(data, plan);

            Log.trace(Log.CHECKPOINT, `当前关卡=${data.id}，关卡副本id=${CopyEnum.CopyCheckPoint}，副本中=${this.isInCopy}，刷怪方案=${plan}，刷怪点=(${this.x},${this.y})`)
        }
    }

    private makeMonPos(data: any, plan:number):void {
        let planPosArr:Array<number>;//刷怪点坐标
        let blockType:number;//刷怪点格子类型

        if (!this.isInCopy) {
            blockType = 10 + plan;//10+刷怪方案=小怪挂机点
            this.bossCode = data.code1;
            this.findMonPosRadius = CacheManager.battle.battle_config.FindMonsterPointRadius0;
        } else {
            let startId:number = plan % 20 != 0 ? Math.floor(plan / 20) * 20 + 1 : plan - 20 + 1;
            blockType = startId+19;//19+(当前关卡起始id)=BOSS挂机点
            this.bossCode = data.code2;
            // this.updateDelay = egret.getTimer() + 5000;
            this.findMonPosRadius = CacheManager.battle.battle_config.FindMonsterPointRadius1;
        }
        planPosArr = CacheManager.map.getMapCoordsByBlockType(blockType);
        if (planPosArr) {
            this.x = planPosArr[0];
            this.y = planPosArr[1];
        } else {
            this.x = this.y = -1;//-1取不到挂机点
        }
    }

    public update(): boolean {
        if (!this.hasArrivedMonPos) {
            this.hasArrivedMonPos = this.isArrived;
        }
        if ((this.hasArrivedMonPos /*|| this.isInCopy*/) && this.findMonster()) {
            this.hasFindMon = true;
            this.hasFindMonPos = false;
            return true;
        }
        else if (this.findMonsterPoint()) {
            this.hasFindMonPos = true;
        } else if (this.hasArrivedMonPos || this.hasFindMonPos) {
            this.gotoNextPlan();
        }
        return false;
    }

    private gotoNextPlan():void {
        if (!this.isInCopy && this.totalWave > 0) {
            let curWave:number = (this.curWave + 1) % this.totalWave;
            let nextPlan:number = this.data.plan1 + curWave;
            this.curWave = curWave;
            this.makeMonPos(this.data, nextPlan);
            this.hasArrivedMonPos = false;
            this.hasFindMonPos = false;
        }
    }

    public updateOnMoving():void {
        if (!this.hasArrivedMonPos) {
            this.hasArrivedMonPos = this.isArrived;
        }
        this.hasFindMonPos && this.hasArrivedMonPos && this.findMonster();
    }
}
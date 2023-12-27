enum Dir { //后端：东为1，顺时针到东北8
    Top,
    TopRight,
    Right,
    BottomRight,
    Bottom,
    BottomLeft,
    Left,
    TopLeft
}

class Action {
    public static Prepare: string = "prepare";
    public static Attack: string = "attack";
    public static Attacked: string = "attacked";
    public static Die: string = "die";
    public static Move: string = "move";
    public static Stand: string = "stand";
    public static Rush: string = "rush";
    public static Jump: string = "jump";
    public static Charge: string = "charge";

    public static isActionLock(action:string):boolean {
        switch (action) {
            case Action.Attack:
            case Action.Rush:
            case Action.Jump:
            case Action.Charge:
                return true;
            default:
                return false;
        }
    }

    public static isActionNoPlayPart(action:string):boolean {
        switch (action) {
            case Action.Rush:
            case Action.Jump:
            case Action.Charge:
                return true;
            default:
                return false;
        }
    }

    public static isLoopAction(action:string):boolean {
        return action == Action.Move || action == Action.Stand || action == Action.Die;
    }
}

class AvatarType {
    public static Player: string = "player";
    public static Monster: string = "monster";
    public static Attack: string = "attack"; //普攻
    public static Skill: string = "skill";
    public static Weapon: string = "weapon";
    public static Wing: string = "wing";
    public static Mount:string = "mount";
    public static Law:string = "law";
    public static Spirit:string = "spirit";
    public static Soul:string = "soul";
    public static ShapeBattle:string = "ShapeBattle";
    public static SwordPool : string = "SwordPool";

}

class ResAvatarType {
    public static ResPlayer: string = "player";
    public static ResAttack: string = "attack"; //普攻
    public static ResWeapon: string = "weapon";
    public static ResWing: string = "wing";
}

/**
 * 专门用于动作、武器等的人物相关加载
 */
class RpgMovieClip extends LabelMovieClip {
    //测试，先不读表
    // private static OFFSET_IDS: number[] = [9101001, 9101002, 9101003, 9101004, 9101005];
    // private static OFFSET_NUM: number[] = [770, 1024, 2000];
    // private static RUSH_ACTIONS: string[] = ["jump1", "jump3"]; //["jump1", "attack6", "jump3"]
    // private static JUMP_ACTIONS: string[] = ["jump1", "jump2", "jump3"]; //["jump1", "attack6", "jump3"]
    // private static CHARGE_ACTIONS: string[] = ["jump1"];

    private avatarType: string;
    private resType: string;
    private currAction: string;
    private currDir: Dir;
    // private complateAction: Function;
    // private complateActionObj: any;

    // private avatarResName: number;

    // private mc: MovieClip;
    /** eg: resource/assets/rpgGame/player/ */
    private resRootPath: string;
    private _resId: string;
    // private currentActionName: string;
    /** 缩放比例 */
    private scaleRatio: number = 1;

    /**坐骑状态 */
    private gMountState:boolean;
    /**法阵状态 */
    private gLawState:boolean;
    /**优先级 */
    private priority:ELoaderPriority = ELoaderPriority.DEFAULT;
    /**上一次状态 */
    private lastState:any = {};//{action:string, dir:Dir, res:string}

    public constructor() {
        super();
    }

    public setData(resRootPath: string, resID: string, avatarType: string = AvatarType.Player, priority:ELoaderPriority = ELoaderPriority.DEFAULT, resType: string = ""): void {
        this.resRootPath = resRootPath;
        this._resId = String(resID);
        this.avatarType = avatarType;
        this.priority = priority;
        this.resType = resType;
        this.lastState.res = this._resId;
    }

    public gotoAction(gotoAction: string, gotoDir: Dir, compFun: () => void = null, attackNO: number = 1,playCount:number = -1,compReset:boolean = false): void {
        // if (!this.movieClipData || !this.movieClipData.mcData) {
        //     return;
        // }
        // if (gotoAction == Action.Move 
        //     && this.lastState.action == gotoAction
        //     && this.lastState.res == this._resId
        //     && (this.lastState.dir == Dir.BottomLeft && gotoDir == Dir.Bottom)) {
        //     return;
        // }

        if (this.lastState.action != gotoAction) {
            this.lastState.action = gotoAction;
        }
        if (this.lastState.dir != gotoDir) {
            this.lastState.dir = gotoDir;
        }

        let totalPlayNum: number = -1;
        if (gotoAction == Action.Attack
            || gotoAction == Action.Attacked
            || gotoAction == Action.Die) {
            totalPlayNum = 1;
        }
        if(playCount != -1) totalPlayNum = playCount;
        // if (gotoAction == Action.Attack) {
        //     totalPlayNum = 1;
        // }

        //0上 1右上 2右 3右下 4下
        //8方向
        /*let dir: number;
        let scaleX: number;
        if (gotoDir == Dir.Top) {
            dir = 0;
            scaleX = 1;
        } else if (gotoDir == Dir.TopRight) {
            dir = 1;
            scaleX = 1;
        } else if (gotoDir == Dir.Right) {
            dir = 2;
            scaleX = 1;
        } else if (gotoDir == Dir.BottomRight) {
            dir = 3;
            scaleX = 1;
        } else if (gotoDir == Dir.Bottom) {
            dir = 4;
            scaleX = 1;
        } else if (gotoDir == Dir.BottomLeft) {
            dir = 3;
            scaleX = -1;
        } else if (gotoDir == Dir.Left) {
            dir = 2;
            scaleX = -1;
        } else if (gotoDir == Dir.TopLeft) {
            dir = 1;
            scaleX = -1;
        }*/
        //4方向
        let dir: number;
        let scaleX: number;
        if (gotoDir == Dir.Top) {
            dir = 1;
            scaleX = 1;
        } else if (gotoDir == Dir.TopRight) {
            dir = 1;
            scaleX = 1;
        } else if (gotoDir == Dir.Right) {
            dir = 3;
            scaleX = 1;
        } else if (gotoDir == Dir.BottomRight) {
            dir = 3;
            scaleX = 1;
        } else if (gotoDir == Dir.Bottom) {
            dir = 3;
            scaleX = 1;
        } else if (gotoDir == Dir.BottomLeft) {
            dir = 3;
            scaleX = -1;
        } else if (gotoDir == Dir.Left) {
            dir = 3;
            scaleX = -1;
        } else if (gotoDir == Dir.TopLeft) {
            dir = 1;
            scaleX = -1;
        }

        let resUrl: string = this.getPlayResUrlByAttackNO(gotoAction, attackNO);
        let labelName: string = this.getPlayLabelName(gotoAction, dir);

        if (null == resUrl) {
            Alert.info(`resRootPath:` + this.resRootPath + `,  resID:` + this.resID + `，没有资源` + `,  action:` + gotoAction);
            return;
        }

        this.playLabel(resUrl, labelName, totalPlayNum, this.priority, compFun, compReset);
        // this.gotoAndPlay(actionName, -1);
 
        this.currAction = gotoAction;
        this.currDir = gotoDir;

        this.scaleX = scaleX * this.scaleRatio;
        this.scaleY = 1 * this.scaleRatio;

        let offsetNum: number = this.getOffsetNum();
        // this.setBitmap(bitmapTexture, scaleX);
        if (scaleX > 0) {
            this.x = this.y = -offsetNum;
        } else {
            this.x = offsetNum;
            this.y = -offsetNum;
        }

        // if(this.gMountState)
        // {
        //     if(this.avatarType == AvatarType.Player) this.y -= 100;
        //     else if(this.avatarType == AvatarType.Weapon) this.y -= 100;
        // }
    }

    private getPlayResUrlByAttackNO(gotoAction: string, attackNO: number = 1): string {
        if (!this.resRootPath || !this.resID || this.resID == "") {
            return null;
        }
        let actionName: string = gotoAction
        let _resId:string = this.resID;
        if(this.gMountState && this.avatarType != AvatarType.Mount &&
        gotoAction != Action.Attack && gotoAction != Action.Die && gotoAction != Action.Jump && gotoAction != Action.Charge) _resId = this.resID + "_mount";
        if (gotoAction == Action.Attack) {
            // let attackNum: number = App.RandomUtils.limitInteger(1, 6);
            let attackNum: number = attackNO == 0 ? 1 : attackNO;
            actionName = gotoAction + attackNum.toString();
        }
        else if (gotoAction == Action.Rush)
        {
            if(this.avatarType == AvatarType.Mount) {
                actionName = Action.Move;
            }
            else if(this.avatarType == AvatarType.Player && this.gMountState) {
                actionName = Action.Move;
            }
            else if(this.avatarType == AvatarType.Weapon || this.avatarType == AvatarType.Wing) {
                actionName = Action.Stand;
            } 
            else {
                actionName = "jump1";//App.RandomUtils.randomArray(RpgMovieClip.RUSH_ACTIONS);
            }
        }
        else if (gotoAction == Action.Jump)
        {
            if(this.avatarType == AvatarType.Weapon || this.avatarType == AvatarType.Wing) 
            {
                actionName = Action.Stand;
            }
            else if(this.avatarType == AvatarType.Mount) {
                actionName = Action.Move;
            }
            // else if(this.avatarType == AvatarType.Player && this.gMountState) {
            //     actionName = Action.Move;
            // } 
            else
            {
                actionName = "jump2";//RpgMovieClip.JUMP_ACTIONS[attackNO-1];
                // actionName = App.RandomUtils.randomArray(RpgMovieClip.JUMP_ACTIONS);
            }
        }
        else if (gotoAction == Action.Charge)
        {
            if(this.avatarType == AvatarType.Weapon || this.avatarType == AvatarType.Wing) 
            {
                actionName = Action.Stand;
            }
            else if(this.avatarType == AvatarType.Mount) {
                actionName = Action.Move;
            }
            else if(this.avatarType == AvatarType.Player && this.gMountState) {
                actionName = Action.Move;
            } 
            else {
                actionName = "jump1";//RpgMovieClip.CHARGE_ACTIONS[0];
            } 
        }
        else if(gotoAction == Action.Move)
        {
            if((this.avatarType == AvatarType.Player ||
                this.avatarType == AvatarType.Wing ||
                this.avatarType == AvatarType.Weapon
            )
             && this.gLawState && !this.gMountState)
            {
                actionName = Action.Stand;
            }
        }
        // this.currentActionName = actionName;
        let resUrl: string = this.resRootPath + _resId + "_" + actionName;
        // Log.trace(">>> getPlayResUrlByAttackNO是：", resUrl);
        return resUrl;
    }

    private getPlayLabelName(gotoAction: string, dir: number): string {
        let labelName: string = gotoAction + "_" + dir;
        // Log.trace(">>> labelName是：", labelName);
        if (gotoAction == Action.Rush || gotoAction == Action.Charge) { //冲刺/冲锋用
            if(this.gMountState || this.avatarType == AvatarType.Mount) {
                labelName = "move_" + dir;
            }
            else {
                labelName = "jump_" + dir;
                // if (this.currentActionName != "attack6") labelName = "attack_" + dir;
            }
        }
        else if(gotoAction == Action.Move)
        {
            if(this.gLawState && !this.gMountState) labelName = "stand_" + dir;
        }
        else if(gotoAction == Action.Jump)
        {
            if(this.avatarType == AvatarType.Weapon || this.avatarType == AvatarType.Wing) {
                labelName = "stand_" + dir;
            }
        }
        return labelName;
    }

    private getOffsetNum(): number {
        return 0;
        // return 1000 * this.scaleRatio;

        // //对好了中心点的: attack1~5，Action.Attack
        // if((this.resType == ResAvatarType.ResPlayer ||
        //     this.resType == ResAvatarType.ResAttack ||
        //     this.resType == ResAvatarType.ResWeapon ||
        //     this.resType == ResAvatarType.ResWing
        // )
        //     && this.currAction == Action.Attack)
        // {
        //     return 0;
        // }

        // return 1000;

        // let indexNum: number = 0;
        // if (this.resID > 9000000) {
        //     indexNum = 1;
        // }
        // if (this.avatarType == AvatarType.Attack) {
        //     indexNum = 2;
        // } else if (this.avatarType == AvatarType.Weapon) {
        //     indexNum = 1;
        // }
        // return RpgMovieClip.OFFSET_NUM[indexNum] / 2;
    }

    // public setComplateAction(complateAction: Function, complateActionObj: any): void {
    //     this.complateAction = complateAction;
    //     this.complateActionObj = complateActionObj;
    // }

    protected resetMovieClip(): void {
        super.resetMovieClip();

        this.currAction = null;
        this.currDir = null;
        this.priority = ELoaderPriority.DEFAULT;
        this.lastState = {};
    }

    public getCurrAction(): string {
        return this.currAction;
    }

    public setCurrAction(action: string): void {
        this.currAction = action;
    }

    public getCurrDir(): Dir {
        return this.currDir;
    }

    public setCurrDir(dir: Dir): void {
        this.currDir = dir;
    }

    public set mountState(value:boolean)
    {
        this.gMountState = value;
    }

    public get mountState():boolean {
        return this.gMountState;
    }

    public set lawState(value:boolean)
    {
        this.gLawState = value;
    }

    public get resID():string {
        return this._resId;
    }

    public destroy():void
    {
        super.destroy();
        this.gMountState = false;
        this.gLawState = false;
        this.resRootPath = "";
        this._resId = "";
        this.avatarType = "";
        this.currAction = "";
        this.scaleRatio = 1;
    }
}
/**
 * 场景飘字
 */
class RpgGameTipsController extends BaseController
{
	private showExpList:any[] = [];
    private startShowExp:boolean = false;
	private propertyList:any[] = [];
	private gPropertyAllComplete:boolean = true;

    private checkPointTips:GLoader;
    private checkPointTips2:GLoader;
    private checkPointMc:UIMovieClip;
    private checkPointMc2:UIMovieClip;
    private mcShape:fairygui.GGraph;
	public constructor() 
	{
		super(ModuleEnum.RpgGameTips);
	}

	public initView(): IBaseView {
        return null;
    }

	public addListenerOnInit(): void 
	{
		// this.addListen0(NetEventEnum.roleExpAdd, this.onRoleExpAddHandler, this);
		// this.addListen0(NetEventEnum.propertyUpgrade,this.onPropertyUpgradeHandler,this);
		this.addListen0(NetEventEnum.roleLifeAdd, this.onRoleLifeAddHandler, this);
		this.addListen0(NetEventEnum.SwordPoolExpAdd,this.onSwordPoolExpAddHandler,this);
        this.addListen0(NetEventEnum.copyEnterCheckPoint,this.onEnterCheckPointCopy,this);
        this.addListen0(LocalEventEnum.ShowEnergyEffect,this.onCheckPointEnergyEffect,this);
        this.addListen0(LocalEventEnum.ShowCrossStairFloorTips,this.onChangeCrossStairFloor,this);
	}

	/**
	 * 经验飘字
	 */
	private onRoleExpAddHandler(expAddInfo:any):void
    {
        if(this.showExpList.length >= 50) return;
        this.showExpList.push(expAddInfo);
        if(!this.startShowExp)
        {
            App.TimerManager.doFrame(16, 0, this.showExp, this);
            this.startShowExp = true;
        }
    }

    private showExp():void
    {
        let expAddInfo:any = this.showExpList.shift();
        if(expAddInfo == null)
        {
            App.TimerManager.remove(this.showExp, this);
            this.startShowExp = false;
            return;
        } 
        let _text:fairygui.GTextField = ObjectPool.pop("fairygui.GTextField");
        _text.setXY(Math.round(fairygui.GRoot.inst.width * 0.5), fairygui.GRoot.inst.height - 350);
        _text.font = FontType.EXP_FONT;
        let _expStr:string = "+p" + expAddInfo.exp;
        let _rate:number = expAddInfo.rate;
        if(_rate > 0) _expStr += "（+" + expAddInfo.rate + "%）";
        _text.text = _expStr;
        _text.setPivot(0.5,0,true);
        _text.scaleX = _text.scaleY = 1;
        LayerManager.Game_Main.addChild(_text.displayObject);
        egret.Tween.get(_text).wait(500).to({alpha:0.1},1000);
        egret.Tween.get(_text).to({y:_text.y - 150},1600).call(this.removeTextField,this,[_text]);
    }

	/**
	 * 加血飘字
	 */
	private onRoleLifeAddHandler(addValue:number,roleIndex:number):void
    {
        let roleInfo:EntityInfo = CacheManager.role.getEntityInfo(roleIndex);
        if(!roleInfo.selfInit || !ControllerManager.scene.sceneReady) {
            return;
        }
        let pt:egret.Point = RpgGameUtils.convertCellToXY(roleInfo.col,roleInfo.row);
        let ptX:number = pt.x;
        let ptY:number = pt.y - 150;
        let _text:fairygui.GTextField = ObjectPool.pop("fairygui.GTextField");
        _text.font = FontType.ROLE_HP_ADD;
        _text.text = "+" + addValue;
        _text.setPivot(0.5,0,true);
        _text.setXY(ptX, ptY);
        _text.scaleX = _text.scaleY = 0.5;
        // LayerManager.UI_Home.addChild(_text);
        ControllerManager.rpgGame.view.getGameTipsLayer().addChild(_text.displayObject);
        egret.Tween.get(_text).to({y:pt.y - 200,alpha:0},2000).call(this.removeTextField,this,[_text]);
    }

	/**
	 * 属性提升飘字
	 */
	private onPropertyUpgradeHandler(list:any[]):void
    {
		if(this.propertyList.length > 0)
		{
			this.propertyList.push(list);
			return;
		}
		this.propertyList.push(list);
		if(!this.gPropertyAllComplete) return;
		this.gPropertyAllComplete = false;
		this.showPropertyTxt();
    }

	private showPropertyTxt():void
	{
		let _list:any[] = this.propertyList.shift();
		if(!_list)
		{
			this.gPropertyAllComplete = true;
			return;
		}
		for(let i:number = 0; i < _list.length; i++)
		{
			let _posY:number = 280 + i*40;
			let _str:string = _list[i]["txt"];
			let _value:number = _list[i]["value"];
			let _text:fairygui.GTextField = ObjectPool.pop("fairygui.GTextField");
			_text.font = FontType.ROLE_PROPERTY_UPGRADE;
			_text.text = "+" + _str + _value;
			_text.setXY(100, _posY);
			_text.alpha = _text.alpha = 0;
			LayerManager.UI_Message.addChild(_text);

			let _isAllComplete:boolean = i == _list.length - 1;
			egret.Tween.get(_text).wait(i*200).to({y:_posY - 10,alpha:1},200,egret.Ease.circOut)
			.wait(1000).to({x:200,alpha:0},200,egret.Ease.circOut).call(this.removeTextField,this,[_text]);
		}
	}

	/**剑池经验增加 */
	private onSwordPoolExpAddHandler(exp:number):void{
		let _text:fairygui.GTextField = ObjectPool.pop("fairygui.GTextField");
        _text.setXY(Math.round(fairygui.GRoot.inst.width / 2), fairygui.GRoot.inst.height - 350);
        _text.font = FontType.DailyExp;
        _text.text = `e+${exp}`;
        _text.setPivot(0.5,0,true);
        _text.scaleX = _text.scaleY = 1;
        LayerManager.UI_Tips.addChild(_text);
        egret.Tween.get(_text).wait(500).to({alpha:0.1},1000);
        egret.Tween.get(_text).to({y:_text.y - 150},1600).call(this.removeTextField,this,[_text]);
	}

    private onEnterCheckPointCopy():void {
        ResourceManager.load(PackNameEnum.NumCheckPoint, -1, new CallBack(() => {
            let centerX:number = Math.round(fairygui.GRoot.inst.width / 2);
            let centerY:number = fairygui.GRoot.inst.height * 0.38;
            if(!this.checkPointMc2) {
                this.mcShape = new fairygui.GGraph();

                this.checkPointMc2 = UIMovieManager.get(PackNameEnum.MCCheckPointTxt2);
                this.checkPointMc2.scaleX = this.checkPointMc2.scaleY = 2.2;
            }
            this.checkPointMc2.x = (fairygui.GRoot.inst.width - 946) / 2;
            this.checkPointMc2.y = centerY - 180;

            this.mcShape.graphics.clear();
            this.mcShape.graphics.beginFill(0x0);
            this.mcShape.graphics.drawRect(0,0,fairygui.GRoot.inst.width,fairygui.GRoot.inst.height);
            LayerManager.UI_Home.addChild(this.mcShape);
            this.mcShape.alpha = 0;
            egret.Tween.get(this.mcShape).to({alpha:0.6},350,egret.Ease.circOut).call(()=>{
                this.checkPointMc2.setPlaySettings(0,-1,1,-1,function(){
                    this.checkPointMc2.removeFromParent();
                },this);
                LayerManager.UI_Home.addChild(this.checkPointMc2);

                 let _text:fairygui.GTextField = ObjectPool.pop("fairygui.GTextField");
                _text.setXY(centerX, centerY);
                _text.font = URLManager.getPackResUrl(PackNameEnum.NumCheckPoint,"CheckPointTxt");
                _text.setPivot(0.5,0,true);
                _text.text = App.StringUtils.substitude(LangCheckPoint.L7,(CacheManager.checkPoint.passPointNum + 1));
                _text.touchable = false;
                _text.alpha = 0;
                LayerManager.UI_Home.addChild(_text);
                egret.Tween.get(_text).wait(100).to({alpha:1},300).wait(300).to({alpha:0},150).call(this.removeTextField,this,[_text]);
            },this).wait(700).to({alpha:0},150).call(()=>{
                this.mcShape.removeFromParent();
                CacheManager.checkPoint.isComplete = true;
            },this);
        },this));
    }

    private onChangeCrossStairFloor(floor:number,str:string):void {
        this.onShowCheckPointBossTips(floor,str);
    }

    /**关卡挑战boss提示 */
    private onShowCheckPointBossTips(floor:number,cusStr:string):void {
        ResourceManager.load(PackNameEnum.NumCheckPoint, -1, new CallBack(() => {
            let centerX:number = Math.round(fairygui.GRoot.inst.width / 2);
            let centerY:number = fairygui.GRoot.inst.height * 0.25 + 20;
            if(!this.checkPointTips) {
                this.checkPointTips = ObjectPool.pop("GLoader");
                this.checkPointTips.touchable = false;
                this.checkPointTips.width = 720;
                this.checkPointTips.height = 96;
                this.checkPointTips.load(URLManager.getModuleImgUrl("checkpoint_tipsBg.png", PackNameEnum.Home));

                this.checkPointTips2 = ObjectPool.pop("GLoader");
                this.checkPointTips2.touchable = false;
                this.checkPointTips2.width = 720;
                this.checkPointTips2.height = 74;
                this.checkPointTips2.load(URLManager.getModuleImgUrl("checkpoint_tipsBg2.png", PackNameEnum.Home));

                this.checkPointMc = UIMovieManager.get(PackNameEnum.MCCheckPointTxt);
            }
            this.checkPointMc.x = (fairygui.GRoot.inst.width - 512) / 2;
            this.checkPointMc.y = centerY - 216;

            let posY:number = centerY - 55;
            this.checkPointTips.alpha = this.checkPointTips2.alpha = 0;
            this.checkPointTips.x = this.checkPointTips2.x = (fairygui.GRoot.inst.width - 720) * 0.5;
            this.checkPointTips.y = posY - 200;
            this.checkPointTips2.y = posY + 296;
            LayerManager.UI_Home.addChild(this.checkPointTips);
            LayerManager.UI_Home.addChild(this.checkPointTips2);
            
            egret.Tween.removeTweens(this.checkPointTips);
            egret.Tween.removeTweens(this.checkPointTips2);
            egret.Tween.get(this.checkPointTips).to({y:posY,alpha:1},400).wait(1200).to({alpha:0},500);
            egret.Tween.get(this.checkPointTips2).to({y:posY + 96,alpha:1},400).call(function(){
                let _text:fairygui.GTextField = ObjectPool.pop("fairygui.GTextField");
                _text.setXY(centerX, centerY);
                _text.font = FontType.CheckPointTips;
                _text.setPivot(0.5,0,true);
                _text.text = App.StringUtils.substitude(cusStr,floor);
                _text.touchable = false;
                _text.alpha = 0;
                LayerManager.UI_Home.addChild(_text);

                this.checkPointMc.alpha = 1;
                LayerManager.UI_Home.addChild(this.checkPointMc);
                this.checkPointMc.setPlaySettings(0,-1,1,-1);

                egret.Tween.get(_text).wait(100).to({alpha:1},300).wait(800).to({alpha:0},500).call(this.removeTextField,this,[_text]);
                egret.Tween.get(this.checkPointMc).wait(100).to({alpha:1},300).wait(800).to({alpha:0},500);
            },this).wait(1200).to({alpha:0},500).call(function(){
                this.checkPointMc.removeFromParent();
                if(this.checkPointTips) {
                    this.checkPointTips.removeFromParent();
                }
                if(this.checkPointTips2) {
                    this.checkPointTips2.removeFromParent();
                }
            },this);
        }, this));
        
    }

    /**关卡杀怪能量特效 */
    private onCheckPointEnergyEffect(startPt:egret.Point):void {
        let posPt:egret.Point = ControllerManager.home.getHomeBtnGlobalPos(ModuleEnum.CheckPoint);
        if(!posPt) return;
        let star:GLoader = ObjectPool.pop("GLoader");
        star.touchable = false;
        star.load(ResourcePathUtils.getRPGGameCommon() + "checkPoint_star.png");
        star.x = startPt.x;
        star.y = startPt.y;
        LayerManager.UI_Home.addChild(star);
        let posX:number = posPt.x + 40;
        let posY:number = posPt.y + 20;
        egret.Tween.get(star).to({x:posX,y:posY},500).call(function(){
            if(star) {
                star.destroy();
                star = null;
            }
            CacheManager.checkPoint.clientEnerge ++;
            EventManager.dispatch(NetEventEnum.CheckPointKillsUpdate);
        },this);
    }

    private removeTextField(text:fairygui.GTextField):void {
        if(!text) return;
        egret.Tween.removeTweens(text);
        App.DisplayUtils.removeFromParent(text.displayObject);
        text.removeFromParent();
        text.text = "";
        text.font = null;
        text.alpha = 1;
        text.scaleX = text.scaleY = 1;
        text.x = text.y = 0;
        text.setPivot(0,0,true);
        text.touchable = true;
        ObjectPool.push(text);
    }   
}
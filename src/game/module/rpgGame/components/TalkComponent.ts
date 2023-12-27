class TalkComponent extends Component
{
	private gTalkBg:fairygui.GImage;
	private talkTxt:egret.TextField;
	private gTime:number = 0;
	private gPetTalkTime:number = 0;
	private gPetTalkData:PetTalkData;
	private gTalkQueue:any[] = [];
	private gModelHeight:number;
	private canUpdate:boolean = false;

	private updateTime:number;
	public constructor() 
	{
		super();
	}

	public start():void
	{
		this.updateTime = egret.getTimer();
		super.start();
		if(this.entity.objType == RpgObjectType.Pet) {
			this.canUpdate = true;
			let _talkData:PetTalkData = ConfigManager.petTalk.getRandomTalkData(PetTalkCondition.EnterMap);
			_talkData && this.talk(_talkData.content,_talkData.durationTime);
		}
		else {
			this.canUpdate = false;
		}
	}

	public talk(content:string,time:number):void
	{
		let _avatarCom:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
		if(!_avatarCom) return;
		let _head:HeadComponent = this.entity.getComponent(ComponentType.Head) as HeadComponent;
		if(_head) this.gModelHeight = _head.modelHeight;
		if(!this.gModelHeight) this.gModelHeight = 155;

		if(this.talkTxt && this.talkTxt.parent)
		{
			/**正在说话中，缓存数据 */
			this.gTalkQueue.push({ "content":content, "time":time });
			return;
		}
		if(!this.talkTxt)
		{
			let uiObj:fairygui.GObject = fairygui.UIPackage.createObject(PackNameEnum.Scene, "bubble_1")
			if(!uiObj) return;
			this.gTalkBg = uiObj.asImage;
			// this.gTalkBg.width = 305;
			// this.gTalkBg.x = this.originX + 112;
			// this.gTalkBg.y = this.originY - this.gModelHeight - 30;//-205;
			this.gTalkBg.setPivot(0.5, 0.5, true);
			
			this.talkTxt = new egret.TextField();
			this.talkTxt.size = 18;
			this.talkTxt.textColor = 0xFFFFFF;
			// this.talkTxt.width = 255;
			// this.talkTxt.wordWrap = true;
			// this.talkTxt.textAlign = egret.HorizontalAlign.CENTER;
			this.talkTxt.strokeColor = 0x000000;
			this.talkTxt.stroke = 2;
			// this.talkTxt.x = this.gTalkBg.x + 2;
			// this.talkTxt.y = this.gTalkBg.y - 9;//-214;-this.gModelHeight - 59;
			this.talkTxt.lineSpacing = 8;
			
		}
		this.talkTxt.textFlow = HtmlUtil.parser(content);
		let _str:string = this.talkTxt.text;
		let _singleByteCount:number = 0;
		let _doubleByteCount:number = 0;
		for (let i = 0; i < _str.length; i++) {
			let charCode = _str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) 
				_singleByteCount += 1;
			else 
				_doubleByteCount += 1;
		}
		let _width:number = (_singleByteCount*9 + _doubleByteCount*18);
		// if(_singleByteCount > 0) _width += (_singleByteCount + 9);
		this.talkTxt.width = Math.min(_width,255);
		this.gTalkBg.width = Math.min(_width + 50,305);
		
		// this.gTalkBg.x = this.originX + 112 - (305 - this.gTalkBg.width) / 2;
		// this.talkTxt.x = this.gTalkBg.x + 2;
		
		this.gTalkBg.height = this.talkTxt.textHeight + 64;
		AnchorUtil.setAnchor(this.talkTxt, 0.5);
		
		this.txtParent.addChild(this.gTalkBg.displayObject);
		this.txtParent.addChild(this.talkTxt);
		// _avatarCom.bodyTalkLayer.addChild(this.gTalkBg.displayObject);
		// _avatarCom.bodyTalkLayer.addChild(this.talkTxt);
		this.gTime = time;
		this.updatePos();
	}

	public update(advancedTime: number): void 
	{
		this.updatePos();
		if(!this.canUpdate) return;
		let time:number = egret.getTimer();
		if(time - this.updateTime >= 1000) {
			this.updateTime = time;
			if(this.gTime != 0)
			{
				this.gTime --;
				if(this.gTime <= 0)
				{
					this.gTime = 0;
					this.removeTalk();
					if(this.gTalkQueue.length > 0)
					{
						let _data:any = this.gTalkQueue.shift();
						this.talk(_data.content,_data.time);
					}
				}
			}
			if(!this.entity || this.entity.objType != RpgObjectType.Pet) return;
			/**宠物定时类型说话逻辑 */
			this.gPetTalkTime ++;
			if(!this.gPetTalkData) 
			{
				this.gPetTalkData = ConfigManager.petTalk.getRandomTalkData(PetTalkCondition.TimeCD);
				// if(this.gPetTalkData) Log.trace("get petTalk config",this.gPetTalkData.value + "秒后" + this.gPetTalkData.rate +  "%概率触发")
			}
			if(!this.gPetTalkData) 
			{
				this.gPetTalkTime = 0;
				return;
			}
			if(Number(this.gPetTalkData.value) == this.gPetTalkTime)
			{
				let _content:string = this.gPetTalkData.content;
				this.talk(_content,this.gPetTalkData.durationTime);
				this.gPetTalkTime = 0;
				this.gPetTalkData = null;
			}
		}
	}

	private updatePos():void {
		if(this.talkTxt && this.talkTxt.parent) {
			let king:MainPlayer = CacheManager.king.leaderEntity;
			if(king) {
				if(this.entity.col - king.col > 1) {
					this.gTalkBg.scaleX = -1;
				}
				else if(king.col - this.entity.col > 1) {
					this.gTalkBg.scaleX = 1;
				}
			}
			let posX:number = this.originX + (110 * this.gTalkBg.scaleX) - ((305 - this.gTalkBg.width) / 2) * this.gTalkBg.scaleX;
			let posY:number = this.originY - this.gModelHeight - 10;
			this.gTalkBg.x = posX;
			this.gTalkBg.y = posY;

			this.talkTxt.x = posX + 2;
			this.talkTxt.y = posY - 9;
		}
	}

	private removeTalk():void
	{
		if(this.gTalkBg) 
		{
			App.DisplayUtils.removeFromParent(this.gTalkBg.displayObject);
			App.DisplayUtils.removeFromParent(this.talkTxt);
		}
	}

	private get txtParent():egret.DisplayObjectContainer{
        return ControllerManager.rpgGame.view.getGameTalkLayer();
    }

	private get originX():number {
        return this.entity.x + this.entity.avatar.bodyAll.x;
    }

    private get originY():number {
        return this.entity.y + this.entity.avatar.bodyAll.y;
    }

	public stop():void
	{
		this.removeTalk();
		super.stop();
		this.canUpdate = false;
		this.gModelHeight = NaN;
		this.gTalkBg = null;
		this.talkTxt = null;
		this.gTime = 0;
		this.gPetTalkTime = 0;
		this.gPetTalkData = null;
		this.gTalkQueue = [];
	}
}

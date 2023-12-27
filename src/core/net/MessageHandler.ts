/**公共消息监听 */
class MessageHandler {
	private fightAttributeCommand:FightAttributeCommand = new FightAttributeCommand();

	public constructor() {
	}

	public init():void{
		this.regHandler(EGateCommand[EGateCommand.ECmdGateRoleUpdate], new RoleAttributeUpdateCommand());//角色属性更新
		this.regHandler(EPublicCommand[EPublicCommand.ECmdPublicFightAttributeBase], this.fightAttributeCommand);//战斗属性更新
		this.regHandler(EPublicCommand[EPublicCommand.ECmdPublicFightAttributeAdd], this.fightAttributeCommand);
		this.regHandler(EPublicCommand[EPublicCommand.ECmdPublicFightAttribute], this.fightAttributeCommand);
		this.regHandler(EPublicCommand[EPublicCommand.ECmdPublicFightAttributeNotShow], this.fightAttributeCommand);
		this.regHandler(EGateCommand[EGateCommand.ECmdGateBag], new PackInfoCommand());//整个背包
		this.regHandler(EGateCommand[EGateCommand.ECmdGatePlayerItemUpdate], new PackItemUpdateCommand());//单个或者多个物品更新
		this.regHandler(EGateCommand[EGateCommand.ECmdGateBagCapacityChange], new PackCapacityChangeCommand());//背包背包容量更新

		this.regHandler(EGateCommand[EGateCommand.ECmdGateMoneyUpdate], new MoneyUpdateCommand());//金钱更新

		// this.regHandler2(ECmdBroadCast[ECmdBroadCast.ECmdBroadcaseEntityInfoToMySelf], this.mySelfUpdate, this);
	}

	private regHandler(cmd:string, command:ICommand):void{
		App.MessageCenter.addListener(cmd, command.onMessage, command);
	}

	private regHandler2(cmd:string, listener:Function, listenerObj:any):void{
		App.MessageCenter.addListener(cmd, listener, listenerObj);
	}

	// private mySelfUpdate(entityInfo):void{
	// 	Log.trace("MySelf", entityInfo)
	// }
}
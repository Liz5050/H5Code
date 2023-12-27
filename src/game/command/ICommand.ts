interface ICommand {
	/**
	 * @param data 数据
	 * @param msgId 消息id
	 */
	onMessage(data:any, msgId:number);
}
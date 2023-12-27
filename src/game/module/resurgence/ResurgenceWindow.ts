/**
 * 复活框 （已经弃用了）
 */
class ResurgenceWindow extends BaseReviveWindow{
	private static _instance:ResurgenceWindow;
	public constructor() {
		super("WindowRevive");
	}
	public static get instance():ResurgenceWindow{
		if(ResurgenceWindow._instance == null){
			ResurgenceWindow._instance = new ResurgenceWindow();
		}
		return ResurgenceWindow._instance;
	}
}
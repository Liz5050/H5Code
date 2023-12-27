class Init {
	// UIExtensionManager.init();
	public static init() {
		ConfigManager.init();
		CacheManager.init();
		ControllerManager.init();
		let messageHandler: MessageHandler = new MessageHandler();
		messageHandler.init();
		ProxyManager.init();
	}

	public static init_before_newbie() {
		CacheManager.initCreateRole();
		ControllerManager.initCreateRole();
		ControllerManager.initLogin();
		ControllerManager.initMsgBroadcast();
		let messageHandler: MessageHandler = new MessageHandler();
		messageHandler.init();
		ProxyManager.initCreateRole();
	}

	public static init_after_newbie() {
		ConfigManager.init();
		CacheManager.init();
		ControllerManager.init();
		ProxyManager.init();
	}
}
class GUIUtils {
    private static navBtnNames: Array<string> = ["btn_train", "btn_switch"];

	public static getRedTips(com: fairygui.GComponent = null): fairygui.GImage {
		if (com instanceof BaseIcon) {
			return GUIUtils.getGImage(PackNameEnum.HomeIcon, "redPoint");
		} else if (com instanceof MainIconButton || GUIUtils.navBtnNames.indexOf(com.name) != -1) {
			return GUIUtils.getGImage(PackNameEnum.Navbar, "redPoint");
		} else {
			return GUIUtils.getGImage(PackNameEnum.Common, "redPoint");
		}
	}

	public static getGImage(pkgName: string, resId: string): fairygui.GImage {
		return fairygui.UIPackage.createObject(pkgName, resId).asImage;
	}

}
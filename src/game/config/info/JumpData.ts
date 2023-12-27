/**
 * 跳跃点
 */
class JumpData {
    public fromX: number;
    public fromY: number;
    public toX: number;
    public toY: number;

	public constructor(fromX: number, fromY: number, toX: number, toY: number) {
		this.fromX = fromX;
		this.fromY = fromY;
		this.toX = toX;
		this.toY = toY;
	}

    public toString(): String {
        return "fromX:" + this.fromX + " fromY:" + this.fromY + " toX:" + this.toX + " toY:" + this.toY;
    }
}

enum EJumpType {
    CheckPoint,
    CheckPointBoss,
    Normal
}
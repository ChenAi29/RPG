import { Player } from "./Player";

/*
 * @Author: Xiong ZhiCheng 
 * @Date: 2021-02-18 13:43:22 
 * @Description: 
 */
declare global {
    interface Window {
        appContext: AppContext;
    }
    let appContext: AppContext;
}

const { ccclass, property } = cc._decorator;

@ccclass
export class AppContext extends cc.Component {

    @property({ displayName: "map", type: cc.Node })
    private map: cc.Node = null;

    @property({ displayName: "role", type: Player })
    private player: Player = null;

    @property({ displayName: "摄像机", type: cc.Node })
    public cameraNode: cc.Node = null;

    public onEnable(): void {
        this.map.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    public onDisable(): void {
        this.map.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    private touchEnd(touch: cc.Event.EventTouch): void {
        let touchLocation = touch.getLocation().clone();
        let targetPos = touchLocation.add(this.cameraNode.getPosition());
        this.player.move(targetPos);
    }

    public onLoad(): void {
        window.appContext = this;

        this.map.x = -cc.Canvas.instance.node.width / 2;
        this.map.y = -cc.Canvas.instance.node.height / 2;
        this.refreshCamera(this.player.node.getPosition());
    }

    public update(dt: number): void {
        this.player && this.player.updateSelf(dt);
    }

    public refreshCamera(pos: cc.Vec2): void {
        let maxX = this.map.width - cc.Canvas.instance.node.width;
        let maxY = this.map.height - cc.Canvas.instance.node.height;
        let x = cc.misc.clampf(pos.x, 0, maxX);
        let y = cc.misc.clampf(pos.y, 0, maxY);
        this.cameraNode.setPosition(x, y);
    }
}

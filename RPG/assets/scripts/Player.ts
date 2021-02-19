/*
 * @Author: Xiong ZhiCheng 
 * @Date: 2021-01-19 15:43:56 
 * @Description: 
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class Player extends cc.Component {

    private startPos: cc.Vec2 = null;
    private targetPos: cc.Vec2 = null;
    private currentPos: cc.Vec2 = null;

    private movedDis: number = 0;
    private targetDis: number = 0;

    private moveSpeed: number = 200;

    private arrived: boolean = true;

    public move(targetPos: cc.Vec2): void {
        let a = targetPos.clone();
        let pos = this.node.parent.convertToNodeSpaceAR(a);
        this.arrived = false;
        let currentPos = this.node.getPosition();

        // 计算并缓存位置信息
        this.currentPos = currentPos;
        this.startPos = currentPos.clone();
        this.targetPos = pos;

        this.movedDis = 0;
        this.targetDis = cc.Vec2.distance(currentPos, this.targetPos);
    }

    public updateSelf(dt: number): void {
        if (this.arrived) {
            return;
        }
        let distance = this.moveSpeed * dt;
        this.movedDis += distance;

        let process = this.movedDis / this.targetDis;
        if (process < 1) {
            cc.Vec2.lerp(this.currentPos, this.startPos, this.targetPos, this.movedDis / this.targetDis);
            this.node.setPosition(this.currentPos);
        } else {
            this.node.setPosition(this.targetPos);
            this.arrived = true;
        }

        appContext.refreshCamera(this.currentPos);
    }
}
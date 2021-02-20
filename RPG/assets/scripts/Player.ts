import { AnimationEnum } from "./const/AnimationEnum";

/*
 * @Author: Xiong ZhiCheng 
 * @Date: 2021-01-19 15:43:56 
 * @Description: 
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class Player extends cc.Component {

    @property({ displayName: "动画", type: cc.Animation })
    private anim: cc.Animation = null;

    private startPos: cc.Vec2 = null;
    private targetPos: cc.Vec2 = null;
    private currentPos: cc.Vec2 = null;

    private movedDis: number = 0;
    private targetDis: number = 0;

    private moveSpeed: number = 200;

    private arrived: boolean = true;

    private curAnimName: string = "";

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
        this.refreshMoveAnim();
    }

    private refreshMoveAnim(): void {
        let sub = this.targetPos.sub(this.currentPos);
        let angle = -sub.signAngle(cc.v2(1, 0)) * 180 / Math.PI;
        let animName = "";
        if (angle < 22.5 && angle >= -22.5) {
            animName = AnimationEnum.MOVE_RIGHT;
        } else if (angle >= 22.5 && angle < 67.5) {
            animName = AnimationEnum.MOVE_UP_RIGHT;
        } else if (angle >= 67.5 && angle < 112.5) {
            animName = AnimationEnum.MOVE_UP;
        } else if (angle >= 112.5 && angle < 157.5) {
            animName = AnimationEnum.MOVE_UP_LEFT;
        } else if (angle >= 157.5 || angle < -157.5) {
            animName = AnimationEnum.MOVE_LEFT;
        } else if (angle >= -157.5 && angle < -112.5) {
            animName = AnimationEnum.MOVE_DOWN_LEFT;
        } else if (angle >= -112.5 && angle < -67.5) {
            animName = AnimationEnum.MOVE_DOWN;
        } else if (angle >= -67.5 && angle < -22.5) {
            animName = AnimationEnum.MOVE_DOWN_RIGHT;
        }

        animName = "player_1_" + animName;
        if (animName == this.curAnimName) {
            return;
        }
        this.curAnimName = animName;
        let anim = this.anim.play(animName);
        anim.wrapMode = cc.WrapMode.Loop;
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

            let animName = "player_1_stand";
            let anim = this.anim.play(animName);
            anim.wrapMode = cc.WrapMode.Loop;
        }

        appContext.refreshCamera(this.currentPos);
    }
}
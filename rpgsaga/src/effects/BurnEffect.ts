import { type IEffect, EffectType } from './IEffect';
import { Hero } from '../models/Hero';
import { Logger } from '../logging/Logger';

export class BurnEffect implements IEffect {
    readonly type = EffectType.Burn;
    readonly name = 'Горение';
    remainingTurns: number;
    
    constructor(
        readonly damagePerTurn: number,
        readonly duration: number
    ) {
        this.remainingTurns = duration;
    }
    
    apply(target: Hero): void {
        Logger.log(`${target.toString()} загорается! Будет получать ${this.damagePerTurn} урона каждый ход в течение ${this.duration} ходов`);
    }
    
    onTurnEnd(target: Hero): void {
        if (this.remainingTurns > 0) {
            target.takeDamage(this.damagePerTurn);
            // this.remainingTurns--;
            Logger.log(`${target.toString()} горит и теряет ${this.damagePerTurn} здоровья`);
        }
    }
    
    merge(effect: IEffect): void {
        if (effect.type === this.type) {
            this.remainingTurns = Math.min(5, Math.max(this.remainingTurns, effect.remainingTurns));
            Logger.log(`Эффект горения усилен! Урон: ${this.damagePerTurn}, осталось ходов: ${this.remainingTurns}`);
        }
    }
}
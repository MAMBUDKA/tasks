import { type IEffect, EffectType } from './IEffect';
import { Hero } from '../models/Hero';
import { Logger } from '../logging/Logger';

export class PoisonEffect implements IEffect {
    readonly type = EffectType.Poison;
    readonly name = 'Отравление';
    remainingTurns: number;
    
    constructor(
        readonly damagePerTurn: number,
        readonly duration: number
    ) {
        this.remainingTurns = duration;
    }
    
    apply(target: Hero): void {
        Logger.log(`${target.toString()} отравлен! Будет получать ${this.damagePerTurn} урона каждый ход в течение ${this.duration} ходов`);
    }
    
    onTurnEnd(target: Hero): void {
        target.takeDamage(this.damagePerTurn);
        Logger.log(`${target.toString()} страдает от отравления и теряет ${this.damagePerTurn} здоровья`);
    }
    
    merge(effect: IEffect): void {
        if (effect.type === this.type && effect instanceof PoisonEffect) {
            this.remainingTurns = Math.min(5, this.remainingTurns + effect.remainingTurns);
            Logger.log(`Эффект отравления продлён! Осталось ходов: ${this.remainingTurns}`);
        }
    }
}

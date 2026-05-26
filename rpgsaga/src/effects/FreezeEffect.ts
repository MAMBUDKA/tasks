import { type IEffect, EffectType } from './IEffect';
import { Hero } from '../models/Hero';
import { Logger } from '../logging/Logger';

export class FreezeEffect implements IEffect {
    readonly type = EffectType.Freeze;
    readonly name = 'Заморозка';
    remainingTurns: number;
    
    constructor(
        readonly damagePerTurn: number,
        readonly duration: number
    ) {
        this.remainingTurns = duration;
    }
    
    apply(target: Hero): void {
        Logger.log(`${target.toString()} заморожен! Будет получать ${this.damagePerTurn} урона каждый ход в течение ${this.duration} ходов`);
    }
    
    onTurnEnd(target: Hero): void {
        target.takeDamage(this.damagePerTurn);
        Logger.log(`${target.toString()} заморожен и теряет ${this.damagePerTurn} здоровья`);
    }
    
    merge(effect: IEffect): void {
        if (effect.type === this.type) {
            const newDamage = this.damagePerTurn + effect.damagePerTurn;
            Logger.log(`Эффект заморозки суммируется! Урон увеличен с ${this.damagePerTurn} до ${newDamage}`);
        }
    }
}
import { Hero } from './Hero';
import type { IEffect } from '../effects/IEffect';
import { BurnEffect } from '../effects/BurnEffect';
import { FreezeEffect } from '../effects/FreezeEffect';
import { PoisonEffect } from '../effects/PoisonEffect';
import { Logger } from '../logging/Logger';

export class Archer extends Hero {
    private _fireArrowsUsed = false;
    private _iceArrowsUsedCount = 0;
    private _poisonArrowsUsedCount = 0;
     private static readonly MAX_POISON_ARROWS = 3;

    constructor(name: string, health: number, strength: number) {
        super(name, health, strength);
    }
    
    calculateBaseDamage(): number {
        let damage = this._strength;
        
        return damage;
    }
    
    useSpecialAbility(target: Hero): void {
        if (!this._fireArrowsUsed) {
            this._fireArrowsUsed = true;
            const burnEffect = new BurnEffect(2, 3);
            target.applyEffect(burnEffect);
            Logger.log(`${this.toString()} использует Огненные стрелы! ${target.toString()} загорается (2 урона, 3 хода)`);
            return;
        }
        
        if (this._iceArrowsUsedCount < 2) {
            this._iceArrowsUsedCount++;
            const freezeEffect = new FreezeEffect(3, 3);
            target.applyEffect(freezeEffect);
            Logger.log(`${this.toString()} использует Ледяные стрелы! ${target.toString()} заморожен (3 урона, 3 хода)`);
            return;
        }
        
        if (this._poisonArrowsUsedCount < Archer.MAX_POISON_ARROWS) {
                    this._poisonArrowsUsedCount++;
                    const poisonEffect = new PoisonEffect(4, 4);
                    target.applyEffect(poisonEffect);
                    Logger.log(`${this.toString()} использует Отравленные стрелы! ${target.toString()} отравлен (4 урона, 4 хода)`);
                    return;
                }
                Logger.log(`${this.toString()} не может использовать Отравленные стрелы (максимум ${Archer.MAX_POISON_ARROWS} раза)`);

        const damage = this.calculateBaseDamage();
        Logger.log(`${this.toString()} наносит урон ${damage} ${target.toString()}`);
        target.takeDamage(damage);        
    }
    
    applyEffect(effect: IEffect): void {
        super.applyEffect(effect);
    }
}
import { Hero } from './Hero';
import { type IEffect, EffectType } from '../effects/IEffect';
import { Logger } from '../logging/Logger';

export class Mage extends Hero {
    private _charmedTarget: Hero | null = null;
    private _charmUsed = false;
    private _healUsed = false;
    private static readonly IMMUNE_EFFECTS: EffectType[] = [EffectType.Freeze, EffectType.Poison];
    
    constructor(name: string, health: number, strength: number) {
        super(name, strength, health);
    }
    
    calculateBaseDamage(): number {
        return Math.floor(this._strength * 1.2);
    }
    
    useSpecialAbility(target: Hero): void {
        if (!this._charmUsed) {
            this._charmUsed = true;
            this._charmedTarget = target;
            Logger.log(`${this.toString()} использует Заворожение! ${target.toString()} пропускает следующий ход`);
            return;
        }
        
        if (!this._healUsed && this.health < this.maxHealth * 0.5) {
            this._healUsed = true;
            const healAmount = Math.floor(this.maxHealth * 0.3);
            this.heal(healAmount);
            Logger.log(`${this.toString()} использует Лечение! Восстанавливает ${healAmount} здоровья`);
            return;
        }
        
        const damage = this.calculateBaseDamage();
        Logger.log(`${this.toString()} наносит урон ${damage} ${target.toString()}`);
        target.takeDamage(damage);
    }
    
    shouldSkipTurn(): boolean {
        return false;
    }
    
    isCharmedBy(target: Hero): boolean {
        return this._charmedTarget === target;
    }
    
    clearCharm(): void {
        this._charmedTarget = null;
    }
    
    protected modifyIncomingDamage(damage: number): number {
        const reducedDamage = Math.floor(damage * 0.95);
        if (reducedDamage !== damage) {
            Logger.log(`${this.toString()} магическая броня снижает урон с ${damage} до ${reducedDamage}`);
        }
        return reducedDamage;
    }
    
    applyEffect(effect: IEffect): void {
        if (Mage.IMMUNE_EFFECTS.includes(effect.type)) {
            Logger.log(`${this.toString()} невосприимчив к ${effect.name} и игнорирует эффект`);
            return;
        }
        
        if (effect.type === EffectType.Burn && this._healUsed) {
            Logger.log(`${this.toString()} снимает эффект ${effect.name} лечением`);
            return;
        }
        
        super.applyEffect(effect);
    }
    
    removeAllNegativeEffects(): void {
        this._activeEffects = [];
        Logger.log(`${this.toString()} очищает все негативные эффекты`);
    }
    
    toString(): string {
        return `Маг ${this.name}`;
    }
}
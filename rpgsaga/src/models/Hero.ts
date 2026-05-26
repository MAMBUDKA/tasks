import type { EffectType, IEffect } from '../effects/IEffect';
import { Logger } from '../logging/Logger';

export abstract class Hero {
    private _health: number;
    private readonly _maxHealth: number;
    protected _activeEffects: IEffect[] = [];
    
    constructor(
        public readonly name: string,
        protected _strength: number,
        initialHealth: number
    ) {
        this._health = initialHealth;
        this._maxHealth = initialHealth;
    }
    
    get health(): number { return this._health; }
    get maxHealth(): number { return this._maxHealth; }
    get strength(): number { return this._strength; }
    get isAlive(): boolean { return this._health > 0; }
    get activeEffects(): readonly IEffect[] { return this._activeEffects; }
    
    takeDamage(damage: number): void {
        const actualDamage = this.modifyIncomingDamage(damage);
        this._health = Math.max(0, this._health - actualDamage);
        Logger.log(`${this.toString()} получает ${actualDamage} урона. Осталось здоровья: ${this._health}`);
        
        if (!this.isAlive) {
            Logger.log(`${this.toString()} погибает!`);
        }
    }
    
    heal(amount: number): void {
        this._health = Math.min(this._maxHealth, this._health + amount);
        Logger.log(`${this.toString()} восстанавливает ${amount} здоровья. Здоровье: ${this._health}`);
    }
    
    protected modifyIncomingDamage(damage: number): number {
        return damage;
    }
    
    abstract calculateBaseDamage(): number;
    abstract useSpecialAbility(target: Hero): void;
    
    applyEffect(effect: IEffect): void {
        const existingEffect = this._activeEffects.find(e => e.type === effect.type);
        if (existingEffect) {
            existingEffect.merge(effect);
            Logger.log(`${this.toString()}: эффект ${effect.name} обновлён (осталось ${existingEffect.remainingTurns} ходов)`);
        } else {
            this._activeEffects.push(effect);
            effect.apply(this);
            Logger.log(`${this.toString()}: применён эффект ${effect.name} на ${effect.duration} ходов`);
        }
    }
    
    processEffects(): void {
        for (let i = this._activeEffects.length - 1; i >= 0; i--) {
            const effect = this._activeEffects[i];
            effect.onTurnEnd(this);
            effect.remainingTurns--;
            
            if (effect.remainingTurns <= 0) {
                this._activeEffects.splice(i, 1);
                Logger.log(`${this.toString()}: эффект ${effect.name} закончился`);
            }
        }
    }
    
    removeEffectsByType(type: EffectType): void {
        this._activeEffects = this._activeEffects.filter(e => e.type !== type);
        Logger.log(`${this.toString()}: все эффекты типа ${type} удалены`);
    }
    
    toString(): string {
        return `${this.constructor.name} ${this.name}`;
    }
}
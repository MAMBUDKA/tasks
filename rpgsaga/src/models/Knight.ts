import { Hero } from './Hero';
import { Logger } from '../logging/Logger';

export class Knight extends Hero {
    constructor(name: string, health: number, strength: number) {
        super(name, strength, health);
    }
    
    calculateBaseDamage(): number {
        return this._strength;
    }
    
    useSpecialAbility(target: Hero): void {
        const bonus = Math.floor(this._strength * 0.3);
        const totalDamage = this._strength + bonus;
        
        Logger.log(`${this.toString()} использует Удар возмездия и наносит ${totalDamage} урона ${target.toString()}`);
        target.takeDamage(totalDamage);
    }
    
    protected modifyIncomingDamage(damage: number): number {
        const reducedDamage = Math.floor(damage * 0.9);
        if (reducedDamage !== damage) {
            Logger.log(`${this.toString()} броня снижает урон с ${damage} до ${reducedDamage}`);
        }
        return reducedDamage;
    }
}
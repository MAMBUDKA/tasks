import { Hero } from '../models/Hero';
import { EffectManager } from '../effects/EffectManager';
import { Logger } from '../logging/Logger';

export interface BattleResult {
    winner: Hero;
    loser: Hero;
    turns: number;
    damageDealt: number;
    specialAbilitiesUsed: Map<string, number>;
}

export class BattleManager {
    private effectManager = EffectManager.getInstance();
    private turnCount = 0;
    private totalDamageDealt = 0;
    private abilitiesUsed: Map<string, number> = new Map();
    
    async fight(hero1: Hero, hero2: Hero): Promise<BattleResult> {
        Logger.log(`\n НАЧАЛО БИТВЫ: ${hero1.toString()} vs ${hero2.toString()} \n`);
        
        this.turnCount = 0;
        this.totalDamageDealt = 0;
        this.abilitiesUsed.clear();
        
        let attacker = this.determineFirstAttacker(hero1, hero2);
        let defender = attacker === hero1 ? hero2 : hero1;
        
        while (hero1.isAlive && hero2.isAlive) {
            this.executeTurn(attacker, defender);
            this.turnCount++;
            
            [attacker, defender] = [defender, attacker];
        }
        
        const winner = hero1.isAlive ? hero1 : hero2;
        const loser = winner === hero1 ? hero2 : hero1;
        
        Logger.log(`\n ПОБЕДИТЕЛЬ: ${winner.toString()} `);
        
        return {
            winner,
            loser,
            turns: this.turnCount,
            damageDealt: this.totalDamageDealt,
            specialAbilitiesUsed: new Map(this.abilitiesUsed)
        };
    }
    
    private determineFirstAttacker(hero1: Hero, hero2: Hero): Hero {
        const hero1Chance = hero1.strength / (hero1.strength + hero2.strength);
        const isHero1First = Math.random() < hero1Chance;
        
        Logger.log(`Определение первого атакующего: ${hero1.toString()} (${Math.round(hero1Chance * 100)}% шанс)`);
        
        return isHero1First ? hero1 : hero2;
    }
    
    private executeTurn(attacker: Hero, defender: Hero): void {
        this.effectManager.processAllEffects([attacker, defender]);
        
        if (!attacker.isAlive || !defender.isAlive) return;
        
        if (this.isHeroCharmed(attacker, defender)) {
            Logger.log(`${attacker.toString()} заворожён и пропускает ход!`);
            return;
        }
        
        const useSpecial = this.shouldUseSpecialAbility(attacker);
        const damageBefore = defender.health;
        
        if (useSpecial) {
            attacker.useSpecialAbility(defender);
            this.trackAbilityUsage(attacker);
        } else {
            const damage = attacker.calculateBaseDamage();
            Logger.log(`${attacker.toString()} наносит урон ${damage} ${defender.toString()}`);
            defender.takeDamage(damage);
        }
        
        const damageDealt = damageBefore - defender.health;
        this.totalDamageDealt += damageDealt;
        
        this.effectManager.processAllEffects([defender]);
    }
    
    private isHeroCharmed(attacker: Hero, defender: Hero): boolean {
        if (attacker.constructor.name === 'Mage') {
            const mage = attacker as any;
            return mage.isCharmedBy && mage.isCharmedBy(defender);
        }
        return false;
    }
    
    private shouldUseSpecialAbility(hero: Hero): boolean {
        const probabilities: Record<string, number> = {
            'Knight': 0.4,
            'Archer': 0.35,
            'Mage': 0.45
        };
        
        const probability = probabilities[hero.constructor.name] || 0.3;
        return Math.random() < probability;
    }
    
    private trackAbilityUsage(hero: Hero): void {
        const heroType = hero.constructor.name;
        const currentCount = this.abilitiesUsed.get(heroType) || 0;
        this.abilitiesUsed.set(heroType, currentCount + 1);
    }
    
    getStatistics(): {
        averageTurnsPerBattle: number;
        totalBattles: number;
        abilityUsageRate: Map<string, number>;
    } {
        return {
            averageTurnsPerBattle: 0,
            totalBattles: 0,
            abilityUsageRate: new Map()
        };
    }
}
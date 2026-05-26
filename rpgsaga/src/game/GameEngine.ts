import { Hero } from '../models/Hero';
import { Logger } from '../logging/Logger';

export class GameEngine {
    private heroes: Hero[];
    private round: number = 0;
    
    constructor(heroes: Hero[]) {
        this.heroes = [...heroes];
    }
    
    start(): Hero | null {
        Logger.log('========== НАЧАЛО ТУРНИРА ==========');
        
        while (this.heroes.length > 1) {
            this.runRound();
        }
        
        const winner = this.heroes[0];
        Logger.log(`\n========== ПОБЕДИТЕЛЬ: ${winner.toString()}! ==========`);
        Logger.saveToFile();
        return winner;
    }
    
    private runRound(): void {
        this.round++;
        Logger.log(`\n========== КОН ${this.round} ==========\n`);
        
        const shuffled = this.shuffleArray([...this.heroes]);
        const pairs: [Hero, Hero][] = [];
        
        for (let i = 0; i < shuffled.length; i += 2) {
            if (i + 1 < shuffled.length) {
                pairs.push([shuffled[i], shuffled[i + 1]]);
            }
        }
        
        const winners: Hero[] = [];
        
        for (const [hero1, hero2] of pairs) {
            Logger.log(`${hero1.toString()} vs ${hero2.toString()}\n`);
            const winner = this.battle(hero1, hero2);
            winners.push(winner);
        }
        
        this.heroes = winners;
    }
    
    private battle(hero1: Hero, hero2: Hero): Hero {
        let currentAttacker = Math.random() < 0.5 ? hero1 : hero2;
        let currentDefender = currentAttacker === hero1 ? hero2 : hero1;
        
        while (hero1.isAlive && hero2.isAlive) {
            this.makeTurn(currentAttacker, currentDefender);
            
            if (!currentDefender.isAlive) {
                Logger.log(`${currentDefender.toString()} погибает!\n`);
                return currentAttacker;
            }
            
            [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
        }
        
        return hero1.isAlive ? hero1 : hero2;
    }
    
    private makeTurn(attacker: Hero, defender: Hero): void {
        attacker.processEffects();
        defender.processEffects();
        
        if (!attacker.isAlive || !defender.isAlive) return;
        
        const useSpecial = Math.random() < 0.4;
        
        if (useSpecial) {
            attacker.useSpecialAbility(defender);
        } else {
            const damage = attacker.calculateBaseDamage();
            Logger.log(`${attacker.toString()} наносит урон ${damage} ${defender.toString()}`);
            defender.takeDamage(damage);
        }
    }
    
    private shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
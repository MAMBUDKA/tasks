import { Hero } from '../models/Hero';
import { Knight } from '../models/Knight';
import { Archer } from '../models/Archer';
import { Mage } from '../models/Mage';

export type HeroType = 'knight' | 'archer' | 'mage';

export interface HeroParams {
    name: string;
    health: number;
    strength: number;
}

export class HeroFactory {
    private static readonly NAMES = [
        'Артур', 'Эльдар', 'Гэндальф', 'Вильямс', 'Леголас', 
        'Арагорн', 'Гимли', 'Фродо', 'Саруман', 'Боромир',
        'Турин', 'Беовульф', 'Сигурд', 'Роланд', 'Ланселот'
    ];
    
    static createHero(type: HeroType, params: HeroParams): Hero {
        switch (type) {
            case 'knight':
                return new Knight(params.name, params.health, params.strength);
            case 'archer':
                return new Archer(params.name, params.health, params.strength);
            case 'mage':
                return new Mage(params.name, params.health, params.strength);
            default:
                throw new Error(`Unknown hero type: ${type}`);
        }
    }
    
    static createRandomHero(): Hero {
        const types: HeroType[] = ['knight', 'archer', 'mage'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomName = this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
        const randomHealth = Math.floor(Math.random() * (200 - 80 + 1) + 80);
        const randomStrength = Math.floor(Math.random() * (50 - 15 + 1) + 15);
        
        return this.createHero(randomType, {
            name: randomName,
            health: randomHealth,
            strength: randomStrength
        });
    }
    
    static createHeroesArray(count: number): Hero[] {
        if (count % 2 !== 0) {
            throw new Error('Количество игроков должно быть чётным');
        }
        
        const heroes: Hero[] = [];
        for (let i = 0; i < count; i++) {
            heroes.push(this.createRandomHero());
        }
        return heroes;
    }
}
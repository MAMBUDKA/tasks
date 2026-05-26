import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../../src/game/GameEngine';
import { BattleManager } from '../../src/game/BattleManager';
import { HeroFactory } from '../../src/factory/HeroFactory';
import { Knight } from '../../src/models/Knight';
import { Mage } from '../../src/models/Mage';
import { Logger } from '../../src/logging/Logger';

describe('GameEngine', () => {
    let gameEngine: GameEngine;

    beforeEach(() => {
        Logger.clear();
    });

    describe('constructor and initialization', () => {
        it('should create game engine with heroes array', () => {
            const heroes = HeroFactory.createHeroesArray(4);
            gameEngine = new GameEngine(heroes);
            expect(gameEngine).toBeDefined();
        });
    });

    describe('start - full tournament', () => {
        it('should return a single winner', () => {
            const heroes = HeroFactory.createHeroesArray(4);
            gameEngine = new GameEngine(heroes);
            const winner = gameEngine.start();
            expect(winner).toBeDefined();
            expect(winner.isAlive).toBe(true);
        });

        it('should log tournament start and end', () => {
            const heroes = HeroFactory.createHeroesArray(2);
            gameEngine = new GameEngine(heroes);
            gameEngine.start();
            const logs = Logger.getLogs();
            expect(logs.some(log => log.includes('НАЧАЛО ТУРНИРА'))).toBe(true);
            expect(logs.some(log => log.includes('ПОБЕДИТЕЛЬ'))).toBe(true);
        });

        it('should save logs to file', () => {
            const heroes = HeroFactory.createHeroesArray(2);
            gameEngine = new GameEngine(heroes);
            const saveSpy = jest.spyOn(Logger, 'saveToFile').mockImplementation(() => {});
            gameEngine.start();
            expect(saveSpy).toHaveBeenCalled();
            saveSpy.mockRestore();
        });
    });

    describe('BattleManager integration', () => {
        let battleManager: BattleManager;

        beforeEach(() => {
            battleManager = new BattleManager();
        });

        it('should correctly determine winner of a single battle', async () => {
            const hero1 = new Knight('Артур', 100, 30);
            const hero2 = new Mage('Гэндальф', 80, 25);
            const result = await battleManager.fight(hero1, hero2);
            expect(result.winner).toBeDefined();
            expect(result.loser).toBeDefined();
            expect(result.winner).not.toBe(result.loser);
            expect(result.turns).toBeGreaterThan(0);
            expect(result.damageDealt).toBeGreaterThan(0);
        });

        it('should record ability usage', async () => {
            const hero1 = new Knight('Артур', 100, 30);
            const hero2 = new Knight('Ланселот', 100, 30);
            const result = await battleManager.fight(hero1, hero2);
            expect(result.specialAbilitiesUsed).toBeDefined();
        });
    });
});
import { describe, it, expect, beforeEach } from 'vitest';
import { BurnEffect } from '../../src/effects/BurnEffect';
import { FreezeEffect } from '../../src/effects/FreezeEffect';
import { PoisonEffect } from '../../src/effects/PoisonEffect';
import { Knight } from '../../src/models/Knight';
import { Logger } from '../../src/logging/Logger';

describe('Effects', () => {
    let target: Knight;

    beforeEach(() => {
        Logger.clear();
        target = new Knight('Артур', 100, 30);
    });

    describe('BurnEffect', () => {
        let burn: BurnEffect;

        beforeEach(() => {
            burn = new BurnEffect(5, 3);
        });

        it('should have correct type and name', () => {
            expect(burn.type).toBe('burn');
            expect(burn.name).toBe('Горение');
        });

        it('should have correct damagePerTurn and duration', () => {
            expect(burn.damagePerTurn).toBe(5);
            expect(burn.remainingTurns).toBe(3);
        });

        it('should apply damage on onTurnEnd', () => {
            const initialHealth = target.health;
            burn.onTurnEnd(target);
            expect(target.health).toBe(initialHealth - 4);
        });

        it('should merge with another BurnEffect', () => {
            const burn2 = new BurnEffect(3, 2);
            burn.merge(burn2);
            expect(burn.remainingTurns).toBeGreaterThan(2);
        });

        it('should log application', () => {
            burn.apply(target);
            const logs = Logger.getLogs();
            expect(logs.some(log => log.includes('загорается'))).toBe(true);
        });
    });

    describe('FreezeEffect', () => {
        let freeze: FreezeEffect;

        beforeEach(() => {
            freeze = new FreezeEffect(3, 2);
        });

        it('should have correct type and name', () => {
            expect(freeze.type).toBe('freeze');
            expect(freeze.name).toBe('Заморозка');
        });

        it('should apply damage on onTurnEnd', () => {
            const initialHealth = target.health;
            freeze.onTurnEnd(target);
            expect(target.health).toBe(initialHealth - 2);
        });

        it('should decrease remainingTurns after processing', () => {
            expect(freeze.remainingTurns).toBe(2);
            freeze.onTurnEnd(target);
            freeze.remainingTurns--;
            expect(freeze.remainingTurns).toBe(1);
        });
    });

    describe('PoisonEffect', () => {
        let poison: PoisonEffect;

        beforeEach(() => {
            poison = new PoisonEffect(4, 4);
        });

        it('should have correct type and name', () => {
            expect(poison.type).toBe('poison');
            expect(poison.name).toBe('Отравление');
        });

        it('should apply damage on onTurnEnd', () => {
            const initialHealth = target.health;
            poison.onTurnEnd(target);
            expect(target.health).toBe(initialHealth - 3);
        });

        it('should merge and extend duration', () => {
            const poison2 = new PoisonEffect(4, 2);
            poison.merge(poison2);
            expect(poison.remainingTurns).toBe(5);
        });
    });
});
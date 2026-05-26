import { describe, it, expect, beforeEach } from 'vitest';
import { Hero } from '../../src/models/Hero';
import { BurnEffect } from '../../src/effects/BurnEffect';
import { Logger } from '../../src/logging/Logger';

class TestHero extends Hero {
    public calculateBaseDamage(): number {
        return this.strength;
    }

    public useSpecialAbility(target: Hero): void {
        target.takeDamage(this.strength);
    }

    public toString(): string {
        return `TestHero ${this.name}`;
    }
}

describe('Hero', () => {
    let hero: TestHero;

    beforeEach(() => {
        Logger.clear();
        hero = new TestHero('Тест', 100, 30);
    });

    describe('constructor and basic properties', () => {
        it('should set name correctly', () => {
            expect(hero.name).toBe('Тест');
        });

        it('should set health correctly', () => {
            expect(hero.health).toBe(100);
        });

        it('should set strength correctly', () => {
            expect(hero.strength).toBe(30);
        });

        it('should be alive when health > 0', () => {
            expect(hero.isAlive).toBe(true);
        });

        it('should have maxHealth equal to initial health', () => {
            expect(hero.maxHealth).toBe(100);
        });
    });

    describe('takeDamage', () => {
        it('should reduce health by damage amount', () => {
            hero.takeDamage(30);
            expect(hero.health).toBe(70);
        });

        it('should not reduce health below zero', () => {
            hero.takeDamage(150);
            expect(hero.health).toBe(0);
        });

        it('should set isAlive to false when health reaches zero', () => {
            hero.takeDamage(100);
            expect(hero.isAlive).toBe(false);
        });

        it('should log damage taken', () => {
            hero.takeDamage(25);
            const logs = Logger.getLogs();
            expect(logs.some(log => log.includes('получает 25 урона'))).toBe(true);
        });
    });

    describe('heal', () => {
        beforeEach(() => {
            hero.takeDamage(40);
        });

        it('should restore health by given amount', () => {
            hero.heal(20);
            expect(hero.health).toBe(80);
        });

        it('should not exceed maxHealth', () => {
            hero.heal(60);
            expect(hero.health).toBe(100);
        });
    });

    describe('applyEffect', () => {
        it('should add effect to activeEffects', () => {
            const burn = new BurnEffect(5, 3);
            hero.applyEffect(burn);
            expect(hero.activeEffects.length).toBe(1);
            expect(hero.activeEffects[0].name).toBe('Горение');
        });

        it('should merge effect of same type', () => {
            const burn1 = new BurnEffect(5, 3);
            const burn2 = new BurnEffect(3, 2);
            hero.applyEffect(burn1);
            hero.applyEffect(burn2);
            expect(hero.activeEffects.length).toBe(1);
            expect(hero.activeEffects[0].remainingTurns).toBeGreaterThan(2);
        });
    });

    describe('processEffects', () => {
        it('should apply damage from active effects', () => {
            const burn = new BurnEffect(10, 2);
            hero.applyEffect(burn);
            const initialHealth = hero.health;
            hero.processEffects();
            expect(hero.health).toBe(initialHealth - 10);
        });

        it('should remove expired effects', () => {
            const burn = new BurnEffect(5, 1);
            hero.applyEffect(burn);
            hero.processEffects();
            expect(hero.activeEffects.length).toBe(0);
        });
    });

    describe('removeEffectsByType', () => {
        it('should remove all effects of given type', () => {
            const burn = new BurnEffect(5, 3);
            hero.applyEffect(burn);
            expect(hero.activeEffects.length).toBe(1);
            hero.removeEffectsByType('burn');
            expect(hero.activeEffects.length).toBe(0);
        });
    });

    describe('toString', () => {
        it('should return correct string representation', () => {
            expect(hero.toString()).toBe('TestHero Тест');
        });
    });
});
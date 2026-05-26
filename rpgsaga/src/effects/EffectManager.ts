import { type IEffect, EffectType } from './IEffect';
import { Hero } from '../models/Hero';
import { Logger } from '../logging/Logger';

export class EffectManager {
    private static instance: EffectManager;
    private _globalEffects: Map<string, IEffect[]> = new Map();
    
    private constructor() {}
    
    static getInstance(): EffectManager {
        if (!EffectManager.instance) {
            EffectManager.instance = new EffectManager();
        }
        return EffectManager.instance;
    }
    
    applyEffect(target: Hero, effect: IEffect): void {
        if (this.hasImmunity(target, effect.type)) {
            Logger.log(`${target.toString()} иммунен к ${effect.name}`);
            return;
        }
        
        target.applyEffect(effect);
        this.trackGlobalEffect(target.name, effect);
    }
    
    private hasImmunity(target: Hero, effectType: EffectType): boolean {
        if (target.constructor.name === 'Mage') {
            return effectType === EffectType.Freeze || effectType === EffectType.Poison;
        }
        
        if (target.constructor.name === 'Knight') {
            return effectType === EffectType.Freeze;
        }
        
        return false;
    }
    
    private trackGlobalEffect(heroName: string, effect: IEffect): void {
        if (!this._globalEffects.has(heroName)) {
            this._globalEffects.set(heroName, []);
        }
        this._globalEffects.get(heroName)!.push(effect);
    }
    
    processAllEffects(heroes: Hero[]): void {
        for (const hero of heroes) {
            if (hero.isAlive) {
                hero.processEffects();
            }
        }
    }
    
    getActiveEffects(hero: Hero): IEffect[] {
        return [...hero.activeEffects];
    }
    
    clearAllEffects(hero: Hero): void {
        hero.removeEffectsByType(EffectType.Burn);
        hero.removeEffectsByType(EffectType.Freeze);
        hero.removeEffectsByType(EffectType.Poison);
        this._globalEffects.delete(hero.name);
    }
    
    getStatistics(): Map<string, number> {
        const stats = new Map<string, number>();
        
        for (const [heroName, effects] of this._globalEffects.entries()) {
            stats.set(heroName, effects.length);
        }
        
        return stats;
    }
}
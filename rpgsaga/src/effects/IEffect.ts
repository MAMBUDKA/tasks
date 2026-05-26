import type { Hero } from "../models/Hero";

export enum EffectType {
    Burn = 'burn',
    Freeze = 'freeze',
    Poison = 'poison'
}

export interface IEffect {
    readonly type: EffectType;
    readonly name: string;
    readonly duration: number;
    readonly damagePerTurn: number;
    remainingTurns: number;
    
    apply(target: Hero): void;
    onTurnEnd(target: Hero): void;
    merge(effect: IEffect): void;
}
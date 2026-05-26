import { describe, expect, it } from 'vitest';
import { calculateY, TaskA, TaskB } from '../task/Z4';

describe('Вариант 6: y = 1.2^x - x^1.2 (|x| >= 1)', () => {
    it('calculateY возвращает число для |x| >= 1 и null для |x| < 1', () => {
        expect(calculateY(1.0)).toBeCloseTo(0.2, 5);
        expect(calculateY(1.2)).toBeCloseTo(0.092351, 5);
        expect(calculateY(2.2)).toBeCloseTo(-0.615758, 5);
        
        expect(calculateY(0.5)).toBeNull();
        expect(calculateY(0.9)).toBeNull();
        expect(calculateY(-0.5)).toBeNull();
    });

    it('TaskA возвращает массив строк для x от 0.2 до 2.2 с шагом 0.4', () => {
        const results = TaskA(0.2, 2.2, 0.4);
        expect(results.length).toBe(6);
        
        expect(results[0]).toContain('x = 0.2000, y = не определено');
        expect(results[1]).toContain('x = 0.6000, y = не определено');
        expect(results[2]).toContain('x = 1.0000, y = 0.200000');
        expect(results[3]).toContain('x = 1.4000, y = 0.017960');
        expect(results[4]).toContain('x = 1.8000, y = -0.241074');
        expect(results[5]).toContain('x = 2.2000, y = -0.615758');
    });

    it('TaskB возвращает столько же строк, сколько точек передано', () => {
        const x_values = [0.1, 0.9, 1.2, 1.5, 2.3];
        const results = TaskB(x_values);
        
        expect(results.length).toBe(5);
        
        expect(results[0]).toContain('x1 = 0.1000, y = не определено');
        expect(results[1]).toContain('x2 = 0.9000, y = не определено');
        expect(results[2]).toContain('x3 = 1.2000, y = 0.092351');
        expect(results[3]).toContain('x4 = 1.5000, y = 0.025012');
        expect(results[4]).toContain('x5 = 2.3000, y = -0.746819');
    });
});
import { describe, expect, it } from 'vitest';
import { calculateY, TaskA, TaskB } from '../task/Z4';

describe('Вариант 6: y = 1.2^x - x^1.2 (|x| >= 1)', () => {
    it('calculateY возвращает число для |x| >= 1 и null для |x| < 1', () => {
        expect(calculateY(1.0)).toBeCloseTo(0.2, 5);
        expect(calculateY(1.2)).toBeCloseTo(0.0, 5);
        expect(calculateY(1.4)).toBeCloseTo(-0.20667, 5);
        expect(calculateY(2.2)).toBeCloseTo(-1.082293, 5);
        
        expect(calculateY(0.5)).toBeNull();
        expect(calculateY(0.9)).toBeNull();
        expect(calculateY(-0.5)).toBeNull();
    });

    it('TaskA возвращает массив строк для x от 0.2 до 2.2 с шагом 0.4', () => {
        const results = TaskA(0.2, 2.2, 0.4);
        expect(results.length).toBe(6);
        
        expect(results[0]).toMatch(/x = 0\.2000, y = не определено/);
        expect(results[1]).toMatch(/x = 0\.6000, y = не определено/);
        expect(results[2]).toMatch(/x = 1\.0000, y = 0\.200000/);
        expect(results[3]).toMatch(/x = 1\.4000, y = -0\.206670/);
        expect(results[4]).toMatch(/x = 1\.8000, y = -0\.636106/); 
        expect(results[5]).toMatch(/x = 2\.2000, y = -1\.082293/); 
    });

    it('TaskB возвращает столько же строк, сколько точек передано', () => {
        const x_values = [0.1, 0.9, 1.2, 1.5, 2.3];
        const results = TaskB(x_values);
        expect(results.length).toBe(5);
        
        expect(results[0]).toContain('x1 = 0.1000, y = не определено');
        expect(results[1]).toContain('x2 = 0.9000, y = не определено');
        expect(results[2]).toContain('x3 = 1.2000, y = 0.000000');
        expect(results[3]).toMatch(/x4 = 1\.5000, y = -0\.312174/);
        expect(results[4]).toMatch(/x5 = 2\.3000, y = -1\.195942/);
    });
});
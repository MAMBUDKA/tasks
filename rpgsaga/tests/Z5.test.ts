import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Phone } from '../task/Z5';

describe('Класс Phone', () => {
    let phone: Phone;

    beforeEach(() => {
        phone = new Phone('Samsung', 'Galaxy S23', '+7-999-123-45-67');
    });

    describe('Конструктор и getInfo', () => {
        it('должен корректно инициализировать объект и возвращать информацию', () => {
            expect(phone.getInfo()).toBe('Телефон: Samsung Galaxy S23, номер владельца: +7-999-123-45-67');
        });

        it('изначально номер вызываемого абонента должен быть пустой строкой', () => {
            expect(phone.getCallingNumber()).toBe('');
        });
    });

    describe('Метод setCallingNumber', () => {
        beforeEach(() => {
            vi.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('должен успешно устанавливать валидный номер абонента', () => {
            phone.setCallingNumber('+7-888-765-43-21');
            expect(phone.getCallingNumber()).toBe('+7-888-765-43-21');
            expect(console.log).toHaveBeenCalledWith('Номер вызываемого абонента установлен: +7-888-765-43-21');
        });

        it('не должен устанавливать пустую строку и выводить ошибку', () => {
            phone.setCallingNumber('   ');
            expect(phone.getCallingNumber()).toBe('');
            expect(console.log).toHaveBeenCalledWith('Ошибка: неверный номер абонента');
        });
    });

    describe('Метод dial', () => {
        it('должен возвращать предупреждение, если номер абонента не установлен', () => {
            expect(phone.dial()).toBe('Номер вызываемого абонента не задан. Используйте setCallingNumber().');
        });

        it('должен возвращать строку вызова, если номер установлен', () => {
            phone.setCallingNumber('+7-888-765-43-21');
            expect(phone.dial()).toBe('С телефона +7-999-123-45-67 (Samsung Galaxy S23) идёт вызов на +7-888-765-43-21...');
        });
    });

    describe('Метод hangUp', () => {
        it('должен корректно завершать вызов и очищать callingNumber', () => {
            phone.setCallingNumber('+7-888-765-43-21');
            
            const message = phone.hangUp();
            
            expect(message).toBe('Вызов на +7-888-765-43-21 завершён.');
            expect(phone.getCallingNumber()).toBe('');
        });
    });
});
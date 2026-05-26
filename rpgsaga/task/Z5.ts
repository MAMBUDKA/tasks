class Phone {
    private brand: string;
    private model: string;
    private myNumber: string;
    private callingNumber: string;

    constructor(brand: string, model: string, myNumber: string) {
        this.brand = brand;
        this.model = model;
        this.myNumber = myNumber;
        this.callingNumber = "";
    }

    public getCallingNumber(): string {
        return this.callingNumber;
    }

    public setCallingNumber(number: string): void {
        if (number && number.trim().length > 0) {
            this.callingNumber = number;
            console.log(`Номер вызываемого абонента установлен: ${this.callingNumber}`);
        } else {
            console.log("Ошибка: неверный номер абонента");
        }
    }

    public dial(): string {
        if (this.callingNumber && this.callingNumber !== "") {
            return `С телефона ${this.myNumber} (${this.brand} ${this.model}) идёт вызов на ${this.callingNumber}...`;
        } else {
            return "Номер вызываемого абонента не задан. Используйте setCallingNumber().";
        }
    }

    public getInfo(): string {
        return `Телефон: ${this.brand} ${this.model}, номер владельца: ${this.myNumber}`;
    }

    public hangUp(): string {
        const currentCall = this.callingNumber;
        this.callingNumber = "";
        return `Вызов на ${currentCall} завершён.`;
    }
}

// Пример использования
const myPhone = new Phone("Samsung", "Galaxy S23", "+7-999-123-45-67");

console.log(myPhone.getInfo());
console.log(myPhone.dial());

myPhone.setCallingNumber("+7-888-765-43-21");
console.log(myPhone.getCallingNumber());
console.log(myPhone.dial());

console.log(myPhone.hangUp());
console.log(myPhone.getCallingNumber());       
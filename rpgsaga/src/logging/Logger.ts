export class Logger {
    private static logs: string[] = [];
    private static readonly LOG_FILE = 'battle.log';
    
    static log(message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}`;
        this.logs.push(logMessage);
        console.log(message);
    }
    
    static getLogs(): string[] {
        return [...this.logs];
    }
    
    static clear(): void {
        this.logs = [];
    }

}
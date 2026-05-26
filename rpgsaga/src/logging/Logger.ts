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
    
    static saveToFile(): void {
        const blob = new Blob([this.logs.join('\n')], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = this.LOG_FILE;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}
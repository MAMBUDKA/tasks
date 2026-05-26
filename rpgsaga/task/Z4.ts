
export function calculateY(x: number): number | null {
    if (Math.abs(x) < 1) {
        return null;
    }
    return Math.pow(1.2, x) - Math.pow(x, 1.2);
}

export function TaskA(x_start: number, x_end: number, dx: number): string[] {
    const results: string[] = [];
    for (let x = x_start; x <= x_end + 1e-9; x += dx) {
        const y = calculateY(x);
        if (y !== null) {
            results.push(`x = ${x.toFixed(4)}, y = ${y.toFixed(6)}`);
        } else {
            results.push(`x = ${x.toFixed(4)}, y = не определено (|x| < 1)`);
        }
    }
    return results;
}

export function TaskB(x_values: number[]): string[] {
    const results: string[] = [];
    for (let i = 0; i < x_values.length; i++) {
        const x = x_values[i];
        const y = calculateY(x);
        if (y !== null) {
            results.push(`x${i+1} = ${x.toFixed(4)}, y = ${y.toFixed(6)}`);
        } else {
            results.push(`x${i+1} = ${x.toFixed(4)}, y = не определено (|x| < 1)`);
        }
    }
    return results;
}

const x_start_A = 0.2;
const x_end_A   = 2.2;
const delta_x   = 0.4;

const x_values_B: number[] = [0.1, 0.9, 1.2, 1.5, 2.3];

console.log("Задача А");
const resultsA = TaskA(x_start_A, x_end_A, delta_x);
for (const line of resultsA) {
    console.log(line);
}

console.log("\nЗадача Б");
const resultsB = TaskB(x_values_B);
for (const line of resultsB) {
    console.log(line);
}
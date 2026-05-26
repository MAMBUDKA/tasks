
function computeY(x: number): number {
    if (Math.abs(x) < 1) {
        return NaN;
    }
    return Math.pow(1.2, x) - Math.pow(x, 1.2);
}

function solveTaskA(x1: number, xk: number, deltaX: number): void {
    console.log("=== Задача А ===");
    console.log(`Аргументы от ${x1} до ${xk} с шагом ${deltaX}`);
    let x = x1;
    while (x <= xk + 1e-9) {
        const y = computeY(x);
        if (!isNaN(y)) {
            console.log(`x = ${x.toFixed(4)} -> y = ${y.toFixed(6)}`);
        } else {
            console.log(`x = ${x.toFixed(4)} -> не определено (|x| < 1)`);
        }
        x += deltaX;
        x = Math.round(x * 1e10) / 1e10; // борьба с погрешностями
    }
}

function solveTaskB(xValues: (number | undefined)[]): void {
    console.log("\n=== Задача В ===");
    for (let i = 0; i < xValues.length; i++) {
        const x = xValues[i];
        if (x === undefined || isNaN(x)) {
            console.log(`x${i+1} = не определено -> пропуск`);
            continue;
        }
        const y = computeY(x);
        if (!isNaN(y)) {
            console.log(`x${i+1} = ${x.toFixed(4)} -> y = ${y.toFixed(6)}`);
        } else {
            console.log(`x${i+1} = ${x.toFixed(4)} -> не определено (|x| < 1)`);
        }
    }
}

const taskAData = {
    x1: 0.2,
    xk: 2.2,
    deltaX: 0.4
};

const taskBData: number[] = [0.1, 0.9, 1.2, 1.5, 2.3];

solveTaskA(taskAData.x1, taskAData.xk, taskAData.deltaX);
solveTaskB(taskBData);

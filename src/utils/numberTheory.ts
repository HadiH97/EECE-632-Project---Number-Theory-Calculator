export class NumberTheory {
  static primeFactorization(n: number): { factors: { [key: number]: number }, steps: string[] } {
    const factors: { [key: number]: number } = {};
    const steps: string[] = [`We start with the number ${n}`];
    let num = n;
    
    for (let i = 2; i * i <= num; i++) {
      while (num % i === 0) {
        factors[i] = (factors[i] || 0) + 1;
        num /= i;
        steps.push(`We found a factor ${i}, dividing by it gives us ${num}`);
      }
    }
    
    if (num > 1) {
      factors[num] = 1;
      steps.push(`We found our final prime factor: ${num}`);
    }
    
    return { factors, steps };
  }

  static totient(n: number): { result: number, steps: string[] } {
    let result = n;
    const steps: string[] = [`We begin with n = ${n}`];
    let num = n;
    
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) {
        while (num % i === 0) {
          num /= i;
        }
        result -= result / i;
        steps.push(`We found prime factor ${i} and applied Euler's formula`);
      }
    }
    
    if (num > 1) {
      result -= result / num;
      steps.push(`We process our final prime factor ${num}`);
    }
    
    return { result, steps };
  }

  private static modPow(base: bigint, exponent: bigint, modulus: bigint): { result: bigint, steps: string[] } {
    const steps: string[] = [`Let's calculate ${base}^${exponent} mod ${modulus}`];
    
    if (modulus === 1n) {
      steps.push('Since modulus is 1, our result is 0');
      return { result: 0n, steps };
    }
    
    let result = 1n;
    base = base % modulus;
    steps.push(`We start with base = ${base}`);
    
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus;
        steps.push(`Exponent is odd, we multiply our result by base`);
      }
      base = (base * base) % modulus;
      exponent = exponent / 2n;
      steps.push(`We square our base and halve the exponent`);
    }
    
    return { result, steps };
  }

  static millerRabin(n: number): { isPrime: boolean, steps: string[] } {
    const steps: string[] = [`Let's test if ${n} is prime`];
    const nBig = BigInt(n);
    
    if (nBig <= 1n) {
      steps.push('Number is less than or equal to 1, not prime');
      return { isPrime: false, steps };
    }
    if (nBig <= 3n) {
      steps.push('Number is 2 or 3, definitely prime');
      return { isPrime: true, steps };
    }
    if (nBig % 2n === 0n) {
      steps.push('Number is even, not prime');
      return { isPrime: false, steps };
    }

    const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    
    for (const a of witnesses) {
      if (a >= nBig) break;
      steps.push(`We test with witness ${a}`);
      const { result: isPrime, steps: witnessSteps } = this.millerRabinTest(nBig, a);
      steps.push(...witnessSteps);
      if (!isPrime) {
        steps.push(`Our test failed with witness ${a}`);
        return { isPrime: false, steps };
      }
    }
    
    steps.push('All our tests passed, the number is prime');
    return { isPrime: true, steps };
  }

  private static millerRabinTest(n: bigint, a: bigint): { result: boolean, steps: string[] } {
    const steps: string[] = [`We test with base ${a}`];
    
    let d = n - 1n;
    let r = 0n;
    while (d % 2n === 0n) {
      d /= 2n;
      r += 1n;
    }
    steps.push(`We decomposed ${n}-1 into ${d} × 2^${r}`);

    const { result: x, steps: modSteps } = this.modPow(a, d, n);
    steps.push(...modSteps);
    
    if (x === 1n || x === n - 1n) {
      steps.push('Our test passed immediately');
      return { result: true, steps };
    }

    for (let i = 1n; i < r; i++) {
      const newX = (x * x) % n;
      steps.push(`We square and check our value`);
      if (newX === n - 1n) {
        steps.push('We found -1, test passed');
        return { result: true, steps };
      }
      if (newX === 1n) {
        steps.push('We found 1 too early, test failed');
        return { result: false, steps };
      }
    }
    
    steps.push('Our test failed');
    return { result: false, steps };
  }

  static fastExponentiation(base: number, exponent: number, modulus: number): { result: number, steps: string[] } {
    const steps: string[] = [`Let's calculate ${base}^${exponent} mod ${modulus}`];
    
    if (modulus === 1) {
      steps.push('Since modulus is 1, our result is 0');
      return { result: 0, steps };
    }
    
    let result = 1;
    base = base % modulus;
    steps.push(`We start with base = ${base}`);
    
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
        steps.push(`We multiply our result by base since exponent is odd`);
      }
      base = (base * base) % modulus;
      exponent = Math.floor(exponent / 2);
      steps.push(`We square our base and halve the exponent`);
    }
    
    return { result, steps };
  }

  static chineseRemainderTheorem(remainders: number[], moduli: number[]): { solution: number, modulus: number, steps: string[] } {
    const steps: string[] = ['We begin solving the system of congruences'];
    
    if (remainders.length !== moduli.length) {
      throw new Error('Number of remainders must equal number of moduli');
    }

    steps.push(`We have remainders [${remainders.join(', ')}]`);
    steps.push(`And moduli [${moduli.join(', ')}]`);

    const n = remainders.length;
    let product = 1;
    for (const mod of moduli) {
      product *= mod;
    }
    steps.push(`We calculate the product of moduli: ${product}`);

    let result = 0;
    for (let i = 0; i < n; i++) {
      const ni = product / moduli[i];
      steps.push(`We compute N${i} = ${ni}`);
      
      const xi = this.modularMultiplicativeInverse(ni, moduli[i]);
      steps.push(`We find the multiplicative inverse: ${xi}`);
      
      const term = remainders[i] * ni * xi;
      result += term;
      steps.push(`We add our term to the solution`);
    }

    const finalResult = ((result % product) + product) % product;
    steps.push(`We compute our final result mod ${product}`);

    return {
      solution: finalResult,
      modulus: product,
      steps
    };
  }

  private static modularMultiplicativeInverse(a: number, m: number): number {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x;
      }
    }
    return 1;
  }
}
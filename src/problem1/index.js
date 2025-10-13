var sum_to_n_a = function(n) {
    if (n <= 0) {
        return 0;
    }
    let total = 0;
    let index = n;
    while (index > 0) {
        total += index;
        index--;
    }
    return total;
};

var sum_to_n_b = function(n) {
    if (n <= 0) {
        return 0;
    }

    const reduce = (n) => {
        if (n === 1) return 1;
        return n + reduce(n - 1);
    }

    return reduce(n);
};

var sum_to_n_c = function(n) {
    if (n <= 0) {
        return 0;
    }
    return n * (n + 1) / 2;
};

console.log(sum_to_n_a(100));
console.log(sum_to_n_b(100));
console.log(sum_to_n_c(100));
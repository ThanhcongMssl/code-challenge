var sum_to_n_a = function(n) {
    return Array(n)
        .fill(0)
        .reduce((total, _, index) => {
            return total + (index + 1);
        }, 0);
};

var sum_to_n_b = function(n) {
    let total = 0;
    let index = n;
    while (index > 0) {
        total += index;
        index--;
    }
    return total;
};

var sum_to_n_c = function(n) {
    return n * (n + 1) / 2;
};

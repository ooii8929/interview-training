let ans = [];
var print = function (n) {
    ans.push(n);
    if (n > 1) print(n - 1);
    ans.push(n);
    return ans;
};
console.log(print(3));

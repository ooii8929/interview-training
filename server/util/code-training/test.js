/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function (s) {
  return s.split('').reverse().join('');
};
console.log(reverseString('hello'));

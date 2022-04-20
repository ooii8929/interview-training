function ListNode(val, next) {
     this.val = (val===undefined ? 0 : val)
     this.next = (next===undefined ? null : next)
}
 
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    
};console.log(addTwoNumbers({ val: 2, next: { val: 4, next: { val: 3, next: null } } },
    { val: 5, next: { val: 6, next: { val: 4, next: null } } }))
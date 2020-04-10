const path = require('path')
const Enum = require(path.resolve(__dirname, '..', 'dist', './enum.umd.js'))

let count = 0
function assert(cond, errMsg) {
    if (cond === false) {
        throw new Error(errMsg)
    }
    count += 1
}
// standard enum behavior
let foo = Enum('foo', [1, 2, 3])
foo = Enum('foo', [1, 2, 3])
foo = Enum('foo', { a: 1, b: 2, c: 3 })
foo = Enum('foo', { a: 1, b: 2, c: 3 })
foo = Enum('foo', [1, 2, 3])
assert(foo[1].val === 1, 'foo[1].val === 1')
assert(foo[2].val === 2, 'foo[2].val === 2')
assert(foo[3].val === 3, 'foo[3].val === 3')
assert(foo.has(1), 'foo.has(1)')
assert(foo.has(2), 'foo.has(2)')
assert(foo.has(3), 'foo.has(3)')
assert(foo[1].key === '1', 'foo[1].key === "2"')
let arr = foo.toArray()
assert(arr[0].val === 1, 'arr[0] === 1')
assert(arr[1].val === 2, 'arr[1] === 2')
assert(arr[2].val === 3, 'arr[2] === 3')
foo = Enum('foo', { a: 1, b: 2 })
assert(foo.a.val === 1, 'foo.a === 1')
assert(foo.b.val === 2, 'foo.b === 2')
assert(foo(2) === foo.b, 'foo(2) === foo.b')
assert(foo.has('a'), 'foo.has(a)')
assert(foo.has('b'), 'foo.has(b)')
foo['a'] = 'test'
assert(foo.b.val !== 'test', 'foo.b.val !== "test"')
assert(foo.b.val === 2, 'foo.b.val === 2')
arr = foo.toArray()
assert(arr[0].val === 1, 'arr[0] === 1')
assert(arr[1].val === 2, 'arr[1] === 2')
assert(foo instanceof Enum.EnumMeta, 'foo instanceof Enum.EnumMeta')

// int enum behavior
foo = Enum.IntEnum('foo', { a: 1, b: 2 })
assert(foo.a + 1 === 2, 'foo.a + 1 === 2')
assert(foo(1) === foo.a, 'foo(1) === foo.a')
assert(foo.a === foo.a.a, 'foo.a === foo.a.a') 
assert(foo.has('a'), 'foo.has(a)')
assert(foo.has('b'), 'foo.has(b)')
assert(foo(1).key === 'a', 'foo(1).key === "a"')
assert(foo(2).key === 'b', 'foo(2).key === "b"')
arr = foo.toArray()
assert(arr[0].val === 1, 'arr[0] === 1')
assert(arr[1].val === 2, 'arr[1] === 2')
assert(foo instanceof Enum.EnumMeta, 'foo instanceof Enum.EnumMeta')
assert(foo['nothing here'] === undefined)
foo = Enum.IntEnum('gfoobar', {
  __missing__: function __missing__() { return 10 },
  a: 1,
  b: 2,
  c: 3,
})
assert(foo['a'].value === 1, 'foo[\'a\'].value === 1')
assert(foo['nothing here'] === 10, 'foo[\'nothing here\'] === 10')

console.log(`${count} asserts passed.`)
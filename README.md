# python-enum
An implementation of python-like enums in JavaScript.

This is the repository for the python-enum npm package. This package was created as a tool to facilitate the migration of projects written in python to javascript. As such, it serves the usecase of providing a python-like api ([functional-api](https://docs.python.org/3/library/enum.html#functional-api)) to enum objects in javascript, including the int-enum. 

## A side-by-side comparison

The following code examples demonstrate the JavaScript analogs of the Python enum module.

**Python:**
```
import enum as Enum

Animal = Enum.Enum('Animal', 'ANT BEE CAT DOG')
print(Animal)
# <enum 'Animal'>
print(Animal.ANT)
# <Animal.ANT: 1>
print(Animal.ANT.value)
# 1
list(Animal)
# [<Animal.ANT: 1>, <Animal.BEE: 2>, <Animal.CAT: 3>, <Animal.DOG: 4>]


IntAnimal = Enum.IntEnum('IntAnimal','ANT BEE CAT DOG')
list(IntAnimal)
#  [<IntAnimal.ANT: 1>, <IntAnimal.BEE: 2>, <IntAnimal.CAT: 3>, <IntAnimal.DOG: 4>]
print(IntAnimal.ANT.value)
# 1
IntAnimal.ANT + 1
# 2
IntAnimal.ANT.CAT == IntAnimal.CAT
# True
```

**JavaScript:**
```
import Enum from 'python-enum'

const Animal = Enum.Enum('Animal', 'ANT BEE CAT DOG')
console.log(Animal) 
// ƒ [object Function]
console.log(Animal.ANT)
// Animal {val: 1, key: "ANT"}
console.log(Animal.ANT.value)
// 1
Animal.toArray()
// (4) [Animal, Animal, Animal, Animal]


const IntAnimal = Enum.IntEnum('IntAnimal','ANT BEE CAT DOG')
IntAnimal.toArray()
// (4) [IntAnimal, IntAnimal, IntAnimal, IntAnimal]
console.log(IntAnimal.ANT.value)
// 1
IntAnimal.ANT + 1
// 2
IntAnimal.ANT.CAT === IntAnimal.CAT
// true
```

Note: IntEnum values behave like integers in other ways you’d expect. 



## Derived Enumerations

### IntEnum
The first variation of Enum that is provided is also a subclass of int. Members of an IntEnum can be compared to integers; by extension, integer enumerations of different types can also be compared to each other:

**Python**

 ```
from enum import IntEnum
 
class Shape(IntEnum):
    CIRCLE = 1
    SQUARE = 2
class Request(IntEnum):
    POST = 1
    GET = 2

Shape == 1
# False
Shape.CIRCLE == 1
# True
Shape.CIRCLE == Request.POST
# True
```

**JavaScript
```
import IntEnum from 'python-enum'

const Shape = IntEnum('Shape', {
  CIRCLE: 1,
  SQUARE: 2,
})
const Request = IntEnum('Request', {
  POST: 1,
  GET: 2,
 })
Shape === 1
// false
Shape.CIRCLE === 1
// True
 hape.CIRCLE === Request.POST
// True
```

### EnumMeta

You can check class type like so:

**Python**
```
foo = new Enum.Enum('foo', { 'a': 1 })
print(isinstance(foo, Enum.EnumMeta))
# True
```

**JavaScript**
```
const foo = new Enum.Enum('foo', { a: 1 })
console.log(foo instanceof Enum.EnumMeta)
// true
```
## Other Enum features

As of right now (3/17/2020) I will only be implementing the necessary Python enum module features for my own project. If you need additional enum features to be ported over from python you can make an issue and I'll consider it or make a pull request. A pull request will be more seriously considered.

For other feeback not strictly related to bugs or feature requests you can leave a comment [here](https://arcman7.github.io/en/notes/)

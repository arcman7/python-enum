# python-enum
An implementation of python-like enums in JavaScript.

This the repository for the python-enum npm package. This package was created as a tool to facilitate the migration of projects written in python to javascript. As such, it serves the usecase of providing a python-like api (functional-api)[https://docs.python.org/3/library/enum.html#functional-api] to enum objects in javascript, including the int-enum. 

## A side-by-side comparison

The following code examples demonstrate the JavaScript analogs of the Python enum module.

Python:
```
import enum as Enum

Animal = Enum('Animal', 'ANT BEE CAT DOG')
print(Animal)
# <enum 'Animal'>
print(Animal.ANT)
# <Animal.ANT: 1>
print(Animal.ANT.value)
# 1
list(Animal)
# [<Animal.ANT: 1>, <Animal.BEE: 2>, <Animal.CAT: 3>, <Animal.DOG: 4>]
```

JavaScript:
```

```

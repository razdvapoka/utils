import test from 'ava'

import {
  always,
  T,
  F,
  noop,
  identity,
  compose,
  pipe,
  curry,
  curryN,
  once,
  debounce,
  throttle,
  memoize,
  wait
} from '../src'

test('always', t => {
  t.is(always(1)(), 1)
})

test('T', t => {
  t.is(T(), true)
})

test('F', t => {
  t.is(F(), false)
})

test('noop', t => {
  t.is(noop(), void 0)
})

test('identity', t => {
  t.is(identity(100), 100)
})

test('compose', t => {
  t.is(compose((val) => val + '!', (val) => val + 1)(100), '101!')
})

test('pipe', t => {
  t.is(pipe((val) => val + 1, (val) => val + '!')(100), '101!')
})

test('curry', t => {
  const fn = curry((one, two, three) => one + two + three)
  t.is(typeof fn(1), 'function')
  t.is(typeof fn(1, 2), 'function')
  t.is(typeof fn(1, 2, 3), 'number')
  t.is(fn(1, 2, 3), 1 + 2 + 3)
  t.is(fn(1, 2)(3), 1 + 2 + 3)
  t.is(fn(1)(2)(3), 1 + 2 + 3)
})

test('curryN', t => {
  const fn3 = curryN(2, (one, two, three) => one + two + three)
  t.is(typeof fn3(1), 'function')
  t.is(fn3(1, 2), NaN)
  t.is(fn3(1, 2, 3), 1 + 2 + 3)
  t.is(fn3(1)(2, 3), 1 + 2 + 3)

  const fn4 = curryN(4, (one, two, three, four) => one + two + three + four)
  t.is(typeof fn4(1), 'function')
  t.is(typeof fn4(1, 2), 'function')
  t.is(typeof fn4(1, 2, 3), 'function')
  t.is(typeof fn4(1, 2)(3), 'function')
  t.is(fn4(1, 2, 3, 4), 1 + 2 + 3 + 4)
  t.is(fn4(1, 2, 3)(4), 1 + 2 + 3 + 4)
  t.is(fn4(1, 2)(3)(4), 1 + 2 + 3 + 4)
  t.is(fn4(1)(2)(3)(4), 1 + 2 + 3 + 4)
  t.is(fn4(1, 2)(3, 4), 1 + 2 + 3 + 4)
  t.is(fn4(1)(2, 3, 4), 1 + 2 + 3 + 4)
})

test('once', t => {
  const fn = once((one, two, three) => one + two + three)
  t.is(fn(1, 2, 3), 1 + 2 + 3)
  t.is(fn(10, 20, 30), 1 + 2 + 3)
})

test('debounce', async t => {
  let count = 0
  const fn = debounce(() => count++, 20)

  fn()
  fn()
  fn()

  t.is(count, 0)

  await wait(25)

  t.is(count, 1)

  fn()
  fn()
  fn()
  await wait(30)

  fn()
  fn()
  fn()
  await wait(30)

  t.is(count, 3)

  fn()
  await wait(10)
  fn()
  await wait(10)
  fn()
  await wait(10)

  t.is(count, 3)

  await wait(25)
  t.is(count, 4)
})

test('debounce immediate', async t => {
  let count = 0
  const fn = debounce(() => count++, 20, true)

  fn()
  fn()
  fn()
  t.is(count, 1)

  await wait(30)
  fn()
  fn()
  fn()

  t.is(count, 2)

  await wait(30)
  t.is(count, 2)
})

test('throttle', async t => {
  let count = 0
  const fn = throttle(() => count++, 20)

  fn()
  fn()
  fn()

  t.is(count, 0)

  await wait(25)

  t.is(count, 1)

  fn()
  fn()
  fn()
  await wait(30)

  fn()
  fn()
  fn()
  await wait(30)

  t.is(count, 3)

  fn()
  await wait(10)
  fn()
  await wait(10)
  fn()
  await wait(10)

  t.is(count, 4)

  await wait(25)
  t.is(count, 5)
})

test('throttle immediate', async t => {
  let count = 0
  const fn = throttle(() => count++, 20, true)

  fn()
  fn()
  fn()
  t.is(count, 1)

  await wait(30)
  fn()
  fn()
  fn()

  t.is(count, 2)

  await wait(30)
  t.is(count, 2)
})

test('memoize', t => {
  const memoized = memoize((a, b) => ({ val: a + b }))
  const result = memoized(1, 2)

  t.is(result.val, 3)
  t.true(result === memoized(1, 2))
})

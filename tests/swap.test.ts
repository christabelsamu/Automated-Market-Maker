import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for pools
const pools = new Map()
let nextPoolId = 1

// Mock functions to simulate contract behavior
function createPool(tokenA: string, tokenB: string) {
  const poolId = nextPoolId++
  pools.set(poolId, { tokenA, tokenB, reserveA: 0, reserveB: 0 })
  return poolId
}

function addLiquidity(poolId: number, amountA: number, amountB: number) {
  const pool = pools.get(poolId)
  if (!pool) throw new Error("Invalid pool")
  pool.reserveA += amountA
  pool.reserveB += amountB
  pools.set(poolId, pool)
  return true
}

function swap(poolId: number, tokenIn: string, amountIn: number) {
  const pool = pools.get(poolId)
  if (!pool) throw new Error("Invalid pool")
  const reserveIn = tokenIn === pool.tokenA ? pool.reserveA : pool.reserveB
  const reserveOut = tokenIn === pool.tokenA ? pool.reserveB : pool.reserveA
  const amountOut = Math.floor((amountIn * reserveOut * 0.997) / (reserveIn + amountIn)) // 0.3% fee
  if (amountOut <= 0) throw new Error("Insufficient liquidity")
  if (tokenIn === pool.tokenA) {
    pool.reserveA += amountIn
    pool.reserveB -= amountOut
  } else {
    pool.reserveB += amountIn
    pool.reserveA -= amountOut
  }
  pools.set(poolId, pool)
  return amountOut
}

function getPoolInfo(poolId: number) {
  return pools.get(poolId)
}

describe("Swap Contract", () => {
  beforeEach(() => {
    pools.clear()
    nextPoolId = 1
  })
  
  it("should create a new pool", () => {
    const poolId = createPool("tokenA", "tokenB")
    expect(poolId).toBe(1)
    const pool = getPoolInfo(poolId)
    expect(pool).toEqual({ tokenA: "tokenA", tokenB: "tokenB", reserveA: 0, reserveB: 0 })
  })
  
  it("should add liquidity", () => {
    const poolId = createPool("tokenA", "tokenB")
    const result = addLiquidity(poolId, 1000, 1000)
    expect(result).toBe(true)
    const pool = getPoolInfo(poolId)
    expect(pool.reserveA).toBe(1000)
    expect(pool.reserveB).toBe(1000)
  })
  
  it("should perform a swap", () => {
    const poolId = createPool("tokenA", "tokenB")
    addLiquidity(poolId, 1000, 1000)
    const amountOut = swap(poolId, "tokenA", 100)
    expect(amountOut).toBe(90) // Approximately 90 due to 0.3% fee and floor division
    const pool = getPoolInfo(poolId)
    expect(pool.reserveA).toBe(1100)
    expect(pool.reserveB).toBe(910)
  })
  
  it("should throw an error for insufficient liquidity", () => {
    const poolId = createPool("tokenA", "tokenB")
    addLiquidity(poolId, 100, 100)
    expect(() => swap(poolId, "tokenA", 1000)).toThrow("Insufficient liquidity")
  })
})


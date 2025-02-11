import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for pools
const pools = new Map()
let nextPoolId = 1

// Mock functions to simulate contract behavior
function registerPool(tokenA: string, tokenB: string, poolAddress: string) {
  const poolId = nextPoolId++
  pools.set(poolId, { tokenA, tokenB, poolAddress })
  return poolId
}

function getPool(poolId: number) {
  return pools.get(poolId)
}

describe("Pool Factory Contract", () => {
  beforeEach(() => {
    pools.clear()
    nextPoolId = 1
  })
  
  it("should register a new pool", () => {
    const poolId = registerPool("tokenA", "tokenB", "pool-address-1")
    expect(poolId).toBe(1)
    const pool = getPool(1)
    expect(pool).toEqual({ tokenA: "tokenA", tokenB: "tokenB", poolAddress: "pool-address-1" })
  })
  
  it("should register multiple pools", () => {
    registerPool("tokenA", "tokenB", "pool-address-1")
    registerPool("tokenC", "tokenD", "pool-address-2")
    expect(getPool(1)).toBeDefined()
    expect(getPool(2)).toBeDefined()
  })
  
  it("should return undefined for non-existent pool", () => {
    expect(getPool(999)).toBeUndefined()
  })
})


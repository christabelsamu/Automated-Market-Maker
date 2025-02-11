import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for routes
const routes = new Map()

// Mock functions to simulate contract behavior
function addRoute(tokenA: string, tokenB: string, pool: string) {
  routes.set(`${tokenA}-${tokenB}`, pool)
  return true
}

function removeRoute(tokenA: string, tokenB: string) {
  routes.delete(`${tokenA}-${tokenB}`)
  return true
}

function getRoute(tokenA: string, tokenB: string) {
  const pool = routes.get(`${tokenA}-${tokenB}`)
  if (!pool) throw new Error("Route not found")
  return pool
}

describe("Router Contract", () => {
  beforeEach(() => {
    routes.clear()
  })
  
  it("should add a route", () => {
    const result = addRoute("tokenA", "tokenB", "pool1")
    expect(result).toBe(true)
    expect(getRoute("tokenA", "tokenB")).toBe("pool1")
  })
  
  it("should remove a route", () => {
    addRoute("tokenA", "tokenB", "pool1")
    const result = removeRoute("tokenA", "tokenB")
    expect(result).toBe(true)
    expect(() => getRoute("tokenA", "tokenB")).toThrow("Route not found")
  })
  
  it("should get a route", () => {
    addRoute("tokenA", "tokenB", "pool1")
    const pool = getRoute("tokenA", "tokenB")
    expect(pool).toBe("pool1")
  })
  
  it("should throw an error for non-existent route", () => {
    expect(() => getRoute("tokenC", "tokenD")).toThrow("Route not found")
  })
})


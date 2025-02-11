import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for fee balances
const feeBalances = new Map<string, number>()
let totalFees = 0

// Mock functions to simulate contract behavior
function collectFee(amount: number) {
  totalFees += amount
  return true
}

function distributeFee(recipient: string, amount: number) {
  if (amount > totalFees) throw new Error("Insufficient balance")
  totalFees -= amount
  const currentBalance = feeBalances.get(recipient) || 0
  feeBalances.set(recipient, currentBalance + amount)
  return true
}

function withdrawFees(user: string, amount: number) {
  const balance = feeBalances.get(user) || 0
  if (amount > balance) throw new Error("Insufficient balance")
  feeBalances.set(user, balance - amount)
  return true
}

function getFeeBalance(user: string) {
  return feeBalances.get(user) || 0
}

function getTotalFees() {
  return totalFees
}

describe("Fee Distribution Contract", () => {
  beforeEach(() => {
    feeBalances.clear()
    totalFees = 0
  })
  
  it("should collect fees", () => {
    const result = collectFee(100)
    expect(result).toBe(true)
    expect(getTotalFees()).toBe(100)
  })
  
  it("should distribute fees", () => {
    collectFee(100)
    const result = distributeFee("user1", 50)
    expect(result).toBe(true)
    expect(getTotalFees()).toBe(50)
    expect(getFeeBalance("user1")).toBe(50)
  })
  
  it("should withdraw fees", () => {
    collectFee(100)
    distributeFee("user1", 50)
    const result = withdrawFees("user1", 30)
    expect(result).toBe(true)
    expect(getFeeBalance("user1")).toBe(20)
  })
  
  it("should throw an error for insufficient balance during distribution", () => {
    collectFee(100)
    expect(() => distributeFee("user1", 150)).toThrow("Insufficient balance")
  })
  
  it("should throw an error for insufficient balance during withdrawal", () => {
    collectFee(100)
    distributeFee("user1", 50)
    expect(() => withdrawFees("user1", 60)).toThrow("Insufficient balance")
  })
})


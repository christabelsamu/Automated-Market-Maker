;; Swap Contract

;; Define data structures
(define-map pools
  { pool-id: uint }
  { token-a: principal, token-b: principal, reserve-a: uint, reserve-b: uint }
)

(define-data-var next-pool-id uint u1)

;; Constants
(define-constant fee-rate u3) ;; 0.3% fee

;; Error codes
(define-constant err-invalid-pool (err u100))
(define-constant err-insufficient-liquidity (err u101))

;; Functions
(define-public (create-pool (token-a principal) (token-b principal))
  (let
    ((pool-id (var-get next-pool-id)))
    (map-set pools
      { pool-id: pool-id }
      { token-a: token-a, token-b: token-b, reserve-a: u0, reserve-b: u0 }
    )
    (var-set next-pool-id (+ pool-id u1))
    (ok pool-id)
  )
)

(define-public (add-liquidity (pool-id uint) (amount-a uint) (amount-b uint))
  (match (map-get? pools { pool-id: pool-id })
    pool (let
      ((new-reserve-a (+ (get reserve-a pool) amount-a))
       (new-reserve-b (+ (get reserve-b pool) amount-b)))
      (map-set pools
        { pool-id: pool-id }
        (merge pool { reserve-a: new-reserve-a, reserve-b: new-reserve-b })
      )
      (ok true)
    )
    (err err-invalid-pool)
  )
)

(define-public (swap (pool-id uint) (token-in principal) (amount-in uint))
  (match (map-get? pools { pool-id: pool-id })
    pool
      (let
        ((reserve-in (if (is-eq token-in (get token-a pool)) (get reserve-a pool) (get reserve-b pool)))
         (reserve-out (if (is-eq token-in (get token-a pool)) (get reserve-b pool) (get reserve-a pool))))
        (let
          ((amount-out (/ (* amount-in (* reserve-out (- u1000 fee-rate))) (* u1000 (+ reserve-in amount-in)))))
          (if (> amount-out u0)
            (begin
              (map-set pools
                { pool-id: pool-id }
                (merge pool {
                  reserve-a: (if (is-eq token-in (get token-a pool))
                                (+ (get reserve-a pool) amount-in)
                                (- (get reserve-a pool) amount-out)),
                  reserve-b: (if (is-eq token-in (get token-b pool))
                                (+ (get reserve-b pool) amount-in)
                                (- (get reserve-b pool) amount-out))
                })
              )
              (ok amount-out)
            )
            (err err-insufficient-liquidity)
          )
        )
      )
    (err err-invalid-pool)
  )
)

(define-read-only (get-pool-info (pool-id uint))
  (map-get? pools { pool-id: pool-id })
)


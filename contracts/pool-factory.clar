;; Pool Factory Contract

;; Define data structures
(define-map pools
  { pool-id: uint }
  { token-a: principal, token-b: principal, pool-address: principal }
)

(define-data-var next-pool-id uint u1)

;; Error codes
(define-constant err-pool-exists (err u100))

;; Functions
(define-public (register-pool (token-a principal) (token-b principal) (pool-address principal))
  (let
    ((pool-id (var-get next-pool-id)))
    (asserts! (is-none (map-get? pools { pool-id: pool-id })) err-pool-exists)
    (map-set pools
      { pool-id: pool-id }
      { token-a: token-a, token-b: token-b, pool-address: pool-address }
    )
    (var-set next-pool-id (+ pool-id u1))
    (ok pool-id)
  )
)

(define-read-only (get-pool (pool-id uint))
  (map-get? pools { pool-id: pool-id })
)


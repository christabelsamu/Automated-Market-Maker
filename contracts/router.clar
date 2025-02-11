;; Router Contract

;; Define data structures
(define-map routes
  { token-a: principal, token-b: principal }
  { pool: principal }
)

;; Error codes
(define-constant err-route-not-found (err u100))

;; Functions
(define-public (add-route (token-a principal) (token-b principal) (pool principal))
  (ok (map-set routes { token-a: token-a, token-b: token-b } { pool: pool }))
)

(define-public (remove-route (token-a principal) (token-b principal))
  (ok (map-delete routes { token-a: token-a, token-b: token-b }))
)

(define-read-only (get-route (token-a principal) (token-b principal))
  (match (map-get? routes { token-a: token-a, token-b: token-b })
    route (ok (get pool route))
    (err err-route-not-found)
  )
)


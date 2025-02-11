;; Fee Distribution Contract

;; Define data structures
(define-map fee-balances principal uint)
(define-data-var total-fees uint u0)

;; Error codes
(define-constant err-insufficient-balance (err u100))

;; Functions
(define-public (collect-fee (amount uint))
  (let
    ((new-total (+ (var-get total-fees) amount)))
    (var-set total-fees new-total)
    (ok true)
  )
)

(define-public (distribute-fee (recipient principal) (amount uint))
  (let
    ((current-total (var-get total-fees)))
    (asserts! (<= amount current-total) err-insufficient-balance)
    (var-set total-fees (- current-total amount))
    (let
      ((current-balance (default-to u0 (map-get? fee-balances recipient))))
      (map-set fee-balances recipient (+ current-balance amount))
      (ok true)
    )
  )
)

(define-public (withdraw-fees (amount uint))
  (let
    ((balance (default-to u0 (map-get? fee-balances tx-sender))))
    (asserts! (<= amount balance) err-insufficient-balance)
    (map-set fee-balances tx-sender (- balance amount))
    (ok true)
  )
)

(define-read-only (get-fee-balance (user principal))
  (ok (default-to u0 (map-get? fee-balances user)))
)

(define-read-only (get-total-fees)
  (ok (var-get total-fees))
)


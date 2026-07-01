import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  company: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ company, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="modal-backdrop modal-backdrop--confirm" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
        <div className="danger-icon" aria-hidden="true">!</div>
        <h2 id="confirm-title">Delete application?</h2>
        <p id="confirm-description">The application for <strong>{company}</strong> will be permanently removed from this browser.</p>
        <div className="confirm-actions">
          <button ref={cancelRef} className="button button--secondary" type="button" onClick={onCancel}>Keep application</button>
          <button className="button button--danger" type="button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

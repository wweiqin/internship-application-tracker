import { useEffect, useRef, type ReactNode } from 'react'

interface ApplicationModalProps {
  title: string
  description: string
  onClose: () => void
  children: ReactNode
}

export function ApplicationModal({ title, description, onClose, children }: ApplicationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const focusable = dialog?.querySelector<HTMLElement>('input, select, textarea, button')
    focusable?.focus()
    document.body.classList.add('modal-open')

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialog) return

      const elements = Array.from(
        dialog.querySelectorAll<HTMLElement>('input, select, textarea, button, a[href]'),
      ).filter((element) => !element.hasAttribute('disabled'))
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="application-modal" role="dialog" aria-modal="true" aria-labelledby="application-modal-title" ref={dialogRef}>
        <header className="modal-header">
          <div>
            <h2 id="application-modal-title">{title}</h2>
            <p>{description}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        </header>
        {children}
      </div>
    </div>
  )
}



export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-light-border dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-light-muted dark:text-dark-muted">
          &copy; {year} Giovano Alkandri. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

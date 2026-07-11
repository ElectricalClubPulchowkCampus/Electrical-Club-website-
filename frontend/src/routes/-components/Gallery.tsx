import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Images, X } from 'lucide-react'

export interface GalleryImage {
  url: string
  alternativeText?: string | null
}

interface GalleryProps {
  /** Raw media list — resolved to absolute URLs internally. */
  images?: GalleryImage[] | null
  /** Optional link to an external album (e.g. Google Drive) with the full set of photos. */
  driveLink?: string | null
  /** Used as fallback alt text and in the lightbox aria-labels. */
  title?: string | null
  /** Section heading, in case a page wants something other than "Gallery". */
  heading?: string
  /** Extra classes for the outer wrapper, e.g. to control spacing per page. */
  className?: string
}

function resolveUrl(url: string) {
  return url.startsWith('http') ? url : `${import.meta.env.VITE_BACKEND_URL}${url}`
}

/**
 * Reusable photo gallery: a responsive grid with a lightbox, plus an optional
 * link-out to an external album (e.g. Google Drive) for the full set of photos.
 * Not tied to any single page/route — drop it in wherever a set of photos plus
 * an optional "view more" link needs to be shown.
 *
 * - Photos + external link -> grid with a trailing "View full gallery" tile
 * - External link only      -> single link-out card
 * - Photos only              -> plain grid, no link-out affordance
 * - Neither                  -> renders nothing
 */
export default function Gallery({ images, driveLink, title, heading = 'Gallery', className = '' }: GalleryProps) {
  const galleryImages = (images ?? []).map((m) => ({
    url: resolveUrl(m.url),
    alt: m.alternativeText || title || 'Photo',
  }))

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isLightboxOpen = lightboxIndex !== null

  const goToNextImage = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % galleryImages.length))
  const goToPrevImage = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length))

  // Close on Escape, navigate with arrow keys, lock background scroll while open
  useEffect(() => {
    if (!isLightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') goToNextImage()
      if (e.key === 'ArrowLeft') goToPrevImage()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, galleryImages.length])

  if (galleryImages.length === 0 && !driveLink) return null

  return (
    <div className={`mt-10 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Images className="h-4.5 w-4.5 text-muted-foreground" />
          {heading}
        </h2>
        {driveLink && galleryImages.length > 0 && (
          <a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all photos <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {galleryImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {galleryImages.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`View photo ${index + 1} of ${galleryImages.length}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}

          {/* Trailing "view more" tile, only shown once photos exist — takes people to
              the full Drive album for anything not previewed here. */}
          {driveLink && (
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View full gallery on Google Drive"
              className="group relative flex aspect-square flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 text-center transition-colors hover:bg-muted/70 hover:border-primary/40"
            >
              <Images className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-medium text-foreground px-2">View full gallery</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                on Drive <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          )}
        </div>
      )}

      {/* No preview photos configured — Drive is the only way to see the gallery */}
      {galleryImages.length === 0 && driveLink && (
        <a
          href={driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3.5 hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-2.5 text-sm text-foreground">
            <Images className="h-4 w-4 text-muted-foreground" />
            Photos from this event are on Google Drive
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Open <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </a>
      )}

      {/* ---------------- Lightbox ---------------- */}
      {isLightboxOpen && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery"
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative flex w-full max-w-4xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={goToPrevImage}
                aria-label="Previous photo"
                className="absolute left-0 sm:-left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <img
              src={galleryImages[lightboxIndex].url}
              alt={galleryImages[lightboxIndex].alt}
              className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain select-none"
              draggable={false}
            />

            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={goToNextImage}
                aria-label="Next photo"
                className="absolute right-0 sm:-right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {galleryImages.length > 1 && (
            <p className="absolute bottom-6 text-xs text-white/70">
              {lightboxIndex + 1} / {galleryImages.length}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
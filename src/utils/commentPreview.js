/**
 * =============================================================================
 * SECURITY TEST — Simulasi celah XSS untuk testing pipeline
 * =============================================================================
 * File ini sengaja dibuat untuk mengetes apakah SAST pipeline (Semgrep)
 * mendeteksi celah keamanan. Akan dihapus setelah testing selesai.
 *
 * Celah: XSS via dangerouslySetInnerHTML + URL parameter injection
 * Expected: Semgrep HIGH severity
 * =============================================================================
 */

/**
 * Mengambil parameter dari URL query string (simulasi user input)
 * Ini celah: input dari user langsung diproses tanpa sanitasi.
 */
function getUrlParameter(name) {
  const params = new URLSearchParams(window.location.search)
  return params.get(name) || ''
}

/**
 * Membuat HTML preview dari konten yang diberikan.
 * CELAH KEAMANAN: Menggunakan dangerouslySetInnerHTML dengan data
 * dari URL parameter tanpa sanitasi. Attacker bisa injeksi script
 * via ?preview=<script>alert('XSS')</script>
 */
export function createCommentPreview() {
  // Ambil input dari URL — ini user-controlled input
  const userContent = getUrlParameter('preview')

  // CELAH: tidak ada sanitasi, langsung di-render sebagai HTML
  const previewElement = document.getElementById('comment-preview')
  if (previewElement) {
    // Semgrep p/react akan deteksi ini sebagai HIGH severity
    previewElement.innerHTML = userContent
  }

  // CELAH KEDUA: dangerouslySetInnerHTML pattern — Semgrep juga deteksi ini
  return {
    __html: userContent,
  }
}

/**
 * Utility untuk render konten rich text.
 * CELAH: Semgrep rule 'react.dangerously-set-innerhtml'
 */
export function renderRichText(content) {
  // Ini sengaja biar mirip kode real yang sering salah
  return { __html: content }
}

/**
 * Konfigurasi API (CELAH: hardcoded credentials)
 * Gitleaks akan deteksi sebagai CRITICAL.
 */
export const API_CONFIG = {
  endpoint: 'https://api.example.com',
  // CELAH: Hardcoded key — Gitleaks flag :keyword + entropy
  key: 'abc123xyz789',
  // CELAH: Hardcoded secret — Gitleaks flag via pattern
  secret: 'insecure-static-secret-value',
}

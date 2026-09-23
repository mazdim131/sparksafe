navbar = document.getElementById("navbar");

navbar.innerHTML = `

 <!-- =========================================================
       1. Header & Navbar (Sticky)
       ========================================================= -->
  <header class="navbar">
    <div class="container nav-wrap">
      <!-- Logo SparkSave -->
      <a href="#hero" class="brand-logo">
        <div class="brand-icon">
          <!-- Petir/Energi SVG -->
          <svg viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span>SparkSave</span>
      </a>

      <!-- Menu Navigasi -->
      <nav>
        <ul class="nav-links">
          <li><a href="#hero" class="nav-link">Beranda</a></li>
          <li><a href="#mengapa-penting" class="nav-link">Mengapa Penting</a></li>
          <li><a href="#solusi" class="nav-link">Solusi & Aksi</a></li>
          <li><a href="#tentang" class="nav-link">Tentang</a></li>
        </ul>
      </nav>

      <!-- Action Button -->
      <div class="nav-actions">
        <a href="#solusi" class="btn-join">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>Join Kampanye</span>
        </a>
      </div>
    </div>
  </header>
`;

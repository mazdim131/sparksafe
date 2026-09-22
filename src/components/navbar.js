navbar = document.getElementById("navbar");

navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg p-3 rounded-4" style="background-color: #059669 !important;">
  <div class="container-fluid">
    <a class="navbar-brand text-light" href="#">SparkSave</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      </ul>
      <form class="d-flex gap-2">

          <a class="btn text-light" href="#">Beranda</a>

          <a class="btn text-light" href="#">Kontak</a>

        <button class="btn btn-outline-light" type="submit"><i class="bi bi-book"></i> Tentang</button>
      </form>
    </div>
  </div>
</nav>
`;

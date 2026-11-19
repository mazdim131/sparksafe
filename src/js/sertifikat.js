(() => {
  "use strict";

  /**
   * KONFIGURASI SERTIFIKAT
   * ----------------------
   * Semua ukuran di bawah adalah koordinat ASLI template (895 x 528 px).
   * Script akan menggambar dengan SCALE = 2 supaya teks tetap tajam saat
   * diunduh / dicetak, jadi kamu tidak perlu mengubah angka di sini saat
   * mengganti resolusi canvas.
   *
   * Kalau template diganti, cukup set TEMPLATE_WIDTH / TEMPLATE_HEIGHT dan
   * geser nilai x / y sampai teks berada di area yang kamu mau.
   */
  const CONFIG = {
    template: "../assets/images/template-sertifikat.png",
    templateWidth: 895,
    templateHeight: 528,
    scale: 2,

    fields: {
      // Nama user menggantikan placeholder [NAMA LENGKAP PENERIMA].
      // Area ini sudah dibersihkan lewat CONFIG.cleanup sebelum teks digambar.
      name: {
        x: 444,
        y: 260,
        size: 44,
        minSize: 20,
        maxWidth: 620,
        weight: 800,
        color: "#FFD86B",
        glow: true
      },
      // Menggantikan placeholder [TANTANGAN GAME / TURNAMEN / MISI].
      rank: {
        x: 447,
        y: 331,
        size: 17,
        minSize: 11,
        maxWidth: 700,
        weight: 700,
        color: "#FDE68A"
      },
      // Baris poin, menggantikan kalimat "dalam Game Interaktif SparkSave."
      score: {
        x: 447,
        y: 351,
        size: 15,
        minSize: 10,
        maxWidth: 700,
        weight: 500,
        color: "#FFFFFF"
      },
      // Detail hasil + tanggal/nomor, di atas area tanda tangan yang dibersihkan.
      meta: {
        x: 447,
        y: 376,
        size: 12,
        minSize: 8,
        maxWidth: 720,
        weight: 400,
        color: "#D1FAE5"
      }
    },

    // Placeholder bawaan gambar yang ditutup SEBELUM teks dinamis dicetak.
    // Koordinat mengikuti template asli (895 x 528). Logo SparkSave di kiri
    // (x < 200, y < 200) sengaja tidak termasuk supaya tetap utuh.
    cleanup: [
      { x: 250, y: 226, w: 390, h: 44, fallback: "#0C3A27" },
      { x: 262, y: 317, w: 366, h: 21, fallback: "#10301C" },
      { x: 300, y: 340, w: 290, h: 20, fallback: "#0D2E20" },
      { x: 198, y: 388, w: 205, h: 81, fallback: "#0C2A1B" },
      { x: 502, y: 388, w: 225, h: 81, fallback: "#092619" },
      // Logo kanan: tutup dengan lingkaran, bukan kotak. Radius 80 menutup
      // seluruh bingkai emas (batas gold terukur x=690..824, y=59..194)
      // dengan margin ~10 px, tapi masih aman dari bingkai sertifikat x >= 840.
      // Warna diambil dari rata-rata latar hijau gelap di sekitar logo.
      {
        shape: "circle",
        cx: 757,
        cy: 125,
        r: 80,
        color: "#093020"
      }
    ]
  };

  const $ = (id) => document.getElementById(id);
  const canvas = $("certCanvas");
  const stateBox = $("certState");
  const preview = $("certPreview");

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "detektif-sparksave";

  const formatDate = (iso) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) date = new Date();
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  function showError(message) {
    stateBox.className = "cert-state error";
    stateBox.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill" style="font-size:1.6rem;"></i>
      <span>${message}</span>
      <a href="Eco_Detective_Operation_Green_Campus_v3.html">Kembali ke Game</a>
    `;
  }

  function loadTemplate() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Gagal memuat template sertifikat."));
      img.src = CONFIG.template;
    });
  }

  async function prepareFonts() {
    if (!document.fonts) return;
    const sizes = Object.values(CONFIG.fields).map((f) => `${f.weight} ${f.size}px Poppins`);
    try {
      await Promise.all(sizes.map((font) => document.fonts.load(font)));
      await document.fonts.ready;
    } catch (_) {
      // Fallback ke font sistem; sertifikat tetap bisa diunduh.
    }
  }

  /** Menggambar teks tengah dan mengecilkan font otomatis jika terlalu panjang. */
  function drawFitted(ctx, text, cfg) {
    let size = cfg.size;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    do {
      ctx.font = `${cfg.weight} ${size * CONFIG.scale}px Poppins, sans-serif`;
      if (ctx.measureText(text).width <= cfg.maxWidth * CONFIG.scale) break;
      size -= 0.5;
    } while (size > cfg.minSize);

    if (cfg.glow) {
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
      ctx.shadowBlur = 7 * CONFIG.scale;
      ctx.shadowOffsetY = 1.5 * CONFIG.scale;
    }

    ctx.fillStyle = cfg.color;
    ctx.fillText(text, cfg.x * CONFIG.scale, cfg.y * CONFIG.scale);

    if (cfg.glow) ctx.restore();
  }

  /** Ambil warna latar lokal dari template supaya area tutupan menyatu. */
  function sampleBackground(probeCtx, area) {
    try {
      const { data } = probeCtx.getImageData(area.x, area.y, area.w, area.h);
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (lum >= 16 && lum <= 78) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          n += 1;
        }
      }
      if (!n) return area.fallback;
      return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
    } catch (_) {
      return area.fallback;
    }
  }

  /** Tutup placeholder bawaan gambar sebelum mencetak teks dinamis. */
  function clearPlaceholders(ctx, template) {
    const probe = document.createElement("canvas");
    probe.width = template.naturalWidth || template.width;
    probe.height = template.naturalHeight || template.height;
    const probeCtx = probe.getContext("2d", { willReadFrequently: true });
    probeCtx.drawImage(template, 0, 0, probe.width, probe.height);

    const scale = CONFIG.scale;
    for (const area of CONFIG.cleanup) {
      if (area.shape === "circle") {
        ctx.beginPath();
        ctx.arc(area.cx * scale, area.cy * scale, area.r * scale, 0, Math.PI * 2);
        ctx.fillStyle = area.color;
        ctx.fill();
        continue;
      }

      const edge = Math.min(6, Math.floor(area.w / 4));
      const leftColor = sampleBackground(probeCtx, { ...area, w: edge });
      const rightColor = sampleBackground(probeCtx, {
        ...area,
        x: area.x + area.w - edge,
        w: edge
      });
      const gradient = ctx.createLinearGradient(
        area.x * scale,
        0,
        (area.x + area.w) * scale,
        0
      );
      gradient.addColorStop(0, leftColor);
      gradient.addColorStop(1, rightColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(
        area.x * scale,
        area.y * scale,
        area.w * scale,
        area.h * scale
      );
    }
  }

  async function renderCertificate(data) {
    await prepareFonts();
    const template = await loadTemplate();

    const w = CONFIG.templateWidth * CONFIG.scale;
    const h = CONFIG.templateHeight * CONFIG.scale;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(template, 0, 0, w, h);
    clearPlaceholders(ctx, template);

    const fields = CONFIG.fields;
    drawFitted(ctx, data.name, fields.name);
    drawFitted(ctx, data.rank || "DETEKTIF ENERGI SPARKSAVE", fields.rank);
    drawFitted(ctx, `${Number(data.score || 0).toLocaleString("id-ID")} Poin`, fields.score);
    drawFitted(
      ctx,
      `${data.kwh} kWh  ·  Rp ${data.rp}  ·  ${data.co2} kg CO₂  ·  ${formatDate(data.date)}  ·  No. ${data.no}`,
      fields.meta
    );

    stateBox.hidden = true;
    preview.hidden = false;
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadPNG(fileName) {
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${fileName}.png`);
    }, "image/png");
  }

  function downloadPDF(fileName) {
    if (!window.jspdf || !window.jspdf.jsPDF) return;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const ratio = canvas.width / canvas.height;
    let imgW = pageW;
    let imgH = imgW / ratio;
    if (imgH > pageH) {
      imgH = pageH;
      imgW = imgH * ratio;
    }

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      (pageW - imgW) / 2,
      (pageH - imgH) / 2,
      imgW,
      imgH
    );
    pdf.save(`${fileName}.pdf`);
  }

  function init() {
    let data = null;
    try {
      const raw = sessionStorage.getItem("sparksave_cert_data");
      if (raw) data = JSON.parse(raw);
    } catch (_) {
      data = null;
    }

    if (!data || !data.name) {
      showError("Sertifikat hanya diberikan setelah kamu memenangkan misi. Silakan main dulu ya.");
      return;
    }

    $("certWelcome").innerHTML = `Selamat, <b></b> ini sertifikat untuk detektif energi hebat!`;
    $("certWelcome").querySelector("b").textContent = data.name;

    renderCertificate(data)
      .then(() => {
        const fileName = `Sertifikat-SparkSave-${slugify(data.name)}`;

        $("downloadPng").addEventListener("click", () => downloadPNG(fileName));
        $("downloadPdf").addEventListener("click", () => downloadPDF(fileName));

        if (!window.jspdf) {
          const pdfBtn = $("downloadPdf");
          pdfBtn.disabled = true;
          pdfBtn.title = "Butuh koneksi internet untuk memuat jsPDF. Gunakan PNG atau print browser.";
          pdfBtn.addEventListener("click", () => window.print());
        }
      })
      .catch((error) => {
        console.error(error);
        showError("Template sertifikat tidak ditemukan. Hubungi admin SparkSave ya.");
      });
  }

  init();
})();

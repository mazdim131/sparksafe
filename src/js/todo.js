// SparkSave - Jurnal 7 Hari Hemat Energi (sederhana, localStorage)

const STORAGE_KEY = "sparksave_todo_v1";

// Data 7 hari + daftar task
const days = [
    {
        id: 1,
        title: "Hari 1 - Sadar Kebiasaan",
        desc: "Kenali kebiasaan boros energi di sekitarmu.",
        tasks: [
            "Periksa charger/adaptor yang masih tertancap padahal tidak dipakai",
            "Periksa AC yang menyala di ruangan kosong",
            "Periksa PC/monitor yang menyala tanpa aktivitas",
            "Periksa lampu yang menyala saat siang hari"
        ]
    },
    {
        id: 2,
        title: "Hari 2 - Cabut Colokan",
        desc: "Hilangkan phantom load dari charger dan adaptor.",
        tasks: [
            "Cabut charger laptop/gawai setelah baterai penuh",
            "Cabut adaptor dari stopkontak saat tidak dipakai",
            "Pastikan tidak ada kabel menggantung di stopkontak",
            "Ajak 1 teman melakukan hal yang sama"
        ]
    },
    {
        id: 3,
        title: "Hari 3 - AC Cerdas",
        desc: "Atur suhu AC agar efisien.",
        tasks: [
            "Atur suhu AC ke 24-25 C",
            "Matikan AC saat kelas/laboratorium kosong",
            "Pastikan pintu/jendela tertutup saat AC menyala",
            "Catat perbedaan kenyamanan ruangan"
        ]
    },
    {
        id: 4,
        title: "Hari 4 - Shutdown Tuntas",
        desc: "Matikan perangkat komputer dengan benar.",
        tasks: [
            "Shutdown PC setelah praktikum selesai",
            "Matikan tombol power monitor",
            "Pastikan tidak ada PC yang dibiarkan standby",
            "Cek ulang lab sebelum pulang"
        ]
    },
    {
        id: 5,
        title: "Hari 5 - Cahaya Alami",
        desc: "Manfaatkan sinar matahari.",
        tasks: [
            "Buka gorden/jendela saat cuaca cerah",
            "Matikan lampu yang tidak perlu di siang hari",
            "Atur posisi belajar agar mendapat cahaya alami",
            "Pastikan lampu dimatikan saat istirahat"
        ]
    },
    {
        id: 6,
        title: "Hari 6 - Ajak Teman",
        desc: "Sebarkan kebiasaan hemat energi.",
        tasks: [
            "Ingatkan teman yang lupa mematikan perangkat",
            "Bagikan 1 tips hemat energi ke teman",
            "Diskusikan kebiasaan boros di kelas",
            "Dukung teman yang mulai berhemat"
        ]
    },
    {
        id: 7,
        title: "Hari 7 - Refleksi & Komitmen",
        desc: "Evaluasi dan buat komitmen jangka panjang.",
        tasks: [
            "Tulis 3 kebiasaan hemat yang sudah dilakukan",
            "Tentukan 1 kebiasaan yang akan dipertahankan",
            "Buat janji hemat energi untuk bulan depan",
            "Rayakan progres yang sudah dicapai"
        ]
    }
];

// Ambil progres dari localStorage
let completed = [];
try {
    completed = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (e) {
    completed = [];
}

const daysContainer = document.getElementById("days-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");
const resetBtn = document.getElementById("reset-btn");

function taskId(dayId, index) {
    return dayId + "-" + index;
}

function render() {
    daysContainer.innerHTML = "";

    days.forEach(function (day) {
        const card = document.createElement("div");
        card.className = "day-card";
        card.setAttribute("data-day", day.id);

        const allDone = day.tasks.every(function (t, i) {
            return completed.indexOf(taskId(day.id, i)) !== -1;
        });

        let tasksHtml = "";
        day.tasks.forEach(function (task, i) {
            const id = taskId(day.id, i);
            const checked = completed.indexOf(id) !== -1 ? "checked" : "";
            tasksHtml += `
                <li class="task-item">
                    <input type="checkbox" id="${id}" data-task="${id}" ${checked}>
                    <label for="${id}">${task}</label>
                </li>
            `;
        });

        card.innerHTML = `
            <div class="day-head">
                <span class="day-badge">Hari ${day.id}</span>
                ${allDone ? '<span class="day-done"><i class="bi bi-check-circle-fill"></i> Selesai</span>' : ''}
            </div>
            <h3 class="day-title">${day.title}</h3>
            <p class="day-desc">${day.desc}</p>
            <ul class="task-list">${tasksHtml}</ul>
        `;

        daysContainer.appendChild(card);
    });

    // Pasang event listener untuk setiap checkbox
    document.querySelectorAll('input[data-task]').forEach(function (cb) {
        cb.addEventListener('change', function () {
            const id = cb.getAttribute('data-task');
            if (cb.checked) {
                if (completed.indexOf(id) === -1) completed.push(id);
            } else {
                completed = completed.filter(function (x) { return x !== id; });
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
            updateProgress();
            updateDayStatus();
        });
    });

    updateProgress();
    updateDayStatus();
}

function updateProgress() {
    const total = days.reduce(function (a, d) { return a + d.tasks.length; }, 0);
    const done = completed.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    progressBar.style.width = pct + "%";
    progressText.textContent = done + " / " + total + " selesai";
    progressPercent.textContent = pct + "%";
}

function updateDayStatus() {
    days.forEach(function (day) {
        const card = document.querySelector('[data-day="' + day.id + '"]');
        if (!card) return;

        const allDone = day.tasks.every(function (t, i) {
            return completed.indexOf(taskId(day.id, i)) !== -1;
        });

        const head = card.querySelector(".day-head");
        const existing = head.querySelector(".day-done");

        if (allDone && !existing) {
            const badge = document.createElement("span");
            badge.className = "day-done";
            badge.innerHTML = '<i class="bi bi-check-circle-fill"></i> Selesai';
            head.appendChild(badge);
        } else if (!allDone && existing) {
            existing.remove();
        }
    });
}

// Reset progres
resetBtn.addEventListener('click', function () {
    if (!confirm("Reset semua progres jurnal?")) return;
    completed = [];
    localStorage.removeItem(STORAGE_KEY);
    document.querySelectorAll('input[data-task]').forEach(function (cb) {
        cb.checked = false;
    });
    updateProgress();
    updateDayStatus();
});

// Jalankan saat halaman siap
render();

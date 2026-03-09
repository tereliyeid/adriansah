# adriansah-terminal

Terminal portfolio for Renaldi Adriansah — with interactive DeepSeek AI chat.

## Deploy ke Cloudflare Pages

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/USERNAME/adriansah-terminal.git
git push -u origin main
```

### 2. Connect di Cloudflare Pages
1. Buka https://dash.cloudflare.com → **Pages** → **Create a project**
2. Connect to Git → pilih repo `adriansah-terminal`
3. Build settings:
   - **Framework preset**: None
   - **Build command**: *(kosongkan)*
   - **Build output directory**: `/` (atau `.`)
4. Klik **Save and Deploy**

### 3. Set DeepSeek API Key (server-side, aman)
1. Setelah deploy, buka project → **Settings** → **Environment Variables**
2. Tambah variable:
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: `sk-xxxxxxxxxxxxxxxx` (key dari https://platform.deepseek.com)
3. Klik **Save** → lakukan **Re-deploy**

API key disimpan server-side di CF Functions, tidak terekspos ke browser.

---

## Cara pakai terminal (setelah live)

Setelah intro selesai, ketik langsung di input terminal:

| Command | Fungsi |
|---|---|
| `help` | tampilkan bantuan |
| `clear` | bersihkan chat |
| `whoami` | info tentang terminal |
| `setkey sk-xxx` | set API key manual (tersimpan di localStorage) |
| teks apapun | chat dengan DeepSeek AI |

---

## Struktur file

```
adriansah-terminal/
├── index.html          # halaman utama
├── functions/
│   └── api/
│       └── chat.js     # CF Pages Function (proxy DeepSeek, sembunyikan API key)
└── README.md
```

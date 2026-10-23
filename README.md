# 🕊 She'riyat — Shoir Ijodxonasi va Qalb So'zlari

Shoir do'stingiz uchun o'zining she'rlarini, g'oyalarini va falsafiy mushohadalarini yig'ib boradigan, kitobxonlar esa asarlarni o'qib, ularga mehr (like) bildirishi, fikr-mulohaza (izoh) qoldirishi va **Telegram bot orqali bevosita shoir bilan bog'lanishi** mumkin bo'lgan zamonaviy, nafis veb-platforma.

---

## ✨ Asosiy Imkoniyatlar

1. **She'rlar va G'oyalar to'plami:**
   - Janrlar (Muhabbat, Falsafa, Vatan, To'rtliklar, Mushohada va boshqalar) bo'yicha saralash.
   - She'r matnini qulay o'qish (shrift hajmini kattalashtirish/kichiklashtirish, matnni o'rtada yoki chapda tekislash).
   - Audio yozuv (Shoir ovozida ifodali o'qilgan audio fayllarni tinglash imkoni).
   - Sara asarlar (Featured poems).

2. **Interaktivlik (Kitobxonlar uchun):**
   - **Like (Mehr bildirish):** Animatsiyali yurakcha va real-vaqt hisoblagich.
   - **Izohlar:** Har bir she'r tagida o'z taassurotlarini qoldirish.
   - **Ulashish (Share):** Telegram va WhatsApp orqali she'rni go'zal formatda ulashish yoki havolani nusxalash.
   - **Tezkor qidiruv:** Sarlavha, so'z yoki satrlar bo'yicha bir zumda topish.

3. **Shoir bilan bog'lanish (Telegram Bot integratsiyasi):**
   - Veb-saytdagi aloqa formasi orqali kitobxon o'z ismi, aloqa raqami/telegrami va xabarini yozadi.
   - Xabar **Django backend** orqali shoirning shaxsiy Telegramiga maxsus bot (`@sheriyat_shahridanmiz_bot`) vositasida zudlik bilan chiroyli formatda yetkaziladi.

4. **Maxsus Shoir Admin Paneli (Minimalistik & Professional):**
   - Saytning o'zida maxfiy tugma orqali ochiladigan alohida zamonaviy kabinet (`Shoir Kirish`).
   - **Statistika:** Jami she'rlar, g'oyalar, o'qilishlar soni, likelar va kelgan xabarlar soni.
   - **She'rlar boshqaruvi:** Yangi she'r/g'oya yozish, tahrirlash, o'chirish, qoralama yoki nashr holatiga o'tkazish.
   - **Izohlar nazorati:** Kitobxonlar izohlarini tasdiqlash yoki o'chirish.
   - **Kelgan xabarlar (Inbox):** Sayt orqali yuborilgan xabarlarni o'qish, Telegram holatini ko'rish va kerak bo'lsa qayta yuborish.
   - **Shoir profili sozlamalari:** Taxallus, bio, bosh shior va ijtimoiy tarmoqlar.

5. **Dizayn Estetikasi:**
   - **Yorug' (Papirus/Kitob sahifasi) va Tungi (Siyohdon/Midnight Ink)** rejimlari.
   - Shoirona nafis shriftlar: *Playfair Display*, *Cormorant Garamond*, *Plus Jakarta Sans*.

---

## 🛠 Texnologiyalar

- **Backend:** Python 3.11+, Django 5.2, Django REST Framework, Django CORS Headers, WhiteNoise, Requests.
- **Frontend:** React 19, Vite, Vanilla CSS (Maxsus Poetic Design System), Lucide Icons.
- **Ma'lumotlar bazasi:** PostgreSQL (Ishlab chiqishda SQLite / Renderda PostgreSQL).
- **Deploy:** Render.com (`render.yaml` orqali to'liq avtomatlashtirilgan).

---

## 🔑 Shoir Kirish Ma'lumotlari

- **Shoir Kabineti:** Sayt yuqori o'ng burchagidagi `Shoir Kirish` tugmasi
- **Standart Login:** `shoir`
- **Standart Parol:** `shoir123`
- *(Shuningdek Django standart paneli: `http://127.0.0.1:8000/django-admin/`)*

---

## 🤖 Telegram Bot Ma'lumotlari

- **Bot nomi:** She'riyat Shahridanmiz
- **Bot username:** `@sheriyat_shahridanmiz_bot`
- **Shoir Telegram ID:** `6293681152`

> **Muhim eslatma:** Telegram xavfsizlik qoidalariga ko'ra, bot shaxsiy xabar yuborishi uchun shoir Telegramda [@sheriyat_shahridanmiz_bot](https://t.me/sheriyat_shahridanmiz_bot) ga kirib bir marta **/start** tugmasini bosgan bo'lishi kerak.

---

## 💻 Mahalliy Ishga Tushirish (Local Run)

### 1. Backend:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python seed_data.py          # Boshlang'ich namuna she'rlarni kiritish
python manage.py runserver
```
Backend manzili: `http://127.0.0.1:8000/`

### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend manzili: `http://localhost:5173/` (yoki `5174`)

---

## 🚀 Render.com ga Deploy Qilish

Loyiha ildiz papkasida `render.yaml` fayli sozlangan. Renderda yangi loyiha yaratib (Blueprint):
1. Ushbu GitHub repozitoriyani Render.com akkauntingizga ulang.
2. **New +** -> **Blueprint** ni tanlang.
3. Render `render.yaml` ni o'zi o'qiydi va bir vaqtning o'zida:
   - **PostgreSQL Database** (`sheriyat-db`)
   - **Django Web Service** (`sheriyat-backend`)
   - **React Static Site** (`sheriyat-frontend`)
   ni avtomatik ishga tushiradi!
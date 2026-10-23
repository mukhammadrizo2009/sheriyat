import os
import sys
import django

# Configure UTF-8 for windows terminal
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from accounts.models import PoetProfile
from poems.models import Category, Poem, Comment

def seed():
    print("🌱 Boshlang'ich ma'lumotlarni kiritish...")
    
    # 1. Shoir admin foydalanuvchisini yaratish
    user, created = User.objects.get_or_create(username='shoir')
    if created:
        user.set_password('shoir123')
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print("👤 Shoir superuser yaratildi: login='shoir', parol='shoir123'")
    else:
        user.set_password('shoir123')
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print("👤 Shoir superuser paroli yangilandi ('shoir123')")

    profile, _ = PoetProfile.objects.get_or_create(user=user)
    profile.pen_name = "Alisher Navoiy izdoshlari"
    profile.bio = "So'z — qalbning ko'zgusi, she'r esa ruhning ohangi. Ushbu sahifada hayot, muhabbat va falsafiy mushohadalarimni jamladim."
    profile.quote = "Har bir satr — yurakning bitta urishi..."
    profile.telegram_channel = "@sheriyat_shahridanmiz"
    profile.instagram = "@shoir_kundaligi"
    profile.save()

    # 2. Kategoriyalar yaratish
    categories_data = [
        ("Muhabbat", "Ko'ngil sirlari, sevgi va ayriliq taronalari"),
        ("Falsafa", "Hayot ma'nosi, vaqt va inson haqidagi o'ylar"),
        ("Vatan", "Ona yurt ifori, tug'ilgan tuproq madhi"),
        ("To'rtliklar", "Ixcham, o'tkir va ma'noli to'rt qatorliklar"),
        ("Mushohada va G'oyalar", "Qoralama fikrlar, ilhom lahzalari"),
    ]

    cat_map = {}
    for name, desc in categories_data:
        cat, _ = Category.objects.get_or_create(name=name, defaults={'description': desc})
        cat_map[name] = cat
    print("📁 Kategoriyalar yaratildi.")

    # 3. She'rlar va G'oyalar yaratish
    poems_data = [
        {
            "title": "Ko'ngil fasli",
            "category": cat_map["Muhabbat"],
            "post_type": "poem",
            "written_date": "2024-yil kuz",
            "content": """Sokin oqshomlarda esganda sabo,
Yodimga tushasan, ey munis nigor.
Yurakda mangu bir mungli navo,
Kuz keldi, ko'ngilda hamon intizor.

Barglar to'kiladi dardli va beun,
Daraxtlar termular o'tkinchi yo'lga.
Seni o'ylayapman yana tunma-tun,
Misralar aylanar mungli bir kuyga.

Gar bilsang, har bitta to'kilgan yaproq,
Senga aytolmagan so'zlarim mening.
Bir kun oramizdan ko'tarilsa dog',
Yana gullab ketar ko'klamim mening.""",
            "likes_count": 28,
            "views_count": 142,
            "is_featured": True,
        },
        {
            "title": "Vaqt daryosi",
            "category": cat_map["Falsafa"],
            "post_type": "poem",
            "written_date": "2025-yil qish",
            "content": """Oqib borar sokin, to'xtamas daryo,
Bir on ham bermaydi o'zga ixtiyor.
Bugun kecha bo'lar, bugun ham ro'yo,
Shoshilgan odamlar doim beqaror.

Boylik qolar mangu tuproq ostida,
Shon-shuhrat shabadadek o'tkinchi bir dam.
Inson qolur faqat ezgu qasdida,
Yaxshilik bo'y cho'zar yo'q bo'lsa ham g'am.

Ey do'stim, ko'ngilni pok tutgin mudom,
Ushbu dunyo asli ko'prikdir xolos.
Har bir o'tgan oning bo'lsin dur-in'om,
Yaratgan mehriga intilgin xolos.""",
            "likes_count": 35,
            "views_count": 210,
            "is_featured": True,
        },
        {
            "title": "Tug'ilgan zamin nafasi",
            "category": cat_map["Vatan"],
            "post_type": "poem",
            "written_date": "2024-yil bahor",
            "content": """Tong saharda rayhon isi taralsa,
Keng dalalar bag'riga chorlar.
Qayda bo'lmay ko'zimga ko'rinar kulba,
Quyosh nuri kabi kuladi bog'lar.

Ona diyor, tuprog'ing durdir,
Sen bilan tirikdir mening ijodim.
Har toshing bir tarix, har qator nurlidir,
Sening noming bilan baland parvozim.""",
            "likes_count": 19,
            "views_count": 98,
            "is_featured": False,
        },
        {
            "title": "Sukutdagi sado",
            "category": cat_map["To'rtliklar"],
            "post_type": "poem",
            "written_date": "2025-yil fevral",
            "content": """Ba'zan sukut so'zdan balandroq jarang,
Har ko'zda yashiringan sirli bir jahon.
Gar qalb ko'zi bilan boqsangiz qarang,
Mehr bilan yashnar hatto zimiston.""",
            "likes_count": 42,
            "views_count": 312,
            "is_featured": False,
        },
        {
            "title": "Ilhom lahzasi haqida",
            "category": cat_map["Mushohada va G'oyalar"],
            "post_type": "thought",
            "written_date": "2026-yil mart",
            "content": "She'r — bu oldindan rejalashtiriladigan bino emas. U kutilmaganda, tun yarmida, derazaga urilgan yomg'ir tomchisidek shivirlab keladi. Agar shu lahzada qog'ozga tushirmasang, u shamoldek uchib ketadi va qaytib hech qachon xuddi shunday ohangda qaytmaydi.",
            "likes_count": 15,
            "views_count": 87,
            "is_featured": True,
        }
    ]

    for p_data in poems_data:
        p, created = Poem.objects.get_or_create(
            title=p_data["title"],
            defaults={
                "category": p_data["category"],
                "post_type": p_data["post_type"],
                "content": p_data["content"],
                "written_date": p_data["written_date"],
                "likes_count": p_data["likes_count"],
                "views_count": p_data["views_count"],
                "is_featured": p_data["is_featured"],
            }
        )
        if created:
            # Namuna izohlar
            Comment.objects.create(
                poem=p,
                author_name="Zilola",
                text="Misralar juda ta'sirli va chuqur ma'noga ega, qalamingiz o'tkir bo'lsin!",
                is_approved=True
            )
            Comment.objects.create(
                poem=p,
                author_name="Jasurbek",
                text="Ayniqsa so'nggi bandi yurakka yetib bordi. Yangi she'rlaringizni kutib qolamiz.",
                is_approved=True
            )

    print("📖 She'rlar, g'oyalar va izohlar bazaga muvaffaqiyatli kiritildi!")

if __name__ == '__main__':
    seed()

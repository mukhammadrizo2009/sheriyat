import os
import mimetypes
from django.http import HttpResponse, FileResponse
from django.conf import settings

def serve_react_app(request, path=""):
    """
    React SPA (Single Page Application) ilovasini Django orqali to'g'ridan-to'g'ri tarqatish.
    Barcha yo'nalishlar (masalan / yoki /admin-login) frontend index.html ga yo'naltiriladi.
    """
    dist_dir = settings.BASE_DIR.parent / 'frontend' / 'dist'
    if not dist_dir.exists():
        dist_dir = settings.BASE_DIR / 'dist'
    if not dist_dir.exists():
        dist_dir = settings.BASE_DIR.parent / 'dist'
    
    # Agar maxsus fayl (masalan /assets/..., /favicon.svg) so'ralsa
    if path:
        target_file = dist_dir / path
        if target_file.exists() and target_file.is_file():
            content_type, _ = mimetypes.guess_type(str(target_file))
            return FileResponse(open(target_file, 'rb'), content_type=content_type or 'application/octet-stream')

    # Bosh sahifa yoki SPA marshrutlari uchun index.html qaytariladi
    index_file = dist_dir / 'index.html'
    if index_file.exists():
        return FileResponse(open(index_file, 'rb'), content_type='text/html')
        
    return HttpResponse(
        "<h1>She'riyat Frontend Dist topilmadi</h1><p>Iltimos, avval 'npm run build' buyrug'ini ishga tushiring.</p>", 
        status=404
    )

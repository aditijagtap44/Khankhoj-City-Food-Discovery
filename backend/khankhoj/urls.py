"""
URL configuration for khankhoj project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def root_view(request):
    return JsonResponse({
        "status": "online",
        "project": "KhanKhoj API",
        "message": "Welcome to the KhanKhoj Backend API server!",
        "frontend_url": "http://localhost:5173",
        "endpoints": {
            "admin": "/admin/",
            "cities": "/api/cities/",
            "foods": "/api/foods/",
            "places": "/api/places/",
            "favorites": "/api/favorites/",
            "search": "/api/search/?q=",
            "auth_login": "/api/auth/login/",
            "auth_register": "/api/auth/register/",
            "ai_recommendations": "/api/recommendations/ai/"
        }
    })


urlpatterns = [
    path('', root_view, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView, UserProfileView,
    CityListView, CityDetailView,
    FoodListView, FoodDetailView,
    FoodPlaceListView, FoodPlaceDetailView, SubmitFoodPlaceView,
    ReviewCreateView, FavoriteToggleView, FavoriteListView,
    GlobalSearchView, AIRefineRecommendationsView
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),

    # Cities
    path('cities/', CityListView.as_view(), name='city_list'),
    path('cities/<slug:slug>/', CityDetailView.as_view(), name='city_detail'),

    # Foods
    path('foods/', FoodListView.as_view(), name='food_list'),
    path('foods/<int:pk>/', FoodDetailView.as_view(), name='food_detail'),

    # Food Places
    path('places/', FoodPlaceListView.as_view(), name='place_list'),
    path('places/<int:pk>/', FoodPlaceDetailView.as_view(), name='place_detail'),
    path('places/submit/', SubmitFoodPlaceView.as_view(), name='place_submit'),

    # Reviews
    path('places/<int:place_id>/reviews/', ReviewCreateView.as_view(), name='place_review_create'),

    # Favorites
    path('places/<int:place_id>/favorite/', FavoriteToggleView.as_view(), name='place_favorite_toggle'),
    path('favorites/', FavoriteListView.as_view(), name='favorite_list'),

    # Search & AI Recommender
    path('search/', GlobalSearchView.as_view(), name='global_search'),
    path('recommendations/ai/', AIRefineRecommendationsView.as_view(), name='ai_recommendations'),
]

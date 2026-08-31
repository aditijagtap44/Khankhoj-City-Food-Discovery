from django.contrib import admin
from .models import City, Food, FoodPlace, FoodPlaceItem, Review, Favorite


class FoodPlaceItemInline(admin.TabularInline):
    model = FoodPlaceItem
    extra = 1


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'is_popular', 'places_count', 'foods_count', 'created_at')
    list_filter = ('state', 'is_popular')
    search_fields = ('name', 'state', 'tagline')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'category', 'diet_type', 'price_range', 'is_must_try')
    list_filter = ('city', 'category', 'diet_type', 'is_must_try')
    search_fields = ('name', 'description', 'why_famous')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(FoodPlace)
class FoodPlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'area', 'category', 'diet_type', 'price_tier', 'is_hidden_gem', 'is_approved', 'average_rating')
    list_filter = ('city', 'category', 'diet_type', 'price_tier', 'is_hidden_gem', 'is_approved')
    search_fields = ('name', 'area', 'specialty', 'description')
    inlines = [FoodPlaceItemInline]
    actions = ['approve_places']

    def approve_places(self, request, queryset):
        queryset.update(is_approved=True)
    approve_places.short_description = "Approve selected food places"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'food_place', 'rating', 'must_try_dish', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'food_place__name', 'comment')


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'food_place', 'created_at')
    search_fields = ('user__username', 'food_place__name')

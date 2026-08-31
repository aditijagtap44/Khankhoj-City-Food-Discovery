from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.db.models import Avg


class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    state = models.CharField(max_length=100)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    image_url = models.TextField(help_text="Direct URL to city cover photo")
    is_popular = models.BooleanField(default=True)
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Cities"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.state}"

    @property
    def places_count(self):
        return self.places.filter(is_approved=True).count()

    @property
    def foods_count(self):
        return self.foods.count()


class Food(models.Model):
    CATEGORY_CHOICES = [
        ('street_food', 'Street Food'),
        ('local_food', 'Local Food'),
        ('traditional_food', 'Traditional Food'),
        ('dessert', 'Dessert & Sweets'),
        ('breakfast', 'Breakfast & Snacks'),
        ('beverage', 'Beverages & Drinks'),
        ('main_course', 'Main Course'),
    ]

    DIET_CHOICES = [
        ('veg', 'Vegetarian'),
        ('non_veg', 'Non-Vegetarian'),
        ('egg', 'Contains Egg'),
        ('vegan', 'Vegan'),
    ]

    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='foods')
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=180, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='local_food')
    diet_type = models.CharField(max_length=20, choices=DIET_CHOICES, default='veg')
    description = models.TextField()
    why_famous = models.TextField(help_text="Why this dish is iconic in this city")
    price_range = models.CharField(max_length=50, help_text="e.g. ₹50 - ₹120")
    is_must_try = models.BooleanField(default=False)
    image_url = models.TextField(help_text="Food item photo URL")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_must_try', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.city.name}-{self.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.city.name})"


class FoodPlace(models.Model):
    CATEGORY_CHOICES = [
        ('street_food', 'Street Food Stall'),
        ('traditional_eatery', 'Traditional Eatery'),
        ('family_restaurant', 'Family Restaurant'),
        ('cafe', 'Cafe & Bakery'),
        ('sweet_shop', 'Sweet & Snack Shop'),
        ('heritage_spot', 'Heritage Iconic Spot'),
    ]

    DIET_CHOICES = [
        ('pure_veg', 'Pure Vegetarian'),
        ('non_veg_served', 'Non-Vegetarian & Veg'),
        ('veg_friendly', 'Vegetarian Friendly'),
    ]

    PRICE_TIER_CHOICES = [
        ('budget', 'Budget Friendly (Under ₹150)'),
        ('moderate', 'Moderate (₹150 - ₹400)'),
        ('premium', 'Premium (₹400+)'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='places')
    address = models.TextField()
    area = models.CharField(max_length=150, help_text="Locality or Area name, e.g. FC Road, Chandni Chowk")
    specialty = models.CharField(max_length=255, help_text="Top specialty dishes served here")
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='traditional_eatery')
    diet_type = models.CharField(max_length=20, choices=DIET_CHOICES, default='pure_veg')
    price_range = models.CharField(max_length=100, help_text="e.g. ₹100 - ₹200 for two")
    price_tier = models.CharField(max_length=20, choices=PRICE_TIER_CHOICES, default='budget')
    image_url = models.TextField(help_text="Primary display photo")
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of additional image URLs")
    latitude = models.FloatField(default=18.5204)
    longitude = models.FloatField(default=73.8567)
    opening_hours = models.CharField(max_length=150, default="8:00 AM - 10:00 PM")
    phone = models.CharField(max_length=50, blank=True)
    map_link = models.URLField(blank=True, max_length=500)
    is_hidden_gem = models.BooleanField(default=False)
    why_special = models.TextField(blank=True, help_text="Why this spot is a hidden gem or must visit")
    is_approved = models.BooleanField(default=True)
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='submitted_places')
    featured_foods = models.ManyToManyField(Food, through='FoodPlaceItem', related_name='recommended_places', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_hidden_gem', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.city.name}-{self.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.area}, {self.city.name}"

    @property
    def average_rating(self):
        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg is not None else 4.5

    @property
    def reviews_count(self):
        return self.reviews.count()


class FoodPlaceItem(models.Model):
    place = models.ForeignKey(FoodPlace, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    is_specialty = models.BooleanField(default=True)
    item_price = models.CharField(max_length=50, blank=True)

    class Meta:
        unique_together = ('place', 'food')

    def __str__(self):
        return f"{self.food.name} at {self.place.name}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    food_place = models.ForeignKey(FoodPlace, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(default=5, help_text="Rating from 1 to 5")
    comment = models.TextField()
    must_try_dish = models.CharField(max_length=150, blank=True, help_text="User's top dish recommendation")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} on {self.food_place.name} ({self.rating}★)"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    food_place = models.ForeignKey(FoodPlace, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'food_place')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} saved {self.food_place.name}"

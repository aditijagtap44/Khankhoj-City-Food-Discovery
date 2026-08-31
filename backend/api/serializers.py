from rest_framework import serializers
from django.contrib.auth.models import User
from .models import City, Food, FoodPlace, FoodPlaceItem, Review, Favorite


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            password=validated_data['password']
        )
        return user


class CitySimpleSerializer(serializers.ModelSerializer):
    places_count = serializers.ReadOnlyField()
    foods_count = serializers.ReadOnlyField()

    class Meta:
        model = City
        fields = ['id', 'name', 'slug', 'state', 'tagline', 'description', 'image_url', 'is_popular', 'latitude', 'longitude', 'places_count', 'foods_count']


class FoodSimpleSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    city_slug = serializers.CharField(source='city.slug', read_only=True)

    class Meta:
        model = Food
        fields = ['id', 'name', 'slug', 'city', 'city_name', 'city_slug', 'category', 'diet_type', 'description', 'why_famous', 'price_range', 'is_must_try', 'image_url']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'user_first_name', 'food_place', 'rating', 'comment', 'must_try_dish', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class FoodPlaceSimpleSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    city_slug = serializers.CharField(source='city.slug', read_only=True)
    average_rating = serializers.ReadOnlyField()
    reviews_count = serializers.ReadOnlyField()

    class Meta:
        model = FoodPlace
        fields = [
            'id', 'name', 'slug', 'city', 'city_name', 'city_slug', 'address', 'area',
            'specialty', 'description', 'category', 'diet_type', 'price_range', 'price_tier',
            'image_url', 'latitude', 'longitude', 'opening_hours', 'phone', 'map_link',
            'is_hidden_gem', 'why_special', 'is_approved', 'average_rating', 'reviews_count', 'created_at'
        ]


class FoodPlaceDetailSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    city_slug = serializers.CharField(source='city.slug', read_only=True)
    average_rating = serializers.ReadOnlyField()
    reviews_count = serializers.ReadOnlyField()
    reviews = ReviewSerializer(many=True, read_only=True)
    featured_foods = FoodSimpleSerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = FoodPlace
        fields = [
            'id', 'name', 'slug', 'city', 'city_name', 'city_slug', 'address', 'area',
            'specialty', 'description', 'category', 'diet_type', 'price_range', 'price_tier',
            'image_url', 'gallery_images', 'latitude', 'longitude', 'opening_hours', 'phone', 'map_link',
            'is_hidden_gem', 'why_special', 'is_approved', 'average_rating', 'reviews_count',
            'reviews', 'featured_foods', 'is_favorited', 'created_at'
        ]

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, food_place=obj).exists()
        return False


class FoodDetailSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)
    city_slug = serializers.CharField(source='city.slug', read_only=True)
    recommended_places = FoodPlaceSimpleSerializer(many=True, read_only=True)

    class Meta:
        model = Food
        fields = [
            'id', 'name', 'slug', 'city', 'city_name', 'city_slug', 'category', 'diet_type',
            'description', 'why_famous', 'price_range', 'is_must_try', 'image_url', 'recommended_places'
        ]


class CityDetailSerializer(serializers.ModelSerializer):
    foods = FoodSimpleSerializer(many=True, read_only=True)
    places = FoodPlaceSimpleSerializer(many=True, read_only=True)
    places_count = serializers.ReadOnlyField()
    foods_count = serializers.ReadOnlyField()

    class Meta:
        model = City
        fields = [
            'id', 'name', 'slug', 'state', 'tagline', 'description', 'image_url',
            'is_popular', 'latitude', 'longitude', 'places_count', 'foods_count', 'foods', 'places'
        ]


class FavoriteSerializer(serializers.ModelSerializer):
    food_place = FoodPlaceSimpleSerializer(read_only=True)
    food_place_id = serializers.PrimaryKeyRelatedField(
        queryset=FoodPlace.objects.all(), source='food_place', write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'food_place', 'food_place_id', 'created_at']


class SubmitFoodPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodPlace
        fields = [
            'name', 'city', 'address', 'area', 'specialty', 'description',
            'category', 'diet_type', 'price_range', 'price_tier', 'image_url',
            'latitude', 'longitude', 'opening_hours', 'phone', 'map_link',
            'is_hidden_gem', 'why_special'
        ]

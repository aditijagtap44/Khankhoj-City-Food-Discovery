from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from django.db.models import Q, Avg
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import City, Food, FoodPlace, FoodPlaceItem, Review, Favorite
from .serializers import (
    UserSerializer, RegisterSerializer, CitySimpleSerializer, CityDetailSerializer,
    FoodSimpleSerializer, FoodDetailSerializer, FoodPlaceSimpleSerializer,
    FoodPlaceDetailSerializer, ReviewSerializer, FavoriteSerializer, SubmitFoodPlaceSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class CityListView(generics.ListAPIView):
    serializer_class = CitySimpleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = City.objects.all()
        popular_only = self.request.query_params.get('popular')
        if popular_only and popular_only.lower() == 'true':
            queryset = queryset.filter(is_popular=True)
        return queryset


class CityDetailView(generics.RetrieveAPIView):
    queryset = City.objects.all()
    serializer_class = CityDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class FoodListView(generics.ListAPIView):
    serializer_class = FoodSimpleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Food.objects.all().select_related('city')
        city_slug = self.request.query_params.get('city')
        category = self.request.query_params.get('category')
        diet = self.request.query_params.get('diet')
        must_try = self.request.query_params.get('must_try')
        search = self.request.query_params.get('search')

        if city_slug:
            queryset = queryset.filter(city__slug=city_slug)
        if category:
            queryset = queryset.filter(category=category)
        if diet:
            queryset = queryset.filter(diet_type=diet)
        if must_try and must_try.lower() == 'true':
            queryset = queryset.filter(is_must_try=True)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(why_famous__icontains=search)
            )
        return queryset


class FoodDetailView(generics.RetrieveAPIView):
    queryset = Food.objects.all().select_related('city').prefetch_related('recommended_places')
    serializer_class = FoodDetailSerializer
    permission_classes = [permissions.AllowAny]


class FoodPlaceListView(generics.ListAPIView):
    serializer_class = FoodPlaceSimpleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = FoodPlace.objects.filter(is_approved=True).select_related('city')
        city_slug = self.request.query_params.get('city')
        category = self.request.query_params.get('category')
        diet = self.request.query_params.get('diet')
        price_tier = self.request.query_params.get('price_tier')
        hidden_gem = self.request.query_params.get('hidden_gem')
        search = self.request.query_params.get('search')
        sort_by = self.request.query_params.get('sort_by')

        if city_slug:
            queryset = queryset.filter(city__slug=city_slug)
        if category:
            queryset = queryset.filter(category=category)
        if diet:
            queryset = queryset.filter(diet_type=diet)
        if price_tier:
            queryset = queryset.filter(price_tier=price_tier)
        if hidden_gem and hidden_gem.lower() == 'true':
            queryset = queryset.filter(is_hidden_gem=True)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(specialty__icontains=search) |
                Q(area__icontains=search) |
                Q(description__icontains=search) |
                Q(city__name__icontains=search)
            )

        if sort_by == 'rating':
            queryset = queryset.annotate(avg_r=Avg('reviews__rating')).order_by('-avg_r')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')

        return queryset


class FoodPlaceDetailView(generics.RetrieveAPIView):
    queryset = FoodPlace.objects.all().select_related('city').prefetch_related('reviews__user', 'featured_foods')
    serializer_class = FoodPlaceDetailSerializer
    permission_classes = [permissions.AllowAny]


class SubmitFoodPlaceView(generics.CreateAPIView):
    serializer_class = SubmitFoodPlaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user, is_approved=True)


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        place_id = self.kwargs.get('place_id')
        place = get_object_or_404(FoodPlace, id=place_id)
        serializer.save(user=self.request.user, food_place=place)


class FavoriteToggleView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, place_id):
        place = get_object_or_404(FoodPlace, id=place_id)
        fav, created = Favorite.objects.get_or_404_or_create = Favorite.objects.get_or_create(
            user=request.user, food_place=place
        )
        if not created:
            fav.delete()
            return Response({"status": "removed", "is_favorited": False}, status=status.HTTP_200_OK)
        return Response({"status": "added", "is_favorited": True}, status=status.HTTP_201_CREATED)


class FavoriteListView(generics.ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('food_place__city')


class GlobalSearchView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"cities": [], "foods": [], "places": []})

        cities = City.objects.filter(
            Q(name__icontains=query) | Q(state__icontains=query) | Q(tagline__icontains=query)
        )[:5]

        foods = Food.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query) | Q(why_famous__icontains=query) | Q(city__name__icontains=query)
        ).select_related('city')[:8]

        places = FoodPlace.objects.filter(
            is_approved=True
        ).filter(
            Q(name__icontains=query) | Q(specialty__icontains=query) | Q(area__icontains=query) | Q(city__name__icontains=query) | Q(description__icontains=query)
        ).select_related('city')[:10]

        return Response({
            "query": query,
            "cities": CitySimpleSerializer(cities, many=True).data,
            "foods": FoodSimpleSerializer(foods, many=True).data,
            "places": FoodPlaceSimpleSerializer(places, many=True).data,
        })


class AIRefineRecommendationsView(views.APIView):
    """
    Intelligent recommendation engine that matches user preference:
    city, mood/craving, budget tier, diet type, and hidden gem preference.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        city_slug = request.data.get('city')
        diet = request.data.get('diet')
        budget = request.data.get('budget')
        craving = request.data.get('craving', '')
        hidden_gem = request.data.get('hidden_gem', False)

        queryset = FoodPlace.objects.filter(is_approved=True).select_related('city')

        if city_slug:
            queryset = queryset.filter(city__slug=city_slug)
        if diet:
            queryset = queryset.filter(diet_type=diet)
        if budget:
            queryset = queryset.filter(price_tier=budget)
        if hidden_gem:
            queryset = queryset.filter(is_hidden_gem=True)
        if craving:
            queryset = queryset.filter(
                Q(specialty__icontains=craving) |
                Q(name__icontains=craving) |
                Q(description__icontains=craving)
            )

        places = queryset[:6]
        return Response({
            "criteria": {
                "city": city_slug,
                "diet": diet,
                "budget": budget,
                "craving": craving,
                "hidden_gem": hidden_gem,
            },
            "recommendations": FoodPlaceSimpleSerializer(places, many=True).data,
            "suggestion_tip": f"Based on your craving for {craving or 'authentic flavors'}, here are our hand-picked spots!"
        })

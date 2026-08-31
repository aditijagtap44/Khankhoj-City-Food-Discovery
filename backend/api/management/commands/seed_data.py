import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import City, Food, FoodPlace, FoodPlaceItem, Review, Favorite


class Command(BaseCommand):
    help = 'Seeds database with comprehensive authentic food, places, and cities data for Khankhoj'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting Khankhoj database seeding...'))

        # Create Admin and Demo User
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@khankhoj.com',
                'first_name': 'Khankhoj',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()

        demo_user, _ = User.objects.get_or_create(
            username='foodie_rohit',
            defaults={
                'email': 'rohit@example.com',
                'first_name': 'Rohit',
                'last_name': 'Sharma',
            }
        )
        demo_user.set_password('foodie123')
        demo_user.save()

        priya_user, _ = User.objects.get_or_create(
            username='priya_eats',
            defaults={
                'email': 'priya@example.com',
                'first_name': 'Priya',
                'last_name': 'Patel',
            }
        )
        priya_user.set_password('foodie123')
        priya_user.save()

        # Seed Cities Data
        cities_data = [
            {
                "name": "Pune",
                "state": "Maharashtra",
                "tagline": "The Cultural & Spicy Food Capital of Maharashtra",
                "description": "Pune offers a delightful mix of fiery traditional Maharashtrian street food, historic heritage wada eateries, rich thick ice cream shakes (Mastani), and vibrant student cafe hubs.",
                "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
                "is_popular": True,
                "latitude": 18.5204,
                "longitude": 73.8567,
            },
            {
                "name": "Mumbai",
                "state": "Maharashtra",
                "tagline": "The City of Dreams & Endless Street Food Flavors",
                "description": "From steaming spicy Vada Pav stalls at local train stations to legendary Irani cafes and beachfront Pav Bhaji, Mumbai's food scene never sleeps.",
                "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
                "is_popular": True,
                "latitude": 19.0760,
                "longitude": 72.8777,
            },
            {
                "name": "Delhi",
                "state": "Delhi NCR",
                "tagline": "The Epicenter of Mughlai, Chaat & Royal Gastronomy",
                "description": "Delhi's narrow alleys in Chandni Chowk boast centuries-old culinary secrets, butter chicken heritage, sizzling parathas, and unmatched street chaat.",
                "image_url": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
                "is_popular": True,
                "latitude": 28.6139,
                "longitude": 77.2090,
            },
            {
                "name": "Bangalore",
                "state": "Karnataka",
                "tagline": "The Garden City of Crisp Dosas & Aromatic Filter Kaapi",
                "description": "Known for crispy golden Benne Dosas roasted in pure butter, bustling heritage tiffin rooms, microbreweries, and steaming cups of South Indian filter coffee.",
                "image_url": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
                "is_popular": True,
                "latitude": 12.9716,
                "longitude": 77.5946,
            },
            {
                "name": "Hyderabad",
                "state": "Telangana",
                "tagline": "The Legendary City of Nizam's Dum Biryani & Irani Chai",
                "description": "Home to the world-renowned Hyderabadi Dum Biryani, melt-in-mouth Haleem, spicy Andhra curries, and centuries-old Irani tea culture around the Charminar.",
                "image_url": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
                "is_popular": True,
                "latitude": 17.3850,
                "longitude": 78.4867,
            },
            {
                "name": "Chennai",
                "state": "Tamil Nadu",
                "tagline": "Soulful Flavors of Idlis, Sambar & Chettinad Spices",
                "description": "Experience piping hot fluffy idlis, tangy sambar, fiery Chettinad non-veg gravies, coastal seafood curries, and frothy degree filter coffee on banana leaves.",
                "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "is_popular": True,
                "latitude": 13.0827,
                "longitude": 80.2707,
            },
            {
                "name": "Kolkata",
                "state": "West Bengal",
                "tagline": "The City of Joy, Aromatic Kathi Rolls & Melt-in-Mouth Mishti",
                "description": "Kolkata is a foodie wonderland celebrating fragrant potato-infused Kolkata Biryani, smoky Kathi rolls, spicy Phuchkas, and legendary sweets like Roshogolla & Mishti Doi.",
                "image_url": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
                "is_popular": True,
                "latitude": 22.5726,
                "longitude": 88.3639,
            }
        ]

        city_instances = {}
        for c in cities_data:
            city, _ = City.objects.update_or_create(
                name=c["name"],
                defaults=c
            )
            city_instances[c["name"]] = city

        # ----------------------------------------------------
        # SEED FOODS AND FOOD PLACES
        # ----------------------------------------------------

        # --- PUNE FOODS ---
        pune_foods = [
            {
                "city": city_instances["Pune"],
                "name": "Puneri Misal Pav",
                "category": "street_food",
                "diet_type": "veg",
                "description": "A spicy sprouted moth bean curry (Usal) topped with crunchy farsan, chopped onions, lemon, and fiery red gravy (Kat/Rassa), served with soft pav.",
                "why_famous": "Pune's undisputed breakfast and snack king with distinct fiery variations like Kolhapuri, Puneri, and Nashik style rassa.",
                "price_range": "₹70 - ₹130",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Pune"],
                "name": "Puneri Mastani",
                "category": "dessert",
                "diet_type": "veg",
                "description": "A lavish dessert drink made with thick rich fruit milkshake (Mango, Kesar, Anjeer), topped with a giant scoop of ice cream, dry fruits, and tutty-fruity.",
                "why_famous": "Invented exclusively in Pune and named after Bajirao Peshwa's beloved Mastani. You can only taste the authentic version here.",
                "price_range": "₹90 - ₹180",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Pune"],
                "name": "Bakharwadi",
                "category": "traditional_food",
                "diet_type": "veg",
                "description": "Crispy golden fried dough rolls stuffed with a spicy, tangy, and sweet mixture of coconut, poppy seeds, and roasted Maharashtrian spices.",
                "why_famous": "The world-famous souvenir snack from Pune, perfected over decades by Chitale Bandhu Mithaiwale.",
                "price_range": "₹120 - ₹250 / pack",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Pune"],
                "name": "JJ Garden Vada Pav",
                "category": "street_food",
                "diet_type": "veg",
                "description": "Massive crispy hot potato fritter inside fresh pav laced with spicy green chilly thecha and sweet tamarind chutney.",
                "why_famous": "Known for the signature huge batata vada and buttery crust, loved by generations of Pune foodies.",
                "price_range": "₹25 - ₹40",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Pune"],
                "name": "Puran Poli with Katachi Amti",
                "category": "traditional_food",
                "diet_type": "veg",
                "description": "Sweet flatbread stuffed with cooked chana dal and jaggery infused with cardamom and nutmeg, drizzled with pure desi ghee and served with spicy thin Katachi Amti.",
                "why_famous": "The quintessential Maharashtrian festive royal dish cooked in authentic wada style.",
                "price_range": "₹80 - ₹160",
                "is_must_try": False,
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
            }
        ]

        food_map = {}
        for f in pune_foods:
            f_inst, _ = Food.objects.update_or_create(
                city=f["city"],
                name=f["name"],
                defaults=f
            )
            food_map[f["name"]] = f_inst

        # --- PUNE PLACES ---
        pune_places = [
            {
                "city": city_instances["Pune"],
                "name": "Kata Kirr",
                "area": "Karve Nagar / Deccan",
                "address": "Opposite Kalmadi High School, Dr Ketkar Road, Erandwane, Pune",
                "specialty": "Kolhapuri Spicy Usal Misal with extra Kat & Buttermilk",
                "description": "Renowned across Maharashtra for serving three customizable spice levels of Kat (Tikh/Medium/Low). The sprouted usal and crunch farsan are unmatched.",
                "category": "traditional_eatery",
                "diet_type": "pure_veg",
                "price_range": "₹150 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.5089,
                "longitude": 73.8340,
                "opening_hours": "8:00 AM - 3:00 PM",
                "is_hidden_gem": False,
                "why_special": "Iconic Misal destination where hundreds queue up every morning for the fiery Kat rassa.",
                "food_names": ["Puneri Misal Pav"]
            },
            {
                "city": city_instances["Pune"],
                "name": "Sujata Mastani",
                "area": "Sadashiv Peth",
                "address": "1256, Sadashiv Peth, Near Chimanya Ganpati, Pune",
                "specialty": "Mango Mastani, Kesar Pista Mastani, Sitaphal Shake",
                "description": "The birthplace of the authentic Puneri Mastani drink since 1968. Thick, rich, natural fruit blends topped with homemade artisanal ice cream.",
                "category": "sweet_shop",
                "diet_type": "pure_veg",
                "price_range": "₹200 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.5135,
                "longitude": 73.8530,
                "opening_hours": "11:00 AM - 11:30 PM",
                "is_hidden_gem": False,
                "why_special": "Historic shop that created Pune's most celebrated dessert drink.",
                "food_names": ["Puneri Mastani"]
            },
            {
                "city": city_instances["Pune"],
                "name": "JJ Garden Vada Pav Stall",
                "area": "Camp",
                "address": "Near JJ Garden, Bootee Street, Camp, Pune",
                "specialty": "Jumbo Crispy Vada Pav & Masala Taas",
                "description": "Operating since 1972, this bustling street corner is always packed with regulars craving giant piping hot vadas served with authentic spicy fried green chillies.",
                "category": "street_food",
                "diet_type": "pure_veg",
                "price_range": "₹60 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.5167,
                "longitude": 73.8767,
                "opening_hours": "9:00 AM - 10:00 PM",
                "is_hidden_gem": True,
                "why_special": "Legendary street food gem with over 50 years of unchanged secret masala blend.",
                "food_names": ["JJ Garden Vada Pav"]
            },
            {
                "city": city_instances["Pune"],
                "name": "Chitale Bandhu Mithaiwale",
                "area": "Bajirao Road, Laxmi Road",
                "address": "775/29, Shanipar Chowk, Bajirao Road, Sadashiv Peth, Pune",
                "specialty": "Crispy Bhakarwadi, Mango Burfi, Amba Peda",
                "description": "The golden standard of Maharashtrian sweets and savories. People from across the world take kilograms of their signature fresh Bhakarwadi home.",
                "category": "sweet_shop",
                "diet_type": "pure_veg",
                "price_range": "₹300 for two",
                "price_tier": "moderate",
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.5147,
                "longitude": 73.8540,
                "opening_hours": "8:30 AM - 1:00 PM, 4:00 PM - 8:30 PM",
                "is_hidden_gem": False,
                "why_special": "World-famous institution defining Puneri taste since 1950.",
                "food_names": ["Bakharwadi"]
            },
            {
                "city": city_instances["Pune"],
                "name": "Bedekar Tea Stall & Misal",
                "area": "Narayan Peth",
                "address": "418, Munjabacha Bol, Narayan Peth, Pune",
                "specialty": "Sweet-Tangy Puneri Misal with Fresh Slices of Bread",
                "description": "A historic alley shop established in 1948 serving traditional Pune style misal with slice bread instead of pav, followed by aromatic ginger tea.",
                "category": "heritage_spot",
                "diet_type": "pure_veg",
                "price_range": "₹160 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.5180,
                "longitude": 73.8490,
                "opening_hours": "7:30 AM - 7:00 PM",
                "is_hidden_gem": True,
                "why_special": "Historic alley eatery preserving Pune's vintage culinary roots.",
                "food_names": ["Puneri Misal Pav"]
            },
            {
                "city": city_instances["Pune"],
                "name": "Appa Balwant Pohe & Sabudana Corner",
                "area": "Budhwar Peth",
                "address": "Appa Balwant Chowk, Pune",
                "specialty": "Kande Pohe, Sabudana Khichdi, Crispy Vada",
                "description": "Tucked in the heritage book market of ABC, this humble cart serves the softest steaming Kande Pohe garnished with fresh coconut and sev since 1965.",
                "category": "street_food",
                "diet_type": "pure_veg",
                "price_range": "₹50 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.5165,
                "longitude": 73.8552,
                "opening_hours": "6:30 AM - 12:00 PM",
                "is_hidden_gem": True,
                "why_special": "Beloved local students and morning walkers secret breakfast spot.",
                "food_names": ["Puran Poli with Katachi Amti"]
            }
        ]

        for p_data in pune_places:
            food_names = p_data.pop("food_names", [])
            place, _ = FoodPlace.objects.update_or_create(
                city=p_data["city"],
                name=p_data["name"],
                defaults=p_data
            )
            for fname in food_names:
                if fname in food_map:
                    FoodPlaceItem.objects.get_or_create(place=place, food=food_map[fname])

        # --- MUMBAI FOODS & PLACES ---
        mumbai_foods = [
            {
                "city": city_instances["Mumbai"],
                "name": "Mumbai Vada Pav",
                "category": "street_food",
                "diet_type": "veg",
                "description": "Crispy spiced potato fritter sandwiched in soft ladi pav with fiery dry garlic-coconut chutney and sweet tamarind sauce.",
                "why_famous": "The heartbeat of Mumbai's street culinary identity.",
                "price_range": "₹20 - ₹40",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Mumbai"],
                "name": "Bombay Butter Pav Bhaji",
                "category": "street_food",
                "diet_type": "veg",
                "description": "Thick spicy mashed vegetable curry cooked on a giant flat iron tawa loaded with Amul butter, served with toasted pav and chopped onions.",
                "why_famous": "Originating as a midnight quick meal for textile mill workers, now Mumbai's world-famous dish.",
                "price_range": "₹120 - ₹220",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Mumbai"],
                "name": "Irani Bun Maska & Chai",
                "category": "breakfast",
                "diet_type": "veg",
                "description": "Pillowy sweet bun slathered with generous homemade white butter, dipped in creamy, slow-brewed Irani kadak chai.",
                "why_famous": "A century-old Parsi/Irani cafe ritual preserving colonial Bombay vibes.",
                "price_range": "₹60 - ₹120",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Mumbai"],
                "name": "Bombay Grilled Sandwich",
                "category": "street_food",
                "diet_type": "veg",
                "description": "Triple-decker bread stuffed with sliced potatoes, beetroot, cucumber, onions, spicy mint chutney, cheese, and chaat masala, toasted crisp on coal.",
                "why_famous": "Every street corner in Mumbai creates its own mouthwatering variation.",
                "price_range": "₹70 - ₹150",
                "is_must_try": False,
                "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80"
            }
        ]

        for f in mumbai_foods:
            f_inst, _ = Food.objects.update_or_create(city=f["city"], name=f["name"], defaults=f)
            food_map[f["name"]] = f_inst

        mumbai_places = [
            {
                "city": city_instances["Mumbai"],
                "name": "Ashok Vada Pav (Kirti College)",
                "area": "Dadar West",
                "address": "Kashinath Dhuru Marg, Dadar West, Mumbai",
                "specialty": "Vada Pav with signature crunchy Chura & Green Chutney",
                "description": "One of Mumbai's most iconic stalls, operating for over 35 years. Famous for crispy chura (crunchy batter droplets) stuffed into every pav.",
                "category": "street_food",
                "diet_type": "pure_veg",
                "price_range": "₹60 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
                "latitude": 19.0178,
                "longitude": 72.8315,
                "opening_hours": "11:00 AM - 9:30 PM",
                "is_hidden_gem": False,
                "why_special": "Celebrity favorite and widely regarded as one of Mumbai's best Vada Pavs.",
                "food_names": ["Mumbai Vada Pav"]
            },
            {
                "city": city_instances["Mumbai"],
                "name": "Sardar Refreshments",
                "area": "Tardeo",
                "address": "166-A, Tardeo Road, Junction, Mumbai",
                "specialty": "Cheese Butter Pav Bhaji with slab of melting butter",
                "description": "Famous for the richest Pav Bhaji in Mumbai, swimming in a generous pool of Amul butter and served with softest pavs.",
                "category": "traditional_eatery",
                "diet_type": "pure_veg",
                "price_range": "₹350 for two",
                "price_tier": "moderate",
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.9696,
                "longitude": 72.8193,
                "opening_hours": "12:00 PM - 1:00 AM",
                "is_hidden_gem": False,
                "why_special": "The butteriest pav bhaji in the country.",
                "food_names": ["Bombay Butter Pav Bhaji"]
            },
            {
                "city": city_instances["Mumbai"],
                "name": "Kyani & Co.",
                "area": "Marine Lines",
                "address": "Jer Mahal Estate, 657, JSS Road, Marine Lines, Mumbai",
                "specialty": "Bun Maska, Keema Pav, Mawa Cake & Irani Chai",
                "description": "Founded in 1904, Kyani & Co is Mumbai's oldest operational Irani cafe with vintage wooden chairs, checkered tablecloths, and classic glass bakery jars.",
                "category": "heritage_spot",
                "diet_type": "non_veg_served",
                "price_range": "₹250 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.9438,
                "longitude": 72.8282,
                "opening_hours": "7:00 AM - 8:30 PM",
                "is_hidden_gem": True,
                "why_special": "Timeless 120-year-old heritage Irani cafe that transports you to old Bombay.",
                "food_names": ["Irani Bun Maska & Chai"]
            },
            {
                "city": city_instances["Mumbai"],
                "name": "Khadke Sandwich Corner",
                "area": "Churchgate",
                "address": "Near Churchgate Station, Mumbai",
                "specialty": "Coal-Grilled Veggie Cheese Toast Sandwich",
                "description": "A hidden lane stall tucked away near the station where generations of college students and office goers get fresh coal-toasted sandwiches.",
                "category": "street_food",
                "diet_type": "pure_veg",
                "price_range": "₹120 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
                "latitude": 18.9322,
                "longitude": 72.8264,
                "opening_hours": "10:00 AM - 8:30 PM",
                "is_hidden_gem": True,
                "why_special": "Authentic coal-iron grill technique that creates incomparable smoky flavor.",
                "food_names": ["Bombay Grilled Sandwich"]
            }
        ]

        for p_data in mumbai_places:
            food_names = p_data.pop("food_names", [])
            place, _ = FoodPlace.objects.update_or_create(city=p_data["city"], name=p_data["name"], defaults=p_data)
            for fname in food_names:
                if fname in food_map:
                    FoodPlaceItem.objects.get_or_create(place=place, food=food_map[fname])

        # --- DELHI FOODS & PLACES ---
        delhi_foods = [
            {
                "city": city_instances["Delhi"],
                "name": "Pindi Chole Bhature",
                "category": "street_food",
                "diet_type": "veg",
                "description": "Fluffy, balloon-like fried bhaturas paired with pitch-black spicy chole cooked with amla, pickled carrots, raw onions, and tangy mint chutney.",
                "why_famous": "Delhi's undisputed king of weekend breakfasts and spicy street cravings.",
                "price_range": "₹80 - ₹180",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Delhi"],
                "name": "Old Delhi Butter Chicken & Naan",
                "category": "main_course",
                "diet_type": "non_veg",
                "description": "Tandoori chicken pieces simmered in a velvety, rich tomato, butter, and cashew gravy infused with dried fenugreek (kasuri methi).",
                "why_famous": "Invented right here in Delhi's Daryaganj, setting the gold standard worldwide.",
                "price_range": "₹350 - ₹700",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Delhi"],
                "name": "Stuffed Parathas of Chandni Chowk",
                "category": "traditional_food",
                "diet_type": "veg",
                "description": "Crispy golden shallow-fried parathas stuffed with rabri, papad, paneer, mixed vegetables, or khoya, served with pumpkin sabzi and banana chutney.",
                "why_famous": "Centuries-old Paranthe Wali Gali in Shahjahanabad serving royal heritage recipes.",
                "price_range": "₹80 - ₹150",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Delhi"],
                "name": "Dahi Bhalla Chaat",
                "category": "street_food",
                "diet_type": "veg",
                "description": "Soft lentil dumplings soaked in sweet whisked curd, topped with spicy roasted cumin powder, red saunth chutney, and fresh pomegranate seeds.",
                "why_famous": "Melt-in-the-mouth texture and balancing blend of sweet, sour, and spice.",
                "price_range": "₹60 - ₹120",
                "is_must_try": False,
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
            }
        ]

        for f in delhi_foods:
            f_inst, _ = Food.objects.update_or_create(city=f["city"], name=f["name"], defaults=f)
            food_map[f["name"]] = f_inst

        delhi_places = [
            {
                "city": city_instances["Delhi"],
                "name": "Sita Ram Diwan Chand",
                "area": "Pahar Ganj",
                "address": "2243, Rajguru Marg, Chuna Mandi, Paharganj, New Delhi",
                "specialty": "Paneer Stuffed Bhature with Dark Spicy Chole & Achaar",
                "description": "Legendary spot established in 1950. Their secret spiced chole recipe and paneer-crumbled bhaturas draw massive crowds every single morning.",
                "category": "traditional_eatery",
                "diet_type": "pure_veg",
                "price_range": "₹160 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
                "latitude": 28.6433,
                "longitude": 77.2140,
                "opening_hours": "8:00 AM - 5:30 PM",
                "is_hidden_gem": False,
                "why_special": "Widely voted Delhi's top Chole Bhature for over half a century.",
                "food_names": ["Pindi Chole Bhature"]
            },
            {
                "city": city_instances["Delhi"],
                "name": "Karim's Historic Mughlai",
                "area": "Jama Masjid, Old Delhi",
                "address": "16, Gali Kababian, Jama Masjid, Old Delhi",
                "specialty": "Mutton Korma, Seekh Kebab, Butter Chicken & Tandoori Roti",
                "description": "Established in 1913 by Haji Karimuddin, royal chef descendant of the Mughal emperors. Dining in this narrow lane feels like living a page of history.",
                "category": "heritage_spot",
                "diet_type": "non_veg_served",
                "price_range": "₹600 for two",
                "price_tier": "moderate",
                "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
                "latitude": 28.6507,
                "longitude": 77.2334,
                "opening_hours": "11:00 AM - 11:30 PM",
                "is_hidden_gem": False,
                "why_special": "Centuries-old royal Mughal cuisine prepared with royal secret spice formulas.",
                "food_names": ["Old Delhi Butter Chicken & Naan"]
            },
            {
                "city": city_instances["Delhi"],
                "name": "Pandit Gaya Prasad Shiv Charan Paranthe Wale",
                "area": "Chandni Chowk",
                "address": "34, Paranthe Wali Gali, Chandni Chowk, Old Delhi",
                "specialty": "Rabri Paratha, Khoya Paratha & Mixed Veg Paratha",
                "description": "Operating since 1872, this legendary 6th-generation shop fries delicate stuffed parathas in pure desi ghee over brass tawas.",
                "category": "heritage_spot",
                "diet_type": "pure_veg",
                "price_range": "₹250 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
                "latitude": 28.6558,
                "longitude": 77.2307,
                "opening_hours": "9:00 AM - 10:30 PM",
                "is_hidden_gem": True,
                "why_special": "150-year-old culinary institution visited by Prime Ministers and royals.",
                "food_names": ["Stuffed Parathas of Chandni Chowk"]
            }
        ]

        for p_data in delhi_places:
            food_names = p_data.pop("food_names", [])
            place, _ = FoodPlace.objects.update_or_create(city=p_data["city"], name=p_data["name"], defaults=p_data)
            for fname in food_names:
                if fname in food_map:
                    FoodPlaceItem.objects.get_or_create(place=place, food=food_map[fname])

        # --- BANGALORE FOODS & PLACES ---
        blr_foods = [
            {
                "city": city_instances["Bangalore"],
                "name": "Crispy Benne Masala Dosa",
                "category": "breakfast",
                "diet_type": "veg",
                "description": "Crisp golden pancake roasted with aromatic pure white butter (benne), smeared with spicy red garlic chutney, filled with mashed spiced potato, served with coconut chutney.",
                "why_famous": "Crisp exterior and fluffy melt-in-mouth interior unmatched anywhere else.",
                "price_range": "₹70 - ₹140",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Bangalore"],
                "name": "South Indian Filter Kaapi",
                "category": "beverage",
                "diet_type": "veg",
                "description": "Strong decoction made from freshly roasted chicory-blended coffee beans, poured with frothy boiled milk in a traditional brass dabarah and tumbler.",
                "why_famous": "The soul of South Indian morning culture.",
                "price_range": "₹20 - ₹50",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Bangalore"],
                "name": "Bisi Bele Bath",
                "category": "local_food",
                "diet_type": "veg",
                "description": "Hot lentil rice porridge cooked with tamarind, vegetables, aromatic hand-ground spice blend, and generous dollop of ghee topped with boondi.",
                "why_famous": "Karnataka's comfort food supreme.",
                "price_range": "₹60 - ₹120",
                "is_must_try": False,
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
            }
        ]

        for f in blr_foods:
            f_inst, _ = Food.objects.update_or_create(city=f["city"], name=f["name"], defaults=f)
            food_map[f["name"]] = f_inst

        blr_places = [
            {
                "city": city_instances["Bangalore"],
                "name": "CTR - Shri Sagar (Central Tiffin Room)",
                "area": "Malleshwaram",
                "address": "7th Cross, Margosa Road, Malleshwaram, Bengaluru",
                "specialty": "Benne Masala Dosa & Filter Kaapi",
                "description": "Established in the 1920s, this historic tiffin room serves arguably the crispiest, butteriest Benne Masala Dosa in South India.",
                "category": "heritage_spot",
                "diet_type": "pure_veg",
                "price_range": "₹160 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80",
                "latitude": 12.9982,
                "longitude": 77.5707,
                "opening_hours": "7:30 AM - 12:30 PM, 4:00 PM - 9:00 PM",
                "is_hidden_gem": False,
                "why_special": "Centennial institution renowned for perfection in butter dosas.",
                "food_names": ["Crispy Benne Masala Dosa", "South Indian Filter Kaapi"]
            },
            {
                "city": city_instances["Bangalore"],
                "name": "Brahmin's Coffee Bar",
                "area": "Shankarapuram, Basavanagudi",
                "address": "Near Shankar Math, Ranga Rao Road, Basavanagudi, Bengaluru",
                "specialty": "Fluffy Idli, Crispy Vada with Unlimited Coconut Chutney & Filter Coffee",
                "description": "A legendary stand-and-eat stall serving since 1965. No sambar is served—only their world-famous, subtly spiced mint-coconut chutney.",
                "category": "heritage_spot",
                "diet_type": "pure_veg",
                "price_range": "₹100 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
                "latitude": 12.9463,
                "longitude": 77.5721,
                "opening_hours": "6:00 AM - 12:00 PM, 3:00 PM - 7:00 PM",
                "is_hidden_gem": True,
                "why_special": "Simple 4-item menu perfected over 60 years with a cult-like loyal following.",
                "food_names": ["South Indian Filter Kaapi"]
            }
        ]

        for p_data in blr_places:
            food_names = p_data.pop("food_names", [])
            place, _ = FoodPlace.objects.update_or_create(city=p_data["city"], name=p_data["name"], defaults=p_data)
            for fname in food_names:
                if fname in food_map:
                    FoodPlaceItem.objects.get_or_create(place=place, food=food_map[fname])

        # --- HYDERABAD FOODS & PLACES ---
        hyd_foods = [
            {
                "city": city_instances["Hyderabad"],
                "name": "Hyderabadi Dum Biryani",
                "category": "main_course",
                "diet_type": "non_veg",
                "description": "Fragrant long-grain basmati rice and marinated tender meat slow-cooked in a sealed handi with saffron, mint, fried onions, and royal spices (Kachhi Dum style).",
                "why_famous": "World's most celebrated Biryani crowned by royal Nizam heritage.",
                "price_range": "₹220 - ₹450",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Hyderabad"],
                "name": "Irani Chai & Osmania Biscuits",
                "category": "beverage",
                "diet_type": "veg",
                "description": "Rich condensed milk-infused slow-brewed tea paired with sweet and lightly salted melt-in-mouth Osmania biscuits.",
                "why_famous": "The hallmark evening conversation companion at Charminar.",
                "price_range": "₹30 - ₹70",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
            }
        ]

        for f in hyd_foods:
            f_inst, _ = Food.objects.update_or_create(city=f["city"], name=f["name"], defaults=f)
            food_map[f["name"]] = f_inst

        hyd_places = [
            {
                "city": city_instances["Hyderabad"],
                "name": "Hotel Shadab",
                "area": "Ghansi Bazaar, Near Charminar",
                "address": "Plot 21, High Court Road, Near Madina Circle, Ghansi Bazaar, Hyderabad",
                "specialty": "Mutton Dum Biryani, Gurda Fry, Haleem & Shahi Tukda",
                "description": "The ultimate haven for food connoisseurs near Charminar. Known for aromatic saffron-infused rice and melting tender mutton pieces.",
                "category": "traditional_eatery",
                "diet_type": "non_veg_served",
                "price_range": "₹450 for two",
                "price_tier": "moderate",
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
                "latitude": 17.3688,
                "longitude": 78.4735,
                "opening_hours": "6:00 AM - 1:00 AM",
                "is_hidden_gem": False,
                "why_special": "True authentic Hyderabadi flavor preferred by local food historians over commercial chains.",
                "food_names": ["Hyderabadi Dum Biryani"]
            },
            {
                "city": city_instances["Hyderabad"],
                "name": "Nimrah Cafe and Bakery",
                "area": "Charminar",
                "address": "Beside Mecca Masjid, Charminar Road, Hyderabad",
                "specialty": "Irani Special Chai, Fresh Warm Osmania & Tie Biscuits",
                "description": "Sitting right across from the historic Charminar, this bustling cafe has been baking hundreds of fresh Osmania biscuits hourly since 1993.",
                "category": "cafe",
                "diet_type": "pure_veg",
                "price_range": "₹80 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
                "latitude": 17.3616,
                "longitude": 78.4747,
                "opening_hours": "4:00 AM - 11:30 PM",
                "is_hidden_gem": True,
                "why_special": "Unrivaled view of Charminar with the best freshly baked Osmania biscuits in the city.",
                "food_names": ["Irani Chai & Osmania Biscuits"]
            }
        ]

        for p_data in hyd_places:
            food_names = p_data.pop("food_names", [])
            place, _ = FoodPlace.objects.update_or_create(city=p_data["city"], name=p_data["name"], defaults=p_data)
            for fname in food_names:
                if fname in food_map:
                    FoodPlaceItem.objects.get_or_create(place=place, food=food_map[fname])

        # --- CHENNAI & KOLKATA FOODS & PLACES ---
        chn_foods = [
            {
                "city": city_instances["Chennai"],
                "name": "Ghee Podi Idli & Medu Vada",
                "category": "breakfast",
                "diet_type": "veg",
                "description": "Mini coin idlis tossed in spicy gunpowder (milagai podi) and drenched in pure melted ghee, paired with crunchy lentil vadas.",
                "why_famous": "The staple breakfast delight with explosive spice and ghee harmony.",
                "price_range": "₹60 - ₹120",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
            }
        ]
        for f in chn_foods:
            f_inst, _ = Food.objects.update_or_create(city=f["city"], name=f["name"], defaults=f)
            food_map[f["name"]] = f_inst

        chn_places = [
            {
                "city": city_instances["Chennai"],
                "name": "Murugan Idli Shop",
                "area": "T. Nagar",
                "address": "149/1, GN Chetty Road, T. Nagar, Chennai",
                "specialty": "Softest Idlis with 4 varieties of chutneys & Ghee Podi Dosa",
                "description": "Celebrated across Tamil Nadu for cloud-soft idlis served with four signature chutneys on fresh banana leaves.",
                "category": "traditional_eatery",
                "diet_type": "pure_veg",
                "price_range": "₹200 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
                "latitude": 13.0418,
                "longitude": 80.2337,
                "opening_hours": "7:00 AM - 11:00 PM",
                "is_hidden_gem": False,
                "why_special": "The standard bearer of Tamil tiffin culture.",
                "food_names": ["Ghee Podi Idli & Medu Vada"]
            }
        ]
        for p_data in chn_places:
            food_names = p_data.pop("food_names", [])
            place, _ = FoodPlace.objects.update_or_create(city=p_data["city"], name=p_data["name"], defaults=p_data)
            for fname in food_names:
                if fname in food_map:
                    FoodPlaceItem.objects.get_or_create(place=place, food=food_map[fname])

        kol_foods = [
            {
                "city": city_instances["Kolkata"],
                "name": "Kolkata Egg Chicken Kathi Roll",
                "category": "street_food",
                "diet_type": "non_veg",
                "description": "Flaky layered paratha lined with egg, stuffed with succulent marinated chicken chunks, sliced onions, green chillies, and secret spice mix.",
                "why_famous": "Invented at Nizam's in Kolkata in the 1930s, the mother of all rolls.",
                "price_range": "₹60 - ₹140",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
            },
            {
                "city": city_instances["Kolkata"],
                "name": "Authentic Mishti Doi & Roshogolla",
                "category": "dessert",
                "diet_type": "veg",
                "description": "Caramelized baked sweet yogurt served in earthen clay handis alongside spongy cottage cheese balls soaked in light sugar syrup.",
                "why_famous": "Bengal's world-renowned confectionery marvel.",
                "price_range": "₹50 - ₹120",
                "is_must_try": True,
                "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"
            }
        ]
        for f in kol_foods:
            f_inst, _ = Food.objects.update_or_create(city=f["city"], name=f["name"], defaults=f)
            food_map[f["name"]] = f_inst

        kol_places = [
            {
                "city": city_instances["Kolkata"],
                "name": "Nizam's Restaurant",
                "area": "New Market",
                "address": "21, Hogg Street, New Market, Kolkata",
                "specialty": "Original Kathi Roll, Mutton Biryani & Chaap",
                "description": "The legendary heritage birthplace of the Kathi Roll. Operating since 1932, Nizam's wrapped kebabs in parathas for British babus on the go.",
                "category": "heritage_spot",
                "diet_type": "non_veg_served",
                "price_range": "₹280 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
                "latitude": 22.5600,
                "longitude": 88.3522,
                "opening_hours": "11:30 AM - 10:30 PM",
                "is_hidden_gem": False,
                "why_special": "The historic birthplace of the world-famous Kathi roll.",
                "food_names": ["Kolkata Egg Chicken Kathi Roll"]
            },
            {
                "city": city_instances["Kolkata"],
                "name": "K.C. Das Sweets",
                "area": "Esplanade",
                "address": "11A, Esplanade East, Chowringhee, Kolkata",
                "specialty": "Spongy Rossogolla, Rossomalai & Baked Mihidana",
                "description": "Founded by Nobin Chandra Das's family, the inventors of the sponge Rossogolla. An unmissable landmark for sweet lovers.",
                "category": "sweet_shop",
                "diet_type": "pure_veg",
                "price_range": "₹150 for two",
                "price_tier": "budget",
                "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
                "latitude": 22.5675,
                "longitude": 88.3510,
                "opening_hours": "8:00 AM - 9:00 PM",
                "is_hidden_gem": True,
                "why_special": "Historic sweet house dating back to 1866.",
                "food_names": ["Authentic Mishti Doi & Roshogolla"]
            }
        ]
        for p_data in kol_places:
            food_names = p_data.pop("food_names", [])
            place, _ = FoodPlace.objects.update_or_create(city=p_data["city"], name=p_data["name"], defaults=p_data)
            for fname in food_names:
                if fname in food_map:
                    FoodPlaceItem.objects.get_or_create(place=place, food=food_map[fname])

        # --- SEED REVIEWS ---
        sample_reviews = [
            {
                "user": demo_user,
                "place_name": "Kata Kirr",
                "rating": 5,
                "comment": "Hands down the best misal in Pune! Order the Tikh (Spicy) Kat if you love real spice with a cold glass of taak (buttermilk). Unbelievable flavor!",
                "must_try_dish": "Tikh Usal Misal"
            },
            {
                "user": priya_user,
                "place_name": "Kata Kirr",
                "rating": 5,
                "comment": "Whenever I visit Pune, Kata Kirr is my first stop. The farsan quality is always top-notch and crunch remains intact.",
                "must_try_dish": "Medium Kat Misal Pav"
            },
            {
                "user": demo_user,
                "place_name": "Sujata Mastani",
                "rating": 5,
                "comment": "The Mango Mastani with natural Alphonso pulp and thick ice cream scoop is heaven. Nothing in other cities comes close.",
                "must_try_dish": "Special Mango Mastani"
            },
            {
                "user": priya_user,
                "place_name": "JJ Garden Vada Pav Stall",
                "rating": 5,
                "comment": "Hot, jumbo size, and full of garlic thecha flavor. A true local street legend in Camp!",
                "must_try_dish": "Jumbo Vada Pav"
            },
            {
                "user": demo_user,
                "place_name": "Ashok Vada Pav (Kirti College)",
                "rating": 5,
                "comment": "The crispy chura they put inside is a game changer! Best vada pav in Dadar.",
                "must_try_dish": "Chura Vada Pav"
            },
            {
                "user": priya_user,
                "place_name": "Kyani & Co.",
                "rating": 5,
                "comment": "Stepping into Kyani feels like a movie. Dipping warm bun maska in sweet Irani chai while listening to old ceiling fans. Pure nostalgic bliss!",
                "must_try_dish": "Bun Maska with Mawa Cake"
            },
            {
                "user": demo_user,
                "place_name": "Sita Ram Diwan Chand",
                "rating": 5,
                "comment": "The paneer inside the bhature is so tender. The chole are intensely spiced with black masala. Unmatched in Delhi!",
                "must_try_dish": "Paneer Chole Bhature"
            },
            {
                "user": priya_user,
                "place_name": "Hotel Shadab",
                "rating": 5,
                "comment": "The mutton literally falls off the bone. Aromatic basmati with true saffron undertones. Don't leave Hyderabad without eating here!",
                "must_try_dish": "Special Mutton Dum Biryani"
            }
        ]

        for rev in sample_reviews:
            try:
                place = FoodPlace.objects.get(name=rev["place_name"])
                Review.objects.get_or_create(
                    user=rev["user"],
                    food_place=place,
                    defaults={
                        "rating": rev["rating"],
                        "comment": rev["comment"],
                        "must_try_dish": rev["must_try_dish"]
                    }
                )
            except FoodPlace.DoesNotExist:
                pass

        # --- SEED FAVORITES ---
        try:
            pune_kata = FoodPlace.objects.get(name="Kata Kirr")
            mumbai_ashok = FoodPlace.objects.get(name="Ashok Vada Pav (Kirti College)")
            Favorite.objects.get_or_create(user=demo_user, food_place=pune_kata)
            Favorite.objects.get_or_create(user=demo_user, food_place=mumbai_ashok)
        except Exception:
            pass

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded Khankhoj database!'))
        self.stdout.write(self.style.SUCCESS(f'Created {City.objects.count()} Cities, {Food.objects.count()} Foods, {FoodPlace.objects.count()} Food Places, {Review.objects.count()} Reviews.'))

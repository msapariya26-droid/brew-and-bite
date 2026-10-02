const menuData = [
  {
    "id": "burger-truffle",
    "category": "burgers",
    "name": "Truffle Double Smash Burger",
    "description": "Double-smashed patties, black truffle aioli, gruyère, caramelised onions, toasted brioche bun.",
    "price": 420,
    "tag": "House Special",
    "note": "Limited Time",
    "special": true,
    "image": "/images/menu/burger-truffle.jpg"
  },
  {
    "id": "burger-classic",
    "category": "burgers",
    "name": "Classic Cheeseburger",
    "description": "Smash patty, aged cheddar, house pickles, mustard mayo, toasted brioche.",
    "price": 280,
    "tag": "Bestseller",
    "note": "Signature Smash",
    "special": false,
    "image": "/images/menu/burger-classic.jpg"
  },
  {
    "id": "burger-mushroom",
    "category": "burgers",
    "name": "Wild Mushroom & Swiss",
    "description": "Sautéed wild mushrooms, Swiss cheese, rocket, garlic butter bun.",
    "price": 320,
    "tag": "",
    "note": "Chef's Pick",
    "special": false,
    "image": "/images/menu/burger-mushroom.jpg"
  },
  {
    "id": "burger-chicken",
    "category": "burgers",
    "name": "Crispy Fried Chicken",
    "description": "Buttermilk-brined thigh, house slaw, pickled jalapeño, chipotle mayo, potato roll.",
    "price": 300,
    "tag": "",
    "note": "Spicy Option",
    "special": false,
    "image": "/images/menu/burger-chicken.jpg"
  },
  {
    "id": "burger-veggie",
    "category": "burgers",
    "name": "Garden Smash Burger",
    "description": "Black bean & roasted corn patty, avocado crema, tomato, lettuce, house aioli.",
    "price": 260,
    "tag": "Vegetarian",
    "note": "",
    "special": false,
    "image": "/images/menu/burger-garden.jpg"
  },
  {
    "id": "pizza-burrata",
    "category": "pizzas",
    "name": "Burrata & Prosciutto Rustica",
    "description": "Hand-stretched sourdough, torn burrata, prosciutto, rocket, aged balsamic.",
    "price": 480,
    "tag": "House Special",
    "note": "Limited Time",
    "special": true,
    "image": "/images/menu/pizza-burrata.jpg"
  },
  {
    "id": "pizza-margherita",
    "category": "pizzas",
    "name": "Wood-Fired Margherita",
    "description": "San Marzano tomato, house-pulled fior di latte, fresh basil, extra-virgin olive oil.",
    "price": 350,
    "tag": "Classic",
    "note": "Vegetarian",
    "special": false,
    "image": "/images/menu/pizza-margherita.jpg"
  },
  {
    "id": "pizza-lamb",
    "category": "pizzas",
    "name": "Slow-Roasted Lamb",
    "description": "Sourdough base, slow-roasted lamb shoulder, harissa, labneh, mint, toasted pine nuts.",
    "price": 450,
    "tag": "",
    "note": "Chef's Pick",
    "special": false,
    "image": "/images/menu/pizza-lamb.jpg"
  },
  {
    "id": "pizza-truffle-mushroom",
    "category": "pizzas",
    "name": "Truffle Mushroom Bianca",
    "description": "Cream base, wild mushroom medley, truffle oil, pecorino, thyme, no tomato.",
    "price": 400,
    "tag": "Vegetarian",
    "note": "",
    "special": false,
    "image": "/images/menu/pizza-truffle.jpg"
  },
  {
    "id": "coffee-single-origin",
    "category": "coffee",
    "name": "Single-Origin Pour Over",
    "description": "Rotating seasonal bean, hand-poured through Hario V60, clean and nuanced.",
    "price": 220,
    "tag": "Signature",
    "note": "Single Origin",
    "special": false,
    "image": "/images/menu/coffee-pour-over.jpg"
  },
  {
    "id": "coffee-flat-white",
    "category": "coffee",
    "name": "Artisan Flat White",
    "description": "Double ristretto, silky micro-foam, served in a 150 ml ceramic cup.",
    "price": 200,
    "tag": "Bestseller",
    "note": "",
    "special": false,
    "image": "/images/menu/coffee-flat-white.jpg"
  },
  {
    "id": "coffee-cold-brew",
    "category": "coffee",
    "name": "72-Hour Cold Brew",
    "description": "Slow-steeped for 72 hours, bold and smooth, served over hand-cut ice.",
    "price": 250,
    "tag": "Cold",
    "note": "72h Brew",
    "special": false,
    "image": "/images/menu/coffee-cold-brew.jpg"
  },
  {
    "id": "coffee-oat-latte",
    "category": "coffee",
    "name": "Honey Oat Latte",
    "description": "House espresso blend, oat milk, locally sourced wildflower honey, sprinkle of cinnamon.",
    "price": 230,
    "tag": "",
    "note": "Dairy-Free",
    "special": false,
    "image": "/images/menu/coffee-oat-latte.jpg"
  },
  {
    "id": "dessert-tiramisu",
    "category": "desserts",
    "name": "Espresso Tiramisu Affogato",
    "description": "House-made tiramisu, double espresso poured tableside, dusted cocoa.",
    "price": 320,
    "tag": "House Special",
    "note": "Limited Time",
    "special": true,
    "image": "/images/menu/dessert-tiramisu.jpg"
  },
  {
    "id": "dessert-croissant",
    "category": "desserts",
    "name": "Kouign-Amann Croissant",
    "description": "Laminated dough, caramelised sugar crust, served warm with clotted cream.",
    "price": 280,
    "tag": "Baked Fresh",
    "note": "",
    "special": false,
    "image": "/images/menu/dessert-croissant.jpg"
  },
  {
    "id": "dessert-tart",
    "category": "desserts",
    "name": "Burnt Basque Cheesecake",
    "description": "Baked dark with a molten centre, vanilla bean custard, seasonal berry compote.",
    "price": 350,
    "tag": "Signature",
    "note": "Gluten-Free Option",
    "special": false,
    "image": "/images/menu/dessert-cheesecake.jpg"
  },
  {
    "id": "dessert-brownie",
    "category": "desserts",
    "name": "Salted Caramel Brownie",
    "description": "Dense dark-chocolate brownie, house salted caramel drizzle, vanilla bean ice cream.",
    "price": 300,
    "tag": "",
    "note": "",
    "special": false,
    "image": "/images/menu/dessert-brownie.jpg"
  }
];

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', ['GET', 'HEAD']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  return res.status(200).json({
    ok: true,
    items: menuData
  });
}

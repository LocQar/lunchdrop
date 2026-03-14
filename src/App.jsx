import { useState, useEffect, useCallback, useRef, useMemo, createContext, useContext } from "react";

const FONTS = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap";

// ═══════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════
const AppCtx = createContext();

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const BUILDINGS = [
  { id:"b1", name:"One Market Plaza", address:"1 Market St", zone:"zone-a", workers:2800 },
  { id:"b2", name:"Salesforce Tower", address:"415 Mission St", zone:"zone-a", workers:3200 },
  { id:"b3", name:"555 California St", address:"555 California St", zone:"zone-a", workers:2100 },
  { id:"b4", name:"Embarcadero Center 4", address:"275 Battery St", zone:"zone-a", workers:1800 },
  { id:"b5", name:"101 Montgomery", address:"101 Montgomery St", zone:"zone-a", workers:1200 },
];

const RESTAURANTS = [
  { id:"r1", name:"The Green Table", cuisine:"Farm-to-Table", rating:4.8, time:"25–35", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", tags:["Organic","Seasonal"], featured:true, orders:847, maxDaily:60, hours:{mon:"10:00-20:00",tue:"10:00-20:00",wed:"10:00-20:00",thu:"10:00-20:00",fri:"10:00-21:00",sat:"11:00-21:00",sun:"Closed"} },
  { id:"r2", name:"Ember & Crust", cuisine:"Wood-Fired Pizza", rating:4.6, time:"30–40", img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", tags:["Popular","Italian"], featured:true, orders:1243, maxDaily:80, hours:{mon:"11:00-22:00",tue:"11:00-22:00",wed:"11:00-22:00",thu:"11:00-22:00",fri:"11:00-23:00",sat:"11:00-23:00",sun:"11:00-21:00"} },
  { id:"r3", name:"Bowl & Grain", cuisine:"Healthy Bowls", rating:4.9, time:"20–25", img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80", tags:["Healthy","Vegan Options"], featured:true, orders:965, maxDaily:70, hours:{mon:"9:00-19:00",tue:"9:00-19:00",wed:"9:00-19:00",thu:"9:00-19:00",fri:"9:00-19:00",sat:"10:00-18:00",sun:"10:00-17:00"} },
  { id:"r4", name:"Masa Verde", cuisine:"Mexican", rating:4.5, time:"25–30", img:"https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=600&q=80", tags:["Mexican","GF Options"], featured:false, orders:612, maxDaily:50, hours:{mon:"11:00-21:00",tue:"11:00-21:00",wed:"11:00-21:00",thu:"11:00-21:00",fri:"11:00-22:00",sat:"11:00-22:00",sun:"11:00-20:00"} },
  { id:"r5", name:"Koko's Kitchen", cuisine:"Asian Fusion", rating:4.7, time:"20–30", img:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", tags:["Asian","Spicy"], featured:true, orders:789, maxDaily:65, hours:{mon:"11:30-21:30",tue:"11:30-21:30",wed:"11:30-21:30",thu:"11:30-21:30",fri:"11:30-22:00",sat:"11:30-22:00",sun:"12:00-21:00"} },
  { id:"r6", name:"Honey & Rye", cuisine:"Bakery & Brunch", rating:4.8, time:"20–25", img:"https://images.unsplash.com/photo-1509365465994-3e8f813e31ea?w=600&q=80", tags:["Bakery","Comfort"], featured:false, orders:534, maxDaily:40, hours:{mon:"7:00-17:00",tue:"7:00-17:00",wed:"7:00-17:00",thu:"7:00-17:00",fri:"7:00-18:00",sat:"8:00-18:00",sun:"8:00-16:00"} },
  { id:"r7", name:"Roots & Stems", cuisine:"Vegan & Raw", rating:4.4, time:"15–20", img:"https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&q=80", tags:["Vegan","Raw","GF"], featured:false, orders:328, maxDaily:35, hours:{mon:"10:00-18:00",tue:"10:00-18:00",wed:"10:00-18:00",thu:"10:00-18:00",fri:"10:00-18:00",sat:"10:00-17:00",sun:"Closed"} },
  { id:"r8", name:"Levant Grill", cuisine:"Mediterranean", rating:4.6, time:"25–35", img:"https://images.unsplash.com/photo-1529144415895-6aaf8be872fb?w=600&q=80", tags:["Mediterranean","Halal"], featured:false, orders:456, maxDaily:55, hours:{mon:"11:00-21:00",tue:"11:00-21:00",wed:"11:00-21:00",thu:"11:00-21:00",fri:"11:00-22:00",sat:"11:00-22:00",sun:"12:00-20:00"} },
];

const REVIEWS = {
  r1:[
    {id:"rv1",user:"Sarah Chen",rating:5,date:"2024-01-15",comment:"Absolutely amazing! The Harvest Buddha Bowl is my go-to lunch. Fresh ingredients and perfectly balanced flavors.",helpful:12},
    {id:"rv2",user:"Mike Johnson",rating:4,date:"2024-01-10",comment:"Great food, but sometimes the delivery is a bit slow. Overall very satisfied with the quality.",helpful:8},
    {id:"rv3",user:"Emily Wong",rating:5,date:"2024-01-05",comment:"The best farm-to-table experience in SF! Everything is so fresh and delicious.",helpful:15}
  ],
  r2:[
    {id:"rv4",user:"David Lee",rating:5,date:"2024-01-12",comment:"Best pizza in the Financial District hands down. The truffle mushroom is incredible!",helpful:20},
    {id:"rv5",user:"Jessica Park",rating:4,date:"2024-01-08",comment:"Really good pizza, crispy crust and quality toppings. Just wish portions were bigger.",helpful:6}
  ],
  r3:[
    {id:"rv6",user:"Alex Kim",rating:5,date:"2024-01-14",comment:"Perfect for healthy eating without sacrificing taste. Their bowls are so satisfying!",helpful:9}
  ]
};

const PROMO_CODES = {
  "LUNCH10": { discount: 0.10, type: "percent", description: "10% off your order" },
  "FREESHIP": { discount: 2.50, type: "fixed", description: "Free delivery" },
  "WELCOME20": { discount: 0.20, type: "percent", description: "20% off first order" },
  "SAVE5": { discount: 5.00, type: "fixed", description: "$5 off" }
};

const MENU = {
  r1: [
    { cat:"Bowls", items:[
      { id:"m1", name:"Harvest Buddha Bowl", desc:"Quinoa, roasted sweet potato, kale, tahini drizzle, pickled red onion", price:16.50, cal:520, flags:["V","GF"], pop:true, cust:[
        { g:"Protein Add-on", req:false, opts:[{n:"Grilled Chicken",p:3.50},{n:"Seared Tofu",p:2.50},{n:"Poached Egg",p:2.00}] },
        { g:"Extra Toppings", req:false, opts:[{n:"Avocado",p:2.00},{n:"Hemp Seeds",p:1.00},{n:"Extra Tahini",p:0.50}] }
      ]},
      { id:"m2", name:"Miso Grain Bowl", desc:"Brown rice, edamame, avocado, pickled ginger, white miso glaze", price:15.00, cal:480, flags:["V","GF"], pop:false, cust:[
        { g:"Protein", req:false, opts:[{n:"Salmon",p:4.50},{n:"Tofu",p:2.50}] }
      ]},
    ]},
    { cat:"Salads", items:[
      { id:"m3", name:"Grilled Halloumi Salad", desc:"Mixed greens, pomegranate, candied walnuts, honey-lemon vinaigrette", price:14.50, cal:380, flags:["GF"], pop:true, cust:[
        { g:"Dressing", req:true, opts:[{n:"Honey-Lemon",p:0},{n:"Balsamic",p:0},{n:"Ranch",p:0}] }
      ]},
      { id:"m4", name:"Kale Caesar", desc:"Tuscan kale, sourdough croutons, shaved parmesan, anchovy-free dressing", price:13.00, cal:340, flags:[], pop:false, cust:[] },
    ]},
    { cat:"Mains", items:[
      { id:"m5", name:"Herb-Roasted Chicken", desc:"Free-range half chicken, roasted root vegetables, chimichurri", price:19.50, cal:720, flags:["GF"], pop:true, cust:[] },
    ]},
    { cat:"Drinks", items:[
      { id:"m6", name:"Golden Turmeric Latte", desc:"Oat milk, turmeric, cinnamon, honey, black pepper", price:5.50, cal:120, flags:["V","GF"], pop:false, cust:[
        { g:"Milk", req:true, opts:[{n:"Oat",p:0},{n:"Almond",p:0},{n:"Coconut",p:0.50}] }
      ]},
      { id:"m7", name:"Cold Brew Tonic", desc:"House cold brew, elderflower tonic, orange peel", price:6.50, cal:80, flags:["V","GF"], pop:true, cust:[] },
    ]},
  ],
  r2: [
    { cat:"Wood-Fired Pizzas", items:[
      { id:"m10", name:"Truffle Mushroom", desc:"Wild mushrooms, truffle oil, mozzarella, fresh thyme, sourdough crust", price:18.00, cal:780, flags:[], pop:true, cust:[
        { g:"Size", req:true, opts:[{n:"Personal 10\"",p:0},{n:"Sharing 14\"",p:6.00}] },
        { g:"Add Toppings", req:false, opts:[{n:"Burrata",p:3.00},{n:"Prosciutto",p:3.50},{n:"Arugula",p:1.50}] }
      ]},
      { id:"m11", name:"Margherita Classica", desc:"San Marzano tomatoes, buffalo mozzarella, fresh basil, olive oil", price:15.50, cal:680, flags:[], pop:true, cust:[
        { g:"Size", req:true, opts:[{n:"Personal 10\"",p:0},{n:"Sharing 14\"",p:6.00}] }
      ]},
      { id:"m12", name:"Spicy Soppressata", desc:"Calabrian chili, soppressata, smoked mozzarella, hot honey", price:17.50, cal:820, flags:[], pop:false, cust:[
        { g:"Spice Level", req:true, opts:[{n:"Medium",p:0},{n:"Extra Hot",p:0}] }
      ]},
    ]},
    { cat:"Sides", items:[
      { id:"m13", name:"Arugula & Shaved Parm", desc:"Lemon, olive oil, cracked pepper", price:8.50, cal:180, flags:["GF"], pop:false, cust:[] },
    ]},
    { cat:"Drinks", items:[
      { id:"m14", name:"San Pellegrino", desc:"Sparkling mineral water, 500ml", price:3.50, cal:0, flags:["V","GF"], pop:false, cust:[] },
    ]},
  ],
  r3: [
    { cat:"Signature Bowls", items:[
      { id:"m20", name:"Teriyaki Chicken Bowl", desc:"Jasmine rice, teriyaki chicken, edamame, pickled carrot, sesame", price:16.00, cal:610, flags:["GF"], pop:true, cust:[
        { g:"Base", req:true, opts:[{n:"Jasmine Rice",p:0},{n:"Brown Rice",p:0},{n:"Mixed Greens",p:0}] },
        { g:"Protein Swap", req:false, opts:[{n:"Grilled Salmon",p:3.00},{n:"Crispy Tofu",p:0}] }
      ]},
      { id:"m21", name:"Mediterranean Falafel Bowl", desc:"Falafel, hummus, tabbouleh, pickled turnip, tahini", price:15.00, cal:550, flags:["V"], pop:true, cust:[] },
      { id:"m22", name:"Poke Bowl", desc:"Ahi tuna, sushi rice, mango, avocado, sriracha mayo, nori", price:18.50, cal:520, flags:["GF"], pop:true, cust:[
        { g:"Spice", req:true, opts:[{n:"Mild",p:0},{n:"Medium",p:0},{n:"Spicy",p:0}] }
      ]},
    ]},
    { cat:"Smoothies", items:[
      { id:"m23", name:"Green Machine", desc:"Spinach, banana, mango, almond milk, chia seeds", price:7.50, cal:240, flags:["V","GF"], pop:false, cust:[] },
    ]},
  ],
};

// Fill missing restaurants
RESTAURANTS.forEach(r => {
  if (!MENU[r.id]) MENU[r.id] = [{ cat:"Today's Specials", items:[
    { id:`${r.id}-1`, name:`${r.cuisine} Bowl`, desc:`Chef's daily ${r.cuisine.toLowerCase()} bowl with seasonal ingredients`, price:16.00, cal:520, flags:["GF"], pop:true, cust:[] },
    { id:`${r.id}-2`, name:`${r.cuisine} Plate`, desc:`Traditional ${r.cuisine.toLowerCase()} plate with house sides`, price:18.50, cal:680, flags:[], pop:false, cust:[] },
    { id:`${r.id}-3`, name:`House Salad`, desc:`Fresh seasonal greens with house dressing`, price:12.00, cal:280, flags:["V","GF"], pop:false, cust:[] },
  ]}];
});

const SUBS = [
  { id:"free", name:"Free", price:0, perks:["Standard ordering","$2.50 delivery fee","All restaurants"] },
  { id:"lunch-pass", name:"Lunch Pass", price:9.99, rec:true, perks:["Free delivery on all orders","Priority delivery scheduling","10:00 AM cutoff reminders","Pays for itself at 4+ orders/month"] },
  { id:"premium", name:"Premium", price:19.99, perks:["Everything in Lunch Pass","Extended cutoff (+30 min)","Exclusive off-menu items","Weekly surprise meal credit"] },
];

const PLANS = [
  {
    name:"Free",
    price:"$0",
    freq:"/month",
    desc:"Perfect for trying out LunchDrop with occasional orders",
    features:[
      "Standard ordering access",
      "$2.50 per order delivery fee",
      "All restaurants available",
      "Order history tracking",
      "Basic customer support"
    ],
    pop:false,
    badge:null
  },
  {
    name:"Lunch Pass",
    price:"$9.99",
    freq:"/month",
    desc:"Best for regular lunch orderers (2-3 times per week)",
    features:[
      "FREE delivery on all orders (save $10-20/month)",
      "Priority delivery scheduling",
      "Flexibility to order in either delivery window",
      "Exclusive restaurant deals & promos",
      "Early access to new restaurants",
      "Priority customer support"
    ],
    pop:true,
    badge:"Most Popular",
    savings:"Save $2.50 per order"
  },
  {
    name:"Team Plan",
    price:"$7.99",
    freq:"/person/month",
    desc:"For teams of 5+ employees from the same company",
    features:[
      "Everything in Lunch Pass",
      "Discounted team pricing",
      "Shared team analytics dashboard",
      "Bulk ordering capabilities",
      "Dedicated account manager",
      "Custom billing options"
    ],
    pop:false,
    badge:"Best Value",
    savings:"Save 20% vs individual plans",
    minUsers:5
  },
];

// Company codes for free delivery
const COMPANY_CODES = {
  "SFDC2024": { name: "Salesforce", logo: "☁️", benefits: "Free delivery + 10% off", building: "b2" },
  "GOOGLE24": { name: "Google", logo: "🔍", benefits: "Free delivery", building: "b3" },
  "META2024": { name: "Meta", logo: "👥", benefits: "Free delivery", building: "b1" },
  "APPLE24": { name: "Apple", logo: "🍎", benefits: "Free delivery + Priority", building: "b3" },
  "STRIPE24": { name: "Stripe", logo: "💳", benefits: "Free delivery", building: "b1" },
  "UBER2024": { name: "Uber", logo: "🚗", benefits: "Free delivery + 5% off", building: "b4" },
  "AIRBNB24": { name: "Airbnb", logo: "🏠", benefits: "Free delivery", building: "b2" },
  "NETFLIX24": { name: "Netflix", logo: "🎬", benefits: "Free delivery", building: "b5" },
};

const STATUS_STEPS = [
  { key:"placed", label:"Placed", icon:"✓" },
  { key:"batched", label:"Batched", icon:"📋" },
  { key:"preparing", label:"Preparing", icon:"👨‍🍳" },
  { key:"in_transit", label:"On the way", icon:"🚴" },
  { key:"delivered", label:"Delivered", icon:"✓" },
  { key:"picked_up", label:"Done", icon:"✨" },
];

// ═══════════════════════════════════════════════════════════════════
// ADMIN DATA
// ═══════════════════════════════════════════════════════════════════

const ADMIN_CREDENTIALS = {
  email: "admin@lunchdrop.com",
  password: "admin123",
  name: "Admin User",
  role: "admin"
};

const DELIVERY_TEAM = [
  {id:"d1",name:"John Rider",zone:"zone-a",activeOrders:3,status:"active",phone:"+1-555-0101",joinedDate:"2024-01-10"},
  {id:"d2",name:"Sarah Courier",zone:"zone-a",activeOrders:5,status:"active",phone:"+1-555-0102",joinedDate:"2024-01-15"},
  {id:"d3",name:"Mike Express",zone:"zone-a",activeOrders:2,status:"active",phone:"+1-555-0103",joinedDate:"2024-02-01"},
  {id:"d4",name:"Lisa Swift",zone:"zone-a",activeOrders:4,status:"active",phone:"+1-555-0104",joinedDate:"2024-02-05"},
];

const PENDING_RESTAURANTS = [
  {
    id:"r9",
    name:"Pho Corner",
    cuisine:"Vietnamese",
    rating:0,
    time:"20–30",
    img:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    tags:["Vietnamese","Noodles"],
    featured:false,
    status:"pending",
    onboardingStage:"documents_review",
    onboardingProgress:40,
    appliedDate:"2024-03-10",
    contactEmail:"owner@phocorner.com",
    contactPhone:"+1-555-8888",
    contactPerson:"David Nguyen",
    maxDaily:50,
    hours:{mon:"11:00-21:00",tue:"11:00-21:00",wed:"11:00-21:00",thu:"11:00-21:00",fri:"11:00-21:00",sat:"11:00-21:00",sun:"11:00-20:00"},
    documents:{businessLicense:true,foodSafety:true,insurance:false,menu:true},
    notes:"Great reviews online, popular Vietnamese spot in SOMA"
  },
  {
    id:"r10",
    name:"Sushi Station",
    cuisine:"Japanese",
    rating:0,
    time:"25–35",
    img:"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80",
    tags:["Japanese","Sushi"],
    featured:false,
    status:"pending",
    onboardingStage:"application_submitted",
    onboardingProgress:20,
    appliedDate:"2024-03-12",
    contactEmail:"chef@sushistation.com",
    contactPhone:"+1-555-9999",
    contactPerson:"Ken Tanaka",
    maxDaily:40,
    hours:{mon:"11:30-22:00",tue:"11:30-22:00",wed:"11:30-22:00",thu:"11:30-22:00",fri:"11:30-23:00",sat:"11:30-23:00",sun:"12:00-21:00"},
    documents:{businessLicense:true,foodSafety:false,insurance:false,menu:false},
    notes:"Specialized in fresh sushi, family-owned for 15 years"
  },
  {
    id:"r11",
    name:"Green Bowl Kitchen",
    cuisine:"Healthy",
    rating:0,
    time:"15–25",
    img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    tags:["Healthy","Bowls","Vegan"],
    featured:false,
    status:"pending",
    onboardingStage:"training_scheduled",
    onboardingProgress:80,
    appliedDate:"2024-03-05",
    contactEmail:"team@greenbowl.com",
    contactPhone:"+1-555-7777",
    contactPerson:"Emma Garcia",
    maxDaily:60,
    hours:{mon:"10:00-20:00",tue:"10:00-20:00",wed:"10:00-20:00",thu:"10:00-20:00",fri:"10:00-20:00",sat:"11:00-19:00",sun:"Closed"},
    documents:{businessLicense:true,foodSafety:true,insurance:true,menu:true},
    notes:"Focus on organic, plant-based meals. Ready for launch.",
    trainingDate:"2024-03-18"
  }
];

const ALL_ORDERS = [
  {id:"LCH-1001",restaurantId:"r1",restaurantName:"The Green Table",customerId:"u1",customerName:"Sarah Chen",items:[{name:"Harvest Buddha Bowl",qty:1,price:16.50}],total:23.00,status:"delivered",time:"10:45 AM",date:"2024-03-14",building:"One Market Plaza",address:"1 Market St, 5th Floor",deliveryAssignment:"d1"},
  {id:"LCH-1002",restaurantId:"r2",restaurantName:"Ember & Crust",customerId:"u2",customerName:"Mike Johnson",items:[{name:"Truffle Mushroom Pizza",qty:1,price:18.00}],total:25.50,status:"delivered",time:"11:00 AM",date:"2024-03-14",building:"Salesforce Tower",address:"415 Mission St, 12th Floor",deliveryAssignment:"d2"},
  {id:"LCH-1003",restaurantId:"r3",restaurantName:"Bowl & Grain",customerId:"u3",customerName:"Emily Wong",items:[{name:"Miso Grain Bowl",qty:1,price:15.00}],total:20.50,status:"in_transit",time:"11:15 AM",date:"2024-03-14",building:"555 California St",address:"555 California St, 8th Floor",deliveryAssignment:"d1"},
  {id:"LCH-1004",restaurantId:"r1",restaurantName:"The Green Table",customerId:"u4",customerName:"David Lee",items:[{name:"Herb-Roasted Chicken",qty:1,price:19.50}],total:26.00,status:"preparing",time:"11:20 AM",date:"2024-03-14",building:"One Market Plaza",address:"1 Market St, 3rd Floor",deliveryAssignment:null},
  {id:"LCH-1005",restaurantId:"r5",restaurantName:"Koko's Kitchen",customerId:"u5",customerName:"Jessica Park",items:[{name:"Pad Thai",qty:1,price:14.50}],total:21.00,status:"preparing",time:"11:25 AM",date:"2024-03-14",building:"Embarcadero Center 4",address:"275 Battery St, 10th Floor",deliveryAssignment:null},
  {id:"LCH-1006",restaurantId:"r2",restaurantName:"Ember & Crust",customerId:"u6",customerName:"Alex Kim",items:[{name:"Margherita Classica",qty:2,price:15.50}],total:36.50,status:"batched",time:"11:30 AM",date:"2024-03-14",building:"101 Montgomery",address:"101 Montgomery St, 7th Floor",deliveryAssignment:null},
  {id:"LCH-1007",restaurantId:"r4",restaurantName:"Masa Verde",customerId:"u7",customerName:"Chris Martinez",items:[{name:"Burrito Bowl",qty:1,price:13.50}],total:19.00,status:"batched",time:"11:35 AM",date:"2024-03-14",building:"Salesforce Tower",address:"415 Mission St, 15th Floor",deliveryAssignment:null},
  {id:"LCH-1008",restaurantId:"r3",restaurantName:"Bowl & Grain",customerId:"u8",customerName:"Rachel Green",items:[{name:"Harvest Buddha Bowl",qty:1,price:16.50}],total:22.50,status:"placed",time:"11:40 AM",date:"2024-03-14",building:"555 California St",address:"555 California St, 6th Floor",deliveryAssignment:null},
  {id:"LCH-1009",restaurantId:"r6",restaurantName:"Honey & Rye",customerId:"u9",customerName:"Tom Anderson",items:[{name:"Croissant Sandwich",qty:1,price:12.00}],total:17.50,status:"placed",time:"11:42 AM",date:"2024-03-14",building:"One Market Plaza",address:"1 Market St, 9th Floor",deliveryAssignment:null},
  {id:"LCH-1010",restaurantId:"r7",restaurantName:"Roots & Stems",customerId:"u10",customerName:"Nina Patel",items:[{name:"Raw Energy Bowl",qty:1,price:14.00}],total:19.50,status:"placed",time:"11:45 AM",date:"2024-03-14",building:"Embarcadero Center 4",address:"275 Battery St, 4th Floor",deliveryAssignment:null}
];

const ALL_USERS = [
  {id:"u1",name:"Sarah Chen",email:"sarah@salesforce.com",role:"customer",subscription:"Lunch Pass",companyCode:"SFDC2024",building:"One Market Plaza",joinDate:"2024-01-15",totalOrders:47,totalSpent:1058.50,lastOrder:"2024-03-14"},
  {id:"u2",name:"Mike Johnson",email:"mike@google.com",role:"customer",subscription:"Free",companyCode:"GOOGLE24",building:"Salesforce Tower",joinDate:"2024-01-20",totalOrders:23,totalSpent:532.00,lastOrder:"2024-03-14"},
  {id:"u3",name:"Emily Wong",email:"emily@meta.com",role:"customer",subscription:"Lunch Pass",companyCode:"META2024",building:"555 California St",joinDate:"2024-02-01",totalOrders:35,totalSpent:789.50,lastOrder:"2024-03-14"},
  {id:"u4",name:"David Lee",email:"david@stripe.com",role:"customer",subscription:"Team Plan",companyCode:"STRIPE24",building:"One Market Plaza",joinDate:"2024-02-10",totalOrders:28,totalSpent:645.00,lastOrder:"2024-03-14"},
  {id:"u5",name:"Jessica Park",email:"jessica@uber.com",role:"customer",subscription:"Free",companyCode:"UBER2024",building:"Embarcadero Center 4",joinDate:"2024-02-15",totalOrders:12,totalSpent:278.00,lastOrder:"2024-03-14"},
  {id:"u6",name:"Alex Kim",email:"alex@example.com",role:"customer",subscription:"Lunch Pass",companyCode:"",building:"101 Montgomery",joinDate:"2024-01-25",totalOrders:41,totalSpent:932.50,lastOrder:"2024-03-14"},
  {id:"u7",name:"Chris Martinez",email:"chris@airbnb.com",role:"customer",subscription:"Free",companyCode:"AIRBNB24",building:"Salesforce Tower",joinDate:"2024-03-01",totalOrders:8,totalSpent:187.00,lastOrder:"2024-03-14"},
  {id:"u8",name:"Rachel Green",email:"rachel@example.com",role:"customer",subscription:"Lunch Pass",companyCode:"",building:"555 California St",joinDate:"2024-02-20",totalOrders:19,totalSpent:425.50,lastOrder:"2024-03-14"},
  {id:"u9",name:"Tom Anderson",email:"tom@netflix.com",role:"customer",subscription:"Free",companyCode:"NETFLIX24",building:"One Market Plaza",joinDate:"2024-03-05",totalOrders:5,totalSpent:116.00,lastOrder:"2024-03-14"},
  {id:"u10",name:"Nina Patel",email:"nina@example.com",role:"customer",subscription:"Team Plan",companyCode:"",building:"Embarcadero Center 4",joinDate:"2024-01-30",totalOrders:32,totalSpent:712.00,lastOrder:"2024-03-14"},
];

// Generate historical orders for analytics (past 30 days)
const generateHistoricalOrders=()=>{
  const orders=[];
  const statuses=["delivered","delivered","delivered","delivered","in_transit","preparing"];
  const buildings=["One Market Plaza","Salesforce Tower","555 California St","Embarcadero Center 4","101 Montgomery"];
  const restaurants=["The Green Table","Ember & Crust","Bowl & Grain","Masa Verde","Koko's Kitchen","Honey & Rye","Roots & Stems","Sushi Zen"];

  let orderId=2000;
  for(let daysAgo=30;daysAgo>=0;daysAgo--){
    const date=new Date();
    date.setDate(date.getDate()-daysAgo);
    const dateStr=date.toISOString().split("T")[0];

    // Generate 15-25 orders per day
    const orderCount=Math.floor(Math.random()*11)+15;
    for(let i=0;i<orderCount;i++){
      const restaurant=restaurants[Math.floor(Math.random()*restaurants.length)];
      const building=buildings[Math.floor(Math.random()*buildings.length)];
      const user=ALL_USERS[Math.floor(Math.random()*ALL_USERS.length)];
      const total=(Math.random()*30+10).toFixed(2);
      const hour=11+Math.floor(Math.random()*2);
      const minute=Math.floor(Math.random()*60);

      orders.push({
        id:`LCH-${orderId++}`,
        restaurantId:`r${Math.floor(Math.random()*8)+1}`,
        restaurantName:restaurant,
        customerId:user.id,
        customerName:user.name,
        items:[{name:"Menu Item",qty:1,price:parseFloat(total)-7}],
        total:parseFloat(total),
        status:daysAgo===0?statuses[Math.floor(Math.random()*statuses.length)]:"delivered",
        time:`${hour}:${minute<10?"0"+minute:minute} ${hour>=12?"PM":"AM"}`,
        date:dateStr,
        building:building,
        address:`${building}, Floor ${Math.floor(Math.random()*20)+1}`,
        deliveryAssignment:daysAgo===0&&Math.random()>0.5?`d${Math.floor(Math.random()*4)+1}`:null
      });
    }
  }
  return orders;
};

const HISTORICAL_ORDERS=[...ALL_ORDERS,...generateHistoricalOrders()];

// Platform Settings (configurable by admin)
const DEFAULT_SETTINGS={
  deliveryWindows:[
    {id:"w1",time:"12:00 PM",enabled:true,capacity:100},
    {id:"w2",time:"1:00 PM",enabled:true,capacity:100}
  ],
  fees:{
    deliveryFee:2.50,
    taxRate:0.085,
    serviceFee:0.50
  },
  zones:[
    {id:"zone-a",name:"Financial District",color:"#C45635",enabled:true},
    {id:"zone-b",name:"SOMA",color:"#5D7C4A",enabled:true},
    {id:"zone-c",name:"Downtown",color:"#2B5D7D",enabled:true}
  ],
  business:{
    cutoffTime:"10:30 AM",
    minOrderValue:10.00,
    maxOrderValue:100.00,
    supportEmail:"support@lunchdrop.com",
    supportPhone:"+1-555-LUNCH"
  }
};

// Promo Codes (editable by admin)
const EDITABLE_PROMO_CODES=[
  {id:"p1",code:"WELCOME10",type:"percent",discount:0.10,minOrder:20,maxUses:1000,used:247,active:true,description:"10% off first order",expiresAt:"2024-12-31"},
  {id:"p2",code:"FREESHIP",type:"fixed",discount:2.50,minOrder:15,maxUses:null,used:1532,active:true,description:"Free delivery",expiresAt:null},
  {id:"p3",code:"LUNCH20",type:"percent",discount:0.20,minOrder:25,maxUses:500,used:89,active:true,description:"20% off $25+",expiresAt:"2024-06-30"},
  {id:"p4",code:"SAVE5",type:"fixed",discount:5.00,minOrder:30,maxUses:200,used:156,active:false,description:"$5 off $30+",expiresAt:"2024-03-31"}
];

// Audit Logs
const AUDIT_LOGS=[];

// Notification Queue
const NOTIFICATION_QUEUE=[
  {id:"notif-1",title:"Order Delivered",message:"Your lunch from The Green Table has arrived!",type:"order",recipients:"all",sentBy:"admin@lunchdrop.com",sentAt:"2024-03-14T12:45:00",read:892,total:1245},
  {id:"notif-2",title:"New Restaurant Alert",message:"Sushi Zen is now available on LunchDrop! Order fresh sushi today.",type:"promotion",recipients:"all",sentBy:"admin@lunchdrop.com",sentAt:"2024-03-14T10:30:00",read:1102,total:1245},
  {id:"notif-3",title:"Flash Sale: 20% Off",message:"Use code FLASH20 for 20% off orders over $30. Today only!",type:"promotion",recipients:"subscribed",sentBy:"admin@lunchdrop.com",sentAt:"2024-03-14T09:00:00",read:234,total:456},
  {id:"notif-4",title:"Delivery Delay Notice",message:"Due to high volume, deliveries may be delayed by 15 minutes.",type:"alert",recipients:"active_orders",sentBy:"admin@lunchdrop.com",sentAt:"2024-03-13T12:15:00",read:67,total:89},
  {id:"notif-5",title:"System Maintenance",message:"LunchDrop will undergo maintenance tonight from 2-4 AM PST.",type:"system",recipients:"all",sentBy:"admin@lunchdrop.com",sentAt:"2024-03-13T08:00:00",read:998,total:1245}
];

// Refunds & Credits
const REFUNDS_CREDITS=[];

const isRestaurantOpen=(restaurant)=>{
  if(!restaurant?.hours)return true;
  const now=new Date();
  const days=["sun","mon","tue","wed","thu","fri","sat"];
  const today=days[now.getDay()];
  const hoursToday=restaurant.hours[today];
  if(!hoursToday||hoursToday==="Closed")return false;
  const[open,close]=hoursToday.split("-");
  const[openH,openM]=open.split(":").map(Number);
  const[closeH,closeM]=close.split(":").map(Number);
  const currentMinutes=now.getHours()*60+now.getMinutes();
  const openMinutes=openH*60+openM;
  const closeMinutes=closeH*60+closeM;
  return currentMinutes>=openMinutes&&currentMinutes<closeMinutes;
};

const getTodayHours=(restaurant)=>{
  if(!restaurant?.hours)return null;
  const days=["sun","mon","tue","wed","thu","fri","sat"];
  const today=days[new Date().getDay()];
  return restaurant.hours[today];
};

// ═══════════════════════════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════════════════════════
const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#FAFAFA;--bg2:#F1F5F9;--bg3:#E2E8F0;
  --sand:#E2E8F0;--clay:#94A3B8;--clay2:#64748B;
  --terra:#F97316;--terra2:#EA580C;--terra-g:rgba(249,115,22,.1);
  --olive:#10B981;--olive2:#059669;--olive-bg:rgba(16,185,129,.1);
  --bark:#0F172A;--bark2:#334155;--char:#020617;
  --honey:#F59E0B;--honey-bg:rgba(245,158,11,.1);--sage:#6EE7B7;
  --red:#EF4444;--red-bg:rgba(239,68,68,.1);
  --blue:#3B82F6;--blue-bg:rgba(59,130,246,.1);
  --serif:'Outfit',-apple-system,sans-serif;
  --sans:'Inter',-apple-system,sans-serif;
  --sh1:0 2px 8px rgba(0,0,0,.04);--sh2:0 8px 24px rgba(0,0,0,.08);
  --sh3:0 16px 40px rgba(0,0,0,.12);--sh4:0 24px 80px rgba(0,0,0,.16);
  --r:16px;--rs:10px;
}
*, *::before, *::after {
  animation: none !important;
  transition: transform 0s, opacity 0s, background 0.1s, color 0.1s, box-shadow 0.1s !important;
}
body{background:var(--bg);font-family:var(--sans);color:var(--bark);-webkit-font-smoothing:antialiased;overflow-x:hidden}

.up, .fi, .si, .slideIn { opacity: 1; transform: none; }
.grain{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.ambient-glow{position:fixed;top:0;left:50%;transform:translateX(-50%);width:1000px;height:500px;background:radial-gradient(ellipse at top, rgba(249,115,22,.04), transparent 60%);pointer-events:none;z-index:0}

::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--clay);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--clay2)}
input,textarea,select{font-family:var(--sans)}
.hov:hover{box-shadow:var(--sh3), 0 0 0 1px rgba(0,0,0,.02)!important}
.glass{background:rgba(255,255,255,.6);backdrop-filter:blur(24px) saturate(1.8);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.4)}
.glass-card{background:linear-gradient(145deg, rgba(255,255,255,.9) 0%, rgba(255,255,255,.6) 100%);background-color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.6);backdrop-filter:blur(12px);box-shadow:var(--sh1)}
`;

// ═══════════════════════════════════════════════════════════════════
// ATOMS
// ═══════════════════════════════════════════════════════════════════
const Badge = ({children,v="def",s})=>{
  const m={def:["var(--sand)","var(--bark2)"],green:["var(--olive-bg)","var(--olive)"],org:["var(--terra-g)","var(--terra)"],honey:["var(--honey-bg)","var(--honey)"],red:["var(--red-bg)","var(--red)"]};
  const c=m[v]||m.def;
  return <span style={{background:c[0],color:c[1],padding:"3px 9px",borderRadius:100,fontSize:10,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",whiteSpace:"nowrap",...s}}>{children}</span>;
};

const Flag = ({f})=>{
  const c={V:{bg:"var(--olive-bg)",c:"var(--olive)",l:"Vegan"},GF:{bg:"var(--honey-bg)",c:"var(--honey)",l:"GF"},Halal:{bg:"#EDE8F5",c:"#6B5BA7",l:"Halal"}};
  const x=c[f]||{bg:"var(--sand)",c:"var(--bark2)",l:f};
  return <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:x.bg,color:x.c,fontWeight:600}}>{x.l}</span>;
};

const Btn = ({children,v="primary",onClick,disabled,s,...rest})=>{
  const base={border:"none",borderRadius:100,fontSize:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"var(--sans)",transition:"all .25s cubic-bezier(.16,1,.3,1)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,opacity:disabled?.5:1};
  const vs={primary:{background:"var(--char)",color:"#fff",padding:"12px 28px",boxShadow:"0 4px 16px rgba(0,0,0,.15)"},secondary:{background:"var(--bg)",color:"var(--char)",padding:"12px 28px",border:"1px solid var(--sand)"},olive:{background:"var(--olive)",color:"#fff",padding:"10px 20px"},sm:{background:"var(--char)",color:"#fff",padding:"8px 16px",fontSize:13},ghost:{background:"transparent",color:"var(--char)",padding:"6px 14px",fontWeight:500,fontSize:13}};
  return <button onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform="translateY(-2px)";if(v==="primary"||v==="sm")e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.2)";else if(v==="secondary")e.currentTarget.style.background="var(--sand)"}}} onMouseLeave={e=>{if(!disabled){e.currentTarget.style.transform="translateY(0)";if(v==="primary"||v==="sm")e.currentTarget.style.boxShadow=vs[v].boxShadow||"none";else if(v==="secondary")e.currentTarget.style.background=vs.secondary.background}}} onClick={disabled?undefined:onClick} style={{...base,...vs[v],...s}} {...rest}>{children}</button>;
};

// Heart icon for favorites
const Heart = ({filled,onClick})=>(
  <button onClick={e=>{e.stopPropagation();onClick()}} style={{background:"none",border:"none",cursor:"pointer",padding:4,fontSize:18,lineHeight:1,transition:"transform .15s",color:filled?"var(--red)":"var(--clay)"}}
    onMouseDown={e=>e.currentTarget.style.transform="scale(.85)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>{filled?"♥":"♡"}</button>
);

// Toast component
const Toast = ({msg})=>msg?<div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"var(--bark)",color:"#fff",padding:"11px 26px",borderRadius:100,fontSize:14,fontWeight:500,zIndex:1100,animation:"up .25s ease",boxShadow:"var(--sh4)",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:15}}>✓</span>{msg}</div>:null;

// ═══════════════════════════════════════════════════════════════════
// ROUTE OPTIMIZATION ALGORITHM
// ═══════════════════════════════════════════════════════════════════
function optimizeRoute(orders,restaurantLocs,buildingLocs){
  // Calculate distance between two points
  const distance=(p1,p2)=>Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));

  // Group orders by readiness time (simulated based on order status)
  const ordersByReadiness=orders.reduce((acc,order)=>{
    const readyTime=order.status==="preparing"?"11:30 AM":order.status==="batched"?"11:15 AM":"11:45 AM";
    if(!acc[readyTime])acc[readyTime]=[];
    acc[readyTime].push(order);
    return acc;
  },{});

  const routes=[];

  // For each time batch, create optimized routes
  Object.entries(ordersByReadiness).forEach(([readyTime,batchOrders])=>{
    // Get unique restaurants for this batch
    const restaurantsToVisit=Array.from(new Set(batchOrders.map(o=>o.restaurantName)));

    // Optimize pickup sequence using nearest neighbor algorithm
    const pickupSequence=[];
    let currentPos={x:35,y:35}; // Starting point (depot)
    const remaining=[...restaurantsToVisit];

    while(remaining.length>0){
      let nearest=null;
      let minDist=Infinity;

      remaining.forEach(restName=>{
        const restPos=restaurantLocs[restName];
        if(restPos){
          const dist=distance(currentPos,restPos);
          if(dist<minDist){
            minDist=dist;
            nearest=restName;
          }
        }
      });

      if(nearest){
        pickupSequence.push({
          type:"pickup",
          location:nearest,
          pos:restaurantLocs[nearest],
          orders:batchOrders.filter(o=>o.restaurantName===nearest),
          estimatedTime:readyTime
        });
        currentPos=restaurantLocs[nearest];
        remaining.splice(remaining.indexOf(nearest),1);
      }else{
        break;
      }
    }

    // Optimize delivery sequence using nearest neighbor from last pickup
    const deliverySequence=[];
    const buildingsToVisit=Array.from(new Set(batchOrders.map(o=>o.building)));
    const remainingBuildings=[...buildingsToVisit];

    while(remainingBuildings.length>0){
      let nearest=null;
      let minDist=Infinity;

      remainingBuildings.forEach(buildingName=>{
        const buildPos=buildingLocs[buildingName];
        if(buildPos){
          const dist=distance(currentPos,buildPos);
          if(dist<minDist){
            minDist=dist;
            nearest=buildingName;
          }
        }
      });

      if(nearest){
        deliverySequence.push({
          type:"delivery",
          location:nearest,
          pos:buildingLocs[nearest],
          orders:batchOrders.filter(o=>o.building===nearest),
          estimatedTime:readyTime
        });
        currentPos=buildingLocs[nearest];
        remainingBuildings.splice(remainingBuildings.indexOf(nearest),1);
      }else{
        break;
      }
    }

    // Calculate total distance and time
    const totalStops=pickupSequence.length+deliverySequence.length;
    const totalDistance=pickupSequence.concat(deliverySequence).reduce((sum,stop,i,arr)=>{
      if(i===0)return distance({x:35,y:35},stop.pos);
      return sum+distance(arr[i-1].pos,stop.pos);
    },0);

    routes.push({
      batchTime:readyTime,
      pickups:pickupSequence,
      deliveries:deliverySequence,
      totalStops,
      totalDistance:totalDistance.toFixed(1),
      estimatedDuration:`${Math.ceil(totalStops*3+totalDistance/2)} min`
    });
  });

  return routes;
}

// ═══════════════════════════════════════════════════════════════════
// CUTOFF HOOK
// ═══════════════════════════════════════════════════════════════════
function useCutoff(){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[]);
  // Demo: always ~42 min remaining for first cutoff (10:30 AM)
  const rem=Math.max(0,42*60-(Math.floor(now/1000)%2520));
  const m=Math.floor(rem/60),s=rem%60;

  // Determine which delivery window is next
  const nextWindow = rem > 30*60 ? "12:00 PM" : "1:00 PM";
  const cutoffTime = rem > 30*60 ? "10:30 AM" : "11:30 AM";

  return {open:true,m,s,label:`${m}m ${String(s).padStart(2,"0")}s`,pct:rem/(120*60),nextWindow,cutoffTime};
}

// ═══════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════
function Footer(){
  const {go}=useContext(AppCtx);
  return(
    <footer style={{background:"var(--bark)",color:"#fff",padding:"64px 24px 32px",marginTop:80}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48}}>
          {/* Brand */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:32,height:32,borderRadius:8,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--bark)"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <span style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:22,letterSpacing:"-.01em"}}>LunchDrop</span>
            </div>
            <p style={{fontSize:14,opacity:.7,lineHeight:1.6,maxWidth:280}}>Batched lunch delivery for busy professionals. Fresh, sustainable, and always on time.</p>
          </div>

          {/* Product */}
          <div>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,letterSpacing:".06em",textTransform:"uppercase",opacity:.5}}>Product</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{k:"menu",l:"Browse Menu"},{k:"plans",l:"Lunch Pass"},{k:"about",l:"About Us"}].map(link=>(
                <button key={link.k} onClick={()=>go(link.k)} style={{background:"none",border:"none",color:"#fff",padding:0,fontSize:14,cursor:"pointer",opacity:.8,textAlign:"left",transition:"opacity .2s",fontFamily:"var(--sans)"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=1}
                  onMouseLeave={e=>e.currentTarget.style.opacity=.8}>
                  {link.l}
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,letterSpacing:".06em",textTransform:"uppercase",opacity:.5}}>Support</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{k:"help",l:"Help Center"},{k:"orders",l:"Track Order"}].map(link=>(
                <button key={link.k} onClick={()=>go(link.k)} style={{background:"none",border:"none",color:"#fff",padding:0,fontSize:14,cursor:"pointer",opacity:.8,textAlign:"left",transition:"opacity .2s",fontFamily:"var(--sans)"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=1}
                  onMouseLeave={e=>e.currentTarget.style.opacity=.8}>
                  {link.l}
                </button>
              ))}
              <a href="mailto:support@lunchdrop.com" style={{color:"#fff",textDecoration:"none",fontSize:14,opacity:.8,transition:"opacity .2s"}}
                onMouseEnter={e=>e.currentTarget.style.opacity=1}
                onMouseLeave={e=>e.currentTarget.style.opacity=.8}>
                Contact Us
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,letterSpacing:".06em",textTransform:"uppercase",opacity:.5}}>Legal</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{k:"terms",l:"Terms of Service"},{k:"privacy",l:"Privacy Policy"}].map(link=>(
                <button key={link.k} onClick={()=>go(link.k)} style={{background:"none",border:"none",color:"#fff",padding:0,fontSize:14,cursor:"pointer",opacity:.8,textAlign:"left",transition:"opacity .2s",fontFamily:"var(--sans)"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=1}
                  onMouseLeave={e=>e.currentTarget.style.opacity=.8}>
                  {link.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{paddingTop:32,borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{fontSize:13,opacity:.5}}>© 2024 LunchDrop. All rights reserved.</p>
          <div style={{display:"flex",gap:16}}>
            <a href="#" style={{color:"#fff",opacity:.5,fontSize:20,transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.5}>𝕏</a>
            <a href="#" style={{color:"#fff",opacity:.5,fontSize:20,transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.5}>in</a>
            <a href="#" style={{color:"#fff",opacity:.5,fontSize:20,transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.5}>📸</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════
function Navbar(){
  const {page,go,cartCount,user,setShowAuth,building,setShowBldg,setShowCart,notifications,markNotificationRead,markAllNotificationsRead}=useContext(AppCtx);
  const cut=useCutoff();
  const [cartBounce,setCartBounce]=useState(false);
  const [showNotifications,setShowNotifications]=useState(false);
  const prevCount=useRef(cartCount);
  useEffect(()=>{if(cartCount>prevCount.current){setCartBounce(true);setTimeout(()=>setCartBounce(false),400)}prevCount.current=cartCount},[cartCount]);

  const unreadCount=notifications.filter(n=>!n.read).length;

  return(
    <nav style={{position:"sticky",top:0,zIndex:100}}>
      {/* Cutoff strip */}
      <div style={{background:cut.open?"var(--terra)":"var(--sand)",color:cut.open?"#fff":"var(--clay2)",padding:"6px 24px",fontSize:12,fontWeight:600,display:"flex",justifyContent:"center",alignItems:"center",gap:10,letterSpacing:".02em",textTransform:"uppercase"}}>
        {cut.open?<><span style={{opacity:.8,fontSize:10}}>Next Cutoff</span><span style={{fontFamily:"var(--serif)",fontSize:16,textTransform:"none",fontWeight:700,animation:cut.m<5?"countPulse 1s infinite":"none"}}>{cut.label}</span><span style={{opacity:.4}}>·</span><span style={{opacity:.6,fontSize:10}}>{cut.cutoffTime} ({cut.nextWindow} delivery)</span></>:<span>Ordering closed — see you tomorrow!</span>}
      </div>
      {/* Main bar */}
      <div className="glass" style={{borderBottom:"1px solid var(--sand)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>go("home")} onMouseEnter={e=>e.currentTarget.style.opacity=.8} onMouseLeave={e=>e.currentTarget.style.opacity=1}>
              <div style={{width:32,height:32,borderRadius:8,background:"var(--char)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <span style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:22,color:"var(--char)",letterSpacing:"-.01em"}}>LunchDrop</span>
            </div>
            {building&&(
              <button onClick={()=>setShowBldg(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",background:"var(--bg2)",borderRadius:100,border:"1px solid var(--sand)",cursor:"pointer",fontSize:13,fontWeight:500,color:"var(--bark)",fontFamily:"var(--sans)",transition:"all .2s"}}
                 onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>
                <span style={{opacity:.6}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg></span> {building.name} <span style={{fontSize:9,opacity:.5}}>▼</span>
              </button>
            )}
            {user?.company&&(
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"var(--olive-bg)",borderRadius:100,border:"1px solid rgba(16,185,129,.2)",fontSize:12,fontWeight:600,color:"var(--olive2)"}}>
                <span style={{fontSize:14}}>{user.company.logo}</span>
                <span>{user.company.name}</span>
                <span style={{background:"var(--olive)",color:"#fff",padding:"2px 6px",borderRadius:100,fontSize:10,fontWeight:700}}>FREE DELIVERY</span>
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            {[{k:"home",l:"Home"},{k:"menu",l:"Menu"},{k:"orders",l:"Orders"},{k:"favorites",l:"Favorites"},{k:"plans",l:"Plans"}]
            .concat(user?.isRestaurant?[{k:"dashboard",l:"Dashboard"}]:[])
            .map(n=>(
              <button key={n.k} onClick={()=>go(n.k)} style={{border:"none",background:page===n.k?"#fff":"transparent",color:page===n.k?"var(--char)":"var(--clay2)",padding:"8px 16px",borderRadius:100,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s",boxShadow:page===n.k?"0 2px 8px rgba(0,0,0,.04)":"none"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--char)"} onMouseLeave={e=>e.currentTarget.style.color=page===n.k?"var(--char)":"var(--clay2)"}>{n.l}</button>
            ))}
            <div style={{width:1,height:24,background:"var(--sand)",margin:"0 12px"}}/>
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowNotifications(!showNotifications)} style={{display:"flex",alignItems:"center",background:unreadCount>0?"var(--terra-g)":"var(--bg2)",color:unreadCount>0?"var(--terra2)":"var(--bark)",padding:"8px 14px",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s",border:unreadCount>0?"1px solid rgba(249,115,22,.2)":"1px solid transparent"}}
                onMouseEnter={e=>e.currentTarget.style.opacity=0.9} onMouseLeave={e=>e.currentTarget.style.opacity=1}>
                🔔{unreadCount>0&&<span style={{marginLeft:4,background:"var(--terra)",color:"#fff",padding:"2px 6px",borderRadius:100,fontSize:11}}>{unreadCount}</span>}
              </button>
              {showNotifications&&(
                <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,width:360,background:"#fff",border:"1px solid var(--sand)",borderRadius:16,boxShadow:"var(--sh3)",zIndex:200,maxHeight:400,overflow:"hidden",display:"flex",flexDirection:"column"}}>
                  <div style={{padding:"16px 20px",borderBottom:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h4 style={{fontFamily:"var(--sans)",fontSize:16,fontWeight:700,color:"var(--bark)"}}>Notifications</h4>
                    {unreadCount>0&&<button onClick={markAllNotificationsRead} style={{background:"none",border:"none",fontSize:12,color:"var(--terra)",cursor:"pointer",fontWeight:600}}>Mark all read</button>}
                  </div>
                  <div style={{overflow:"auto",maxHeight:300}}>
                    {notifications.length===0?(
                      <div style={{padding:40,textAlign:"center",color:"var(--clay2)",fontSize:14}}>No notifications yet</div>
                    ):(
                      notifications.map(n=>(
                        <div key={n.id} onClick={()=>markNotificationRead(n.id)} style={{padding:"16px 20px",borderBottom:"1px solid var(--sand)",cursor:"pointer",background:n.read?"#fff":"var(--bg2)",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background=n.read?"#fff":"var(--bg2)"}>
                          <div style={{display:"flex",gap:12,alignItems:"start"}}>
                            <span style={{fontSize:20}}>{n.icon}</span>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                                <span style={{fontWeight:600,fontSize:14,color:"var(--bark)"}}>{n.title}</span>
                                {!n.read&&<span style={{width:8,height:8,borderRadius:"50%",background:"var(--terra)",flexShrink:0,marginTop:4}}/>}
                              </div>
                              <p style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>{n.message}</p>
                              <span style={{fontSize:11,color:"var(--clay)"}}>{ n.time}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button onClick={()=>setShowCart(true)} style={{display:"flex",alignItems:"center",border:"none",background:cartCount>0?"var(--char)":"var(--bg2)",color:cartCount>0?"#fff":"var(--bark)",padding:"8px 16px",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .3s cubic-bezier(.16,1,.3,1)",animation:cartBounce?"cartBounce .4s ease":"none",boxShadow:cartCount>0?"0 4px 16px rgba(0,0,0,.15)":"none"}}
              onMouseEnter={e=>{if(cartCount===0)e.currentTarget.style.background="var(--sand)"}} onMouseLeave={e=>{if(cartCount===0)e.currentTarget.style.background="var(--bg2)"}}>
              🛒{cartCount>0&&<span style={{marginLeft:6,background:"var(--terra)",color:"#fff",padding:"2px 6px",borderRadius:100,fontSize:11}}>{cartCount}</span>}
            </button>
            {user?.isRestaurant&&(
              <button onClick={()=>go("dashboard")} style={{border:"none",background:page==="dashboard"?"var(--terra)":"var(--bg2)",color:page==="dashboard"?"#fff":"var(--char)",padding:"8px 16px",borderRadius:100,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",marginLeft:8,transition:"all .2s",display:"flex",alignItems:"center",gap:6}}
                onMouseEnter={e=>e.currentTarget.style.opacity=.9} onMouseLeave={e=>e.currentTarget.style.opacity=1}>
                <span style={{fontSize:16}}>🍽️</span>Dashboard
              </button>
            )}
            <button onClick={()=>user?go("profile"):setShowAuth(true)} style={{border:user?"none":"1px solid var(--sand)",background:user?(page==="profile"?"var(--char)":"var(--bg2)"):"transparent",color:user?(page==="profile"?"#fff":"var(--char)"):"var(--char)",padding:"8px 18px",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",marginLeft:8,transition:"all .2s"}}
              onMouseEnter={e=>e.currentTarget.style.background=user?(page==="profile"?"var(--char)":"var(--sand)"):"var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background=user?(page==="profile"?"var(--char)":"var(--bg2)"):"transparent"}>
              {user?`👤 ${user.name.split(" ")[0]}`:"Sign in"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════
function Home(){
  const {go}=useContext(AppCtx);
  const cut=useCutoff();
  return(
    <div className="fi">
      <div className="ambient-glow"/>
      {/* HERO — asymmetric editorial layout */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"80px 24px 40px",position:"relative"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr .9fr",gap:64,alignItems:"center"}}>
          <div>
            <div className="si" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"8px 16px 8px 10px",background:"var(--terra-g)",borderRadius:100,marginBottom:24,border:"1px solid rgba(249,115,22,.2)"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"var(--terra)",animation:"pu 2s infinite, glow 2s infinite"}}/>
              <span style={{fontSize:12,fontWeight:600,color:"var(--terra2)",letterSpacing:".06em",textTransform:"uppercase"}}>Now serving SF Financial District</span>
            </div>
            <h1 className="up" style={{fontFamily:"var(--serif)",fontSize:72,fontWeight:600,lineHeight:1.05,color:"var(--char)",letterSpacing:"-.02em",marginBottom:24}}>
              Lunch, <em style={{color:"var(--terra)",fontStyle:"normal",position:"relative"}}>scheduled<svg style={{position:"absolute",bottom:-5,left:0,width:"100%"}} viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,5 Q50,0 100,5" stroke="var(--terra)" strokeWidth="2" fill="none"/></svg></em>.<br/><span style={{opacity:.6}}>Never scrambled.</span>
            </h1>
            <p className="up" style={{animationDelay:".1s",fontSize:18,color:"var(--clay2)",lineHeight:1.6,marginBottom:40,maxWidth:480,fontWeight:400}}>
              Order by 10:30 AM for 12:00 PM delivery, or by 11:30 AM for 1:00 PM delivery. Fresh meals delivered by our team straight to your door.
            </p>
            <div className="up" style={{animationDelay:".2s",display:"flex",gap:16,marginBottom:40}}>
              <Btn onClick={()=>go("signup")} s={{padding:"16px 32px",fontSize:16}}>Get Started →</Btn>
              <Btn v="secondary" onClick={()=>go("menu")} s={{padding:"16px 32px",fontSize:16}}>Browse menu</Btn>
            </div>
            {/* Cutoff chip */}
            <div className="up glass-card" style={{animationDelay:".3s",display:"inline-flex",alignItems:"center",gap:16,padding:"16px 24px",borderRadius:16,border:"1px solid var(--sand)"}}>
              <div style={{width:48,height:48,borderRadius:12,background:"#fff",border:"1px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>⏰</div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"var(--clay2)",letterSpacing:".06em",textTransform:"uppercase"}}>Order cutoff in</div>
                <div style={{fontFamily:"var(--sans)",fontWeight:700,fontSize:24,color:"var(--char)"}}>{cut.label}</div>
              </div>
            </div>
            <div className="up" style={{animationDelay:".4s",display:"flex",gap:48,marginTop:48,paddingTop:32,borderTop:"1px solid var(--sand)"}}>
              {[{n:"$2.50",l:"Flat delivery fee"},{n:"8+",l:"Curated restaurants"},{n:"0 min",l:"Waiting in lobby"}].map((x,i)=>(
                <div key={i}><div style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",fontWeight:500}}>{x.n}</div><div style={{fontSize:13,color:"var(--clay2)",marginTop:4,fontWeight:500}}>{x.l}</div></div>
              ))}
            </div>
          </div>
          {/* Right — visual composition */}
          <div className="si" style={{position:"relative",display:"flex",justifyContent:"center",alignItems:"center",minHeight:500}}>
            <div style={{width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle at 30% 30%,#fff,var(--bg) 70%)",border:"1px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:140,position:"relative",boxShadow:"0 0 100px rgba(249,115,22,.05)",backdropFilter:"blur(8px)",zIndex:1}}>
              <span style={{animation:"fl 4s cubic-bezier(.16,1,.3,1) infinite",filter:"drop-shadow(0 20px 30px rgba(0,0,0,.1))"}}>🍱</span>
            </div>
            {/* Floating cards */}
            {[
              {t:"Order Delivered",d:"Fresh and ready to enjoy",ic:"✓",pos:{top:40,right:-20},del:".5s",c:"var(--olive)"},
              {t:"Eco-Friendly",d:"Batched routes reduce emissions",ic:"🚴",pos:{bottom:60,left:-30},del:".7s",c:"var(--terra)"},
              {t:"No Tipping",d:"Included in flat fee",ic:"💰",pos:{top:"50%",right:-40},del:".9s",c:"var(--blue)"},
            ].map((c,i)=>(
              <div key={i} className="up glass-card" style={{position:"absolute",...c.pos,animationDelay:c.del,padding:"12px 20px",borderRadius:16,display:"flex",alignItems:"center",gap:12,zIndex:2}}>
                <div style={{width:32,height:32,borderRadius:8,background:"var(--bg2)",border:"1px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{c.ic}</div>
                <div><div style={{fontSize:13,fontWeight:600,color:"var(--bark)"}}>{c.t}</div><div style={{fontSize:12,color:"var(--clay2)",marginTop:2}}>{c.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — connected visual timeline */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"80px 24px"}}>
        <div style={{textAlign:"center",marginBottom:64}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:40,color:"var(--char)",marginBottom:12}}>The Daily Protocol</h2>
          <p style={{color:"var(--clay2)",fontSize:16,maxWidth:500,margin:"0 auto"}}>Four precision-timed steps. Every weekday. Better lunch.</p>
        </div>
        <div style={{position:"relative"}}>
          {/* Connection line */}
          <div style={{position:"absolute",top:36,left:"12.5%",right:"12.5%",height:2,background:"linear-gradient(90deg,var(--olive-bg),var(--terra-g),var(--blue-bg))",borderRadius:2,zIndex:0}}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24,position:"relative",zIndex:1}}>
            {[
              {ic:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,t:"Pre-order",d:"Order by 10:30 AM for 12:00 PM delivery or by 11:30 AM for 1:00 PM delivery.",time:"8–11:30 AM",bg:"#fff",b:"var(--sand)",c:"var(--bark)"},
              {ic:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>,t:"Batch prep",d:"Restaurants prepare all orders in bulk — fresher food, less waste.",time:"11:00–11:45",bg:"#fff",b:"var(--sand)",c:"var(--honey)"},
              {ic:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="18" r="4"/><circle cx="19" cy="18" r="4"/><polyline points="15 6 9 6 12 12 12 18"/><line x1="12" y1="12" x2="19" y2="18"/></svg>,t:"Route delivery",d:"Our in-house delivery team brings meals directly to your building.",time:"11:45–1:00",bg:"#fff",b:"var(--sand)",c:"var(--terra)"},
              {ic:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,t:"Delivered to you",d:"Get a notification when your fresh meal arrives at your door.",time:"12:00–1:00",bg:"#fff",b:"var(--sand)",c:"var(--olive)"},
            ].map((s,i)=>(
              <div key={i} className="up" style={{animationDelay:`${i*.15}s`,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
                <div style={{width:72,height:72,borderRadius:24,background:s.bg,border:`1px solid ${s.b}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:20,boxShadow:`var(--sh2)`}}>{s.ic}</div>
                <div style={{fontSize:11,fontWeight:600,color:s.c,letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>{s.time}</div>
                <h3 style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:18,color:"var(--bark)",marginBottom:8}}>{s.t}</h3>
                <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.6}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED RESTAURANTS */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"40px 24px 80px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
          <div>
            <h2 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)"}}>Partners</h2>
            <p style={{fontSize:15,color:"var(--clay2)",marginTop:4}}>8 curated kitchens for SF Financial District</p>
          </div>
          <Btn v="secondary" onClick={()=>go("menu")} s={{padding:"10px 20px",fontSize:14}}>View Full Menu</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {RESTAURANTS.filter(r=>r.featured).map((r,i)=>(
            <div key={r.id} className="up hov glass-card" style={{animationDelay:`${i*.1}s`,borderRadius:"var(--r)",overflow:"hidden",cursor:"pointer",background:"#fff",border:"1px solid var(--sand)"}}
              onClick={()=>go("r-"+r.id)}>
              <div style={{height:140,borderBottom:"1px solid var(--sand)",position:"relative",overflow:"hidden"}}>
                <img src={r.img} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}} alt={r.name} />
                <div style={{position:"absolute",top:12,left:12}}>
                  <span style={{background:r.tags[0]==="Organic"?"var(--olive-bg)":"var(--terra-g)",color:r.tags[0]==="Organic"?"var(--olive2)":"var(--terra2)",border:r.tags[0]==="Organic"?"1px solid rgba(16,185,129,.2)":"1px solid rgba(249,115,22,.2)",padding:"4px 10px",borderRadius:100,fontSize:10,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase",backdropFilter:"blur(4px)"}}>{r.tags[0]}</span>
                </div>
                <div style={{position:"absolute",bottom:12,right:12,fontSize:11,color:"var(--bark)",fontWeight:600,background:"rgba(255,255,255,.8)",borderRadius:100,padding:"4px 10px",backdropFilter:"blur(8px)",border:"1px solid var(--sand)"}}>🔥 {r.orders}+ ordered</div>
              </div>
              <div style={{padding:"16px 20px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <h3 style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:18,color:"var(--bark)"}}>{r.name}</h3>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--bark)",background:"var(--bg2)",padding:"2px 8px",borderRadius:6,border:"1px solid var(--sand)"}}>★ {r.rating}</span>
                </div>
                <p style={{fontSize:13,color:"var(--clay2)",marginBottom:12}}>{r.cuisine} · {r.time} min</p>
                <div style={{display:"flex",gap:6}}>
                  {r.tags.slice(0,2).map(t=><span key={t} style={{fontSize:11,color:"var(--clay2)",background:"#fff",border:"1px solid var(--sand)",padding:"4px 10px",borderRadius:6}}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"16px 24px 56px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {[
            {q:"I save 30 minutes every day. The delivery is seamless — no waiting in line, food arrives fresh and hot.",n:"Sarah K.",r:"Product Manager, Salesforce Tower",s:5},
            {q:"Way cheaper than DoorDash and the food actually arrives at the same time every day. Game changer for my team.",n:"Marcus L.",r:"Engineering Lead, One Market Plaza",s:5},
            {q:"The Lunch Pass paid for itself in the first week. Free delivery + priority service is worth every penny.",n:"Priya R.",r:"Designer, 555 California",s:5},
          ].map((t,i)=>(
            <div key={i} className="up" style={{animationDelay:`${i*.1}s`,background:"#fff",borderRadius:"var(--r)",padding:"22px 20px",boxShadow:"var(--sh1)",border:"1px solid var(--sand)"}}>
              <div style={{color:"var(--honey)",fontSize:13,marginBottom:10,letterSpacing:2}}>{"★".repeat(t.s)}</div>
              <p style={{fontSize:14,color:"var(--bark2)",lineHeight:1.55,marginBottom:14,fontStyle:"italic"}}>"{t.q}"</p>
              <div><div style={{fontSize:13,fontWeight:700,color:"var(--bark)"}}>{t.n}</div><div style={{fontSize:11,color:"var(--clay)"}}>{t.r}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ECONOMICS */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"0 24px 80px"}}>
        <div className="glass-card hov" style={{background:"#fff",border:"1px solid var(--sand)",borderRadius:24,padding:"48px 56px",display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr",gap:48}}>
          <div>
            <div style={{display:"inline-block",padding:"6px 14px",background:"var(--bg2)",border:"1px solid var(--sand)",borderRadius:100,fontSize:12,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Batch Economics</div>
            <div style={{fontFamily:"var(--serif)",fontSize:32,marginBottom:16,color:"var(--bark)",lineHeight:1.1}}>Why does delivery cost <em style={{color:"var(--terra)",fontStyle:"normal"}}>$2.50?</em></div>
            <p style={{fontSize:15,lineHeight:1.6,color:"var(--clay2)",fontWeight:400}}>Single-order apps are inefficient. We batch 30–50 meals per delivery route. The $0.80–$1.20 per meal execution cost enables the lowest fees on the market without compromising restaurant revenue.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:24,justifyContent:"center"}}>
            {[{l:"LunchDrop",v:"$2.50",w:"25%",c:"var(--terra)",bg:"var(--terra-g)"},{l:"On-demand apps",v:"$5–8",w:"85%",c:"var(--clay)",bg:"var(--bg2)"}].map(x=>(
              <div key={x.l}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:8,fontWeight:500,color:"var(--bark)"}}><span>{x.l}</span><span style={{fontFamily:"var(--sans)",fontWeight:700}}>{x.v}</span></div>
                <div style={{height:8,background:"var(--bg2)",borderRadius:4,overflow:"hidden",border:"1px solid var(--sand)"}}><div style={{height:"100%",width:x.w,background:x.c,borderRadius:4,animation:"progressFill 1.5s cubic-bezier(.16,1,.3,1) both","--fill":x.w}}/></div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:20,justifyContent:"center"}}>
            {[{l:"Restaurant commission",v:"18–22%",d:"vs 30% on DoorDash"},{l:"Avg delivery time",v:"< 15 min",d:"From pickup to doorstep"}].map(x=>(
              <div key={x.l} style={{background:"var(--bg2)",border:"1px solid var(--sand)",padding:"16px",borderRadius:12}}>
                <div style={{fontSize:11,color:"var(--clay2)",fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:4}}>{x.l}</div>
                <div style={{fontFamily:"var(--sans)",fontWeight:700,fontSize:22,color:"var(--bark)"}}>{x.v}</div>
                <div style={{fontSize:12,color:"var(--clay)",marginTop:4}}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--char)",color:"var(--clay2)",padding:"64px 24px 32px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between"}}>
          <div style={{maxWidth:300}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:24,height:24,borderRadius:6,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--char)"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <span style={{fontFamily:"var(--sans)",fontWeight:700,fontSize:20,color:"#fff"}}>LunchDrop</span>
            </div>
            <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.6}}>Precision-timed, batched lunch delivery directly to your door. Fresh meals from curated restaurants.</p>
          </div>
          <div style={{display:"flex",gap:64}}>
            {[{t:"Product",l:["How it works","Pricing","For Restaurants","Enterprise"]},{t:"Company",l:["About","Careers","Press"]},{t:"Support",l:["Help Center","Dietary Info","Contact"]}].map(c=>(
              <div key={c.t}><div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:16}}>{c.t}</div>{c.l.map(l=><div key={l} style={{fontSize:14,color:"var(--clay2)",marginBottom:12,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="var(--terra)"} onMouseLeave={e=>e.currentTarget.style.color="var(--clay2)"}>{l}</div>)}</div>
            ))}
          </div>
        </div>
        <div style={{maxWidth:1200,margin:"48px auto 0",borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,color:"var(--clay2)"}}>
          <div>© 2026 LunchDrop. All rights reserved.</div>
          <div style={{display:"flex",gap:16}}><span>Terms</span><span>Privacy</span></div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MENU BROWSE
// ═══════════════════════════════════════════════════════════════════
function MenuBrowse(){
  const {go,favorites}=useContext(AppCtx);
  const [q,setQ]=useState("");
  const [fil,setFil]=useState("All");
  const [dietaryFilter,setDietaryFilter]=useState("All");
  const [sortBy,setSortBy]=useState("featured");
  const cats=["All","Bowls","Pizza","Asian","Mexican","Mediterranean","Vegan","Bakery"];
  const dietaryOptions=["All","Vegan","Vegetarian","Gluten-Free","Halal","Organic"];

  let list=RESTAURANTS.filter(r=>{
    const ms=r.name.toLowerCase().includes(q.toLowerCase())||r.cuisine.toLowerCase().includes(q.toLowerCase());
    const mf=fil==="All"||(fil==="Favorites"&&favorites.has(r.id))||r.tags.some(t=>t.toLowerCase().includes(fil.toLowerCase()))||r.cuisine.toLowerCase().includes(fil.toLowerCase());
    const md=dietaryFilter==="All"||(
      (dietaryFilter==="Vegan"&&r.tags.some(t=>t.toLowerCase().includes("vegan")))||
      (dietaryFilter==="Vegetarian"&&r.tags.some(t=>t.toLowerCase().includes("vegeta")))||
      (dietaryFilter==="Gluten-Free"&&r.tags.some(t=>t.toLowerCase().includes("gf")))||
      (dietaryFilter==="Halal"&&r.tags.some(t=>t.toLowerCase().includes("halal")))||
      (dietaryFilter==="Organic"&&r.tags.some(t=>t.toLowerCase().includes("organic")))
    );
    return ms&&mf&&md;
  });

  // Apply sorting
  list=[...list].sort((a,b)=>{
    if(sortBy==="rating")return b.rating-a.rating;
    if(sortBy==="time")return parseInt(a.time.split("–")[0])-parseInt(b.time.split("–")[0]);
    if(sortBy==="popular")return b.orders-a.orders;
    if(sortBy==="featured")return b.featured-a.featured;
    return 0;
  });

  return(
    <div className="fi" style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px 80px"}}>
      <div style={{marginBottom:32,textAlign:"center"}}>
        <h1 style={{fontFamily:"var(--serif)",fontSize:48,color:"var(--bark)",marginBottom:8}}>Today's Collection</h1>
        <p style={{fontSize:16,color:"var(--clay2)",fontWeight:400}}>SF Financial District · Two delivery windows: 12:00 PM & 1:00 PM</p>
      </div>
      {/* Search */}
      <div style={{position:"relative",maxWidth:480,margin:"0 auto 24px"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search dishes, restaurants or cuisines…"
          style={{width:"100%",padding:"16px 20px 16px 48px",borderRadius:100,border:"1px solid var(--sand)",background:"#fff",fontSize:15,outline:"none",color:"var(--bark)",transition:"all .2s cubic-bezier(.16,1,.3,1)",boxShadow:"0 4px 20px rgba(0,0,0,.04)"}}
          onFocus={e=>{e.target.style.borderColor="var(--terra)";e.target.style.boxShadow="0 0 0 3px rgba(249,115,22,.15)",e.target.style.background="#fff"}} onBlur={e=>{e.target.style.borderColor="var(--sand)";e.target.style.boxShadow="0 4px 20px rgba(0,0,0,.04)";e.target.style.background="#fff"}}/>
        <span style={{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",fontSize:18,opacity:.4}}>🔍</span>
      </div>

      {/* Sort & Dietary Filters */}
      <div style={{maxWidth:700,margin:"0 auto 24px",display:"flex",gap:12,justifyContent:"center",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,fontWeight:600,color:"var(--clay2)"}}>Sort:</span>
          <select
            value={sortBy}
            onChange={e=>setSortBy(e.target.value)}
            style={{padding:"8px 16px",borderRadius:100,border:"1px solid var(--sand)",background:"#fff",fontSize:13,fontWeight:600,color:"var(--bark)",cursor:"pointer",outline:"none",fontFamily:"var(--sans)"}}
          >
            <option value="featured">Featured</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
            <option value="time">Fastest Delivery</option>
          </select>
        </div>
        <div style={{width:1,height:24,background:"var(--sand)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,fontWeight:600,color:"var(--clay2)"}}>Dietary:</span>
          <select
            value={dietaryFilter}
            onChange={e=>setDietaryFilter(e.target.value)}
            style={{padding:"8px 16px",borderRadius:100,border:"1px solid var(--sand)",background:"#fff",fontSize:13,fontWeight:600,color:"var(--bark)",cursor:"pointer",outline:"none",fontFamily:"var(--sans)"}}
          >
            {dietaryOptions.map(opt=><option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{display:"flex",gap:8,marginBottom:40,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>setFil("Favorites")} style={{border:fil==="Favorites"?"1px solid var(--red)":"1px solid var(--sand)",background:fil==="Favorites"?"var(--red-bg)":"#fff",color:fil==="Favorites"?"var(--red)":"var(--bark)",padding:"8px 18px",borderRadius:100,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s cubic-bezier(.16,1,.3,1)"}}
             onMouseEnter={e=>{if(fil!=="Favorites")e.currentTarget.style.background="var(--bg2)"}} onMouseLeave={e=>{if(fil!=="Favorites")e.currentTarget.style.background="#fff"}}>♥ Favorites</button>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFil(c)} style={{border:"1px solid var(--sand)",background:fil===c?"var(--char)":"#fff",color:fil===c?"#fff":"var(--clay2)",padding:"8px 18px",borderRadius:100,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s cubic-bezier(.16,1,.3,1)",boxShadow:fil===c?"0 4px 12px rgba(0,0,0,.15)":"none"}}
             onMouseEnter={e=>{if(fil!==c)e.currentTarget.style.background="var(--bg2)"}} onMouseLeave={e=>{if(fil!==c)e.currentTarget.style.background="#fff"}}>{c}</button>
        ))}
      </div>
      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
        {list.map((r,i)=>(
          <div key={r.id} className="up hov glass-card" style={{animationDelay:`${i*.05}s`,borderRadius:"var(--r)",overflow:"hidden",cursor:"pointer",display:"flex",background:"#fff",border:"1px solid var(--sand)"}}
            onClick={()=>go("r-"+r.id)}>
            <div style={{width:120,borderRight:"1px solid var(--sand)",flexShrink:0}}>
              <img src={r.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={r.name}/>
            </div>
            <div style={{padding:"20px 24px",flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div>
                  <h3 style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:18,color:"var(--bark)",marginBottom:2}}>{r.name}</h3>
                  <p style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>{r.cuisine} · {r.time} min</p>
                  {(()=>{
                    const isOpen=isRestaurantOpen(r);
                    const hours=getTodayHours(r);
                    return hours&&(
                      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:isOpen?"var(--olive)":"var(--clay)"}}/>
                        <span style={{color:isOpen?"var(--olive2)":"var(--clay2)",fontWeight:600}}>{isOpen?"Open":"Closed"}</span>
                        {hours!=="Closed"&&<span style={{color:"var(--clay2)"}}>· {hours}</span>}
                      </div>
                    );
                  })()}
                </div>
                <span style={{fontSize:12,fontWeight:600,color:"var(--bark)",background:"var(--bg2)",padding:"4px 10px",borderRadius:6,border:"1px solid var(--sand)"}}>★ {r.rating}</span>
              </div>
              <div style={{display:"flex",gap:6,marginTop:16}}>{r.tags.map(t=><span key={t} style={{border:"1px solid var(--sand)",background:"var(--bg2)",fontSize:10,fontWeight:600,padding:"4px 10px",borderRadius:6,color:"var(--clay2)",textTransform:"uppercase",letterSpacing:".04em"}}>{t}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
      {list.length===0&&<div className="si" style={{textAlign:"center",padding:80,color:"var(--clay)"}}><span style={{display:"block",marginBottom:16,color:"var(--clay)",opacity:.6}}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></span><div style={{fontSize:18,color:"var(--bark)"}}>No matches found</div></div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESTAURANT MENU PAGE (with sticky category nav + favorites)
// ═══════════════════════════════════════════════════════════════════
function RestaurantPage({rid}){
  const {go,cart,addToCart,removeFromCart,favorites,toggleFav,showToast,user}=useContext(AppCtx);
  const r=RESTAURANTS.find(x=>x.id===rid);
  const menu=MENU[rid];
  const [activeCat,setActiveCat]=useState(null);
  const [cust,setCust]=useState(null);
  const [selOpts,setSelOpts]=useState({});
  const [showReviewModal,setShowReviewModal]=useState(false);
  const [newReview,setNewReview]=useState({rating:5,comment:""});
  const [localReviews,setLocalReviews]=useState(REVIEWS[rid]||[]);
  if(!r||!menu) return null;
  const cartHere=cart.filter(c=>c.rid===rid);
  const cartOther=cart.length>0&&cart[0].rid!==rid;

  const openCust=(item)=>{
    if(item.cust?.length>0){setCust(item);setSelOpts({})}
    else{
      if(cartOther){showToast("Cart locked to one restaurant");return}
      addToCart({...item,rid,rname:r.name,opts:[]});
    }
  };
  const confirmCust=()=>{
    if(cartOther){showToast("Cart locked to one restaurant");return}
    const os=Object.values(selOpts).flat();
    const ex=os.reduce((s,o)=>s+o.p,0);
    addToCart({...cust,rid,rname:r.name,opts:os,price:cust.price+ex});
    setCust(null);
  };

  return(
    <div className="fi" style={{maxWidth:1000,margin:"0 auto",padding:"32px 24px 80px"}}>
      <button onClick={()=>go("menu")} style={{background:"none",border:"none",color:"var(--clay2)",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"var(--sans)",padding:0,marginBottom:24,display:"flex",alignItems:"center",gap:6,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="var(--terra)"} onMouseLeave={e=>e.currentTarget.style.color="var(--clay2)"}>← Back to Menu</button>
      {/* Header */}
      <div className="up glass-card" style={{display:"flex",gap:24,alignItems:"center",marginBottom:32,borderRadius:24,padding:"32px 36px",background:"#fff",border:"1px solid var(--sand)"}}>
        <div style={{width:96,height:96,borderRadius:20,border:"1px solid var(--sand)",flexShrink:0,overflow:"hidden"}}>
          <img src={r.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={r.name}/>
        </div>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:6,fontWeight:600}}>{r.name}</h1>
          <p style={{fontSize:15,color:"var(--clay2)",marginBottom:12}}>{r.cuisine} · {r.time} min · {r.orders}+ orders</p>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:600,color:"var(--bark)",background:"var(--bg2)",border:"1px solid var(--sand)",padding:"4px 10px",borderRadius:6}}>★ {r.rating}</span>
            {r.tags.map(t=><span key={t} style={{background:"var(--bg2)",border:"1px solid var(--sand)",padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",color:"var(--clay2)"}}>{t}</span>)}
          </div>
        </div>
        <div style={{textAlign:"right"}}><div style={{fontSize:12,color:"var(--clay2)",fontWeight:600,textTransform:"uppercase",letterSpacing:".04em"}}>Today's capacity</div><div style={{fontFamily:"var(--sans)",fontWeight:700,fontSize:28,color:"var(--olive)"}}>{r.maxDaily} meals</div></div>
      </div>

      {/* Sticky category nav */}
      <div className="glass" style={{position:"sticky",top:0,zIndex:80,padding:"16px 24px",margin:"0 -24px 32px",display:"flex",gap:8,background:"rgba(250,250,250,.6)"}}>
        {menu.map(c=>(
          <button key={c.cat} onClick={()=>{setActiveCat(c.cat);document.getElementById(`cat-${c.cat}`)?.scrollIntoView({behavior:"smooth",block:"start"})}}
            style={{border:"1px solid var(--sand)",background:activeCat===c.cat?"var(--char)":"#fff",color:activeCat===c.cat?"#fff":"var(--clay2)",padding:"8px 18px",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s cubic-bezier(.16,1,.3,1)",boxShadow:activeCat===c.cat?"0 4px 16px rgba(0,0,0,.15)":"none"}}
             onMouseEnter={e=>{if(activeCat!==c.cat)e.currentTarget.style.background="var(--bg2)"}} onMouseLeave={e=>{if(activeCat!==c.cat)e.currentTarget.style.background="#fff"}}>{c.cat}</button>
        ))}
      </div>

      {/* Menu */}
      {menu.map((cat, ci)=>(
        <div key={cat.cat} id={`cat-${cat.cat}`} style={{marginBottom:48,scrollMarginTop:100}}>
          <h2 className="up" style={{animationDelay:`${ci*.1}s`,fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:20,paddingBottom:12,borderBottom:"1px solid var(--sand)",fontWeight:600}}>{cat.cat}</h2>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {cat.items.map((item, ii)=>{
              const inCart=cartHere.find(c=>c.id===item.id);
              const isFav=favorites.has(item.id);
              return(
                <div key={item.id} className="up hov glass-card" style={{animationDelay:`${ci*.1 + ii*.05}s`,borderRadius:"var(--r)",padding:"20px 24px",display:"flex",gap:20,alignItems:"center",background:"#fff",border:"1px solid var(--sand)"}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="var(--sh3), 0 0 0 1px rgba(0,0,0,.04)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="var(--sh1)"}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <h3 style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:18,color:"var(--bark)"}}>{item.name}</h3>
                      {item.pop&&<span style={{background:"var(--terra-g)",color:"var(--terra2)",border:"1px solid rgba(249,115,22,.2)",padding:"4px 8px",borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase"}}>Popular</span>}
                      {item.flags.map(f=><span key={f} style={{background:"var(--bg2)",color:"var(--clay2)",border:"1px solid var(--sand)",padding:"4px 8px",borderRadius:6,fontSize:10,fontWeight:600}}>{f}</span>)}
                    </div>
                    <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.6,marginBottom:12,maxWidth:500}}>{item.desc}</p>
                    <div style={{display:"flex",alignItems:"center",gap:16}}>
                      <span style={{fontFamily:"var(--sans)",fontWeight:700,fontSize:18,color:"var(--bark)"}}>${item.price.toFixed(2)}</span>
                      <span style={{fontSize:13,color:"var(--clay)"}}>{item.cal} cal</span>
                      {item.cust?.length>0&&<span style={{fontSize:13,color:"var(--terra)",fontWeight:600}}>Customizable</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Heart filled={isFav} onClick={()=>toggleFav(item.id)}/>
                    {inCart?(
                      <div style={{display:"flex",alignItems:"center",gap:10,background:"var(--bg2)",padding:"4px",borderRadius:100,border:"1px solid var(--sand)"}}>
                        <button onClick={()=>removeFromCart(item.id)} style={{width:36,height:36,borderRadius:"50%",border:"1px solid var(--sand)",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--bark)",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background="var(--char)";e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="var(--bark)"}}>−</button>
                        <span style={{fontWeight:700,fontSize:16,minWidth:20,textAlign:"center",color:"var(--bark)",fontFamily:"var(--sans)"}}>{inCart.qty}</span>
                        <button onClick={()=>openCust(item)} style={{width:36,height:36,borderRadius:"50%",border:"none",background:"var(--terra)",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",transition:"all .2s",boxShadow:"0 2px 8px var(--terra-g)"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>+</button>
                      </div>
                    ):(
                      <Btn v="secondary" s={{padding:"10px 24px",fontSize:14,borderRadius:100}} onClick={()=>openCust(item)}>+ Add</Btn>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Reviews Section */}
      {(()=>{
        const reviews=localReviews;
        return(
          <div style={{marginTop:80,marginBottom:48}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
              <div>
                <h2 style={{fontFamily:"var(--serif)",fontSize:32,color:"var(--bark)",marginBottom:8}}>Customer Reviews</h2>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{fontSize:40,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)"}}>{r.rating}</div>
                    <div>
                      <div style={{fontSize:20,color:"var(--honey)"}}>{"★".repeat(Math.floor(r.rating))}{"☆".repeat(5-Math.floor(r.rating))}</div>
                      <div style={{fontSize:13,color:"var(--clay2)",marginTop:2}}>Based on {reviews.length} reviews</div>
                    </div>
                  </div>
                </div>
              </div>
              <Btn v="primary" onClick={()=>setShowReviewModal(true)}>Write a Review</Btn>
            </div>

            {reviews.length>0?(
              <div style={{display:"flex",flexDirection:"column",gap:20}}>
                {reviews.map(rev=>(
                  <div key={rev.id} className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)",background:"#fff"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:16}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                          <div style={{width:40,height:40,borderRadius:"50%",background:"var(--bg2)",border:"1px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,color:"var(--bark)"}}>{rev.user[0]}</div>
                          <div>
                            <div style={{fontWeight:600,fontSize:15,color:"var(--bark)"}}>{rev.user}</div>
                            <div style={{fontSize:13,color:"var(--clay2)"}}>{new Date(rev.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
                          </div>
                        </div>
                      </div>
                      <div style={{fontSize:16,color:"var(--honey)"}}>{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</div>
                    </div>
                    <p style={{fontSize:15,color:"var(--bark)",lineHeight:1.7,marginBottom:16}}>{rev.comment}</p>
                    <div style={{display:"flex",alignItems:"center",gap:16,paddingTop:16,borderTop:"1px solid var(--sand)"}}>
                      <button style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"var(--bg2)",border:"1px solid var(--sand)",borderRadius:8,cursor:"pointer",fontSize:13,color:"var(--bark)",fontWeight:500,transition:"all .2s"}}
                        onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"}
                        onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>
                        👍 Helpful ({rev.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ):(
              <div className="glass-card" style={{padding:60,borderRadius:16,border:"1px solid var(--sand)",background:"#fff",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>⭐</div>
                <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:8}}>No reviews yet</h3>
                <p style={{color:"var(--clay2)",fontSize:14,marginBottom:24}}>Be the first to share your experience!</p>
                <Btn v="primary" onClick={()=>setShowReviewModal(true)}>Write the First Review</Btn>
              </div>
            )}

            {/* Review Modal */}
            {showReviewModal&&(
              <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={()=>setShowReviewModal(false)}>
                <div className="glass-card" onClick={e=>e.stopPropagation()} style={{width:540,maxHeight:"90vh",overflow:"auto",background:"#fff",borderRadius:20,boxShadow:"var(--sh4)",animation:"slideUp .3s cubic-bezier(.16,1,.3,1)"}}>
                  <div style={{padding:"28px 32px",borderBottom:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h2 style={{fontFamily:"var(--serif)",fontSize:26,color:"var(--bark)"}}>Write a Review</h2>
                    <button onClick={()=>setShowReviewModal(false)} style={{background:"var(--bg2)",border:"none",fontSize:24,cursor:"pointer",color:"var(--clay2)",padding:"4px 12px",borderRadius:100,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>×</button>
                  </div>
                  <div style={{padding:32}}>
                    <div style={{marginBottom:24}}>
                      <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Your Rating</label>
                      <div style={{display:"flex",gap:8}}>
                        {[1,2,3,4,5].map(star=>(
                          <button
                            key={star}
                            onClick={()=>setNewReview({...newReview,rating:star})}
                            style={{background:"transparent",border:"none",fontSize:36,cursor:"pointer",color:star<=newReview.rating?"var(--honey)":"var(--sand)",transition:"all .2s"}}
                            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
                            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                          >
                            {star<=newReview.rating?"★":"☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{marginBottom:24}}>
                      <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Your Review</label>
                      <textarea
                        value={newReview.comment}
                        onChange={e=>setNewReview({...newReview,comment:e.target.value})}
                        placeholder="Share your experience with this restaurant..."
                        rows={6}
                        style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:14,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s",resize:"vertical"}}
                        onFocus={e=>e.target.style.borderColor="var(--terra)"}
                        onBlur={e=>e.target.style.borderColor="var(--sand)"}
                      />
                    </div>
                    <div style={{display:"flex",gap:12}}>
                      <Btn v="ghost" onClick={()=>setShowReviewModal(false)}>Cancel</Btn>
                      <Btn v="primary" onClick={()=>{
                        if(!newReview.comment.trim()) {
                          showToast("Please enter a review comment");
                          return;
                        }
                        const rev = {
                          id: `new-${Date.now()}`,
                          user: user?.name || "Guest",
                          rating: newReview.rating,
                          date: new Date().toISOString(),
                          comment: newReview.comment,
                          helpful: 0
                        };
                        setLocalReviews([rev, ...localReviews]);
                        setShowReviewModal(false);
                        setNewReview({rating:5,comment:""});
                        showToast("Review submitted successfully!");
                      }}>Submit Review</Btn>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Customization modal */}
      {cust&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.4)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={()=>setCust(null)}>
          <div className="si glass-card" onClick={e=>e.stopPropagation()} style={{borderRadius:24,padding:"32px 36px",width:480,maxHeight:"85vh",overflow:"auto",boxShadow:"var(--sh4)",border:"1px solid var(--sand)",background:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
              <div>
                <h3 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",fontWeight:600}}>{cust.name}</h3>
                <p style={{fontSize:14,color:"var(--clay2)",marginTop:4,fontWeight:500}}>${cust.price.toFixed(2)} · {cust.cal} cal</p>
              </div>
              <button onClick={()=>setCust(null)} style={{background:"var(--bg2)",border:"none",fontSize:22,cursor:"pointer",color:"var(--clay2)",padding:"6px 12px",borderRadius:100,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>×</button>
            </div>
            {cust.cust.map((cg,gi)=>(
              <div key={gi} style={{marginBottom:24}}>
                <div style={{fontSize:14,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:8,color:"var(--bark)"}}>{cg.g}{cg.req&&<span style={{background:"rgba(239,68,68,.1)",color:"var(--red)",border:"1px solid rgba(239,68,68,.2)",padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase"}}>Required</span>}</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {cg.opts.map((opt,oi)=>{
                  const sel=selOpts[gi]?.find(o=>o.n===opt.n);
                  return(
                    <div key={oi} onClick={()=>setSelOpts(p=>{const c={...p};if(cg.req)c[gi]=[opt];else{const a=c[gi]||[];c[gi]=a.find(o=>o.n===opt.n)?a.filter(o=>o.n!==opt.n):[...a,opt]}return c})}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:12,background:sel?"var(--terra-g)":"#fff",cursor:"pointer",border:sel?"1px solid var(--terra)":"1px solid var(--sand)",transition:"all .2s cubic-bezier(.16,1,.3,1)"}}>
                      <div style={{width:20,height:20,borderRadius:cg.req?"50%":6,border:sel?"6px solid var(--terra)":"2px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",transition:"all .2s",flexShrink:0}}/>
                      <span style={{flex:1,fontSize:15,color:"var(--bark)",fontWeight:sel?600:400}}>{opt.n}</span>
                      {opt.p>0&&<span style={{fontSize:14,color:"var(--terra)",fontWeight:600}}>+${opt.p.toFixed(2)}</span>}
                    </div>
                  );
                })}
                </div>
              </div>
            ))}
            <div style={{marginTop:36,paddingTop:24,borderTop:"1px solid var(--sand)"}}>
              <Btn v="primary" s={{width:"100%",padding:"16px",fontSize:16}} onClick={confirmCust}>Add to Cart — ${(cust.price+Object.values(selOpts).flat().reduce((s,o)=>s+o.p,0)).toFixed(2)}</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESTAURANT DASHBOARD
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// CHART COMPONENTS
// ═══════════════════════════════════════════════════════════════════
function RevenueChart(){
  const data=[{day:"Mon",revenue:145},{day:"Tue",revenue:198},{day:"Wed",revenue:167},{day:"Thu",revenue:223},{day:"Fri",revenue:287},{day:"Sat",revenue:156},{day:"Sun",revenue:115}];
  const max=Math.max(...data.map(d=>d.revenue));
  const chartH=180;
  const barW=40;
  const gap=12;
  const totalW=(barW+gap)*data.length;
  const [hoverIdx,setHoverIdx]=useState(null);

  return(
    <div>
      <svg width="100%" height={chartH+40} viewBox={`0 0 ${totalW} ${chartH+40}`} style={{overflow:"visible"}}>
        {data.map((d,i)=>{
          const h=(d.revenue/max)*chartH;
          const x=i*(barW+gap);
          const isHover = hoverIdx===i;
          return(
            <g key={i} onMouseEnter={()=>setHoverIdx(i)} onMouseLeave={()=>setHoverIdx(null)} style={{cursor:"pointer",transition:"all .2s"}}>
              <rect x={x} y={chartH-h} width={barW} height={h} fill={isHover?"var(--terra)":"#8B7355"} rx="6" opacity={isHover?"1":"0.8"} style={{transition:"all .2s"}}/>
              <text x={x+barW/2} y={chartH+20} textAnchor="middle" fontSize="12" fill={isHover?"var(--bark)":"#78716c"} fontWeight="600" style={{transition:"all .2s"}}>{d.day}</text>
              <text x={x+barW/2} y={chartH-h-8} textAnchor="middle" fontSize="13" fill={isHover?"var(--bark)":"transparent"} fontWeight="700" style={{transition:"all .2s"}}>${d.revenue}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function OrdersChart(){
  const data=[{day:"Mon",orders:12},{day:"Tue",orders:18},{day:"Wed",orders:15},{day:"Thu",orders:21},{day:"Fri",orders:26},{day:"Sat",orders:14},{day:"Sun",orders:9}];
  const max=Math.max(...data.map(d=>d.orders));
  const chartH=180;
  const barW=40;
  const gap=12;
  const totalW=(barW+gap)*data.length;
  const [hoverIdx,setHoverIdx]=useState(null);

  return(
    <div>
      <svg width="100%" height={chartH+40} viewBox={`0 0 ${totalW} ${chartH+40}`} style={{overflow:"visible"}}>
        {data.map((d,i)=>{
          const h=(d.orders/max)*chartH;
          const x=i*(barW+gap);
          const isHover = hoverIdx===i;
          return(
            <g key={i} onMouseEnter={()=>setHoverIdx(i)} onMouseLeave={()=>setHoverIdx(null)} style={{cursor:"pointer",transition:"all .2s"}}>
              <rect x={x} y={chartH-h} width={barW} height={h} fill={isHover?"var(--olive)":"#6B7F5F"} rx="6" opacity={isHover?"1":"0.8"} style={{transition:"all .2s"}}/>
              <text x={x+barW/2} y={chartH+20} textAnchor="middle" fontSize="12" fill={isHover?"var(--bark)":"#78716c"} fontWeight="600" style={{transition:"all .2s"}}>{d.day}</text>
              <text x={x+barW/2} y={chartH-h-8} textAnchor="middle" fontSize="13" fill={isHover?"var(--bark)":"transparent"} fontWeight="700" style={{transition:"all .2s"}}>{d.orders}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function PopularItemsChart(){
  const items=[
    {name:"Harvest Buddha Bowl",orders:45},
    {name:"Grilled Halloumi Salad",orders:38},
    {name:"Herb-Roasted Chicken",orders:32},
    {name:"Kale Caesar",orders:28},
    {name:"Golden Turmeric Latte",orders:24}
  ];
  const max=Math.max(...items.map(i=>i.orders));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {items.map((item,idx)=>{
        const pct=(item.orders/max)*100;
        return(
          <div key={idx} style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{minWidth:200,fontSize:14,fontWeight:600,color:"var(--bark)"}}>{item.name}</div>
            <div style={{flex:1,height:32,background:"var(--bg2)",borderRadius:8,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${pct}%`,background:"linear-gradient(90deg, #8B7355, #6B7F5F)",borderRadius:8,transition:"width .6s cubic-bezier(.16,1,.3,1)"}}/>
              <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:13,fontWeight:700,color:"var(--bark)"}}>{item.orders} orders</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MENU EDIT MODAL
// ═══════════════════════════════════════════════════════════════════
function MenuEditModal({item,onClose,onSave,currentImage}){
  const [form,setForm]=useState({
    name:item.name,
    desc:item.desc,
    price:item.price,
    cal:item.cal
  });

  const handleSave=()=>{
    onSave(item.id,form);
    onClose();
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div className="glass-card" style={{width:560,maxHeight:"90vh",overflow:"auto",background:"#fff",borderRadius:20,boxShadow:"var(--sh4)",animation:"slideUp .3s cubic-bezier(.16,1,.3,1)"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{padding:"28px 32px",borderBottom:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:26,color:"var(--bark)"}}>Edit Menu Item</h2>
          <button onClick={onClose} style={{background:"var(--bg2)",border:"none",fontSize:24,cursor:"pointer",color:"var(--clay2)",padding:"4px 12px",borderRadius:100,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>×</button>
        </div>

        {/* Form */}
        <div style={{padding:32}}>
          {/* Current Image Preview */}
          {currentImage&&(
            <div style={{marginBottom:24}}>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Current Photo</label>
              <img src={currentImage} alt={item.name} style={{width:"100%",height:200,objectFit:"cover",borderRadius:12,border:"1px solid var(--sand)"}}/>
            </div>
          )}

          {/* Item Name */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Item Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e=>setForm({...form,name:e.target.value})}
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
          </div>

          {/* Description */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Description</label>
            <textarea
              value={form.desc}
              onChange={e=>setForm({...form,desc:e.target.value})}
              rows={3}
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:14,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s",resize:"vertical"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
          </div>

          {/* Price and Calories */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
            <div>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={e=>setForm({...form,price:parseFloat(e.target.value)})}
                style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
                onFocus={e=>e.target.style.borderColor="var(--terra)"}
                onBlur={e=>e.target.style.borderColor="var(--sand)"}
              />
            </div>
            <div>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Calories</label>
              <input
                type="number"
                value={form.cal}
                onChange={e=>setForm({...form,cal:parseInt(e.target.value)})}
                style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
                onFocus={e=>e.target.style.borderColor="var(--terra)"}
                onBlur={e=>e.target.style.borderColor="var(--sand)"}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
            <Btn v="ghost" onClick={onClose}>Cancel</Btn>
            <Btn v="primary" onClick={handleSave}>Save Changes</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADD MENU ITEM MODAL
// ═══════════════════════════════════════════════════════════════════
function AddMenuItemModal({onClose,onSave,existingCategories}){
  const [form,setForm]=useState({
    name:"",
    desc:"",
    price:"",
    cal:"",
    category:"",
    newCategory:"",
    flags:[],
    pop:false
  });

  const handleSave=()=>{
    if(!form.name||!form.desc||!form.price||!form.cal||(!form.category&&!form.newCategory)){
      alert("Please fill in all required fields");
      return;
    }

    const category=form.newCategory||form.category;
    const newItem={
      id:`m${Date.now()}`, // Generate unique ID
      name:form.name,
      desc:form.desc,
      price:parseFloat(form.price),
      cal:parseInt(form.cal),
      flags:form.flags,
      pop:form.pop,
      cust:[] // Start with no customizations
    };

    onSave(category,newItem);
    onClose();
  };

  const toggleFlag=(flag)=>{
    setForm({
      ...form,
      flags:form.flags.includes(flag)
        ?form.flags.filter(f=>f!==flag)
        :[...form.flags,flag]
    });
  };

  const availableFlags=[
    {code:"V",label:"Vegan",emoji:"🌱"},
    {code:"GF",label:"Gluten-Free",emoji:"🌾"},
    {code:"DF",label:"Dairy-Free",emoji:"🥛"},
    {code:"NF",label:"Nut-Free",emoji:"🥜"},
    {code:"S",label:"Spicy",emoji:"🌶️"}
  ];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div className="glass-card" style={{width:640,maxHeight:"90vh",overflow:"auto",background:"#fff",borderRadius:20,boxShadow:"var(--sh4)",animation:"slideUp .3s cubic-bezier(.16,1,.3,1)"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{padding:"28px 32px",borderBottom:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2 style={{fontFamily:"var(--serif)",fontSize:26,color:"var(--bark)",marginBottom:4}}>Add Menu Item</h2>
            <p style={{fontSize:14,color:"var(--clay2)"}}>Create a new item for your menu</p>
          </div>
          <button onClick={onClose} style={{background:"var(--bg2)",border:"none",fontSize:24,cursor:"pointer",color:"var(--clay2)",padding:"4px 12px",borderRadius:100,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>×</button>
        </div>

        {/* Form */}
        <div style={{padding:32}}>
          {/* Category Selection */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Category *</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <select
                  value={form.category}
                  onChange={e=>{setForm({...form,category:e.target.value,newCategory:""});}}
                  disabled={!!form.newCategory}
                  style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:form.newCategory?"var(--clay)":"var(--bark)",background:form.newCategory?"var(--bg2)":"#fff",outline:"none",transition:"border .2s",cursor:form.newCategory?"not-allowed":"pointer"}}
                  onFocus={e=>!form.newCategory&&(e.target.style.borderColor="var(--terra)")}
                  onBlur={e=>e.target.style.borderColor="var(--sand)"}
                >
                  <option value="">Select existing...</option>
                  {existingCategories.map(cat=><option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div style={{fontSize:11,color:"var(--clay2)",marginTop:4}}>Choose existing category</div>
              </div>
              <div>
                <input
                  type="text"
                  value={form.newCategory}
                  onChange={e=>setForm({...form,newCategory:e.target.value,category:""})}
                  placeholder="Or create new..."
                  disabled={!!form.category}
                  style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:form.category?"var(--clay)":"var(--bark)",background:form.category?"var(--bg2)":"#fff",outline:"none",transition:"border .2s"}}
                  onFocus={e=>!form.category&&(e.target.style.borderColor="var(--terra)")}
                  onBlur={e=>e.target.style.borderColor="var(--sand)"}
                />
                <div style={{fontSize:11,color:"var(--clay2)",marginTop:4}}>Or type new category</div>
              </div>
            </div>
          </div>

          {/* Item Name */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Item Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e=>setForm({...form,name:e.target.value})}
              placeholder="e.g., Harvest Buddha Bowl"
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
          </div>

          {/* Description */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Description *</label>
            <textarea
              value={form.desc}
              onChange={e=>setForm({...form,desc:e.target.value})}
              placeholder="Describe ingredients and preparation..."
              rows={3}
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:14,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s",resize:"vertical"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
          </div>

          {/* Price and Calories */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <div>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={e=>setForm({...form,price:e.target.value})}
                placeholder="0.00"
                style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
                onFocus={e=>e.target.style.borderColor="var(--terra)"}
                onBlur={e=>e.target.style.borderColor="var(--sand)"}
              />
            </div>
            <div>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Calories *</label>
              <input
                type="number"
                value={form.cal}
                onChange={e=>setForm({...form,cal:e.target.value})}
                placeholder="0"
                style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
                onFocus={e=>e.target.style.borderColor="var(--terra)"}
                onBlur={e=>e.target.style.borderColor="var(--sand)"}
              />
            </div>
          </div>

          {/* Dietary Flags */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:10}}>Dietary Flags</label>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {availableFlags.map(flag=>(
                <button
                  key={flag.code}
                  onClick={()=>toggleFlag(flag.code)}
                  style={{padding:"10px 16px",border:form.flags.includes(flag.code)?"2px solid var(--olive)":"1px solid var(--sand)",background:form.flags.includes(flag.code)?"var(--olive-bg)":"#fff",color:form.flags.includes(flag.code)?"var(--olive)":"var(--clay2)",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s",display:"flex",alignItems:"center",gap:6}}
                >
                  <span>{flag.emoji}</span>
                  <span>{flag.label}</span>
                  {form.flags.includes(flag.code)&&<span style={{marginLeft:4}}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Item Toggle */}
          <div style={{marginBottom:24,padding:16,background:"var(--bg2)",borderRadius:12,border:"1px solid var(--sand)"}}>
            <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <input
                type="checkbox"
                checked={form.pop}
                onChange={e=>setForm({...form,pop:e.target.checked})}
                style={{width:20,height:20,cursor:"pointer",accentColor:"var(--terra)"}}
              />
              <div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:2}}>⭐ Mark as Popular</div>
                <div style={{fontSize:12,color:"var(--clay2)"}}>This item will be highlighted with a "Popular" badge</div>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
            <Btn v="ghost" onClick={onClose}>Cancel</Btn>
            <Btn v="primary" onClick={handleSave}>Add Menu Item</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESTAURANT INFO EDIT MODAL
// ═══════════════════════════════════════════════════════════════════
function RestaurantInfoEditModal({restaurant,onClose,onSave}){
  const [form,setForm]=useState({
    name:restaurant.name,
    cuisine:restaurant.cuisine,
    time:restaurant.time,
    img:restaurant.img,
    tags:restaurant.tags.join(", "),
    maxDaily:restaurant.maxDaily
  });

  const handleSave=()=>{
    const updatedData={
      ...form,
      tags:form.tags.split(",").map(t=>t.trim()).filter(t=>t.length>0)
    };
    onSave(updatedData);
    onClose();
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div className="glass-card" style={{width:600,maxHeight:"90vh",overflow:"auto",background:"#fff",borderRadius:20,boxShadow:"var(--sh4)",animation:"slideUp .3s cubic-bezier(.16,1,.3,1)"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{padding:"28px 32px",borderBottom:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:26,color:"var(--bark)"}}>Edit Restaurant Info</h2>
          <button onClick={onClose} style={{background:"var(--bg2)",border:"none",fontSize:24,cursor:"pointer",color:"var(--clay2)",padding:"4px 12px",borderRadius:100,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>×</button>
        </div>

        {/* Form */}
        <div style={{padding:32}}>
          {/* Restaurant Name */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Restaurant Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e=>setForm({...form,name:e.target.value})}
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
          </div>

          {/* Cuisine Type */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Cuisine Type</label>
            <input
              type="text"
              value={form.cuisine}
              onChange={e=>setForm({...form,cuisine:e.target.value})}
              placeholder="e.g., Farm-to-Table, Italian, Mexican"
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
          </div>

          {/* Delivery Time */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Estimated Delivery Time</label>
            <input
              type="text"
              value={form.time}
              onChange={e=>setForm({...form,time:e.target.value})}
              placeholder="e.g., 25–35"
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
            <div style={{fontSize:12,color:"var(--clay2)",marginTop:6}}>Format: XX–YY (minutes)</div>
          </div>

          {/* Image URL */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Image URL</label>
            <input
              type="text"
              value={form.img}
              onChange={e=>setForm({...form,img:e.target.value})}
              placeholder="https://example.com/image.jpg"
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
            {form.img&&(
              <div style={{marginTop:12}}>
                <div style={{fontSize:12,color:"var(--clay2)",marginBottom:6}}>Preview:</div>
                <img src={form.img} alt="Preview" style={{width:"100%",height:160,objectFit:"cover",borderRadius:12,border:"1px solid var(--sand)"}} onError={e=>e.currentTarget.style.display="none"}/>
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={e=>setForm({...form,tags:e.target.value})}
              placeholder="e.g., Organic, Seasonal, Vegan Options"
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
            <div style={{fontSize:12,color:"var(--clay2)",marginTop:6}}>Separate tags with commas</div>
          </div>

          {/* Max Daily Capacity */}
          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Max Daily Capacity</label>
            <input
              type="number"
              value={form.maxDaily}
              onChange={e=>setForm({...form,maxDaily:parseInt(e.target.value)})}
              min="1"
              style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="var(--terra)"}
              onBlur={e=>e.target.style.borderColor="var(--sand)"}
            />
            <div style={{fontSize:12,color:"var(--clay2)",marginTop:6}}>Maximum number of orders per day</div>
          </div>

          {/* Action Buttons */}
          <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
            <Btn v="ghost" onClick={onClose}>Cancel</Btn>
            <Btn v="primary" onClick={handleSave}>Save Changes</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESTAURANT DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function RestaurantDashboard(){
  const [activeTab,setActiveTab]=useState("overview");
  const [searchQuery,setSearchQuery]=useState("");
  const [statusFilter,setStatusFilter]=useState("all");
  const [menuImages,setMenuImages]=useState({});
  const [editingItem,setEditingItem]=useState(null);
  const [menuItemEdits,setMenuItemEdits]=useState({});
  const [itemAvailability,setItemAvailability]=useState({});
  const [showRestaurantEdit,setShowRestaurantEdit]=useState(false);
  const [restaurantEdits,setRestaurantEdits]=useState({});
  const [showAddMenuItem,setShowAddMenuItem]=useState(false);
  const [newMenuItems,setNewMenuItems]=useState([]);
  // Mock restaurant - in real app, this would be from auth context
  const baseRestaurant=RESTAURANTS[0]; // "The Green Table"
  const restaurant=restaurantEdits.name?{...baseRestaurant,...restaurantEdits}:baseRestaurant;
  const baseMenu=MENU[restaurant.id]||[];

  // Merge base menu with new items
  const restaurantMenu=(()=>{
    const menu=[...baseMenu];
    newMenuItems.forEach(({category,item})=>{
      const catIndex=menu.findIndex(c=>c.cat===category);
      if(catIndex>=0){
        menu[catIndex]={...menu[catIndex],items:[...menu[catIndex].items,item]};
      }else{
        menu.push({cat:category,items:[item]});
      }
    });
    return menu;
  })();

  const handleSaveMenuItem=(itemId,updates)=>{
    setMenuItemEdits(prev=>({...prev,[itemId]:updates}));
  };

  const getMenuItem=(item)=>{
    return menuItemEdits[item.id]?{...item,...menuItemEdits[item.id]}:item;
  };

  const handleSaveRestaurantInfo=(updates)=>{
    setRestaurantEdits(updates);
  };

  const handleAddMenuItem=(category,item)=>{
    setNewMenuItems(prev=>[...prev,{category,item}]);
  };

  // Mock today's orders for this restaurant - using state to allow updates
  const [todayOrders,setTodayOrders]=useState([
    {id:"LCH-1234",customer:"John Doe",items:[{name:"Harvest Buddha Bowl",qty:1},{name:"Cold Brew Tonic",qty:1}],total:23.00,status:"delivered",time:"10:45 AM",building:"One Market Plaza",address:"123 Main St, Apt 5B"},
    {id:"LCH-1298",customer:"Sarah Chen",items:[{name:"Grilled Halloumi Salad",qty:1}],total:14.50,status:"delivered",time:"11:20 AM",building:"Salesforce Tower",address:"415 Mission St, Floor 20"},
    {id:"LCH-1312",customer:"Mike Johnson",items:[{name:"Herb-Roasted Chicken",qty:1},{name:"Golden Turmeric Latte",qty:1}],total:25.00,status:"in_transit",time:"11:35 AM",building:"555 California St",address:"555 California St, Suite 100"},
    {id:"LCH-1345",customer:"Emily Wong",items:[{name:"Harvest Buddha Bowl",qty:2}],total:33.00,status:"preparing",time:"11:48 AM",building:"One Market Plaza",address:"123 Main St, Apt 12A"},
    {id:"LCH-1356",customer:"David Lee",items:[{name:"Kale Caesar",qty:1},{name:"Cold Brew Tonic",qty:1}],total:19.50,status:"placed",time:"11:52 AM",building:"Embarcadero Center 4",address:"4 Embarcadero Center, Suite 2400"},
  ]);

  const updateOrderStatus=(orderId,newStatus)=>{
    setTodayOrders(prev=>prev.map(o=>o.id===orderId?{...o,status:newStatus}:o));
  };

  const stats={
    todayOrders:todayOrders.length,
    todayRevenue:todayOrders.reduce((s,o)=>s+o.total,0),
    avgOrderValue:todayOrders.reduce((s,o)=>s+o.total,0)/todayOrders.length,
    capacity:restaurant.maxDaily,
    rating:restaurant.rating,
    completionRate:96
  };

  // Popular items from menu
  const popularItems=restaurantMenu.flatMap(cat=>cat.items).slice(0,5);

  const StatCard=({label,value,sublabel,icon,color="var(--terra)"})=>(
    <div className="glass-card" style={{padding:24,borderRadius:16,display:"flex",alignItems:"center",gap:16,border:"1px solid var(--sand)"}}>
      <div style={{width:56,height:56,borderRadius:12,background:color==="var(--terra)"?"var(--terra-g)":color==="var(--olive)"?"var(--olive-bg)":"var(--blue-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{icon}</div>
      <div>
        <div style={{fontSize:28,fontWeight:700,fontFamily:"var(--serif)",color:"var(--bark)",marginBottom:4}}>{value}</div>
        <div style={{fontSize:13,color:"var(--clay2)",fontWeight:500}}>{label}</div>
        {sublabel&&<div style={{fontSize:11,color:"var(--clay)",marginTop:2}}>{sublabel}</div>}
      </div>
    </div>
  );

  const OrderCard=({order,onUpdateStatus})=>{
    const statusInfo={
      placed:{color:"var(--blue)",icon:"📋",label:"Just Placed",nextAction:{status:"preparing",label:"Start Preparing",icon:"👨‍🍳"}},
      batched:{color:"var(--honey)",icon:"📦",label:"Batched",nextAction:{status:"preparing",label:"Start Preparing",icon:"👨‍🍳"}},
      preparing:{color:"var(--terra)",icon:"👨‍🍳",label:"Preparing Now",nextAction:{status:"in_transit",label:"Mark In Transit",icon:"🚴"}},
      in_transit:{color:"var(--terra2)",icon:"🚴",label:"Out for Delivery",nextAction:{status:"delivered",label:"Mark Delivered",icon:"✓"}},
      delivered:{color:"var(--olive)",icon:"✓",label:"Delivered",nextAction:null}
    };
    const info=statusInfo[order.status];

    return(
      <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--sand)",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:14}}>
          <div>
            <div style={{fontWeight:700,fontFamily:"var(--mono)",fontSize:15,color:"var(--bark)",marginBottom:4}}>{order.id}</div>
            <div style={{fontSize:13,color:"var(--clay2)"}}>{order.customer}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:18,fontWeight:700,color:"var(--olive)",marginBottom:4}}>${order.total.toFixed(2)}</div>
            <div style={{fontSize:12,color:"var(--clay2)"}}>{order.time}</div>
          </div>
        </div>
        <div style={{marginBottom:14,padding:12,background:"var(--bg2)",borderRadius:8}}>
          {order.items.map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:14,color:"var(--bark)",marginBottom:i<order.items.length-1?6:0}}>
              <span>{item.qty}x {item.name}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
            <span style={{fontSize:18}}>{info.icon}</span>
            <Badge v="def" s={{background:info.color,color:"#fff"}}>{info.label}</Badge>
          </div>
          <div style={{fontSize:12,color:"var(--clay2)",flex:1,textAlign:"right"}}>📍 {order.address}</div>
          {info.nextAction&&onUpdateStatus&&(
            <button
              onClick={()=>onUpdateStatus(order.id,info.nextAction.status)}
              style={{padding:"8px 16px",background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s",display:"flex",alignItems:"center",gap:6}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <span>{info.nextAction.icon}</span>{info.nextAction.label}
            </button>
          )}
        </div>
      </div>
    );
  };

  return(
    <div style={{maxWidth:1400,margin:"0 auto",padding:"40px 24px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:32}}>
        <img src={restaurant.img} alt={restaurant.name} style={{width:80,height:80,borderRadius:16,objectFit:"cover",boxShadow:"var(--sh2)"}}/>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:"var(--serif)",fontSize:36,fontWeight:700,color:"var(--bark)",marginBottom:4}}>{restaurant.name}</h1>
          <div style={{display:"flex",alignItems:"center",gap:12,fontSize:15,color:"var(--clay2)"}}>
            <span>{restaurant.cuisine}</span>
            <span>•</span>
            <span>⭐ {restaurant.rating}</span>
            <span>•</span>
            <Badge v={restaurant.featured?"green":"def"}>{restaurant.featured?"Featured":"Active"}</Badge>
          </div>
        </div>
        {/* Notification Bell */}
        {(()=>{
          const newOrders=todayOrders.filter(o=>o.status==="placed"||o.status==="preparing");
          const hasNew=newOrders.length>0;
          return(
            <div style={{position:"relative"}}>
              <button
                style={{width:48,height:48,borderRadius:12,background:hasNew?"var(--terra-g)":"#fff",border:hasNew?"1px solid var(--terra)":"1px solid var(--sand)",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",marginRight:12}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                onClick={()=>setActiveTab("orders")}
              >
                🔔
                {hasNew&&(
                  <div style={{position:"absolute",top:-4,right:-4,width:22,height:22,borderRadius:"50%",background:"var(--terra)",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff",boxShadow:"var(--sh2)"}}>{newOrders.length}</div>
                )}
              </button>
            </div>
          );
        })()}
        <Btn v="primary" onClick={()=>setShowRestaurantEdit(true)}>Edit Restaurant Info</Btn>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:32,borderBottom:"1px solid var(--sand)",paddingBottom:2}}>
        {[{k:"overview",l:"Overview",i:"📊"},{k:"orders",l:"Today's Orders",i:"📦"},{k:"menu",l:"Menu",i:"🍽️"},{k:"analytics",l:"Analytics",i:"📈"}].map(t=>(
          <button key={t.k} onClick={()=>setActiveTab(t.k)}
            style={{padding:"10px 20px",background:activeTab===t.k?"#fff":"transparent",border:"none",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:14,fontWeight:600,color:activeTab===t.k?"var(--bark)":"var(--clay2)",fontFamily:"var(--sans)",transition:"all .2s",boxShadow:activeTab===t.k?"0 -2px 8px rgba(0,0,0,.04)":"none",borderBottom:activeTab===t.k?"2px solid var(--terra)":"none"}}
            onMouseEnter={e=>e.currentTarget.style.color="var(--bark)"} onMouseLeave={e=>e.currentTarget.style.color=activeTab===t.k?"var(--bark)":"var(--clay2)"}>
            <span style={{marginRight:8}}>{t.i}</span>{t.l}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab==="overview"&&(
        <div>
          {/* Stats Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:32}}>
            <StatCard label="Today's Orders" value={stats.todayOrders} sublabel={`of ${stats.capacity} max capacity`} icon="📦" color="var(--terra)"/>
            <StatCard label="Revenue Today" value={`$${stats.todayRevenue.toFixed(2)}`} icon="💰" color="var(--olive)"/>
            <StatCard label="Avg Order" value={`$${stats.avgOrderValue.toFixed(2)}`} icon="📊" color="var(--blue)"/>
          </div>

          {/* Revenue Goal Tracker */}
          {(()=>{
            const dailyGoal=500;
            const progress=(stats.todayRevenue/dailyGoal)*100;
            const remaining=Math.max(0,dailyGoal-stats.todayRevenue);
            const isOnTrack=progress>=50;
            return(
              <div className="glass-card" style={{padding:28,borderRadius:16,border:"1px solid var(--sand)",marginBottom:32,background:"linear-gradient(135deg, #fff 0%, #fafaf9 100%)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:20}}>
                  <div>
                    <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:6}}>💎 Daily Revenue Goal</h3>
                    <p style={{fontSize:14,color:"var(--clay2)"}}>Track your progress towards today's target</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,color:"var(--clay2)",marginBottom:4}}>Target: ${dailyGoal}</div>
                    <div style={{fontSize:18,fontWeight:700,color:remaining===0?"var(--olive)":"var(--terra2)"}}>${remaining.toFixed(2)} to go</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{marginBottom:16}}>
                  <div style={{height:48,background:"var(--bg2)",borderRadius:12,position:"relative",overflow:"hidden",border:"1px solid var(--sand)"}}>
                    <div
                      style={{position:"absolute",left:0,top:0,bottom:0,width:`${Math.min(100,progress)}%`,background:isOnTrack?"linear-gradient(90deg, #6B7F5F, #8B7355)":"linear-gradient(90deg, #8B7355, #C4A574)",borderRadius:12,transition:"width 1s cubic-bezier(.16,1,.3,1)",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:16}}
                    >
                      {progress>=20&&(
                        <span style={{fontSize:16,fontWeight:700,color:"#fff",textShadow:"0 1px 2px rgba(0,0,0,.2)"}}>{progress.toFixed(0)}%</span>
                      )}
                    </div>
                    {progress<20&&(
                      <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:14,fontWeight:600,color:"var(--clay2)"}}>{progress.toFixed(0)}%</span>
                    )}
                  </div>
                </div>

                {/* Status Indicators */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
                  <div style={{padding:16,background:"#fff",borderRadius:10,border:"1px solid var(--sand)"}}>
                    <div style={{fontSize:12,color:"var(--clay2)",marginBottom:4}}>Current</div>
                    <div style={{fontSize:20,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>${stats.todayRevenue.toFixed(2)}</div>
                  </div>
                  <div style={{padding:16,background:"#fff",borderRadius:10,border:"1px solid var(--sand)"}}>
                    <div style={{fontSize:12,color:"var(--clay2)",marginBottom:4}}>Progress</div>
                    <div style={{fontSize:20,fontWeight:700,color:isOnTrack?"var(--olive)":"var(--terra)",fontFamily:"var(--serif)"}}>{progress.toFixed(1)}%</div>
                  </div>
                  <div style={{padding:16,background:"#fff",borderRadius:10,border:"1px solid var(--sand)"}}>
                    <div style={{fontSize:12,color:"var(--clay2)",marginBottom:4}}>Status</div>
                    <div style={{fontSize:14,fontWeight:700,color:isOnTrack?"var(--olive)":"var(--terra2)"}}>
                      {progress>=100?"🎉 Goal Met!":isOnTrack?"✨ On Track":"⚡ Push Harder"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Recent Activity & Orders Grid */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24,marginBottom:32}}>
            {/* Recent Orders */}
            <div>
              <h2 style={{fontFamily:"var(--serif)",fontSize:22,marginBottom:20,color:"var(--bark)"}}>Recent Orders</h2>
              {todayOrders.slice(0,3).map(order=><OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus}/>)}
              {todayOrders.length>3&&(
                <div style={{textAlign:"center",marginTop:16}}>
                  <Btn v="ghost" onClick={()=>setActiveTab("orders")}>View All {todayOrders.length} Orders →</Btn>
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)",height:"fit-content"}}>
              <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--bark)",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                <span>⚡</span> Recent Activity
              </h3>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {todayOrders.slice(0,5).map((order,i)=>{
                  const statusEmoji={placed:"📋",batched:"📦",preparing:"👨‍🍳",in_transit:"🚴",delivered:"✅"}[order.status];
                  const statusText={placed:"New order received",batched:"Order batched",preparing:"Started preparing",in_transit:"Out for delivery",delivered:"Delivered"}[order.status];
                  return(
                    <div key={i} style={{display:"flex",gap:12,padding:12,background:"var(--bg2)",borderRadius:10,alignItems:"start"}}>
                      <div style={{fontSize:20,flexShrink:0}}>{statusEmoji}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{statusText}</div>
                        <div style={{fontSize:12,color:"var(--clay2)",marginBottom:2}}>{order.customer}</div>
                        <div style={{fontSize:11,color:"var(--clay)",display:"flex",alignItems:"center",gap:6}}>
                          <span>{order.time}</span>
                          <span>•</span>
                          <span style={{fontWeight:600,color:"var(--olive)"}}>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {todayOrders.length>5&&(
                <div style={{textAlign:"center",marginTop:16,paddingTop:16,borderTop:"1px solid var(--sand)"}}>
                  <button onClick={()=>setActiveTab("orders")} style={{fontSize:13,color:"var(--terra)",background:"transparent",border:"none",cursor:"pointer",fontWeight:600}}>View All Activity →</button>
                </div>
              )}
            </div>
          </div>

          {/* Popular Items */}
          <div className="glass-card" style={{padding:28,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:22,marginBottom:20,color:"var(--bark)"}}>Your Menu Highlights</h2>
            <div style={{display:"grid",gap:16}}>
              {popularItems.map(item=>(
                <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:16,background:"#fff",borderRadius:10,border:"1px solid var(--sand)"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,color:"var(--bark)",marginBottom:4}}>{item.name}</div>
                    <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>{item.desc}</div>
                    <div style={{display:"flex",gap:6}}>
                      {item.flags?.map(f=><Flag key={f} f={f}/>)}
                      {item.pop&&<Badge v="honey">Popular</Badge>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",marginLeft:20}}>
                    <div style={{fontSize:20,fontWeight:700,color:"var(--olive)",marginBottom:4}}>${item.price.toFixed(2)}</div>
                    <div style={{fontSize:12,color:"var(--clay2)"}}>{item.cal} cal</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab==="orders"&&(
        <div>
          <div style={{marginBottom:24}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",marginBottom:8}}>Today's Orders ({todayOrders.length})</h2>
            <p style={{color:"var(--clay2)",fontSize:14}}>Manage and track all orders for your restaurant</p>
          </div>

          {/* Search and Filters */}
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--sand)",marginBottom:24}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              {/* Search Input */}
              <div style={{flex:1,position:"relative"}}>
                <input
                  type="text"
                  placeholder="🔍 Search by order ID, customer, or building..."
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                  style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:14,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
                  onFocus={e=>e.target.style.borderColor="var(--terra)"}
                  onBlur={e=>e.target.style.borderColor="var(--sand)"}
                />
              </div>

              {/* Status Filter Buttons */}
              <div style={{display:"flex",gap:8}}>
                {[
                  {k:"all",l:"All",i:"📋"},
                  {k:"placed",l:"Placed",i:"📋"},
                  {k:"preparing",l:"Preparing",i:"👨‍🍳"},
                  {k:"in_transit",l:"In Transit",i:"🚴"},
                  {k:"delivered",l:"Delivered",i:"✓"}
                ].map(f=>(
                  <button
                    key={f.k}
                    onClick={()=>setStatusFilter(f.k)}
                    style={{padding:"10px 16px",border:statusFilter===f.k?"1px solid var(--terra)":"1px solid var(--sand)",background:statusFilter===f.k?"var(--terra-g)":"#fff",color:statusFilter===f.k?"var(--terra2)":"var(--clay2)",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s",whiteSpace:"nowrap"}}
                  >
                    <span style={{marginRight:6}}>{f.i}</span>{f.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery||statusFilter!=="all")&&(
              <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--sand)",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:13,color:"var(--clay2)",fontWeight:600}}>Active filters:</span>
                {searchQuery&&(
                  <Badge v="def" s={{background:"var(--terra)",color:"#fff"}}>
                    Search: "{searchQuery}"
                    <button onClick={()=>setSearchQuery("")} style={{marginLeft:8,background:"transparent",border:"none",color:"#fff",cursor:"pointer",fontSize:16}}>×</button>
                  </Badge>
                )}
                {statusFilter!=="all"&&(
                  <Badge v="def" s={{background:"var(--olive)",color:"#fff"}}>
                    Status: {statusFilter.replace("_"," ")}
                    <button onClick={()=>setStatusFilter("all")} style={{marginLeft:8,background:"transparent",border:"none",color:"#fff",cursor:"pointer",fontSize:16}}>×</button>
                  </Badge>
                )}
                <button onClick={()=>{setSearchQuery("");setStatusFilter("all");}} style={{marginLeft:"auto",fontSize:13,color:"var(--clay2)",background:"transparent",border:"none",cursor:"pointer",textDecoration:"underline"}}>Clear all</button>
              </div>
            )}
          </div>

          {/* Filtered Orders */}
          {(() => {
            const filtered = todayOrders.filter(order => {
              const matchesSearch = !searchQuery ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.building.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesStatus = statusFilter === "all" || order.status === statusFilter;
              return matchesSearch && matchesStatus;
            });

            if (filtered.length === 0) {
              return (
                <div className="glass-card" style={{padding:60,borderRadius:12,border:"1px solid var(--sand)",textAlign:"center"}}>
                  <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>🔍</div>
                  <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:8}}>No orders found</h3>
                  <p style={{color:"var(--clay2)",fontSize:14}}>Try adjusting your search or filters</p>
                </div>
              );
            }

            return (
              <>
                <div style={{marginBottom:12,fontSize:14,color:"var(--clay2)"}}>
                  Showing <strong style={{color:"var(--bark)"}}>{filtered.length}</strong> of <strong style={{color:"var(--bark)"}}>{todayOrders.length}</strong> orders
                </div>
                {filtered.map(order=><OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus}/>)}
              </>
            );
          })()}
        </div>
      )}

      {/* Menu Tab */}
      {activeTab==="menu"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)"}}>Your Menu</h2>
            <Btn v="primary" onClick={()=>setShowAddMenuItem(true)}>+ Add Menu Item</Btn>
          </div>
          {restaurantMenu.map(category=>(
            <div key={category.cat} style={{marginBottom:32}}>
              <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:16,paddingBottom:8,borderBottom:"2px solid var(--sand)"}}>{category.cat}</h3>
              <div style={{display:"grid",gap:16}}>
                {category.items.map(item=>{
                  const displayItem=getMenuItem(item);
                  const isSoldOut=itemAvailability[item.id]===false;
                  return(
                  <div key={item.id} className="glass-card" style={{display:"flex",gap:20,padding:20,borderRadius:12,border:"1px solid var(--sand)",opacity:isSoldOut?0.6:1,position:"relative"}}>
                    {isSoldOut&&(
                      <div style={{position:"absolute",top:12,right:12,background:"var(--terra)",color:"#fff",padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:700,zIndex:1}}>SOLD OUT</div>
                    )}

                    {/* Image Upload Area */}
                    <div style={{position:"relative",flexShrink:0}}>
                      {menuImages[item.id] ? (
                        <div style={{position:"relative"}}>
                          <img
                            src={menuImages[item.id]}
                            alt={displayItem.name}
                            style={{width:120,height:120,objectFit:"cover",borderRadius:12,border:"2px solid var(--sand)"}}
                          />
                          <button
                            onClick={()=>setMenuImages(prev=>({...prev,[item.id]:null}))}
                            style={{position:"absolute",top:-8,right:-8,width:28,height:28,borderRadius:"50%",background:"var(--terra)",color:"#fff",border:"2px solid #fff",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--sh2)"}}
                          >×</button>
                        </div>
                      ) : (
                        <label style={{width:120,height:120,borderRadius:12,border:"2px dashed var(--sand)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"var(--bg2)",transition:"all .2s"}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--terra)"}
                          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--sand)"}>
                          <input
                            type="file"
                            accept="image/*"
                            style={{display:"none"}}
                            onChange={e=>{
                              const file=e.target.files?.[0];
                              if(file){
                                const reader=new FileReader();
                                reader.onload=()=>setMenuImages(prev=>({...prev,[item.id]:reader.result}));
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <span style={{fontSize:32,marginBottom:4,opacity:0.5}}>📸</span>
                          <span style={{fontSize:11,color:"var(--clay2)",textAlign:"center",fontWeight:600}}>Upload<br/>Photo</span>
                        </label>
                      )}
                    </div>

                    {/* Item Details */}
                    <div style={{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                          <div style={{fontWeight:600,fontSize:16,color:"var(--bark)"}}>{displayItem.name}</div>
                          {item.pop&&<Badge v="honey">Popular</Badge>}
                        </div>
                        <div style={{fontSize:14,color:"var(--clay2)",marginBottom:10,lineHeight:1.5}}>{displayItem.desc}</div>
                        <div style={{display:"flex",gap:6}}>
                          {item.flags?.map(f=><Flag key={f} f={f}/>)}
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginLeft:20}}>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:22,fontWeight:700,color:"var(--olive)",marginBottom:2}}>${displayItem.price.toFixed(2)}</div>
                          <div style={{fontSize:12,color:"var(--clay2)"}}>{displayItem.cal} cal</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          <Btn v="ghost" onClick={()=>setEditingItem(item.id)}>Edit</Btn>
                          <button
                            onClick={()=>setItemAvailability(prev=>({...prev,[item.id]:!isSoldOut}))}
                            style={{padding:"6px 12px",background:isSoldOut?"var(--olive)":"var(--terra)",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,transition:"all .2s",whiteSpace:"nowrap"}}
                          >
                            {isSoldOut?"Mark Available":"Mark Sold Out"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab==="analytics"&&(
        <div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",marginBottom:24}}>Restaurant Analytics</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20,marginBottom:32}}>
            <StatCard label="Total Orders (All Time)" value={restaurant.orders} icon="📦" color="var(--terra)"/>
            <StatCard label="Daily Capacity" value={`${stats.todayOrders}/${restaurant.maxDaily}`} icon="📊" color="var(--blue)"/>
            <StatCard label="Average Rating" value={restaurant.rating} icon="⭐" color="var(--honey)"/>
            <StatCard label="Completion Rate" value={`${stats.completionRate}%`} icon="✓" color="var(--olive)"/>
          </div>

          {/* Charts Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20,marginBottom:32}}>
            {/* Revenue Trend Chart */}
            <div className="glass-card" style={{padding:28,borderRadius:16,border:"1px solid var(--sand)"}}>
              <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--bark)",marginBottom:20}}>📊 Revenue Trend (Last 7 Days)</h3>
              <RevenueChart/>
            </div>

            {/* Orders Pattern Chart */}
            <div className="glass-card" style={{padding:28,borderRadius:16,border:"1px solid var(--sand)"}}>
              <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--bark)",marginBottom:20}}>📦 Order Volume (Last 7 Days)</h3>
              <OrdersChart/>
            </div>
          </div>

          {/* Popular Items Chart */}
          <div className="glass-card" style={{padding:28,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--bark)",marginBottom:20}}>🔥 Top Menu Items (This Week)</h3>
            <PopularItemsChart/>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem&&(()=>{
        const allItems=restaurantMenu.flatMap(cat=>cat.items);
        const item=allItems.find(i=>i.id===editingItem);
        if(!item)return null;
        const currentItem=getMenuItem(item);
        return <MenuEditModal item={currentItem} onClose={()=>setEditingItem(null)} onSave={handleSaveMenuItem} currentImage={menuImages[item.id]}/>;
      })()}

      {/* Restaurant Info Edit Modal */}
      {showRestaurantEdit&&(
        <RestaurantInfoEditModal
          restaurant={restaurant}
          onClose={()=>setShowRestaurantEdit(false)}
          onSave={handleSaveRestaurantInfo}
        />
      )}

      {/* Add Menu Item Modal */}
      {showAddMenuItem&&(
        <AddMenuItemModal
          existingCategories={baseMenu.map(c=>c.cat)}
          onClose={()=>setShowAddMenuItem(false)}
          onSave={handleAddMenuItem}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════════════════════
function CartDrawer(){
  const {cart,addToCart,removeFromCart,showCart,setShowCart,placeOrder,user,setShowAuth}=useContext(AppCtx);
  const [checkingOut,setCheckingOut]=useState(false);
  const [win,setWin]=useState("12:00 PM");
  const [promoCode,setPromoCode]=useState("");
  const [promoApplied,setPromoApplied]=useState(null);
  const [promoError,setPromoError]=useState("");

  const handleApplyPromo=()=>{
    const code=promoCode.trim().toUpperCase();
    if(!code){setPromoError("Please enter a promo code");return;}
    const promo=PROMO_CODES[code];
    if(!promo){setPromoError("Invalid promo code");return;}
    setPromoApplied({code,...promo});
    setPromoError("");
  };

  const handleRemovePromo=()=>{
    setPromoApplied(null);
    setPromoCode("");
    setPromoError("");
  };

  const sub=cart.reduce((s,i)=>s+(i.price*i.qty),0);
  const hasFreeDelivery=user?.company;
  const baseFee=2.50;
  const fee=cart.length>0?(hasFreeDelivery?0:baseFee):0;
  const tax=sub*.085;

  let discount=0;
  if(promoApplied){
    if(promoApplied.type==="percent"){
      discount=sub*promoApplied.discount;
    }else if(promoApplied.type==="fixed"){
      if(promoApplied.code==="FREESHIP"){
        discount=hasFreeDelivery?0:baseFee;
      }else{
        discount=Math.min(promoApplied.discount,sub);
      }
    }
  }

  const tot=sub+fee+tax-discount;

  if(!showCart) return null;

  const handleCheckout=()=>{
    if(!user){setShowCart(false);setShowAuth(true);return;}
    setCheckingOut(true);
    setTimeout(()=>{
      placeOrder({tot,win});
      setCheckingOut(false);
      setShowCart(false);
    },1500);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.4)",zIndex:400,display:"flex",justifyContent:"flex-end",backdropFilter:"blur(8px)"}} onClick={()=>setShowCart(false)}>
      <div className="slideIn glass-card" style={{width:420,height:"100%",background:"var(--bg)",backdropFilter:"blur(24px)",borderLeft:"1px solid var(--sand)",display:"flex",flexDirection:"column",boxShadow:"var(--sh4)",animation:"slideIn .4s cubic-bezier(.16,1,.3,1)"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"24px 32px",borderBottom:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff"}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)"}}>Your Order</h2>
          <button onClick={()=>setShowCart(false)} style={{background:"var(--bg2)",border:"none",fontSize:22,cursor:"pointer",color:"var(--clay2)",padding:"4px 12px",borderRadius:100,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>×</button>
        </div>
        
        <div style={{flex:1,overflow:"auto",padding:32}}>
          {cart.length===0?(
            <div style={{textAlign:"center",paddingTop:80,color:"var(--clay2)"}}>
              <span style={{display:"block",marginBottom:16,color:"var(--clay2)",opacity:0.3}}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span>
              <div style={{fontSize:18,color:"var(--bark)",marginBottom:8}}>Cart is empty</div>
              <p style={{fontSize:14}}>Add some items to get started.</p>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--bark)",textTransform:"uppercase",letterSpacing:".04em",display:"flex",alignItems:"center",gap:8}}><span style={{width:8,height:8,borderRadius:"50%",background:"var(--terra)"}}/> {cart[0].rname}</div>
              {cart.map(item=>(
                <div key={item.id+"-"+item.opts.map(o=>o.n).join("")} style={{display:"flex",gap:16}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,background:"var(--bg2)",padding:"4px",borderRadius:100,border:"1px solid var(--sand)"}}>
                    <button onClick={()=>addToCart(item)} style={{background:"#fff",border:"1px solid var(--sand)",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:16,color:"var(--bark)"}}>+</button>
                    <span style={{fontSize:14,fontWeight:700,color:"var(--bark)"}}>{item.qty}</span>
                    <button onClick={()=>removeFromCart(item.id)} style={{background:"#fff",border:"1px solid var(--sand)",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:16,color:"var(--bark)"}}>−</button>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:16,color:"var(--bark)"}}>{item.name}</span>
                      <span style={{fontWeight:600,color:"var(--bark)"}}>${(item.price*item.qty).toFixed(2)}</span>
                    </div>
                    {item.opts.map(o=><div key={o.n} style={{fontSize:13,color:"var(--clay2)",marginBottom:2}}>+ {o.n}</div>)}
                  </div>
                </div>
              ))}
              
              <div style={{marginTop:24,paddingTop:24,borderTop:"1px solid var(--sand)"}}>
                <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Recommended Add-ons</div>
                <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:12,marginBottom:24}}>
                  {[
                    {id:"ao1",name:"Fiji Water",price:2.50,qty:1,rid:cart[0]?.rid,rname:cart[0]?.rname,opts:[],cal:0,flags:["V","GF"]},
                    {id:"ao2",name:"Chocolate Chip Cookie",price:3.00,qty:1,rid:cart[0]?.rid,rname:cart[0]?.rname,opts:[],cal:220,flags:["V"]}
                  ].map((ao, i)=>(
                    <div key={i} style={{minWidth:140,flex:1,padding:12,borderRadius:12,border:"1px solid var(--sand)",background:"var(--bg2)",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <div style={{fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8,lineHeight:1.3}}>{ao.name}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:13,fontWeight:600,color:"var(--olive)"}}>${ao.price.toFixed(2)}</span>
                        <button onClick={()=>addToCart(ao)} style={{background:"#fff",border:"1px solid var(--sand)",width:24,height:24,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--bark)",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{marginTop:0,paddingTop:24,borderTop:"1px solid var(--sand)"}}>
                <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Delivery Window</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {["12:00 PM","1:00 PM"].map(w=>(
                    <button key={w} onClick={()=>setWin(w)} style={{padding:"12px",borderRadius:12,border:win===w?"1px solid var(--terra)":"1px solid var(--sand)",background:win===w?"var(--terra-g)":"#fff",color:win===w?"var(--terra2)":"var(--clay2)",fontWeight:600,cursor:"pointer",transition:"all .2s cubic-bezier(.16,1,.3,1)"}}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {cart.length>0&&(
          <div style={{padding:32,background:"#fff",borderTop:"1px solid var(--sand)",backdropFilter:"blur(24px)"}}>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Promo Code</div>
              {!promoApplied?(
                <div>
                  <div style={{display:"flex",gap:8}}>
                    <input type="text" value={promoCode} onChange={e=>setPromoCode(e.target.value)} placeholder="Enter code" style={{flex:1,padding:"12px 16px",borderRadius:8,border:"1px solid var(--sand)",fontSize:14,fontFamily:"var(--sans)",outline:"none",transition:"border .2s"}} onFocus={e=>e.target.style.borderColor="var(--terra)"} onBlur={e=>e.target.style.borderColor="var(--sand)"} onKeyDown={e=>e.key==="Enter"&&handleApplyPromo()}/>
                    <button onClick={handleApplyPromo} style={{padding:"12px 20px",borderRadius:8,border:"1px solid var(--terra)",background:"var(--terra)",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--terra2)"} onMouseLeave={e=>e.currentTarget.style.background="var(--terra)"}>Apply</button>
                  </div>
                  {promoError&&<div style={{marginTop:8,fontSize:13,color:"var(--terra)"}}>✕ {promoError}</div>}
                </div>
              ):(
                <div style={{padding:"12px 16px",background:"var(--olive-bg)",borderRadius:8,border:"1px solid rgba(16,185,129,.2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"var(--olive2)",marginBottom:2}}>{promoApplied.code}</div>
                    <div style={{fontSize:12,color:"var(--olive)"}}>✓ {promoApplied.description}</div>
                  </div>
                  <button onClick={handleRemovePromo} style={{background:"transparent",border:"none",color:"var(--olive2)",cursor:"pointer",fontSize:18,padding:"4px 8px"}}>×</button>
                </div>
              )}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24,fontSize:14,color:"var(--clay2)"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Taxes & Fees</span><span>${tax.toFixed(2)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",color:hasFreeDelivery?"var(--olive)":"var(--bark)"}}>
                <span style={{display:"flex",alignItems:"center",gap:6}}>
                  Batch Delivery
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:hasFreeDelivery?"var(--olive)":"var(--terra)"}}><circle cx="5" cy="18" r="4"/><circle cx="19" cy="18" r="4"/><polyline points="15 6 9 6 12 12 12 18"/><line x1="12" y1="12" x2="19" y2="18"/></svg>
                </span>
                <span style={{textDecoration:hasFreeDelivery?"line-through":"none",color:hasFreeDelivery?"var(--clay)":"inherit"}}>
                  {hasFreeDelivery&&<span style={{color:"var(--olive)",fontWeight:600,marginRight:6}}>FREE</span>}
                  ${hasFreeDelivery?"2.50":fee.toFixed(2)}
                </span>
              </div>
              {hasFreeDelivery&&(
                <div style={{padding:"10px 12px",background:"var(--olive-bg)",borderRadius:8,border:"1px solid rgba(16,185,129,.2)",marginTop:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--olive2)",fontWeight:600}}>
                    <span style={{fontSize:16}}>{user.company.logo}</span>
                    <span>{user.company.name} perk applied</span>
                  </div>
                </div>
              )}
              {discount>0&&(
                <div style={{display:"flex",justifyContent:"space-between",color:"var(--olive2)",fontWeight:600}}>
                  <span>Discount ({promoApplied.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:16,borderTop:"1px solid var(--sand)",fontSize:20,fontWeight:700,color:"var(--bark)",fontFamily:"var(--sans)"}}>
                <span>Total</span><span>${tot.toFixed(2)}</span>
              </div>
            </div>
            <Btn v="primary" s={{width:"100%",padding:"18px",fontSize:16,position:"relative",overflow:"hidden"}} onClick={handleCheckout} disabled={checkingOut}>
              {checkingOut?(
                <><span style={{animation:"spin 1s linear infinite",display:"inline-block",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",width:20,height:20}}/> Processing...</>
              ):`Place Order • $${tot.toFixed(2)}`}
            </Btn>
            <p style={{textAlign:"center",fontSize:13,color:"var(--clay2)",marginTop:16}}>{user?"No tips required or expected.":"Sign in to complete order."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════
function Orders(){
  const {activeOrder,pastOrders,reorder}=useContext(AppCtx);
  const [localActiveOrder,setLocalActiveOrder]=useState(null);
  const active=localActiveOrder?[localActiveOrder]:[];
  const past=pastOrders||[];
  const [currentTime,setCurrentTime]=useState(new Date());

  useEffect(()=>{
    if(activeOrder){
      setLocalActiveOrder(activeOrder);
    }
  },[activeOrder]);

  useEffect(()=>{
    const timer=setInterval(()=>setCurrentTime(new Date()),1000);
    return()=>clearInterval(timer);
  },[]);

  useEffect(()=>{
    if(!localActiveOrder)return;
    const interval=setInterval(()=>{
      setLocalActiveOrder(prev=>{
        if(!prev||prev.status>=2)return prev;
        return{...prev,status:prev.status+1};
      });
    },8000);
    return()=>clearInterval(interval);
  },[localActiveOrder]);

  const getTimeRemaining=(order)=>{
    if(!order||!order.placedAt)return null;
    const statusTimes=[8,16,24];
    const targetTime=statusTimes[order.status]||24;
    const remaining=Math.max(0,targetTime-(order.status*8));
    return{remaining,total:targetTime};
  };

  return(
    <div className="fi" style={{maxWidth:800,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"var(--serif)",fontSize:40,color:"var(--bark)",marginBottom:32}}>Your Orders</h1>
      {active.map(o=>(
        <div key={o.id} className="up glass-card" style={{marginBottom:40,borderRadius:24,overflow:"hidden",boxShadow:"var(--sh2)",border:"1px solid var(--sand)",background:"#fff"}}>
          <div style={{padding:"24px 32px",borderBottom:"1px solid var(--sand)",background:"var(--bg2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div><div style={{fontFamily:"var(--sans)",fontSize:20,fontWeight:600,color:"var(--bark)",marginBottom:4}}>{o.rname}</div><div style={{fontSize:13,color:"var(--clay2)"}}>{o.placedAt} · Window: {o.win}</div></div>
              <div style={{background:"var(--olive-bg)",color:"var(--olive2)",border:"1px solid rgba(16,185,129,.2)",padding:"6px 16px",borderRadius:100,fontSize:13,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase"}}>Arriving today</div>
            </div>
            
            {/* Status Steps */}
            <div style={{display:"flex",justifyContent:"space-between",position:"relative",marginTop:32}}>
              <div style={{position:"absolute",top:16,left:14,right:14,height:2,background:"var(--sand)",zIndex:0}}>
                <div style={{height:"100%",width:`${(o.status/(STATUS_STEPS.length-1))*100}%`,background:"var(--olive)",transition:"width 1s cubic-bezier(.16,1,.3,1)"}}/>
              </div>
              {STATUS_STEPS.map((step,i)=>{
                const active = o.status>=i;
                return(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,zIndex:1}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:active?"var(--olive)":"#fff",border:active?"2px solid rgba(16,185,129,.3)":"2px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",color:active?"#fff":"var(--clay2)",fontSize:active?14:12,fontWeight:600,transition:"all .5s cubic-bezier(.16,1,.3,1)",boxShadow:active?"0 0 20px rgba(16,185,129,.4)":"none"}}>
                      {active?"✓":i+1}
                    </div>
                    <div style={{fontSize:12,fontWeight:600,color:active?"var(--bark)":"var(--clay2)"}}>{step.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div style={{display:"flex"}}>
            <div style={{flex:1,padding:32,borderRight:"1px solid var(--sand)"}}>
              <div style={{fontSize:12,fontWeight:600,color:"var(--clay2)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:16}}>Items</div>
              {o.items.map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:12,fontSize:15,color:"var(--bark)"}}>
                  <span><span style={{fontWeight:600,marginRight:8}}>{item.qty}x</span>{item.name}</span>
                  <span>${(item.price*item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{borderTop:"1px solid var(--sand)",marginTop:16,paddingTop:16,display:"flex",justifyContent:"space-between",fontWeight:600,color:"var(--bark)",fontSize:16}}>
                <span>Total paid</span><span>${o.tot.toFixed(2)}</span>
              </div>
            </div>
            <div style={{flex:1,padding:32,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,var(--olive-bg),transparent)",position:"relative"}}>
              <div style={{width:200,height:200,borderRadius:"50%",background:"var(--bg)",border:"2px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,marginBottom:24,position:"relative",overflow:"hidden"}}>
                {o.status===0 && "👨‍🍳"}
                {o.status===1 && (
                  <svg width="140" height="140" viewBox="0 0 100 100" style={{position:"absolute"}}>
                    <path d="M 20 80 Q 50 20 80 80" fill="none" stroke="var(--sand)" strokeWidth="4" strokeDasharray="6 6" />
                    <circle cx="20" cy="80" r="6" fill="var(--terra)" />
                    <circle cx="80" cy="80" r="6" fill="var(--olive)" />
                    <g>
                      <circle cx="0" cy="0" r="12" fill="var(--bark)" />
                      <text x="0" y="4" fontSize="12" textAnchor="middle" fill="#fff">🚴</text>
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 20 80 Q 50 20 80 80" />
                    </g>
                  </svg>
                )}
                {o.status===2 && "✓"}
              </div>
              <p style={{fontSize:14,color:"var(--clay2)",textAlign:"center",maxWidth:250,lineHeight:1.6}}>
                {o.status===0 && "Restaurant is preparing your order with fresh ingredients."}
                {o.status===1 && "Driver is on the way to deliver your meal."}
                {o.status===2 && "Your meal has been delivered! Enjoy your food."}
              </p>
            </div>
          </div>
        </div>
      ))}

      {past.length>0&&(
        <>
          <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:24,marginTop:64}}>Order History</h2>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {past.map(o=>(
              <div key={o.id} className="up glass-card" style={{background:"#fff",border:"1px solid var(--sand)",padding:"20px 24px",borderRadius:16,display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <div style={{width:48,height:48,borderRadius:12,background:"var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--clay2)"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></div>
                  <div><div style={{fontFamily:"var(--sans)",fontSize:16,fontWeight:600,color:"var(--bark)",marginBottom:2}}>{o.rname}</div><div style={{fontSize:13,color:"var(--clay2)"}}>{new Date(o.date).toLocaleDateString()} · {o.items.length} items</div></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:600,fontSize:16,color:"var(--bark)",marginBottom:2}}>${o.tot.toFixed(2)}</div>
                  <Btn v="ghost" s={{padding:0,fontSize:13}} onClick={()=>reorder(o)}>Reorder</Btn>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {active.length===0&&<div className="si" style={{textAlign:"center",padding:100,color:"var(--clay2)"}}>You haven't placed any orders yet.</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PLANS (Subscriptions)
// ═══════════════════════════════════════════════════════════════════
function Plans(){
  return(
    <div className="fi" style={{maxWidth:1200,margin:"0 auto",padding:"64px 24px 80px"}}>
      <div style={{textAlign:"center",marginBottom:64}}>
        <h1 className="up" style={{fontFamily:"var(--serif)",fontSize:56,color:"var(--bark)",lineHeight:1.1,marginBottom:16}}>Simple, transparent pricing</h1>
        <p className="up" style={{animationDelay:".1s",fontSize:18,color:"var(--clay2)",maxWidth:600,margin:"0 auto",lineHeight:1.6}}>Choose the plan that fits your lunch routine. Upgrade, downgrade, or cancel anytime.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,marginBottom:64}}>
        {PLANS.map((p,i)=>(
          <div key={p.name} className="up glass-card" style={{animationDelay:`${i*.1+.2}s`,background:"#fff",border:p.pop?"2px solid var(--terra)":"1px solid var(--sand)",borderRadius:24,padding:32,position:"relative",overflow:"hidden",boxShadow:p.pop?"var(--sh4)":"var(--sh2)",transform:p.pop?"scale(1.05)":"scale(1)",transition:"all .3s"}}>
            {p.badge&&<div style={{position:"absolute",top:20,right:20,background:p.pop?"var(--terra)":"var(--olive-bg)",color:p.pop?"#fff":"var(--olive2)",border:p.pop?"1px solid rgba(249,115,22,.3)":"1px solid rgba(16,185,129,.2)",padding:"4px 12px",borderRadius:100,fontSize:11,fontWeight:700,letterSpacing:".04em",textTransform:"uppercase"}}>{p.badge}</div>}

            <div style={{fontSize:20,color:"var(--bark)",marginBottom:8,fontFamily:"var(--sans)",fontWeight:700}}>{p.name}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
              <span style={{fontFamily:"var(--sans)",fontSize:42,fontWeight:800,color:"var(--bark)"}}>{p.price}</span>
              <span style={{color:"var(--clay2)",fontWeight:500,fontSize:15}}>{p.freq}</span>
            </div>
            {p.savings&&<div style={{fontSize:12,color:"var(--olive2)",fontWeight:600,marginBottom:16,background:"var(--olive-bg)",padding:"4px 10px",borderRadius:6,display:"inline-block"}}>{p.savings}</div>}
            <div style={{fontSize:14,color:"var(--clay2)",marginBottom:24,minHeight:50,lineHeight:1.5}}>{p.desc}</div>

            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
              {p.features.map(f=>(
                <div key={f} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <span style={{color:"var(--olive)",fontSize:14,marginTop:2,flexShrink:0}}>✓</span>
                  <span style={{fontSize:14,color:"var(--bark)",lineHeight:1.4}}>{f}</span>
                </div>
              ))}
            </div>

            {p.minUsers&&<div style={{fontSize:12,color:"var(--clay2)",marginBottom:16,fontStyle:"italic"}}>Minimum {p.minUsers} users required</div>}

            <Btn v={p.pop?"primary":"secondary"} s={{width:"100%",padding:"14px",fontSize:15}}>
              {p.pop?"Start 14-day free trial":p.minUsers?"Contact Sales":"Get Started"}
            </Btn>
          </div>
        ))}
      </div>

      {/* Fee Breakdown Section */}
      <div className="up glass-card" style={{animationDelay:".6s",background:"var(--bg2)",border:"1px solid var(--sand)",borderRadius:24,padding:48,marginBottom:64}}>
        <h2 style={{fontFamily:"var(--serif)",fontSize:32,color:"var(--bark)",marginBottom:24,textAlign:"center"}}>Fee Breakdown</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:32,maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"var(--terra-g)",border:"2px solid rgba(249,115,22,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:32}}>🚚</div>
            <div style={{fontWeight:700,fontSize:18,color:"var(--bark)",marginBottom:8}}>Delivery Fee</div>
            <div style={{fontSize:28,fontWeight:800,color:"var(--terra)",marginBottom:8}}>$2.50</div>
            <div style={{fontSize:13,color:"var(--clay2)",lineHeight:1.5}}>Per order on Free plan. FREE with Lunch Pass or Team Plan.</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"var(--olive-bg)",border:"2px solid rgba(16,185,129,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:32}}>💰</div>
            <div style={{fontWeight:700,fontSize:18,color:"var(--bark)",marginBottom:8}}>Platform Fee</div>
            <div style={{fontSize:28,fontWeight:800,color:"var(--olive2)",marginBottom:8}}>$0</div>
            <div style={{fontSize:13,color:"var(--clay2)",lineHeight:1.5}}>No additional fees to customers. Menu prices shown are final (plus tax).</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"var(--bg)",border:"2px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:32}}>🧾</div>
            <div style={{fontWeight:700,fontSize:18,color:"var(--bark)",marginBottom:8}}>Taxes & Fees</div>
            <div style={{fontSize:28,fontWeight:800,color:"var(--bark)",marginBottom:8}}>8.5%</div>
            <div style={{fontSize:13,color:"var(--clay2)",lineHeight:1.5}}>Standard local sales tax applied to food subtotal.</div>
          </div>
        </div>
        <div style={{marginTop:32,padding:20,background:"var(--olive-bg)",borderRadius:12,border:"1px solid rgba(16,185,129,.2)",textAlign:"center"}}>
          <div style={{fontSize:14,color:"var(--olive2)",fontWeight:600}}>💡 Pro Tip: With Lunch Pass, ordering just 4 times per month covers the subscription cost!</div>
        </div>
      </div>

      <div className="up glass-card" style={{animationDelay:".5s",borderRadius:24,padding:"48px 56px",display:"flex",alignItems:"center",gap:64,background:"linear-gradient(135deg,var(--bark),#090E17)"}}>
        <div style={{flex:1}}>
          <div style={{display:"inline-block",padding:"6px 14px",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:100,fontSize:12,fontWeight:600,color:"#fff",marginBottom:16}}>For HR & Facilities</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:40,color:"#fff",marginBottom:16,lineHeight:1.1}}>Corporate Subsidy</h2>
          <p style={{fontSize:16,color:"rgba(255,255,255,.8)",lineHeight:1.6,marginBottom:32}}>Fully or partially subsidize your team's lunches. We handle all routing and delivery logistics directly to your office. Boost return-to-office attendance with the ultimate amenity.</p>
          <Btn s={{background:"#fff",color:"var(--bark)",padding:"14px 28px",fontSize:15}}>Contact Sales</Btn>
        </div>
        <div style={{width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle at 30% 30%,rgba(16,185,129,.2),transparent)",border:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.8)",boxShadow:"inset 0 0 60px rgba(0,0,0,.5), 0 0 100px rgba(16,185,129,.1)"}}><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg></div>
      </div>

      {/* Pricing FAQ */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"80px 24px"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:48,color:"var(--bark)",marginBottom:16,fontWeight:400}}>Pricing Questions</h2>
          <p style={{fontSize:18,color:"rgba(0,0,0,.6)",maxWidth:600,margin:"0 auto"}}>Common questions about our pricing, billing, and subscription plans</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(350px,1fr))",gap:32}}>
          <div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              How does the free trial work?
            </h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,.7)",lineHeight:1.6}}>New Lunch Pass subscribers get a 7-day free trial. You can cancel anytime during the trial period without being charged. After the trial, you'll be billed monthly.</p>
          </div>
          <div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Can I cancel my subscription anytime?
            </h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,.7)",lineHeight:1.6}}>Yes! You can cancel your Lunch Pass or Team Plan at any time from your account settings. You'll continue to have access until the end of your current billing period.</p>
          </div>
          <div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              What if I only order once a week?
            </h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,.7)",lineHeight:1.6}}>The Free plan is perfect for occasional users! You'll pay just $2.50 per delivery. Lunch Pass makes sense when you order 4+ times per month (breaking even at $9.99).</p>
          </div>
          <div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Are there any hidden fees?
            </h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,.7)",lineHeight:1.6}}>No hidden fees! You see the exact total before placing your order. Lunch Pass members pay $0 delivery fees. Free plan users pay $2.50 per delivery. Standard taxes & restaurant fees apply.</p>
          </div>
          <div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Do you offer refunds?
            </h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,.7)",lineHeight:1.6}}>If you're not satisfied with your meal, we offer full refunds for food quality issues. Subscription fees are non-refundable, but you can cancel anytime to avoid future charges.</p>
          </div>
          <div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Can I switch between plans?
            </h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,.7)",lineHeight:1.6}}>Absolutely! You can upgrade or downgrade your plan anytime. Upgrades take effect immediately. Downgrades take effect at the start of your next billing cycle.</p>
          </div>
          <div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              How do payments work?
            </h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,.7)",lineHeight:1.6}}>You pay LunchDrop for your entire order (food + fees). We process payment instantly and transfer funds to restaurants daily. All major credit/debit cards and digital wallets accepted.</p>
          </div>
          <div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              When am I charged?
            </h3>
            <p style={{fontSize:15,color:"rgba(0,0,0,.7)",lineHeight:1.6}}>Order charges are processed immediately when you place your order. Subscription fees are billed monthly on your signup date. You'll receive a receipt via email for every transaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function AdminLogin(){
  const {setUser,go,showToast}=useContext(AppCtx);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleLogin=(e)=>{
    e.preventDefault();
    if(email===ADMIN_CREDENTIALS.email&&password===ADMIN_CREDENTIALS.password){
      setUser({
        name:ADMIN_CREDENTIALS.name,
        email:ADMIN_CREDENTIALS.email,
        role:"admin"
      });
      showToast("Welcome Admin!");
      go("admin-dashboard");
    }else{
      showToast("Invalid admin credentials");
    }
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, var(--terra) 0%, var(--terra2) 100%)"}}>
      <div style={{maxWidth:400,width:"100%",padding:24}}>
        <div style={{background:"#fff",borderRadius:24,padding:48,boxShadow:"0 24px 80px rgba(0,0,0,.2)"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:48,marginBottom:16}}>🔐</div>
            <h1 style={{fontFamily:"var(--serif)",fontSize:32,color:"var(--bark)",marginBottom:8}}>Admin Portal</h1>
            <p style={{fontSize:14,color:"var(--clay2)"}}>LunchDrop Platform Management</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="admin@lunchdrop.com"
                style={{width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)"}}
                required
              />
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                placeholder="Enter password"
                style={{width:"100%",padding:"14px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)"}}
                required
              />
            </div>

            <button type="submit" style={{width:"100%",padding:"16px",background:"var(--terra)",color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s"}}
              onMouseEnter={e=>e.target.style.background="var(--terra2)"}
              onMouseLeave={e=>e.target.style.background="var(--terra)"}>
              Sign In
            </button>
          </form>

          <div style={{marginTop:24,paddingTop:24,borderTop:"1px solid var(--sand)",textAlign:"center"}}>
            <button onClick={()=>go("home")} style={{background:"none",border:"none",color:"var(--clay2)",fontSize:14,cursor:"pointer",fontFamily:"var(--sans)"}}>
              ← Back to LunchDrop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLayout({children,activeTab}){
  const {user,setUser,go,adminOrders,adminRestaurants,adminDeliveryTeam}=useContext(AppCtx);
  const [adminPage,setAdminPage]=useState(activeTab||"dashboard");
  const [showGlobalSearch,setShowGlobalSearch]=useState(false);
  const [globalSearchQuery,setGlobalSearchQuery]=useState("");

  const handleLogout=()=>{
    setUser(null);
    go("admin");
  };

  // Global search results
  const searchResults=globalSearchQuery.trim()?{
    orders:adminOrders.filter(o=>
      o.id.toLowerCase().includes(globalSearchQuery.toLowerCase())||
      o.customerName.toLowerCase().includes(globalSearchQuery.toLowerCase())||
      o.restaurantName.toLowerCase().includes(globalSearchQuery.toLowerCase())
    ).slice(0,5),
    restaurants:adminRestaurants.filter(r=>
      r.name.toLowerCase().includes(globalSearchQuery.toLowerCase())||
      r.cuisine.toLowerCase().includes(globalSearchQuery.toLowerCase())
    ).slice(0,5),
    users:ALL_USERS.filter(u=>
      u.name.toLowerCase().includes(globalSearchQuery.toLowerCase())||
      u.email.toLowerCase().includes(globalSearchQuery.toLowerCase())
    ).slice(0,5),
    delivery:adminDeliveryTeam.filter(d=>
      d.name.toLowerCase().includes(globalSearchQuery.toLowerCase())||
      d.zone.toLowerCase().includes(globalSearchQuery.toLowerCase())
    ).slice(0,5)
  }:{orders:[],restaurants:[],users:[],delivery:[]};

  const navItems=[
    {key:"dashboard",label:"Dashboard",icon:"📊"},
    {key:"analytics",label:"Analytics",icon:"📈"},
    {key:"orders",label:"Orders",icon:"📦"},
    {key:"restaurants",label:"Restaurants",icon:"🍽️"},
    {key:"users",label:"Users",icon:"👥"},
    {key:"delivery",label:"Delivery Team",icon:"🚴"},
    {key:"maps",label:"Maps & Zones",icon:"🗺️"},
    {key:"notifications",label:"Notifications",icon:"🔔"},
    {key:"promos",label:"Promo Codes",icon:"🎟️"},
    {key:"settings",label:"Settings",icon:"⚙️"},
    {key:"logs",label:"Audit Logs",icon:"📋"}
  ];

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"var(--bg)"}}>
      {/* Sidebar */}
      <div style={{width:260,background:"var(--bark)",color:"#fff",padding:24,display:"flex",flexDirection:"column"}}>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:32,marginBottom:8}}>🍱</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:20,marginBottom:4}}>LunchDrop</h2>
          <p style={{fontSize:12,color:"rgba(255,255,255,.6)"}}>Admin Portal</p>
        </div>

        {/* Global Search Button */}
        <button onClick={()=>setShowGlobalSearch(true)} style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,fontSize:14,color:"rgba(255,255,255,.8)",cursor:"pointer",fontFamily:"var(--sans)",textAlign:"left",display:"flex",alignItems:"center",gap:12,marginBottom:24,transition:"all .2s"}}
          onMouseEnter={e=>e.target.style.background="rgba(255,255,255,.1)"}
          onMouseLeave={e=>e.target.style.background="rgba(255,255,255,.05)"}>
          <span style={{fontSize:16}}>🔍</span>
          <span>Search...</span>
          <span style={{marginLeft:"auto",fontSize:11,opacity:0.6}}>⌘K</span>
        </button>

        <nav style={{flex:1}}>
          {navItems.map(item=>(
            <button
              key={item.key}
              onClick={()=>go(`admin-${item.key}`)}
              style={{width:"100%",padding:"12px 16px",background:adminPage===item.key?"rgba(255,255,255,.1)":"transparent",color:adminPage===item.key?"#fff":"rgba(255,255,255,.7)",border:"none",borderRadius:12,fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:"var(--sans)",textAlign:"left",display:"flex",alignItems:"center",gap:12,marginBottom:8,transition:"all .2s"}}
              onMouseEnter={e=>{if(adminPage!==item.key)e.target.style.background="rgba(255,255,255,.05)"}}
              onMouseLeave={e=>{if(adminPage!==item.key)e.target.style.background="transparent"}}
            >
              <span style={{fontSize:18}}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{paddingTop:24,borderTop:"1px solid rgba(255,255,255,.1)"}}>
          <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:12}}>Logged in as</div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>{user?.name}</div>
          <button onClick={handleLogout} style={{width:"100%",padding:"10px",background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.8)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,fontSize:14,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s"}}
            onMouseEnter={e=>e.target.style.background="rgba(255,255,255,.1)"}
            onMouseLeave={e=>e.target.style.background="rgba(255,255,255,.05)"}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{flex:1,padding:40,overflowY:"auto"}}>
        {children}
      </div>

      {/* Global Search Modal */}
      {showGlobalSearch&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"start",justifyContent:"center",zIndex:2000,paddingTop:"10vh"}} onClick={()=>{setShowGlobalSearch(false);setGlobalSearchQuery("");}}>
          <div style={{background:"#fff",borderRadius:16,width:"90%",maxWidth:700,boxShadow:"0 20px 60px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
            {/* Search Input */}
            <div style={{padding:20,borderBottom:"1px solid var(--sand)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:20,color:"var(--clay2)"}}>🔍</span>
                <input
                  type="text"
                  placeholder="Search orders, restaurants, users, delivery team..."
                  value={globalSearchQuery}
                  onChange={e=>setGlobalSearchQuery(e.target.value)}
                  autoFocus
                  style={{flex:1,padding:"10px 0",border:"none",fontSize:16,outline:"none",fontFamily:"var(--sans)",color:"var(--bark)"}}
                />
                {globalSearchQuery&&(
                  <button onClick={()=>setGlobalSearchQuery("")} style={{padding:"4px 8px",background:"var(--bg2)",border:"none",borderRadius:6,fontSize:12,cursor:"pointer",color:"var(--clay2)"}}>Clear</button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div style={{maxHeight:"60vh",overflowY:"auto",padding:20}}>
              {!globalSearchQuery.trim()?(
                <div style={{textAlign:"center",padding:40,color:"var(--clay2)"}}>
                  <div style={{fontSize:48,marginBottom:12}}>🔍</div>
                  <div style={{fontSize:16,marginBottom:8}}>Start typing to search</div>
                  <div style={{fontSize:13}}>Search across orders, restaurants, users, and delivery team</div>
                </div>
              ):(
                <>
                  {/* Orders Results */}
                  {searchResults.orders.length>0&&(
                    <div style={{marginBottom:24}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase",marginBottom:12,letterSpacing:0.5}}>Orders ({searchResults.orders.length})</div>
                      {searchResults.orders.map(order=>(
                        <div key={order.id} onClick={()=>{go("admin-orders");setShowGlobalSearch(false);setGlobalSearchQuery("");}} style={{padding:14,marginBottom:8,background:"var(--bg2)",borderRadius:10,cursor:"pointer",transition:"all .2s"}}
                          onMouseEnter={e=>e.currentTarget.style.background="var(--terra-bg)"}
                          onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                            <div>
                              <div style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:4}}>{order.id}</div>
                              <div style={{fontSize:13,color:"var(--clay2)"}}>{order.customerName} • {order.restaurantName}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:16,fontWeight:700,color:"var(--terra)"}}>${order.total.toFixed(2)}</div>
                              <div style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:"var(--olive-bg)",color:"var(--olive)",fontWeight:600,display:"inline-block",marginTop:4}}>{order.status}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Restaurants Results */}
                  {searchResults.restaurants.length>0&&(
                    <div style={{marginBottom:24}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase",marginBottom:12,letterSpacing:0.5}}>Restaurants ({searchResults.restaurants.length})</div>
                      {searchResults.restaurants.map(rest=>(
                        <div key={rest.id} onClick={()=>{go("admin-restaurants");setShowGlobalSearch(false);setGlobalSearchQuery("");}} style={{padding:14,marginBottom:8,background:"var(--bg2)",borderRadius:10,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:12}}
                          onMouseEnter={e=>e.currentTarget.style.background="var(--terra-bg)"}
                          onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>
                          <div style={{fontSize:28}}>🍽️</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:2}}>{rest.name}</div>
                            <div style={{fontSize:13,color:"var(--clay2)"}}>{rest.cuisine} • {rest.rating}/5 ⭐</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Users Results */}
                  {searchResults.users.length>0&&(
                    <div style={{marginBottom:24}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase",marginBottom:12,letterSpacing:0.5}}>Users ({searchResults.users.length})</div>
                      {searchResults.users.map(usr=>(
                        <div key={usr.id} onClick={()=>{go("admin-users");setShowGlobalSearch(false);setGlobalSearchQuery("");}} style={{padding:14,marginBottom:8,background:"var(--bg2)",borderRadius:10,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:12}}
                          onMouseEnter={e=>e.currentTarget.style.background="var(--terra-bg)"}
                          onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>
                          <div style={{fontSize:28}}>👤</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:2}}>{usr.name}</div>
                            <div style={{fontSize:13,color:"var(--clay2)"}}>{usr.email} • {usr.subscription}</div>
                          </div>
                          <div style={{fontSize:12,color:"var(--olive2)",fontWeight:600}}>${usr.totalSpent.toFixed(0)}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery Team Results */}
                  {searchResults.delivery.length>0&&(
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase",marginBottom:12,letterSpacing:0.5}}>Delivery Team ({searchResults.delivery.length})</div>
                      {searchResults.delivery.map(member=>(
                        <div key={member.id} onClick={()=>{go("admin-delivery");setShowGlobalSearch(false);setGlobalSearchQuery("");}} style={{padding:14,marginBottom:8,background:"var(--bg2)",borderRadius:10,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:12}}
                          onMouseEnter={e=>e.currentTarget.style.background="var(--terra-bg)"}
                          onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>
                          <div style={{fontSize:28}}>🚴</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:2}}>{member.name}</div>
                            <div style={{fontSize:13,color:"var(--clay2)"}}>{member.zone.toUpperCase()} • {member.phone}</div>
                          </div>
                          <div style={{fontSize:11,padding:"4px 10px",borderRadius:6,background:member.status==="active"?"var(--olive-bg)":"var(--bg2)",color:member.status==="active"?"var(--olive)":"var(--clay2)",fontWeight:600}}>{member.status}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {searchResults.orders.length===0&&searchResults.restaurants.length===0&&searchResults.users.length===0&&searchResults.delivery.length===0&&(
                    <div style={{textAlign:"center",padding:40,color:"var(--clay2)"}}>
                      <div style={{fontSize:48,marginBottom:12}}>🤷</div>
                      <div style={{fontSize:16,marginBottom:8}}>No results found</div>
                      <div style={{fontSize:13}}>Try searching with different keywords</div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{padding:"12px 20px",borderTop:"1px solid var(--sand)",background:"var(--bg2)",borderRadius:"0 0 16px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:12,color:"var(--clay2)"}}>
                {globalSearchQuery.trim()&&(
                  <span>Found {searchResults.orders.length+searchResults.restaurants.length+searchResults.users.length+searchResults.delivery.length} results</span>
                )}
              </div>
              <div style={{fontSize:11,color:"var(--clay2)"}}>Press ESC to close</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDashboard(){
  const {adminOrders,adminRestaurants,adminPendingRestaurants,auditLogs,adminDeliveryTeam,go}=useContext(AppCtx);
  const [liveMode,setLiveMode]=useState(true);
  const [liveIndicator,setLiveIndicator]=useState(false);
  const [simulatedOrders,setSimulatedOrders]=useState(0);
  const [simulatedRevenue,setSimulatedRevenue]=useState(0);

  const today=new Date().toISOString().split("T")[0];
  const todayOrders=adminOrders.filter(o=>o.date===today);
  const totalRevenue=todayOrders.reduce((s,o)=>s+o.total,0);
  const avgOrderValue=todayOrders.length>0?totalRevenue/todayOrders.length:0;

  // Simulate real-time updates
  useEffect(()=>{
    if(!liveMode)return;

    const interval=setInterval(()=>{
      setLiveIndicator(prev=>!prev);
      // Simulate occasional new orders
      if(Math.random()>0.7){
        setSimulatedOrders(prev=>prev+1);
        setSimulatedRevenue(prev=>prev+Math.random()*30+10);
      }
    },3000);

    return()=>clearInterval(interval);
  },[liveMode]);

  const statusCounts={
    placed:todayOrders.filter(o=>o.status==="placed").length,
    batched:todayOrders.filter(o=>o.status==="batched").length,
    preparing:todayOrders.filter(o=>o.status==="preparing").length,
    in_transit:todayOrders.filter(o=>o.status==="in_transit").length,
    delivered:todayOrders.filter(o=>o.status==="delivered").length,
  };

  const StatCard=({label,value,sublabel,icon,color="var(--terra)"})=>(
    <div className="glass-card" style={{padding:24,borderRadius:16,display:"flex",alignItems:"center",gap:16,border:"1px solid var(--sand)"}}>
      <div style={{width:56,height:56,borderRadius:12,background:color==="var(--terra)"?"var(--terra-g)":color==="var(--olive)"?"var(--olive-bg)":"var(--blue-bg)",border:`1px solid ${color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{icon}</div>
      <div>
        <div style={{fontSize:28,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)"}}>{value}</div>
        <div style={{fontSize:13,color:"var(--clay2)",fontWeight:500}}>{label}</div>
        {sublabel&&<div style={{fontSize:12,color:"var(--clay)",marginTop:2}}>{sublabel}</div>}
      </div>
    </div>
  );

  return(
    <AdminLayout activeTab="dashboard">
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:32}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",margin:0}}>Dashboard</h1>
              {liveMode&&(
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:"var(--olive-bg)",borderRadius:100,animation:liveIndicator?"pulse .5s":"none"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"var(--olive)"}}/>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--olive)"}}>LIVE</span>
                </div>
              )}
            </div>
            <p style={{fontSize:16,color:"var(--clay2)",margin:0}}>Platform overview and key metrics</p>
          </div>
          <button onClick={()=>setLiveMode(!liveMode)} style={{padding:"10px 20px",background:liveMode?"var(--olive)":"var(--bg2)",color:liveMode?"#fff":"var(--bark)",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
            <span>{liveMode?"⏸":"▶"}</span>
            <span>{liveMode?"Pause":"Resume"} Live Updates</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,marginBottom:32}}>
          <StatCard label="Today's Orders" value={todayOrders.length+simulatedOrders} icon="📦" color="var(--terra)"/>
          <StatCard label="Today's Revenue" value={`$${(totalRevenue+simulatedRevenue).toFixed(2)}`} icon="💰" color="var(--olive)"/>
          <StatCard label="Active Users" value={ALL_USERS.length} icon="👥" color="var(--blue)"/>
          <StatCard label="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} icon="📊" color="var(--honey)"/>
        </div>

        {/* Status Breakdown */}
        <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)",marginBottom:32}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",marginBottom:20}}>Order Status Breakdown</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
            {[
              {label:"Placed",count:statusCounts.placed,color:"var(--blue)"},
              {label:"Batched",count:statusCounts.batched,color:"var(--honey)"},
              {label:"Preparing",count:statusCounts.preparing,color:"var(--terra)"},
              {label:"In Transit",count:statusCounts.in_transit,color:"var(--terra2)"},
              {label:"Delivered",count:statusCounts.delivered,color:"var(--olive)"}
            ].map(s=>(
              <div key={s.label} style={{padding:16,borderRadius:12,background:"var(--bg2)",textAlign:"center"}}>
                <div style={{fontSize:28,fontWeight:700,color:s.color,fontFamily:"var(--serif)"}}>{s.count}</div>
                <div style={{fontSize:13,color:"var(--clay2)",marginTop:4}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        {(adminPendingRestaurants.length>0||todayOrders.filter(o=>o.status==="placed").length>10)&&(
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"2px solid var(--honey)",background:"var(--honey-bg)",marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{fontSize:24}}>⚠️</div>
              <h2 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)"}}>System Alerts</h2>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {adminPendingRestaurants.length>0&&(
                <div style={{padding:14,borderRadius:8,background:"#fff",border:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"var(--bark)"}}>Pending Restaurant Approvals</div>
                    <div style={{fontSize:13,color:"var(--clay2)",marginTop:2}}>{adminPendingRestaurants.length} restaurant{adminPendingRestaurants.length>1?"s":""} waiting for approval</div>
                  </div>
                  <button onClick={()=>go("admin-restaurants")} style={{padding:"8px 16px",background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>Review</button>
                </div>
              )}
              {todayOrders.filter(o=>o.status==="placed").length>10&&(
                <div style={{padding:14,borderRadius:8,background:"#fff",border:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"var(--bark)"}}>High Order Volume</div>
                    <div style={{fontSize:13,color:"var(--clay2)",marginTop:2}}>{todayOrders.filter(o=>o.status==="placed").length} orders pending processing</div>
                  </div>
                  <button onClick={()=>go("admin-orders")} style={{padding:"8px 16px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>View Orders</button>
                </div>
              )}
              {adminDeliveryTeam.filter(d=>d.status==="active").length<5&&(
                <div style={{padding:14,borderRadius:8,background:"#fff",border:"1px solid var(--sand)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"var(--bark)"}}>Low Delivery Capacity</div>
                    <div style={{fontSize:13,color:"var(--clay2)",marginTop:2}}>Only {adminDeliveryTeam.filter(d=>d.status==="active").length} active delivery members</div>
                  </div>
                  <button onClick={()=>go("admin-delivery")} style={{padding:"8px 16px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>Manage Team</button>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24,marginBottom:32}}>
          {/* Recent Orders */}
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)"}}>Recent Orders</h2>
              <button onClick={()=>go("admin-orders")} style={{fontSize:13,color:"var(--terra)",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>View All →</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {todayOrders.length===0?(
                <div style={{padding:32,textAlign:"center",color:"var(--clay2)"}}>No orders today yet</div>
              ):(
                todayOrders.slice(0,5).map(order=>(
                  <div key={order.id} style={{padding:16,borderRadius:12,background:"var(--bg2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:"var(--bark)"}}>{order.id}</div>
                      <div style={{fontSize:13,color:"var(--clay2)",marginTop:2}}>{order.customerName} • {order.restaurantName}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontWeight:600,color:"var(--terra)"}}>${order.total.toFixed(2)}</div>
                      <div style={{fontSize:12,color:"var(--clay2)",marginTop:2}}>{order.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:16}}>Quick Stats</h2>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <div style={{fontSize:13,color:"var(--clay2)",marginBottom:4}}>Active Restaurants</div>
                <div style={{fontSize:24,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)"}}>{adminRestaurants.length}</div>
              </div>
              <div>
                <div style={{fontSize:13,color:"var(--clay2)",marginBottom:4}}>Pending Approvals</div>
                <div style={{fontSize:24,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)"}}>{adminPendingRestaurants.length}</div>
              </div>
              <div>
                <div style={{fontSize:13,color:"var(--clay2)",marginBottom:4}}>Delivery Team</div>
                <div style={{fontSize:24,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>{adminDeliveryTeam.filter(d=>d.status==="active").length}</div>
              </div>
              <div>
                <div style={{fontSize:13,color:"var(--clay2)",marginBottom:4}}>Total Orders</div>
                <div style={{fontSize:24,fontWeight:700,color:"var(--blue)",fontFamily:"var(--serif)"}}>{adminOrders.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)"}}>Recent Activity</h2>
            <button onClick={()=>go("admin-logs")} style={{fontSize:13,color:"var(--terra)",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>View All Logs →</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {auditLogs.length===0?(
              <div style={{padding:32,textAlign:"center",color:"var(--clay2)"}}>No recent activity</div>
            ):(
              auditLogs.slice(0,8).map(log=>{
                const getActionIcon=action=>{
                  if(action.includes("RESTAURANT"))return"🍽️";
                  if(action.includes("ORDER"))return"📦";
                  if(action.includes("DELIVERY"))return"🚴";
                  if(action.includes("PROMO"))return"🎟️";
                  if(action.includes("REFUND"))return"💰";
                  if(action.includes("SETTINGS"))return"⚙️";
                  if(action.includes("NOTIFICATION"))return"🔔";
                  if(action.includes("MENU"))return"🍽️";
                  return"📝";
                };
                const getActionColor=action=>{
                  if(action.includes("APPROVE"))return"var(--olive)";
                  if(action.includes("REJECT")||action.includes("DELETE"))return"var(--red)";
                  if(action.includes("CREATE")||action.includes("ADD"))return"var(--blue)";
                  if(action.includes("UPDATE"))return"var(--honey)";
                  return"var(--clay)";
                };
                const formatAction=action=>{
                  return action.toLowerCase().replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase());
                };
                const timeAgo=timestamp=>{
                  const now=new Date();
                  const past=new Date(timestamp);
                  const diffMs=now-past;
                  const diffMins=Math.floor(diffMs/60000);
                  const diffHours=Math.floor(diffMs/3600000);
                  const diffDays=Math.floor(diffMs/86400000);
                  if(diffMins<1)return"Just now";
                  if(diffMins<60)return`${diffMins}m ago`;
                  if(diffHours<24)return`${diffHours}h ago`;
                  return`${diffDays}d ago`;
                };

                return(
                  <div key={log.id} style={{padding:12,borderRadius:8,background:"var(--bg2)",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:32,height:32,borderRadius:8,background:`${getActionColor(log.action)}15`,border:`1px solid ${getActionColor(log.action)}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{getActionIcon(log.action)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:2}}>{formatAction(log.action)}</div>
                      <div style={{fontSize:12,color:"var(--clay2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{log.admin} • {JSON.stringify(log.details).substring(0,60)}...</div>
                    </div>
                    <div style={{fontSize:11,color:"var(--clay)",whiteSpace:"nowrap"}}>{timeAgo(log.timestamp)}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function AdminOrders(){
  const {adminOrders,updateOrderStatus,assignDelivery,processRefund,cancelOrder}=useContext(AppCtx);
  const [searchQuery,setSearchQuery]=useState("");
  const [statusFilter,setStatusFilter]=useState("all");
  const [dateFilter,setDateFilter]=useState("all");
  const [customStartDate,setCustomStartDate]=useState("");
  const [customEndDate,setCustomEndDate]=useState("");
  const [buildingFilter,setBuildingFilter]=useState("all");
  const [restaurantFilter,setRestaurantFilter]=useState("all");
  const [selectedOrder,setSelectedOrder]=useState(null);
  const [showRefundForm,setShowRefundForm]=useState(false);
  const [showCancelForm,setShowCancelForm]=useState(false);
  const [refundAmount,setRefundAmount]=useState("");
  const [refundReason,setRefundReason]=useState("");
  const [cancelReason,setCancelReason]=useState("");
  const [currentPage,setCurrentPage]=useState(1);
  const [itemsPerPage,setItemsPerPage]=useState(20);
  const [selectedOrders,setSelectedOrders]=useState(new Set());
  const [showBatchActions,setShowBatchActions]=useState(false);

  const today=new Date().toISOString().split("T")[0];
  const yesterday=new Date(Date.now()-86400000).toISOString().split("T")[0];
  const last7Days=new Date(Date.now()-7*86400000).toISOString().split("T")[0];
  const last30Days=new Date(Date.now()-30*86400000).toISOString().split("T")[0];
  const last90Days=new Date(Date.now()-90*86400000).toISOString().split("T")[0];

  // Get unique restaurants and buildings from orders
  const uniqueRestaurants=[...new Set(adminOrders.map(o=>o.restaurantName))];
  const uniqueBuildings=[...new Set(adminOrders.map(o=>o.building))];

  const filteredOrders=adminOrders.filter(o=>{
    const matchesSearch=searchQuery===""||o.id.toLowerCase().includes(searchQuery.toLowerCase())||o.customerName.toLowerCase().includes(searchQuery.toLowerCase())||o.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus=statusFilter==="all"||o.status===statusFilter;

    let matchesDate=true;
    if(dateFilter==="today"){
      matchesDate=o.date===today;
    }else if(dateFilter==="yesterday"){
      matchesDate=o.date===yesterday;
    }else if(dateFilter==="last7"){
      matchesDate=o.date>=last7Days&&o.date<=today;
    }else if(dateFilter==="last30"){
      matchesDate=o.date>=last30Days&&o.date<=today;
    }else if(dateFilter==="last90"){
      matchesDate=o.date>=last90Days&&o.date<=today;
    }else if(dateFilter==="custom"){
      if(customStartDate&&customEndDate){
        matchesDate=o.date>=customStartDate&&o.date<=customEndDate;
      }else if(customStartDate){
        matchesDate=o.date>=customStartDate;
      }else if(customEndDate){
        matchesDate=o.date<=customEndDate;
      }
    }

    const matchesBuilding=buildingFilter==="all"||o.building===buildingFilter;
    const matchesRestaurant=restaurantFilter==="all"||o.restaurantName===restaurantFilter;
    return matchesSearch&&matchesStatus&&matchesDate&&matchesBuilding&&matchesRestaurant;
  });

  // Pagination
  const totalItems=filteredOrders.length;
  const totalPages=Math.ceil(totalItems/itemsPerPage);
  const startIndex=(currentPage-1)*itemsPerPage;
  const endIndex=startIndex+itemsPerPage;
  const paginatedOrders=filteredOrders.slice(startIndex,endIndex);

  // Reset to page 1 when filters change
  useEffect(()=>{setCurrentPage(1)},[searchQuery,statusFilter,dateFilter,buildingFilter,restaurantFilter,customStartDate,customEndDate]);

  // Batch operations
  const toggleSelectOrder=orderId=>{
    setSelectedOrders(prev=>{
      const newSet=new Set(prev);
      if(newSet.has(orderId))newSet.delete(orderId);
      else newSet.add(orderId);
      return newSet;
    });
  };

  const toggleSelectAll=()=>{
    if(selectedOrders.size===paginatedOrders.length){
      setSelectedOrders(new Set());
    }else{
      setSelectedOrders(new Set(paginatedOrders.map(o=>o.id)));
    }
  };

  const batchUpdateStatus=(newStatus)=>{
    selectedOrders.forEach(orderId=>updateOrderStatus(orderId,newStatus));
    setSelectedOrders(new Set());
    setShowBatchActions(false);
  };

  const batchAssignDelivery=(deliveryId)=>{
    selectedOrders.forEach(orderId=>assignDelivery(orderId,deliveryId));
    setSelectedOrders(new Set());
    setShowBatchActions(false);
  };

  const batchExportCSV=()=>{
    const selectedOrderData=adminOrders.filter(o=>selectedOrders.has(o.id));
    const csv=[
      ["Order ID","Customer","Restaurant","Building","Date","Time","Status","Total"],
      ...selectedOrderData.map(o=>[o.id,o.customerName,o.restaurantName,o.building,o.date,o.time,o.status,o.total.toFixed(2)])
    ].map(row=>row.join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`orders-batch-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSelectedOrders(new Set());
    setShowBatchActions(false);
  };

  return(
    <AdminLayout activeTab="orders">
      <div>
        <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:8}}>Order Management</h1>
        <p style={{fontSize:16,color:"var(--clay2)",marginBottom:32}}>View and manage all orders across restaurants</p>

        {/* Search and Filter */}
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",gap:16,marginBottom:12}}>
            <input
              type="text"
              placeholder="Search by order ID, customer, or restaurant..."
              value={searchQuery}
              onChange={e=>setSearchQuery(e.target.value)}
              style={{flex:1,padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)"}}
            />
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer",minWidth:150}}>
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="batched">Batched</option>
              <option value="preparing">Preparing</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
            <select value={dateFilter} onChange={e=>setDateFilter(e.target.value)} style={{padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer",minWidth:160}}>
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            {dateFilter==="custom"&&(
              <>
                <input type="date" value={customStartDate} onChange={e=>setCustomStartDate(e.target.value)} style={{padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}} placeholder="Start date"/>
                <span style={{display:"flex",alignItems:"center",color:"var(--clay2)",fontSize:14}}>to</span>
                <input type="date" value={customEndDate} onChange={e=>setCustomEndDate(e.target.value)} style={{padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}} placeholder="End date"/>
              </>
            )}
          </div>

          <div style={{display:"flex",gap:12}}>
            <div style={{fontSize:13,color:"var(--clay2)",padding:"8px 12px",background:"var(--bg2)",borderRadius:8,fontWeight:600}}>📍 Filter by Location:</div>
            <select value={buildingFilter} onChange={e=>setBuildingFilter(e.target.value)} style={{padding:"8px 14px",borderRadius:8,border:"1px solid var(--sand)",fontSize:14,outline:"none",fontFamily:"var(--sans)",cursor:"pointer",background:"#fff"}}>
              <option value="all">All Buildings ({adminOrders.length})</option>
              {uniqueBuildings.map(building=>(
                <option key={building} value={building}>{building} ({adminOrders.filter(o=>o.building===building).length})</option>
              ))}
            </select>
            <select value={restaurantFilter} onChange={e=>setRestaurantFilter(e.target.value)} style={{padding:"8px 14px",borderRadius:8,border:"1px solid var(--sand)",fontSize:14,outline:"none",fontFamily:"var(--sans)",cursor:"pointer",background:"#fff"}}>
              <option value="all">All Restaurants ({adminOrders.length})</option>
              {uniqueRestaurants.map(restaurant=>(
                <option key={restaurant} value={restaurant}>{restaurant} ({adminOrders.filter(o=>o.restaurantName===restaurant).length})</option>
              ))}
            </select>
            {(buildingFilter!=="all"||restaurantFilter!=="all")&&(
              <button onClick={()=>{setBuildingFilter("all");setRestaurantFilter("all");}} style={{padding:"8px 16px",background:"var(--clay2)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>Clear Filters</button>
            )}
          </div>
        </div>

        {/* Batch Actions Bar */}
        {selectedOrders.size>0&&(
          <div style={{padding:16,background:"var(--terra-g)",border:"2px solid var(--terra)",borderRadius:12,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:14,fontWeight:600,color:"var(--bark)"}}>{selectedOrders.size} order{selectedOrders.size>1?"s":""} selected</div>
            <div style={{flex:1}}/>
            <button onClick={()=>setShowBatchActions(!showBatchActions)} style={{padding:"8px 16px",background:"var(--bark)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>Batch Actions</button>
            <button onClick={()=>setSelectedOrders(new Set())} style={{padding:"8px 16px",background:"var(--clay2)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>Clear Selection</button>

            {showBatchActions&&(
              <div style={{position:"absolute",top:60,right:40,background:"#fff",border:"1px solid var(--sand)",borderRadius:12,padding:16,boxShadow:"0 4px 12px rgba(0,0,0,.1)",zIndex:100,minWidth:250}}>
                <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Batch Operations</div>

                <div style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:13,color:"var(--clay2)",marginBottom:6}}>Update Status</label>
                  <select onChange={e=>{if(e.target.value){batchUpdateStatus(e.target.value);e.target.value="";}}} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:13,cursor:"pointer"}}>
                    <option value="">Select status...</option>
                    <option value="batched">Batched</option>
                    <option value="preparing">Preparing</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:13,color:"var(--clay2)",marginBottom:6}}>Assign Delivery</label>
                  <select onChange={e=>{if(e.target.value){batchAssignDelivery(e.target.value);e.target.value="";}}} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:13,cursor:"pointer"}}>
                    <option value="">Select driver...</option>
                    {DELIVERY_TEAM.map(d=>(
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <button onClick={batchExportCSV} style={{width:"100%",padding:"10px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>📥 Export Selected to CSV</button>
              </div>
            )}
          </div>
        )}

        {/* Results Summary and Pagination Controls */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <input type="checkbox" checked={selectedOrders.size===paginatedOrders.length&&paginatedOrders.length>0} onChange={toggleSelectAll} style={{width:18,height:18,cursor:"pointer"}}/>
            <div style={{fontSize:14,color:"var(--clay2)"}}>Showing {startIndex+1}-{Math.min(endIndex,totalItems)} of {totalItems} orders</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:13,color:"var(--clay2)"}}>Per page:</span>
            <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setCurrentPage(1);}} style={{padding:"6px 10px",borderRadius:8,border:"1px solid var(--sand)",fontSize:13,cursor:"pointer"}}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {paginatedOrders.map(order=>(
            <div key={order.id} className="glass-card" style={{padding:20,borderRadius:12,border:selectedOrders.has(order.id)?"2px solid var(--terra)":"1px solid var(--sand)",cursor:"pointer",transition:"all .2s",background:selectedOrders.has(order.id)?"var(--terra-bg)":"#fff"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--terra)"}
              onMouseLeave={e=>{if(!selectedOrders.has(order.id))e.currentTarget.style.borderColor="var(--sand)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:16}}>
                <input type="checkbox" checked={selectedOrders.has(order.id)} onChange={e=>{e.stopPropagation();toggleSelectOrder(order.id);}} onClick={e=>e.stopPropagation()} style={{width:20,height:20,cursor:"pointer",marginTop:4,flexShrink:0}}/>
                <div style={{flex:1}} onClick={()=>setSelectedOrder(order)}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                    <span style={{fontSize:16,fontWeight:700,color:"var(--bark)",fontFamily:"var(--mono)"}}>{order.id}</span>
                    <span style={{padding:"4px 12px",borderRadius:100,fontSize:12,fontWeight:600,background:order.status==="delivered"?"var(--olive-bg)":order.status==="in_transit"?"var(--terra-g)":order.status==="preparing"?"var(--honey-bg)":"var(--blue-bg)",color:order.status==="delivered"?"var(--olive2)":order.status==="in_transit"?"var(--terra2)":order.status==="preparing"?"var(--honey)":"var(--blue)"}}>{order.status}</span>
                  </div>
                  <div style={{fontSize:14,color:"var(--bark)",marginBottom:4}}><strong>{order.customerName}</strong> • {order.restaurantName}</div>
                  <div style={{fontSize:13,color:"var(--clay2)"}}>{order.building} • {order.time}</div>
                  {order.deliveryAssignment&&<div style={{fontSize:12,color:"var(--olive2)",marginTop:4}}>🚴 {DELIVERY_TEAM.find(d=>d.id===order.deliveryAssignment)?.name}</div>}
                </div>
                <div style={{textAlign:"right"}} onClick={()=>setSelectedOrder(order)}>
                  <div style={{fontSize:20,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)"}}>${order.total.toFixed(2)}</div>
                  <div style={{fontSize:12,color:"var(--clay2)",marginTop:4}}>{order.items.length} item(s)</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Navigation */}
        {totalPages>1&&(
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,marginTop:32}}>
            <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} style={{padding:"10px 16px",background:currentPage===1?"var(--bg2)":"var(--bark)",color:currentPage===1?"var(--clay2)":"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:currentPage===1?"not-allowed":"pointer",opacity:currentPage===1?0.5:1}}>← Previous</button>

            <div style={{display:"flex",gap:6}}>
              {Array.from({length:totalPages},(_,i)=>i+1).filter(page=>{
                if(totalPages<=7)return true;
                if(page===1||page===totalPages)return true;
                if(page>=currentPage-1&&page<=currentPage+1)return true;
                return false;
              }).map((page,idx,arr)=>(
                <div key={page} style={{display:"flex",gap:6,alignItems:"center"}}>
                  {idx>0&&arr[idx-1]!==page-1&&<span style={{padding:"10px 8px",color:"var(--clay2)"}}>...</span>}
                  <button onClick={()=>setCurrentPage(page)} style={{padding:"10px 14px",background:currentPage===page?"var(--terra)":"#fff",color:currentPage===page?"#fff":"var(--bark)",border:`1px solid ${currentPage===page?"var(--terra)":"var(--sand)"}`,borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",minWidth:42}}>{page}</button>
                </div>
              ))}
            </div>

            <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} style={{padding:"10px 16px",background:currentPage===totalPages?"var(--bg2)":"var(--bark)",color:currentPage===totalPages?"var(--clay2)":"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:currentPage===totalPages?"not-allowed":"pointer",opacity:currentPage===totalPages?0.5:1}}>Next →</button>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder&&(
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>setSelectedOrder(null)}>
            <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:600,width:"90%",maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:24}}>Order Details</h2>

              <div style={{marginBottom:24}}>
                <div style={{marginBottom:16}}><strong>Order ID:</strong> {selectedOrder.id}</div>
                <div style={{marginBottom:16}}><strong>Customer:</strong> {selectedOrder.customerName}</div>
                <div style={{marginBottom:16}}><strong>Restaurant:</strong> {selectedOrder.restaurantName}</div>
                <div style={{marginBottom:16}}><strong>Building:</strong> {selectedOrder.building}</div>
                <div style={{marginBottom:16}}><strong>Address:</strong> {selectedOrder.address}</div>
                <div style={{marginBottom:16}}><strong>Time:</strong> {selectedOrder.time}</div>
                <div style={{marginBottom:16}}><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</div>
                <div style={{marginBottom:16}}><strong>Items:</strong> {selectedOrder.items.map(i=>i.name).join(", ")}</div>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Update Status</label>
                <select value={selectedOrder.status} onChange={e=>updateOrderStatus(selectedOrder.id,e.target.value)} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}}>
                  <option value="placed">Placed</option>
                  <option value="batched">Batched</option>
                  <option value="preparing">Preparing</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Assign Delivery Team</label>
                <select value={selectedOrder.deliveryAssignment||""} onChange={e=>assignDelivery(selectedOrder.id,e.target.value)} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}}>
                  <option value="">Unassigned</option>
                  {DELIVERY_TEAM.map(d=>(
                    <option key={d.id} value={d.id}>{d.name} ({d.activeOrders} active)</option>
                  ))}
                </select>
              </div>

              {/* Refund/Cancel Actions */}
              {selectedOrder.status!=="delivered"&&selectedOrder.status!=="cancelled"&&selectedOrder.status!=="refunded"&&(
                <div style={{marginBottom:24,padding:16,background:"var(--bg2)",borderRadius:12,border:"1px solid var(--sand)"}}>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Order Actions</div>
                  <div style={{display:"flex",gap:12}}>
                    <button onClick={()=>{setShowCancelForm(true);setCancelReason("");}} style={{flex:1,padding:"10px",background:"var(--honey)",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancel Order</button>
                    <button onClick={()=>{setShowRefundForm(true);setRefundAmount(selectedOrder.total.toString());setRefundReason("");}} style={{flex:1,padding:"10px",background:"var(--red)",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Issue Refund</button>
                  </div>
                </div>
              )}

              {selectedOrder.status==="cancelled"&&(
                <div style={{marginBottom:24,padding:16,background:"var(--honey-bg)",borderRadius:12,border:"2px solid var(--honey)"}}>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--honey2)"}}>⚠️ Order Cancelled</div>
                  {selectedOrder.cancelReason&&<div style={{fontSize:13,color:"var(--clay2)",marginTop:4}}>Reason: {selectedOrder.cancelReason}</div>}
                </div>
              )}

              {selectedOrder.status==="refunded"&&(
                <div style={{marginBottom:24,padding:16,background:"var(--red-bg)",borderRadius:12,border:"2px solid var(--red)"}}>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--red2)"}}>💰 Refund Processed</div>
                  {selectedOrder.refundAmount&&<div style={{fontSize:13,color:"var(--clay2)",marginTop:4}}>Amount: ${selectedOrder.refundAmount.toFixed(2)}</div>}
                </div>
              )}

              {/* Cancel Form */}
              {showCancelForm&&(
                <div style={{marginBottom:16,padding:16,background:"var(--honey-bg)",borderRadius:12}}>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Cancel Order</div>
                  <textarea value={cancelReason} onChange={e=>setCancelReason(e.target.value)} placeholder="Reason for cancellation..." style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:14,fontFamily:"var(--sans)",marginBottom:12,minHeight:80}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{if(cancelReason){cancelOrder(selectedOrder.id,cancelReason);setShowCancelForm(false);setSelectedOrder(null);}}} style={{flex:1,padding:"10px",background:"var(--honey)",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Confirm Cancel</button>
                    <button onClick={()=>setShowCancelForm(false)} style={{flex:1,padding:"10px",background:"var(--bg2)",color:"var(--bark)",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Nevermind</button>
                  </div>
                </div>
              )}

              {/* Refund Form */}
              {showRefundForm&&(
                <div style={{marginBottom:16,padding:16,background:"var(--red-bg)",borderRadius:12}}>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Issue Refund</div>
                  <div style={{marginBottom:12}}>
                    <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:4}}>Refund Amount ($)</label>
                    <input type="number" step="0.01" value={refundAmount} onChange={e=>setRefundAmount(e.target.value)} style={{width:"100%",padding:"10px",borderRadius:8,border:"1px solid var(--sand)",fontSize:14}}/>
                  </div>
                  <textarea value={refundReason} onChange={e=>setRefundReason(e.target.value)} placeholder="Reason for refund..." style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:14,fontFamily:"var(--sans)",marginBottom:12,minHeight:80}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{if(refundAmount&&refundReason){processRefund(selectedOrder.id,parseFloat(refundAmount),refundReason);setShowRefundForm(false);setSelectedOrder(null);}}} style={{flex:1,padding:"10px",background:"var(--red)",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Process Refund</button>
                    <button onClick={()=>setShowRefundForm(false)} style={{flex:1,padding:"10px",background:"var(--bg2)",color:"var(--bark)",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancel</button>
                  </div>
                </div>
              )}

              <button onClick={()=>{setSelectedOrder(null);setShowRefundForm(false);setShowCancelForm(false);}} style={{width:"100%",padding:"12px 24px",background:"var(--terra)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>Close</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function AdminRestaurants(){
  const {adminRestaurants,adminPendingRestaurants,adminOrders,approveRestaurant,rejectRestaurant,updateRestaurantMenu}=useContext(AppCtx);
  const [filter,setFilter]=useState("all");
  const [cuisineFilter,setCuisineFilter]=useState("all");
  const [selectedRestaurant,setSelectedRestaurant]=useState(null);
  const [modalTab,setModalTab]=useState("details");
  const [editingMenu,setEditingMenu]=useState(false);
  const [menuItems,setMenuItems]=useState([]);

  const allRestaurants=[...adminRestaurants,...adminPendingRestaurants];

  // Get unique cuisines
  const uniqueCuisines=[...new Set(allRestaurants.map(r=>r.cuisine))];

  // Apply status filter first
  let statusFiltered=filter==="all"?allRestaurants:filter==="pending"?adminPendingRestaurants:adminRestaurants;

  // Then apply cuisine filter
  const filteredRestaurants=cuisineFilter==="all"?statusFiltered:statusFiltered.filter(r=>r.cuisine===cuisineFilter);

  return(
    <AdminLayout activeTab="restaurants">
      <div>
        <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:8}}>Restaurant Management</h1>
        <p style={{fontSize:16,color:"var(--clay2)",marginBottom:32}}>Manage restaurants and approve new partners</p>

        {/* Onboarding Pipeline */}
        {adminPendingRestaurants.length>0&&(
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Onboarding Pipeline</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
              {[
                {stage:"application_submitted",label:"Application",icon:"📝",color:"var(--blue)"},
                {stage:"documents_review",label:"Documents Review",icon:"📄",color:"var(--honey)"},
                {stage:"site_visit",label:"Site Visit",icon:"🏢",color:"var(--terra)"},
                {stage:"training_scheduled",label:"Training",icon:"📚",color:"var(--olive)"}
              ].map(({stage,label,icon,color})=>{
                const count=adminPendingRestaurants.filter(r=>r.onboardingStage===stage).length;
                return(
                  <div key={stage} onClick={()=>setFilter("pending")} className="glass-card" style={{padding:20,borderRadius:12,border:`2px solid ${color}33`,background:`${color}05`,cursor:"pointer",transition:"all .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                      <div style={{fontSize:28}}>{icon}</div>
                      <div style={{fontSize:24,fontWeight:700,color,fontFamily:"var(--serif)"}}>{count}</div>
                    </div>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:4}}>{label}</div>
                    <div style={{fontSize:11,color:"var(--clay2)"}}>
                      {count===0?"No pending":`${count} restaurant${count>1?"s":""}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",gap:12,marginBottom:16}}>
            <button onClick={()=>setFilter("all")} style={{padding:"10px 20px",background:filter==="all"?"var(--terra)":"var(--bg2)",color:filter==="all"?"#fff":"var(--bark)",border:"none",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>All ({allRestaurants.length})</button>
            <button onClick={()=>setFilter("active")} style={{padding:"10px 20px",background:filter==="active"?"var(--olive)":"var(--bg2)",color:filter==="active"?"#fff":"var(--bark)",border:"none",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>Active ({adminRestaurants.length})</button>
            <button onClick={()=>setFilter("pending")} style={{padding:"10px 20px",background:filter==="pending"?"var(--honey)":"var(--bg2)",color:filter==="pending"?"#fff":"var(--bark)",border:"none",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>Pending ({adminPendingRestaurants.length})</button>
          </div>

          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{fontSize:13,color:"var(--clay2)",padding:"8px 12px",background:"var(--bg2)",borderRadius:8,fontWeight:600}}>🍽️ Filter by Cuisine:</div>
            <select value={cuisineFilter} onChange={e=>setCuisineFilter(e.target.value)} style={{padding:"8px 14px",borderRadius:8,border:"1px solid var(--sand)",fontSize:14,outline:"none",fontFamily:"var(--sans)",cursor:"pointer",background:"#fff"}}>
              <option value="all">All Cuisines ({statusFiltered.length})</option>
              {uniqueCuisines.map(cuisine=>(
                <option key={cuisine} value={cuisine}>{cuisine} ({statusFiltered.filter(r=>r.cuisine===cuisine).length})</option>
              ))}
            </select>
            {cuisineFilter!=="all"&&(
              <button onClick={()=>setCuisineFilter("all")} style={{padding:"8px 16px",background:"var(--clay2)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>Clear Filter</button>
            )}
            <div style={{marginLeft:"auto",fontSize:14,color:"var(--clay2)"}}>Showing {filteredRestaurants.length} restaurants</div>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {filteredRestaurants.map(restaurant=>(
            <div key={restaurant.id} className="glass-card" style={{padding:20,borderRadius:16,border:"1px solid var(--sand)",cursor:"pointer",transition:"all .2s"}}
              onClick={()=>setSelectedRestaurant(restaurant)}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--terra)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--sand)"}>
              <img src={restaurant.img} alt={restaurant.name} style={{width:"100%",height:150,objectFit:"cover",borderRadius:12,marginBottom:16}}/>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <h3 style={{fontSize:18,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)",flex:1}}>{restaurant.name}</h3>
                {restaurant.status==="pending"&&<span style={{padding:"4px 10px",borderRadius:100,fontSize:11,fontWeight:600,background:"var(--honey-bg)",color:"var(--honey)"}}>Pending</span>}
              </div>
              <div style={{fontSize:14,color:"var(--clay2)",marginBottom:8}}>{restaurant.cuisine}</div>
              {restaurant.rating>0&&<div style={{fontSize:13,color:"var(--olive2)"}}> ★ {restaurant.rating} • {restaurant.orders||0} orders</div>}
            </div>
          ))}
        </div>

        {/* Enhanced Restaurant Detail Modal */}
        {selectedRestaurant&&(()=>{
          const restOrders=adminOrders.filter(o=>o.restaurantName===selectedRestaurant.name);
          const restRevenue=restOrders.reduce((sum,o)=>sum+o.total,0);
          const avgOrderValue=restOrders.length>0?restRevenue/restOrders.length:0;
          const completedOrders=restOrders.filter(o=>o.status==="delivered").length;
          const completionRate=restOrders.length>0?(completedOrders/restOrders.length*100):0;

          return(
            <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>{setSelectedRestaurant(null);setModalTab("details");}}>
              <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:900,width:"90%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:24}}>
                  <div>
                    <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:8}}>{selectedRestaurant.name}</h2>
                    <div style={{fontSize:14,color:"var(--clay2)"}}>{selectedRestaurant.cuisine}</div>
                  </div>
                  <button onClick={()=>{setSelectedRestaurant(null);setModalTab("details");}} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"var(--clay2)"}}>×</button>
                </div>

                {/* Tabs */}
                <div style={{display:"flex",gap:12,marginBottom:24,borderBottom:"2px solid var(--sand)"}}>
                  {[
                    {key:"details",label:"Details",icon:"📋"},
                    ...(selectedRestaurant.status==="pending"?[{key:"onboarding",label:"Onboarding",icon:"📋"}]:[]),
                    {key:"menu",label:"Menu",icon:"🍽️"},
                    ...(selectedRestaurant.status!=="pending"?[{key:"performance",label:"Performance",icon:"📊"}]:[]),
                    ...(selectedRestaurant.status!=="pending"?[{key:"orders",label:"Orders",icon:"📦"}]:[])
                  ].map(tab=>(
                    <button key={tab.key} onClick={()=>setModalTab(tab.key)} style={{padding:"12px 20px",background:"none",border:"none",borderBottom:modalTab===tab.key?"3px solid var(--terra)":"none",fontSize:14,fontWeight:600,color:modalTab===tab.key?"var(--terra)":"var(--clay2)",cursor:"pointer",marginBottom:-2}}>{tab.icon} {tab.label}</button>
                  ))}
                </div>

                {/* Details Tab */}
                {modalTab==="details"&&(
                  <div>
                    <img src={selectedRestaurant.img} alt={selectedRestaurant.name} style={{width:"100%",height:200,objectFit:"cover",borderRadius:16,marginBottom:20}}/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
                      <div><strong>Rating:</strong> {selectedRestaurant.rating}/5 ⭐</div>
                      <div><strong>Delivery Time:</strong> {selectedRestaurant.time} min</div>
                      <div><strong>Max Capacity:</strong> {selectedRestaurant.maxDaily} orders/day</div>
                      <div><strong>Total Orders:</strong> {selectedRestaurant.orders||0}</div>
                      {selectedRestaurant.contactEmail&&<div><strong>Email:</strong> {selectedRestaurant.contactEmail}</div>}
                      {selectedRestaurant.contactPhone&&<div><strong>Phone:</strong> {selectedRestaurant.contactPhone}</div>}
                    </div>
                    {selectedRestaurant.status==="pending"&&(
                      <div style={{display:"flex",gap:12}}>
                        <button onClick={()=>{approveRestaurant(selectedRestaurant.id);setSelectedRestaurant(null);}} style={{flex:1,padding:"14px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>✓ Approve</button>
                        <button onClick={()=>{rejectRestaurant(selectedRestaurant.id);setSelectedRestaurant(null);}} style={{flex:1,padding:"14px",background:"var(--red)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>✗ Reject</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Onboarding Tab */}
                {modalTab==="onboarding"&&selectedRestaurant.status==="pending"&&(
                  <div>
                    <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Onboarding Progress</h3>

                    {/* Progress Bar */}
                    <div style={{marginBottom:32}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:14,fontWeight:600,color:"var(--bark)"}}>Overall Progress</span>
                        <span style={{fontSize:14,fontWeight:600,color:"var(--terra)"}}>{selectedRestaurant.onboardingProgress||0}%</span>
                      </div>
                      <div style={{height:12,background:"var(--bg2)",borderRadius:100,overflow:"hidden"}}>
                        <div style={{width:`${selectedRestaurant.onboardingProgress||0}%`,height:"100%",background:"linear-gradient(90deg, var(--terra), var(--olive))",transition:"width .5s"}}/>
                      </div>
                    </div>

                    {/* Onboarding Stages */}
                    <div style={{marginBottom:32}}>
                      <h4 style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Onboarding Stages</h4>
                      <div style={{position:"relative"}}>
                        {[
                          {key:"application_submitted",label:"Application Submitted",icon:"📝",progress:20},
                          {key:"documents_review",label:"Documents Review",icon:"📄",progress:40},
                          {key:"site_visit",label:"Site Visit Scheduled",icon:"🏢",progress:60},
                          {key:"training_scheduled",label:"Training Completed",icon:"📚",progress:80},
                          {key:"approved",label:"Go Live",icon:"🚀",progress:100}
                        ].map((stage,idx)=>{
                          const isComplete=selectedRestaurant.onboardingProgress>=stage.progress;
                          const isCurrent=selectedRestaurant.onboardingStage===stage.key;
                          return(
                            <div key={stage.key} style={{display:"flex",gap:16,marginBottom:idx<4?24:0}}>
                              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                <div style={{width:40,height:40,borderRadius:"50%",background:isComplete?"var(--olive)":isCurrent?"var(--terra)":"var(--bg2)",border:`2px solid ${isComplete?"var(--olive)":isCurrent?"var(--terra)":"var(--sand)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,transition:"all .3s"}}>
                                  {isComplete?"✓":stage.icon}
                                </div>
                                {idx<4&&<div style={{width:2,flex:1,background:isComplete?"var(--olive)":"var(--sand)",marginTop:8,marginBottom:8}}/>}
                              </div>
                              <div style={{flex:1,paddingTop:8}}>
                                <div style={{fontSize:15,fontWeight:600,color:isComplete||isCurrent?"var(--bark)":"var(--clay2)",marginBottom:4}}>{stage.label}</div>
                                <div style={{fontSize:12,color:"var(--clay2)"}}>
                                  {isComplete?"Completed":isCurrent?"In Progress":"Pending"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Documents Checklist */}
                    {selectedRestaurant.documents&&(
                      <div style={{marginBottom:32}}>
                        <h4 style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Required Documents</h4>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                          {[
                            {key:"businessLicense",label:"Business License"},
                            {key:"foodSafety",label:"Food Safety Certificate"},
                            {key:"insurance",label:"Liability Insurance"},
                            {key:"menu",label:"Menu Submission"}
                          ].map(doc=>(
                            <div key={doc.key} style={{padding:12,background:"var(--bg2)",borderRadius:8,display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:24,height:24,borderRadius:"50%",background:selectedRestaurant.documents[doc.key]?"var(--olive)":"var(--red)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700}}>
                                {selectedRestaurant.documents[doc.key]?"✓":"✗"}
                              </div>
                              <span style={{fontSize:13,color:"var(--bark)"}}>{doc.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact & Notes */}
                    <div style={{marginBottom:24}}>
                      <h4 style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Contact Information</h4>
                      <div style={{padding:16,background:"var(--bg2)",borderRadius:12}}>
                        <div style={{marginBottom:8}}><strong>Contact Person:</strong> {selectedRestaurant.contactPerson||"N/A"}</div>
                        <div style={{marginBottom:8}}><strong>Email:</strong> {selectedRestaurant.contactEmail}</div>
                        <div style={{marginBottom:8}}><strong>Phone:</strong> {selectedRestaurant.contactPhone}</div>
                        {selectedRestaurant.appliedDate&&<div><strong>Applied:</strong> {selectedRestaurant.appliedDate}</div>}
                      </div>
                    </div>

                    {selectedRestaurant.notes&&(
                      <div style={{marginBottom:24}}>
                        <h4 style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Notes</h4>
                        <div style={{padding:16,background:"var(--honey-bg)",border:"1px solid var(--honey)",borderRadius:12,fontSize:14,color:"var(--bark)"}}>
                          {selectedRestaurant.notes}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{display:"flex",gap:12}}>
                      <button onClick={()=>{approveRestaurant(selectedRestaurant.id);setSelectedRestaurant(null);}} style={{flex:1,padding:"14px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>✓ Approve & Go Live</button>
                      <button onClick={()=>{rejectRestaurant(selectedRestaurant.id);setSelectedRestaurant(null);}} style={{padding:"14px 20px",background:"var(--red)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>✗ Reject</button>
                    </div>
                  </div>
                )}

                {/* Menu Tab */}
                {modalTab==="menu"&&(()=>{
                  const restaurantMenu=adminMenu[selectedRestaurant.id]||[];
                  const totalItems=restaurantMenu.reduce((sum,cat)=>sum+cat.items.length,0);

                  return(
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                        <div>
                          <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)"}}>Menu Items</h3>
                          <div style={{fontSize:13,color:"var(--clay2)",marginTop:4}}>{totalItems} items across {restaurantMenu.length} categories</div>
                        </div>
                        <button onClick={()=>setEditingMenuItem("new")} style={{padding:"10px 16px",background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>+ Add Item</button>
                      </div>

                      {/* Add/Edit Item Form */}
                      {editingMenuItem&&(
                        <div style={{background:"var(--bg2)",padding:20,borderRadius:12,marginBottom:20,border:"2px solid var(--terra)"}}>
                          <h4 style={{fontSize:16,fontWeight:600,color:"var(--bark)",marginBottom:16}}>{editingMenuItem==="new"?"Add New Item":"Edit Item"}</h4>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                            <div>
                              <label style={{display:"block",fontSize:13,color:"var(--clay2)",marginBottom:4}}>Item Name *</label>
                              <input value={menuItemForm.name} onChange={e=>setMenuItemForm(prev=>({...prev,name:e.target.value}))} style={{width:"100%",padding:"10px 12px",border:"1px solid var(--sand)",borderRadius:8,fontSize:14}} placeholder="e.g., Buddha Bowl"/>
                            </div>
                            <div>
                              <label style={{display:"block",fontSize:13,color:"var(--clay2)",marginBottom:4}}>Category *</label>
                              <input value={menuItemForm.category} onChange={e=>setMenuItemForm(prev=>({...prev,category:e.target.value}))} style={{width:"100%",padding:"10px 12px",border:"1px solid var(--sand)",borderRadius:8,fontSize:14}} placeholder="e.g., Bowls"/>
                            </div>
                            <div>
                              <label style={{display:"block",fontSize:13,color:"var(--clay2)",marginBottom:4}}>Price ($) *</label>
                              <input type="number" step="0.01" value={menuItemForm.price} onChange={e=>setMenuItemForm(prev=>({...prev,price:e.target.value}))} style={{width:"100%",padding:"10px 12px",border:"1px solid var(--sand)",borderRadius:8,fontSize:14}} placeholder="16.50"/>
                            </div>
                            <div>
                              <label style={{display:"block",fontSize:13,color:"var(--clay2)",marginBottom:4}}>Calories</label>
                              <input type="number" value={menuItemForm.cal} onChange={e=>setMenuItemForm(prev=>({...prev,cal:e.target.value}))} style={{width:"100%",padding:"10px 12px",border:"1px solid var(--sand)",borderRadius:8,fontSize:14}} placeholder="520"/>
                            </div>
                          </div>
                          <div style={{marginBottom:12}}>
                            <label style={{display:"block",fontSize:13,color:"var(--clay2)",marginBottom:4}}>Description *</label>
                            <textarea value={menuItemForm.desc} onChange={e=>setMenuItemForm(prev=>({...prev,desc:e.target.value}))} style={{width:"100%",padding:"10px 12px",border:"1px solid var(--sand)",borderRadius:8,fontSize:14,fontFamily:"inherit",resize:"vertical",minHeight:60}} placeholder="Describe the dish..."/>
                          </div>
                          <div style={{marginBottom:16}}>
                            <label style={{display:"block",fontSize:13,color:"var(--clay2)",marginBottom:6}}>Dietary Tags</label>
                            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                              {["V","VG","GF","DF"].map(flag=>(
                                <button key={flag} onClick={()=>setMenuItemForm(prev=>({...prev,flags:prev.flags.includes(flag)?prev.flags.filter(f=>f!==flag):[...prev.flags,flag]}))} style={{padding:"6px 12px",background:menuItemForm.flags.includes(flag)?"var(--olive)":"#fff",color:menuItemForm.flags.includes(flag)?"#fff":"var(--bark)",border:`1px solid ${menuItemForm.flags.includes(flag)?"var(--olive)":"var(--sand)"}`,borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>{flag==="V"?"Vegetarian":flag==="VG"?"Vegan":flag==="GF"?"Gluten-Free":"Dairy-Free"}</button>
                              ))}
                            </div>
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={()=>{
                              if(!menuItemForm.name||!menuItemForm.price||!menuItemForm.category||!menuItemForm.desc){
                                showToast("Please fill in all required fields");
                                return;
                              }
                              if(editingMenuItem==="new"){
                                addMenuItem(selectedRestaurant.id,menuItemForm.category,menuItemForm);
                              }else{
                                updateMenuItem(selectedRestaurant.id,editingMenuItem,menuItemForm);
                              }
                              setEditingMenuItem(null);
                            }} style={{flex:1,padding:"10px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Save Item</button>
                            <button onClick={()=>{setEditingMenuItem(null);setMenuItemForm({name:"",desc:"",price:"",cal:"",category:"",flags:[]});}} style={{padding:"10px 20px",background:"#fff",color:"var(--bark)",border:"1px solid var(--sand)",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancel</button>
                          </div>
                        </div>
                      )}

                      {/* Menu Categories */}
                      {restaurantMenu.length===0?(
                        <div style={{padding:40,textAlign:"center",background:"var(--bg2)",borderRadius:12}}>
                          <div style={{fontSize:48,marginBottom:12}}>🍽️</div>
                          <div style={{fontSize:16,color:"var(--bark)",marginBottom:6}}>No menu items yet</div>
                          <div style={{fontSize:14,color:"var(--clay2)"}}>Click "Add Item" to create the first menu item</div>
                        </div>
                      ):(
                        <div style={{display:"flex",flexDirection:"column",gap:20}}>
                          {restaurantMenu.map(category=>(
                            <div key={category.cat} style={{background:"#fff",border:"1px solid var(--sand)",borderRadius:12,padding:16}}>
                              <div style={{fontSize:16,fontWeight:600,color:"var(--bark)",marginBottom:12,paddingBottom:8,borderBottom:"1px solid var(--sand)"}}>{category.cat} ({category.items.length})</div>
                              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                                {category.items.map(item=>(
                                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:item.available===false?"#f9f9f9":"#fff",border:"1px solid var(--sand)",borderRadius:8,opacity:item.available===false?0.6:1}}>
                                    <div style={{flex:1}}>
                                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                                        <div style={{fontSize:15,fontWeight:600,color:"var(--bark)"}}>{item.name}</div>
                                        {item.flags&&item.flags.length>0&&(
                                          <div style={{display:"flex",gap:4}}>
                                            {item.flags.map(f=><span key={f} style={{fontSize:10,padding:"2px 6px",background:"var(--olive)",color:"#fff",borderRadius:4,fontWeight:600}}>{f}</span>)}
                                          </div>
                                        )}
                                        {item.available===false&&<span style={{fontSize:11,padding:"2px 8px",background:"var(--red)",color:"#fff",borderRadius:4,fontWeight:600}}>Unavailable</span>}
                                      </div>
                                      <div style={{fontSize:13,color:"var(--clay2)",marginBottom:4}}>{item.desc}</div>
                                      <div style={{fontSize:13,color:"var(--bark)",fontWeight:600}}>${item.price.toFixed(2)} {item.cal?`• ${item.cal} cal`:""}</div>
                                    </div>
                                    <div style={{display:"flex",gap:6}}>
                                      <button onClick={()=>toggleMenuItemAvailability(selectedRestaurant.id,item.id,item.available!==false)} title={item.available===false?"Mark as available":"Mark as unavailable"} style={{padding:"8px 12px",background:item.available===false?"var(--olive)":"var(--honey)",color:"#fff",border:"none",borderRadius:6,fontSize:12,cursor:"pointer",fontWeight:600}}>{item.available===false?"✓":"−"}</button>
                                      <button onClick={()=>{setEditingMenuItem(item.id);setMenuItemForm({name:item.name,desc:item.desc,price:item.price.toString(),cal:item.cal?.toString()||"",category:category.cat,flags:item.flags||[]});}} style={{padding:"8px 12px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:6,fontSize:12,cursor:"pointer"}}>Edit</button>
                                      <button onClick={()=>deleteMenuItem(selectedRestaurant.id,item.id,item.name)} style={{padding:"8px 12px",background:"var(--red)",color:"#fff",border:"none",borderRadius:6,fontSize:12,cursor:"pointer"}}>Delete</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Performance Tab */}
                {modalTab==="performance"&&(
                  <div>
                    <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Performance Metrics</h3>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
                      <div className="glass-card" style={{padding:20,borderRadius:12,border:"2px solid var(--olive)",textAlign:"center"}}>
                        <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Total Revenue</div>
                        <div style={{fontSize:28,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>${restRevenue.toFixed(2)}</div>
                      </div>
                      <div className="glass-card" style={{padding:20,borderRadius:12,border:"2px solid var(--terra)",textAlign:"center"}}>
                        <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Avg Order Value</div>
                        <div style={{fontSize:28,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)"}}>${avgOrderValue.toFixed(2)}</div>
                      </div>
                      <div className="glass-card" style={{padding:20,borderRadius:12,border:"2px solid var(--blue)",textAlign:"center"}}>
                        <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Completion Rate</div>
                        <div style={{fontSize:28,fontWeight:700,color:"var(--blue)",fontFamily:"var(--serif)"}}>{completionRate.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div style={{padding:16,background:"var(--bg2)",borderRadius:12}}>
                      <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Order Statistics</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        <div style={{fontSize:13,color:"var(--clay2)"}}>Total Orders: <strong>{restOrders.length}</strong></div>
                        <div style={{fontSize:13,color:"var(--clay2)"}}>Completed: <strong>{completedOrders}</strong></div>
                        <div style={{fontSize:13,color:"var(--clay2)"}}>In Progress: <strong>{restOrders.filter(o=>o.status!=="delivered").length}</strong></div>
                        <div style={{fontSize:13,color:"var(--clay2)"}}>Avg Prep Time: <strong>{selectedRestaurant.time} min</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {modalTab==="orders"&&(
                  <div>
                    <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Recent Orders ({restOrders.length})</h3>
                    <div style={{maxHeight:400,overflowY:"auto"}}>
                      {restOrders.slice(0,10).map(order=>(
                        <div key={order.id} style={{padding:12,marginBottom:8,background:"var(--bg2)",borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:4}}>{order.id}</div>
                            <div style={{fontSize:12,color:"var(--clay2)"}}>{ order.customerName} • {order.building}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:16,fontWeight:700,color:"var(--terra)"}}>${order.total.toFixed(2)}</div>
                            <div style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:order.status==="delivered"?"var(--olive-bg)":"var(--honey-bg)",color:order.status==="delivered"?"var(--olive)":"var(--honey)",fontWeight:600,display:"inline-block"}}>{order.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </AdminLayout>
  );
}

function AdminUsers(){
  const {updateUserSubscription,adminOrders,showToast}=useContext(AppCtx);
  const [searchQuery,setSearchQuery]=useState("");
  const [roleFilter,setRoleFilter]=useState("all");
  const [selectedUser,setSelectedUser]=useState(null);
  const [showCodeManager,setShowCodeManager]=useState(false);
  const [userModalTab,setUserModalTab]=useState("details");
  const [showAddUser,setShowAddUser]=useState(false);
  const [newUser,setNewUser]=useState({name:"",email:"",subscription:"Free",building:"One Market Plaza",companyCode:""});

  const filteredUsers=ALL_USERS.filter(u=>{
    const matchesSearch=searchQuery===""||u.name.toLowerCase().includes(searchQuery.toLowerCase())||u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole=roleFilter==="all"||u.subscription===roleFilter;
    return matchesSearch&&matchesRole;
  });

  return(
    <AdminLayout activeTab="users">
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:32}}>
          <div>
            <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:8}}>User Management</h1>
            <p style={{fontSize:16,color:"var(--clay2)"}}>Manage users, subscriptions, and company codes</p>
          </div>
          <button onClick={()=>setShowAddUser(true)} style={{padding:"12px 24px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>+ Add User</button>
        </div>

        {/* User Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Total Users</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)"}}>{ALL_USERS.length}</div>
          </div>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--terra)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Lunch Pass</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)"}}>{ALL_USERS.filter(u=>u.subscription==="Lunch Pass").length}</div>
          </div>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--olive)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Team Plan</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>{ALL_USERS.filter(u=>u.subscription==="Team Plan").length}</div>
          </div>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--blue)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Avg LTV</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--blue)",fontFamily:"var(--serif)"}}>${(ALL_USERS.reduce((s,u)=>s+u.totalSpent,0)/ALL_USERS.length).toFixed(0)}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{display:"flex",gap:16,marginBottom:24}}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
            style={{flex:1,padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)"}}
          />
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} style={{padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}}>
            <option value="all">All Subscriptions</option>
            <option value="Free">Free</option>
            <option value="Lunch Pass">Lunch Pass</option>
            <option value="Team Plan">Team Plan</option>
          </select>
        </div>

        <div style={{fontSize:14,color:"var(--clay2)",marginBottom:16}}>Showing {filteredUsers.length} users</div>

        {/* Users Table */}
        <div className="glass-card" style={{padding:0,borderRadius:16,border:"1px solid var(--sand)",overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead style={{background:"var(--bg2)"}}>
              <tr>
                <th style={{padding:"16px 20px",textAlign:"left",fontSize:13,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase"}}>Name</th>
                <th style={{padding:"16px 20px",textAlign:"left",fontSize:13,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase"}}>Email</th>
                <th style={{padding:"16px 20px",textAlign:"left",fontSize:13,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase"}}>Subscription</th>
                <th style={{padding:"16px 20px",textAlign:"left",fontSize:13,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase"}}>Orders</th>
                <th style={{padding:"16px 20px",textAlign:"left",fontSize:13,fontWeight:600,color:"var(--clay2)",textTransform:"uppercase"}}>Spent</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u,i)=>(
                <tr key={u.id} onClick={()=>setSelectedUser(u)} style={{borderTop:i>0?"1px solid var(--sand)":"none",cursor:"pointer",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"16px 20px",fontSize:14,color:"var(--bark)",fontWeight:600}}>{u.name}</td>
                  <td style={{padding:"16px 20px",fontSize:14,color:"var(--clay2)"}}>{u.email}</td>
                  <td style={{padding:"16px 20px"}}>
                    <span style={{padding:"4px 12px",borderRadius:100,fontSize:12,fontWeight:600,background:u.subscription==="Lunch Pass"?"var(--terra-g)":u.subscription==="Team Plan"?"var(--olive-bg)":"var(--bg2)",color:u.subscription==="Lunch Pass"?"var(--terra)":u.subscription==="Team Plan"?"var(--olive)":"var(--clay2)"}}>{u.subscription}</span>
                  </td>
                  <td style={{padding:"16px 20px",fontSize:14,color:"var(--bark)"}}>{u.totalOrders}</td>
                  <td style={{padding:"16px 20px",fontSize:14,color:"var(--olive2)",fontWeight:600}}>${u.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced User Detail Modal */}
        {selectedUser&&(()=>{
          const userOrders=adminOrders.filter(o=>o.customerName===selectedUser.name);
          const userRevenue=userOrders.reduce((sum,o)=>sum+o.total,0);
          const avgOrderValue=userOrders.length>0?userRevenue/userOrders.length:0;

          return(
            <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>{setSelectedUser(null);setUserModalTab("details");}}>
              <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:800,width:"90%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:24}}>
                  <div>
                    <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:4}}>{selectedUser.name}</h2>
                    <div style={{fontSize:14,color:"var(--clay2)"}}>{selectedUser.email}</div>
                  </div>
                  <button onClick={()=>{setSelectedUser(null);setUserModalTab("details");}} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"var(--clay2)"}}>×</button>
                </div>

                {/* Tabs */}
                <div style={{display:"flex",gap:12,marginBottom:24,borderBottom:"2px solid var(--sand)"}}>
                  {[
                    {key:"details",label:"Details",icon:"👤"},
                    {key:"orders",label:"Orders",icon:"📦"},
                    {key:"activity",label:"Activity",icon:"📊"}
                  ].map(tab=>(
                    <button key={tab.key} onClick={()=>setUserModalTab(tab.key)} style={{padding:"12px 20px",background:"none",border:"none",borderBottom:userModalTab===tab.key?"3px solid var(--terra)":"none",fontSize:14,fontWeight:600,color:userModalTab===tab.key?"var(--terra)":"var(--clay2)",cursor:"pointer",marginBottom:-2}}>{tab.icon} {tab.label}</button>
                  ))}
                </div>

                {/* Details Tab */}
                {userModalTab==="details"&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
                      <div><strong>Email:</strong> {selectedUser.email}</div>
                      <div><strong>Company Code:</strong> {selectedUser.companyCode||"None"}</div>
                      <div><strong>Building:</strong> {selectedUser.building}</div>
                      <div><strong>Join Date:</strong> {selectedUser.joinDate}</div>
                      <div><strong>Total Orders:</strong> {selectedUser.totalOrders}</div>
                      <div><strong>Total Spent:</strong> <span style={{color:"var(--olive2)",fontWeight:600}}>${selectedUser.totalSpent.toFixed(2)}</span></div>
                      <div><strong>Last Order:</strong> {selectedUser.lastOrder||"Never"}</div>
                      <div><strong>Avg Order Value:</strong> ${avgOrderValue.toFixed(2)}</div>
                    </div>

                    <div style={{marginBottom:24}}>
                      <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Subscription</label>
                      <select value={selectedUser.subscription} onChange={e=>{updateUserSubscription(selectedUser.id,e.target.value);showToast("Subscription updated");}} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}}>
                        <option value="Free">Free ($0/month)</option>
                        <option value="Lunch Pass">Lunch Pass ($15/month)</option>
                        <option value="Team Plan">Team Plan ($12/month)</option>
                      </select>
                    </div>

                    <div style={{display:"flex",gap:12}}>
                      <button onClick={()=>showToast("User suspended")} style={{flex:1,padding:"12px",background:"var(--red)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer"}}>Suspend User</button>
                      <button onClick={()=>showToast("Password reset email sent")} style={{flex:1,padding:"12px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer"}}>Reset Password</button>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {userModalTab==="orders"&&(
                  <div>
                    <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Order History ({userOrders.length} orders)</h3>
                    {userOrders.length===0?(
                      <div style={{padding:40,textAlign:"center",color:"var(--clay2)"}}>No orders yet</div>
                    ):(
                      <div style={{maxHeight:400,overflowY:"auto"}}>
                        {userOrders.slice(0,20).map(order=>(
                          <div key={order.id} style={{padding:14,marginBottom:10,background:"var(--bg2)",borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div style={{flex:1}}>
                              <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:4}}>{order.id} • {order.restaurantName}</div>
                              <div style={{fontSize:12,color:"var(--clay2)"}}>{ order.date} • {order.time} • {order.building}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:18,fontWeight:700,color:"var(--terra)",marginBottom:4}}>${order.total.toFixed(2)}</div>
                              <div style={{fontSize:11,padding:"3px 10px",borderRadius:6,background:order.status==="delivered"?"var(--olive-bg)":"var(--honey-bg)",color:order.status==="delivered"?"var(--olive)":"var(--honey)",fontWeight:600,display:"inline-block"}}>{order.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Activity Tab */}
                {userModalTab==="activity"&&(
                  <div>
                    <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Activity & Insights</h3>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
                      <div className="glass-card" style={{padding:16,borderRadius:12,border:"1px solid var(--olive)",textAlign:"center"}}>
                        <div style={{fontSize:24,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)",marginBottom:4}}>{userOrders.filter(o=>o.status==="delivered").length}</div>
                        <div style={{fontSize:12,color:"var(--clay2)"}}>Completed Orders</div>
                      </div>
                      <div className="glass-card" style={{padding:16,borderRadius:12,border:"1px solid var(--terra)",textAlign:"center"}}>
                        <div style={{fontSize:24,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)",marginBottom:4}}>${userRevenue.toFixed(0)}</div>
                        <div style={{fontSize:12,color:"var(--clay2)"}}>Lifetime Value</div>
                      </div>
                      <div className="glass-card" style={{padding:16,borderRadius:12,border:"1px solid var(--blue)",textAlign:"center"}}>
                        <div style={{fontSize:24,fontWeight:700,color:"var(--blue)",fontFamily:"var(--serif)",marginBottom:4}}>{userOrders.length>0?Math.ceil((Date.now()-new Date(selectedUser.joinDate).getTime())/(1000*60*60*24)/userOrders.length):0}</div>
                        <div style={{fontSize:12,color:"var(--clay2)"}}>Days Between Orders</div>
                      </div>
                    </div>

                    <div style={{marginBottom:20}}>
                      <h4 style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Favorite Restaurants</h4>
                      {(() =>{
                        const restCounts={};
                        userOrders.forEach(o=>{restCounts[o.restaurantName]=(restCounts[o.restaurantName]||0)+1;});
                        const topRests=Object.entries(restCounts).sort((a,b)=>b[1]-a[1]).slice(0,3);
                        return topRests.map(([name,count])=>(
                          <div key={name} style={{padding:10,marginBottom:8,background:"var(--bg2)",borderRadius:8,display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:13,color:"var(--bark)"}}>{name}</span>
                            <span style={{fontSize:13,fontWeight:600,color:"var(--olive2)"}}>{count} orders</span>
                          </div>
                        ));
                      })()}
                    </div>

                    <div>
                      <h4 style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Recent Activity Timeline</h4>
                      <div style={{maxHeight:200,overflowY:"auto"}}>
                        {userOrders.slice(0,5).map((order,i)=>(
                          <div key={i} style={{display:"flex",gap:12,marginBottom:12}}>
                            <div style={{width:8,height:8,borderRadius:"50%",background:"var(--terra)",marginTop:6,flexShrink:0}}/>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,color:"var(--bark)",fontWeight:600}}>Ordered from {order.restaurantName}</div>
                              <div style={{fontSize:11,color:"var(--clay2)"}}>{order.date} • ${order.total.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Company Codes Section */}
        <div style={{marginTop:48}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:20}}>Company Codes</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {Object.entries(COMPANY_CODES).map(([code,data])=>(
              <div key={code} className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--sand)"}}>
                <div style={{fontSize:24,marginBottom:8}}>{data.logo}</div>
                <div style={{fontSize:14,fontWeight:700,color:"var(--bark)",marginBottom:4}}>{data.name}</div>
                <div style={{fontSize:12,color:"var(--clay2)",marginBottom:8}}>{code}</div>
                <div style={{fontSize:11,color:"var(--olive2)"}}>{data.benefits}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUser&&(
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>setShowAddUser(false)}>
            <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:500,width:"90%"}} onClick={e=>e.stopPropagation()}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:24}}>Add New User</h2>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:6}}>Name *</label>
                <input type="text" value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}} placeholder="John Doe"/>
              </div>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:6}}>Email *</label>
                <input type="email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}} placeholder="john@example.com"/>
              </div>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:6}}>Subscription</label>
                <select value={newUser.subscription} onChange={e=>setNewUser({...newUser,subscription:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15,cursor:"pointer"}}>
                  <option value="Free">Free</option>
                  <option value="Lunch Pass">Lunch Pass</option>
                  <option value="Team Plan">Team Plan</option>
                </select>
              </div>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:6}}>Building</label>
                <input type="text" value={newUser.building} onChange={e=>setNewUser({...newUser,building:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}} placeholder="One Market Plaza"/>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:6}}>Company Code (optional)</label>
                <input type="text" value={newUser.companyCode} onChange={e=>setNewUser({...newUser,companyCode:e.target.value.toUpperCase()})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}} placeholder="COMP2024"/>
              </div>

              <div style={{display:"flex",gap:12}}>
                <button onClick={()=>{
                  if(newUser.name&&newUser.email){
                    showToast(`User ${newUser.name} created successfully`);
                    setNewUser({name:"",email:"",subscription:"Free",building:"One Market Plaza",companyCode:""});
                    setShowAddUser(false);
                  }else{
                    showToast("Please fill in required fields");
                  }
                }} style={{flex:1,padding:"14px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>Create User</button>
                <button onClick={()=>setShowAddUser(false)} style={{flex:1,padding:"14px",background:"var(--bg2)",color:"var(--bark)",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function AdminDelivery(){
  const {adminDeliveryTeam,adminOrders,addDeliveryMember,updateDeliveryMemberStatus}=useContext(AppCtx);
  const [showAddForm,setShowAddForm]=useState(false);
  const [newMember,setNewMember]=useState({name:"",zone:"zone-a",phone:""});
  const [selectedMember,setSelectedMember]=useState(null);

  const handleAddMember=()=>{
    if(newMember.name&&newMember.phone){
      addDeliveryMember(newMember);
      setNewMember({name:"",zone:"zone-a",phone:""});
      setShowAddForm(false);
    }
  };

  const activeCount=adminDeliveryTeam.filter(m=>m.status==="active").length;
  const inactiveCount=adminDeliveryTeam.filter(m=>m.status==="inactive").length;

  return(
    <AdminLayout activeTab="delivery">
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <div>
            <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:8}}>Delivery Team</h1>
            <p style={{fontSize:16,color:"var(--clay2)"}}>Manage your in-house delivery team members</p>
          </div>
          <button onClick={()=>setShowAddForm(true)} style={{padding:"12px 24px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>+ Add Team Member</button>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:32}}>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Total Team Members</div>
            <div style={{fontSize:32,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)"}}>{adminDeliveryTeam.length}</div>
          </div>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--olive)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Active Drivers</div>
            <div style={{fontSize:32,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>{activeCount}</div>
          </div>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Inactive</div>
            <div style={{fontSize:32,fontWeight:700,color:"var(--clay2)",fontFamily:"var(--serif)"}}>{inactiveCount}</div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {adminDeliveryTeam.map(member=>(
            <div key={member.id} className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)",cursor:"pointer",transition:"all .2s"}}
              onClick={()=>setSelectedMember(member)}
              onMouseEnter={e=>e.currentTarget.style.borderColor="var(--olive)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--sand)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
                <div style={{fontSize:32}}>🚴</div>
                <span style={{padding:"4px 12px",borderRadius:100,fontSize:11,fontWeight:600,background:member.status==="active"?"var(--olive-bg)":"var(--bg2)",color:member.status==="active"?"var(--olive)":"var(--clay2)"}}>{member.status}</span>
              </div>
              <h3 style={{fontSize:18,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)",marginBottom:8}}>{member.name}</h3>
              <div style={{fontSize:13,color:"var(--clay2)",marginBottom:4}}>📍 {member.zone.replace("-"," ").toUpperCase()}</div>
              <div style={{fontSize:13,color:"var(--clay2)",marginBottom:4}}>📞 {member.phone}</div>
              <div style={{fontSize:13,color:"var(--olive2)",marginTop:8}}>{member.activeOrders} active orders</div>
            </div>
          ))}
        </div>

        {/* Add Member Modal */}
        {showAddForm&&(
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>setShowAddForm(false)}>
            <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:500,width:"90%"}} onClick={e=>e.stopPropagation()}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:24}}>Add Team Member</h2>

              <div style={{marginBottom:20}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter driver name"
                  value={newMember.name}
                  onChange={e=>setNewMember({...newMember,name:e.target.value})}
                  style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)"}}
                />
              </div>

              <div style={{marginBottom:20}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1-555-0000"
                  value={newMember.phone}
                  onChange={e=>setNewMember({...newMember,phone:e.target.value})}
                  style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)"}}
                />
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Delivery Zone</label>
                <select value={newMember.zone} onChange={e=>setNewMember({...newMember,zone:e.target.value})} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}}>
                  <option value="zone-a">Zone A (Financial District)</option>
                  <option value="zone-b">Zone B (SOMA)</option>
                  <option value="zone-c">Zone C (Downtown)</option>
                </select>
              </div>

              <div style={{display:"flex",gap:12}}>
                <button onClick={handleAddMember} style={{flex:1,padding:"14px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>Add Member</button>
                <button onClick={()=>setShowAddForm(false)} style={{flex:1,padding:"14px",background:"var(--bg2)",color:"var(--bark)",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Member Detail Modal with Performance */}
        {selectedMember&&(()=>{
          const memberOrders=adminOrders.filter(o=>o.deliveryAssignment===selectedMember.id);
          const completedDeliveries=memberOrders.filter(o=>o.status==="delivered").length;
          const totalEarnings=completedDeliveries*5.50; // $5.50 per delivery
          const avgDeliveryTime=18; // minutes (simulated)
          const customerRating=4.7; // out of 5 (simulated)

          return(
            <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>setSelectedMember(null)}>
              <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:700,width:"90%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:24}}>
                  <div>
                    <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:4}}>{selectedMember.name}</h2>
                    <div style={{fontSize:14,color:"var(--clay2)"}}>Driver Performance Dashboard</div>
                  </div>
                  <button onClick={()=>setSelectedMember(null)} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"var(--clay2)"}}>×</button>
                </div>

                {/* Performance Metrics */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
                  <div className="glass-card" style={{padding:16,borderRadius:12,border:"2px solid var(--olive)",textAlign:"center"}}>
                    <div style={{fontSize:11,color:"var(--clay2)",marginBottom:4}}>Total Earnings</div>
                    <div style={{fontSize:24,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>${totalEarnings.toFixed(2)}</div>
                  </div>
                  <div className="glass-card" style={{padding:16,borderRadius:12,border:"2px solid var(--terra)",textAlign:"center"}}>
                    <div style={{fontSize:11,color:"var(--clay2)",marginBottom:4}}>Completed</div>
                    <div style={{fontSize:24,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)"}}>{completedDeliveries}</div>
                  </div>
                  <div className="glass-card" style={{padding:16,borderRadius:12,border:"2px solid var(--blue)",textAlign:"center"}}>
                    <div style={{fontSize:11,color:"var(--clay2)",marginBottom:4}}>Avg Time</div>
                    <div style={{fontSize:24,fontWeight:700,color:"var(--blue)",fontFamily:"var(--serif)"}}>{avgDeliveryTime}m</div>
                  </div>
                  <div className="glass-card" style={{padding:16,borderRadius:12,border:"2px solid var(--honey)",textAlign:"center"}}>
                    <div style={{fontSize:11,color:"var(--clay2)",marginBottom:4}}>Rating</div>
                    <div style={{fontSize:24,fontWeight:700,color:"var(--honey)",fontFamily:"var(--serif)"}}>{customerRating} ⭐</div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--sand)",marginBottom:24}}>
                  <h3 style={{fontSize:16,fontWeight:600,color:"var(--bark)",marginBottom:16}}>Driver Information</h3>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div><strong>Phone:</strong> {selectedMember.phone}</div>
                    <div><strong>Zone:</strong> {selectedMember.zone.replace("-"," ").toUpperCase()}</div>
                    <div><strong>Active Orders:</strong> {selectedMember.activeOrders}</div>
                    <div><strong>Joined:</strong> {selectedMember.joinedDate}</div>
                    <div><strong>Total Deliveries:</strong> {memberOrders.length}</div>
                    <div><strong>Success Rate:</strong> {memberOrders.length>0?((completedDeliveries/memberOrders.length)*100).toFixed(1):0}%</div>
                  </div>
                </div>

                {/* Recent Deliveries */}
                <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--sand)",marginBottom:24}}>
                  <h3 style={{fontSize:16,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Recent Deliveries ({memberOrders.length})</h3>
                  <div style={{maxHeight:200,overflowY:"auto"}}>
                    {memberOrders.slice(0,5).map(order=>(
                      <div key={order.id} style={{padding:10,marginBottom:8,background:"var(--bg2)",borderRadius:8,display:"flex",justifyContent:"space-between"}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:"var(--bark)"}}>{order.id}</div>
                          <div style={{fontSize:11,color:"var(--clay2)"}}>{order.building}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:12,fontWeight:600,color:"var(--olive)"}}>${order.total.toFixed(2)}</div>
                          <div style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:order.status==="delivered"?"var(--olive-bg)":"var(--honey-bg)",color:order.status==="delivered"?"var(--olive)":"var(--honey)",fontWeight:600}}>{order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                <div style={{marginBottom:16}}>
                  <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Update Status</label>
                  <select value={selectedMember.status} onChange={e=>updateDeliveryMemberStatus(selectedMember.id,e.target.value)} style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </AdminLayout>
  );
}

function AdminMaps(){
  const {adminRestaurants,adminDeliveryTeam,adminOrders}=useContext(AppCtx);

  // Define delivery zones with coordinates (simplified grid system)
  const zones=[
    {id:"zone-a",name:"Financial District",color:"var(--terra)",buildings:["One Market Plaza","Salesforce Tower"],restaurants:["The Green Table","Ember & Crust","Sushi Zen"]},
    {id:"zone-b",name:"SOMA",color:"var(--olive)",buildings:["Twitter HQ","Adobe Tower"],restaurants:["Bowl & Grain","Mediterranean Grill"]},
    {id:"zone-c",name:"Downtown",color:"var(--blue)",buildings:["Wells Fargo Center","555 California"],restaurants:["Spice Route","Burger Brigade","Taco Collective"]}
  ];

  // Map buildings to coordinates
  const buildingLocations={
    "One Market Plaza":{x:30,y:40},
    "Salesforce Tower":{x:45,y:35},
    "Twitter HQ":{x:60,y:55},
    "Adobe Tower":{x:70,y:60},
    "Wells Fargo Center":{x:25,y:70},
    "555 California":{x:50,y:75}
  };

  // Map restaurants to coordinates
  const restaurantLocations={
    "The Green Table":{x:35,y:30},
    "Ember & Crust":{x:40,y:45},
    "Sushi Zen":{x:52,y:38},
    "Bowl & Grain":{x:65,y:50},
    "Mediterranean Grill":{x:72,y:65},
    "Spice Route":{x:28,y:65},
    "Burger Brigade":{x:48,y:70},
    "Taco Collective":{x:55,y:78}
  };

  const [selectedZone,setSelectedZone]=useState(null);
  const [selectedMarker,setSelectedMarker]=useState(null);
  const [showRoutes,setShowRoutes]=useState(false);
  const [showHeatmap,setShowHeatmap]=useState(false);
  const [viewMode,setViewMode]=useState("all"); // all, restaurants, buildings
  const [optimizedRoutes,setOptimizedRoutes]=useState(null);
  const [selectedRoute,setSelectedRoute]=useState(null);
  const [assignedDriver,setAssignedDriver]=useState(null);
  const [showDriverAssignment,setShowDriverAssignment]=useState(false);
  const [isTracking,setIsTracking]=useState(false);
  const [trackingProgress,setTrackingProgress]=useState(0);
  const [currentStop,setCurrentStop]=useState(0);

  // Calculate order activity per location for heatmap
  const getLocationActivity=(name)=>{
    return adminOrders.filter(o=>o.restaurantName===name||o.building===name).length;
  };

  // Plan optimized routes
  const planRoutes=()=>{
    const activeOrders=adminOrders.filter(o=>o.status!=="delivered");
    const routes=optimizeRoute(activeOrders,restaurantLocations,buildingLocations);
    setOptimizedRoutes(routes);
    if(routes.length>0)setSelectedRoute(routes[0]);
    setAssignedDriver(null);
    setIsTracking(false);
    setTrackingProgress(0);
    setCurrentStop(0);
  };

  // Assign driver to route
  const assignDriverToRoute=()=>{
    if(!assignedDriver){
      alert("Please select a driver first");
      return;
    }
    alert(`Route assigned to ${assignedDriver.name}! They can now start delivery.`);
    setShowDriverAssignment(false);
  };

  // Start live tracking simulation
  const startTracking=()=>{
    if(!assignedDriver){
      alert("Please assign a driver first");
      return;
    }
    setIsTracking(true);
    setTrackingProgress(0);
    setCurrentStop(0);

    // Simulate progress
    const totalStops=selectedRoute.totalStops;
    const interval=setInterval(()=>{
      setTrackingProgress(prev=>{
        if(prev>=100){
          clearInterval(interval);
          setIsTracking(false);
          alert("Route completed!");
          return 100;
        }
        const newProgress=prev+(100/(totalStops*10));
        setCurrentStop(Math.floor(newProgress/(100/totalStops)));
        return newProgress;
      });
    },500);
  };

  // Export route plan
  const exportRoutePlan=()=>{
    if(!selectedRoute)return;
    const plan=`
LUNCHDROP DELIVERY ROUTE PLAN
==============================
Ready at: ${selectedRoute.batchTime}
Total Stops: ${selectedRoute.totalStops}
Distance: ${selectedRoute.totalDistance} units
Est. Duration: ${selectedRoute.estimatedDuration}
${assignedDriver?`Assigned Driver: ${assignedDriver.name}`:''}

PICKUP SEQUENCE:
${selectedRoute.pickups.map((stop,i)=>`${i+1}. ${stop.location} - ${stop.orders.length} order(s) - ${stop.estimatedTime}`).join('\n')}

DELIVERY SEQUENCE:
${selectedRoute.deliveries.map((stop,i)=>`${selectedRoute.pickups.length+i+1}. ${stop.location} - ${stop.orders.length} order(s) - ${stop.orders.map(o=>o.customerName).join(', ')}`).join('\n')}
`;
    const blob=new Blob([plan],{type:'text/plain'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=`route-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return(
    <AdminLayout activeTab="maps">
      <div>
        <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:8}}>Maps & Delivery Zones</h1>
        <p style={{fontSize:16,color:"var(--clay2)",marginBottom:32}}>Visualize restaurants, delivery locations, and coverage zones</p>

        {/* Controls */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>Filter by Zone</div>
          <div style={{display:"flex",gap:12,marginBottom:16}}>
            {zones.map(zone=>(
              <button key={zone.id} onClick={()=>setSelectedZone(selectedZone===zone.id?null:zone.id)} style={{padding:"10px 20px",background:selectedZone===zone.id?zone.color:"var(--bg2)",color:selectedZone===zone.id?"#fff":"var(--bark)",border:`2px solid ${zone.color}`,borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s"}}>
                {zone.name}
              </button>
            ))}
            <button onClick={()=>setSelectedZone(null)} style={{padding:"10px 20px",background:"var(--bark)",color:"#fff",border:"none",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
              Show All
            </button>
          </div>

          <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:12}}>View Options</div>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>setViewMode("all")} style={{padding:"8px 16px",background:viewMode==="all"?"var(--terra)":"var(--bg2)",color:viewMode==="all"?"#fff":"var(--bark)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
              All Locations
            </button>
            <button onClick={()=>setViewMode("restaurants")} style={{padding:"8px 16px",background:viewMode==="restaurants"?"var(--terra)":"var(--bg2)",color:viewMode==="restaurants"?"#fff":"var(--bark)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
              🍽️ Restaurants Only
            </button>
            <button onClick={()=>setViewMode("buildings")} style={{padding:"8px 16px",background:viewMode==="buildings"?"var(--olive)":"var(--bg2)",color:viewMode==="buildings"?"#fff":"var(--bark)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
              🏢 Buildings Only
            </button>
            <button onClick={()=>setShowRoutes(!showRoutes)} style={{padding:"8px 16px",background:showRoutes?"var(--blue)":"var(--bg2)",color:showRoutes?"#fff":"var(--bark)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
              {showRoutes?"Hide":"Show"} Routes
            </button>
            <button onClick={()=>setShowHeatmap(!showHeatmap)} style={{padding:"8px 16px",background:showHeatmap?"var(--honey)":"var(--bg2)",color:showHeatmap?"#fff":"var(--bark)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
              {showHeatmap?"Hide":"Show"} Activity
            </button>
            <button onClick={planRoutes} style={{padding:"8px 16px",background:optimizedRoutes?"var(--olive)":"var(--bark)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",marginLeft:"auto"}}>
              🚀 {optimizedRoutes?"Refresh":"Plan"} Optimal Routes
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24}}>
          {/* Map View */}
          <div className="glass-card" style={{padding:32,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",marginBottom:24}}>Coverage Map</h2>

            {/* SVG Map */}
            <div style={{position:"relative",width:"100%",height:600,background:"linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",borderRadius:12,overflow:"hidden"}}>
              <svg width="100%" height="100%" style={{position:"absolute",top:0,left:0}}>
                {/* Grid lines */}
                {[...Array(10)].map((_,i)=>(
                  <g key={i}>
                    <line x1={`${i*10}%`} y1="0" x2={`${i*10}%`} y2="100%" stroke="#ddd" strokeWidth="1" opacity="0.3"/>
                    <line x1="0" y1={`${i*10}%`} x2="100%" y2={`${i*10}%`} stroke="#ddd" strokeWidth="1" opacity="0.3"/>
                  </g>
                ))}

                {/* Zone circles (if selected or all) */}
                {zones.filter(z=>!selectedZone||selectedZone===z.id).map(zone=>{
                  const avgX=zone.buildings.map(b=>buildingLocations[b]?.x||50).reduce((a,b)=>a+b,0)/zone.buildings.length;
                  const avgY=zone.buildings.map(b=>buildingLocations[b]?.y||50).reduce((a,b)=>a+b,0)/zone.buildings.length;
                  return <circle key={zone.id} cx={`${avgX}%`} cy={`${avgY}%`} r="15%" fill={zone.color} opacity="0.1" stroke={zone.color} strokeWidth="2" strokeDasharray="5,5"/>;
                })}

                {/* Delivery Routes */}
                {showRoutes&&Object.entries(restaurantLocations).filter(([name])=>viewMode!=="buildings"&&(!selectedZone||zones.find(z=>z.id===selectedZone)?.restaurants.includes(name))).map(([restName,restPos])=>{
                  const zone=zones.find(z=>z.restaurants.includes(restName));
                  return zone?.buildings.map(buildingName=>{
                    const buildPos=buildingLocations[buildingName];
                    if(!buildPos)return null;
                    return <line key={`${restName}-${buildingName}`} x1={`${restPos.x}%`} y1={`${restPos.y}%`} x2={`${buildPos.x}%`} y2={`${buildPos.y}%`} stroke="var(--honey)" strokeWidth="2" opacity="0.4" strokeDasharray="4,4"/>;
                  });
                })}

                {/* Heatmap circles */}
                {showHeatmap&&Object.entries(restaurantLocations).filter(([name])=>viewMode!=="buildings").map(([name,pos])=>{
                  const activity=getLocationActivity(name);
                  return <circle key={`heat-${name}`} cx={`${pos.x}%`} cy={`${pos.y}%`} r={`${2+activity/2}%`} fill="var(--terra)" opacity="0.2"/>;
                })}
                {showHeatmap&&Object.entries(buildingLocations).filter(([name])=>viewMode!=="restaurants").map(([name,pos])=>{
                  const activity=getLocationActivity(name);
                  return <circle key={`heat-${name}`} cx={`${pos.x}%`} cy={`${pos.y}%`} r={`${2+activity/2}%`} fill="var(--olive)" opacity="0.2"/>;
                })}

                {/* Restaurant markers */}
                {Object.entries(restaurantLocations).filter(([name])=>viewMode!=="buildings"&&(!selectedZone||zones.find(z=>z.id===selectedZone)?.restaurants.includes(name))).map(([name,pos])=>{
                  const isSelected=selectedMarker?.name===name;
                  return(
                    <g key={name} onClick={()=>setSelectedMarker({type:"restaurant",name,pos,activity:getLocationActivity(name)})} style={{cursor:"pointer"}}>
                      <circle cx={`${pos.x}%`} cy={`${pos.y}%`} r={isSelected?"12":"8"} fill="var(--terra)" stroke={isSelected?"var(--honey)":"#fff"} strokeWidth={isSelected?"3":"2"} style={{transition:"all .2s"}}/>
                      <text x={`${pos.x}%`} y={`${pos.y-2}%`} fontSize={isSelected?"12":"10"} fill="var(--bark)" textAnchor="middle" fontWeight="600">🍽️</text>
                    </g>
                  );
                })}

                {/* Building markers */}
                {Object.entries(buildingLocations).filter(([name])=>viewMode!=="restaurants"&&(!selectedZone||zones.find(z=>z.id===selectedZone)?.buildings.includes(name))).map(([name,pos])=>{
                  const isSelected=selectedMarker?.name===name;
                  return(
                    <g key={name} onClick={()=>setSelectedMarker({type:"building",name,pos,activity:getLocationActivity(name)})} style={{cursor:"pointer"}}>
                      <rect x={`${pos.x-(isSelected?2:1.5)}%`} y={`${pos.y-(isSelected?2:1.5)}%`} width={isSelected?"4%":"3%"} height={isSelected?"4%":"3%"} fill="var(--olive)" stroke={isSelected?"var(--honey)":"#fff"} strokeWidth={isSelected?"3":"2"} rx="2" style={{transition:"all .2s"}}/>
                      <text x={`${pos.x}%`} y={`${pos.y-2.5}%`} fontSize={isSelected?"12":"10"} fill="var(--bark)" textAnchor="middle" fontWeight="600">🏢</text>
                    </g>
                  );
                })}

                {/* Delivery team markers */}
                {adminDeliveryTeam.filter(m=>m.status==="active"&&(!selectedZone||m.zone===selectedZone)).map((member,i)=>{
                  const zoneBuildings=zones.find(z=>z.id===member.zone)?.buildings||[];
                  const randomBuilding=zoneBuildings[i%zoneBuildings.length];
                  const pos=buildingLocations[randomBuilding]||{x:50,y:50};
                  return(
                    <g key={member.id}>
                      <circle cx={`${pos.x+3}%`} cy={`${pos.y+3}%`} r="6" fill="var(--honey)" stroke="#fff" strokeWidth="2"/>
                      <text x={`${pos.x+3}%`} y={`${pos.y+3.5}%`} fontSize="8" fill="#fff" textAnchor="middle">🚴</text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend overlay */}
              <div style={{position:"absolute",bottom:16,left:16,background:"rgba(255,255,255,0.95)",padding:16,borderRadius:12,border:"1px solid var(--sand)",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
                <div style={{fontSize:12,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Legend</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:16,height:16,borderRadius:"50%",background:"var(--terra)"}}></div><span style={{fontSize:11,color:"var(--clay2)"}}>Restaurants ({adminRestaurants.length})</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:16,height:16,background:"var(--olive)"}}></div><span style={{fontSize:11,color:"var(--clay2)"}}>Buildings (6)</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:16,height:16,borderRadius:"50%",background:"var(--honey)"}}></div><span style={{fontSize:11,color:"var(--clay2)"}}>Active Drivers ({adminDeliveryTeam.filter(m=>m.status==="active").length})</span></div>
                  {showRoutes&&<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:20,height:2,background:"var(--honey)",opacity:0.6}}></div><span style={{fontSize:11,color:"var(--clay2)"}}>Delivery Routes</span></div>}
                  {showHeatmap&&<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:16,height:16,borderRadius:"50%",background:"var(--terra)",opacity:0.3}}></div><span style={{fontSize:11,color:"var(--clay2)"}}>Activity Heatmap</span></div>}
                </div>
              </div>

              {/* Marker Detail Popup */}
              {selectedMarker&&(
                <div style={{position:"absolute",top:"50%",right:24,transform:"translateY(-50%)",background:"#fff",padding:24,borderRadius:16,border:"2px solid var(--honey)",boxShadow:"0 8px 24px rgba(0,0,0,0.15)",minWidth:200}}>
                  <button onClick={()=>setSelectedMarker(null)} style={{position:"absolute",top:8,right:8,background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--clay2)"}}>×</button>
                  <div style={{fontSize:20,marginBottom:12}}>{selectedMarker.type==="restaurant"?"🍽️":"🏢"}</div>
                  <h3 style={{fontFamily:"var(--serif)",fontSize:18,color:"var(--bark)",marginBottom:12}}>{selectedMarker.name}</h3>
                  <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>
                    <strong>Type:</strong> {selectedMarker.type==="restaurant"?"Restaurant":"Building"}
                  </div>
                  <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>
                    <strong>Location:</strong> {selectedMarker.pos.x}%, {selectedMarker.pos.y}%
                  </div>
                  <div style={{fontSize:13,color:"var(--olive2)",fontWeight:600}}>
                    📊 {selectedMarker.activity} orders
                  </div>
                  {selectedMarker.type==="restaurant"&&(
                    <div style={{marginTop:12,padding:12,background:"var(--terra-g)",borderRadius:8}}>
                      <div style={{fontSize:11,color:"var(--terra2)",fontWeight:600}}>Active Restaurant</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Zone Details */}
          <div>
            {/* Route Instructions */}
            {optimizedRoutes&&selectedRoute&&(
              <div className="glass-card" style={{padding:24,borderRadius:16,border:"2px solid var(--olive)",marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)"}}>🚀 Optimized Route</h3>
                  <button onClick={()=>setOptimizedRoutes(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"var(--clay2)"}}>×</button>
                </div>

                {/* Assigned Driver & Tracking */}
                {assignedDriver&&(
                  <div style={{marginBottom:16,padding:12,background:"var(--honey-bg)",borderRadius:8,border:"2px solid var(--honey)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:11,color:"var(--honey2)",marginBottom:4}}>Assigned Driver</div>
                        <div style={{fontSize:16,fontWeight:700,color:"var(--bark)"}}>🚴 {assignedDriver.name}</div>
                        <div style={{fontSize:11,color:"var(--clay2)"}}>📞 {assignedDriver.phone}</div>
                      </div>
                      {isTracking&&(
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:11,color:"var(--olive2)",marginBottom:4}}>Progress</div>
                          <div style={{fontSize:24,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>{Math.floor(trackingProgress)}%</div>
                        </div>
                      )}
                    </div>
                    {isTracking&&(
                      <div style={{marginTop:12}}>
                        <div style={{height:8,background:"var(--bg2)",borderRadius:4,overflow:"hidden"}}>
                          <div style={{height:"100%",background:"linear-gradient(90deg, var(--olive), var(--honey))",width:`${trackingProgress}%`,transition:"width 0.5s"}}></div>
                        </div>
                        <div style={{fontSize:10,color:"var(--clay2)",marginTop:4}}>Stop {currentStop+1} of {selectedRoute.totalStops}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  {!assignedDriver?(
                    <button onClick={()=>setShowDriverAssignment(true)} style={{flex:1,padding:"10px",background:"var(--terra)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
                      👤 Assign Driver
                    </button>
                  ):(
                    <>
                      {!isTracking?(
                        <button onClick={startTracking} style={{flex:1,padding:"10px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
                          ▶️ Start Tracking
                        </button>
                      ):(
                        <button onClick={()=>setIsTracking(false)} style={{flex:1,padding:"10px",background:"var(--honey)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
                          ⏸️ Pause Tracking
                        </button>
                      )}
                    </>
                  )}
                  <button onClick={exportRoutePlan} style={{flex:1,padding:"10px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
                    📥 Export Plan
                  </button>
                </div>

                <div style={{marginBottom:16,padding:12,background:"var(--olive-bg)",borderRadius:8}}>
                  <div style={{fontSize:11,color:"var(--olive2)",marginBottom:4}}>Ready at: {selectedRoute.batchTime}</div>
                  <div style={{fontSize:11,color:"var(--olive2)",marginBottom:4}}>Total Stops: {selectedRoute.totalStops}</div>
                  <div style={{fontSize:11,color:"var(--olive2)",marginBottom:4}}>Distance: {selectedRoute.totalDistance} units</div>
                  <div style={{fontSize:11,color:"var(--olive2)"}}>Est. Time: {selectedRoute.estimatedDuration}</div>
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--terra)",marginBottom:8}}>📍 Pickup Sequence ({selectedRoute.pickups.length})</div>
                  {selectedRoute.pickups.map((stop,i)=>{
                    const isCurrentStop=isTracking&&currentStop===i;
                    const isCompleted=isTracking&&currentStop>i;
                    return(
                      <div key={i} style={{marginBottom:8,padding:12,background:isCurrentStop?"var(--honey-bg)":isCompleted?"var(--olive-bg)":"var(--bg2)",borderRadius:8,borderLeft:`3px solid ${isCurrentStop?"var(--honey)":isCompleted?"var(--olive)":"var(--terra)"}`,position:"relative",transition:"all 0.3s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <div style={{width:24,height:24,borderRadius:"50%",background:isCurrentStop?"var(--honey)":isCompleted?"var(--olive)":"var(--terra)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>
                            {isCompleted?"✓":i+1}
                          </div>
                          <div style={{fontSize:13,fontWeight:600,color:"var(--bark)"}}>{stop.location}</div>
                          {isCurrentStop&&<span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",background:"var(--honey)",color:"#fff",borderRadius:4,fontWeight:700}}>IN PROGRESS</span>}
                        </div>
                        <div style={{fontSize:11,color:"var(--clay2)",marginLeft:32}}>{stop.orders.length} order(s) • {stop.estimatedTime}</div>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--olive)",marginBottom:8}}>🏢 Delivery Sequence ({selectedRoute.deliveries.length})</div>
                  {selectedRoute.deliveries.map((stop,i)=>{
                    const stopIndex=selectedRoute.pickups.length+i;
                    const isCurrentStop=isTracking&&currentStop===stopIndex;
                    const isCompleted=isTracking&&currentStop>stopIndex;
                    return(
                      <div key={i} style={{marginBottom:8,padding:12,background:isCurrentStop?"var(--honey-bg)":isCompleted?"var(--olive-bg)":"var(--bg2)",borderRadius:8,borderLeft:`3px solid ${isCurrentStop?"var(--honey)":isCompleted?"var(--olive)":"var(--olive)"}`,position:"relative",transition:"all 0.3s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <div style={{width:24,height:24,borderRadius:"50%",background:isCurrentStop?"var(--honey)":isCompleted?"var(--olive)":"var(--olive)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>
                            {isCompleted?"✓":selectedRoute.pickups.length+i+1}
                          </div>
                          <div style={{fontSize:13,fontWeight:600,color:"var(--bark)"}}>{stop.location}</div>
                          {isCurrentStop&&<span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",background:"var(--honey)",color:"#fff",borderRadius:4,fontWeight:700}}>IN PROGRESS</span>}
                        </div>
                        <div style={{fontSize:11,color:"var(--clay2)",marginLeft:32}}>{stop.orders.length} order(s)</div>
                        <div style={{fontSize:10,color:"var(--clay)",marginLeft:32,marginTop:4}}>
                          {stop.orders.map(o=>o.customerName).join(", ")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)",marginBottom:20}}>
              <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:16}}>Zone Coverage</h3>
              {zones.map(zone=>(
                <div key={zone.id} style={{marginBottom:16,padding:16,background:"var(--bg2)",borderRadius:12,border:`2px solid ${zone.color}`}}>
                  <div style={{fontSize:16,fontWeight:700,color:"var(--bark)",marginBottom:8}}>{zone.name}</div>
                  <div style={{fontSize:12,color:"var(--clay2)",marginBottom:4}}>🍽️ {zone.restaurants.length} restaurants</div>
                  <div style={{fontSize:12,color:"var(--clay2)",marginBottom:4}}>🏢 {zone.buildings.length} buildings</div>
                  <div style={{fontSize:12,color:"var(--olive2)"}}>🚴 {adminDeliveryTeam.filter(m=>m.zone===zone.id&&m.status==="active").length} active drivers</div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
              <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:16}}>Quick Stats</h3>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"var(--clay2)",marginBottom:4}}>Total Coverage Area</div>
                <div style={{fontSize:24,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)"}}>3 Zones</div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"var(--clay2)",marginBottom:4}}>Avg. Delivery Time</div>
                <div style={{fontSize:24,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>15 min</div>
              </div>
              <div>
                <div style={{fontSize:11,color:"var(--clay2)",marginBottom:4}}>Coverage Efficiency</div>
                <div style={{fontSize:24,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)"}}>94%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Assignment Modal */}
        {showDriverAssignment&&(
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>setShowDriverAssignment(false)}>
            <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:600,width:"90%",maxHeight:"80vh",overflow:"auto"}} onClick={e=>e.stopPropagation()}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:24}}>Assign Driver to Route</h2>

              <div style={{marginBottom:24}}>
                <p style={{fontSize:14,color:"var(--clay2)",marginBottom:16}}>Select an available driver to assign to this optimized route:</p>

                {adminDeliveryTeam.filter(m=>m.status==="active").map(member=>(
                  <div key={member.id} onClick={()=>setAssignedDriver(member)} style={{marginBottom:12,padding:16,background:assignedDriver?.id===member.id?"var(--olive-bg)":"var(--bg2)",border:`2px solid ${assignedDriver?.id===member.id?"var(--olive)":"var(--sand)"}`,borderRadius:12,cursor:"pointer",transition:"all .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--olive)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=assignedDriver?.id===member.id?"var(--olive)":"var(--sand)"}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{fontSize:32}}>🚴</div>
                      <div style={{flex:1}}>
                        <h3 style={{fontSize:18,fontWeight:700,color:"var(--bark)",marginBottom:4}}>{member.name}</h3>
                        <div style={{fontSize:13,color:"var(--clay2)"}}>📞 {member.phone}</div>
                        <div style={{fontSize:13,color:"var(--clay2)"}}>📍 {member.zone.replace("-"," ").toUpperCase()}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:11,color:"var(--clay2)",marginBottom:4}}>Active Orders</div>
                        <div style={{fontSize:24,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>{member.activeOrders}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{display:"flex",gap:12}}>
                <button onClick={assignDriverToRoute} disabled={!assignedDriver} style={{flex:1,padding:"14px",background:assignedDriver?"var(--olive)":"var(--sand)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:assignedDriver?"pointer":"not-allowed",fontFamily:"var(--sans)",opacity:assignedDriver?1:0.5}}>
                  Assign Route
                </button>
                <button onClick={()=>setShowDriverAssignment(false)} style={{flex:1,padding:"14px",background:"var(--bg2)",color:"var(--bark)",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function AdminAnalytics(){
  const {adminOrders}=useContext(AppCtx);
  const [dateRange,setDateRange]=useState("30");
  const [customAnalyticsStart,setCustomAnalyticsStart]=useState("");
  const [customAnalyticsEnd,setCustomAnalyticsEnd]=useState("");

  const today=new Date();
  let startDate,endDate=today;

  if(dateRange==="custom"){
    if(customAnalyticsStart)startDate=new Date(customAnalyticsStart);
    else startDate=new Date(0);
    if(customAnalyticsEnd)endDate=new Date(customAnalyticsEnd);
  }else{
    const daysAgo=parseInt(dateRange);
    startDate=new Date(today);
    startDate.setDate(startDate.getDate()-daysAgo);
  }

  const filteredOrders=adminOrders.filter(o=>{const orderDate=new Date(o.date);return orderDate>=startDate&&orderDate<=endDate;});

  const totalRevenue=filteredOrders.reduce((sum,o)=>sum+o.total,0);
  const totalOrders=filteredOrders.length;
  const avgOrderValue=totalOrders>0?totalRevenue/totalOrders:0;
  const deliveredOrders=filteredOrders.filter(o=>o.status==="delivered").length;
  const completionRate=totalOrders>0?(deliveredOrders/totalOrders*100):0;

  const revenueByDay={};
  filteredOrders.forEach(o=>{if(!revenueByDay[o.date])revenueByDay[o.date]=0;revenueByDay[o.date]+=o.total;});

  const restaurantStats={};
  filteredOrders.forEach(o=>{if(!restaurantStats[o.restaurantName])restaurantStats[o.restaurantName]={orders:0,revenue:0};restaurantStats[o.restaurantName].orders++;restaurantStats[o.restaurantName].revenue+=o.total;});
  const topRestaurants=Object.entries(restaurantStats).map(([name,stats])=>({name,...stats})).sort((a,b)=>b.revenue-a.revenue).slice(0,5);

  const chartData=Object.entries(revenueByDay).slice(-7);
  const maxRevenue=Math.max(...chartData.map(([_,v])=>v),1);

  // Order volume by day
  const ordersByDay={};
  filteredOrders.forEach(o=>{if(!ordersByDay[o.date])ordersByDay[o.date]=0;ordersByDay[o.date]++;});
  const orderVolumeData=Object.entries(ordersByDay).slice(-7);
  const maxOrders=Math.max(...orderVolumeData.map(([_,v])=>v),1);

  // Peak hours analysis (simulated - assume random times between 11 AM - 2 PM)
  const hourlyOrders={};
  for(let h=11;h<=14;h++){hourlyOrders[h]=Math.floor(Math.random()*totalOrders*0.3)+Math.floor(totalOrders*0.1);}
  const peakHour=Object.entries(hourlyOrders).sort((a,b)=>b[1]-a[1])[0];

  // Day of week analysis
  const dayOfWeekOrders={Sun:0,Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0};
  const dayOfWeekRevenue={Sun:0,Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0};
  const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  filteredOrders.forEach(o=>{const date=new Date(o.date);const day=dayNames[date.getDay()];dayOfWeekOrders[day]++;dayOfWeekRevenue[day]+=o.total;});
  const bestDay=Object.entries(dayOfWeekRevenue).sort((a,b)=>b[1]-a[1])[0];

  // Customer insights (simulated)
  const uniqueCustomers=new Set(filteredOrders.map(o=>o.customerName)).size;
  const avgOrdersPerCustomer=uniqueCustomers>0?(totalOrders/uniqueCustomers):0;
  const newCustomers=Math.floor(uniqueCustomers*0.3);
  const returningCustomers=uniqueCustomers-newCustomers;

  // Growth comparison (compare to previous period)
  const periodDays=dateRange==="custom"?Math.ceil((endDate-startDate)/(1000*60*60*24)):parseInt(dateRange);
  const previousStart=new Date(startDate);
  previousStart.setDate(previousStart.getDate()-periodDays);
  const previousOrders=adminOrders.filter(o=>{const d=new Date(o.date);return d>=previousStart&&d<startDate;});
  const previousRevenue=previousOrders.reduce((s,o)=>s+o.total,0);
  const revenueGrowth=previousRevenue>0?((totalRevenue-previousRevenue)/previousRevenue*100):0;
  const orderGrowth=previousOrders.length>0?((totalOrders-previousOrders.length)/previousOrders.length*100):0;

  const exportToCSV=()=>{const csv=[["Date","Orders","Revenue"],...Object.entries(revenueByDay).map(([date,revenue])=>[date,filteredOrders.filter(o=>o.date===date).length,revenue.toFixed(2)])].map(row=>row.join(",")).join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`analytics-${dateRange}d-${Date.now()}.csv`;a.click();URL.revokeObjectURL(url);};

  return(
    <AdminLayout activeTab="analytics">
      <div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:32}}>
          <div><h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:8}}>Analytics & Reports</h1></div>
          <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
            <select value={dateRange} onChange={e=>setDateRange(e.target.value)} style={{padding:"10px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)"}}>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            {dateRange==="custom"&&(
              <>
                <input type="date" value={customAnalyticsStart} onChange={e=>setCustomAnalyticsStart(e.target.value)} style={{padding:"10px 14px",borderRadius:12,border:"1px solid var(--sand)",fontSize:14,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}} placeholder="Start date"/>
                <span style={{color:"var(--clay2)",fontSize:14}}>to</span>
                <input type="date" value={customAnalyticsEnd} onChange={e=>setCustomAnalyticsEnd(e.target.value)} style={{padding:"10px 14px",borderRadius:12,border:"1px solid var(--sand)",fontSize:14,outline:"none",fontFamily:"var(--sans)",cursor:"pointer"}} placeholder="End date"/>
              </>
            )}
            <button onClick={exportToCSV} style={{padding:"10px 20px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer"}}>📥 Export CSV</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,marginBottom:32}}>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"2px solid var(--olive)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Total Revenue</div>
            <div style={{fontSize:36,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>${totalRevenue.toFixed(2)}</div>
          </div>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"2px solid var(--terra)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Total Orders</div>
            <div style={{fontSize:36,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)"}}>{totalOrders}</div>
          </div>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"2px solid var(--honey)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Avg Order Value</div>
            <div style={{fontSize:36,fontWeight:700,color:"var(--honey)",fontFamily:"var(--serif)"}}>${avgOrderValue.toFixed(2)}</div>
          </div>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"2px solid var(--blue)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Completion Rate</div>
            <div style={{fontSize:36,fontWeight:700,color:"var(--blue)",fontFamily:"var(--serif)"}}>{completionRate.toFixed(1)}%</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24}}>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:24}}>Revenue Trend (Last 7 Days)</h3>
            <div style={{display:"flex",alignItems:"end",gap:12,height:200}}>
              {chartData.map(([date,revenue])=>(
                <div key={date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:"100%",background:"var(--olive)",borderRadius:"8px 8px 0 0",height:`${(revenue/maxRevenue)*100}%`,minHeight:4,position:"relative"}}>
                    <div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",fontSize:11,fontWeight:600,color:"var(--olive)",marginBottom:4}}>${revenue.toFixed(0)}</div>
                  </div>
                  <div style={{fontSize:10,color:"var(--clay2)",marginTop:8}}>{date.split("-")[2]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:16}}>Top Restaurants</h3>
            {topRestaurants.map((rest,i)=>(
              <div key={rest.name} style={{marginBottom:12,padding:12,background:"var(--bg2)",borderRadius:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:i===0?"var(--olive)":"var(--terra)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>{i+1}</div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",flex:1}}>{rest.name}</div>
                </div>
                <div style={{fontSize:12,color:"var(--clay2)",marginLeft:32}}>{rest.orders} orders • ${rest.revenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Metrics */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginTop:32}}>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Revenue Growth</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:32,fontWeight:700,color:revenueGrowth>=0?"var(--olive)":"var(--red)",fontFamily:"var(--serif)"}}>{revenueGrowth>=0?"+":""}{revenueGrowth.toFixed(1)}%</div>
              <div style={{fontSize:20}}>{revenueGrowth>=0?"📈":"📉"}</div>
            </div>
            <div style={{fontSize:12,color:"var(--clay2)",marginTop:4}}>vs previous period</div>
          </div>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Order Growth</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:32,fontWeight:700,color:orderGrowth>=0?"var(--olive)":"var(--red)",fontFamily:"var(--serif)"}}>{orderGrowth>=0?"+":""}{orderGrowth.toFixed(1)}%</div>
              <div style={{fontSize:20}}>{orderGrowth>=0?"📈":"📉"}</div>
            </div>
            <div style={{fontSize:12,color:"var(--clay2)",marginTop:4}}>vs previous period</div>
          </div>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:8}}>Peak Hour</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:32,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)"}}>{peakHour[0]}:00</div>
              <div style={{fontSize:20}}>⏰</div>
            </div>
            <div style={{fontSize:12,color:"var(--clay2)",marginTop:4}}>{peakHour[1]} orders</div>
          </div>
        </div>

        {/* Order Volume Trend & Day of Week Analysis */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:32}}>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:24}}>Order Volume (Last 7 Days)</h3>
            <div style={{display:"flex",alignItems:"end",gap:12,height:200}}>
              {orderVolumeData.map(([date,orders])=>(
                <div key={date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:"100%",background:"var(--terra)",borderRadius:"8px 8px 0 0",height:`${(orders/maxOrders)*100}%`,minHeight:4,position:"relative"}}>
                    <div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",fontSize:11,fontWeight:600,color:"var(--terra)",marginBottom:4}}>{orders}</div>
                  </div>
                  <div style={{fontSize:10,color:"var(--clay2)",marginTop:8}}>{date.split("-")[2]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:24}}>Orders by Day of Week</h3>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {Object.entries(dayOfWeekOrders).map(([day,count])=>{
                const maxDayOrders=Math.max(...Object.values(dayOfWeekOrders));
                const percentage=(count/maxDayOrders)*100;
                const revenue=dayOfWeekRevenue[day];
                return(
                  <div key={day} style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:40,fontSize:13,fontWeight:600,color:"var(--bark)"}}>{day}</div>
                    <div style={{flex:1,height:32,background:"var(--bg2)",borderRadius:8,overflow:"hidden",position:"relative"}}>
                      <div style={{width:`${percentage}%`,height:"100%",background:day===bestDay[0]?"var(--olive)":"var(--honey)",transition:"width .5s"}}/>
                      <div style={{position:"absolute",top:"50%",left:8,transform:"translateY(-50%)",fontSize:12,fontWeight:600,color:"var(--bark)"}}>{count} orders • ${revenue.toFixed(0)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer Insights & Peak Hours Heatmap */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginTop:32}}>
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:20}}>Customer Insights</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              <div style={{padding:16,background:"var(--bg2)",borderRadius:12,textAlign:"center"}}>
                <div style={{fontSize:28,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)",marginBottom:4}}>{uniqueCustomers}</div>
                <div style={{fontSize:13,color:"var(--clay2)"}}>Unique Customers</div>
              </div>
              <div style={{padding:16,background:"var(--bg2)",borderRadius:12,textAlign:"center"}}>
                <div style={{fontSize:28,fontWeight:700,color:"var(--terra)",fontFamily:"var(--serif)",marginBottom:4}}>{avgOrdersPerCustomer.toFixed(1)}</div>
                <div style={{fontSize:13,color:"var(--clay2)"}}>Avg Orders/Customer</div>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:13,color:"var(--clay2)"}}>New Customers</span>
                <span style={{fontSize:14,fontWeight:600,color:"var(--blue)"}}>{newCustomers} ({((newCustomers/uniqueCustomers)*100).toFixed(0)}%)</span>
              </div>
              <div style={{height:8,background:"var(--bg2)",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${(newCustomers/uniqueCustomers)*100}%`,height:"100%",background:"var(--blue)"}}/>
              </div>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:13,color:"var(--clay2)"}}>Returning Customers</span>
                <span style={{fontSize:14,fontWeight:600,color:"var(--olive)"}}>{returningCustomers} ({((returningCustomers/uniqueCustomers)*100).toFixed(0)}%)</span>
              </div>
              <div style={{height:8,background:"var(--bg2)",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${(returningCustomers/uniqueCustomers)*100}%`,height:"100%",background:"var(--olive)"}}/>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:20}}>Peak Hours Heatmap</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {Object.entries(hourlyOrders).map(([hour,count])=>{
                const maxHourOrders=Math.max(...Object.values(hourlyOrders));
                const intensity=(count/maxHourOrders);
                const bgColor=intensity>0.8?"var(--red)":intensity>0.6?"var(--terra)":intensity>0.4?"var(--honey)":"var(--olive)";
                return(
                  <div key={hour} style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:80,fontSize:14,fontWeight:600,color:"var(--bark)"}}>{hour}:00 - {parseInt(hour)+1}:00</div>
                    <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,height:40,background:bgColor,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:600,fontSize:14,opacity:0.5+intensity*0.5}}>{count} orders</div>
                      <div style={{fontSize:12,color:"var(--clay2)",width:60}}>{((count/totalOrders)*100).toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

//Settings, Promos, Audit Logs components
function AdminSettings(){
  const {platformSettings,updatePlatformSettings}=useContext(AppCtx);
  const [activeTab,setActiveTab]=useState("fees");

  return(
    <AdminLayout activeTab="settings">
      <div>
        <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:32}}>Platform Settings</h1>

        <div style={{display:"flex",gap:12,marginBottom:24}}>
          {["fees","zones","business"].map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{padding:"12px 24px",background:activeTab===tab?"var(--terra)":"var(--bg2)",color:activeTab===tab?"#fff":"var(--bark)",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer"}}>{tab.toUpperCase()}</button>
          ))}
        </div>

        {activeTab==="fees"&&(
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontSize:20,fontWeight:600,color:"var(--bark)",marginBottom:24}}>Fees & Tax</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24}}>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Delivery Fee ($)</label>
                <input type="number" step="0.01" value={platformSettings.fees.deliveryFee} onChange={e=>updatePlatformSettings("fees",{...platformSettings.fees,deliveryFee:parseFloat(e.target.value)})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Tax Rate (%)</label>
                <input type="number" step="0.1" value={(platformSettings.fees.taxRate*100).toFixed(1)} onChange={e=>updatePlatformSettings("fees",{...platformSettings.fees,taxRate:parseFloat(e.target.value)/100})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Service Fee ($)</label>
                <input type="number" step="0.01" value={platformSettings.fees.serviceFee} onChange={e=>updatePlatformSettings("fees",{...platformSettings.fees,serviceFee:parseFloat(e.target.value)})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}}/>
              </div>
            </div>
          </div>
        )}

        {activeTab==="zones"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {platformSettings.zones.map(zone=>(
              <div key={zone.id} className="glass-card" style={{padding:20,borderRadius:12,border:`2px solid ${zone.color}`}}>
                <h4 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:8}}>{zone.name}</h4>
                <div style={{fontSize:13,color:"var(--clay2)",marginBottom:12}}>ID: {zone.id}</div>
                <button onClick={()=>updatePlatformSettings("zones",platformSettings.zones.map(z=>z.id===zone.id?{...z,enabled:!z.enabled}:z))} style={{padding:"8px 16px",background:zone.enabled?"var(--olive-bg)":"var(--bg2)",color:zone.enabled?"var(--olive)":"var(--clay2)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>{zone.enabled?"Active":"Inactive"}</button>
              </div>
            ))}
          </div>
        )}

        {activeTab==="business"&&(
          <div className="glass-card" style={{padding:24,borderRadius:16,border:"1px solid var(--sand)"}}>
            <h3 style={{fontSize:20,fontWeight:600,color:"var(--bark)",marginBottom:24}}>Business Info</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Cutoff Time</label>
                <input type="text" value={platformSettings.business.cutoffTime} onChange={e=>updatePlatformSettings("business",{...platformSettings.business,cutoffTime:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Min Order ($)</label>
                <input type="number" value={platformSettings.business.minOrderValue} onChange={e=>updatePlatformSettings("business",{...platformSettings.business,minOrderValue:parseFloat(e.target.value)})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Support Email</label>
                <input type="email" value={platformSettings.business.supportEmail} onChange={e=>updatePlatformSettings("business",{...platformSettings.business,supportEmail:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Support Phone</label>
                <input type="tel" value={platformSettings.business.supportPhone} onChange={e=>updatePlatformSettings("business",{...platformSettings.business,supportPhone:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}}/>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function AdminPromos(){
  const {promoCodes,createPromoCode,updatePromoCode,deletePromoCode}=useContext(AppCtx);
  const [showCreateForm,setShowCreateForm]=useState(false);
  const [newPromo,setNewPromo]=useState({code:"",type:"percent",discount:0.10,minOrder:0,maxUses:null,description:"",expiresAt:""});

  const handleCreate=()=>{
    createPromoCode(newPromo);
    setShowCreateForm(false);
    setNewPromo({code:"",type:"percent",discount:0.10,minOrder:0,maxUses:null,description:"",expiresAt:""});
  };

  return(
    <AdminLayout activeTab="promos">
      <div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:32}}>
          <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)"}}>Promo Codes</h1>
          <button onClick={()=>setShowCreateForm(true)} style={{padding:"12px 24px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>+ Create Promo Code</button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {promoCodes.map(promo=>(
            <div key={promo.id} className="glass-card" style={{padding:24,borderRadius:12,border:"1px solid var(--sand)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                    <span style={{fontSize:20,fontWeight:700,color:"var(--bark)",fontFamily:"var(--mono)"}}>{promo.code}</span>
                    <span style={{padding:"4px 12px",borderRadius:100,fontSize:11,fontWeight:600,background:promo.active?"var(--olive-bg)":"var(--bg2)",color:promo.active?"var(--olive)":"var(--clay2)"}}>{promo.active?"Active":"Inactive"}</span>
                  </div>
                  <div style={{fontSize:14,color:"var(--clay2)",marginBottom:8}}>{promo.description}</div>
                  <div style={{fontSize:13,color:"var(--clay)"}}>
                    {promo.type==="percent"?`${(promo.discount*100)}% off`:`$${promo.discount} off`} • Min order: ${promo.minOrder} • Used: {promo.used}/{promo.maxUses||"∞"}
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>updatePromoCode(promo.id,{active:!promo.active})} style={{padding:"8px 16px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>{promo.active?"Deactivate":"Activate"}</button>
                  <button onClick={()=>deletePromoCode(promo.id)} style={{padding:"8px 16px",background:"var(--red)",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCreateForm&&(
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>setShowCreateForm(false)}>
            <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:500,width:"90%"}} onClick={e=>e.stopPropagation()}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:24}}>Create Promo Code</h2>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:8}}>Code *</label>
                <input type="text" value={newPromo.code} onChange={e=>setNewPromo({...newPromo,code:e.target.value.toUpperCase()})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}} placeholder="SAVE20"/>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:8}}>Type</label>
                <select value={newPromo.type} onChange={e=>setNewPromo({...newPromo,type:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15,cursor:"pointer"}}>
                  <option value="percent">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:8}}>Discount {newPromo.type==="percent"?"(%)":"($)"}</label>
                <input type="number" step={newPromo.type==="percent"?"1":"0.01"} value={newPromo.type==="percent"?newPromo.discount*100:newPromo.discount} onChange={e=>setNewPromo({...newPromo,discount:newPromo.type==="percent"?parseFloat(e.target.value)/100:parseFloat(e.target.value)})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}}/>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:8}}>Description</label>
                <input type="text" value={newPromo.description} onChange={e=>setNewPromo({...newPromo,description:e.target.value})} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15}} placeholder="20% off orders $25+"/>
              </div>
              <div style={{display:"flex",gap:12}}>
                <button onClick={handleCreate} disabled={!newPromo.code} style={{flex:1,padding:"14px",background:newPromo.code?"var(--olive)":"var(--sand)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:newPromo.code?"pointer":"not-allowed"}}>Create Code</button>
                <button onClick={()=>setShowCreateForm(false)} style={{flex:1,padding:"14px",background:"var(--bg2)",color:"var(--bark)",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function AdminNotifications(){
  const {notificationQueue,setNotificationQueue,logAdminAction,showToast,user}=useContext(AppCtx);
  const [showSendForm,setShowSendForm]=useState(false);
  const [filterType,setFilterType]=useState("all");
  const [newNotification,setNewNotification]=useState({title:"",message:"",type:"promotion",recipients:"all"});

  const handleSendNotification=()=>{
    if(!newNotification.title||!newNotification.message){
      showToast("Please fill in all required fields");
      return;
    }

    const notification={
      id:`notif-${Date.now()}`,
      title:newNotification.title,
      message:newNotification.message,
      type:newNotification.type,
      recipients:newNotification.recipients,
      sentBy:user?.email||"admin@lunchdrop.com",
      sentAt:new Date().toISOString(),
      read:0,
      total:newNotification.recipients==="all"?1245:newNotification.recipients==="subscribed"?456:89
    };

    setNotificationQueue(prev=>[notification,...prev]);
    logAdminAction("SEND_NOTIFICATION",{title:newNotification.title,type:newNotification.type,recipients:newNotification.recipients});
    showToast(`Notification sent to ${notification.total} users`);
    setShowSendForm(false);
    setNewNotification({title:"",message:"",type:"promotion",recipients:"all"});
  };

  const filteredNotifications=filterType==="all"?notificationQueue:notificationQueue.filter(n=>n.type===filterType);

  const getTypeColor=type=>{
    switch(type){
      case"order":return"var(--blue)";
      case"promotion":return"var(--honey)";
      case"alert":return"var(--red)";
      case"system":return"var(--clay)";
      default:return"var(--terra)";
    }
  };

  const getTypeIcon=type=>{
    switch(type){
      case"order":return"📦";
      case"promotion":return"🎉";
      case"alert":return"⚠️";
      case"system":return"⚙️";
      default:return"🔔";
    }
  };

  const stats={
    total:notificationQueue.length,
    order:notificationQueue.filter(n=>n.type==="order").length,
    promotion:notificationQueue.filter(n=>n.type==="promotion").length,
    alert:notificationQueue.filter(n=>n.type==="alert").length,
    system:notificationQueue.filter(n=>n.type==="system").length,
    avgReadRate:notificationQueue.length>0?(notificationQueue.reduce((sum,n)=>sum+(n.read/n.total),0)/notificationQueue.length*100):0
  };

  return(
    <AdminLayout activeTab="notifications">
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:32}}>
          <div>
            <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:8}}>Notification Center</h1>
            <p style={{fontSize:16,color:"var(--clay2)"}}>Send and manage user notifications</p>
          </div>
          <button onClick={()=>setShowSendForm(true)} style={{padding:"12px 24px",background:"var(--olive)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>📨 Send Notification</button>
        </div>

        {/* Stats Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:32}}>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--sand)",textAlign:"center"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Total Sent</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--bark)",fontFamily:"var(--serif)"}}>{stats.total}</div>
          </div>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--blue)",textAlign:"center"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Orders</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--blue)",fontFamily:"var(--serif)"}}>{stats.order}</div>
          </div>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--honey)",textAlign:"center"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Promotions</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--honey)",fontFamily:"var(--serif)"}}>{stats.promotion}</div>
          </div>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--red)",textAlign:"center"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Alerts</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--red)",fontFamily:"var(--serif)"}}>{stats.alert}</div>
          </div>
          <div className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--olive)",textAlign:"center"}}>
            <div style={{fontSize:13,color:"var(--clay2)",marginBottom:6}}>Avg Read Rate</div>
            <div style={{fontSize:28,fontWeight:700,color:"var(--olive)",fontFamily:"var(--serif)"}}>{stats.avgReadRate.toFixed(0)}%</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
          {["all","order","promotion","alert","system"].map(type=>(
            <button key={type} onClick={()=>setFilterType(type)} style={{padding:"8px 16px",background:filterType===type?"var(--bark)":"#fff",color:filterType===type?"#fff":"var(--bark)",border:`1px solid ${filterType===type?"var(--bark)":"var(--sand)"}`,borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{type==="all"?`All (${stats.total})`:`${type} (${stats[type]})`}</button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length===0?(
          <div className="glass-card" style={{padding:60,textAlign:"center",borderRadius:16}}>
            <div style={{fontSize:48,marginBottom:16}}>🔔</div>
            <div style={{fontSize:18,color:"var(--bark)",marginBottom:8}}>No notifications found</div>
            <div style={{fontSize:14,color:"var(--clay2)"}}>Send your first notification to reach users</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {filteredNotifications.map(notif=>(
              <div key={notif.id} className="glass-card" style={{padding:24,borderRadius:12,border:`1px solid ${getTypeColor(notif.type)}33`,background:"#fff"}}>
                <div style={{display:"flex",gap:16}}>
                  <div style={{width:48,height:48,borderRadius:12,background:`${getTypeColor(notif.type)}15`,border:`1px solid ${getTypeColor(notif.type)}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{getTypeIcon(notif.type)}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:8}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)"}}>{notif.title}</h3>
                          <span style={{padding:"4px 10px",borderRadius:100,fontSize:11,fontWeight:600,background:`${getTypeColor(notif.type)}15`,color:getTypeColor(notif.type),textTransform:"capitalize"}}>{notif.type}</span>
                        </div>
                        <p style={{fontSize:14,color:"var(--clay2)",marginBottom:8}}>{notif.message}</p>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:24,fontSize:13,color:"var(--clay)"}}>
                      <div>👥 {notif.total} recipients ({notif.recipients})</div>
                      <div>📖 {notif.read} read ({((notif.read/notif.total)*100).toFixed(0)}%)</div>
                      <div>📅 {new Date(notif.sentAt).toLocaleString()}</div>
                      <div>👤 {notif.sentBy}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Send Notification Modal */}
        {showSendForm&&(
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={()=>setShowSendForm(false)}>
            <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:600,width:"90%",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
              <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:24}}>Send Notification</h2>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:8,color:"var(--bark)"}}>Title *</label>
                <input type="text" value={newNotification.title} onChange={e=>setNewNotification({...newNotification,title:e.target.value})} style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15,outline:"none"}} placeholder="Flash Sale Alert"/>
              </div>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:8,color:"var(--bark)"}}>Message *</label>
                <textarea value={newNotification.message} onChange={e=>setNewNotification({...newNotification,message:e.target.value})} style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15,outline:"none",fontFamily:"inherit",resize:"vertical",minHeight:100}} placeholder="Get 20% off all orders today only!"/>
              </div>

              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:8,color:"var(--bark)"}}>Type</label>
                <select value={newNotification.type} onChange={e=>setNewNotification({...newNotification,type:e.target.value})} style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15,outline:"none",cursor:"pointer"}}>
                  <option value="promotion">🎉 Promotion</option>
                  <option value="order">📦 Order Update</option>
                  <option value="alert">⚠️ Alert</option>
                  <option value="system">⚙️ System</option>
                </select>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:"block",fontSize:14,fontWeight:600,marginBottom:8,color:"var(--bark)"}}>Recipients</label>
                <select value={newNotification.recipients} onChange={e=>setNewNotification({...newNotification,recipients:e.target.value})} style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid var(--sand)",fontSize:15,outline:"none",cursor:"pointer"}}>
                  <option value="all">All Users (~1,245)</option>
                  <option value="subscribed">Subscribed Users (~456)</option>
                  <option value="active_orders">Active Orders Only (~89)</option>
                </select>
              </div>

              <div style={{display:"flex",gap:12}}>
                <button onClick={handleSendNotification} disabled={!newNotification.title||!newNotification.message} style={{flex:1,padding:"14px",background:newNotification.title&&newNotification.message?"var(--olive)":"var(--sand)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:newNotification.title&&newNotification.message?"pointer":"not-allowed"}}>📨 Send Notification</button>
                <button onClick={()=>{setShowSendForm(false);setNewNotification({title:"",message:"",type:"promotion",recipients:"all"});}} style={{padding:"14px 20px",background:"var(--bg2)",color:"var(--bark)",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function AdminAuditLogs(){
  const {auditLogs}=useContext(AppCtx);

  return(
    <AdminLayout activeTab="logs">
      <div>
        <h1 style={{fontFamily:"var(--serif)",fontSize:36,color:"var(--bark)",marginBottom:8}}>Audit Logs</h1>
        <p style={{fontSize:16,color:"var(--clay2)",marginBottom:32}}>Track all admin actions and changes</p>

        {auditLogs.length===0?(
          <div className="glass-card" style={{padding:80,textAlign:"center",borderRadius:16}}>
            <div style={{fontSize:48,marginBottom:16}}>📋</div>
            <div style={{fontSize:18,color:"var(--bark)",marginBottom:8}}>No audit logs yet</div>
            <div style={{fontSize:14,color:"var(--clay2)"}}>Admin actions will appear here</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {auditLogs.map(log=>(
              <div key={log.id} className="glass-card" style={{padding:20,borderRadius:12,border:"1px solid var(--sand)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:8}}>
                  <div style={{fontSize:16,fontWeight:600,color:"var(--bark)"}}>{log.action.replace(/_/g," ")}</div>
                  <div style={{fontSize:12,color:"var(--clay2)"}}>{new Date(log.timestamp).toLocaleString()}</div>
                </div>
                <div style={{fontSize:14,color:"var(--clay2)",marginBottom:4}}>{log.admin}</div>
                <div style={{fontSize:13,color:"var(--clay)",fontFamily:"var(--mono)",background:"var(--bg2)",padding:8,borderRadius:6,marginTop:8}}>{JSON.stringify(log.details)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MODALS (Auth & Building Selection)
// ═══════════════════════════════════════════════════════════════════
function AuthModal(){
  const {setShowAuth,setUser,setBuilding,showToast,go}=useContext(AppCtx);
  const [mode,setMode]=useState("login");
  const [f,setF]=useState({name:"",email:"",pw:"",bld:"b1",isRestaurant:false,companyCode:""});
  const [codeValidated,setCodeValidated]=useState(null);

  const validateCode=(code)=>{
    if(!code){
      setCodeValidated(null);
      return;
    }
    const upper=code.toUpperCase();
    if(COMPANY_CODES[upper]){
      setCodeValidated(COMPANY_CODES[upper]);
      // Lock building to company's location
      if(COMPANY_CODES[upper].building){
        setF(prev=>({...prev,bld:COMPANY_CODES[upper].building}));
      }
    }else{
      setCodeValidated({invalid:true});
    }
  };

  const [showPassword,setShowPassword]=useState(false);
  const [password,setPassword]=useState("");
  const [acceptTerms,setAcceptTerms]=useState(false);
  const [showForgotPassword,setShowForgotPassword]=useState(false);
  const [emailForReset,setEmailForReset]=useState("");

  const passwordStrength=(pwd)=>{
    if(pwd.length===0)return{score:0,label:"",color:""};
    if(pwd.length<6)return{score:1,label:"Weak",color:"var(--red)"};
    if(pwd.length<10)return{score:2,label:"Fair",color:"var(--honey)"};
    if(pwd.length>=10&&/[A-Z]/.test(pwd)&&/[0-9]/.test(pwd))return{score:3,label:"Strong",color:"var(--olive)"};
    return{score:2,label:"Fair",color:"var(--honey)"};
  };

  const strength=passwordStrength(password);
  const emailValid=f.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.5)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(12px)"}} onClick={()=>{setShowAuth(false);setShowForgotPassword(false);}}>
      <div className="si" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,padding:"48px 40px",width:480,maxWidth:"95vw",boxShadow:"0 25px 50px -12px rgba(0,0,0,.25)",border:"1px solid var(--sand)"}}>
        {/* Close Button */}
        <button onClick={()=>setShowAuth(false)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",fontSize:24,color:"var(--clay2)",cursor:"pointer",padding:4}}>×</button>

        {showForgotPassword?(
          /* Forgot Password View */
          <div>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{fontSize:48,marginBottom:16}}>🔑</div>
              <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--char)",fontWeight:600,marginBottom:8}}>Reset Password</h2>
              <p style={{fontSize:14,color:"var(--clay2)"}}>Enter your email and we'll send you a reset link</p>
            </div>
            <div style={{marginBottom:20}}>
              <input
                type="email"
                placeholder="Your email address"
                value={emailForReset}
                onChange={e=>setEmailForReset(e.target.value)}
                style={{width:"100%",padding:"16px 18px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",background:"var(--bg)",transition:"all .2s"}}
                onFocus={e=>e.target.style.borderColor="var(--terra)"}
                onBlur={e=>e.target.style.borderColor="var(--sand)"}
              />
            </div>
            <Btn s={{width:"100%",padding:"16px",fontSize:16,marginBottom:16}} onClick={()=>{showToast("Password reset email sent!");setShowForgotPassword(false);setEmailForReset("");}}>Send Reset Link</Btn>
            <button onClick={()=>setShowForgotPassword(false)} style={{width:"100%",padding:"12px",background:"transparent",border:"none",color:"var(--clay2)",fontSize:14,cursor:"pointer",fontWeight:600}}>← Back to Sign In</button>
          </div>
        ):(
          <>
            {/* Header with Tabs */}
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{fontSize:42,marginBottom:12}}>🍱</div>
              <h2 style={{fontFamily:"var(--serif)",fontSize:32,color:"var(--char)",fontWeight:600,marginBottom:16}}>LunchDrop</h2>

              {/* Tab Switcher */}
              <div style={{display:"inline-flex",background:"var(--bg2)",padding:4,borderRadius:12,marginBottom:8}}>
                <button onClick={()=>setMode("login")} style={{padding:"10px 28px",background:mode==="login"?"#fff":"transparent",border:"none",borderRadius:10,fontSize:15,fontWeight:600,color:mode==="login"?"var(--bark)":"var(--clay2)",cursor:"pointer",transition:"all .2s",boxShadow:mode==="login"?"0 2px 4px rgba(0,0,0,.1)":"none"}}>Sign In</button>
                <button onClick={()=>setMode("signup")} style={{padding:"10px 28px",background:mode==="signup"?"#fff":"transparent",border:"none",borderRadius:10,fontSize:15,fontWeight:600,color:mode==="signup"?"var(--bark)":"var(--clay2)",cursor:"pointer",transition:"all .2s",boxShadow:mode==="signup"?"0 2px 4px rgba(0,0,0,.1)":"none"}}>Sign Up</button>
              </div>
              <p style={{fontSize:14,color:"var(--clay2)",marginTop:12}}>{mode==="login"?"Welcome back! Sign in to continue":"Join thousands ordering lunch daily"}</p>
            </div>

            {/* Social Sign-In Buttons */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
              <button onClick={()=>showToast("Google sign-in coming soon!")} style={{padding:"12px",background:"#fff",border:"1px solid var(--sand)",borderRadius:12,fontSize:14,fontWeight:600,color:"var(--bark)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}
                onMouseEnter={e=>e.target.style.background="var(--bg)"}
                onMouseLeave={e=>e.target.style.background="#fff"}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
                <span>Google</span>
              </button>
              <button onClick={()=>showToast("Apple sign-in coming soon!")} style={{padding:"12px",background:"#000",border:"1px solid #000",borderRadius:12,fontSize:14,fontWeight:600,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}
                onMouseEnter={e=>e.target.style.background="#222"}
                onMouseLeave={e=>e.target.style.background="#000"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
              <div style={{flex:1,height:1,background:"var(--sand)"}}/>
              <span style={{fontSize:13,color:"var(--clay2)",fontWeight:500}}>or continue with email</span>
              <div style={{flex:1,height:1,background:"var(--sand)"}}/>
            </div>

            {/* Form Fields */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="signup"&&<input placeholder="Full name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} style={{padding:"14px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",background:"var(--bg)",transition:"border .2s"}} onFocus={e=>e.target.style.borderColor="var(--terra)"} onBlur={e=>e.target.style.borderColor="var(--sand)"}/>}
          <input type="email" placeholder="Work Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} style={{padding:"14px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,outline:"none",background:"var(--bg)",transition:"border .2s"}} onFocus={e=>e.target.style.borderColor="var(--terra)"} onBlur={e=>e.target.style.borderColor="var(--sand)"}/>
          {mode==="signup"&&<div>
            <select value={f.bld} onChange={e=>setF({...f,bld:e.target.value})} disabled={codeValidated&&!codeValidated.invalid} style={{padding:"14px 16px",borderRadius:12,border:"1px solid var(--sand)",fontSize:15,background:codeValidated&&!codeValidated.invalid?"var(--sand)":"var(--bg)",outline:"none",color:"var(--char)",opacity:codeValidated&&!codeValidated.invalid?0.6:1,cursor:codeValidated&&!codeValidated.invalid?"not-allowed":"pointer",width:"100%"}}>
              {BUILDINGS.map(b=><option key={b.id} value={b.id}>{b.name} — {b.address}</option>)}
            </select>
            {codeValidated&&!codeValidated.invalid&&(
              <div style={{marginTop:6,fontSize:12,color:"var(--olive2)",display:"flex",alignItems:"center",gap:4}}>
                <span>🔒</span>
                <span>Delivery location locked to {BUILDINGS.find(b=>b.id===f.bld)?.name}</span>
              </div>
            )}
          </div>}

          {/* Company Code Field */}
          {mode==="signup"&&!f.isRestaurant&&(
            <div>
              <div style={{position:"relative"}}>
                <input
                  placeholder="Company Code (optional)"
                  value={f.companyCode}
                  onChange={e=>{setF({...f,companyCode:e.target.value});validateCode(e.target.value);}}
                  style={{padding:"14px 16px",paddingRight:40,borderRadius:12,border:codeValidated?.invalid?"1px solid var(--terra)":codeValidated?"1px solid var(--olive)":"1px solid var(--sand)",fontSize:15,outline:"none",background:"var(--bg)",transition:"border .2s",width:"100%"}}
                  onFocus={e=>e.target.style.borderColor=codeValidated?.invalid?"var(--terra)":codeValidated?"var(--olive)":"var(--terra)"}
                  onBlur={e=>e.target.style.borderColor=codeValidated?.invalid?"var(--terra)":codeValidated?"var(--olive)":"var(--sand)"}
                />
                {codeValidated&&!codeValidated.invalid&&(
                  <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:18}}>✓</div>
                )}
              </div>
              {codeValidated&&!codeValidated.invalid&&(
                <div style={{marginTop:8,padding:"10px 12px",background:"var(--olive-bg)",borderRadius:8,border:"1px solid rgba(16,185,129,.2)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--olive2)",fontWeight:600}}>
                    <span style={{fontSize:16}}>{codeValidated.logo}</span>
                    <span>{codeValidated.name} - {codeValidated.benefits}</span>
                  </div>
                </div>
              )}
              {codeValidated?.invalid&&(
                <div style={{marginTop:6,fontSize:12,color:"var(--terra)"}}>Invalid company code</div>
              )}
            </div>
          )}

          {mode==="signup"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"var(--bg2)",borderRadius:12,cursor:"pointer",fontSize:14,color:"var(--bark)"}}>
                <input type="checkbox" checked={f.isRestaurant} onChange={e=>setF({...f,isRestaurant:e.target.checked})} style={{width:18,height:18,cursor:"pointer"}}/>
                <span>I'm a restaurant owner</span>
              </label>
            </div>
          )}
          <Btn s={{width:"100%",marginTop:16,padding:"16px",fontSize:16}} onClick={()=>{
            const companyData=f.companyCode?COMPANY_CODES[f.companyCode.toUpperCase()]:null;
            setUser({
              name:f.name||f.email.split("@")[0]||"User",
              isRestaurant:f.isRestaurant||false,
              companyCode:f.companyCode.toUpperCase(),
              company:companyData
            });
            if(mode==="signup")setBuilding(BUILDINGS.find(b=>b.id===f.bld)||BUILDINGS[0]);
            setShowAuth(false);
            showToast(mode==="login"?"Signed in successfully":companyData?`Account created! ${companyData.benefits}`:"Account created!");
          }}>{mode==="login"?"Sign In":"Continue"}</Btn>
        </div>
        <div style={{marginTop:24,textAlign:"center",fontSize:14,color:"var(--clay2)"}}>
          {mode==="login"?<>New here? <span style={{color:"var(--terra)",cursor:"pointer",fontWeight:600}} onClick={()=>{setShowAuth(false);go("signup");}}>Sign up</span></>
          :<>Already have an account? <span style={{color:"var(--terra)",cursor:"pointer",fontWeight:600}} onClick={()=>setMode("login")}>Sign in</span></>}
        </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROFILE / ACCOUNT SETTINGS
// ═══════════════════════════════════════════════════════════════════
function Profile(){
  const {user,setUser,building,setShowBldg}=useContext(AppCtx);
  const [activeTab,setActiveTab]=useState("account");
  const [form,setForm]=useState({
    name:user?.name||"",
    email:user?.email||"",
    phone:user?.phone||"",
    dietaryPrefs:user?.dietaryPrefs||[],
    notifications:user?.notifications||{email:true,sms:false,push:true}
  });
  const [paymentMethods,setPaymentMethods]=useState([
    {id:"pm1",type:"Visa",last4:"4242",exp:"12/25",default:true},
    {id:"pm2",type:"Mastercard",last4:"5555",exp:"08/26",default:false}
  ]);
  const [showAddCard,setShowAddCard]=useState(false);
  const [addresses,setAddresses]=useState([
    {id:"a1",building:"One Market Plaza",address:"123 Main St, Apt 5B",isDefault:true},
    {id:"a2",building:"Salesforce Tower",address:"415 Mission St, Floor 20",isDefault:false}
  ]);

  const dietaryOptions=["Vegan","Vegetarian","Gluten-Free","Dairy-Free","Nut-Free","Halal","Kosher","Low-Carb"];

  const toggleDietaryPref=(pref)=>{
    setForm({
      ...form,
      dietaryPrefs:form.dietaryPrefs.includes(pref)
        ?form.dietaryPrefs.filter(p=>p!==pref)
        :[...form.dietaryPrefs,pref]
    });
  };

  const handleSave=()=>{
    setUser({...user,...form});
    alert("Profile updated successfully!");
  };

  return(
    <div className="fi" style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px 80px"}}>
      <div style={{marginBottom:40}}>
        <h1 style={{fontFamily:"var(--serif)",fontSize:48,color:"var(--bark)",marginBottom:8}}>Account Settings</h1>
        <p style={{fontSize:16,color:"var(--clay2)"}}>Manage your profile, preferences, and payment methods</p>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:32,borderBottom:"1px solid var(--sand)",paddingBottom:2}}>
        {[
          {k:"account",l:"Account",i:"👤"},
          {k:"addresses",l:"Addresses",i:"📍"},
          {k:"dietary",l:"Dietary Preferences",i:"🌱"},
          {k:"payment",l:"Payment Methods",i:"💳"},
          {k:"notifications",l:"Notifications",i:"🔔"}
        ].map(t=>(
          <button key={t.k} onClick={()=>setActiveTab(t.k)}
            style={{padding:"10px 20px",background:activeTab===t.k?"#fff":"transparent",border:"none",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:14,fontWeight:600,color:activeTab===t.k?"var(--bark)":"var(--clay2)",fontFamily:"var(--sans)",transition:"all .2s",boxShadow:activeTab===t.k?"0 -2px 8px rgba(0,0,0,.04)":"none",borderBottom:activeTab===t.k?"2px solid var(--terra)":"none"}}
            onMouseEnter={e=>e.currentTarget.style.color="var(--bark)"} onMouseLeave={e=>e.currentTarget.style.color=activeTab===t.k?"var(--bark)":"var(--clay2)"}>
            <span style={{marginRight:8}}>{t.i}</span>{t.l}
          </button>
        ))}
      </div>

      {/* Account Tab */}
      {activeTab==="account"&&(
        <div className="glass-card" style={{padding:32,borderRadius:16,border:"1px solid var(--sand)",background:"#fff"}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",marginBottom:24}}>Personal Information</h2>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e=>setForm({...form,name:e.target.value})}
                style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
                onFocus={e=>e.target.style.borderColor="var(--terra)"}
                onBlur={e=>e.target.style.borderColor="var(--sand)"}
              />
            </div>
            <div>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e=>setForm({...form,email:e.target.value})}
                style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
                onFocus={e=>e.target.style.borderColor="var(--terra)"}
                onBlur={e=>e.target.style.borderColor="var(--sand)"}
              />
            </div>
            <div>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e=>setForm({...form,phone:e.target.value})}
                placeholder="(555) 123-4567"
                style={{width:"100%",padding:"12px 16px",border:"1px solid var(--sand)",borderRadius:10,fontSize:15,fontFamily:"var(--sans)",color:"var(--bark)",background:"#fff",outline:"none",transition:"border .2s"}}
                onFocus={e=>e.target.style.borderColor="var(--terra)"}
                onBlur={e=>e.target.style.borderColor="var(--sand)"}
              />
            </div>
            <div style={{display:"flex",gap:12,marginTop:16}}>
              <Btn v="primary" onClick={handleSave}>Save Changes</Btn>
              <Btn v="ghost">Change Password</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab==="addresses"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)"}}>Delivery Addresses</h2>
            <Btn v="primary" onClick={()=>setShowBldg(true)}>+ Add Address</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {addresses.map(addr=>(
              <div key={addr.id} className="glass-card" style={{padding:24,borderRadius:12,border:"1px solid var(--sand)",background:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                    <h3 style={{fontSize:16,fontWeight:600,color:"var(--bark)"}}>{addr.building}</h3>
                    {addr.isDefault&&<Badge v="green">Default</Badge>}
                  </div>
                  <p style={{fontSize:14,color:"var(--clay2)"}}>{addr.address}</p>
                </div>
                <div style={{display:"flex",gap:8}}>
                  {!addr.isDefault&&<Btn v="ghost" s={{fontSize:13}}>Set as Default</Btn>}
                  <Btn v="ghost" s={{fontSize:13,color:"var(--terra)"}}>Remove</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dietary Preferences Tab */}
      {activeTab==="dietary"&&(
        <div className="glass-card" style={{padding:32,borderRadius:16,border:"1px solid var(--sand)",background:"#fff"}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",marginBottom:8}}>Dietary Preferences</h2>
          <p style={{fontSize:14,color:"var(--clay2)",marginBottom:24}}>Select your dietary preferences to help us show you relevant menu items</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
            {dietaryOptions.map(pref=>(
              <button
                key={pref}
                onClick={()=>toggleDietaryPref(pref)}
                style={{padding:"16px 20px",border:form.dietaryPrefs.includes(pref)?"2px solid var(--olive)":"1px solid var(--sand)",background:form.dietaryPrefs.includes(pref)?"var(--olive-bg)":"#fff",color:form.dietaryPrefs.includes(pref)?"var(--olive)":"var(--clay2)",borderRadius:12,cursor:"pointer",fontSize:15,fontWeight:600,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"space-between"}}
              >
                <span>{pref}</span>
                {form.dietaryPrefs.includes(pref)&&<span>✓</span>}
              </button>
            ))}
          </div>
          <div style={{marginTop:24}}>
            <Btn v="primary" onClick={handleSave}>Save Preferences</Btn>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab==="payment"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)"}}>Payment Methods</h2>
            <Btn v="primary" onClick={()=>setShowAddCard(true)}>+ Add Card</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {paymentMethods.map(pm=>(
              <div key={pm.id} className="glass-card" style={{padding:24,borderRadius:12,border:"1px solid var(--sand)",background:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <div style={{width:56,height:56,borderRadius:12,background:"var(--bg2)",border:"1px solid var(--sand)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>💳</div>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                      <h3 style={{fontSize:16,fontWeight:600,color:"var(--bark)"}}>{pm.type} •••• {pm.last4}</h3>
                      {pm.default&&<Badge v="green">Default</Badge>}
                    </div>
                    <p style={{fontSize:13,color:"var(--clay2)"}}>Expires {pm.exp}</p>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  {!pm.default&&<Btn v="ghost" s={{fontSize:13}}>Set as Default</Btn>}
                  <Btn v="ghost" s={{fontSize:13,color:"var(--terra)"}}>Remove</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab==="notifications"&&(
        <div className="glass-card" style={{padding:32,borderRadius:16,border:"1px solid var(--sand)",background:"#fff"}}>
          <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",marginBottom:24}}>Notification Preferences</h2>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {[
              {k:"email",l:"Email Notifications",d:"Order confirmations, delivery updates, and promotions"},
              {k:"sms",l:"SMS Notifications",d:"Real-time order updates via text message"},
              {k:"push",l:"Push Notifications",d:"Browser push notifications for order status"}
            ].map(notif=>(
              <label key={notif.k} style={{display:"flex",alignItems:"center",gap:16,padding:"16px 20px",background:"var(--bg2)",borderRadius:12,cursor:"pointer",border:"1px solid var(--sand)",transition:"all .2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--terra)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--sand)"}>
                <input
                  type="checkbox"
                  checked={form.notifications[notif.k]}
                  onChange={e=>setForm({...form,notifications:{...form.notifications,[notif.k]:e.target.checked}})}
                  style={{width:20,height:20,cursor:"pointer",accentColor:"var(--terra)"}}
                />
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:600,color:"var(--bark)",marginBottom:2}}>{notif.l}</div>
                  <div style={{fontSize:13,color:"var(--clay2)"}}>{notif.d}</div>
                </div>
              </label>
            ))}
          </div>
          <div style={{marginTop:24}}>
            <Btn v="primary" onClick={handleSave}>Save Preferences</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FAVORITES PAGE
// ═══════════════════════════════════════════════════════════════════
function Favorites(){
  const {favorites,toggleFav,go}=useContext(AppCtx);
  const favRestaurants=RESTAURANTS.filter(r=>favorites.has(r.id));

  return(
    <div className="fi" style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px 80px"}}>
      <div style={{marginBottom:40}}>
        <h1 style={{fontFamily:"var(--serif)",fontSize:48,color:"var(--bark)",marginBottom:8}}>Your Favorites</h1>
        <p style={{fontSize:16,color:"var(--clay2)"}}>Restaurants you love, all in one place</p>
      </div>

      {favRestaurants.length>0?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
          {favRestaurants.map((r,i)=>(
            <div key={r.id} className="up hov glass-card" style={{animationDelay:`${i*.05}s`,borderRadius:"var(--r)",overflow:"hidden",cursor:"pointer",display:"flex",background:"#fff",border:"1px solid var(--sand)",position:"relative"}}>
              <button
                onClick={(e)=>{e.stopPropagation();toggleFav(r.id);}}
                style={{position:"absolute",top:12,right:12,width:36,height:36,borderRadius:"50%",background:"#fff",border:"1px solid var(--sand)",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,transition:"all .2s",boxShadow:"var(--sh2)"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              >
                ❤️
              </button>
              <div onClick={()=>go("r-"+r.id)} style={{display:"flex",width:"100%"}}>
                <div style={{width:120,borderRight:"1px solid var(--sand)",flexShrink:0}}>
                  <img src={r.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={r.name}/>
                </div>
                <div style={{padding:"20px 24px",flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div>
                      <h3 style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:18,color:"var(--bark)",marginBottom:2}}>{r.name}</h3>
                      <p style={{fontSize:13,color:"var(--clay2)"}}>{r.cuisine} · {r.time} min</p>
                    </div>
                    <span style={{fontSize:12,fontWeight:600,color:"var(--bark)",background:"var(--bg2)",padding:"4px 10px",borderRadius:6,border:"1px solid var(--sand)"}}>★ {r.rating}</span>
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:16}}>{r.tags.map(t=><span key={t} style={{border:"1px solid var(--sand)",background:"var(--bg2)",fontSize:10,fontWeight:600,padding:"4px 10px",borderRadius:6,color:"var(--clay2)",textTransform:"uppercase",letterSpacing:".04em"}}>{t}</span>)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ):(
        <div className="glass-card" style={{padding:100,borderRadius:16,border:"1px solid var(--sand)",background:"#fff",textAlign:"center"}}>
          <div style={{fontSize:64,marginBottom:24,opacity:0.3}}>❤️</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:12}}>No favorites yet</h2>
          <p style={{fontSize:16,color:"var(--clay2)",marginBottom:32,maxWidth:400,margin:"0 auto 32px"}}>Start exploring and tap the heart icon on restaurants you love</p>
          <Btn v="primary" onClick={()=>go("menu")}>Browse Restaurants</Btn>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HELP & FAQ PAGE
// ═══════════════════════════════════════════════════════════════════
function Help(){
  const [activeCategory,setActiveCategory]=useState("ordering");
  const faqs={
    ordering:[
      {q:"When is the order cutoff time?",a:"We have two delivery windows: Order by 10:30 AM for 12:00 PM delivery, or order by 11:30 AM for 1:00 PM delivery. This batched system optimizes delivery routes and ensures your food arrives fresh."},
      {q:"Can I modify my order after placing it?",a:"Yes! You can modify your order until the cutoff time for your chosen delivery window (10:30 AM for 12:00 PM delivery, or 11:30 AM for 1:00 PM delivery). After that, orders are sent to restaurants for preparation."},
      {q:"What if I miss the cutoff?",a:"If you miss the 10:30 AM cutoff, you can still order until 11:30 AM for 1:00 PM delivery. Orders placed after 11:30 AM will be scheduled for the next business day."}
    ],
    delivery:[
      {q:"How does delivery work?",a:"LunchDrop operates its own in-house delivery team. We use a batched delivery system where multiple orders are combined into efficient routes, reducing environmental impact and keeping costs low. Your order arrives between 12:00-1:00 PM."},
      {q:"What's the delivery fee?",a:"Standard delivery is $2.50. Lunch Pass subscribers and company-sponsored accounts get free delivery on all orders!"},
      {q:"Which buildings do you deliver to?",a:"We currently serve the SF Financial District including One Market Plaza, Salesforce Tower, 555 California, and more. Check the building selector for the full list."}
    ],
    account:[
      {q:"How do I get free delivery?",a:"Subscribe to Lunch Pass ($9.99/month) or ask your employer about company-sponsored accounts. Both include unlimited free delivery!"},
      {q:"Can I save my payment information?",a:"Yes! Go to your profile to add and manage payment methods securely. We support all major credit cards."},
      {q:"How do I update my dietary preferences?",a:"Visit your profile → Dietary Preferences tab to select your restrictions. We'll highlight compatible menu items for you."}
    ],
    restaurants:[
      {q:"How are restaurants selected?",a:"We partner with high-quality local restaurants that meet our standards for food quality, preparation time, and consistency. All restaurants are vetted by our team."},
      {q:"Can I suggest a restaurant?",a:"Absolutely! Email us at partners@lunchdrop.com with your suggestion. We're always looking to expand our restaurant network."},
      {q:"Do menu items change daily?",a:"Most restaurants keep core items available daily, but may rotate specials. Check the menu each morning for today's full selection."}
    ],
    partners:[
      {q:"How does restaurant payment work?",a:"Customers pay LunchDrop for their orders. We process payments instantly and transfer funds to restaurant partners daily via direct deposit, minus our service commission."},
      {q:"What's the commission rate?",a:"Our standard commission is 20% of the order subtotal. This covers payment processing, marketing, customer support, our in-house delivery operations, and platform technology. No hidden fees or surprise charges."},
      {q:"When do restaurants get paid?",a:"Restaurants receive daily payouts for the previous day's orders. Funds are transferred directly to your bank account by 9 AM. You'll receive detailed sales reports with each payout."},
      {q:"How do I become a restaurant partner?",a:"Sign up at lunchdrop.com/partners or email partners@lunchdrop.com. We look for restaurants that can handle batch orders, maintain consistent quality, and prepare meals within our delivery windows."},
      {q:"What are the requirements?",a:"Must be able to prepare 20-50 orders by 11:30 AM, meet food safety standards, maintain 4.5+ star rating, and provide reliable service. We provide training and support to ensure success."},
      {q:"Can I update my menu?",a:"Yes! Restaurant partners have access to a dashboard where you can update menu items, prices, availability, and daily specials. Changes sync in real-time to our platform."}
    ]
  };

  return(
    <div className="fi" style={{maxWidth:900,margin:"0 auto",padding:"48px 24px 80px"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <h1 style={{fontFamily:"var(--serif)",fontSize:48,color:"var(--bark)",marginBottom:12}}>Help Center</h1>
        <p style={{fontSize:16,color:"var(--clay2)"}}>Find answers to common questions</p>
      </div>

      {/* Category Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:40,flexWrap:"wrap",justifyContent:"center"}}>
        {[
          {k:"ordering",l:"Ordering",i:"🛒"},
          {k:"delivery",l:"Delivery",i:"🚴"},
          {k:"account",l:"Account",i:"👤"},
          {k:"restaurants",l:"Restaurants",i:"🍽️"},
          {k:"partners",l:"For Restaurants",i:"🤝"}
        ].map(cat=>(
          <button
            key={cat.k}
            onClick={()=>setActiveCategory(cat.k)}
            style={{padding:"12px 24px",border:activeCategory===cat.k?"1px solid var(--terra)":"1px solid var(--sand)",background:activeCategory===cat.k?"var(--terra-g)":"#fff",color:activeCategory===cat.k?"var(--terra2)":"var(--clay2)",borderRadius:100,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--sans)",transition:"all .2s",display:"flex",alignItems:"center",gap:8}}
          >
            <span>{cat.i}</span><span>{cat.l}</span>
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {faqs[activeCategory].map((faq,i)=>(
          <div key={i} className="glass-card" style={{padding:24,borderRadius:12,border:"1px solid var(--sand)",background:"#fff"}}>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:12,fontFamily:"var(--sans)"}}>{faq.q}</h3>
            <p style={{fontSize:15,color:"var(--clay2)",lineHeight:1.7}}>{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="glass-card" style={{marginTop:48,padding:32,borderRadius:16,border:"1px solid var(--sand)",background:"linear-gradient(135deg, #fff 0%, #fafaf9 100%)",textAlign:"center"}}>
        <h2 style={{fontFamily:"var(--serif)",fontSize:24,color:"var(--bark)",marginBottom:12}}>Still need help?</h2>
        <p style={{fontSize:15,color:"var(--clay2)",marginBottom:24}}>Our support team is here to assist you</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <Btn v="primary">Email Support</Btn>
          <Btn v="ghost">Live Chat</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════════════
function About(){
  return(
    <div className="fi" style={{maxWidth:800,margin:"0 auto",padding:"48px 24px 80px"}}>
      <div style={{textAlign:"center",marginBottom:64}}>
        <h1 style={{fontFamily:"var(--serif)",fontSize:56,color:"var(--bark)",marginBottom:16,lineHeight:1.1}}>Lunch shouldn't be complicated</h1>
        <p style={{fontSize:18,color:"var(--clay2)",maxWidth:600,margin:"0 auto",lineHeight:1.7}}>We're on a mission to make lunch simple, sustainable, and delicious for busy professionals.</p>
      </div>

      <div className="glass-card" style={{padding:40,borderRadius:20,border:"1px solid var(--sand)",background:"#fff",marginBottom:40}}>
        <h2 style={{fontFamily:"var(--serif)",fontSize:32,color:"var(--bark)",marginBottom:24}}>Our Story</h2>
        <div style={{fontSize:16,color:"var(--clay2)",lineHeight:1.8,display:"flex",flexDirection:"column",gap:20}}>
          <p>LunchDrop was born from a simple observation: office workers waste 30 minutes every day deciding where to eat, waiting in lines, and coordinating delivery.</p>
          <p>We built a better way. With two batched delivery windows (10:30 AM cutoff for 12:00 PM delivery, 11:30 AM cutoff for 1:00 PM delivery), we create efficient routes that get fresh food to your desk right when you need it—without the chaos.</p>
          <p>Today, we work with the best local restaurants in San Francisco's Financial District, delivering fresh meals daily with our own in-house delivery team. Our optimized batched routes reduce environmental impact by 60% compared to traditional delivery services.</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,marginBottom:40}}>
        {[
          {i:"🌱",t:"Sustainable",d:"Batched delivery reduces CO2 emissions by 60% vs. traditional delivery"},
          {i:"⏱️",t:"Time-Saving",d:"No more lunch hour wasted. Order in the morning, eat at noon."},
          {i:"💰",t:"Cost-Effective",d:"Flat $2.50 delivery fee. Lunch Pass subscribers get free delivery."}
        ].map((v,i)=>(
          <div key={i} className="glass-card" style={{padding:24,borderRadius:12,border:"1px solid var(--sand)",background:"#fff",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>{v.i}</div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:8,fontFamily:"var(--sans)"}}>{v.t}</h3>
            <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.6}}>{v.d}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{padding:40,borderRadius:20,border:"1px solid var(--sand)",background:"#fff",marginBottom:40}}>
        <h2 style={{fontFamily:"var(--serif)",fontSize:32,color:"var(--bark)",marginBottom:32}}>Daily Operational Timeline</h2>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {[
            {time:"8:00 AM",act:"Orders Open",d:"Restaurants publish their daily menus."},
            {time:"10:30 AM",act:"First Cutoff",d:"Orders for 12:00 PM delivery are locked and batched."},
            {time:"11:30 AM",act:"Second Cutoff",d:"Orders for 1:00 PM delivery are locked and batched."},
            {time:"11:00 AM",act:"Kitchen Prep",d:"Restaurants begin preparing all orders."},
            {time:"11:30 AM",act:"Team Dispatched",d:"Our delivery team receives optimized routes for pickup."},
            {time:"11:45 AM",act:"Pickups Start",d:"Our team loads labeled bags for efficient drop-offs."},
            {time:"12:00 PM",act:"Deliveries Begin",d:"Couriers arrive at buildings and drop off orders."},
            {time:"1:00 PM",act:"Deliveries Complete",d:"All customers enjoy their fresh lunch."}
          ].map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:24}}>
              <div style={{width:80,fontSize:14,fontWeight:700,color:"var(--bark)",textAlign:"right"}}>{t.time}</div>
              <div style={{position:"relative",flex:1,paddingBottom:24,borderLeft:"2px solid var(--sand)",paddingLeft:24}}>
                <div style={{position:"absolute",left:-7,top:0,width:12,height:12,borderRadius:"50%",background:"var(--olive)",border:"2px solid #fff",boxShadow:"0 0 0 1px var(--sand)"}}/>
                <div style={{fontSize:16,fontWeight:600,color:"var(--bark)",marginBottom:4,lineHeight:1}}>{t.act}</div>
                <div style={{fontSize:14,color:"var(--clay2)"}}>{t.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{padding:40,borderRadius:20,border:"1px solid var(--sand)",background:"var(--bg2)",marginBottom:40}}>
        <h2 style={{fontFamily:"var(--serif)",fontSize:32,color:"var(--bark)",marginBottom:24}}>Our Revenue Model</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
          <div style={{padding:24,background:"#fff",borderRadius:12,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:24,marginBottom:12}}>🍽️</div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Restaurants</h3>
            <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.6}}>Pay a flat monthly subscription for access to aggregated corporate orders.</p>
          </div>
          <div style={{padding:24,background:"#fff",borderRadius:12,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:24,marginBottom:12}}>🏢</div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Companies</h3>
            <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.6}}>Pay a monthly subscription per employee to subsidize unlimited free delivery.</p>
          </div>
          <div style={{padding:24,background:"#fff",borderRadius:12,border:"1px solid var(--sand)"}}>
            <div style={{fontSize:24,marginBottom:12}}>👤</div>
            <h3 style={{fontSize:18,fontWeight:600,color:"var(--bark)",marginBottom:8}}>Employees</h3>
            <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.6}}>Pay only for the exact cost of the food with no hidden service fees.</p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{padding:40,borderRadius:20,border:"1px solid var(--sand)",background:"linear-gradient(135deg, #fff 0%, #fafaf9 100%)"}}>
        <h2 style={{fontFamily:"var(--serif)",fontSize:28,color:"var(--bark)",marginBottom:16,textAlign:"center"}}>Join thousands of happy lunchers</h2>
        <p style={{fontSize:16,color:"var(--clay2)",textAlign:"center",marginBottom:32}}>Start your LunchDrop journey today</p>
        <div style={{textAlign:"center"}}>
          <Btn v="primary" s={{padding:"16px 32px",fontSize:16}}>Get Started →</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TERMS OF SERVICE PAGE
// ═══════════════════════════════════════════════════════════════════
function Terms(){
  return(
    <div className="fi" style={{maxWidth:800,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"var(--serif)",fontSize:48,color:"var(--bark)",marginBottom:12}}>Terms of Service</h1>
      <p style={{fontSize:14,color:"var(--clay2)",marginBottom:48}}>Last updated: January 2024</p>

      <div style={{fontSize:15,color:"var(--clay2)",lineHeight:1.8,display:"flex",flexDirection:"column",gap:32}}>
        {[
          {title:"1. Acceptance of Terms",content:"By accessing and using LunchDrop, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service."},
          {title:"2. Order Cutoff Policy",content:"We offer two delivery windows: orders by 10:30 AM PST for 12:00 PM delivery, and orders by 11:30 AM PST for 1:00 PM delivery. Orders placed after 11:30 AM will be scheduled for the next business day. We reserve the right to adjust cutoff times during peak periods or holidays."},
          {title:"3. Delivery",content:"Delivery times are estimated and not guaranteed. We strive to deliver all orders between 12:00-1:00 PM. Delays may occur due to weather, traffic, or other unforeseen circumstances."},
          {title:"4. Payment",content:"All payments are processed securely through our payment partners. By providing payment information, you represent that you are authorized to use the payment method. Subscription fees are charged monthly and non-refundable."},
          {title:"5. Cancellations & Refunds",content:"Orders may be cancelled or modified until the cutoff time for your chosen delivery window (10:30 AM for 12:00 PM delivery or 11:30 AM for 1:00 PM delivery). After this time, cancellations are subject to approval. Refunds are issued for cancelled orders, defective items, or service failures at our discretion."},
          {title:"6. User Accounts",content:"You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account."},
          {title:"7. Prohibited Use",content:"You may not use LunchDrop for any unlawful purpose or in any way that could damage, disable, or impair our service. We reserve the right to terminate accounts that violate these terms."},
          {title:"8. Limitation of Liability",content:"LunchDrop is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service. Our total liability is limited to the amount paid for the specific order in question."}
        ].map((section,i)=>(
          <div key={i}>
            <h2 style={{fontSize:20,fontWeight:600,color:"var(--bark)",marginBottom:12,fontFamily:"var(--sans)"}}>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{padding:32,borderRadius:16,border:"1px solid var(--sand)",background:"var(--bg2)",marginTop:48}}>
        <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.7}}>
          For questions about these Terms of Service, please contact us at <strong style={{color:"var(--terra)"}}>legal@lunchdrop.com</strong>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRIVACY POLICY PAGE
// ═══════════════════════════════════════════════════════════════════
function Privacy(){
  return(
    <div className="fi" style={{maxWidth:800,margin:"0 auto",padding:"48px 24px 80px"}}>
      <h1 style={{fontFamily:"var(--serif)",fontSize:48,color:"var(--bark)",marginBottom:12}}>Privacy Policy</h1>
      <p style={{fontSize:14,color:"var(--clay2)",marginBottom:48}}>Last updated: January 2024</p>

      <div style={{fontSize:15,color:"var(--clay2)",lineHeight:1.8,display:"flex",flexDirection:"column",gap:32}}>
        {[
          {title:"Information We Collect",content:"We collect information you provide directly (name, email, delivery address, payment information), automatically through your use of our service (device information, usage patterns, cookies), and from third parties (payment processors, delivery partners)."},
          {title:"How We Use Your Information",content:"We use your information to process orders, communicate with you, improve our service, prevent fraud, comply with legal obligations, and send marketing communications (which you can opt out of at any time)."},
          {title:"Information Sharing",content:"We share your information with restaurant partners (to fulfill orders), our delivery team (for delivery purposes), payment processors (to process transactions), and service providers who help us operate our platform. We do not sell your personal information."},
          {title:"Data Security",content:"We implement industry-standard security measures to protect your personal information. All payment information is encrypted and processed securely. However, no method of transmission over the Internet is 100% secure."},
          {title:"Your Rights",content:"You have the right to access, correct, or delete your personal information. You can update your information in your account settings or contact us for assistance. You may also opt out of marketing communications at any time."},
          {title:"Cookies",content:"We use cookies and similar technologies to improve your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings."},
          {title:"Children's Privacy",content:"LunchDrop is not intended for users under 18 years of age. We do not knowingly collect personal information from children."},
          {title:"Changes to This Policy",content:"We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last updated' date."}
        ].map((section,i)=>(
          <div key={i}>
            <h2 style={{fontSize:20,fontWeight:600,color:"var(--bark)",marginBottom:12,fontFamily:"var(--sans)"}}>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{padding:32,borderRadius:16,border:"1px solid var(--sand)",background:"var(--bg2)",marginTop:48}}>
        <p style={{fontSize:14,color:"var(--clay2)",lineHeight:1.7}}>
          For questions about this Privacy Policy or to exercise your privacy rights, contact us at <strong style={{color:"var(--terra)"}}>privacy@lunchdrop.com</strong>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIGNUP PAGE
// ═══════════════════════════════════════════════════════════════════
function SignUpPage(){
  const {setUser,setBuilding,showToast,go}=useContext(AppCtx);
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",email:"",bld:"b1",isRestaurant:false,companyCode:""});
  const [codeValidated,setCodeValidated]=useState(null);

  const validateCode=(code)=>{
    if(!code){
      setCodeValidated(null);
      return;
    }
    const upper=code.toUpperCase();
    if(COMPANY_CODES[upper]){
      setCodeValidated(COMPANY_CODES[upper]);
      // Lock building to company's location
      if(COMPANY_CODES[upper].building){
        setForm(prev=>({...prev,bld:COMPANY_CODES[upper].building}));
      }
    }else{
      setCodeValidated({invalid:true});
    }
  };

  const handleContinue=()=>{
    if(step===1&&form.email){
      setStep(2);
    }else if(step===2){
      const companyData=form.companyCode?COMPANY_CODES[form.companyCode.toUpperCase()]:null;
      setUser({
        name:form.name||form.email.split("@")[0]||"User",
        isRestaurant:form.isRestaurant||false,
        companyCode:form.companyCode.toUpperCase(),
        company:companyData
      });
      setBuilding(BUILDINGS.find(b=>b.id===form.bld)||BUILDINGS[0]);
      showToast(companyData?`Welcome! ${companyData.benefits}`:"Welcome to LunchDrop!");
      go("menu");
    }
  };

  return(
    <div className="fi" style={{minHeight:"100vh",background:"linear-gradient(135deg, #FAFAFA 0%, #F1F5F9 100%)"}}>
      {/* Header */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>go("home")}>
          <div style={{width:40,height:40,borderRadius:10,background:"var(--char)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <span style={{fontFamily:"var(--serif)",fontWeight:700,fontSize:26,color:"var(--char)"}}>LunchDrop</span>
        </div>
        <div style={{fontSize:14,color:"var(--clay2)"}}>
          Already have an account? <span style={{color:"var(--terra)",cursor:"pointer",fontWeight:600}} onClick={()=>go("home")}>Sign in</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
        {/* Progress Indicator */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:48}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:step>=1?"var(--terra)":"var(--sand)",color:step>=1?"#fff":"var(--clay2)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,transition:"all .3s"}}>1</div>
              <span style={{fontSize:14,fontWeight:600,color:step>=1?"var(--bark)":"var(--clay2)"}}>Account</span>
            </div>
            <div style={{width:60,height:2,background:step>=2?"var(--terra)":"var(--sand)",transition:"all .3s"}}/>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:step>=2?"var(--terra)":"var(--sand)",color:step>=2?"#fff":"var(--clay2)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,transition:"all .3s"}}>2</div>
              <span style={{fontSize:14,fontWeight:600,color:step>=2?"var(--bark)":"var(--clay2)"}}>Details</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card" style={{maxWidth:600,margin:"0 auto",background:"#fff",borderRadius:24,padding:"56px 64px",boxShadow:"0 20px 60px rgba(0,0,0,.08)",border:"1px solid var(--sand)"}}>
          {step===1&&(
            <div className="up">
              <h1 style={{fontFamily:"var(--serif)",fontSize:36,fontWeight:700,color:"var(--bark)",marginBottom:12,textAlign:"center"}}>Create your account</h1>
              <p style={{fontSize:16,color:"var(--clay2)",textAlign:"center",marginBottom:48}}>Start ordering delicious lunches from curated restaurants</p>

              <div style={{display:"flex",flexDirection:"column",gap:24}}>
                <div>
                  <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:10}}>Email address</label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={e=>setForm({...form,email:e.target.value})}
                    style={{width:"100%",padding:"16px 20px",borderRadius:12,border:"1px solid var(--sand)",fontSize:16,outline:"none",background:"var(--bg)",transition:"all .2s",fontFamily:"var(--sans)"}}
                    onFocus={e=>e.target.style.borderColor="var(--terra)"}
                    onBlur={e=>e.target.style.borderColor="var(--sand)"}
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:10}}>Full name</label>
                  <input
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e=>setForm({...form,name:e.target.value})}
                    style={{width:"100%",padding:"16px 20px",borderRadius:12,border:"1px solid var(--sand)",fontSize:16,outline:"none",background:"var(--bg)",transition:"all .2s",fontFamily:"var(--sans)"}}
                    onFocus={e=>e.target.style.borderColor="var(--terra)"}
                    onBlur={e=>e.target.style.borderColor="var(--sand)"}
                  />
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <label style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",background:"var(--bg2)",borderRadius:12,cursor:"pointer",border:"1px solid transparent",transition:"all .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--sand)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
                    <input
                      type="checkbox"
                      checked={form.isRestaurant}
                      onChange={e=>setForm({...form,isRestaurant:e.target.checked})}
                      style={{width:20,height:20,cursor:"pointer",accentColor:"var(--terra)"}}
                    />
                    <div>
                      <div style={{fontSize:15,fontWeight:600,color:"var(--bark)"}}>I'm a restaurant owner</div>
                      <div style={{fontSize:13,color:"var(--clay2)",marginTop:2}}>Access to restaurant dashboard and tools</div>
                    </div>
                  </label>
                </div>

                <Btn v="primary" s={{width:"100%",padding:"18px",fontSize:17,marginTop:16}} onClick={()=>{
                  if(form.isRestaurant) {
                    const companyData=form.companyCode?COMPANY_CODES[form.companyCode.toUpperCase()]:null;
                    setUser({
                      name:form.name||form.email.split("@")[0]||"User",
                      isRestaurant:form.isRestaurant||false,
                      companyCode:form.companyCode?form.companyCode.toUpperCase():"",
                      company:companyData
                    });
                    showToast("Welcome Restaurant Owner!");
                    go("dashboard");
                  } else {
                    handleContinue();
                  }
                }} disabled={!form.email}>
                  {form.isRestaurant ? "Complete Profile →" : "Continue →"}
                </Btn>
              </div>

              <p style={{fontSize:13,color:"var(--clay2)",textAlign:"center",marginTop:32,lineHeight:1.6}}>
                By continuing, you agree to LunchDrop's Terms of Service and Privacy Policy
              </p>
            </div>
          )}

          {step===2&&(
            <div className="up">
              <button onClick={()=>setStep(1)} style={{background:"var(--bg2)",border:"none",padding:"8px 12px",borderRadius:8,fontSize:14,color:"var(--bark)",cursor:"pointer",marginBottom:24,fontWeight:600,display:"flex",alignItems:"center",gap:6}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--sand)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>
                ← Back
              </button>

              <h1 style={{fontFamily:"var(--serif)",fontSize:36,fontWeight:700,color:"var(--bark)",marginBottom:12,textAlign:"center"}}>Almost there!</h1>
              <p style={{fontSize:16,color:"var(--clay2)",textAlign:"center",marginBottom:48}}>Just a few more details</p>

              <div style={{display:"flex",flexDirection:"column",gap:24}}>
                {!form.isRestaurant&&(
                  <div>
                    <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:10}}>Delivery location</label>
                    <select
                      value={form.bld}
                      onChange={e=>setForm({...form,bld:e.target.value})}
                      disabled={codeValidated&&!codeValidated.invalid}
                      style={{width:"100%",padding:"16px 20px",borderRadius:12,border:"1px solid var(--sand)",fontSize:16,background:codeValidated&&!codeValidated.invalid?"var(--sand)":"var(--bg)",outline:"none",color:"var(--bark)",cursor:codeValidated&&!codeValidated.invalid?"not-allowed":"pointer",fontFamily:"var(--sans)",opacity:codeValidated&&!codeValidated.invalid?0.6:1}}
                    >
                      {BUILDINGS.map(b=><option key={b.id} value={b.id}>{b.name} — {b.address}</option>)}
                    </select>
                    {codeValidated&&!codeValidated.invalid&&(
                      <div style={{marginTop:10,fontSize:13,color:"var(--olive2)",display:"flex",alignItems:"center",gap:6,fontWeight:500}}>
                        <span>🔒</span>
                        <span>Delivery location locked to {BUILDINGS.find(b=>b.id===form.bld)?.name}</span>
                      </div>
                    )}
                  </div>
                )}

                {!form.isRestaurant&&(
                  <div>
                    <label style={{display:"block",fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:10}}>
                      Company code <span style={{fontSize:13,fontWeight:400,color:"var(--clay2)"}}>(optional)</span>
                    </label>
                    <div style={{position:"relative"}}>
                      <input
                        placeholder="e.g., SFDC2024"
                        value={form.companyCode}
                        onChange={e=>{setForm({...form,companyCode:e.target.value});validateCode(e.target.value);}}
                        style={{width:"100%",padding:"16px 20px",paddingRight:50,borderRadius:12,border:codeValidated?.invalid?"2px solid var(--terra)":codeValidated?"2px solid var(--olive)":"1px solid var(--sand)",fontSize:16,outline:"none",background:"var(--bg)",transition:"all .2s",fontFamily:"var(--sans)"}}
                        onFocus={e=>e.target.style.borderColor=codeValidated?.invalid?"var(--terra)":codeValidated?"var(--olive)":"var(--terra)"}
                        onBlur={e=>e.target.style.borderColor=codeValidated?.invalid?"var(--terra)":codeValidated?"var(--olive)":"var(--sand)"}
                      />
                      {codeValidated&&!codeValidated.invalid&&(
                        <div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",fontSize:24,color:"var(--olive)"}}>✓</div>
                      )}
                    </div>
                    {codeValidated&&!codeValidated.invalid&&(
                      <div style={{marginTop:12,padding:"16px 20px",background:"var(--olive-bg)",borderRadius:12,border:"2px solid var(--olive)"}}>
                        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                          <span style={{fontSize:28}}>{codeValidated.logo}</span>
                          <div>
                            <div style={{fontSize:16,fontWeight:700,color:"var(--olive2)",marginBottom:2}}>{codeValidated.name}</div>
                            <div style={{fontSize:14,color:"var(--olive2)",opacity:.9}}>{codeValidated.benefits}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {codeValidated?.invalid&&(
                      <div style={{marginTop:8,fontSize:13,color:"var(--terra)",fontWeight:500}}>⚠ Invalid company code</div>
                    )}
                    <div style={{marginTop:12,padding:"14px 18px",background:"var(--bg2)",borderRadius:10,fontSize:13,color:"var(--clay2)",lineHeight:1.5}}>
                      💡 <strong>Have a company code?</strong> Enter it to unlock free delivery and other perks sponsored by your employer.
                    </div>
                  </div>
                )}

                <Btn v="primary" s={{width:"100%",padding:"18px",fontSize:17,marginTop:24}} onClick={handleContinue}>
                  {form.isRestaurant?"Create Restaurant Account":"Complete Sign Up"} ✨
                </Btn>
              </div>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        {step===1&&(
          <div style={{marginTop:64,display:"flex",justifyContent:"center",gap:48}}>
            {[
              {ic:"🔒",t:"Secure & Private",d:"Your data is encrypted"},
              {ic:"⚡",t:"No Credit Card",d:"Add payment later"},
              {ic:"🎉",t:"Free to Join",d:"No signup fees"}
            ].map((item,i)=>(
              <div key={i} className="up" style={{animationDelay:`${i*.1}s`,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>{item.ic}</div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--bark)",marginBottom:4}}>{item.t}</div>
                <div style={{fontSize:12,color:"var(--clay2)"}}>{item.d}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Building selector modal
function BuildingModal(){
  const {setShowBldg,setBuilding,building}=useContext(AppCtx);
  const [q,setQ]=useState("");
  const filtered=BUILDINGS.filter(b=>b.name.toLowerCase().includes(q.toLowerCase())||b.address.toLowerCase().includes(q.toLowerCase()));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.4)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}} onClick={()=>setShowBldg(false)}>
      <div className="si" onClick={e=>e.stopPropagation()} style={{background:"var(--bg)",borderRadius:18,padding:"24px",width:400,boxShadow:"var(--sh4)"}}>
        <h3 style={{fontFamily:"var(--serif)",fontSize:20,color:"var(--bark)",marginBottom:12}}>Select your building</h3>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search buildings…" style={{width:"100%",padding:"10px 14px",borderRadius:"var(--rs)",border:"1.5px solid var(--sand)",fontSize:14,outline:"none",background:"#fff",marginBottom:12}}/>
        <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:300,overflow:"auto"}}>
          {filtered.map(b=>(
            <button key={b.id} onClick={()=>{setBuilding(b);setShowBldg(false)}}
              style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:"var(--rs)",border:building?.id===b.id?"2px solid var(--terra)":"1.5px solid var(--sand)",background:building?.id===b.id?"var(--terra-g)":"#fff",cursor:"pointer",fontFamily:"var(--sans)",textAlign:"left"}}>
              <div><div style={{fontSize:14,fontWeight:600,color:"var(--bark)"}}>{b.name}</div><div style={{fontSize:12,color:"var(--clay)",marginTop:1}}>{b.address}</div></div>
              {building?.id===b.id&&<span style={{color:"var(--terra)",fontWeight:700}}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════
export default function LunchDropApp(){
  const [page,setPage]=useState("home");
  const [cart,setCart]=useState([]);
  const [user,setUser]=useState(null);
  const [building,setBuilding]=useState(BUILDINGS[0]);
  const [showAuth,setShowAuth]=useState(false);
  const [showBldg,setShowBldg]=useState(false);
  const [showCart,setShowCart]=useState(false);
  const [toast,setToast]=useState(null);
  const [favorites,setFavorites]=useState(new Set());
  const [activeOrder,setActiveOrder]=useState(null);
  const [pastOrders,setPastOrders]=useState([
    {id:"LCH-4832",rname:"The Green Table",rid:"r1",date:"2024-03-10",win:"12:00 PM",tot:28.45,items:[{id:"m1",name:"Harvest Buddha Bowl",price:16.50,qty:1,opts:[]},{id:"m3",name:"Grilled Halloumi Salad",price:14.50,qty:1,opts:[]}]},
    {id:"LCH-3921",rname:"Ember & Crust",rid:"r2",date:"2024-03-08",win:"12:30 PM",tot:34.20,items:[{id:"m10",name:"Truffle Mushroom Pizza",price:18.00,qty:2,opts:[]}]},
    {id:"LCH-5614",rname:"Bowl & Grain",rid:"r3",date:"2024-03-05",win:"12:00 PM",tot:22.80,items:[{id:"m15",name:"Thai Crunch Bowl",price:15.50,qty:1,opts:[]},{id:"m16",name:"Açaí Energy Bowl",price:12.00,qty:1,opts:[]}]}
  ]);
  const [notifications,setNotifications]=useState([
    {id:"n1",title:"Order Delivered",message:"Your order from The Green Table has been delivered!",time:new Date(Date.now()-3600000).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),read:false,icon:"✓"},
    {id:"n2",title:"New Promo Code",message:"Use code LUNCH10 for 10% off your next order",time:new Date(Date.now()-7200000).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),read:true,icon:"🎉"}
  ]);

  // Admin state
  const [adminRestaurants,setAdminRestaurants]=useState(RESTAURANTS);
  const [adminPendingRestaurants,setAdminPendingRestaurants]=useState(PENDING_RESTAURANTS);
  const [adminOrders,setAdminOrders]=useState(HISTORICAL_ORDERS);
  const [adminDeliveryTeam,setAdminDeliveryTeam]=useState(DELIVERY_TEAM);
  const [platformSettings,setPlatformSettings]=useState(DEFAULT_SETTINGS);
  const [promoCodes,setPromoCodes]=useState(EDITABLE_PROMO_CODES);
  const [auditLogs,setAuditLogs]=useState(AUDIT_LOGS);
  const [notificationQueue,setNotificationQueue]=useState(NOTIFICATION_QUEUE);
  const [refundsCredits,setRefundsCredits]=useState(REFUNDS_CREDITS);
  const [adminMenu,setAdminMenu]=useState(MENU);
  const [editingMenuItem,setEditingMenuItem]=useState(null);
  const [menuItemForm,setMenuItemForm]=useState({name:"",desc:"",price:"",cal:"",category:"",flags:[]});

  const tRef=useRef(null);

  const showToast=useCallback(m=>{setToast(m);if(tRef.current)clearTimeout(tRef.current);tRef.current=setTimeout(()=>setToast(null),2200)},[]);
  const go=useCallback(p=>{
    setPage(p);
    window.location.hash=p==="home"?"":p;
  },[]);

  // URL hash routing
  useEffect(()=>{
    const handleHash=()=>{
      const hash=window.location.hash.slice(1);
      if(hash)setPage(hash);
    };
    handleHash();
    window.addEventListener("hashchange",handleHash);
    return()=>window.removeEventListener("hashchange",handleHash);
  },[]);

  const addToCart=useCallback(item=>{
    setCart(prev=>{
      if(prev.length>0&&prev[0].rid!==item.rid)return prev;
      const ex=prev.find(c=>c.id===item.id&&JSON.stringify(c.opts)===JSON.stringify(item.opts));
      if(ex)return prev.map(c=>c===ex?{...c,qty:c.qty+1}:c);
      return[...prev,{...item,qty:1}];
    });
    showToast(`Added ${item.name}`);
  },[showToast]);

  const removeFromCart=useCallback(id=>{
    setCart(prev=>{const it=prev.find(c=>c.id===id);if(it&&it.qty>1)return prev.map(c=>c.id===id?{...c,qty:c.qty-1}:c);return prev.filter(c=>c.id!==id)});
  },[]);

  const clearCart=useCallback(()=>setCart([]),[]);
  const toggleFav=useCallback(id=>setFavorites(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n}),[]);
  const cartCount=cart.reduce((s,c)=>s+c.qty,0);

  // Admin functions
  const approveRestaurant=useCallback((restaurantId)=>{
    const restaurant=adminPendingRestaurants.find(r=>r.id===restaurantId);
    if(restaurant){
      setAdminRestaurants(prev=>[...prev,{...restaurant,status:"active"}]);
      setAdminPendingRestaurants(prev=>prev.filter(r=>r.id!==restaurantId));
      showToast(`${restaurant.name} approved!`);
    }
  },[adminPendingRestaurants,showToast]);

  const rejectRestaurant=useCallback((restaurantId)=>{
    const restaurant=adminPendingRestaurants.find(r=>r.id===restaurantId);
    if(restaurant){
      setAdminPendingRestaurants(prev=>prev.filter(r=>r.id!==restaurantId));
      showToast(`${restaurant.name} rejected`);
    }
  },[adminPendingRestaurants,showToast]);

  const updateOrderStatus=useCallback((orderId,newStatus)=>{
    setAdminOrders(prev=>prev.map(o=>o.id===orderId?{...o,status:newStatus}:o));
    showToast(`Order ${orderId} updated to ${newStatus}`);
  },[showToast]);

  const assignDelivery=useCallback((orderId,deliveryId)=>{
    setAdminOrders(prev=>prev.map(o=>o.id===orderId?{...o,deliveryAssignment:deliveryId}:o));
    const deliveryPerson=DELIVERY_TEAM.find(d=>d.id===deliveryId);
    showToast(`Order assigned to ${deliveryPerson?.name}`);
  },[showToast]);

  const updateUserSubscription=useCallback((userId,newSubscription)=>{
    const user=ALL_USERS.find(u=>u.id===userId);
    showToast(`${user?.name}'s subscription updated to ${newSubscription}`);
  },[showToast]);

  const addDeliveryMember=useCallback((memberData)=>{
    const newMember={
      id:`d${adminDeliveryTeam.length+1}`,
      name:memberData.name,
      zone:memberData.zone,
      phone:memberData.phone,
      activeOrders:0,
      status:"active",
      joinedDate:new Date().toISOString().split("T")[0]
    };
    setAdminDeliveryTeam(prev=>[...prev,newMember]);
    showToast(`${memberData.name} added to delivery team!`);
  },[adminDeliveryTeam.length,showToast]);

  const updateDeliveryMemberStatus=useCallback((memberId,newStatus)=>{
    setAdminDeliveryTeam(prev=>prev.map(m=>m.id===memberId?{...m,status:newStatus}:m));
    const member=adminDeliveryTeam.find(m=>m.id===memberId);
    showToast(`${member?.name} status updated to ${newStatus}`);
  },[adminDeliveryTeam,showToast]);

  const placeOrder=useCallback(d=>{
    const newOrder={id:"LCH-"+Math.floor(1000+Math.random()*9000),rname:cart[0]?.rname||"The Green Table",rid:cart[0]?.rid||"r1",date:new Date().toISOString().split("T")[0],win:d.win,tot:d.tot,items:cart.map(c=>({id:c.id,name:c.name,price:c.price,qty:c.qty,opts:c.opts}))};
    setActiveOrder({...newOrder,status:0,building:building?.name||"One Market Plaza",address:building?.address||"123 Main St",placedAt:new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})});
    setTimeout(()=>{setPastOrders(p=>[newOrder,...p]);setActiveOrder(null);clearCart()},30000);
  },[cart,building,clearCart]);

  const reorder=useCallback(order=>{
    setCart(order.items.map(item=>({...item,rname:order.rname,rid:order.rid})));
    showToast("Items added to cart");
    setShowCart(true);
  },[showToast]);

  const addNotification=useCallback((title,message,icon="🔔")=>{
    setNotifications(prev=>[{id:"n"+Date.now(),title,message,time:new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),read:false,icon},...prev]);
  },[]);

  // Audit Log
  const logAdminAction=useCallback((action,details)=>{
    const logEntry={
      id:`log-${Date.now()}`,
      timestamp:new Date().toISOString(),
      admin:user?.email||"admin@lunchdrop.com",
      action,
      details,
      ipAddress:"192.168.1.1"
    };
    setAuditLogs(prev=>[logEntry,...prev]);
  },[user]);

  // Settings Management
  const updatePlatformSettings=useCallback((section,updates)=>{
    setPlatformSettings(prev=>({...prev,[section]:typeof updates==="function"?updates(prev[section]):updates}));
    logAdminAction("UPDATE_SETTINGS",{section,updates});
    showToast("Settings updated successfully");
  },[logAdminAction,showToast]);

  // Promo Code Management
  const createPromoCode=useCallback((codeData)=>{
    const newCode={id:`p${promoCodes.length+1}`,...codeData,used:0,active:true};
    setPromoCodes(prev=>[...prev,newCode]);
    logAdminAction("CREATE_PROMO",{code:codeData.code});
    showToast(`Promo code ${codeData.code} created!`);
  },[promoCodes.length,logAdminAction,showToast]);

  const updatePromoCode=useCallback((codeId,updates)=>{
    setPromoCodes(prev=>prev.map(c=>c.id===codeId?{...c,...updates}:c));
    logAdminAction("UPDATE_PROMO",{codeId,updates});
    showToast("Promo code updated");
  },[logAdminAction,showToast]);

  const deletePromoCode=useCallback((codeId)=>{
    const code=promoCodes.find(c=>c.id===codeId);
    setPromoCodes(prev=>prev.filter(c=>c.id!==codeId));
    logAdminAction("DELETE_PROMO",{code:code?.code});
    showToast("Promo code deleted");
  },[promoCodes,logAdminAction,showToast]);

  // Refund & Credit Management
  const processRefund=useCallback((orderId,amount,reason)=>{
    const order=adminOrders.find(o=>o.id===orderId);
    const refund={
      id:`ref-${Date.now()}`,
      orderId,
      customerName:order?.customerName,
      amount,
      reason,
      status:"processed",
      processedAt:new Date().toISOString(),
      processedBy:user?.email||"admin@lunchdrop.com"
    };
    setRefundsCredits(prev=>[refund,...prev]);
    setAdminOrders(prev=>prev.map(o=>o.id===orderId?{...o,status:"refunded",refundAmount:amount}:o));
    logAdminAction("PROCESS_REFUND",{orderId,amount,reason});
    showToast(`Refund of $${amount} processed for ${order?.customerName}`);
  },[adminOrders,user,logAdminAction,showToast]);

  // Menu Management Functions
  const addMenuItem=useCallback((restaurantId,categoryName,itemData)=>{
    const newItem={
      id:`m${Date.now()}`,
      name:itemData.name,
      desc:itemData.desc,
      price:parseFloat(itemData.price),
      cal:parseInt(itemData.cal)||0,
      flags:itemData.flags||[],
      pop:false,
      available:true,
      cust:[]
    };

    setAdminMenu(prev=>{
      const restaurantMenu=[...(prev[restaurantId]||[])];
      const categoryIndex=restaurantMenu.findIndex(cat=>cat.cat===categoryName);

      if(categoryIndex>=0){
        restaurantMenu[categoryIndex]={
          ...restaurantMenu[categoryIndex],
          items:[...restaurantMenu[categoryIndex].items,newItem]
        };
      }else{
        restaurantMenu.push({cat:categoryName,items:[newItem]});
      }

      return{...prev,[restaurantId]:restaurantMenu};
    });

    logAdminAction("ADD_MENU_ITEM",{restaurantId,categoryName,itemName:itemData.name});
    showToast(`Added ${itemData.name} to menu`);
    setMenuItemForm({name:"",desc:"",price:"",cal:"",category:"",flags:[]});
  },[logAdminAction,showToast]);

  const updateMenuItem=useCallback((restaurantId,itemId,updates)=>{
    setAdminMenu(prev=>{
      const restaurantMenu=[...(prev[restaurantId]||[])];
      const updatedMenu=restaurantMenu.map(cat=>({
        ...cat,
        items:cat.items.map(item=>item.id===itemId?{...item,...updates}:item)
      }));
      return{...prev,[restaurantId]:updatedMenu};
    });

    logAdminAction("UPDATE_MENU_ITEM",{restaurantId,itemId,updates});
    showToast("Menu item updated");
    setEditingMenuItem(null);
  },[logAdminAction,showToast]);

  const deleteMenuItem=useCallback((restaurantId,itemId,itemName)=>{
    if(!window.confirm(`Delete ${itemName}? This cannot be undone.`))return;

    setAdminMenu(prev=>{
      const restaurantMenu=[...(prev[restaurantId]||[])];
      const updatedMenu=restaurantMenu.map(cat=>({
        ...cat,
        items:cat.items.filter(item=>item.id!==itemId)
      })).filter(cat=>cat.items.length>0);
      return{...prev,[restaurantId]:updatedMenu};
    });

    logAdminAction("DELETE_MENU_ITEM",{restaurantId,itemId,itemName});
    showToast(`Deleted ${itemName}`);
  },[logAdminAction,showToast]);

  const toggleMenuItemAvailability=useCallback((restaurantId,itemId,currentStatus)=>{
    const newStatus=!currentStatus;
    setAdminMenu(prev=>{
      const restaurantMenu=[...(prev[restaurantId]||[])];
      const updatedMenu=restaurantMenu.map(cat=>({
        ...cat,
        items:cat.items.map(item=>item.id===itemId?{...item,available:newStatus}:item)
      }));
      return{...prev,[restaurantId]:updatedMenu};
    });

    logAdminAction("TOGGLE_MENU_ITEM",{restaurantId,itemId,available:newStatus});
    showToast(newStatus?"Item marked as available":"Item marked as unavailable");
  },[logAdminAction,showToast]);

  const cancelOrder=useCallback((orderId,reason)=>{
    const order=adminOrders.find(o=>o.id===orderId);
    setAdminOrders(prev=>prev.map(o=>o.id===orderId?{...o,status:"cancelled",cancelReason:reason}:o));
    logAdminAction("CANCEL_ORDER",{orderId,reason});
    showToast(`Order ${orderId} cancelled`);
    // Add to notification queue
    setNotificationQueue(prev=>[{
      id:`notif-${Date.now()}`,
      type:"email",
      recipient:order?.customerName,
      subject:"Order Cancelled",
      message:`Your order ${orderId} has been cancelled. Reason: ${reason}`,
      status:"sent",
      sentAt:new Date().toISOString()
    },...prev]);
  },[adminOrders,logAdminAction,showToast]);

  // Restaurant Menu Management
  const updateRestaurantMenu=useCallback((restaurantId,menuData)=>{
    setAdminRestaurants(prev=>prev.map(r=>r.id===restaurantId?{...r,menu:menuData}:r));
    logAdminAction("UPDATE_MENU",{restaurantId});
    showToast("Menu updated successfully");
  },[logAdminAction,showToast]);

  const markNotificationRead=useCallback(id=>{
    setNotifications(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));
  },[]);

  const markAllNotificationsRead=useCallback(()=>{
    setNotifications(prev=>prev.map(n=>({...n,read:true})));
  },[]);

  const ctx={page,go,cart,addToCart,removeFromCart,clearCart,cartCount,user,setUser,building,setBuilding,showAuth,setShowAuth,showBldg,setShowBldg,showCart,setShowCart,toast,showToast,favorites,toggleFav,activeOrder,placeOrder,pastOrders,reorder,notifications,addNotification,markNotificationRead,markAllNotificationsRead,adminRestaurants,adminPendingRestaurants,adminOrders,adminDeliveryTeam,approveRestaurant,rejectRestaurant,updateOrderStatus,assignDelivery,updateUserSubscription,addDeliveryMember,updateDeliveryMemberStatus,platformSettings,updatePlatformSettings,promoCodes,createPromoCode,updatePromoCode,deletePromoCode,auditLogs,logAdminAction,refundsCredits,processRefund,cancelOrder,notificationQueue,updateRestaurantMenu};

  const render=()=>{
    if(page.startsWith("r-"))return <RestaurantPage rid={page.replace("r-","")}/>;

    // Admin routes with access control
    if(page==="admin"){
      if(user?.role==="admin")return <AdminDashboard/>;
      return <AdminLogin/>;
    }
    if(page.startsWith("admin-")){
      if(user?.role!=="admin"){
        showToast("Access denied");
        go("admin");
        return <AdminLogin/>;
      }
      const adminSection=page.replace("admin-","");
      switch(adminSection){
        case"dashboard":return <AdminDashboard/>;
        case"analytics":return <AdminAnalytics/>;
        case"orders":return <AdminOrders/>;
        case"restaurants":return <AdminRestaurants/>;
        case"users":return <AdminUsers/>;
        case"delivery":return <AdminDelivery/>;
        case"maps":return <AdminMaps/>;
        case"notifications":return <AdminNotifications/>;
        case"promos":return <AdminPromos/>;
        case"settings":return <AdminSettings/>;
        case"logs":return <AdminAuditLogs/>;
        default:return <AdminDashboard/>;
      }
    }

    switch(page){
      case"home":return <Home/>;
      case"menu":return <MenuBrowse/>;
      case"orders":return <Orders/>;
      case"plans":return <Plans/>;
      case"profile":return <Profile/>;
      case"favorites":return <Favorites/>;
      case"help":return <Help/>;
      case"about":return <About/>;
      case"terms":return <Terms/>;
      case"privacy":return <Privacy/>;
      case"dashboard":return <RestaurantDashboard/>;
      case"signup":return <SignUpPage/>;
      default:return <Home/>;
    }
  };

  return(
    <AppCtx.Provider value={ctx}>
      <link href={FONTS} rel="stylesheet"/>
      <style>{CSS}</style>
      <div className="grain"/>
      <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
        <Navbar/>
        <div style={{flex:1}}>
          {render()}
        </div>
        <Footer/>
        <CartDrawer/>
        {showAuth&&<AuthModal/>}
        {showBldg&&<BuildingModal/>}
        <Toast msg={toast}/>
        {/* Floating cart bar */}
        {cartCount>0&&!showCart&&(
          <div className="up" style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:"var(--bark)",color:"#fff",padding:"12px 28px",borderRadius:100,boxShadow:"var(--sh4)",display:"flex",alignItems:"center",gap:14,cursor:"pointer",zIndex:90}}
            onClick={()=>setShowCart(true)}>
            <span style={{display:"flex",alignItems:"center",opacity:.8}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span>
            <span style={{fontWeight:700,fontSize:14}}>{cartCount} item{cartCount>1?"s":""}</span>
            <div style={{width:1,height:16,background:"rgba(255,255,255,.2)"}}/>
            <span style={{fontFamily:"var(--serif)",fontSize:16}}>${cart.reduce((s,c)=>s+c.price*c.qty,0).toFixed(2)}</span>
            <span style={{background:"var(--terra)",padding:"6px 16px",borderRadius:100,fontWeight:700,fontSize:13,marginLeft:4}}>View Cart →</span>
          </div>
        )}
      </div>
    </AppCtx.Provider>
  );
}

import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "motion/react";
import { ShoppingBag, Search, Menu, X, ArrowRight, ArrowUpRight, Plus, Minus, Trash2, Globe, Instagram, Twitter, ChevronRight, Filter } from "lucide-react";
import React, { useState, useRef, useEffect, useMemo } from "react";

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  details: string[];
}

interface CartItem extends Product {
  quantity: number;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  {
    id: "v-01",
    name: "CYBER-SHELL PARKA",
    price: 450,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    description: "Water-resistant technical shell with modular cargo pockets.",
    details: ["3-Layer Gore-Tex", "YKK Aquaguard Zips", "Articulated Sleeves"],
  },
  {
    id: "v-02",
    name: "ARCHIVE CARGO V2",
    price: 280,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    description: "Heavyweight cotton twill with 8-pocket tactical configuration.",
    details: ["Reinforced Knees", "Adjustable Cuffs", "D-Ring Attachments"],
  },
  {
    id: "v-03",
    name: "VOID LOGO HOODIE",
    price: 160,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    description: "450GSM French Terry with high-density screenprint.",
    details: ["Oversized Fit", "Dropped Shoulders", "Pre-shrunk"],
  },
  {
    id: "v-04",
    name: "TACTICAL SLING BAG",
    price: 120,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800",
    description: "Ballistic nylon construction with Fidlock buckle system.",
    details: ["MOLLE Compatible", "Internal Laptop Sleeve", "Weatherproof"],
  },
  {
    id: "v-05",
    name: "STEALTH BOMBER",
    price: 380,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
    description: "Insulated flight jacket with reflective paneling.",
    details: ["Primaloft Gold Insulation", "Reflective Trim", "Utility Arm Pocket"],
  },
  {
    id: "v-06",
    name: "TECH-KNIT JOGGERS",
    price: 220,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800",
    description: "Engineered knit construction for maximum mobility.",
    details: ["4-Way Stretch", "Breathable Panels", "Zippered Pockets"],
  },
  {
    id: "v-07",
    name: "VOID BEANIE",
    price: 45,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
    description: "Merino wool blend with woven brand label.",
    details: ["100% Merino Wool", "Double Layer Knit", "One Size Fits All"],
  },
  {
    id: "v-08",
    name: "MODULAR BELT",
    price: 95,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1624222247344-550fbadcd973?auto=format&fit=crop&q=80&w=800",
    description: "Heavy-duty webbing with Cobra buckle.",
    details: ["AustriAlpin Cobra Buckle", "Mil-Spec Webbing", "Adjustable Length"],
  },
];

const NEW_ARRIVALS: Product[] = [
  {
    id: "n-01",
    name: "PHANTOM TECH VEST",
    price: 320,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
    description: "Lightweight utility vest with 12 modular attachment points.",
    details: ["Ripstop Nylon", "Breathable Mesh Back", "Quick-Release Buckles"],
  },
  {
    id: "n-02",
    name: "GLITCH GRAPHIC TEE",
    price: 85,
    category: "Tops",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "Heavyweight cotton with distorted digital print.",
    details: ["Boxy Fit", "Screenprinted Graphics", "280GSM Cotton"],
  },
  {
    id: "n-03",
    name: "URBAN EXPLORER CAP",
    price: 55,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
    description: "Water-repellent 5-panel cap with reflective logo.",
    details: ["Adjustable Strap", "Moisture-Wicking Band", "Reflective Details"],
  },
  {
    id: "n-04",
    name: "TACTICAL GLOVES",
    price: 75,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    description: "Touchscreen compatible gloves with reinforced palms.",
    details: ["Kevlar Stitching", "Breathable Fabric", "Adjustable Wrist"],
  },
  {
    id: "n-05",
    name: "VOID CARGO SHORTS",
    price: 180,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800",
    description: "Technical shorts with oversized cargo pockets.",
    details: ["Water Repellent", "Quick Dry", "Multi-Pocket System"],
  },
];

// --- Components ---

const Navbar = ({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-display tracking-tighter text-white"
      >
        VOID<span className="text-accent">ARCHIVE</span>
      </motion.div>
      
      <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.3em] font-black text-white/60">
        {["Shop", "New Arrivals", "Archive", "Lookbook"].map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="hover:text-white transition-colors">
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <button className="text-white/60 hover:text-white transition-colors">
          <Search size={20} />
        </button>
        <button 
          onClick={onOpenCart}
          className="relative text-white/60 hover:text-white transition-colors"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemove,
  onCheckout
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-ink border-l border-white/10 z-[70] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-display">YOUR BAG</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={48} className="mb-4" />
                  <p className="text-sm uppercase tracking-widest">Bag is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-32 bg-muted overflow-hidden rounded-lg">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-tight mb-1">{item.name}</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest">{item.category}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 bg-white/5 rounded-full px-3 py-1">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="hover:text-accent"><Minus size={12} /></button>
                          <span className="text-xs font-mono">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="hover:text-accent"><Plus size={12} /></button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-mono">${item.price * item.quantity}</span>
                          <button onClick={() => onRemove(item.id)} className="text-white/20 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex justify-between items-end mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Subtotal</span>
                <span className="text-3xl font-mono">${total}</span>
              </div>
              <button 
                onClick={onCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-white text-ink py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-all disabled:opacity-20"
              >
                Checkout Now <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProductDetail = ({ 
  product, 
  onClose, 
  onAddToCart,
  allProducts,
  onSelectProduct
}: { 
  product: Product; 
  onClose: () => void; 
  onAddToCart: (p: Product) => void;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
}) => {
  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [product.id, allProducts]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-ink overflow-y-auto no-scrollbar"
    >
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Image Section */}
          <div className="lg:w-1/2 h-[70vh] lg:h-screen sticky top-0 bg-muted overflow-hidden">
            <motion.img 
              key={product.id}
              initial={{ scale: 1.2, filter: "grayscale(100%)" }}
              animate={{ scale: 1, filter: "grayscale(0%)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={onClose}
              className="absolute top-8 left-8 p-5 bg-ink/80 backdrop-blur-xl rounded-full text-white hover:bg-accent hover:scale-110 transition-all z-10"
            >
              <X size={24} />
            </button>
          </div>

          {/* Right: Info Section */}
          <div className="lg:w-1/2 p-8 md:p-24 flex flex-col justify-center bg-ink">
            <motion.div
              key={product.id + "-info"}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="text-accent font-mono text-[10px] uppercase tracking-[0.6em]">{product.category}</span>
                <div className="h-px w-12 bg-accent/30" />
                <span className="text-white/20 font-mono text-[10px] uppercase tracking-[0.6em]">Archive_v2.4</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-display leading-[0.9] mb-12 uppercase tracking-tighter">{product.name}</h2>
              
              <div className="flex items-baseline gap-6 mb-16">
                <span className="text-4xl font-mono tracking-tighter">${product.price}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Tax Included / Global Shipping</span>
              </div>

              <p className="text-xl text-white/50 leading-relaxed mb-16 max-w-lg font-light">
                {product.description}
              </p>

              <div className="space-y-6 mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 border-b border-white/5 pb-4">Technical Specifications</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {product.details.map((detail, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      key={i} 
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                      <span className="text-xs uppercase tracking-[0.2em] text-white/80 leading-tight">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-white text-ink px-12 py-7 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-4 group"
                >
                  Add to Bag 
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                </button>
                <button className="px-12 py-7 rounded-full border border-white/10 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:text-ink transition-all">
                  Size Guide
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="py-32 px-8 md:px-24 bg-[#080808] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-xl">
                <span className="text-accent font-mono text-[10px] uppercase tracking-[0.6em] mb-6 block">System Recommendations</span>
                <h3 className="text-5xl md:text-7xl font-display uppercase leading-none tracking-tighter">You might be <br /><span className="text-outline italic">Interested.</span></h3>
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black max-w-[200px] leading-relaxed">
                Curated selections from the VOID ARCHIVE to complement your current selection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    onSelectProduct(p);
                    const container = document.querySelector('.fixed.inset-0.z-\\[100\\]');
                    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-muted mb-8 relative">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="glass w-full py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-center backdrop-blur-md">
                        View Archive Item
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start px-2">
                    <div>
                      <h4 className="text-xl font-display uppercase mb-2 group-hover:text-accent transition-colors">{p.name}</h4>
                      <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black">{p.category}</p>
                    </div>
                    <span className="font-mono text-base tracking-tighter opacity-60">${p.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const CheckoutPage = ({ 
  cartItems, 
  onClose,
  onComplete
}: { 
  cartItems: CartItem[]; 
  onClose: () => void;
  onComplete: () => void;
}) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed inset-0 z-[110] bg-ink overflow-y-auto p-8 md:p-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-20">
          <h2 className="text-4xl md:text-6xl font-display">CHECKOUT</h2>
          <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full transition-colors">
            <X size={32} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form */}
          <div className="space-y-12">
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent mb-8">Shipping Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <input type="text" placeholder="First Name" className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none" />
                <input type="text" placeholder="Last Name" className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none" />
                <input type="email" placeholder="Email Address" className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none" />
                <input type="text" placeholder="Shipping Address" className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none" />
                <input type="text" placeholder="City" className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none" />
                <input type="text" placeholder="Zip Code" className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none" />
              </div>
            </section>

            <section>
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent mb-8">Payment Method</h3>
              <div className="p-6 border-2 border-accent bg-accent/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full border-4 border-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest">Cash on Delivery</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-accent/60">Only Option Available</span>
              </div>
            </section>

            <button 
              onClick={onComplete}
              className="w-full bg-white text-ink py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all shadow-2xl shadow-white/5"
            >
              Complete Order
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 p-12 rounded-3xl h-fit sticky top-20">
            <h3 className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-8">Order Summary</h3>
            <div className="space-y-6 mb-12">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-accent">x{item.quantity}</span>
                    <span className="text-xs uppercase tracking-widest font-bold">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-8 space-y-4">
              <div className="flex justify-between text-xs uppercase tracking-widest text-white/40">
                <span>Shipping</span>
                <span className="text-accent">Free</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-[0.5em] font-black">Total</span>
                <span className="text-4xl font-mono">${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const filteredProducts = selectedCategory === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-ink" ref={containerRef}>
      <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={(p) => {
              addToCart(p);
              setSelectedProduct(null);
            }}
            allProducts={[...PRODUCTS, ...NEW_ARRIVALS]}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutPage 
            cartItems={cart} 
            onClose={() => setIsCheckoutOpen(false)}
            onComplete={() => {
              setOrderComplete(true);
              setIsCheckoutOpen(false);
              setCart([]);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {orderComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ink flex items-center justify-center p-8 text-center"
          >
            <div className="max-w-md">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8">
                <ArrowUpRight size={48} className="text-white" />
              </div>
              <h2 className="text-5xl font-display mb-6">ORDER RECEIVED</h2>
              <p className="text-sm uppercase tracking-widest text-white/40 mb-12">
                Your archive request has been processed. Payment will be collected upon delivery.
              </p>
              <button 
                onClick={() => setOrderComplete(false)}
                className="bg-white text-ink px-12 py-6 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all"
              >
                Return to Void
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REFINED SPLIT HERO SECTION */}
      <section className="relative h-screen grid grid-cols-1 lg:grid-cols-2 bg-ink overflow-hidden">
        {/* Left Side: Content */}
        <div className="relative z-20 flex flex-col justify-center px-8 md:px-20 py-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-accent font-mono text-xs uppercase tracking-[0.5em] mb-8 block">Archive 001 // System</span>
            <h1 className="text-[12vw] lg:text-[10vw] leading-[0.85] tracking-tighter mb-12 font-display">
              VOID<br />
              ARCHIVE
            </h1>
            
            <p className="max-w-sm text-sm uppercase tracking-widest font-bold text-white/40 leading-relaxed mb-12">
              High-performance technical garments designed for the modern urban environment. Engineered for durability, utility, and style.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <a href="#shop" className="group relative overflow-hidden bg-white text-ink px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-accent hover:text-white">
                Shop Collection
              </a>
              <button className="glass text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-ink transition-all">
                Lookbook
              </button>
            </div>
          </motion.div>
          
          {/* Bottom Info */}
          <div className="absolute bottom-12 left-8 md:left-20 flex gap-12">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-white/20 uppercase">Coordinates</span>
              <span className="text-[10px] font-mono text-white/60">35.6895° N, 139.6917° E</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-white/20 uppercase">Version</span>
              <span className="text-[10px] font-mono text-white/60">v1.0.4-Archive</span>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="relative h-full overflow-hidden hidden lg:block">
          <motion.div 
            style={{ y: heroY }}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=2000" 
              alt="Fashion Model" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-transparent" />
          </motion.div>
          
          {/* Floating Detail */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 right-12 glass p-6 rounded-2xl border border-white/10 max-w-[200px]"
          >
            <p className="text-[10px] font-mono text-accent mb-2">FEATURED_ITEM</p>
            <p className="text-xs font-bold uppercase tracking-widest leading-tight">CYBER-SHELL PARKA V1</p>
          </motion.div>
        </div>

        {/* Mobile Background (for small screens) */}
        <div className="absolute inset-0 z-0 lg:hidden">
           <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=2000" 
              alt="Fashion Model Mobile" 
              className="w-full h-full object-cover grayscale opacity-20"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink" />
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-30 lg:hidden"
        >
          <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
          <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.4em]">Scroll</span>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="py-6 border-y border-white/5 bg-white/5 backdrop-blur-md relative z-10">
        <div className="marquee-track flex gap-12 items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <span className="text-sm font-mono text-white/40">EST. 2024</span>
              <div className="w-1 h-1 bg-accent rounded-full" />
              <span className="text-sm font-mono text-white/40">GLOBAL SHIPPING</span>
              <div className="w-1 h-1 bg-accent rounded-full" />
              <span className="text-sm font-mono text-white/40">LIMITED EDITION</span>
              <div className="w-1 h-1 bg-accent rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Shop Section */}
      <section id="shop" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <span className="text-accent font-mono text-xs uppercase tracking-widest mb-4 block">Archive 001</span>
            <h2 className="text-6xl md:text-8xl">The Collection.</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {["All", "Outerwear", "Tops", "Bottoms", "Accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat ? "bg-white text-ink border-white" : "border-white/10 text-white/40 hover:border-white/40"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted mb-6 cursor-pointer"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  
                  {/* Quick Add Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-white text-ink py-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all"
                    >
                      Add to Bag <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-display mb-1">{product.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">{product.category}</p>
                  </div>
                  <span className="font-mono text-lg">${product.price}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* NEW ARRIVALS SECTION */}
      <section id="new-arrivals" className="py-32 px-6 bg-white text-ink">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <div className="text-center md:text-left">
              <span className="text-accent font-mono text-xs uppercase tracking-widest mb-4 block">Drop 002 // Incoming</span>
              <h2 className="text-7xl md:text-9xl leading-none">NEW<br /><span className="text-outline italic">ARRIVALS.</span></h2>
            </div>
            <div className="hidden lg:block">
              <p className="max-w-xs text-[10px] uppercase tracking-[0.3em] font-black opacity-40 leading-relaxed">
                The latest evolution of the VOID ARCHIVE system. High-performance garments designed for the modern nomad.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {NEW_ARRIVALS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted mb-8 cursor-pointer"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  
                  {/* Technical Detail Overlay */}
                  <div className="absolute top-8 left-8">
                    <div className="glass px-4 py-2 rounded-full text-[8px] font-mono text-white uppercase tracking-widest">
                      {product.category} // ARCHIVE_ID: {product.id}
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-ink text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent transition-all"
                    >
                      Acquire Item <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-end px-4">
                  <div>
                    <h3 className="text-2xl font-display mb-2">{product.name}</h3>
                    <ul className="flex gap-4">
                      {product.details.slice(0, 2).map(detail => (
                        <li key={detail} className="text-[8px] uppercase tracking-widest font-black opacity-40 border-r border-ink/10 pr-4 last:border-0">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="text-2xl font-mono font-black">${product.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook Section */}
      <section id="lookbook" className="py-32 bg-ink text-white overflow-hidden">
        <div className="flex flex-col items-center mb-20 text-center px-6">
          <h2 className="text-[15vw] leading-none mb-4">LOOKBOOK</h2>
          <p className="max-w-md text-sm uppercase tracking-widest font-bold opacity-40">Visual documentation of the urban explorer. Archive 001.</p>
        </div>

        <div className="flex gap-8 overflow-x-auto px-6 no-scrollbar pb-12">
          {[
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
          ].map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 0.98 }}
              className="min-w-[300px] md:min-w-[500px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img src={img} alt={`Lookbook ${i}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Details / Features */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-5xl md:text-7xl mb-12">Technical <br /><span className="text-accent italic">Specs.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: "Modular Design", desc: "Every piece is designed to integrate seamlessly with the rest of the collection." },
                { title: "Performance Fabrics", desc: "Utilizing high-tech textiles including Gore-Tex, Cordura, and Dyneema." },
                { title: "Ergonomic Fit", desc: "Articulated patterns designed for maximum range of motion in urban environments." },
                { title: "Sustainable Sourcing", desc: "Committed to ethical manufacturing and recycled technical materials." },
              ].map((spec) => (
                <div key={spec.title}>
                  <h4 className="text-xl font-display mb-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    {spec.title}
                  </h4>
                  <p className="text-sm text-white/40 leading-relaxed">{spec.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 p-12 rounded-3xl border border-white/10 flex flex-col justify-center">
            <div className="text-accent mb-6"><Globe size={48} /></div>
            <h3 className="text-3xl font-display mb-4">GLOBAL ARCHIVE</h3>
            <p className="text-sm text-white/40 mb-8 leading-relaxed">Join our global network of explorers. Get early access to future drops and exclusive archive releases.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="ENTER EMAIL" 
                className="w-full bg-transparent border-b border-white/20 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-colors"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-accent hover:translate-x-2 transition-transform">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="text-4xl font-display tracking-tighter">
              VOID<span className="text-accent">ARCHIVE</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-black text-white/20 mb-6">Support</h4>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-accent transition-colors">Shipping</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Returns</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Size Guide</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-black text-white/20 mb-6">Company</h4>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Sustainability</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-white/20 mb-6">Social</h4>
                <div className="flex gap-6">
                  <Instagram size={20} className="hover:text-accent cursor-pointer transition-colors" />
                  <Twitter size={20} className="hover:text-accent cursor-pointer transition-colors" />
                  <Globe size={20} className="hover:text-accent cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-mono text-white/20">© 2024 VOID ARCHIVE SYSTEM. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 text-[10px] font-mono text-white/20 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

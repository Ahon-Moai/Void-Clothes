import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ShoppingBag, Search, Menu, X, ArrowRight, ArrowUpRight, Plus, Minus, Trash2, Globe, Instagram, Twitter } from "lucide-react";
import React, { useState, useRef, useMemo } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center mix-blend-difference">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-lg sm:text-2xl font-display tracking-tighter text-white"
      >
        VOID<span className="text-accent">ARCHIVE</span>
      </motion.div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8 lg:gap-12 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black text-white/60">
        {["Shop", "New Arrivals", "Archive", "Lookbook"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            className="hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="text-white/60 hover:text-white transition-colors">
          <Search size={18} />
        </button>
        <button onClick={onOpenCart} className="relative text-white/60 hover:text-white transition-colors">
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white/60 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-ink/95 backdrop-blur-md border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {["Shop", "New Arrivals", "Archive", "Lookbook"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-widest font-bold text-white/80 hover:text-accent transition-colors py-3 border-b border-white/5 last:border-0"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemove,
  onCheckout,
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
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-ink border-l border-white/10 z-[70] flex flex-col"
          >
            {/* Cart Header */}
            <div className="flex justify-between items-center px-5 sm:px-8 py-5 sm:py-8 border-b border-white/10 flex-shrink-0">
              <h2 className="text-2xl sm:text-3xl font-display">YOUR BAG</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 sm:px-8 py-5 sm:py-8 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <ShoppingBag size={40} className="mb-4" />
                  <p className="text-xs uppercase tracking-widest">Bag is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 sm:gap-5">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 bg-muted overflow-hidden rounded-xl flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-tight mb-1 truncate">{item.name}</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.category}</p>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 bg-white/5 rounded-full px-2 sm:px-3 py-1">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="hover:text-accent p-0.5">
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="hover:text-accent p-0.5">
                            <Plus size={10} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono">${item.price * item.quantity}</span>
                          <button onClick={() => onRemove(item.id)} className="text-white/20 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            <div className="px-5 sm:px-8 py-5 sm:py-8 border-t border-white/10 flex-shrink-0">
              <div className="flex justify-between items-center mb-5">
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/40">Subtotal</span>
                <span className="text-2xl sm:text-3xl font-mono">${total}</span>
              </div>
              <button
                onClick={onCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-white text-ink py-4 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all disabled:opacity-20"
              >
                Checkout Now <ArrowRight size={14} />
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
  onSelectProduct,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
}) => {
  const detailRef = useRef<HTMLDivElement>(null);

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [product.id, allProducts]);

  const scrollToTop = () => {
    detailRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      ref={detailRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-ink overflow-y-auto no-scrollbar"
    >
      <div className="min-h-screen flex flex-col">
        {/* Close button — always visible at top */}
        <button
          onClick={onClose}
          className="fixed top-4 left-4 sm:top-8 sm:left-8 p-3 sm:p-4 bg-ink/90 backdrop-blur-xl rounded-full text-white hover:bg-accent hover:scale-110 transition-all z-[110] border border-white/10"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image */}
          <div className="lg:w-1/2 h-[55vw] min-h-[260px] max-h-[520px] lg:h-screen lg:max-h-none lg:sticky lg:top-0 bg-muted overflow-hidden">
            <motion.img
              key={product.id}
              initial={{ scale: 1.2, filter: "grayscale(100%)" }}
              animate={{ scale: 1, filter: "grayscale(0%)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="lg:w-1/2 px-5 sm:px-8 md:px-16 lg:px-24 py-10 sm:py-16 lg:py-24 flex flex-col justify-center bg-ink">
            <motion.div
              key={product.id + "-info"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-5 sm:mb-8">
                <span className="text-accent font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.6em]">{product.category}</span>
                <div className="h-px w-8 bg-accent/30" />
                <span className="text-white/20 font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.6em]">Archive_v2.4</span>
              </div>

              <h2 className="text-4xl sm:text-6xl md:text-7xl font-display leading-[0.9] mb-6 sm:mb-10 uppercase tracking-tighter break-words">{product.name}</h2>

              <div className="flex flex-wrap items-baseline gap-3 mb-8 sm:mb-12">
                <span className="text-2xl sm:text-4xl font-mono tracking-tighter">${product.price}</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/30">Tax Included / Global Shipping</span>
              </div>

              <p className="text-sm sm:text-lg text-white/50 leading-relaxed mb-8 sm:mb-12 max-w-lg font-light">{product.description}</p>

              <div className="space-y-4 mb-8 sm:mb-12">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] font-black text-white/20 border-b border-white/5 pb-4">
                  Technical Specifications
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {product.details.map((detail, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      key={i}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                      <span className="text-xs uppercase tracking-[0.2em] text-white/80 leading-tight">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-white text-ink px-6 py-4 sm:py-5 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3 group"
                >
                  Add to Bag
                  <Plus size={15} className="group-hover:rotate-90 transition-transform" />
                </button>
                <button className="flex-1 sm:flex-none px-6 py-4 sm:py-5 rounded-full border border-white/10 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-ink transition-all">
                  Size Guide
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <section className="py-16 sm:py-28 px-4 sm:px-8 md:px-16 bg-[#080808] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 sm:mb-16">
              <span className="text-accent font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.6em] mb-4 block">System Recommendations</span>
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-display uppercase leading-none tracking-tighter">
                You might be <br />
                <span className="text-outline italic">Interested.</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {relatedProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    onSelectProduct(p);
                    scrollToTop();
                  }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted mb-3 sm:mb-5 relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="px-1">
                    <h4 className="text-sm sm:text-base font-display uppercase mb-1 group-hover:text-accent transition-colors leading-tight">{p.name}</h4>
                    <div className="flex justify-between items-center">
                      <p className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black">{p.category}</p>
                      <span className="font-mono text-xs sm:text-sm opacity-60">${p.price}</span>
                    </div>
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
  onComplete,
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
      className="fixed inset-0 z-[110] bg-ink overflow-y-auto no-scrollbar"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-16">
        <div className="flex justify-between items-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-display">CHECKOUT</h2>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          {/* Form */}
          <div className="space-y-8 sm:space-y-10 order-2 lg:order-1">
            <section>
              <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-accent mb-6">Shipping Information</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="col-span-2 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none"
                />
                <input
                  type="text"
                  placeholder="Shipping Address"
                  className="col-span-2 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none"
                />
                <input
                  type="text"
                  placeholder="City"
                  className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl text-xs uppercase tracking-widest focus:border-accent outline-none"
                />
              </div>
            </section>

            <section>
              <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-accent mb-6">Payment Method</h3>
              <div className="p-4 sm:p-5 border-2 border-accent bg-accent/5 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full border-4 border-accent flex-shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-widest">Cash on Delivery</span>
                </div>
                <span className="text-[8px] uppercase tracking-widest text-accent/60 text-right">Only Option</span>
              </div>
            </section>

            <button
              onClick={onComplete}
              className="w-full bg-white text-ink py-4 sm:py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all"
            >
              Complete Order
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 p-5 sm:p-10 rounded-3xl order-1 lg:order-2 lg:sticky lg:top-6 h-fit">
            <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-white/40 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[9px] font-mono text-accent flex-shrink-0">x{item.quantity}</span>
                    <span className="text-xs uppercase tracking-widest font-bold truncate">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono flex-shrink-0">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex justify-between text-xs uppercase tracking-widest text-white/40">
                <span>Shipping</span>
                <span className="text-accent">Free</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] font-black">Total</span>
                <span className="text-3xl sm:text-4xl font-mono">${total}</span>
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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredProducts = selectedCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selectedCategory);

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
            className="fixed inset-0 z-[200] bg-ink flex items-center justify-center p-6 text-center"
          >
            <div className="max-w-sm w-full">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <ArrowUpRight size={40} className="text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-display mb-4 sm:mb-6">ORDER RECEIVED</h2>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-8 sm:mb-12 leading-relaxed">
                Your archive request has been processed. Payment will be collected upon delivery.
              </p>
              <button
                onClick={() => setOrderComplete(false)}
                className="bg-white text-ink px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all w-full sm:w-auto"
              >
                Return to Void
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      {/* 
        FIX: Changed h-screen to min-h-[100dvh] (uses dynamic viewport height,
        avoids mobile browser chrome cropping). Grid is 1-col on mobile,
        2-col on lg+. Left content now has proper top padding to clear the
        fixed navbar on all breakpoints. Bottom info moved into flex flow
        (no longer absolute) so it never overlaps the main content.
      */}
      <section className="relative min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 bg-ink overflow-hidden">
        {/* Left: Content */}
        <div className="relative z-20 flex flex-col justify-between px-5 sm:px-8 md:px-16 lg:px-20 pt-24 sm:pt-28 pb-8 sm:pb-12 min-h-[100dvh] lg:min-h-0 lg:h-screen">
          {/* Main copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col justify-center"
          >
            <span className="text-accent font-mono text-[8px] sm:text-xs uppercase tracking-[0.5em] mb-4 sm:mb-8 block">
              Archive 001 // System
            </span>
            <h1 className="text-[18vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] tracking-tighter mb-6 sm:mb-10 font-display">
              VOID
              <br />
              ARCHIVE
            </h1>
            <p className="max-w-sm text-xs sm:text-sm uppercase tracking-widest font-bold text-white/40 leading-relaxed mb-6 sm:mb-10">
              High-performance technical garments designed for the modern urban environment. Engineered for durability, utility, and style.
            </p>
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
              <a
                href="#shop"
                className="bg-white text-ink px-7 sm:px-10 py-3.5 sm:py-5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-accent hover:text-white text-center"
              >
                Shop Collection
              </a>
              <button className="glass text-white px-7 sm:px-10 py-3.5 sm:py-5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-ink transition-all">
                Lookbook
              </button>
            </div>
          </motion.div>

          {/* Bottom meta info — in flow, no absolute positioning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8 sm:gap-12 pt-8"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[7px] font-mono text-white/20 uppercase">Coordinates</span>
              <span className="text-[8px] sm:text-[9px] font-mono text-white/60">35.6895° N, 139.6917° E</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[7px] font-mono text-white/20 uppercase">Version</span>
              <span className="text-[8px] sm:text-[9px] font-mono text-white/60">v1.0.4-Archive</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Image (desktop only) */}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 right-12 glass p-5 rounded-2xl border border-white/10 max-w-[200px]"
          >
            <p className="text-[10px] font-mono text-accent mb-2">FEATURED_ITEM</p>
            <p className="text-xs font-bold uppercase tracking-widest leading-tight">CYBER-SHELL PARKA V1</p>
          </motion.div>
        </div>

        {/* Mobile background image */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=2000"
            alt=""
            className="w-full h-full object-cover grayscale opacity-15"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/80" />
        </div>
      </section>

      {/* ─── MARQUEE ──────────────────────────────────────────────── */}
      <div className="py-4 sm:py-5 border-y border-white/5 bg-white/5 backdrop-blur-md relative z-10 overflow-hidden">
        <div className="marquee-track flex gap-8 sm:gap-12 items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-8 sm:gap-12 items-center flex-shrink-0">
              <span className="text-xs font-mono text-white/40 whitespace-nowrap">EST. 2024</span>
              <div className="w-1 h-1 bg-accent rounded-full" />
              <span className="text-xs font-mono text-white/40 whitespace-nowrap">GLOBAL SHIPPING</span>
              <div className="w-1 h-1 bg-accent rounded-full" />
              <span className="text-xs font-mono text-white/40 whitespace-nowrap">LIMITED EDITION</span>
              <div className="w-1 h-1 bg-accent rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* ─── SHOP ─────────────────────────────────────────────────── */}
      <section id="shop" className="py-14 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16 gap-6">
          <div>
            <span className="text-accent font-mono text-[8px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-4 block">Archive 001</span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-display">The Collection.</h2>
          </div>

          {/* Category filter — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            {["All", "Outerwear", "Tops", "Bottoms", "Accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all border ${
                  selectedCategory === cat ? "bg-white text-ink border-white" : "border-white/10 text-white/40 hover:border-white/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
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
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted mb-3 sm:mb-5 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                  {/* Quick Add — tap-friendly on mobile */}
                  <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="w-full bg-white text-ink py-3 sm:py-3.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-accent hover:text-white transition-all"
                    >
                      Add to Bag <Plus size={11} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-base font-display mb-0.5 sm:mb-1 truncate">{product.name}</h3>
                    <p className="text-[7px] sm:text-[9px] uppercase tracking-widest text-white/40 font-black">{product.category}</p>
                  </div>
                  <span className="font-mono text-sm sm:text-base flex-shrink-0">${product.price}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── NEW ARRIVALS ─────────────────────────────────────────── */}
      <section id="new-arrivals" className="py-14 sm:py-28 px-4 sm:px-6 bg-white text-ink">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 sm:mb-16 gap-6">
            <div>
              <span className="text-accent font-mono text-[8px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-4 block">Drop 002 // Incoming</span>
              <h2 className="text-5xl sm:text-7xl md:text-8xl leading-none font-display">
                NEW
                <br />
                <span className="text-outline italic">ARRIVALS.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[8px] sm:text-[10px] uppercase tracking-[0.3em] font-black opacity-40 leading-relaxed">
              The latest evolution of the VOID ARCHIVE system. High-performance garments designed for the modern nomad.
            </p>
          </div>

          {/* 
            FIX: Changed to 2-col on mobile (was 1-col) and used
            last-odd child to span full width when 5 items in a 2-col grid. 
          */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {NEW_ARRIVALS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`group ${
                  // Last item when total is odd — center it on sm/below, span full on lg
                  i === NEW_ARRIVALS.length - 1 && NEW_ARRIVALS.length % 2 !== 0
                    ? "col-span-2 sm:col-span-2 lg:col-span-1 max-w-[50%] sm:max-w-[50%] mx-auto lg:mx-0 lg:max-w-none w-full"
                    : ""
                }`}
              >
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted mb-3 sm:mb-6 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                  <div className="absolute top-3 sm:top-6 left-3 sm:left-6">
                    <div className="glass px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[7px] sm:text-[8px] font-mono text-white uppercase tracking-widest">
                      {product.category} // {product.id}
                    </div>
                  </div>

                  <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="w-full bg-ink text-white py-3 sm:py-4 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent transition-all"
                    >
                      Acquire <Plus size={11} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-end gap-2 px-1 sm:px-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-xl font-display mb-1 leading-tight">{product.name}</h3>
                    <p className="text-[7px] sm:text-[8px] uppercase tracking-widest font-black opacity-40 truncate">
                      {product.details.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                  <span className="text-base sm:text-xl font-mono font-black flex-shrink-0">${product.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOOKBOOK ─────────────────────────────────────────────── */}
      <section id="lookbook" className="py-14 sm:py-28 bg-ink text-white overflow-hidden">
        <div className="flex flex-col items-center mb-10 sm:mb-16 text-center px-4">
          <h2 className="text-[13vw] sm:text-[10vw] leading-none mb-3 font-display">LOOKBOOK</h2>
          <p className="max-w-md text-xs uppercase tracking-widest font-bold opacity-40">
            Visual documentation of the urban explorer. Archive 001.
          </p>
        </div>

        {/* FIX: min-w uses vw units so ~1.3 items always visible on mobile */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto px-4 sm:px-6 no-scrollbar pb-4 sm:pb-8">
          {[
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
          ].map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 0.98 }}
              className="min-w-[72vw] sm:min-w-[320px] md:min-w-[480px] aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden flex-shrink-0"
            >
              <img
                src={img}
                alt={`Lookbook ${i}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TECHNICAL SPECS ──────────────────────────────────────── */}
      <section className="py-14 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-14">
          <div className="lg:col-span-2">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-display mb-8 sm:mb-12">
              Technical <br />
              <span className="text-accent italic">Specs.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
              {[
                { title: "Modular Design", desc: "Every piece is designed to integrate seamlessly with the rest of the collection." },
                { title: "Performance Fabrics", desc: "Utilizing high-tech textiles including Gore-Tex, Cordura, and Dyneema." },
                { title: "Ergonomic Fit", desc: "Articulated patterns designed for maximum range of motion in urban environments." },
                { title: "Sustainable Sourcing", desc: "Committed to ethical manufacturing and recycled technical materials." },
              ].map((spec) => (
                <div key={spec.title}>
                  <h4 className="text-base sm:text-xl font-display mb-2 sm:mb-3 flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                    {spec.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/40 leading-relaxed">{spec.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 p-6 sm:p-10 rounded-3xl border border-white/10 flex flex-col justify-center">
            <div className="text-accent mb-4 sm:mb-6">
              <Globe size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-display mb-3">GLOBAL ARCHIVE</h3>
            <p className="text-xs sm:text-sm text-white/40 mb-6 sm:mb-8 leading-relaxed">
              Join our global network of explorers. Get early access to future drops and exclusive archive releases.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="ENTER EMAIL"
                className="w-full bg-transparent border-b border-white/20 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-accent transition-colors placeholder:text-white/20"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-accent hover:translate-x-2 transition-transform">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="py-10 sm:py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-12 mb-10 sm:mb-16">
            <div className="text-2xl sm:text-4xl font-display tracking-tighter">
              VOID<span className="text-accent">ARCHIVE</span>
            </div>
            <div className="grid grid-cols-3 gap-6 sm:gap-16 w-full md:w-auto">
              <div>
                <h4 className="text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-white/20 mb-4">Support</h4>
                <ul className="space-y-3 text-[8px] sm:text-xs font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-accent transition-colors">Shipping</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Returns</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Size Guide</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-white/20 mb-4">Company</h4>
                <ul className="space-y-3 text-[8px] sm:text-xs font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Sustainability</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-white/20 mb-4">Social</h4>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                  <Instagram size={16} className="hover:text-accent cursor-pointer transition-colors" />
                  <Twitter size={16} className="hover:text-accent cursor-pointer transition-colors" />
                  <Globe size={16} className="hover:text-accent cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[8px] font-mono text-white/20">© 2024 VOID ARCHIVE SYSTEM. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-5 sm:gap-8 text-[8px] font-mono text-white/20 uppercase tracking-widest">
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
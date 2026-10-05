export const en = {
  meta: {
    title: 'ANTREPRIZ NODWES | Construction Supplies',
    description:
      'ANTREPRIZ NODWES — construction supplies, store pickup and home delivery.',
  },
  nav: {
    home: 'Home',
    catalog: 'Catalog',
    cart: 'Cart',
    admin: 'Admin',
    alerts: 'Alerts',
  },
  auth: {
    login: 'Log in',
    signUp: 'Sign up',
    logout: 'Log out',
    loginTitle: 'Log in',
    signUpTitle: 'Create account',
    guestHint:
      'By default you browse as a guest. Log in or sign up to track your orders.',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm password',
    createAccount: 'Create account',
    continueAsGuest: 'Continue as guest →',
    errors: {
      invalid: 'Incorrect username or password.',
      exists: 'This username is already taken.',
      invalidUsername: 'Username must be at least 3 characters.',
      weakPassword: 'Password must be at least 4 characters.',
      passwordMismatch: 'Passwords do not match.',
    },
  },
  account: {
    title: 'My account',
    welcome: 'Hello, {{name}}.',
    myOrders: 'My orders',
    noOrders: 'You have not placed any orders with this account yet.',
    viewOrder: 'View details',
    shopCatalog: 'Browse catalog',
  },
  brand: {
    tagline: 'Construction Supplies',
    company: 'ANTREPRIZ NODWES',
    address: 'Saint-Louis du Nord, place du marché',
    region: 'Northwest Haiti',
  },
  footer: {
    pickupDelivery: 'Store pickup and home delivery across the northwest region.',
    mvpNote: 'MVP demo · React + Vite · Mock data (Phase 1)',
  },
  home: {
    heroText:
      'Quality cement, lumber, roofing, plumbing, and tools for builders. Browse the catalog, order online, and choose store pickup or home delivery.',
    searchPlaceholder: 'Search products (cement, block, pipe…)',
    search: 'Search',
    featuredTitle: 'Featured supplies',
    featuredSubtitle: 'Popular items ready for pickup or delivery.',
    viewCatalog: 'View full catalog →',
    pickupTitle: 'Store pickup',
    pickupText:
      'Place your order online and collect materials at the ANTREPRIZ NODWES yard when your order is ready.',
    deliveryTitle: 'Home delivery',
    deliveryText:
      'Add a delivery address at checkout. Our team confirms availability and schedules drop-off for your job site.',
    stockTitle: 'Real-time stock',
    stockText:
      'Checkout validates quantities against current inventory so you know what is available before you commit.',
  },
  catalog: {
    title: 'Product catalog',
    subtitle:
      'Construction materials from ANTREPRIZ NODWES — prices and stock shown for each item.',
    all: 'All',
    resultsFor: 'Results for',
    emptyTitle: 'No products found',
    emptyDescription: 'Try another category or search term.',
    clearFilters: 'Clear filters',
  },
  product: {
    back: '← Back to catalog',
    quantity: 'Quantity',
    addToCart: 'Add to cart',
    viewCart: 'View cart',
    add: 'Add',
    notFoundTitle: 'Product not found',
    notFoundDescription: 'This item may have been archived or the link is incorrect.',
    browseCatalog: 'Browse catalog',
  },
  stock: {
    inStock: 'In stock',
    outOfStock: 'Out of stock',
    lowStock: 'Low stock ({{count}})',
  },
  cart: {
    title: 'Shopping cart',
    emptyTitle: 'Your cart is empty',
    emptyDescription: 'Add construction supplies from the catalog to start an order.',
    each: 'each',
    remove: 'Remove',
    summary: 'Order summary',
    subtotal: 'Subtotal',
    estimatedTotal: 'Estimated total',
    deliveryNote: 'Delivery fee applied at checkout if you choose home delivery.',
    checkout: 'Proceed to checkout',
  },
  checkout: {
    title: 'Checkout',
    subtitle:
      'Complete your order with ANTREPRIZ NODWES — pickup at our store or delivery to your site.',
    fulfillment: 'Fulfillment',
    pickup: 'Store pickup',
    pickupHint: 'Collect at the ANTREPRIZ NODWES location when ready.',
    delivery: 'Home delivery',
    deliveryHint: 'Delivery fee {{fee}} added to your order.',
    contact: 'Contact',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone',
    address: 'Delivery address',
    placeOrder: 'Place order',
    placing: 'Placing order…',
    emptyCart: 'Your cart is empty.',
    browseProducts: 'Browse products',
    summary: 'Order summary',
    deliveryLine: 'Delivery',
    total: 'Total',
    errors: {
      emptyCart: 'Your cart is empty.',
      deliveryAddress: 'Delivery address is required.',
      productUnavailable: 'A product in your cart is no longer available.',
      insufficientStock:
        'Not enough stock for {{name}}. Only {{count}} available.',
    },
  },
  order: {
    confirmed: 'Order confirmed',
    reference: 'Reference {{ref}}',
    thankYou:
      'Thank you, {{name}}. ANTREPRIZ NODWES will prepare your {{mode}} order.',
    modePickup: 'pickup',
    modeDelivery: 'delivery',
    status: 'Status',
    fulfillment: 'Fulfillment',
    deliveryAddress: 'Delivery address',
    total: 'Total',
    notFound: 'Order not found.',
    returnHome: 'Return home',
    continueShopping: 'Continue shopping',
    home: 'Home',
  },
  notifications: {
    label: 'Notifications',
    newProducts: 'New products',
    empty: 'No notifications yet.',
    newProduct: 'New: {{name}} in stock',
  },
  admin: {
    signIn: 'Admin sign in',
    demoCreds: 'Demo credentials:',
    invalidLogin: 'Invalid email or password.',
    signInButton: 'Sign in',
    signOut: 'Sign out',
    dashboard: 'Admin dashboard',
    dashboardSubtitle: 'ANTREPRIZ NODWES — products, inventory, orders',
    activeProducts: 'Active products',
    lowStock: 'Low stock',
    recentOrders: 'Recent orders',
    addProduct: 'Add product',
    editProduct: 'Edit product',
    sku: 'SKU',
    name: 'Name',
    description: 'Description',
    price: 'Price',
    imageUrl: 'Image URL',
    stockOnHand: 'Stock on hand',
    lowStockThreshold: 'Low stock threshold',
    publish: 'Publish product',
    save: 'Save changes',
    cancel: 'Cancel',
    inventory: 'Inventory',
    edit: 'Edit',
    archive: 'Archive',
    orders: 'Orders',
    noOrders: 'No customer orders yet in this session.',
    reference: 'Reference',
    customer: 'Customer',
    total: 'Total',
    fulfillment: 'Fulfillment',
    status: 'Status',
  },
  orderStatus: {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY_FOR_PICKUP: 'Ready for pickup',
    OUT_FOR_DELIVERY: 'Out for delivery',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  },
  fulfillment: {
    pickup: 'pickup',
    delivery: 'delivery',
  },
  categories: {
    'cat-cement': 'Cement & Concrete',
    'cat-lumber': 'Lumber & Framing',
    'cat-roofing': 'Roofing',
    'cat-plumbing': 'Plumbing',
    'cat-tools': 'Tools & Hardware',
    'cat-appliances': 'Household appliances',
  },
  products: {
    'prod-1': {
      name: 'Portland Cement 50 kg',
      description:
        'General-purpose Type I cement for foundations, blocks, and structural pours. Store dry and use within manufacturer guidelines.',
    },
    'prod-2': {
      name: 'Concrete Block 6"',
      description:
        'Standard hollow concrete block for walls and partitions. Consistent dimensions for faster masonry work.',
    },
    'prod-3': {
      name: 'Pressure-Treated 2×4×8 ft',
      description:
        'Ground-contact rated lumber for framing, formwork, and exterior builds in humid climates.',
    },
    'prod-4': {
      name: 'Corrugated Metal Roofing Sheet',
      description:
        'Galvanized corrugated sheet, 8 ft length. Pair with matching fasteners and ridge caps.',
    },
    'prod-5': {
      name: 'PVC Pipe 1" × 10 ft',
      description:
        'Schedule 40 PVC for cold-water lines and drainage. Compatible with standard solvent cement fittings.',
    },
    'prod-6': {
      name: '16 oz Claw Hammer',
      description:
        'Fiberglass handle claw hammer for everyday site work. Balanced head for framing and finish tasks.',
    },
    'prod-7': {
      name: '20 L Microwave Oven',
      description:
        '700 W microwave with turntable, timer, and defrost programs for everyday kitchen use.',
    },
    'prod-8': {
      name: '3000 W Pure Sine Wave Inverter',
      description:
        '12 V to 220 V inverter for home, shop, or solar setups. Overload and thermal protection.',
    },
    'prod-9': {
      name: '12 V 200 Ah Gel Battery',
      description:
        'Sealed gel battery with low maintenance—suited for inverters, solar, and backup power.',
    },
    'prod-10': {
      name: 'Trojan T-1275 12 V Battery',
      description:
        'Trojan T-1275 deep-cycle battery for solar arrays and generator backup systems.',
    },
    'prod-11': {
      name: 'LTH L-100 12 V Battery',
      description:
        'LTH 100 Ah low-maintenance battery for vehicles, inverters, and backup installations.',
    },
    'prod-12': {
      name: '60 cm Built-In Electric Oven',
      description:
        'Multi-function electric oven with convection, timer, and double-glazed door.',
    },
  },
}

export interface ServiceCategory {
  id: string;
  name: string;
  image: string;
  description: string;
  icon: string;
  count: number;
  popularServices: string[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
  verified: boolean;
}

export interface Professional {
  id: string;
  name: string;
  verified: boolean;
  profession: string;
  specialization: string;
  category: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  distance: string;
  hourlyRate: number;
  experienceYears: number;
  completedJobs: number;
  availability: 'Available Today' | 'Next Day' | 'This Week';
  phone: string;
  location: string;
  about: string;
  skills: string[];
  portfolio: {
    id: string;
    title: string;
    image: string;
    category: string;
  }[];
  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
  }[];
  reviews: Review[];
}

export interface ServiceRequest {
  id: string;
  serviceCategory: string;
  serviceName: string;
  problemDescription: string;
  photos: string[];
  location: string;
  date: string;
  time: string;
  isFlexible: boolean;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  professionalProfession: string;
  status: 'Sent' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  statusIndex: number; // 0: Sent, 1: Accepted, 2: In Progress, 3: Completed
  createdAt: string;
  estimatedCost: number;
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  attachment?: string;
}

export interface ChatThread {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  professionalProfession: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: MessageItem[];
}

export const POPULAR_SERVICES: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    description: 'Find a skilled professional for your plumbing needs. Pipe repair, leak diagnostics, drain unclogging, water heaters, and fixture installation.',
    icon: 'water-outline',
    count: 42,
    popularServices: ['Pipe Leak Repair', 'Drain Clearance', 'Faucet Replacement', 'Water Heater Setup'],
  },
  {
    id: 'electrical',
    name: 'Electrical',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    description: 'Certified master electricians for wiring, panel upgrades, lighting installations, EV chargers, and safety diagnostics.',
    icon: 'flash-outline',
    count: 38,
    popularServices: ['Circuit Breaker Diagnostics', 'Lighting Installation', 'Panel Upgrade', 'EV Charger Setup'],
  },
  {
    id: 'painting',
    name: 'Painting',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    description: 'High-quality interior and exterior painting, wall smoothing, wallpaper installation, and protective waterproofing coatings.',
    icon: 'color-palette-outline',
    count: 31,
    popularServices: ['Interior Room Painting', 'Wall Preparation & Primer', 'Exterior Facade Coat', 'Cabinet Refinishing'],
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
    description: 'Custom woodworking, cabinetry, door fitting, framing, hardwood floor repair, and architectural joinery.',
    icon: 'hammer-outline',
    count: 29,
    popularServices: ['Custom Shelving & Units', 'Door Planing & Lock Fit', 'Hardwood Floor Repair', 'Deck Restoration'],
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    description: 'Thorough deep residential cleaning, carpet upholstery shampooing, window washing, and post-renovation cleanups.',
    icon: 'sparkles-outline',
    count: 50,
    popularServices: ['Full Home Deep Cleaning', 'Carpet Steam Wash', 'Move-in/Move-out Clean', 'Kitchen Degrease'],
  },
  {
    id: 'masonry',
    name: 'Masonry',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    description: 'Expert brickwork, stone paving, structural mortar repointing, retaining walls, and concrete foundation repairs.',
    icon: 'cube-outline',
    count: 18,
    popularServices: ['Brick & Stone Repointing', 'Patio Paving & Slabs', 'Retaining Wall Repair', 'Concrete Patching'],
  },
  {
    id: 'construction',
    name: 'Construction',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    description: 'Home renovation, structural partition walls, drywalling, tiling, insulation, and full building upgrades.',
    icon: 'construct-outline',
    count: 26,
    popularServices: ['Drywall & Partition Setup', 'Ceramic & Stone Tiling', 'Insulation Installation', 'Home Remodeling'],
  },
  {
    id: 'mechanics',
    name: 'Mechanics',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
    description: 'Small engine diagnostics, home generator repair, lawn equipment tuning, and mechanical fixture maintenance.',
    icon: 'cog-outline',
    count: 15,
    popularServices: ['Generator Tune-up & Repair', 'Pressure Washer Maintenance', 'Mechanical Diagnostic', 'Equipment Assembly'],
  },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 'pro-1',
    name: 'Jean Dupont',
    verified: true,
    profession: 'Plumbing Specialist',
    specialization: 'Pipe Repairs, Leaks & Water Heaters',
    category: 'plumbing',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 32,
    distance: '1.2 km away',
    hourlyRate: 50,
    experienceYears: 10,
    completedJobs: 184,
    availability: 'Available Today',
    phone: '+1 (555) 234-8901',
    location: 'Central District (1.2 km)',
    about: 'Certified Master Plumber with over 10 years of experience in residential and commercial plumbing. Known for fast emergency diagnostic response, clean pipe work, and transparent estimates.',
    skills: ['Leak Detection', 'Pipe Repair', 'Water Heaters', 'Drain Clearing', 'Fixture Installation'],
    portfolio: [
      {
        id: 'p1',
        title: 'Copper Water Line Replacement',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
        category: 'Piping',
      },
      {
        id: 'p2',
        title: 'Modern Bathroom Mixer Valve',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        category: 'Fixtures',
      },
    ],
    services: [
      {
        id: 's1',
        name: 'Pipe Leak Diagnostic & Repair',
        description: 'Complete inspection and immediate pipe section replacement.',
        price: 65,
        duration: '1-2 hours',
      },
      {
        id: 's2',
        name: 'Drain Unclogging & Camera Inspection',
        description: 'Motorized auger snake clearance with pipe review.',
        price: 80,
        duration: '1 hour',
      },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Claire Tremblay',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        date: '3 days ago',
        service: 'Pipe Leak Diagnostic & Repair',
        verified: true,
        comment: 'Jean arrived promptly and solved the leak under my kitchen sink in less than an hour. Very clean and polite!',
      },
      {
        id: 'r2',
        author: 'Marc Lefevre',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 4.8,
        date: '2 weeks ago',
        service: 'Water Heater Diagnostic',
        verified: true,
        comment: 'Professional diagnostic and honest pricing. Highly recommend Jean for any plumbing job.',
      },
    ],
  },
  {
    id: 'pro-2',
    name: 'Elena Rostova',
    verified: true,
    profession: 'Master Electrician',
    specialization: 'Circuit Panels, Wiring & Smart Lighting',
    category: 'electrical',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 48,
    distance: '2.4 km away',
    hourlyRate: 60,
    experienceYears: 12,
    completedJobs: 240,
    availability: 'Available Today',
    phone: '+1 (555) 345-6789',
    location: 'North Suburbs (2.4 km)',
    about: 'Fully licensed Master Electrician specializing in panel upgrades, short-circuit diagnostics, EV chargers, and safe residential rewiring.',
    skills: ['Circuit Breakers', 'Panel Upgrades', 'Safety Audits', 'Lighting Design', 'EV Chargers'],
    portfolio: [
      {
        id: 'p3',
        title: '200A Breaker Panel Overhaul',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
        category: 'Electrical Panels',
      },
    ],
    services: [
      {
        id: 's3',
        name: 'Electrical Safety Inspection & Diagnostic',
        description: 'Complete voltage and circuit test for breakers.',
        price: 75,
        duration: '1 hour',
      },
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Robert Taylor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        date: '5 days ago',
        service: 'Panel Upgrade',
        verified: true,
        comment: 'Elena is exceptional. Replaced our old breaker panel safely and neatly labeled every single circuit.',
      },
    ],
  },
  {
    id: 'pro-3',
    name: 'Antoine Moreau',
    verified: true,
    profession: 'Artisan Carpenter',
    specialization: 'Custom Woodwork, Cabinetry & Joinery',
    category: 'carpentry',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 26,
    distance: '3.1 km away',
    hourlyRate: 55,
    experienceYears: 14,
    completedJobs: 140,
    availability: 'Next Day',
    phone: '+1 (555) 456-7890',
    location: 'Westside Artisan District (3.1 km)',
    about: 'Passionate wood craftsman creating custom built-ins, hardwood shelving, door installations, and architectural trim.',
    skills: ['Custom Cabinetry', 'Door Fitting', 'Crown Molding', 'Wood Restorations'],
    portfolio: [
      {
        id: 'p4',
        title: 'Custom Oak Library Shelving',
        image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
        category: 'Cabinetry',
      },
    ],
    services: [
      {
        id: 's4',
        name: 'Door Alignment & Lock Mortising',
        description: 'Hardwood door fitting and precision hinge adjustment.',
        price: 60,
        duration: '1 hour',
      },
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Sophie Martin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        date: '1 week ago',
        service: 'Custom Shelving',
        verified: true,
        comment: 'Antoine built beautiful custom shelving for our living room. Top-notch craftsmanship!',
      },
    ],
  },
  {
    id: 'pro-4',
    name: 'Karim Benali',
    verified: true,
    profession: 'Master Painter',
    specialization: 'Interior & Exterior Precision Painting',
    category: 'painting',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 39,
    distance: '0.9 km away',
    hourlyRate: 45,
    experienceYears: 8,
    completedJobs: 210,
    availability: 'Available Today',
    phone: '+1 (555) 567-8901',
    location: 'Metro Center (0.9 km)',
    about: 'Specialist in interior finishing, clean edging, skim coating, wallpaper application, and exterior wall painting.',
    skills: ['Wall Preparation', 'Interior Spraying', 'Wallpapering', 'Color Consultation'],
    portfolio: [
      {
        id: 'p5',
        title: 'Modern Minimalist Living Room Finish',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
        category: 'Interior',
      },
    ],
    services: [
      {
        id: 's5',
        name: 'Single Room Wall Painting',
        description: 'Complete prep, priming, and 2 finish coats.',
        price: 180,
        duration: '1 day',
      },
    ],
    reviews: [
      {
        id: 'r5',
        author: 'David Chen',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        date: '4 days ago',
        service: 'Room Painting',
        verified: true,
        comment: 'Karim left the place spotless and the walls look like brand new. Great attention to detail.',
      },
    ],
  },
  {
    id: 'pro-5',
    name: 'David Miller',
    verified: true,
    profession: 'Masonry & Stone Craftsman',
    specialization: 'Brickwork, Repointing & Stone Paving',
    category: 'masonry',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 22,
    distance: '3.8 km away',
    hourlyRate: 55,
    experienceYears: 16,
    completedJobs: 175,
    availability: 'Next Day',
    phone: '+1 (555) 678-9012',
    location: 'South District (3.8 km)',
    about: 'Experienced mason specializing in stone paving, retaining walls, brick restoration, and structural concrete repair.',
    skills: ['Brick Repointing', 'Stone Patios', 'Retaining Walls', 'Concrete Repair'],
    portfolio: [
      {
        id: 'p6',
        title: 'Natural Stone Patio Paving',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
        category: 'Masonry',
      },
    ],
    services: [
      {
        id: 's6',
        name: 'Brick Wall Repointing & Repair',
        description: 'Mortar extraction and weather-resistant lime repointing.',
        price: 95,
        duration: '3 hours',
      },
    ],
    reviews: [
      {
        id: 'r6',
        author: 'Julien Blanc',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        date: '2 weeks ago',
        service: 'Stone Paving',
        verified: true,
        comment: 'David transformed our garden pathway with gorgeous stone paving. Very sturdy work.',
      },
    ],
  },
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'REQ-4821',
    serviceCategory: 'Plumbing',
    serviceName: 'Kitchen Pipe Leak Repair',
    problemDescription: 'Slow water drip from the main copper pipe beneath the kitchen sink. Requires diagnostic and fitting replacement.',
    photos: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80',
    ],
    location: '142 Elm Street, Apt 4B, Downtown',
    date: 'Today, 26 Aug',
    time: '14:30 - 16:30',
    isFlexible: false,
    professionalId: 'pro-1',
    professionalName: 'Jean Dupont',
    professionalAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    professionalProfession: 'Plumbing Specialist',
    status: 'In Progress',
    statusIndex: 2, // 0: Sent, 1: Accepted, 2: In Progress, 3: Completed
    createdAt: '26 Aug 2026, 11:15 AM',
    estimatedCost: 65,
  },
  {
    id: 'REQ-4809',
    serviceCategory: 'Electrical',
    serviceName: 'Circuit Breaker Inspection',
    problemDescription: 'Living room circuits trip when air conditioner and television run simultaneously.',
    photos: [],
    location: '142 Elm Street, Apt 4B, Downtown',
    date: 'Tomorrow, 27 Aug',
    time: '10:00 - 12:00',
    isFlexible: true,
    professionalId: 'pro-2',
    professionalName: 'Elena Rostova',
    professionalAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    professionalProfession: 'Master Electrician',
    status: 'Accepted',
    statusIndex: 1, // Accepted
    createdAt: '25 Aug 2026, 04:30 PM',
    estimatedCost: 75,
  },
  {
    id: 'REQ-4760',
    serviceCategory: 'Painting',
    serviceName: 'Accent Wall Painting',
    problemDescription: 'Deep navy accent wall painting in master bedroom with clean border trim.',
    photos: [],
    location: '142 Elm Street, Apt 4B, Downtown',
    date: '18 Aug 2026',
    time: '09:00 - 13:00',
    isFlexible: false,
    professionalId: 'pro-4',
    professionalName: 'Karim Benali',
    professionalAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    professionalProfession: 'Master Painter',
    status: 'Completed',
    statusIndex: 3, // Completed
    createdAt: '16 Aug 2026',
    estimatedCost: 180,
  },
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat-1',
    professionalId: 'pro-1',
    professionalName: 'Jean Dupont',
    professionalAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    professionalProfession: 'Plumbing Specialist',
    lastMessage: "I'm on my way! Should be at your building in about 12 minutes.",
    lastMessageTime: '14:18',
    unreadCount: 1,
    online: true,
    messages: [
      {
        id: 'm1',
        senderId: 'user',
        senderName: 'You',
        text: 'Hello Jean, I submitted a request for the copper pipe leak under the kitchen sink.',
        timestamp: '14:05',
        isMe: true,
      },
      {
        id: 'm2',
        senderId: 'pro-1',
        senderName: 'Jean Dupont',
        text: 'Hello! I received your photos and have the standard compression fittings ready in my vehicle.',
        timestamp: '14:09',
        isMe: false,
      },
      {
        id: 'm3',
        senderId: 'pro-1',
        senderName: 'Jean Dupont',
        text: "I'm on my way! Should be at your building in about 12 minutes.",
        timestamp: '14:18',
        isMe: false,
      },
    ],
  },
  {
    id: 'chat-2',
    professionalId: 'pro-2',
    professionalName: 'Elena Rostova',
    professionalAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    professionalProfession: 'Master Electrician',
    lastMessage: 'Confirmed for tomorrow at 10:00 AM. Please ensure the main panel is accessible.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: 'm4',
        senderId: 'user',
        senderName: 'You',
        text: 'Hello Elena, would you be able to check our circuit breakers tomorrow morning?',
        timestamp: 'Yesterday',
        isMe: true,
      },
      {
        id: 'm5',
        senderId: 'pro-2',
        senderName: 'Elena Rostova',
        text: 'Confirmed for tomorrow at 10:00 AM. Please ensure the main panel is accessible.',
        timestamp: 'Yesterday',
        isMe: false,
      },
    ],
  },
];

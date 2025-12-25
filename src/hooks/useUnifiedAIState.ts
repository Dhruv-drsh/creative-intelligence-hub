import { create } from 'zustand';

// Unified AI state that all AI tools share
export interface BrandState {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  ctaColor: string;
  headingFont: string;
  bodyFont: string;
  captionFont: string;
  brandTone: string;
  guidelines: string;
}

export interface TypographyScale {
  headline: number;
  subheadline: number;
  body: number;
  caption: number;
}

export interface TodoItem {
  id: string;
  label: string;
  status: 'done' | 'pending' | 'missing';
  category: 'colors' | 'typography' | 'layout' | 'content' | 'compliance';
}

export interface UnifiedAIState {
  // Brand state shared across all AI tools
  brand: BrandState;
  
  // Typography scale with minimum sizes
  typographyScale: TypographyScale;
  
  // To-do checklist for brand compliance
  todos: TodoItem[];
  
  // Safe zone margins for different platforms
  safeZones: {
    instagram: { top: number; bottom: number; left: number; right: number };
    facebook: { top: number; bottom: number; left: number; right: number };
    story: { top: number; bottom: number; left: number; right: number };
  };
  
  // Canvas positioning constraints
  canvasConstraints: {
    minFontSize: number;
    centerAlign: boolean;
    respectSafeZones: boolean;
    autoCorrectOverflow: boolean;
  };
  
  // Actions
  setBrand: (brand: Partial<BrandState>) => void;
  setTypographyScale: (scale: Partial<TypographyScale>) => void;
  updateTodo: (id: string, status: TodoItem['status']) => void;
  addTodo: (todo: Omit<TodoItem, 'id'>) => void;
  removeTodo: (id: string) => void;
  resetTodos: () => void;
  setCanvasConstraints: (constraints: Partial<UnifiedAIState['canvasConstraints']>) => void;
}

// Default brand state
const defaultBrand: BrandState = {
  primaryColor: '#22C55E',
  secondaryColor: '#38BDF8',
  accentColor: '#F59E0B',
  ctaColor: '#DC2626',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  captionFont: 'Inter',
  brandTone: 'Professional',
  guidelines: '',
};

// Typography scale with minimum 24px for AI-generated text
const defaultTypographyScale: TypographyScale = {
  headline: 64,
  subheadline: 32,
  body: 24,
  caption: 18,
};

// Default to-do items
const defaultTodos: TodoItem[] = [
  { id: '1', label: 'Brand colors applied', status: 'pending', category: 'colors' },
  { id: '2', label: 'Typography harmony set', status: 'pending', category: 'typography' },
  { id: '3', label: 'CTA text added', status: 'missing', category: 'content' },
  { id: '4', label: 'Visual hierarchy check', status: 'pending', category: 'layout' },
  { id: '5', label: 'Safe zones respected', status: 'pending', category: 'compliance' },
];

// Safe zone configurations for different platforms
const safeZones = {
  instagram: { top: 40, bottom: 40, left: 40, right: 40 },
  facebook: { top: 30, bottom: 30, left: 30, right: 30 },
  story: { top: 120, bottom: 180, left: 40, right: 40 }, // Extra space for UI overlays
};

export const useUnifiedAIState = create<UnifiedAIState>((set) => ({
  brand: defaultBrand,
  typographyScale: defaultTypographyScale,
  todos: defaultTodos,
  safeZones,
  canvasConstraints: {
    minFontSize: 24,
    centerAlign: true,
    respectSafeZones: true,
    autoCorrectOverflow: true,
  },
  
  setBrand: (brand) => set((state) => ({
    brand: { ...state.brand, ...brand },
    todos: state.todos.map(todo => 
      todo.category === 'colors' && brand.primaryColor
        ? { ...todo, status: 'done' as const }
        : todo
    ),
  })),
  
  setTypographyScale: (scale) => set((state) => ({
    typographyScale: { ...state.typographyScale, ...scale },
    todos: state.todos.map(todo => 
      todo.category === 'typography'
        ? { ...todo, status: 'done' as const }
        : todo
    ),
  })),
  
  updateTodo: (id, status) => set((state) => ({
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, status } : todo
    ),
  })),
  
  addTodo: (todo) => set((state) => ({
    todos: [...state.todos, { ...todo, id: Date.now().toString() }],
  })),
  
  removeTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id),
  })),
  
  resetTodos: () => set({ todos: defaultTodos }),
  
  setCanvasConstraints: (constraints) => set((state) => ({
    canvasConstraints: { ...state.canvasConstraints, ...constraints },
  })),
}));

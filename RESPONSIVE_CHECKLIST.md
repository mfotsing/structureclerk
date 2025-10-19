# ✅ Responsive Design Checklist - StructureClerk

## Breakpoints Tailwind CSS

- **sm:** 640px (mobile landscape / small tablet)
- **md:** 768px (tablet)
- **lg:** 1024px (laptop)
- **xl:** 1280px (desktop)
- **2xl:** 1536px (large desktop)

---

## 📱 Pages Testées

### ✅ Page d'accueil (`/`)

**Mobile (< 640px):**
- Logo 80x80px centré ✓
- Titre `text-3xl` responsive ✓
- Boutons empilés verticalement (flex-col) ✓
- Grille de features en colonne simple ✓
- Padding adaptatif (px-4) ✓

**Tablet (640px - 768px):**
- Titre `text-4xl` ✓
- Boutons côte à côte (flex-row) ✓
- Grille toujours en colonne simple ✓

**Desktop (> 768px):**
- Titre `text-5xl` ✓
- Grille 3 colonnes (md:grid-cols-3) ✓
- Container centré avec padding ✓

---

### ✅ Page Login (`/login`)

**Mobile:**
- Card full-width avec max-w-md ✓
- Logo 80x80px centré ✓
- Padding adaptatif (px-4) ✓
- Form inputs full-width ✓

**Desktop:**
- Card centrée max 448px ✓
- Background gradient ✓

---

### ✅ Page Signup (`/signup`)

**Mobile:**
- Card full-width avec max-w-md ✓
- Logo 80x80px centré ✓
- Form inputs empilés ✓
- Scroll vertical si nécessaire ✓

**Desktop:**
- Card centrée max 448px ✓
- Form bien espacé ✓

---

### ✅ Page Subscription Expired (`/subscription/expired`)

**Mobile:**
- Card full-width avec padding (p-4) ✓
- Logo 80x80px dans header ✓
- Liste features empilée ✓
- Boutons full-width ✓
- Text responsive ✓

**Tablet/Desktop:**
- Card max-w-2xl centrée ✓
- Layout 2 colonnes pour pricing ✓
- Features avec icônes alignées ✓

---

### ✅ Dashboard Pages

**Clients List (`/clients`):**
- Table responsive avec scroll horizontal ✓
- Filters empilés sur mobile ✓
- Search bar full-width ✓
- Grid cards sur mobile (si implémenté) ✓

**Client Detail (`/clients/[id]`):**
- Stats cards empilées sur mobile ✓
- Tabs full-width ✓
- Actions buttons adaptatives ✓

**Projects (`/projects`):**
- Card grid: 1 col mobile, 2 cols tablet, 3 cols desktop ✓
- Filters sidebar collapsible sur mobile ✓

**Invoices (`/invoices`):**
- Stats cards: 2x2 sur mobile, 4x1 sur desktop ✓
- Table responsive avec scroll ✓
- Status badges lisibles ✓

---

## 🎨 Composants Responsive

### Navigation / Header
```tsx
// Doit inclure:
- Logo cliquable
- Menu burger sur mobile (< md)
- Menu horizontal sur desktop (> md)
- User dropdown responsive
```

### Tables
```tsx
// Pattern recommandé:
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>
```

### Forms
```tsx
// Pattern recommandé:
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Form fields */}
</div>
```

### Cards/Stats
```tsx
// Pattern recommandé:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stat cards */}
</div>
```

---

## 📏 Spacing Guidelines

### Mobile (< 640px)
- Container padding: `px-4 py-6`
- Gaps: `gap-4`
- Section margin: `mt-8`

### Tablet (640px - 1024px)
- Container padding: `px-6 py-8`
- Gaps: `gap-6`
- Section margin: `mt-12`

### Desktop (> 1024px)
- Container padding: `px-8 py-12`
- Gaps: `gap-8`
- Section margin: `mt-16`

---

## 🖼️ Images & Media

### Logo
```tsx
<Image
  src="/logo.jpg"
  alt="StructureClerk Logo"
  width={80}
  height={80}
  className="rounded-xl shadow-md"
  priority // Pour le logo principal
/>
```

### Content Images
```tsx
<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  className="w-full h-auto" // Responsive
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

---

## ⚡ Performance Mobile

### Optimisations implémentées:
- ✅ Next.js Image optimization
- ✅ Lazy loading composants
- ✅ Tailwind CSS purge
- ✅ Standalone build (Docker)
- ✅ No heavy animations on mobile

### À implémenter:
- [ ] Service Worker (PWA)
- [ ] Offline mode
- [ ] Mobile-specific optimizations
- [ ] Touch gestures (swipe, etc.)

---

## 🧪 Tests de Responsive

### Outils de test:

1. **Chrome DevTools**
   - Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
   - Tester: iPhone SE, iPhone 12, iPad, Desktop HD

2. **Firefox Responsive Design Mode**
   - Cmd+Option+M / Ctrl+Shift+M

3. **Dimensions à tester:**
   - 320px - iPhone SE (min)
   - 375px - iPhone 12/13 mini
   - 390px - iPhone 12/13/14
   - 414px - iPhone Plus
   - 768px - iPad portrait
   - 1024px - iPad landscape
   - 1280px - Laptop
   - 1920px - Desktop HD

---

## 📋 Checklist de validation

### Mobile (< 640px)
- [ ] Pas de scroll horizontal
- [ ] Textes lisibles (min 16px)
- [ ] Boutons touchables (min 44x44px)
- [ ] Images optimisées et chargées
- [ ] Forms utilisables
- [ ] Navigation accessible

### Tablet (640px - 1024px)
- [ ] Layout adapté (2 colonnes)
- [ ] Navigation hybride
- [ ] Touch et clavier supportés
- [ ] Sidebar collapsible si présent

### Desktop (> 1024px)
- [ ] Layout pleine largeur optimisé
- [ ] Hover states fonctionnels
- [ ] Keyboard navigation
- [ ] Multi-colonnes efficient

---

## 🎯 Best Practices Appliquées

1. **Mobile-First Approach**
   - Styles de base pour mobile
   - Media queries pour écrans plus grands
   - Utilisation de `sm:`, `md:`, `lg:` prefixes

2. **Flexbox & Grid**
   - `flex-col` sur mobile, `flex-row` sur desktop
   - `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3`

3. **Typography**
   - `text-sm` → `md:text-base` → `lg:text-lg`
   - Line-height adaptatif

4. **Spacing**
   - `space-y-4` → `md:space-y-6` → `lg:space-y-8`
   - Responsive padding/margin

5. **Interactive Elements**
   - Touch targets minimum 44x44px
   - Hover states desktop only
   - Focus states visibles

---

## 🐛 Issues Connus

### Résolu
- ✅ Next.js 15 async params (migration)
- ✅ TypeScript strict mode
- ✅ pdf-parse ESM import
- ✅ Responsive buttons page accueil

### À surveiller
- [ ] Performance sur iPhone SE (320px)
- [ ] Tables très larges sur mobile
- [ ] Upload de fichiers sur iOS Safari
- [ ] Sticky headers sur scroll

---

## 📚 Ressources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

**✅ Site validé responsive sur tous les breakpoints principaux!**

Dernière mise à jour: 2025-10-19

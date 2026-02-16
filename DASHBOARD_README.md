# AuroraFlow Ecommerce Dashboard

## Production-Grade Store Operations Dashboard

A fully responsive, feature-rich ecommerce admin dashboard built with vanilla HTML, CSS, and JavaScript.

### Features

#### Core Components
- **Responsive Sidebar Navigation** - Collapsible sidebar with icon-based navigation
- **Top Header Bar** - Store manager profile, notifications, theme switcher
- **Real-time Statistics** - 4 animated KPI cards with trend indicators
- **GMV Chart** - Canvas-based line chart with gradient fills
- **Store Health Visualization** - Animated progress bars with color coding
- **Data Table** - Responsive order activity table with status badges

#### Interactive Elements
- **Animated Counters** - Numbers count up on scroll into view
- **Canvas Charts** - High-performance GMV trend visualization
- **Health Bars** - Animated progress indicators
- **Mobile Menu** - Touch-friendly hamburger navigation
- **Theme Switcher** - Light/dark mode toggle with localStorage persistence

#### Design Features
- **Glassmorphism** - Modern translucent card designs
- **Gradient Accents** - Smooth color transitions throughout
- **Micro-interactions** - Hover effects, transitions, and animations
- **Consistent Spacing** - Design token-based spacing system
- **Typography Scale** - Fluid, responsive text sizing with clamp()

### File Structure

```
dashboard.html          - Main dashboard page
css/
  dashboard.css         - Dashboard-specific styles
  style.css            - Shared design system (updated with nav-highlight)
js/
  dashboard.js         - Dashboard interactions & chart rendering
  dashboard-shell.js   - Shared sidebar/header renderer + configurable quick-action FAB for dashboard pages
  main.js              - Shared utilities (theme switcher, etc.)
  theme-init.js        - Shared early theme initialization for all pages
```

### Key Technologies

- **Canvas API** - For rendering the GMV trend chart
- **IntersectionObserver** - For scroll-triggered animations
- **CSS Custom Properties** - For theme switching and design tokens
- **CSS Grid & Flexbox** - For responsive layouts
- **LocalStorage** - For theme preference persistence

### Responsive Breakpoints

- **Desktop**: 1024px+ (full sidebar, 4-column stats grid)
- **Tablet**: 768px-1023px (collapsible sidebar, 2-column layouts)
- **Mobile**: <768px (off-canvas sidebar, single-column layouts)

### Dashboard Statistics

The dashboard displays:
- **Active Stores**: 1,247 (+12.3% vs last month)
- **Monthly GMV**: $87K (+8.7% vs last month)
- **Orders Processed**: 342 (+24 this week)
- **Avg Fulfillment Time**: 2.4h (-18% improvement)

### Store Health Distribution

- Excellent: 42%
- Good: 31%
- At Risk: 18%
- Critical: 9%

### Order Activity Table

Displays recent order activity with:
- Order ID and customer
- Status badge (Paid, Processing, Refunded)
- Sales channel
- Order value (AOV)
- Fulfillment health score (0-100, color-coded)
- Last update timestamp
- Action menu (•••)

### Customization Guide

#### Modify Chart Data
Edit `js/dashboard.js`, line ~88:
```javascript
const data = [45, 52, 48, ...]; // GMV data points
```

#### Update KPI Values
Edit `dashboard.html` data-counter attributes:
```html
<div class="stat-value" data-counter="1247">0</div>
```

#### Change Health Bars
Edit `dashboard.html` inline styles:
```html
<span class="health-fill" style="--w: 42%; --color: #44df9e"></span>
```

#### Add Navigation Items
Edit sidebar in `dashboard.html`:
```html
<a href="#" class="nav-item">
  <svg>...</svg>
  <span>Your Section</span>
</a>
```

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires modern CSS features:
- CSS Custom Properties
- CSS Grid
- color-mix() function
- backdrop-filter

### Performance Notes

- Canvas chart uses device pixel ratio for sharp rendering
- IntersectionObserver prevents unnecessary animations
- Debounced resize handlers for smooth window resizing
- No external chart library dependencies (lightweight)

### Accessibility

- Semantic HTML structure
- Runtime ARIA labels for icon-only controls (`.icon-btn`, `.action-btn`, `.card-menu`)
- Keyboard navigation support (including Enter/Space activation on data table rows)
- Toggle state semantics (`aria-expanded`, `aria-controls`, and `aria-pressed`) for menus and theme switchers
- Color contrast ratios meet WCAG AA standards
- Reduced-motion media query support (inherited from main.css)

### Future Enhancements

Potential additions for production:
- Real-time data updates (WebSocket integration)
- Advanced filtering and sorting
- Export functionality (CSV, PDF)
- Custom date range selector
- Drill-down views for individual stores
- Inline editing capabilities
- Bulk action support
- Search functionality
- More chart types (pie, bar, area)

---

**Built with ❤️ using vanilla web technologies**

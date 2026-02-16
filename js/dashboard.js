// ================================
// Dashboard Initialization
// ================================

document.addEventListener('DOMContentLoaded', () => {
  initializeDashboardAccessibility();
  initializeMobileMenu();
  initializeDashboardCounters();
  initializeChart();
  initializeHealthBars();
  initializeDashboardAnimations();
  initializeQuickActions();
});

function initializeDashboardAccessibility() {
  const iconLikeButtons = document.querySelectorAll('.icon-btn, .action-btn, .card-menu, .header-action, .sidebar-toggle, .mobile-menu-toggle, .fab-button');

  iconLikeButtons.forEach((button) => {
    if (!button.getAttribute('type')) {
      button.setAttribute('type', 'button');
    }

    const hasAriaLabel = button.hasAttribute('aria-label');
    const title = button.getAttribute('title');

    if (!hasAriaLabel && title) {
      button.setAttribute('aria-label', title);
    }

    if (!button.hasAttribute('aria-label')) {
      if (button.classList.contains('action-btn')) {
        button.setAttribute('aria-label', 'Open row actions');
      } else if (button.classList.contains('card-menu')) {
        button.setAttribute('aria-label', 'Open integration options');
      } else if (button.classList.contains('icon-btn')) {
        const cardTitle = button.closest('article')?.querySelector('h3')?.textContent?.trim();
        button.setAttribute('aria-label', cardTitle ? `Open actions for ${cardTitle}` : 'Open actions');
      }
    }

    if (!button.getAttribute('title') && button.getAttribute('aria-label')) {
      button.setAttribute('title', button.getAttribute('aria-label'));
    }

    if (button.classList.contains('action-btn') || button.classList.contains('card-menu')) {
      button.setAttribute('aria-haspopup', 'menu');
    }
  });

  const iconSvgs = document.querySelectorAll('.icon-btn svg, .action-btn svg, .card-menu svg, .header-action svg, .sidebar-toggle svg, .mobile-menu-toggle svg, .fab-button svg');
  iconSvgs.forEach((svg) => {
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
  });

  const tableRows = document.querySelectorAll('.data-table tbody tr');
  tableRows.forEach((row) => {
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');

    row.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('button, a, input, select, textarea')) return;
      event.preventDefault();
      row.click();
    });
  });
}

// ================================
// Dashboard Entry Animations
// ================================

function initializeDashboardAnimations() {
  const animatedElements = document.querySelectorAll('.stat-card, .dashboard-card, .table-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ================================
// Quick Actions FAB
// ================================

function initializeQuickActions() {
  const fabButton = document.querySelector('.fab-button');
  
  if (fabButton) {
    fabButton.addEventListener('click', () => {
      // In production, this would open a modal or quick-add form
      console.log('Quick action triggered');
      
      // Add haptic feedback (vibration on mobile)
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Visual feedback
      fabButton.style.transform = 'scale(0.9) rotate(90deg)';
      setTimeout(() => {
        fabButton.style.transform = '';
      }, 150);
    });
  }
}

// ================================
// Mobile Menu Toggle
// ================================

function initializeMobileMenu() {
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarToggle = document.querySelector('[data-sidebar-toggle]');

  if (sidebar && !sidebar.id) {
    sidebar.id = 'dashboard-sidebar';
  }

  if (mobileToggle && sidebar) {
    mobileToggle.setAttribute('aria-controls', sidebar.id);
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.setAttribute('aria-controls', sidebar.id);
    sidebarToggle.setAttribute('aria-expanded', sidebar.classList.contains('collapsed') ? 'true' : 'false');
  }

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.toggle('collapsed');
      sidebarToggle.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target !== mobileToggle) {
        sidebar.classList.remove('open');
        if (mobileToggle) {
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  // Close sidebar when clicking a nav link on mobile
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('open');
        if (mobileToggle) {
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

// ================================
// Stat Counters Animation
// ================================

function initializeDashboardCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ================================
// Health Bars Animation
// ================================

function initializeHealthBars() {
  const healthBars = document.querySelectorAll('.health-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.getPropertyValue('--w');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  healthBars.forEach(bar => {
    bar.style.width = '0';
    observer.observe(bar);
  });
}

// ================================
// Revenue Chart (Canvas)
// ================================

function initializeChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  // Set canvas size with device pixel ratio for sharp rendering
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    drawChart();
  };

  // Sample data
  const data = [45, 52, 48, 58, 65, 72, 68, 75, 82, 88, 95, 103, 98, 105, 112, 118, 125, 132, 128, 135, 142, 138, 145, 152, 148, 155, 162, 168, 175, 180];
  const labels = data.map((_, i) => i + 1);

  const drawChart = () => {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    // Get theme colors
    const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-tertiary').trim();
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-tertiary').trim();
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim();
    const secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary').trim();

    // Helper function to convert hex to rgba
    const hexToRgba = (hex, alpha) => {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Draw grid lines
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Calculate min and max
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, hexToRgba(primaryColor, 0.3));
    gradient.addColorStop(1, hexToRgba(primaryColor, 0));

    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / range) * chartHeight;
      
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line with gradient
    const lineGradient = ctx.createLinearGradient(padding, 0, width - padding, 0);
    lineGradient.addColorStop(0, primaryColor);
    lineGradient.addColorStop(1, secondaryColor);

    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / range) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw data points
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / range) * chartHeight;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--bg-primary').trim();
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw Y-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i <= 5; i++) {
      const value = maxValue - (range / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText('$' + Math.round(value) + 'K', padding - 10, y);
    }

    // Draw X-axis labels (show every 5th day)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    data.forEach((value, index) => {
      if (index % 5 === 0 || index === data.length - 1) {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        ctx.fillText('Day ' + (index + 1), x, height - padding + 10);
      }
    });
  };

  // Initial draw
  resizeCanvas();

  // Redraw on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });

  // Animate chart on load
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateChartEntry();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(canvas);

  function animateChartEntry() {
    canvas.style.opacity = '0';
    canvas.style.transform = 'translateY(20px)';
    canvas.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      canvas.style.opacity = '1';
      canvas.style.transform = 'translateY(0)';
    }, 100);
  }
}

// ================================
// Period Select Handler
// ================================

const periodSelect = document.querySelector('.period-select');
if (periodSelect) {
  periodSelect.addEventListener('change', (e) => {
    // In production, this would fetch new data and redraw chart
    console.log('Period changed to:', e.target.value);
    // Optionally show a loading state and update the chart
  });
}

// ================================
// Action Button Handlers
// ================================

const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    // In production, show a context menu or modal
    console.log('Action clicked');
  });
});

// ================================
// Table Row Click Handler
// ================================

const tableRows = document.querySelectorAll('.data-table tbody tr');
tableRows.forEach(row => {
  row.addEventListener('click', () => {
    // In production, navigate to customer detail page
    console.log('Row clicked');
  });
});

// ================================
// Search Functionality
// ================================

const searchInput = document.querySelector('.header-search input');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    tableRows.forEach(row => {
      const customerCell = row.querySelector('.table-customer strong');
      const customerName = customerCell ? customerCell.textContent.toLowerCase() : '';
      
      if (customerName.includes(searchTerm) || searchTerm === '') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

// ================================
// Keyboard Shortcuts
// ================================

document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + K to focus search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
      searchInput.focus();
    }
  }
});

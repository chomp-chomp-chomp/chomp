/**
 * Chomp Chomp Dynamic Navigation System
 * Automatically generates navigation menus from navigation.json
 * No more updating 9+ pages every time you add a tool!
 */

(function() {
  'use strict';

  // Get current page for active highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  /**
   * Recursively build menu items (supports unlimited nesting)
   */
  function buildMenuItem(item) {
    if (item.type === 'link') {
      const isActive = currentPage === item.url.split('/').pop();
      return `<li><a href="${item.url}"${isActive ? ' class="active"' : ''}>${item.label}</a></li>`;
    } else if (item.type === 'dropdown') {
      // Recursively build submenu items
      const submenuHTML = item.items.map(subItem => buildMenuItem(subItem)).join('');

      return `
        <li class="menu-item-has-submenu">
          <a href="#">${item.label}</a>
          <ul class="submenu">
            ${submenuHTML}
          </ul>
        </li>
      `;
    }
    return '';
  }

  /**
   * Build the navigation menu from JSON data
   */
  async function buildNavigation() {
    try {
      // Fetch navigation data
      const response = await fetch('/navigation.json');
      if (!response.ok) {
        console.error('Failed to load navigation.json');
        return;
      }

      const navData = await response.json();
      const menuContainer = document.getElementById('toolsDropdown');

      if (!menuContainer) {
        console.error('Navigation container #toolsDropdown not found');
        return;
      }

      // Build menu HTML using recursive function
      const menuHTML = navData.mainMenu.map(item => buildMenuItem(item)).join('');

      // Insert into DOM
      menuContainer.innerHTML = menuHTML;

      // Add mobile submenu toggle functionality
      setupMobileSubmenus();

    } catch (error) {
      console.error('Error building navigation:', error);
    }
  }

  /**
   * Setup mobile submenu expand/collapse functionality
   */
  function setupMobileSubmenus() {
    // Only activate on mobile (viewport width <= 768px)
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) return;

    const menuContainer = document.getElementById('toolsDropdown');
    if (!menuContainer) return;

    // Find all items with submenus
    const menuItems = menuContainer.querySelectorAll('.menu-item-has-submenu');

    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (!link) return;

      // Remove any existing click handlers
      link.onclick = null;

      // Add click handler for mobile
      link.addEventListener('click', function(e) {
        // Check if this is a dropdown (has submenu)
        const hasSubmenu = this.parentElement.classList.contains('menu-item-has-submenu');

        if (hasSubmenu) {
          e.preventDefault();
          e.stopPropagation();

          // Toggle expanded class
          this.parentElement.classList.toggle('expanded');
        }
      });
    });
  }

  /**
   * Toggle dropdown menu (mobile and desktop)
   */
  window.toggleToolsDropdown = function() {
    const dropdown = document.getElementById('toolsDropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  };

  // Initialize navigation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNavigation);
  } else {
    buildNavigation();
  }

  // Re-setup mobile menus on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      setupMobileSubmenus();
    }, 250);
  });
})();

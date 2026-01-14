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

      // Setup submenu functionality for current viewport
      setupSubmenus();

    } catch (error) {
      console.error('Error building navigation:', error);
    }
  }

  /**
   * Setup submenu functionality for both mobile and desktop
   */
  function setupSubmenus() {
    const menuContainer = document.getElementById('toolsDropdown');
    if (!menuContainer) return;

    const isMobile = window.innerWidth <= 768;
    const menuItems = menuContainer.querySelectorAll('.menu-item-has-submenu');

    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (!link) return;

      // Remove all existing event listeners by cloning and replacing
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      if (isMobile) {
        // Mobile: click-to-expand accordion behavior
        newLink.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          const currentItem = this.parentElement;
          const isCurrentlyExpanded = currentItem.classList.contains('expanded');

          // Get all siblings at the same level (same parent)
          const parent = currentItem.parentElement;
          const siblings = Array.from(parent.children).filter(child => 
            child !== currentItem && child.classList.contains('menu-item-has-submenu')
          );

          // Collapse all sibling submenus at the same level
          siblings.forEach(sibling => {
            sibling.classList.remove('expanded');
          });

          // Toggle current submenu
          currentItem.classList.toggle('expanded');
        });
      } else {
        // Desktop: ensure links are clickable, hover handles submenu display via CSS
        newLink.style.pointerEvents = 'auto';
        newLink.style.cursor = 'pointer';
        
        // On desktop, clicking a submenu parent should not navigate
        newLink.addEventListener('click', function(e) {
          // Allow the hover to show submenu, but prevent navigation for dropdown parents
          e.preventDefault();
        });
      }
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

  /**
   * Setup click-outside-to-close handler for dropdown menu
   */
  function setupClickOutsideHandler() {
    document.addEventListener('click', function(e) {
      const dropdown = document.getElementById('toolsDropdown');
      const navContainer = document.querySelector('.nav-tools-dropdown');
      const toggleButtons = document.querySelectorAll('.menu-toggle, .tools-dropdown-btn');
      
      // Check if click is on a toggle button
      let isToggleButton = false;
      toggleButtons.forEach(btn => {
        if (btn.contains(e.target)) {
          isToggleButton = true;
        }
      });
      
      // If click is on toggle button, let the toggle function handle it
      if (isToggleButton) {
        return;
      }
      
      // If click is outside the navigation container and dropdown is active, close it
      if (dropdown && navContainer && dropdown.classList.contains('active')) {
        if (!navContainer.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      }
    });
  }

  // Initialize navigation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      buildNavigation();
      setupClickOutsideHandler();
    });
  } else {
    buildNavigation();
    setupClickOutsideHandler();
  }

  // Re-setup submenus on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      setupSubmenus();
    }, 250);
  });
})();

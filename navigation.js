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

    } catch (error) {
      console.error('Error building navigation:', error);
    }
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
})();

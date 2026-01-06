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

      // Build menu HTML
      const menuHTML = navData.mainMenu.map(item => {
        if (item.type === 'link') {
          const isActive = currentPage === item.url.split('/').pop();
          return `<li><a href="${item.url}"${isActive ? ' class="active"' : ''}>${item.label}</a></li>`;
        } else if (item.type === 'dropdown') {
          const submenuHTML = item.items.map(subItem => {
            const isActive = currentPage === subItem.url.split('/').pop();
            return `<li><a href="${subItem.url}"${isActive ? ' class="active"' : ''}>${subItem.label}</a></li>`;
          }).join('');

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
      }).join('');

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

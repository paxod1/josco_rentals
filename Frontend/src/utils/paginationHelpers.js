/**
 * Pagination Helper Utilities
 * Provides reusable functions for pagination management
 */

/**
 * Calculate the page to navigate to after deleting an item
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} totalItems - Total number of items before deletion
 * @param {number} itemsPerPage - Number of items per page
 * @param {number} itemsToDelete - Number of items being deleted (default: 1)
 * @returns {number} - The page number to navigate to after deletion
 */
export const getPageAfterDelete = (currentPage, totalItems, itemsPerPage, itemsToDelete = 1) => {
    // Calculate total items after deletion
    const itemsAfterDelete = totalItems - itemsToDelete;

    // If no items left, stay on page 1
    if (itemsAfterDelete <= 0) {
        return 1;
    }

    // Calculate total pages after deletion
    const totalPagesAfterDelete = Math.ceil(itemsAfterDelete / itemsPerPage);

    // If current page is greater than total pages after delete, go to previous page
    if (currentPage > totalPagesAfterDelete) {
        return Math.max(1, totalPagesAfterDelete);
    }

    // Otherwise, stay on current page
    return currentPage;
};

/**
 * Check if we're on the last page and deleting the last item(s)
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Number of items per page
 * @returns {boolean} - True if deleting would leave current page empty
 */
export const willPageBeEmptyAfterDelete = (currentPage, totalItems, itemsPerPage) => {
    const itemsOnCurrentPage = totalItems - ((currentPage - 1) * itemsPerPage);
    return itemsOnCurrentPage === 1 && currentPage > 1;
};

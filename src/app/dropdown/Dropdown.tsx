import { useState } from "react";
import { DropdownItem } from "../page"; // Ensure correct import

type Props = {
  item: DropdownItem;
};

export default function Dropdown({ item }: Props) {
  const [menuStack, setMenuStack] = useState<DropdownItem[]>([item]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ item: DropdownItem; path: DropdownItem[] }[]>([]);
  const [searchPath, setSearchPath] = useState<DropdownItem[]>([]);

  // Function to recursively search for menu items and store their paths
  const searchMenu = (menu: DropdownItem, query: string, path: DropdownItem[] = []): { item: DropdownItem; path: DropdownItem[] }[] => {
    if (!query) return [];

    let matches: { item: DropdownItem; path: DropdownItem[] }[] = [];

    const searchRecursive = (currentMenu: DropdownItem, currentPath: DropdownItem[]) => {
      if (currentMenu.label.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ item: currentMenu, path: [...currentPath, currentMenu] });
      }
      if (currentMenu.children) {
        currentMenu.children.forEach((child) => searchRecursive(child, [...currentPath, currentMenu]));
      }
    };

    searchRecursive(menu, path);
    return matches;
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchResults(searchMenu(item, query));
  };

  // Navigate to a selected search result
  const handleNavigateToMenu = (selectedItem: { item: DropdownItem; path: DropdownItem[] }) => {
    setMenuStack(selectedItem.path);
    setSearchPath(selectedItem.path);
    setSearchQuery(""); // Clear search after selecting an item
    setSearchResults([]); // Hide search results
  };

  // Navigate deeper into a submenu
  const handleSubMenuClick = (child: DropdownItem) => {
    setMenuStack((prev) => [...prev, child]); // Push new menu onto stack
  };

  // Navigate back
  const handleBack = () => {
    if (menuStack.length > 1) {
      setMenuStack((prev) => prev.slice(0, -1)); // Remove last menu level
    } else if (searchPath.length > 1) {
      setMenuStack(searchPath.slice(0, -1)); // Allow back navigation from search path
      setSearchPath(searchPath.slice(0, -1));
    }
  };

  return (
    <div className="relative w-64 overflow-hidden bg-white border rounded-lg shadow-lg">
      {/* Search Bar */}
      <div className="p-2 border-b relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded"
        />

        {/* Search Suggestions Dropdown */}
        {searchQuery && searchResults.length > 0 && (
          <div className="absolute left-0 w-full bg-white border rounded shadow-lg z-10 mt-1">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleNavigateToMenu(result)}
                className="block w-full text-left px-4 py-2 border-b hover:bg-gray-100"
              >
                {result.item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Back Button (Always Static at the Top) */}
      {menuStack.length > 1 && (
        <div className="p-2 border-b bg-gray-100">
          <button onClick={handleBack} className="text-blue-500 underline">
            ← Back
          </button>
        </div>
      )}

      {/* Menu Items */}
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          width: `${menuStack.length * 100}%`, // Ensures all menus are in one row
          transform: `translateX(-${(100 / menuStack.length) * (menuStack.length - 1)}%)`, // Dynamic percentage transition
        }}
      >
        {menuStack.map((currentMenu, index) => (
          <div key={index} className="w-64 flex-shrink-0 p-4">
            {/* Menu Items */}
            {currentMenu.children && currentMenu.children.length > 0 ? (
              currentMenu.children.map((child, childIndex) => (
                <button
                  key={childIndex}
                  onClick={() => handleSubMenuClick(child)}
                  className="block w-full text-left px-4 py-2 border-b hover:bg-gray-100"
                >
                  {child.label}
                </button>
              ))
            ) : (
              <p className="p-2 text-gray-500">No sub-items</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

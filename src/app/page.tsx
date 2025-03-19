"use client"

import Dropdown from "./dropdown/Dropdown"
export type DropdownItem = {
  label: string
  children: DropdownItem[] | null
}

export default function Home() {
  const menuData = {
    label: "Main Menu",
    children: [
      {
        label: "Sub Menu 1",
        children: [
          { label: "Option 1", children: null },
          { label: "Option 2", children: null },
        ],
      },
      {
        label: "Sub Menu 2",
        children: [
          { label: "Option A", children: null },
          { label: "Option B", children: null },
        ],
      },
    ],
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
          <Dropdown item={menuData} />
    </div>
  )
}

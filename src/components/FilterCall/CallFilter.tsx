import React, { useState, useRef, useEffect } from "react";
import "./CallFilter.css";

type FilterType = "all" | "in" | "out";

interface CallFilterProps {
  filter: FilterType;
  setFilter: (value: FilterType) => void;
}

const options: { label: string; value: FilterType }[] = [
  { label: "Все типы", value: "all" },
  { label: "Входящие", value: "in" },
  { label: "Исходящие", value: "out" },
];

const CallFilter: React.FC<CallFilterProps> = ({ filter, setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Выбор опции
  const onSelect = (value: FilterType) => {
    setFilter(value);
    setIsOpen(false);
  };

  return (
    <div className={`wrapper-call custom-select${isOpen ? " open" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className="select-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {options.find((opt) => opt.value === filter)?.label || "Выберите"}
        <span className={`arrow ${isOpen ? "up" : "down"}`} />
      </button>

      {isOpen && (
        <ul className="select-options" role="listbox">
          {options.map(({ label, value }) => (
            <li
              key={value}
              role="option"
              aria-selected={filter === value}
              className={`option${filter === value ? " selected" : ""}`}
              onClick={() => onSelect(value)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(value);
                }
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CallFilter;


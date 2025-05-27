import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./DateCarousel.css";
import calendarIcon from "../../assets/icon-calendar.svg";

const options = [
  { label: "3 дня", value: "3days" },
  { label: "Неделя", value: "week" },
  { label: "Месяц", value: "month" },
  { label: "Год", value: "year" },
];

interface DateCarouselProps {
  period: string;
  setPeriod: (value: string) => void;
}

export default function DateCarousel({ period, setPeriod }: DateCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentIndex = options.findIndex((opt) => opt.value === period);

  const handleArrowClick = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < options.length) {
      setPeriod(options[newIndex].value);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelect = (value: string) => {
    setPeriod(value);
    setIsOpen(false);
  };

  return (
    <div className="carousel" ref={dropdownRef}>
      <button
        onClick={() => handleArrowClick(-1)}
        className="nav-button"
        aria-label="Previous period"
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="date-selector">
        <button
          type="button"
          className="date-select-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <img src={calendarIcon} alt="Календарь" style={{ marginRight: 6 }} />
          {options[currentIndex]?.label}
        </button>

        {isOpen && (
          <ul className="date-select-options" role="listbox">
            {options.map(({ label, value }) => (
              <li
                key={value}
                role="option"
                tabIndex={0}
                aria-selected={period === value}
                className={`date-select-option${period === value ? " selected" : ""}`}
                onClick={() => onSelect(value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => {
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

      <button
        onClick={() => handleArrowClick(1)}
        className="nav-button"
        aria-label="Next period"
        disabled={currentIndex === options.length - 1}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";

interface DateCarouselProps {
  period: "3days" | "week" | "month" | "year";
  setPeriod: (value: "3days" | "week" | "month" | "year") => void;
}

const options = [
  { label: "3 дня", value: "3days" },
  { label: "Неделя", value: "week" },
  { label: "Месяц", value: "month" },
  { label: "Год", value: "year" },
];

export default function DateCarousel({ period, setPeriod }: DateCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  const currentIndex = options.findIndex((opt) => opt.value === period);

  const handleArrowClick = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < options.length) {
      setPeriod(options[newIndex].value as any);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      ref.current &&
      event.target instanceof Node &&
      !ref.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCustomApply = () => {
    if (
      customStart &&
      customEnd &&
      new Date(customStart) <= new Date(customEnd)
    ) {
      // Триггерить установку периода с пользовательским диапазоном,
      // Например, передать кастомный период как "custom" и отдельно обработать даты
      // Здесь можно вызвать callback с новым диапазоном, если нужно
      alert(`Фильтр по датам с ${customStart} по ${customEnd} применён`);
      setIsOpen(false);
    } else {
      alert("Проверьте правильность выбранных дат");
    }
  };

  return (
    <div className="carousel" ref={ref}>
      <button
        onClick={() => handleArrowClick(-1)}
        className="nav-button"
        aria-label="Previous period"
        disabled={currentIndex === 0}
      >
        {"<"}
      </button>

      <div className="date-selector">
        <button
          type="button"
          className="date-select-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {options[currentIndex]?.label}
          <span className={`arrow ${isOpen ? "up" : "down"}`} />
        </button>
        {isOpen && (
          <ul className="date-select-options" role="listbox">
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`date-select-option ${opt.value === period ? "selected" : ""}`}
                role="option"
                aria-selected={opt.value === period}
                onClick={() => {
                  setPeriod(opt.value as any);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}

            {/* Пользовательский фильтр по датам */}
            <li className="date-select-option custom-date-filter">
              <label>
                Начало:{" "}
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
              </label>
              <label>
                Конец:{" "}
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </label>
              <button onClick={handleCustomApply}>Применить</button>
            </li>
          </ul>
        )}
      </div>

      <button
        onClick={() => handleArrowClick(1)}
        className="nav-button"
        aria-label="Next period"
        disabled={currentIndex === options.length - 1}
      >
        {">"}
      </button>
    </div>
  );
}

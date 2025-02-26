import React, { useState, useRef, useEffect } from "react";
import "./ComboBox.css";

interface ComboBoxProps {
  label?: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (newValue: string) => void;
  useModal?: boolean;  // If false, it will be a simple dropdown
}

const ComboBox: React.FC<ComboBoxProps> = ({
  label,
  placeholder = "Search...",
  options,
  value,
  onChange,
  useModal = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options by search text
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchText.toLowerCase())
  );

  // Close if clicked outside (for non-modal usage)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (!useModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (!useModal) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [useModal]);

  const handleSelect = (selected: string) => {
    onChange(selected);
    setIsOpen(false);
    setSearchText("");
  };

  return (
    <div className="combo-box" ref={containerRef}>
      {label && <label className="combo-box-label">{label}</label>}

      {/* The "input" that triggers the combo-box */}
      <div
        className="combo-box-input"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
      >
        {value || placeholder}
      </div>

      {/* ------------------ Top-Sheet Modal Version ------------------ */}
      {isOpen && useModal && (
        <>
          {/* Dark overlay dims the background */}
          <div className="combo-box-overlay" onClick={() => setIsOpen(false)} />

          {/* Top-sheet container, anchored to the top of the screen */}
          <div className="combo-box-top-sheet">
            <div className="combo-box-top-sheet-header">
              <button
                className="combo-box-close-btn"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>

              <input
                className="combo-box-search"
                placeholder={placeholder}
                autoFocus
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="combo-box-top-sheet-list">
              {filteredOptions.map((opt) => (
                <div
                  key={opt}
                  className="combo-box-list-item"
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="combo-box-list-item no-results">
                  لا يوجد نتائج
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ------------------ Non-Modal (Dropdown) ------------------ */}
      {isOpen && !useModal && (
        <div className="combo-box-dropdown">
          <input
            className="combo-box-search"
            placeholder={placeholder}
            autoFocus
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="combo-box-list">
            {filteredOptions.map((opt) => (
              <div
                key={opt}
                className="combo-box-list-item"
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="combo-box-list-item no-results">
                لا يوجد نتائج
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboBox;

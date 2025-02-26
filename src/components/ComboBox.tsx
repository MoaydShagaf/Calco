import React, { useState, useRef, useEffect } from "react";
import "./ComboBox.css";

interface ComboBoxProps {
  label?: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (newValue: string) => void;
  useModal?: boolean;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  label,
  placeholder = "إضافة مادة",
  options,
  value,
  onChange,
  useModal = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adjustViewportHeight = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    adjustViewportHeight();
    window.addEventListener("resize", adjustViewportHeight);
    return () => window.removeEventListener("resize", adjustViewportHeight);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (selected: string) => {
    onChange(selected);
    setIsOpen(false);
    setSearchText("");
  };

  return (
    <div className="combo-box" ref={containerRef}>
      {label && <label className="combo-box-label">{label}</label>}

      <div
        className="combo-box-input"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
      >
        {value || placeholder}
      </div>

      {isOpen && useModal && (
        <>
          <div className="combo-box-overlay" onClick={() => setIsOpen(false)} />
          <div className="combo-box-top-sheet" ref={modalRef}>
            <div className="combo-box-top-sheet-header">
              <button className="combo-box-close-btn" onClick={() => setIsOpen(false)}>
                ✖ إغلاق
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
              {options
                .filter((opt) =>
                  opt.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((opt, index) => (
                  <div
                    key={opt}
                    className={`combo-box-list-item ${index !== options.length - 1 ? "combo-box-divider" : ""}`}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                  </div>
                ))}
              {options.length === 0 && (
                <div className="combo-box-list-item no-results">لا يوجد نتائج</div>
              )}
            </div>
          </div>
        </>
      )}

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
            {options
              .filter((opt) =>
                opt.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((opt, index) => (
                <div
                  key={opt}
                  className={`combo-box-list-item ${index !== options.length - 1 ? "combo-box-divider" : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </div>
              ))}
            {options.length === 0 && (
              <div className="combo-box-list-item no-results">لا يوجد نتائج</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboBox;

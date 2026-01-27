// Select.jsx
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { tw } from "../utility";
import { useClickAway } from "react-use";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * options: [{ value: string|number|null, label: string }]
 *
 * value: current selected option value
 * onChange: (newValue) => void
 *
 * placeholder:
 * - for SelectNormal: shown as top label (small) + current selected label inside box
 * - for SelectLabeled: used as floating label (in the border) like InputPrimary
 */
export const Select = forwardRef(
  (
    {
      type = "normal", // "normal" | "labeled"
      placeholder,
      options = [],
      value,
      onChange,
      disabled = false,
      error = false,
      isRequired = false,
      labelBg = "bg-white",
      className,
      dropdownClassName,
      // optional: render items (rare)
      renderOption,
    },
    ref
  ) => {
    const Component = type === "labeled" ? SelectLabeled : SelectNormal;

    return (
      <Component
        ref={ref}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        isRequired={isRequired}
        labelBg={labelBg}
        className={className}
        dropdownClassName={dropdownClassName}
        renderOption={renderOption}
      />
    );
  }
);

function getSelectedLabel(options, value) {
  const found = options.find((o) => o.value === value);
  return found ? found.label : "";
}

/**
 * Shared dropdown menu for selects
 */
function SelectMenu({
  options,
  value,
  onPick,
  dropdownClassName,
  renderOption,
}) {
  return (
    <div
      className={tw(
        "absolute left-0 right-0 top-full mt-1 z-50",
        "rounded-md shadow-lg overflow-hidden",
        "bg-white border border-gray-200"
      )}
    >
      <div className={tw("max-h-72 overflow-auto", dropdownClassName)}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onPick(opt.value)}
              className={tw(
                "w-full text-left px-4 py-3",
                "transition-colors duration-100",
                isSelected ? "bg-gray-200" : "bg-white hover:bg-gray-100"
              )}
            >
              {renderOption ? renderOption(opt, { isSelected }) : opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 1) Normal Select
 * - Hover: background a bit darker
 * - Click/focus: border-bottom blue + dropdown opens
 * - Has a small label above the box (like Topic filter screenshot)
 */
const SelectNormal = forwardRef(
  (
    {
      placeholder,
      options,
      value,
      onChange,
      disabled,
      error,
      isRequired,
      className,
      dropdownClassName,
      renderOption,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);

    // forwardRef points to the trigger button (nice for focusing)
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") ref(triggerRef.current);
      else ref.current = triggerRef.current;
    }, [ref]);

    const selectedLabel = useMemo(
      () => getSelectedLabel(options, value),
      [options, value]
    );

    useClickAway(rootRef, () => setOpen(false));

    const focusClasses = isFocused || open;
    const labelClasses = focusClasses ? "text-blue-600" : "text-gray-600";
    const borderClasses = focusClasses
      ? error
        ? "border-b-red-500"
        : "border-b-blue-600"
      : error
      ? "border-b-red-500 hover:border-b-red-600"
      : "border-b-gray-300 hover:border-b-blue-500";

    return (
      <div ref={rootRef} className={tw("relative w-full", className)}>
        {placeholder ? (
          <div className={tw("mb-1 text-xs font-medium", labelClasses)}>
            {placeholder}
            {isRequired && <span className="ml-0.5">*</span>}
          </div>
        ) : null}

        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setOpen((v) => !v);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={tw(
            "w-full flex items-center justify-between",
            "rounded-sm px-4 py-3",
            "bg-gray-100",
            "border-b-2 transition-colors duration-150",
            borderClasses,
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
            !disabled && !open ? "hover:bg-gray-200" : "",
            error ? "text-red-700" : "text-gray-800"
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className={tw("text-left", selectedLabel ? "" : "text-gray-500")}>
            {selectedLabel || "Select..."}
          </span>

          <span className="ml-3 shrink-0">
            {open ? (
              <ChevronUp className={tw("size-4", error ? "text-red-600" : "text-gray-600")} />
            ) : (
              <ChevronDown className={tw("size-4", error ? "text-red-600" : "text-gray-600")} />
            )}
          </span>
        </button>

        {open && (
          <SelectMenu
            options={options}
            value={value}
            dropdownClassName={dropdownClassName}
            renderOption={renderOption}
            onPick={(newValue) => {
              onChange?.(newValue);
              setOpen(false);
              triggerRef.current?.focus();
            }}
          />
        )}
      </div>
    );
  }
);

/**
 * 2) Labeled Select (border label / floating label like InputPrimary)
 * - Hover: border + label + text get a bit darker
 * - Click/focus: border + label + text turn blue, dropdown opens
 */
const SelectLabeled = forwardRef(
  (
    {
      placeholder,
      options,
      value,
      onChange,
      disabled,
      error,
      isRequired,
      labelBg = "bg-white",
      className,
      dropdownClassName,
      renderOption,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") ref(triggerRef.current);
      else ref.current = triggerRef.current;
    }, [ref]);

    const selectedLabel = useMemo(
      () => getSelectedLabel(options, value),
      [options, value]
    );

    const hasValue = selectedLabel && selectedLabel.length > 0;
    const shouldFloat = isFocused || open || hasValue;

    useClickAway(rootRef, () => setOpen(false));

    const focusClasses = isFocused || open;

    const border = focusClasses
      ? error
        ? "border-red-500 ring-1 ring-red-500"
        : "border-blue-600 ring-1 ring-blue-600"
      : error
      ? "border-red-500 hover:border-red-600"
      : "border-gray-500 hover:border-gray-700";

    const labelColor = focusClasses
      ? error
        ? "text-red-500"
        : "text-blue-600"
      : error
      ? "text-red-500 group-hover:text-red-600"
      : "text-gray-500 group-hover:text-gray-700";

    const textColor = focusClasses
      ? error
        ? "text-red-700"
        : "text-blue-700"
      : error
      ? "text-red-700"
      : "text-gray-800";

    return (
      <div ref={rootRef} className={tw("relative w-full", className)}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setOpen((v) => !v);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={tw(
            "group relative w-full",
            "rounded-sm px-3 py-2",
            "flex items-center justify-between",
            "border transition-colors duration-150",
            border,
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {/* Floating/border label */}
          {placeholder ? (
            <span
              className={tw(
                "absolute left-2 pointer-events-none px-1",
                labelBg,
                "transition-all duration-150 ease-out",
                "top-0 -translate-y-3.5 -translate-x-2 scale-80",
                labelColor
              )}
            >
              {placeholder}
              {isRequired && "*"}
            </span>
          ) : null}

          {/* Selected value */}
          <span className={tw("text-left", textColor, !hasValue ? "text-gray-500" : "")}>
            {hasValue ? selectedLabel : "Select..."}
          </span>

          <span className="ml-3 shrink-0">
            {open ? (
              <ChevronUp className={tw("size-4", error ? "text-red-600" : "text-blue-600")} />
            ) : (
              <ChevronDown className={tw("size-4", error ? "text-red-600" : "text-gray-600 group-hover:text-gray-800")} />
            )}
          </span>
        </button>

        {open && (
          <SelectMenu
            options={options}
            value={value}
            dropdownClassName={dropdownClassName}
            renderOption={renderOption}
            onPick={(newValue) => {
              onChange?.(newValue);
              setOpen(false);
              triggerRef.current?.focus();
            }}
          />
        )}
      </div>
    );
  }
);

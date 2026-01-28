import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { tw } from "../utility";

/**
 * Main Input Switcher
 * forwardRef allows this to receive the 'ref' from register()
 */
export const Input = forwardRef(({ 
  placeholder, 
  error, 
  isRequired = false, 
  type = 'primary',
  labelBg = 'bg-white',
  labelPosition = '',
  ...props 
}, ref) => {
  const Component =
  type === "primary"
    ? InputPrimary
    : type === "secondary"
    ? InputSecondary
    : InputTertiary;

  return (
    <Component 
      ref={ref} 
      placeholder={placeholder} 
      error={error} 
      isRequired={isRequired}
      labelBg={labelBg}
      labelPosition={labelPosition}
      {...props} 
    />
  );
});

/**
 * Primary Style
 */
const InputPrimary = forwardRef(({ 
  placeholder, error, isRequired, onBlur, onFocus, labelBg, labelPosition, ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef(null);

  useImperativeHandle(ref, () => internalRef.current);

  const hasValue = props.value !== undefined ? props.value !== "" : internalRef.current?.value !== "";
  const shouldFloat = isFocused || hasValue;

  return (
    <div 
      onClick={() => internalRef.current?.focus()}
      className={tw(
        "group rounded-sm relative w-full px-3 py-2 flex cursor-text", // Removed transition-all from here
        "border transition-colors duration-150", // Only animate colors
        isFocused 
          ? !error ? "border-blue-600 ring-1 ring-blue-600" : ""
          : "border-gray-500 hover:border-blue-600",
        error ? "border-red-500 hover:border-red-600" : ""
      )}
    >
      <label className={tw(
        "absolute left-2 cursor-text text-md pointer-events-none px-1", labelBg,
        "transition-all duration-150 ease-out", // Keep transition on the label only
        shouldFloat ? "top-0 -translate-y-3.5 -translate-x-2 scale-80" : "top-2 scale-100",
        isFocused ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500",
        error ? "text-red-500 group-hover:text-red-600" : "",
        labelPosition
      )}>
        {placeholder}{isRequired && "*"}
      </label>
      <input 
        {...props}
        ref={internalRef}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        className={tw("w-full appearance-none text-gray-700 outline-none bg-transparent", error ? "caret-red-700" : "caret-blue-700")}
      />
    </div>
  );
});

/**
 * Secondary Style
 */
const InputSecondary = forwardRef(({ 
  placeholder, error, isRequired, onBlur, onFocus, labelPosition, ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef(null);

  useImperativeHandle(ref, () => internalRef.current);

  const hasValue = props.value !== undefined ? props.value !== "" : internalRef.current?.value !== "";
  const shouldFloat = isFocused || hasValue;

  return (
    <div 
      onClick={() => internalRef.current?.focus()}
      className={tw(
        "group rounded-t-sm relative w-full px-3 pb-2 pt-4.5 flex cursor-text bg-gray-100",
        "border-b-2 transition-colors duration-150",
        isFocused 
          ? "border-blue-600 border-b-2" 
          : "border-gray-400 hover:border-blue-500",
        error ? "border-red-500 hover:border-red-600" : ""
      )}
    >
      <label className={tw(
        "absolute left-2 top-4 cursor-text text-md pointer-events-none",
        "transition-all duration-150 ease-out",
        shouldFloat 
          ? "-translate-y-4.5 -translate-x-1.5 scale-80" 
          : "translate-y-0 scale-100",
        isFocused ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500",
        error ? "text-red-500 group-hover:text-red-600" : "",
        labelPosition
      )}>
        {placeholder}{isRequired && "*"}
      </label>
      <input 
        {...props}
        ref={internalRef}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        className={tw("w-full appearance-none text-gray-700 outline-none bg-transparent", error ? "caret-red-700" : "caret-blue-700")}
      />
    </div>
  );
});

const InputTertiary = forwardRef(
  (
    {
      placeholder,
      error,
      isRequired,
      onBlur,
      onFocus,
      labelBg = "bg-white",
      className,
      rows = 6, // you can override
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef(null);

    useImperativeHandle(ref, () => internalRef.current);

    const hasValue =
      props.value !== undefined
        ? props.value !== ""
        : (internalRef.current?.value ?? "") !== "";

    const shouldFloat = isFocused || hasValue;

    return (
      <div
        onClick={() => internalRef.current?.focus()}
        className={tw(
          "group relative w-full rounded-md border-b-2 bg-gray-100",
          "px-3 pt-6 pb-3 cursor-text",
          "transition-colors duration-150",
          isFocused
            ? !error
              ? "border-b-blue-600"
              : "border-b-red-500"
            : "border-gray-400 hover:border-blue-500",
          className
        )}
      >
        <label
          className={tw(
            "absolute left-2 cursor-text pointer-events-none px-1",
            labelBg,
            "transition-all duration-150 ease-out",
            shouldFloat
              ? "top-2 text-xs -translate-y-0"
              : "top-6 text-base",
            isFocused ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500",
            error ? "text-red-500 group-hover:text-red-600" : ""
          )}
        >
          {placeholder}
          {isRequired && "*"}
        </label>

        <textarea
          {...props}
          ref={internalRef}
          rows={rows}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={tw(
            "w-full bg-transparent outline-none appearance-none",
            "text-gray-800",
            "resize-none",                 // prevents drag-resize
            "leading-relaxed",
            "break-words whitespace-pre-wrap", // wrap long text + preserve newlines
            error ? "caret-red-700" : "caret-blue-700"
          )}
        />
      </div>
    );
  }
);

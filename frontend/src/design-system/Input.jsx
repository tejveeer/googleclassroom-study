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
  ...props 
}, ref) => {
  const Component = type === "primary" ? InputPrimary : InputSecondary;
  
  return (
    <Component 
      ref={ref} 
      placeholder={placeholder} 
      error={error} 
      isRequired={isRequired}
      labelBg={labelBg}
      {...props} 
    />
  );
});

/**
 * Primary Style
 */
const InputPrimary = forwardRef(({ 
  placeholder, error, isRequired, onBlur, onFocus, labelBg, ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef(null);

  useImperativeHandle(ref, () => internalRef.current);

  const hasValue = props.value !== undefined ? props.value !== "" : internalRef.current?.value !== "";
  const shouldFloat = isFocused || hasValue;

  console.log(props);
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
        error ? "text-red-500 group-hover:text-red-600" : ""
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
  placeholder, error, isRequired, onBlur, onFocus, ...props 
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
        "border-b transition-colors duration-150", // Remove transition-all, target colors
        isFocused 
          ? "border-blue-600 border-b-2" // Border-width change is now instant
          : "border-gray-400 hover:border-blue-500",
        error ? "border-red-500" : ""
      )}
    >
      <label className={tw(
        "absolute left-2 cursor-text text-md pointer-events-none",
        "transition-all duration-150 ease-out", // Keep smooth transition only for the label
        shouldFloat 
          ? "-translate-y-4.5 -translate-x-1.5 scale-80" 
          : "translate-y-0 scale-100",
        isFocused ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500",
        error ? "text-red-500" : ""
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
        className="w-full appearance-none text-gray-700 outline-none caret-blue-700 bg-transparent"
      />
    </div>
  );
});
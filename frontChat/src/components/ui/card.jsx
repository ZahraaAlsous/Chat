export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`
        rounded-2xl shadow-2xl border transition-all
        bg-white border-gray-200 text-gray-800
        dark:bg-[#183642] dark:border-[#1797A6] dark:text-[#F3F6F9]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

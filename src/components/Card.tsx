
import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  className?: string;
  children?: ReactNode;
}

export default function Card({
  title,
  description,
  icon,
  href,
  className = "",
  children,
}: CardProps) {
  const content = (
    <div
      className={`
        bg-white dark:bg-brand-grey-900 border border-brand-grey-200 dark:border-brand-grey-800
        p-6 lg:p-8 transition-all duration-200 hover:shadow-card-hover hover:border-brand-grey-300 dark:hover:border-brand-grey-700
        ${className}
        flex flex-col justify-between
        h-80 sm:h-72 md:h-80 lg:h-80  // Fixed height
        overflow-hidden
      `}
    >
      {icon && <div className="mb-4 text-accent">{icon}</div>}

      <div className="flex-1">
        {/* Limit title to 2 lines with ellipsis */}
        <h3 className="text-heading-4 text-brand-black dark:text-white mb-3 line-clamp-2">
          {title}
        </h3>

        {description && (
          <p className="text-body text-left text-brand-grey-500 dark:text-brand-grey-400 line-clamp-3">
            {description}
          </p>
        )}
      </div>

      {children}

      {href && (
        <div className="mt-4 text-label text-accent flex items-center gap-2">
          Learn More
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center py-8">
      <div className="text-heading-1 text-accent mb-2">{value}</div>
      <div className="text-body text-brand-grey-500 dark:text-brand-grey-400">{label}</div>
    </div>
  );
}
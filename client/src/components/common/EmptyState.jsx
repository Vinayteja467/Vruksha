import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are currently no items available to display here.',
  actionText,
  actionLink,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-4 max-w-md mx-auto ${className}`}>
      <div className="w-16 h-16 rounded-3xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto mb-4 border border-forest-100/60 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="font-serif text-xl font-bold text-forest-950 mb-1.5">
        {title}
      </h3>

      <p className="text-xs text-stone-500 leading-relaxed mb-6">
        {description}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider inline-flex items-center gap-2"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider inline-flex items-center gap-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

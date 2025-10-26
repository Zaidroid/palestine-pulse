/**
 * Mobile Menu Component
 * Full-screen mobile navigation drawer
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { TouchTarget } from './touch-target';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export interface MobileMenuItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  badge?: number;
  onClick?: () => void;
  children?: MobileMenuItem[];
}

export interface MobileMenuProps {
  items: MobileMenuItem[];
  activeItem?: string;
  onItemClick?: (value: string) => void;
  trigger?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Full-screen mobile menu drawer
 */
export function MobileMenu({
  items,
  activeItem,
  onItemClick,
  trigger,
  header,
  footer,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { isMobileOrTablet } = useBreakpoint();

  const handleItemClick = (item: MobileMenuItem) => {
    if (item.children && item.children.length > 0) {
      // Toggle expansion for items with children
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(item.value)) {
          next.delete(item.value);
        } else {
          next.add(item.value);
        }
        return next;
      });
    } else {
      // Execute click handler and close menu
      item.onClick?.();
      onItemClick?.(item.value);
      setIsOpen(false);
    }
  };

  // Don't render on desktop
  if (!isMobileOrTablet) {
    return null;
  }

  return (
    <>
      {/* Trigger button */}
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <TouchTarget
          size="md"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </TouchTarget>
      )}

      {/* Menu drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-background border-r shadow-lg z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                {header || <div className="text-lg font-semibold">Menu</div>}
                <TouchTarget
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </TouchTarget>
              </div>

              {/* Menu items */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-2">
                  {items.map((item) => (
                    <MobileMenuItemComponent
                      key={item.value}
                      item={item}
                      isActive={activeItem === item.value}
                      isExpanded={expandedItems.has(item.value)}
                      onClick={() => handleItemClick(item)}
                      level={0}
                    />
                  ))}
                </nav>
              </div>

              {/* Footer */}
              {footer && (
                <div className="p-4 border-t">
                  {footer}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface MobileMenuItemComponentProps {
  item: MobileMenuItem;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
  level: number;
}

function MobileMenuItemComponent({
  item,
  isActive,
  isExpanded,
  onClick,
  level,
}: MobileMenuItemComponentProps) {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <motion.button
        className={cn(
          'w-full flex items-center justify-between gap-3',
          'px-4 py-3 rounded-lg text-left',
          'transition-colors touch-manipulation',
          'min-h-[44px]',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground',
          level > 0 && 'ml-4'
        )}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <div className="flex items-center gap-3 flex-1">
          {item.icon && (
            <span className="flex-shrink-0">{item.icon}</span>
          )}
          <span className="font-medium">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-destructive text-destructive-foreground">
              {item.badge}
            </span>
          )}
        </div>
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-5 w-5" />
          </motion.div>
        )}
      </motion.button>

      {/* Submenu */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <MobileMenuItemComponent
                key={child.value}
                item={child}
                isActive={false}
                isExpanded={false}
                onClick={() => child.onClick?.()}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Search, Heart, BarChart3, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/store/useJobs';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { savedJobs, compareList } = useJobs();

  const navItems = [
    { href: '/', label: 'Search', icon: Search },
    { href: '/results', label: 'Jobs', icon: Search },
    { 
      href: '/saved', 
      label: 'Saved', 
      icon: Heart, 
      badge: savedJobs.length > 0 ? savedJobs.length : null 
    },
    { 
      href: '/compare', 
      label: 'Compare', 
      icon: BarChart3, 
      badge: compareList.length > 0 ? compareList.length : null 
    },
    { href: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-2"
            >
              <Search className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                JobFinder
              </h1>
              <p className="text-xs text-gray-400">for Kutay Kılıç</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                      isActive 
                        ? "bg-white/10 text-white" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 rounded-full bg-purple-500 px-2 py-0.5 text-xs font-bold text-white"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">Kutay Kılıç</p>
              <p className="text-xs text-gray-400">EE Engineer</p>
            </div>
            <div className="rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-2">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap",
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 rounded-full bg-purple-500 px-1.5 py-0.5 text-xs font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
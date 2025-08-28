'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Cloud, 
  Monitor, 
  CheckSquare,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchPresetsProps {
  onPresetClick: (keywords: string) => void;
}

const presets = [
  {
    id: 'auditor',
    label: 'IT Auditor',
    keywords: 'IT Audit BT Denetim SOX COBIT',
    icon: CheckSquare,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'security',
    label: 'Security',
    keywords: 'Information Security Bilgi Güvenlik ISO 27001 NIST',
    icon: Shield,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'cloud',
    label: 'Cloud',
    keywords: 'Cloud Security AWS Azure Bulut Güvenlik',
    icon: Cloud,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'soc',
    label: 'SOC Analyst',
    keywords: 'SOC Analyst SIEM Incident Response',
    icon: Monitor,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'grc',
    label: 'GRC',
    keywords: 'GRC Risk Management Compliance',
    icon: Briefcase,
    color: 'from-indigo-500 to-blue-500'
  }
];

export function SearchPresets({ onPresetClick }: SearchPresetsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {presets.map((preset, index) => {
        const Icon = preset.icon;
        return (
          <motion.div
            key={preset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              onClick={() => onPresetClick(preset.keywords)}
              className="h-auto p-4 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm hover:border-white/20 hover:from-white/10 hover:to-white/5 transition-all duration-300 group w-full"
            >
              <div className={`rounded-xl p-3 bg-gradient-to-br ${preset.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-white group-hover:text-white/90">
                {preset.label}
              </span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
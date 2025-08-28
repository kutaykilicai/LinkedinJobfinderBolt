'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Languages, 
  Bell, 
  Download,
  ArrowLeft,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userProfile } from '@/lib/userData';
import { useJobs } from '@/store/useJobs';
import Link from 'next/link';

export default function SettingsPage() {
  const { exportSavedJobs, clearCompareList } = useJobs();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  value={userProfile.name}
                  disabled
                  className="border-white/20 bg-white/5 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="title" className="text-white">Professional Title</Label>
                <Input
                  id="title"
                  value={userProfile.title}
                  disabled
                  className="border-white/20 bg-white/5 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white">Years of Experience</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="border-purple-400/30 bg-purple-400/10 text-purple-400">
                    {userProfile.experience} years
                  </Badge>
                  <span className="text-gray-400 text-sm">at KPMG Turkey</span>
                </div>
              </div>

              <div>
                <Label className="text-white">Languages</Label>
                <div className="flex gap-2 mt-1">
                  {userProfile.languages.map((lang) => (
                    <Badge
                      key={lang}
                      variant="outline"
                      className="border-blue-400/30 bg-blue-400/10 text-blue-400"
                    >
                      <Languages className="h-3 w-3 mr-1" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-white">Preferred Location</Label>
                <Select defaultValue={userProfile.preferredLocation}>
                  <SelectTrigger className="border-white/20 bg-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="İstanbul">İstanbul</SelectItem>
                    <SelectItem value="Ankara">Ankara</SelectItem>
                    <SelectItem value="İzmir">İzmir</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Target Roles</Label>
                <div className="flex flex-wrap gap-1 mt-2 max-h-32 overflow-y-auto">
                  {userProfile.preferredRoles.slice(0, 8).map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="border-emerald-400/30 bg-emerald-400/10 text-emerald-400 text-xs"
                    >
                      {role}
                    </Badge>
                  ))}
                  {userProfile.preferredRoles.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{userProfile.preferredRoles.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Remote Work</Label>
                  <p className="text-sm text-gray-400">Consider remote positions</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Bilingual Search</Label>
                  <p className="text-sm text-gray-400">Search in English & Turkish</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Core Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {userProfile.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-gray-600 bg-gray-800/50 text-gray-300 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-white/20"
                disabled
              >
                Edit Skills (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications & Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Job Alerts</Label>
                  <p className="text-sm text-gray-400">Daily email with new matches</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Weekly Summary</Label>
                  <p className="text-sm text-gray-400">Weekly job market insights</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <Button
                  onClick={exportSavedJobs}
                  variant="outline"
                  className="w-full border-white/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Saved Jobs
                </Button>

                <Button
                  onClick={clearCompareList}
                  variant="outline"
                  className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  Clear Comparison List
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">About This App</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-1">95%</div>
                <div className="text-sm text-gray-400">Match Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">Bilingual</div>
                <div className="text-sm text-gray-400">EN + TR Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400 mb-1">AI-Powered</div>
                <div className="text-sm text-gray-400">Smart Matching</div>
              </div>
            </div>
            
            <div className="text-center mt-6 text-sm text-gray-400">
              Built specifically for IT Audit, Security, and Cloud professionals
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
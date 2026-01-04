import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Settings, CreditCard, BarChart3, Bell, Shield, 
  ChevronLeft, Camera, Mail, Calendar, Sparkles, 
  Zap, Crown, CheckCircle2, ArrowRight, LogOut,
  Moon, Sun, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const subscriptionPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["5 projects", "Basic templates", "720p export", "Community support"],
    current: true,
    color: "from-gray-500 to-gray-600",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["Unlimited projects", "All templates", "4K export", "Priority support", "AI engines x18"],
    current: false,
    color: "from-teal-500 to-cyan-500",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: ["Everything in Pro", "Custom branding", "API access", "Dedicated support", "Team collaboration"],
    current: false,
    color: "from-purple-500 to-pink-500",
  },
];

const usageStats = [
  { label: "Projects Created", value: "12", max: "15", icon: Sparkles, color: "from-teal-500 to-cyan-500" },
  { label: "Exports This Month", value: "45", max: "50", icon: Zap, color: "from-purple-500 to-pink-500" },
  { label: "AI Generations", value: "89", max: "100", icon: BarChart3, color: "from-orange-500 to-amber-500" },
  { label: "Storage Used", value: "2.4", max: "5", unit: "GB", icon: Shield, color: "from-blue-500 to-indigo-500" },
];

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(
    (user && 'user_metadata' in user && user.user_metadata?.full_name) || "User"
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleSaveProfile = () => {
    toast.success("Profile saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Profile Settings</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 text-center mb-1">{fullName}</h2>
              <p className="text-sm text-gray-500 text-center mb-4">{user?.email || "user@example.com"}</p>
              
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full border border-teal-200/50 mb-6">
                <Crown className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">Free Plan</span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user?.email || "user@example.com"}</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Calendar className="w-4 h-4" />
                  <span>Joined January 2024</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="bg-white border border-gray-100 rounded-2xl p-1.5 mb-8 shadow-sm">
                <TabsTrigger 
                  value="account" 
                  className="rounded-xl px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger 
                  value="subscription" 
                  className="rounded-xl px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscription
                </TabsTrigger>
                <TabsTrigger 
                  value="usage" 
                  className="rounded-xl px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Usage
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences" 
                  className="rounded-xl px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              {/* Account Tab */}
              <TabsContent value="account">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-12 rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="h-12 rounded-xl border-gray-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-xl px-8 shadow-lg shadow-teal-500/25"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription">
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Current Plan</h3>
                    <p className="text-gray-500 mb-6">Choose the plan that works best for you</p>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      {subscriptionPlans.map((plan, index) => (
                        <motion.div
                          key={plan.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative p-6 rounded-2xl border-2 transition-all ${
                            plan.current 
                              ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50' 
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-medium rounded-full">
                              Most Popular
                            </div>
                          )}
                          
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                            <Crown className="w-6 h-6 text-white" />
                          </div>
                          
                          <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                            <span className="text-gray-500">{plan.period}</span>
                          </div>
                          
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          
                          <Button
                            variant={plan.current ? "outline" : "default"}
                            className={`w-full rounded-xl ${
                              plan.current 
                                ? 'border-teal-500 text-teal-600' 
                                : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                            }`}
                            disabled={plan.current}
                          >
                            {plan.current ? 'Current Plan' : 'Upgrade'}
                            {!plan.current && <ArrowRight className="w-4 h-4 ml-2" />}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Usage Tab */}
              <TabsContent value="usage">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Usage Analytics</h3>
                  <p className="text-gray-500 mb-6">Track your creative production this month</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {usageStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-2xl font-bold text-gray-900">
                            {stat.value}<span className="text-sm text-gray-500">/{stat.max}{stat.unit || ''}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{stat.label}</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(parseFloat(stat.value) / parseFloat(stat.max)) * 100}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <div className="space-y-6">
                  {/* Theme Settings */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Appearance</h3>
                    <p className="text-gray-500 mb-6">Customize how Creato-Sphere looks on your device</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'system', label: 'System', icon: Monitor },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id as typeof theme)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            theme === option.id 
                              ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50' 
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                            theme === option.id ? 'text-teal-600' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            theme === option.id ? 'text-teal-600' : 'text-gray-600'
                          }`}>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Notifications</h3>
                    <p className="text-gray-500 mb-6">Manage your notification preferences</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates about your projects</p>
                          </div>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Marketing Emails</p>
                            <p className="text-sm text-gray-500">Receive tips and product updates</p>
                          </div>
                        </div>
                        <Switch 
                          checked={marketingEmails} 
                          onCheckedChange={setMarketingEmails}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

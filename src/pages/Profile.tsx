import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Settings, CreditCard, BarChart3, Bell, Shield, 
  ChevronLeft, Camera, Mail, Calendar, Sparkles, 
  Zap, Crown, CheckCircle2, ArrowRight, LogOut,
  Moon, Sun, Monitor, Loader2, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Failed to sign out");
    }
  };

  const handleSaveProfile = () => {
    console.log("Profile saved successfully!");
  };

  const generateAIAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { 
          prompt: `Professional avatar portrait for ${fullName}, modern minimal style, soft gradient background, clean professional look`,
          name: fullName 
        }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setAvatarUrl(data.imageUrl);
      }
    } catch (error) {
      console.error("Failed to generate avatar:", error);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-background dark:via-background dark:to-secondary/10 transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-border/30 transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-secondary">
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-foreground">Profile</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:flex" />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 sm:gap-8">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-white dark:bg-card rounded-3xl border border-gray-100 dark:border-border/30 p-6 shadow-sm">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="AI Generated Avatar" 
                    className="w-full h-full rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <button 
                  onClick={generateAIAvatar}
                  disabled={isGeneratingAvatar}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-card border border-gray-200 dark:border-border flex items-center justify-center shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  {isGeneratingAvatar ? (
                    <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 text-teal-600" />
                  )}
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-foreground text-center mb-1">{fullName}</h2>
              <p className="text-sm text-muted-foreground text-center mb-4">{user?.email || "user@example.com"}</p>
              
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-full border border-teal-200/50 dark:border-teal-800/50 mb-6">
                <Crown className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Free Plan</span>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary/50">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user?.email || "user@example.com"}</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary/50">
                  <Calendar className="w-4 h-4" />
                  <span>Joined January 2024</span>
                </div>
              </div>
              
              {/* Mobile Theme Toggle */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-border/30 sm:hidden">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
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
              <TabsList className="bg-white dark:bg-card border border-gray-100 dark:border-border/30 rounded-2xl p-1.5 mb-6 sm:mb-8 shadow-sm flex-wrap h-auto">
                <TabsTrigger 
                  value="account" 
                  className="rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  <User className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="subscription" 
                  className="rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  <CreditCard className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Subscription</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="usage" 
                  className="rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  <BarChart3 className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Usage</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences" 
                  className="rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  <Settings className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
              </TabsList>

              {/* Account Tab */}
              <TabsContent value="account">
                <div className="bg-white dark:bg-card rounded-3xl border border-gray-100 dark:border-border/30 p-6 sm:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-6">Account Information</h3>
                  
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-12 rounded-xl border-gray-200 dark:border-border focus:border-teal-500 focus:ring-teal-500/20 bg-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="h-12 rounded-xl border-gray-200 dark:border-border bg-gray-50 dark:bg-secondary/50"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-border/30">
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
                  <div className="bg-white dark:bg-card rounded-3xl border border-gray-100 dark:border-border/30 p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-2">Current Plan</h3>
                    <p className="text-muted-foreground mb-6">Choose the plan that works best for you</p>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {subscriptionPlans.map((plan, index) => (
                        <motion.div
                          key={plan.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative p-5 sm:p-6 rounded-2xl border-2 transition-all ${
                            plan.current 
                              ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30' 
                              : 'border-gray-100 dark:border-border/30 hover:border-gray-200 dark:hover:border-border bg-white dark:bg-card'
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
                          
                          <h4 className="text-lg font-bold text-foreground">{plan.name}</h4>
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                            <span className="text-muted-foreground">{plan.period}</span>
                          </div>
                          
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          
                          <Button
                            variant={plan.current ? "outline" : "default"}
                            className={`w-full rounded-xl ${
                              plan.current 
                                ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
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
                <div className="bg-white dark:bg-card rounded-3xl border border-gray-100 dark:border-border/30 p-6 sm:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-2">Usage Analytics</h3>
                  <p className="text-muted-foreground mb-6">Track your creative production this month</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {usageStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 sm:p-6 bg-gradient-to-br from-gray-50 to-white dark:from-secondary/30 dark:to-card rounded-2xl border border-gray-100 dark:border-border/30"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-2xl font-bold text-foreground">
                            {stat.value}<span className="text-sm text-muted-foreground">/{stat.max}{stat.unit || ''}</span>
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{stat.label}</p>
                        <div className="h-2 bg-gray-100 dark:bg-secondary rounded-full overflow-hidden">
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
                  <div className="bg-white dark:bg-card rounded-3xl border border-gray-100 dark:border-border/30 p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-2">Appearance</h3>
                    <p className="text-muted-foreground mb-6">Customize how the app looks</p>
                    
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      {[
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'system', label: 'System', icon: Monitor },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id as typeof theme)}
                          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all ${
                            theme === option.id 
                              ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30' 
                              : 'border-gray-100 dark:border-border/30 hover:border-gray-200 dark:hover:border-border'
                          }`}
                        >
                          <option.icon className={`w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-2 ${
                            theme === option.id ? 'text-teal-600 dark:text-teal-400' : 'text-muted-foreground'
                          }`} />
                          <span className={`text-xs sm:text-sm font-medium ${
                            theme === option.id ? 'text-teal-600 dark:text-teal-400' : 'text-muted-foreground'
                          }`}>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-white dark:bg-card rounded-3xl border border-gray-100 dark:border-border/30 p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-2">Notifications</h3>
                    <p className="text-muted-foreground mb-6">Manage your notification preferences</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates about your projects</p>
                          </div>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Marketing Emails</p>
                            <p className="text-sm text-muted-foreground">Receive tips and product updates</p>
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
    </PageTransition>
  );
};

export default Profile;

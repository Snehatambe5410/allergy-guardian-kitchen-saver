
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, LogIn, UserPlus, Mail, Key, Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("signin");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split("@")[0],
          },
        },
      });

      if (error) throw error;

      setSuccess(true);
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      
      // If no verification is required, we can redirect to home
      if (data.user && !data.user.identities?.some(i => i.provider === 'email' && !i.identity_data?.email_verified)) {
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during signup");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setSuccess(true);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      navigate("/");
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                Allergy Guard & Kitchen Saver
              </CardTitle>
              <CardDescription className="text-lg">
                Your family's food safety companion
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 rounded-md overflow-hidden">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 flex gap-2 items-center justify-center"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 flex gap-2 items-center justify-center"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <motion.form 
                  onSubmit={handleSignIn}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive" className="animate-shake">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription>Login successful! Redirecting you...</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        autoComplete="email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="flex items-center gap-2">
                        <Key className="h-4 w-4" /> Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                          required
                          autoComplete="current-password"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full group hover:shadow-md transition-all font-medium text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse">Signing In</span>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Sign In
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </motion.form>
              </TabsContent>
              
              <TabsContent value="signup">
                <motion.form 
                  onSubmit={handleSignUp}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive" className="animate-shake">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription>Account created successfully! Check your email for verification.</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        autoComplete="email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="flex items-center gap-2">
                        <Key className="h-4 w-4" /> Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                          minLength={6}
                          required
                          autoComplete="new-password"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full group hover:shadow-md transition-all font-medium text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse">Creating Account</span>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Create Account
                          <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </motion.form>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-600">
          <p>Protect your family from food allergies and save on groceries.</p>
          <p className="mt-2 text-xs text-gray-500">© {new Date().getFullYear()} Allergy Guard & Kitchen Saver</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { SignInForm } from "./SignIn";
import { CreateAccountForm } from "./CreateAccountForm";
import { WelcomePanel } from "./WelcomePanel";

interface LoginFormProps {
  onLogin: (userData: { name: string; role: string }) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  return (
    <div className="min-h-screen bg-government-secondary flex">
      <WelcomePanel />

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-[500px] p-12 bg-white flex items-center justify-center"
      >
        <Card className="w-full border-0 shadow-none">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="create">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <CardContent className="p-0">
                <SignInForm onLogin={onLogin} />
              </CardContent>
            </TabsContent>

            <TabsContent value="create">
              <CardContent className="p-0">
                <CreateAccountForm onLogin={onLogin} />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};
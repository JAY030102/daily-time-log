import { useState, useEffect } from "react";
import { Download, CheckCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 pb-24">
      <Card className="max-w-sm w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-heading font-bold text-foreground">Install DTR App</h1>
            <p className="text-sm text-muted-foreground">
              Install this app on your phone for quick access and offline use.
            </p>
          </div>

          {isInstalled ? (
            <div className="flex items-center justify-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">App is installed!</span>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} className="w-full gap-2">
              <Download className="w-4 h-4" />
              Install Now
            </Button>
          ) : (
            <div className="space-y-3 text-left text-sm text-muted-foreground">
              <p className="font-medium text-foreground text-center">How to install:</p>
              <div className="space-y-2">
                <p>📱 <strong>Android (Chrome):</strong> Tap the menu (⋮) → "Add to Home screen"</p>
                <p>🍎 <strong>iPhone (Safari):</strong> Tap Share → "Add to Home Screen"</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallPage;

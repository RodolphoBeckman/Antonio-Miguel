import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function FeatureCard({ title, description, icon: Icon, children }: FeatureCardProps) {
  return (
    <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-4 bg-secondary/50 p-6">
        <div className="bg-primary text-primary-foreground p-3 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <CardTitle className="text-2xl font-headline">{title}</CardTitle>
          <CardDescription className="text-base mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}

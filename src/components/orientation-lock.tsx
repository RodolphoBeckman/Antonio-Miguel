import { RotateCw } from 'lucide-react';

export function OrientationLock() {
  return (
    <div className="fixed inset-0 z-[1000] flex-col items-center justify-center bg-background text-foreground hidden portrait:flex md:hidden">
      <div className="text-center p-8">
        <RotateCw className="w-16 h-16 mx-auto mb-6 animate-spin-slow text-primary" />
        <h2 className="text-2xl font-bold mb-2">Por favor, gire seu dispositivo</h2>
        <p className="text-lg text-muted-foreground">
          Este aplicativo foi desenhado para ser usado na posição horizontal.
        </p>
      </div>
    </div>
  );
}

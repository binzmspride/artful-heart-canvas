
import HeartCanvas from "@/components/HeartCanvas";
import FloatingHearts from "@/components/FloatingHearts";
import Header from "@/components/Header";
import { Heart, HeartPulse } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-love-pink/10 flex flex-col">
      <FloatingHearts />
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <HeartCanvas />
      </main>
      
      <footer className="py-6 text-center text-love-rose bg-white/70 border-t border-love-pink">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="h-4 w-4 fill-love-rose" />
          <p className="text-sm">Tạo trái tim nghệ thuật để tỏ tình với người yêu</p>
          <HeartPulse className="h-4 w-4 fill-love-rose" />
        </div>
      </footer>
    </div>
  );
};

export default Index;

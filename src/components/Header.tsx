
import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="py-6 px-4 bg-gradient-to-r from-love-pink to-love-rose text-white text-center relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="h-6 w-6 fill-white" />
          <h1 className="text-2xl md:text-3xl font-bold">Trang Vẽ Trái Tim</h1>
          <Heart className="h-6 w-6 fill-white" />
        </div>
        <p className="max-w-xl mx-auto opacity-90">
          Hãy vẽ một trái tim đặc biệt để gửi đến người bạn yêu thương
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
      </div>
    </header>
  );
};

export default Header;

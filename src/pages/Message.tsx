
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, HeartHandshake } from "lucide-react";
import { toast } from "sonner";

const LoveMessages = [
  "Anh/Em là ánh nắng trong cuộc sống của tôi!",
  "Tôi yêu em/anh từ lần đầu tiên gặp mặt",
  "Mỗi giây phút bên em/anh là khoảnh khắc quý giá",
  "Tình yêu của tôi dành cho em/anh mãi mãi không thay đổi",
  "Em/Anh là điều tuyệt vời nhất đã đến với cuộc đời tôi",
  "Trái tim tôi thuộc về em/anh, mãi mãi"
];

const Message = () => {
  const [message, setMessage] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  
  const handleSelectMessage = (msg: string) => {
    setMessage(msg);
    toast.success("Đã chọn lời nhắn!");
  };
  
  const handleCopyMessage = () => {
    if (message) {
      navigator.clipboard.writeText(message);
      toast.success("Đã sao chép lời nhắn!");
    } else {
      toast.error("Vui lòng chọn hoặc nhập lời nhắn trước!");
    }
  };
  
  const handleRevealSecret = () => {
    setShowSecret(true);
    toast("Đã mở lời nhắn bí mật! ❤️", {
      icon: <Heart className="h-5 w-5 fill-love-red" />
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-love-pink/20 flex flex-col">
      <header className="py-6 px-4 bg-gradient-to-r from-love-purple to-love-rose text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <HeartHandshake className="h-6 w-6" />
          <h1 className="text-2xl md:text-3xl font-bold">Lời Nhắn Yêu Thương</h1>
          <HeartHandshake className="h-6 w-6" />
        </div>
      </header>
      
      <main className="flex-grow px-4 py-8 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-xl p-6 border border-love-pink">
          <h2 className="text-xl font-semibold mb-4 text-love-rose">Chọn lời nhắn tình yêu:</h2>
          
          <div className="grid gap-3 mb-6">
            {LoveMessages.map((msg, index) => (
              <div 
                key={index}
                className="p-3 rounded-md border border-love-pink bg-love-pink/10 cursor-pointer hover:bg-love-pink/20 transition-colors"
                onClick={() => handleSelectMessage(msg)}
              >
                {msg}
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">Hoặc viết lời nhắn riêng của bạn:</label>
            <textarea 
              className="w-full p-3 border border-love-pink rounded-md min-h-24 focus:outline-none focus:ring-2 focus:ring-love-purple"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Viết lời nhắn yêu thương của bạn ở đây..."
            />
          </div>
          
          <div className="flex gap-3 justify-center mb-6">
            <Button onClick={handleCopyMessage} className="bg-love-purple hover:bg-love-purple/80">
              Sao chép lời nhắn
            </Button>
            <Link to="/">
              <Button variant="outline">
                Quay lại vẽ trái tim
              </Button>
            </Link>
          </div>
          
          <div className="text-center pt-4 border-t border-dashed border-love-pink">
            {!showSecret ? (
              <Button variant="ghost" onClick={handleRevealSecret} className="text-love-rose">
                <Heart className="h-4 w-4 mr-2 fill-love-red" /> Mở lời nhắn bí mật
              </Button>
            ) : (
              <div className="animate-fade-in p-4 bg-love-pink/10 rounded-lg">
                <p className="text-love-red font-medium italic">
                  "Tình yêu không phải là nhìn nhau mà là cùng nhau nhìn về một hướng." - Antoine de Saint-Exupéry
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-love-rose bg-white/70 border-t border-love-pink">
        <p className="text-sm">Gửi yêu thương đến người thương của bạn ❤️</p>
      </footer>
    </div>
  );
};

export default Message;

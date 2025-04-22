import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Download, Trash2, Send, MessageSquareHeart } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    fabric: any;
  }
}

type BrushType = "pencil" | "pattern" | "heart";

const HeartCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any | null>(null);
  const [activeColor, setActiveColor] = useState("#ea384c");
  const [brushSize, setBrushSize] = useState(5);
  const [activeBrush, setActiveBrush] = useState<BrushType>("pencil");
  const [message, setMessage] = useState("");
  const [fabricLoaded, setFabricLoaded] = useState(false);

  const colors = [
    { color: "#ea384c", name: "Đỏ" },
    { color: "#FF5C8A", name: "Hồng đậm" },
    { color: "#FFDEE2", name: "Hồng nhạt" },
    { color: "#9b87f5", name: "Tím" },
    { color: "#333333", name: "Đen" },
    { color: "#ffffff", name: "Trắng" },
  ];

  useEffect(() => {
    if (typeof window.fabric !== 'undefined') {
      setFabricLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js';
    script.async = true;
    script.onload = () => setFabricLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!fabricLoaded || !canvasRef.current) return;

    const canvas = new window.fabric.Canvas(canvasRef.current, {
      width: Math.min(window.innerWidth - 40, 800),
      height: Math.min(window.innerHeight - 250, 600),
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    const resizeCanvas = () => {
      if (canvas) {
        canvas.setDimensions({
          width: Math.min(window.innerWidth - 40, 800),
          height: Math.min(window.innerHeight - 250, 600),
        });
        canvas.renderAll();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    
    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = brushSize;

    setFabricCanvas(canvas);
    
    toast("Canvas đã sẵn sàng! Hãy bắt đầu vẽ trái tim!");

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.dispose();
    };
  }, [fabricLoaded]);

  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.isDrawingMode = true;
    
    // Update brush color and size
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
      
      // Set brush type
      if (activeBrush === "pencil") {
        fabricCanvas.freeDrawingBrush = new window.fabric.PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.color = activeColor;
        fabricCanvas.freeDrawingBrush.width = brushSize;
      } 
      else if (activeBrush === "pattern") {
        try {
          const patternBrush = new window.fabric.PatternBrush(fabricCanvas);
          
          const heartPattern = new Image();
          heartPattern.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(activeColor)}' stroke='${encodeURIComponent(activeColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'%3E%3C/path%3E%3C/svg%3E`;
          
          heartPattern.onload = function() {
            const patternCanvas = document.createElement('canvas');
            patternCanvas.width = 20;
            patternCanvas.height = 20;
            const patternCtx = patternCanvas.getContext('2d');
            if (patternCtx) {
              patternCtx.drawImage(heartPattern, 0, 0, 20, 20);
              patternBrush.source = patternCanvas;
            }
            fabricCanvas.freeDrawingBrush = patternBrush;
            fabricCanvas.freeDrawingBrush.width = brushSize * 2;
          };
        } catch (error) {
          toast.error("Kiểu bút này không khả dụng");
          setActiveBrush("pencil");
        }
      }
      else if (activeBrush === "heart") {
        // Keep pencil brush but draw hearts on mouse click
        fabricCanvas.freeDrawingBrush = new window.fabric.PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.color = activeColor;
        fabricCanvas.freeDrawingBrush.width = brushSize;
        
        // Remove existing event listeners
        fabricCanvas.off('mouse:down');
        
        fabricCanvas.on('mouse:down', function(options: any) {
          const pointer = fabricCanvas.getPointer(options.e);
          const heartPath = new window.fabric.Path("M12,21.35L10.55,20.03C5.4,15.36,2,12.27,2,8.5C2,5.41,4.42,3,7.5,3C9.24,3,10.91,3.81,12,5.08C13.09,3.81,14.76,3,16.5,3C19.58,3,22,5.41,22,8.5C22,12.27,18.6,15.36,13.45,20.03L12,21.35Z", {
            fill: activeColor,
            stroke: activeColor,
            left: pointer.x - brushSize * 2,
            top: pointer.y - brushSize * 2,
            scaleX: brushSize / 5,
            scaleY: brushSize / 5,
          });
          fabricCanvas.add(heartPath);
        });
      }
    }
  }, [activeBrush, activeColor, brushSize]);

  const handleColorChange = (color: string) => {
    setActiveColor(color);
  };

  const handleBrushTypeChange = (type: BrushType) => {
    if (fabricCanvas) {
      // Remove previous event listener if using heart brush
      if (activeBrush === "heart") {
        fabricCanvas.off('mouse:down');
      }
      
      setActiveBrush(type);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast("Canvas đã được làm mới!");
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = 'trai-tim-to-tinh.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("Đã lưu trái tim của bạn!");
  };

  const handleShare = () => {
    if (!fabricCanvas) return;
    
    try {
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
      
      // Trong thực tế, bạn sẽ gửi dataURL lên server
      // Ở đây tôi chỉ giả lập việc chia sẻ
      
      toast.success("Đã chia sẻ trái tim thành công! " + (message ? `Với lời nhắn: "${message}"` : ""));
      setMessage("");
    } catch (error) {
      toast.error("Không thể chia sẻ. Hãy thử lại sau.");
    }
  };

  const addHeartToCanvas = () => {
    if (!fabricCanvas) return;
    
    const centerX = fabricCanvas.width! / 2;
    const centerY = fabricCanvas.height! / 2;
    
    const heartPath = new window.fabric.Path("M12,21.35L10.55,20.03C5.4,15.36,2,12.27,2,8.5C2,5.41,4.42,3,7.5,3C9.24,3,10.91,3.81,12,5.08C13.09,3.81,14.76,3,16.5,3C19.58,3,22,5.41,22,8.5C22,12.27,18.6,15.36,13.45,20.03L12,21.35Z", {
      fill: activeColor,
      stroke: activeColor,
      left: centerX - 50,
      top: centerY - 50,
      scaleX: 10,
      scaleY: 10,
    });
    
    fabricCanvas.add(heartPath);
    toast("Đã thêm hình trái tim!");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="bg-love-pink/30 rounded-lg p-4 shadow-xl">
        <div className="flex gap-4 items-center mb-4 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="brush-size" className="font-medium">Kích thước:</Label>
            <Slider
              id="brush-size"
              className="w-24"
              value={[brushSize]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value) => setBrushSize(value[0])}
            />
            <span className="text-sm">{brushSize}</span>
          </div>
          
          <div>
            <Select value={activeBrush} onValueChange={(value) => handleBrushTypeChange(value as BrushType)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Kiểu vẽ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pencil">Bút vẽ</SelectItem>
                <SelectItem value="pattern">Họa tiết tim</SelectItem>
                <SelectItem value="heart">Vẽ tim</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" onClick={addHeartToCanvas}>
            <Heart className="h-4 w-4 fill-love-red" />
          </Button>
        </div>
        
        <div className="flex gap-2 mb-4 flex-wrap justify-center">
          {colors.map((color) => (
            <button
              key={color.color}
              className={`w-8 h-8 rounded-full transition-transform ${
                activeColor === color.color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
              }`}
              style={{ backgroundColor: color.color, border: color.color === '#ffffff' ? '1px solid #ddd' : 'none' }}
              onClick={() => handleColorChange(color.color)}
              title={color.name}
            />
          ))}
        </div>
        
        <div className="flex gap-2 mb-4 justify-center flex-wrap">
          <Button variant="destructive" onClick={handleClear} className="gap-1">
            <Trash2 className="h-4 w-4" /> Xóa
          </Button>
          <Button variant="secondary" onClick={handleDownload} className="gap-1">
            <Download className="h-4 w-4" /> Lưu
          </Button>
          <Button variant="default" onClick={handleShare} className="gap-1 bg-love-purple hover:bg-love-purple/80">
            <Send className="h-4 w-4" /> Chia sẻ
          </Button>
          <Button variant="outline" className="gap-1" onClick={() => window.location.href = '/message'}>
            <MessageSquareHeart className="h-4 w-4" /> Lời nhắn
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Label htmlFor="message" className="whitespace-nowrap">Lời nhắn:</Label>
          <input
            id="message"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Viết lời nhắn ngọt ngào..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border border-love-pink rounded-lg shadow-xl overflow-hidden mx-auto bg-white">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
    </div>
  );
};

export default HeartCanvas;

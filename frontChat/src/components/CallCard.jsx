import {
  PhoneCall,
  Video,
  ArrowDown,
  ArrowUp,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

// دالة بسيطة ترجع الإيموجي حسب اسم المستخدم
function getEmoji(name) {
  if (name.toLowerCase().includes("fox")) return "🦊";
  if (name.toLowerCase().includes("bear")) return "🐻";
  if (name.toLowerCase().includes("cat")) return "🐱";
  if (name.toLowerCase().includes("dog")) return "🐶";
  if (name.toLowerCase().includes("bunny")) return "🐰";
  return "👤"; // افتراضي
}

export default function CallCard({ call }) {
  return (
    <Card className="rounded-2xl shadow-xl p-4 transition-colors bg-white dark:bg-[#183642] hover:bg-gray-100 dark:hover:bg-[#1797A6]">
      <CardContent className="flex items-center space-x-4">
        {/* الإيموجي بدل الصورة */}
        <div className="w-12 h-12 flex items-center justify-center text-2xl rounded-full bg-gray-200 dark:bg-[#2a4e5a] shadow-sm">
          {getEmoji(call.name)}
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold font-[Quicksand] text-gray-800 dark:text-[#1797A6]">
            {call.name}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-[#F3F6F9]">
            {call.type === "voice" ? <PhoneCall size={16} /> : <Video size={16} />}
            {call.direction === "incoming" ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
            <span>{call.timestamp}</span>
          </div>
        </div>

        <div>
          {call.status === "missed" && <XCircle className="text-red-500" size={20} />}
          {call.status === "received" && <CheckCircle className="text-green-500" size={20} />}
          {call.status === "declined" && <XCircle className="text-yellow-500" size={20} />}
        </div>
      </CardContent>
    </Card>
  );
}

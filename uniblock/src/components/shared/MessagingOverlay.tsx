"use client";

import { useState } from "react";
import { MessageCircle, X, Plus, Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MessagingOverlay() {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");

  const RECIPIENTS = [
    { id: "1", name: "Yazılım Kulübü", type: "KULÜP" },
    { id: "2", name: "Robotik Kulübü", type: "KULÜP" },
    { id: "3", name: "UniBlock Core Team", type: "TAKIM" },
    { id: "4", name: "Girişimcilik Kulübü", type: "KULÜP" },
  ];

  const MOCK_CHATS = [
    { id: "1", name: "Yazılım Kulübü", lastMsg: "Katılma isteğin onaylandı! Hoş geldin.", time: "12:30", unread: false },
    { id: "2", name: "Design Community", lastMsg: "Yarınki meetup'ta seni de aramızda görmek isteriz.", time: "DÜN", unread: false },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isMessagesOpen && (
        <div className="w-[350px] h-[500px] bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4 flex flex-col animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center border-b-2 border-black">
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-extrabold tracking-widest uppercase text-sm">
                {isNewMessageOpen ? "Yeni Mesaj" : "Mesajlar"}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {!isNewMessageOpen && (
                <button 
                  onClick={() => setIsNewMessageOpen(true)}
                  className="p-1 hover:bg-accent transition-colors text-white"
                >
                  <Plus size={18} />
                </button>
              )}
              <button onClick={() => { setIsMessagesOpen(false); setIsNewMessageOpen(false); }} className="hover:text-accent transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-gray-50">
            {isNewMessageOpen ? (
              <div className="p-6 flex flex-col h-full bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Alıcı Seçin</p>
                <Select onValueChange={(val: any) => setSelectedRecipient(val || "")}>
                  <SelectTrigger className="rounded-none border-2 border-black h-12 focus:ring-accent">
                    <SelectValue placeholder="Kulüp veya Takım Seçin" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-black">
                    {RECIPIENTS.map(r => (
                      <SelectItem key={r.id} value={r.id} className="text-xs font-bold py-3">
                        <span className="flex justify-between w-full gap-10">
                          {r.name}
                          <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 border border-gray-200">{r.type}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-8 flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Mesajınız</p>
                  <textarea 
                    placeholder="Mesajınızı buraya yazın..."
                    className="w-full h-32 border-2 border-black p-4 text-sm focus:outline-none focus:border-accent resize-none rounded-none"
                  />
                </div>

                <div className="mt-auto pt-6 flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsNewMessageOpen(false)}
                    className="flex-1 rounded-none border-2 border-black hover:bg-gray-100 font-bold uppercase text-[10px] tracking-widest"
                  >
                    Vazgeç
                  </Button>
                  <Button 
                    disabled={!selectedRecipient}
                    className="flex-1 rounded-none bg-accent text-white hover:bg-black font-bold uppercase text-[10px] tracking-widest border-2 border-accent hover:border-black"
                  >
                    Gönder <Send size={14} className="ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="divide-y-2 divide-gray-100">
                {MOCK_CHATS.map(chat => (
                  <div key={chat.id} className="p-5 hover:bg-white transition-colors cursor-pointer group flex items-center justify-between border-l-4 border-transparent hover:border-accent bg-gray-50/50">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs group-hover:text-accent transition-colors">{chat.name}</span>
                        <span className="text-[9px] text-gray-400 font-bold">{chat.time}</span>
                      </div>
                      <p className="text-[12px] text-gray-500 line-clamp-1">{chat.lastMsg}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-accent ml-4" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsMessagesOpen(!isMessagesOpen)}
        className="w-14 h-14 bg-accent text-white flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
      >
        {isMessagesOpen ? (
          <X size={24} className="group-hover:scale-110 transition-transform" />
        ) : (
          <div className="relative">
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-accent">
              2
            </span>
          </div>
        )}
      </button>
    </div>
  );
}

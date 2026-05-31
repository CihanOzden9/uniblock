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
        <div className="w-[350px] h-[500px] bg-card rounded-xl border border-outline-variant shadow-ambient-lg mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-bold tracking-tight text-[15px]">
                {isNewMessageOpen ? "Yeni Mesaj" : "Mesajlar"}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {!isNewMessageOpen && (
                <button
                  onClick={() => setIsNewMessageOpen(true)}
                  className="p-1.5 rounded-full hover:bg-white/15 transition-colors text-white"
                >
                  <Plus size={18} />
                </button>
              )}
              <button onClick={() => { setIsMessagesOpen(false); setIsNewMessageOpen(false); }} className="p-1.5 rounded-full hover:bg-white/15 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-surface-container-low">
            {isNewMessageOpen ? (
              <div className="p-6 flex flex-col h-full bg-card">
                <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Alıcı Seçin</p>
                <Select onValueChange={(val: any) => setSelectedRecipient(val || "")}>
                  <SelectTrigger className="rounded-lg border border-input h-11">
                    <SelectValue placeholder="Kulüp veya Takım Seçin" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-outline-variant">
                    {RECIPIENTS.map(r => (
                      <SelectItem key={r.id} value={r.id} className="text-[13px] font-medium py-2.5">
                        <span className="flex justify-between w-full gap-10">
                          {r.name}
                          <span className="text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full">{r.type}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-6 flex-1">
                  <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Mesajınız</p>
                  <textarea
                    placeholder="Mesajınızı buraya yazın..."
                    className="w-full h-32 border border-input rounded-lg p-4 text-[14px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring resize-none"
                  />
                </div>

                <div className="mt-auto pt-5 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewMessageOpen(false)}
                    className="flex-1 rounded-full border-outline-variant text-[13px] font-semibold"
                  >
                    Vazgeç
                  </Button>
                  <Button
                    disabled={!selectedRecipient}
                    className="flex-1 rounded-full bg-accent text-white hover:bg-accent/90 text-[13px] font-semibold"
                  >
                    Gönder <Send size={14} className="ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant">
                {MOCK_CHATS.map(chat => (
                  <div key={chat.id} className="p-5 hover:bg-card transition-colors cursor-pointer group flex items-center justify-between border-l-2 border-transparent hover:border-primary">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-[14px] text-on-surface group-hover:text-primary transition-colors">{chat.name}</span>
                        <span className="text-[11px] text-on-surface-variant font-medium">{chat.time}</span>
                      </div>
                      <p className="text-[13px] text-on-surface-variant line-clamp-1">{chat.lastMsg}</p>
                    </div>
                    <ChevronRight size={14} className="text-on-surface-variant group-hover:text-primary ml-4" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsMessagesOpen(!isMessagesOpen)}
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-ambient-lg hover:bg-primary-container hover:-translate-y-0.5 transition-all group"
      >
        {isMessagesOpen ? (
          <X size={24} className="group-hover:scale-110 transition-transform" />
        ) : (
          <div className="relative">
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-card">
              2
            </span>
          </div>
        )}
      </button>
    </div>
  );
}


import React, { useState } from 'react';
import { Chat, Message } from '../types';
import { INITIAL_CHATS, CURRENT_USER } from '../constants';
import { Search, Send, Phone, Video, Info, MoreVertical, ChevronLeft } from 'lucide-react';

interface MessagingViewProps {
  onBack?: () => void;
}

const MessagingView: React.FC<MessagingViewProps> = ({ onBack }) => {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string>(INITIAL_CHATS[0].id);
  const [newMessage, setNewMessage] = useState('');

  const activeChat = chats.find(c => c.id === selectedChatId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msg: Message = {
      id: `m${Date.now()}`,
      senderId: CURRENT_USER.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = chats.map(c => {
      if (c.id === selectedChatId) {
        return {
          ...c,
          messages: [...c.messages, msg],
          lastMessage: newMessage
        };
      }
      return c;
    });

    setChats(updatedChats);
    setNewMessage('');
  };

  return (
    <div className="md:col-span-12 lg:col-span-9 h-full flex bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm transition-colors duration-300">
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-80 lg:w-72 xl:w-80 border-r border-slate-200 dark:border-white/10 flex flex-col h-full bg-slate-50 dark:bg-white/5">
        <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3 mb-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors border border-slate-200 dark:border-white/10"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
            )}
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Messages</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/10 border border-slate-200 dark:border-none rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChatId(chat.id)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
                selectedChatId === chat.id 
                ? 'bg-white dark:bg-white/10 border-blue-600 dark:border-blue-500' 
                : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <img src={chat.participant.avatar} className="w-12 h-12 rounded-xl object-cover" alt={chat.participant.name} />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className={`text-sm font-bold truncate ${selectedChatId === chat.id ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{chat.participant.name}</h3>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">10:35 AM</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden md:flex flex-1 flex-col h-full bg-slate-50 dark:bg-slate-900/50 relative">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <img src={activeChat.participant.avatar} className="w-10 h-10 rounded-xl object-cover shrink-0" alt={activeChat.participant.name} />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{activeChat.participant.name}</h3>
                  <p className="text-[10px] text-green-600 dark:text-green-500 font-bold">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-slate-400 mx-auto">
                <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Phone className="w-5 h-5" /></button>
                <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Video className="w-5 h-5" /></button>
                <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Info className="w-5 h-5" /></button>
                <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col scroll-smooth">
              {activeChat.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[70%] ${msg.senderId === CURRENT_USER.id ? 'ml-auto items-end' : 'items-start'}`}
                >
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.senderId === CURRENT_USER.id 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-white/10 text-slate-800 dark:text-white rounded-tl-none border border-slate-200 dark:border-transparent'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    {/* Add emoji or attachment icons here if desired */}
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-50 disabled:shadow-none shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-full mb-4">
              <Send className="w-12 h-12 text-slate-300 dark:text-white/20" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Your Messages</h3>
            <p className="text-sm max-w-xs mt-2 text-slate-500">Connect with founders, investors, and fellow builders. Select a conversation to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingView;

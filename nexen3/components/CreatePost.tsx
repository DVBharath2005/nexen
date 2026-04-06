
import React, { useState } from 'react';
import { Image, Send, Sparkles, Loader2 } from 'lucide-react';
import { refinePostText } from '../services/geminiService';
import { User } from '../types';

interface CreatePostProps {
  onPost: (content: string) => void;
  currentUser: User;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPost, currentUser }) => {
  const [content, setContent] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    if (!content.trim()) return;
    setIsRefining(true);
    const refined = await refinePostText(content);
    if (refined) {
      setContent(refined);
    }
    setIsRefining(false);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost(content);
    setContent('');
  };

  return (
    <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10 p-4 mb-6 shadow-sm transition-colors duration-300">
      <div className="flex gap-3 items-start">
        <img src={currentUser.avatar} className="w-10 h-10 rounded-lg shrink-0 object-cover" alt="Avatar" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 min-h-[100px] resize-none text-sm py-2"
          />
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"><Image className="w-5 h-5" /></button>
              <button onClick={handleRefine} disabled={isRefining || !content} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${content ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/30' : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500'}`}>{isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}Refine with AI</button>
            </div>
            <button onClick={handleSubmit} disabled={!content.trim()} className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${content.trim() ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-blue-900/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}>Post <Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

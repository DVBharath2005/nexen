import React, { useState } from 'react';
import { X, Rocket, Sparkles, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreatePitchProps {
  isOpen: boolean;
  onClose: () => void;
  onPitch: (title: string, description: string, category: string) => void;
}

const CreatePitch: React.FC<CreatePitchProps> = ({ isOpen, onClose, onPitch }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('SaaS');

  const categories = ['SaaS', 'AI', 'Fintech', 'EdTech', 'Hardware', 'Marketplace', 'DevTools', 'Web3'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onPitch(title, description, category);
      setTitle('');
      setDescription('');
      setCategory('SaaS');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-[#0f172a] rounded-[32px] shadow-2xl overflow-hidden border border-slate-800"
          >
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Pitch Your Idea</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Launch your next big thing</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Startup Name / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. EcoStream, NeuroScribe, PayFlow..."
                  className="w-full bg-slate-900 border-2 border-slate-800 focus:border-blue-600 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-slate-600 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                        category === cat
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-slate-900 text-slate-500 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  The Pitch (Elevator Statement)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your idea in 1-2 sentences. What problem are you solving?"
                  className="w-full bg-slate-900 border-2 border-slate-800 focus:border-blue-600 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-slate-600 transition-all outline-none min-h-[140px] resize-none"
                  required
                />
              </div>

              <div className="bg-blue-600/10 p-5 rounded-2xl flex gap-4 border border-blue-500/20">
                <Info className="w-6 h-6 text-blue-400 shrink-0" />
                <p className="text-xs text-blue-200 font-medium leading-relaxed">
                  Pitches are public. The community will vote on your idea. Top voted ideas get featured on the trending list and receive exclusive networking opportunities.
                </p>
              </div>

              <button
                type="submit"
                disabled={!title.trim() || !description.trim()}
                className="w-full bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
              >
                <Sparkles className="w-6 h-6" />
                Launch to Community
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePitch;

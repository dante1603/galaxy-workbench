import React, { useState } from 'react';
import { createWikiEntry, updateWikiEntry, WikiEntry } from '../../api/wiki';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  onClose: () => void;
  initialData?: WikiEntry | null;
}

const CreateGeneralEntryForm: React.FC<Props> = ({ onClose, initialData }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to save entries.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const entryData = {
        title,
        category,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      };

      if (initialData) {
        await updateWikiEntry(initialData.id, entryData);
      } else {
        await createWikiEntry(entryData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col h-full overflow-y-auto custom-scrollbar">
      {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
      
      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Title</label>
          <input 
            type="text" 
            required 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-accent-cyan outline-none"
            placeholder="e.g. Supermassive Black Holes"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
          <input 
            type="text" 
            required 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-accent-cyan outline-none"
            placeholder="e.g. Celestial Bodies"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tags (comma separated)</label>
          <input 
            type="text" 
            value={tags} 
            onChange={e => setTags(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-accent-cyan outline-none"
            placeholder="e.g. physics, space, danger"
          />
        </div>

        <div className="flex-1 flex flex-col min-h-[300px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Content (Markdown)</label>
          <textarea 
            required 
            value={content} 
            onChange={e => setContent(e.target.value)}
            className="w-full flex-1 bg-black/50 border border-white/10 rounded p-2 text-white focus:border-accent-cyan outline-none font-mono text-sm resize-none"
            placeholder="Write your entry content here using Markdown..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
        <button 
          type="button" 
          onClick={onClose}
          className="px-4 py-2 rounded text-slate-300 hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || !user}
          className="px-4 py-2 rounded bg-accent-cyan text-black font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
};

export default CreateGeneralEntryForm;

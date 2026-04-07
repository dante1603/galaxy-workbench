import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { WikiEntry, deleteWikiEntry } from '../../api/wiki';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  entry: WikiEntry;
  onEdit: (entry: WikiEntry) => void;
}

const GeneralWikiEntryCard: React.FC<Props> = ({ entry, onEdit }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = user?.uid === entry.authorId;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setIsDeleting(true);
      try {
        await deleteWikiEntry(entry.id);
      } catch (error) {
        console.error("Failed to delete entry:", error);
        alert("Failed to delete entry. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-black/40 border border-white/5 rounded-lg p-5 hover:border-white/10 transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{entry.title}</h3>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="bg-white/10 px-2 py-0.5 rounded text-accent-cyan">{entry.category}</span>
            <span>By {entry.authorName || 'Anonymous'}</span>
            {entry.createdAt && (
              <span>{format(entry.createdAt, 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
        
        {isOwner && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(entry)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Edit Entry"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
              title="Delete Entry"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="prose prose-invert prose-sm max-w-none mt-4 text-slate-300">
        <Markdown>{entry.content}</Markdown>
      </div>

      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
          {entry.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider text-slate-500 bg-black/50 px-2 py-1 rounded border border-white/5">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneralWikiEntryCard;

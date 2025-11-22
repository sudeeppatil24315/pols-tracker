import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import type { Vehicle } from '../types';

interface Note {
  id: string;
  vehicleId: string;
  message: string;
  timestamp: Date;
  dispatcher: string;
}

interface DispatcherNotesProps {
  vehicle: Vehicle;
  onAddNote: (vehicleId: string, note: string) => void;
}

export default function DispatcherNotes({ vehicle, onAddNote }: DispatcherNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      vehicleId: vehicle.id,
      message: noteText,
      timestamp: new Date(),
      dispatcher: 'Admin',
    };

    setNotes([newNote, ...notes]);
    onAddNote(vehicle.id, noteText);
    setNoteText('');
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition"
      >
        <div className="flex items-center space-x-2">
          <MessageSquare size={18} />
          <span className="font-semibold">Dispatcher Notes</span>
        </div>
        <span className="text-sm text-gray-400">{notes.length} notes</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {/* Add Note Form */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note (e.g., Flat tire - ETA 1hr)"
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-[#F9D71C] focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-[#F9D71C] hover:bg-[#e5c619] text-black p-2 rounded-lg transition"
            >
              <Send size={18} />
            </button>
          </form>

          {/* Notes List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-800 p-3 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-400">{note.dispatcher}</span>
                    <span className="text-xs text-gray-500">
                      {note.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-white">{note.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

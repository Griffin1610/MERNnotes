type SavedNote = {
    _id: string;
    title: string;
    subject: string;
    body: string;
};

type NotesListProps = {
    notes: SavedNote[];
    selectedNoteId: string | null;
    onSelectNote: (id: string) => void;
};

export default function NoteList({ notes, selectedNoteId, onSelectNote }: NotesListProps) {
    return (
        <div>
            {notes.map(note => (
                <div
                    key={note._id}
                    onClick={() => onSelectNote(note._id)}
                >
                    <h3>{note.title}</h3>
                    <p>{note.subject}</p>
                </div>
            ))}
        </div>
    );
}

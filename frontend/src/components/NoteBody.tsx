import { useEffect, useState } from "react";
import NoteList from "./NoteList";

type NoteContent = {
    title: string;
    subject: string;
    body: string;
};

type SavedNote = {
    _id: string;
    title: string;
    subject: string;
    body: string;
};

export default function NoteBody() {
    const [note, updateNote] = useState<NoteContent>({ title: "", subject: "", body: "" });
    const [notes, setNotes] = useState<SavedNote[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const selectedNote = notes.find((n) => n._id === selectedNoteId);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        updateNote((prev) => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        async function fetchNotes() {
            try {
                const response = await fetch("http://localhost:5000/notes");
                if (!response.ok) {
                    setError("Failed to fetch notes");
                    return;
                }
                const data = await response.json();
                setNotes(data);
            } catch (err) {
                setError("Backend server is not running. Please start the server on port 5000.");
                console.error("Error fetching notes:", err);
            }
        }
        fetchNotes();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const title = (form.elements.namedItem("title") as HTMLInputElement).value;
        const subject = (form.elements.namedItem("subject") as HTMLInputElement).value;
        const body = (form.elements.namedItem("body") as HTMLTextAreaElement).value;
        const payload = { title, subject, body };

        if (editingNoteId) {
            try {
                const response = await fetch(`http://localhost:5000/notes/${editingNoteId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    setError("Failed to update note");
                    return;
                }
                const updated: SavedNote = await response.json();
                setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
                updateNote({ title: "", subject: "", body: "" });
                setEditingNoteId(null);
            } catch (err) {
                console.error("Error updating note:", err);
            }
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                setError("Failed to save note");
                return;
            }
            const savedNote: SavedNote = await response.json();
            setNotes((prev) => [...prev, savedNote]);
            updateNote({ title: "", subject: "", body: "" });
        } catch (err) {
            setError("Backend server is not running. Please start the server on port 5000.");
            console.error("Error saving note:", err);
        }
    }

    function startEdit(n: SavedNote) {
        setEditingNoteId(n._id);
        updateNote({ title: n.title, subject: n.subject, body: n.body });
    }

    function cancelEdit() {
        setEditingNoteId(null);
        updateNote({ title: "", subject: "", body: "" });
    }

    async function handleDelete(noteToDelete: SavedNote) {
        if (!window.confirm(`Delete "${noteToDelete.title || "Untitled"}"?`)) return;
        try {
            await fetch(`http://localhost:5000/notes/${noteToDelete._id}`, { method: "DELETE" });
            setNotes((prev) => prev.filter((n) => n._id !== noteToDelete._id));
            if (selectedNoteId === noteToDelete._id) setSelectedNoteId(null);
            if (editingNoteId === noteToDelete._id) {
                setEditingNoteId(null);
                updateNote({ title: "", subject: "", body: "" });
            }
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    }

    return (
        <div style={{ display: "flex" }}>
            {error && <div>{error}</div>}
            <div>
                <form onSubmit={handleSubmit}>
                    <input name="title" placeholder="title" value={note.title} onChange={handleChange} />
                    <input name="subject" placeholder="subject" value={note.subject} onChange={handleChange} />
                    <textarea name="body" placeholder="body" value={note.body} onChange={handleChange} />
                    <button type="submit">{editingNoteId ? "Update" : "Submit"}</button>
                    {editingNoteId && <button type="button" onClick={cancelEdit}>Cancel</button>}
                </form>
                <NoteList notes={notes} selectedNoteId={selectedNoteId} onSelectNote={setSelectedNoteId} />
            </div>
            <div>
                {!selectedNote ? (
                    <p>Select a note</p>
                ) : (
                    <div>
                        <h3>{selectedNote.title || "Untitled"}</h3>
                        <p>{selectedNote.subject}</p>
                        <p>{selectedNote.body}</p>
                        <button type="button" onClick={() => startEdit(selectedNote)}>Edit</button>
                        <button type="button" onClick={() => handleDelete(selectedNote)}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}

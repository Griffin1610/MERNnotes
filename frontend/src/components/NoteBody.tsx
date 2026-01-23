import { useEffect, useState } from "react";

  type noteContent = {
        title: string,
        subject: string,
        body: string
    }

    type SavedNote = {
        _id: string;
        title: string;
        subject: string;
        body: string;
    };

export default function NoteBody() {

    const [note, updateNote] = useState<noteContent>({ title: "", subject: "", body: "" });
    const [notes, setNotes] = useState<SavedNote[]>([]);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
        const {name, value } = e.target;
        updateNote(prev => ({...prev, [name]: value }));
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

    async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:5000/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note),
            });
            if (!response.ok){
                setError("Failed to save note");
                return;
            }
            const savedNote: SavedNote = await response.json();
            setNotes(prev => [...prev, savedNote]);
            updateNote({title: "", subject: "", body: "" });
        } catch (err) {
            setError("Backend server is not running. Please start the server on port 5000.");
            console.error("Error saving note:", err);
        }
    }

    return (
        <div className="flex">
            {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input 
                    name="title" 
                    placeholder="title" 
                    value={note.title}
                    onChange={handleChange}
                />
                <input 
                    name="subject" 
                    placeholder="subject"
                    value={note.subject}
                    onChange={handleChange}
                />
                <input
                    name="body" 
                    placeholder="body"
                    value={note.body}
                    onChange={handleChange}
                />
                <button type="submit">Submit</button>
            </form>
            <div>
                {notes.map(note => (
                <div key={note._id}>
                    <h3>{note.title}</h3>
                    <p>{note.subject}</p>
                    <p>{note.body}</p>
                </div>
                ))}
            </div>
        </div>
    )
}
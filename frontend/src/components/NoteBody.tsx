import { useState } from "react";

export default function NoteBody() {

    type noteContent = {
        title: string,
        subject: string,
        body: string
    }

    const [note, updateNote] = useState<noteContent>({ title: "", subject: "", body: "" });
    const [error, setError] = useState<string | null>(null);

    function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
        const {name, value } = e.target;
        updateNote(prev => ({...prev, [name]: value }));
    }

    async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const response = await fetch("http://localhost:5000/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note),
        });
        if (!response.ok){
            setError("failed to save note");
        }
        const message = await response.text();
        console.log(message) //instead of a console.log, lets display that that the submit worked
        //put a stop to submit button unless note has changed
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                name="title" 
                placeholder="title" 
                onChange={handleChange}
            />
            <input 
                name="subject" 
                placeholder="subject"
                onChange={handleChange}
            />
            <input
                name="body" 
                placeholder="body"
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>
    )
}
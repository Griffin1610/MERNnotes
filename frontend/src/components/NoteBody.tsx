import { useState } from "react";

export default function NoteBody() {

    type noteContent = {
        title: string,
        subject: string,
        body: string
    }

    const [note, updateNote] = useState<noteContent>({ 
        title: "", 
        subject: "", 
        body: ""
    });

    function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
        const {name, value } = e.target;

        updateNote(prev => ({
        ...prev,
        [name]: value
    }));
  }

    return (
    <form>
        <input 
            title="notetitle" 
            placeholder="title" 
            onChange={handleChange}
        />
        <input 
            title="notesubject" 
            placeholder="subject"
            onChange={handleChange}
        />
        <input
            title="notebody" 
            placeholder="body"
            onChange={handleChange}
        />
        <button title = "submit" //onSubmit={} //going to send to db
            >Submit
        </button>
    </form>
    )
}
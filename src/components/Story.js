import { dbService } from "../fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const Story = ({ storyObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newStory, setNewStory] = useState(storyObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok) {
            console.log(storyObj.id);
            // const data = await dbService.doc(`story/${storyObj.id}`);
            // const data = doc(dbService, (`story/${storyObj.id}`)).delete();
            const data = deleteDoc(doc(dbService, "story", storyObj.id));
            console.log(data);
        }
    };

    const onChange = (event) => {
        const {
            target : { value },
        }= event;
        setNewStory(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, "story", storyObj.id), { text: newStory});
        setEditing(false);
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input onChange={onChange} value={newStory} required />
                        <input type="submit" value="update story" />
                    </form>
                    <button onClick={toggleEditing}>취소</button>
                </>
            ) : (
                <>
                    <h4>{storyObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>삭제</button>
                            <button onClick={toggleEditing}>수정</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Story;
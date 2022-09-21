import { dbService, storageService } from "../fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Story = ({ storyObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newStory, setNewStory] = useState(storyObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if(ok) {
            // const data = await dbService.doc(`story/${storyObj.id}`);
            // const data = doc(dbService, (`story/${storyObj.id}`)).delete();
            await deleteDoc(doc(dbService, "story", storyObj.id));
            if(storyObj.attachmentUrl !== "") {
                // await storageService.refFromURL(storyObj.attachmentUrl).delete();
                await deleteObject(ref(storageService, storyObj.attachmentUrl));
            }
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
        <div className="nweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input onChange={onChange} value={newStory} required placeholder="Edit your story" autoFocus className="formInput" />
                        <input type="submit" value="update story" className="formBtn" />
                    </form>
                    <button onClick={toggleEditing} className="formBtn cancelBtn">취소</button>
                </>
            ) : (
                <>
                    <h4>{storyObj.text}</h4>
                    {storyObj.attachmentUrl && (
                        <img src={storyObj.attachmentUrl} width="100px" height="100px" />
                    )}
                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDeleteClick}><FontAwesomeIcon icon={faTrash} /></span>
                            <span onClick={toggleEditing}><FontAwesomeIcon icon={faPencilAlt} /></span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Story;
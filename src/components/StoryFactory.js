import { dbService, storageService } from "fbase";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const StoryFactory = ({userObj}) => {
    const [story, setStory] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        if(story === "") return;

        let attachmentUrl = "";
        if (attachment !== "") {
            // const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const attachmentRef = ref(storageService,`${userObj.uid}/${uuidv4()}`);
            // const response = await attachmentRef.putString(attachment, "data_url");
            const response = await uploadString(attachmentRef, attachment, 'data_url');
            attachmentUrl = await getDownloadURL(response.ref);
        }

        // 이전버전 : await dbService.collection("story").add({
        //     text: story,
        //     createAt: Date.now(),
        // });
        await addDoc(collection(dbService, "story"), {
            text: story,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
          });
        setStory("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: { value },
        } = event;
        setStory(value);
    };

    const onFileChange = (event) => {
        // console.log(event.target.files);
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onload = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        if(Boolean(theFile)) {
            reader.readAsDataURL(theFile);
        };
    };

    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input" value={story} onChange={onChange} type="text" placeholder="무슨 생각중이야?" maxLength={120} />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input id="attach-file" type="file" accept="image/*" onChange={onFileChange} style={{opacity: 0,}} />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} style={{background: attachment}} />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default StoryFactory;
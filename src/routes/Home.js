import { dbService, storageService } from "fbase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Story from "components/Story";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Home = ({ userObj }) => {
    const [story, setStory] = useState("");
    const [storys, setStorys] = useState([]);
    const [attachment, setAttachment] = useState("");

    // 실시간 데이터 조회로 변경하기 위해 주석처리
    // const getStory = async () => {
    //     //const dbNweets = await dbService.collection("nweets").get(); 대신
    //     const dbStorys = await getDocs(collection(dbService, "story"));
    //     dbStorys.forEach((document) => {
    //         const storyObject = { ...document.data(), id: document.id };
    //         setStorys((prev) => [storyObject, ...prev])
    //     });
    // };

    useEffect(() => {
        // getStory();
        onSnapshot(collection(dbService, "story"), (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ... document.data(),        
            }));
            setStorys(newArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();

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
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    return (
        <>
            <form onSubmit={onSubmit}>
                <input value={story} onChange={onChange} type="text" placeholder="무슨 생각중이야?" maxLength={200} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Story" />
                {attachment && (
                <div>
                    <img src={attachment} width="100px" height="100px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
                )}
            </form>
            <div>
                {storys.map((story) => (
                    <Story key={story.id} storyObj={story} isOwner={story.creatorId === userObj.uid}/>
                ))}
            </div>
        </>
    );
};

export default Home;
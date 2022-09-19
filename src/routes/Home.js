import { dbService } from "fbase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Story from "components/Story";

const Home = ({ userObj }) => {
    const [story, setStory] = useState("");
    const [storys, setStorys] = useState([]);
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
        // await dbService.collection("story").add({
        //     text: story,
        //     createAt: Date.now(),
        // });
        await addDoc(collection(dbService, "story"), {
            text: story,
            createdAt: Date.now(),
            creatorId: userObj.uid,
          });
        setStory("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: {value},
        } = event;
        setStory(value);
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input value={story} onChange={onChange} type="text" placeholder="무슨 생각중이야?" maxLength={200} />
                <input type="submit" value="Story" />
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
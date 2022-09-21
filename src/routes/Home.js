import { dbService } from "fbase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import Story from "components/Story";


import StoryFactory from "components/StoryFactory";

const Home = ({ userObj }) => {
    
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
        onSnapshot(query(collection(dbService, "story"), orderBy("createdAt", "desc")), (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ... document.data(),        
            }));
            setStorys(newArray);
        });
    }, []);
    
    return (
        <div className="container">
            <StoryFactory userObj={userObj} />
            <div style={{marginTop: 30,}}>
                {storys.map((story) => (
                    <Story key={story.id} storyObj={story} isOwner={story.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;
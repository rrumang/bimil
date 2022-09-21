import { authService, dbService } from "fbase";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import {useHistory} from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        // 로그아웃 후 주소이동 방법 두번째 : react-router-dom의 useNavigate를 이용한 방법(첫번째 방법은 Router.js에서 사용)
        // v5
        // const history = useHistory();
        // history.push('/home');
        // history.replace('/home');
        
        // v6
        // const navigate = useNavigate();
        // navigate('/home');
        // navigate('/home', {replace: true});
        // history("/");
        history.push("/");
    };

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, { displayName: newDisplayName });
            refreshUser();
        }
    }

    //필터링관련  코드
    /*const getMyStorys = async () => {
        // 이전버전코드 const storys = await dbService.collection("story").where("creatorId", "==", userObj.uid).orderBy("createdAt", "asc").get();
        const storys = await getDocs(query(collection(dbService, "story"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "asc")));

        console.log(storys.docs.map((doc) => doc.data()));
    };

    useEffect(() => {
        getMyStorys();
    }, []);*/

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName} autoFocus className="formInput" />
                <input type="submit" value="update Profile" className="formBtn" style={{marginTop: 10,}} />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
        </div>
    );
};

export default Profile;
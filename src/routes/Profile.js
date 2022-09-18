import { authService } from "fbase";
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const history = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        // 로그아웃 후 주소이동 방법 두번째 : react-router-dom의 useNavigate를 이용한 방법
        // v5
        // const history = useHistory();
        // history.push('/home');
        // history.replace('/home');
        
        // v6
        // const navigate = useNavigate();
        // navigate('/home');
        // navigate('/home', {replace: true});
        history("/");
    };

    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;
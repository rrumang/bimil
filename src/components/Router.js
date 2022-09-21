import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                {isLoggedIn ? (
                    <>
                    <Route path="/" element={<Home userObj={userObj}/>} />
                    <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
                    </>
                ) : (
                    <Route path="/" element={<Auth />} />
                )}
                {/* 로그아웃 후 주소이동 방법 첫번째 : Navigate사용, 두번째 방법은 Profile.js에 사용 */}
                {/* <Navigate from="*" to="/" /> : V5 */}
                {/* <Route path="*" element={<Navigate to ="/" />}/> : V6 */}
            </Routes>
        </Router>
    );
};

export default AppRouter;
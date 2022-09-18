import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({isLoggedIn}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation />}
            <Routes>
                {isLoggedIn ? (
                    <>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    </>
                ) : (
                    <Route path="/" element={<Auth />} />
                )}
                {/* 로그아웃 후 주소이동 방법 첫번째 : Navigate사용, 두번째 방법은 Profile.js에 사용 */}
                {/* 잘못된 네비게이터 사용코드 : <Navigate from="*" to="/" /> */}
                {/* <Route path="*" element={<Navigate to ="/" />}/> */}
            </Routes>
        </Router>
    );
};

export default AppRouter;
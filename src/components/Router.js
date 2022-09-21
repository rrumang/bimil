import { HashRouter as Router, Routes, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Switch>
                {isLoggedIn ? (
                    <div style={{
                        maxWidth: 890,
                        width: "100%",
                        margin: "0 auto",
                        marginTop: 80,
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        <Route exact path="/"><Home userObj={userObj} /></Route>
                        <Route exact path="/profile"><Profile userObj={userObj} refreshUser={refreshUser} /></Route>
                    </div>
                ) : (
                    <Route exact path="/"><Auth /></Route>
                )}
                {/* 로그아웃 후 주소이동 방법 첫번째 : Navigate사용, 두번째 방법은 Profile.js에 사용 */}
                {/* <Navigate from="*" to="/" /> : V5 */}
                {/* <Route path="*" element={<Navigate to ="/" />}/> : V6 */}
            </Switch>
        </Router>
    );
};

export default AppRouter;
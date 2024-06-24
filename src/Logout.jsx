import { useEffect } from "react";

function Logout() {

    useEffect(() => {
        localStorage.removeItem("accessToken");
    }, []);

    return (
        <div>
            <h1>Logout</h1>
            <p>You logged out!</p>
        </div>
    );
}

export default Logout;
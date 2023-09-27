import Header from "../components/Header";
import Login from "../components/Login";
import configData from '../config.json';

export default function LoginPage() {
    return (
        <>
            <Header
                heading={configData.Login.Heading}
            />
            <Login />
        </>
    )
}
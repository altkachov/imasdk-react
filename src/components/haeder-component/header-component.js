import logo from "../../logo.svg";
import './header-component.css';
import {NavLink} from "react-router-dom";

export default  function HeaderComponent() {
    return <div className="App">
        <header className="App-header">
            <span>Example App</span>
            <img src={logo} className="App-logo" alt="logo"/>
            <div className={'navigation'}>
                <NavLink to={'/'}><span>Home</span></NavLink>
                <NavLink to={'/videos'}>Videos</NavLink>
                <a href={'https://github.com/altkachov/imasdk-react'} target={'_blank'}>Repository</a>
            </div>
            <div>

            </div>
        </header>
        <br />
    </div>
}

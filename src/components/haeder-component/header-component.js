import logo from "../../logo.svg";
import './header-component.css';
import {Link, NavLink} from "react-router-dom";

export default  function HeaderComponent() {
    return <div className="App">
        <header className="App-header">
            <span>Example App</span>
            <img src={logo} className="App-logo" alt="logo"/>
            <div className={'navigation'}>
                <NavLink className={'navlink'} to={'/'}><span>Home</span></NavLink>
                <NavLink className={'navlink'} to={'/videos'}>Videos</NavLink>
            </div>
        </header>
        <br />
    </div>
}

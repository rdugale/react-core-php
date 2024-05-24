import { Outlet, Link } from "react-router-dom";
function Header({ children }) {
  return (
    <>
      <nav id="main_menu">
        <ul>
         <Link to="/"><li>Dashboard</li></Link>
          <Link to="buysellstock"><li>Stock Buy/Sell</li></Link>
          <Link to="addstock"> <li>Add Stock</li></Link>
        </ul>
      </nav>
      {children}
      <Outlet />
    </>
  );
}

export default Header;
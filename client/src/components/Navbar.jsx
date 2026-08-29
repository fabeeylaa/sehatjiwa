function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        SehatJiwa
      </div>

      <div className="navbar-menu">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
      </div>

      <button className="navbar-button btn btn-primary">
        Login
      </button>
    </nav>
  );
}

export default Navbar;